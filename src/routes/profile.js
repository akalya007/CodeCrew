const express = require('express');
const profileRouter = express.Router();
const {UserAuth}= require("../middleware/auth");
const authRouter = require('./auth');
const {validateEditProfileData}=require("../utils/validation");



profileRouter.get("/profile/view", UserAuth, async(req,res)=>{
    try{
    const user = req.user;
    if(!user){
         throw new Error("User is not found");
    }
    res.send(user);
    }catch(err){
        res.status(400).send("ERROR" + err.message);
    }

});

profileRouter.patch("/profile/edit" ,UserAuth , async(req, res) =>{

try{
if(!validateEditProfileData(req)){
    throw new Error("Invalid Edit Request!!")
}
const loggedInUser = req.user;   //this req.user --is the thing that the "UserAuth" has.

Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
loggedInUser.save();

//res.send(`${loggedInUser.firstName} , You profile was Updated Successfull`);
res.json({message :`${loggedInUser.firstName} , You profile was Updated Successfull` , data : loggedInUser});


}catch(err){
        res.status(400).send("ERROR : " + err.message);
    }


} )

module.exports=profileRouter;