const express = require('express');
const authRouter = express.Router();  // <== Call Router()


const User = require("../model/user");   //Model(schema)
const { ValidSignUpData } = require("../utils/validation");
const bcrypt=require("bcrypt");



authRouter.post("/signup" , async(req, res)=>{
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
    
      const savedUser = await user.save();   //most of the mongoose function returns promise. so use async and await.//Saves the user document into MongoDB.
      const token = await savedUser.getJWT();  // Generating JWT Token
      
      res.cookie("token" , token , {expires: new Date(Date.now() + 8*36000000 )}); //Setting Cookie with JWT,Cookies make it easier for the client to send the token automatically in future requests.
      res.json({message : "User Added Successfully!" , data: savedUser});
    }catch(err){
        res.status(400).send("There is the err :" + err.message);
    }
  
});


authRouter.post("/login" , async(req , res)=>{
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


  //Add the token to the cookie and sebd the response back to the user.
res.cookie("token" , token , {expires: new Date(Date.now() + 8*36000000 )});    //cookie is given by express.
// res.send("Login Successfully");
res.send(user);
}else{
    throw new Error("Invalid credentails")
}
    }catch(err){
        res.status(400).send("There is the err :" + err.message);
    }
}) 

//the user is hitting the logout api, it does matter that the user is login ot not, just set the cookie token to null.
authRouter.post("/logout" , async(req, res)=>{
    res.cookie("token" , null, {expires: new Date(Date.now())});
    res.send("Logout successfull!!!...");
})


module.exports=authRouter;

/**
 * userSchema.methods → -> lets you add custom functions to all documents (instances) created from the schema.
 */


//NOTE--😀
/**
 * . What’s the token?
 * =====================
This token is a JWT (JSON Web Token).

It contains encrypted data (like the user’s _id) that proves the user is authenticated.

The server can verify it without storing anything in memory (stateless authentication).

2. Why put it in a cookie?
==========================
If you just send the token in the login API response, the client (React app, browser) would have to store it manually — maybe in localStorage or sessionStorage.
But that comes with:

More manual handling in JavaScript.

Security issues (localStorage can be accessed by JS, making it vulnerable to XSS attacks).

Cookies, on the other hand:

Are automatically sent to the server with every HTTP request (GET, POST, etc.) to the same domain.

Work with res.cookie() in Express to store the token securely in the browser.

Can be made HttpOnly so JavaScript can’t read them (reducing XSS risks).

3. How it works in the next requests
=========================================
After login:

Server sends a Set-Cookie header with the JWT.

Browser stores that cookie.

On any API call to your server, the browser automatically attaches that cookie in the request headers.

Your server reads the cookie, verifies the JWT, and knows who the user is.

4. Why it’s better for authentication
=========================================
✅ No need for the client to attach token manually.
✅ No storing token in localStorage or sessionStorage.
✅ Possible to set secure flags (HttpOnly, Secure, SameSite).
✅ Works well with server-side rendering and APIs.
 */