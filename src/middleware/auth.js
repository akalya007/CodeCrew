// const adminAuth = (req , res , next)=>{
//     console.log("Admin auth is getting checked");
//     const token ="xyz";
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(401).res.send("Authorized request");
//     }else{
//         next();
//     }
// };

// const UserAuth = (req , res , next)=>{
//     console.log("User auth is getting checked");
//     const token ="xyz";
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(401).res.send("Authorized request");
//     }else{
//         next();
//     }
// };



const jwt = require("jsonwebtoken");
const User=require("../model/user");


//we have to give the authorization for every api that has been called,
const UserAuth =async  (req , res , next)=>{
 try{
//1.read the token from the cookies
const {token} = req.cookies;    //extracting the token from the cookies
if(!token){
    throw new Error("Token is not valid!!!!!!!")
}

//2.validate the token 
//const decodeObj = jwt.verify(token, process.env.JWT_SECRET);
const decodeObj = jwt.verify(token, "codecrew@123");

const {_id} = decodeObj;

  //3.find the user 
  const user = await User.findById(_id);
  if(!user){
    throw new Error("User not found");
  }
  req.user = user;   //This "user" will get me teh user Details of teh loggedIn User.
  next();    //if the token is valid, then the user is found , we just called next() 
}
catch(err){
    res.status(400).send("ERROR: " + err.message);
}  
}

module.exports={
    UserAuth
};
