
const express=require("express");
const app = express();
const connectDB = require("./config/database");

const User = require("./model/user");
 app.use(express.json())  //this is the middleware , that convert the json object to the javasript object.(hence it is apply for all the routes).//without the middeware , it will be undefined.

app.post("/signup" , async(req, res)=>{
    // const userObj = {
    //  firstName : "Akalya",
    //  lastName: "Dhanapal",
    //  emailId: "akalyadhanapal.com",
    //  password: "akalya@123"
    // }
     //to save the User into the mongodb database--need to create the new instance for the model.
    // const user = new User(userObj);
    //another way
      
    const user = new User(req.body);
    try{
      await user.save();   //most of the mongoose function returns promise. so use async and await.
      res.send("User added successfully");
    }catch(err){
        res.status(400).send("There is the err" , + err.message);
    }
  
});

//to get the user by their email.
app.get("/getuser" , async(req, res)=>{
    const userEmail=req.body.emailId;
    try{
    const users=await User.find({emailId : userEmail});
    if(users.length === 0){
        res.status(404).send("User not found");
    }else{
   res.send(users);
    }
    }catch(err){
        res.send(400).send("something went wrong");
    }
});

//get all the user form the database
app.get("/feed" , async (req, res) =>{
    try{
      const users = await User.find({});
      res.send(users);
    }catch{
        res.status(400).send("something went wrong");
    }
})

connectDB()       //hence it is the promise, we were handling it.
.then(()=>{
    console.log("Database connection extablished......");
    app.listen(3000 , ()=>{
    console.log("Server is successfully listening on the port 3000...");
});
})
.catch((err)=>{
    console.log("Database cannot be connected!");
})