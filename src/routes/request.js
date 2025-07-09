const express = require('express');
const requestRouter  = express.Router();

const {UserAuth}= require("../middleware/auth");
const ConnectionRequest = require("../model/connectionrequest");
const User = require("../model/user");
                              //UserAuth--will check whether the token is coming valid or not.whethe rthe Cokkie has the token or not, and the Token is valid.thn findout the information about the logged-in user.
requestRouter.post("/request/sent/:status/:toUserId" , UserAuth , async(req , res) =>{

try{
const fromUserId = req.user._id;   //fromuserId is the logined User--req.user is the loggedIn User comes from the userAuth.
const toUserId = req.params.toUserId;
const status = req.params.status;

//we should not allow this api for accepted or rejected or anyother, so need to validate the status.
const allowedStatus = ["ignored" , "interested"];
if(!allowedStatus.includes(status)){
    return res.status(400).json({message : "Invalid status type : " + status});
}

//we didt not make the check , whether the uerse we were sending the request connection is present in the database or not.
const toUser = await User.findById(toUserId);
if(!toUser){
    return res.status(404).json({message : " user is not found in the database !!"})
}




//eg -Akal is sending connection to messi-api should not allow to sent connection second time , and in reverse it should not alloed to make connection fron messi to Akal.
const existingConnectionRequest = await ConnectionRequest.findOne({   //when there is the millions of data , query will be slow, so writing the compound Index
    $or : [        //using OR logic
    {fromUserId , toUserId },    //again akal is sending request to messi
    {fromUserId : toUserId , toUserId : fromUserId},    //messi is sending requets to Akal
    ]
});

if(existingConnectionRequest){
    return res.status(400).send( {message : "Connection Request Already Exista! " });
}



const connectionRequest = new ConnectionRequest({   //creating the new instance of the connection Request.
    fromUserId,toUserId , status
});
const data = await connectionRequest.save()  //this will save in the database.
res.json({
    message : req.user.firstName+ "is " + status + "in " + toUserId.firstName,
    data,
});
}catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }

})
       
//CORNER CASE:
// Akal-->Murugar
// 1. Murugar should logged In ---touserId should be logged In.
//2.  onlu murugar should accedpt or rejected, no other can give thestatus
//3. we can accept or rejected , only the existing status should be interested.
//4.request Id sgould be valid.   
requestRouter.post("/request/review/:status/:requestId",UserAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,   //_id matches requestId (a specific request's ID),
        toUserId: loggedInUser._id,   //to user should br logged In user
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports=requestRouter;