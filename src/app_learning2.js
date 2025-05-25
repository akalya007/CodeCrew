
const express=require("express");
const app = express();
const connectDB = require("./config/database");   //for connecting the database.

const User = require("./model/user");   //Model(schema)
const { ValidSignUpData } = require("./utils/validation");
const bcrypt=require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {UserAuth}= require("./middleware/auth");


 app.use(express.json())  //this is the middleware , that convert the json object to the javasript object.(hence it is apply for all the routes).//without the middeware , it will be undefined.
app.use(cookieParser());   //to read the cookie



app.post("/signup" , async(req, res)=>{
    //1. const userObj = {
    //  firstName : "Akalya",
    //  lastName: "Dhanapal",
    //  emailId: "akalyadhanapal.com",
    //  password: "akalya@123"
    // }
     //to save the User into the mongodb database--need to create the new instance for the model.
    // const user = new User(userObj);
    //another way

   //the flow of the program should be , first validation of the data.
  //sometime we create the helper/utility fun to validate the data.
  try{
  ValidSignUpData(req);   //add it inside the try, if any error occurs,then catch block will catch it.

   const {firstName , lastName , emailId ,  password} = req.body;   //extracting the fields.

   //Encrpt the password.
   const passwordHash = await bcrypt.hash(password , 10); //it returns promise  //bcrypt.hash(plaintext , saltRounds)   // VERIFY NOTES--
   console.log(passwordHash);

   //then you store in the database
    //2.const user = new User(req.body);    //it is not allwoed to add that databse whatever in the req body.
    const user = new User({    //so we explicityly mention.
        firstName ,
         lastName ,
         emailId ,
         password : passwordHash,
    })
    
      await user.save();   //most of the mongoose function returns promise. so use async and await.
      res.send("User added successfully");
    }catch(err){
        res.status(400).send("There is the err :" + err.message);
    }
  
});

//login
app.post("/login" , async(req , res)=>{
 try{
const {emailId,password} = req.body;

 const user = await User.findOne({emailId: emailId})    //first enail should be verified before the password.
if(!user){          
    throw new Error("Invalid credentails ");
}     //if the email is present then check the password.

const isPasswordValid = await bcrypt.compare(password , user.password);
if(isPasswordValid){    //If it  is valid only, It will generate the token.
  
//create JWT token
 const token = await jwt.sign({_id: user._id} , "codecrew@123")   // jwt.sign({keep data that need to hidden} ,"secret key")--here we hiding the userId
 console.log(token);   //this token is also has the secret info about whuo is loged in . 

  //Add the token to the cookie abd sebd the response back to the user.
res.cookie("token" , token);    //cookie is given by express.
res.send("Login Successfully");
}else{
    throw new Error("Invalid credentails")
}
    }catch(err){
        res.status(400).send("There is the err :" + err.message);
    }
}) 


//to get the user by their email.
app.get("/getuser" , async(req, res)=>{
        //first read from the request
    const userEmail=req.body.emailId;
    try{
    const users=await User.find({emailId : userEmail});
    if(users.length == 0){
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

app.get("/profile", UserAuth, async(req,res)=>{
    try{
    const user = req.user;
    if(!user){
         throw new Error("User is not found");
    }
    res.send(user);
    }catch(err){
        res.status(400).send("ERROR" + err.message);
    }

})


//delete the userby ID
app.delete("/user" , async(req ,res)=>{
    const userId = req.body.userId; //first read from the request
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
    });   //it will ignore the userId in the data, because userId is not present in the schema.apart from the schema, it will be ignore.
   
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