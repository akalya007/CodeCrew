
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
        res.status(400).send("There is the err" + err.message);
    }
  
});

//to get the user by their email.
app.get("/getuser" , async(req, res)=>{
        //first read from the request
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

//delete the userby ID
app.delete("/user" , async(req ,res)=>{
    const userId = req.body.userId;
    try{
        //const user = await User.findByIdAndDelete({ _id:userId}) 
     const user = await User.findByIdAndDelete(userId)   //it is te shorthand for ({_id : id})
    res.send("user Deleted successfully");
    }
   catch{
        res.status(400).send("something went wrong");
    }
})

//update the data of the user
app.patch("/user/:userId" , async(req , res)=>{    //it should not allow to update the random.
    //first read from the request
    const userId = req.params?.userId;
    const data=req.body;   //data contains everything inoside the body-
    console.log(data)

    try{
    const ALLOW_UPDATED =[         //checking each and every data is allowed to update or not.
        "userId","photoUrl" , "about" , "gender" , "age", "skills"];   //we should not allow every data to be changed.

     const isUpdateAllowed = Object.keys(data).every((k) =>       
            ALLOW_UPDATED.includes(k));
     if(!isUpdateAllowed){
                throw new Error("update not allowed ");
        }
        if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10");
        }
     const user= await User.findByIdAndUpdate({_id: userId} , data , {
        returnDocument : "before",
        runValidators: true,
    });   //it will ignore the userId in the data, because userId is not present in the schema.apat from the schema, it will be ignore.
   
    if(user.length ==0){
        res.status(404).send("User not found");
    }else{
       res.send("User updated successfully")
    }
    }catch(err){
        res.status(400).send("UPDATED FAILED : " + err.message);
    }
});

//updating the data by the reference(email).
app.patch("/userbyemail" ,async (req,res)=>{
    //first read the data.
    const email=req.body.emailId;
    const data=req.body;
   try{
       const user = await User.findOneAndUpdate({emailId:email} ,data);
   
    if(user.length ==0){
        res.status(404).send("User not found");
    }else{
       res.send("User updated successfully")
    }
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