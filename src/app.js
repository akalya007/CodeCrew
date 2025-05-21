
const express=require("express");
const app = express();
const connectDB = require("./config/database");

const User = require("./model/user");
    
app.post("/signup" , async(req, res)=>{
    // const userObj = {
    //  firstName : "Akalya",
    //  lastName: "Dhanapal",
    //  emailID: "akalyadhanapal.com",
    //  password: "akalya@123"
    // }
    // //to save the User into the mongodb database--need to create the new instance for the model.
    // const user = new User(userObj);
    //another way
      
    const user = new User({
    firstName : "Virat",
     lastName: "Kholi",
     emailID: "ViratKholi.com",
     password: "Virat@123"
    });

    try{
      await user.save();   //most of the mongoose function returns promise. so use async and await.
      res.send("User added successfully");
    }catch(err){
        res.status(400).send("There is the err" , + err.message);
    }
  
});

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