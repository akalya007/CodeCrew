
//Building the proper API--for CodeCrew.

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

const isPasswordValid = await user.validatePassword(password)
if(isPasswordValid){    //If it  is valid only, It will generate the token.
  
//create JWT token
 ////const token = await jwt.sign({_id: user._id} , "codecrew@123" , { expiresIn: "1d"})   // jwt.sign({keep data that need to hidden} ,"secret key")--here we hiding the userId --good practice of using the helper functions.
 //console.log(token);   //this token is also has the secret info about whuo is loged in . 
const token = await user.getJWT();


  //Add the token to the cookie abd sebd the response back to the user.
res.cookie("token" , token , {expires: new Date(Date.now() + 8*36000000 )});    //cookie is given by express.
res.send("Login Successfully");
}else{
    throw new Error("Invalid credentails")
}
    }catch(err){
        res.status(400).send("There is the err :" + err.message);
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


app.post("/sentConnectionRequest" , UserAuth , (req , res) =>{
const user = req.user;

    console.log("Connection request has sent");
    res.send( user.firstName +" sent a conntion request");
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