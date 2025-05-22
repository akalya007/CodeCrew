
const express=require("express");
const app = express();
const connectDB = require("./config/database");

const User = require("./model/user");
 app.use(express.json())  //this is the middleware , that convert the json object to the javasript object.(hence it is apply for all the routes).//without the middeware , it will be undefined.

app.post("/signup" , async(req, res)=>{
    // const userObj = {
    //  firstName : "Akalya",
    //  lastName: "Dhanapal",
    //  emailID: "akalyadhanapal.com",
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