const express = require("express");
const userRouter = express.Router();  //It helps you group related routes together instead of keeping everything in app.js.

const {UserAuth}= require("../middleware/auth");  //Middleware UserAuth authenticates the request and sets req.user.
const ConnectionRequest = require("../model/connectionrequest");
const User = require("../model/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
          
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,    // requests sent *to me*
      status: "interested",       // only requests with "interested" status   //Result: all pending requests where someone showed interest in the logged-in user.
    }).populate("fromUserId", USER_SAFE_DATA); //Purpose of populate: replaces the fromUserId field (which is a MongoDB ObjectId reference) with the actual User document.
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message); // ✅ fixed `req.statusCode` to `res.status`
  }
});

//Finds all accepted connection requests where the logged-in user is either the sender or receiver.
userRouter.get("/user/connections", UserAuth, async (req, res) => {//UserAuth → Middleware that authenticates the user before the route executes. It usually attaches the logged-in user to req.user.
  try {
    const loggedInUser = req.user;
                                                                 
    const connectionRequests = await ConnectionRequest.find({
      $or: [  //or-->At least one condition must be true.//r ensures it returns all requests where I’m involved and status = accepted.
        { toUserId: loggedInUser._id, status: "accepted" },//I was the receiver of the request and I accepted.
        { fromUserId: loggedInUser._id, status: "accepted" },//I was the sender of the request and it was accepted.
      ],  //This finds all “accepted” connection requests involving me.
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
//After populate → both ends of the connection (sender and receiver) have user info instead of raw IDs.
    console.log(connectionRequests);             //So you get the full relationship objects, with both ends (me + them).

    //-Transforming the data             --Notes😀  the frontend usually doesn’t care about the relationship objecy👉 “Give me the list of people I’m connected to.”
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});


//find(...) → Finds all connection request documents.

// .populate(...) → Expands the fromUserId / toUserId IDs into full user profiles.

// .map(...) → Filters that data down to just "the other user I’m connected with".

//user should see all the suer except
//1. his own card , 
//2.his conncetion
//3.ignored people
//4.already sent the connection                 
userRouter.get("/feed", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;//We use this user’s ID for filtering who to show in the feed.
//3️⃣ Handle pagination (page & limit)
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //find all connection request ( sent + received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");  //We only select the IDs (fromUserId and toUserId) — no need to fetch full details.

    //besause, they are already in their...., whos i dont wnat to sent in the feed.
    const hideUsersFromFeed = new Set();     //set in the datastructure.We use a Set (instead of an array) because it automatically removes duplicates and gives faster lookups
    
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());   //Now the Set contains all people who i need to be ignored.
    });

    //Fetch users who are not in that Set
    const users = await User.find({
      $and: [                             // Exclude users whose IDs are in the hideUsersFromFeed list (not-in).
        { _id: { $nin: Array.from(hideUsersFromFeed) } },   //finding the ids , whose not present in the hidedUserFeed.--converting the set into Array.[nin--not-in the array.]
        { _id: { $ne: loggedInUser._id } },  //also dont want my own profile.[ne---not equalto]
      ],
    })
      .select(USER_SAFE_DATA)  //send only the safe data.
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports = userRouter;





//FOR CONNECTION--user/connection ----api
/**
 * What the query gives you

The query returns connection request documents, not just the other user.
Example result for loggedInUser = A:

[
  {
    "fromUserId": { "_id": "A", "firstName": "Alice" },
    "toUserId":   { "_id": "B", "firstName": "Bob" },
    "status": "accepted"
  },
  {
    "fromUserId": { "_id": "C", "firstName": "Charlie" },
    "toUserId":   { "_id": "A", "firstName": "Alice" },
    "status": "accepted"
  }
]


So you get the full relationship objects, with both ends (me + them).

🔹 Why we transform with .map(...)

But for a connections API, the frontend usually doesn’t care about the relationship object.
It just wants:
👉 “Give me the list of people I’m connected to.”

So we map it into a flat list of the other users only:

[
  { "_id": "B", "firstName": "Bob" },
  { "_id": "C", "firstName": "Charlie" }
]

🔹 Why not just query User directly?

You could, in theory, write a more complex query on the User collection (using $in on user IDs from connections) to skip the transformation step.

But:

Separation of concerns

ConnectionRequest stores the relationships.

User stores user profiles.

First, you ask ConnectionRequest: “Who am I connected to?”

Then you decide which part of that data you actually want.

Flexibility

Sometimes you may want the whole connection object (status, who sent it, when, etc.).

Sometimes you just want the user list.
By transforming, you control exactly what gets sent.

Performance with populate

populate already pulls in user documents.

So it’s cheap to just pick the “other person” instead of writing a second query to User.

✅ In short:
The query finds all accepted connection requests involving me.
The mapping transforms those requests into a clean list of only the other users → exactly what a "connections" API is supposed to return.
 */
