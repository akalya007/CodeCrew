const express = require('express');
const profileRouter = express.Router();
const {UserAuth}= require("../middleware/auth");
const authRouter = require('./auth');
const {validateEditProfileData ,validateCurrentPassword}=require("../utils/validation");
const bcrypt = require("bcrypt");




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


})


profileRouter.patch("/profile/password", UserAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if both fields are provided
    if (!currentPassword || !newPassword) {
      throw new Error("Both current and new passwords are required.");
    }

    const loggedInUser  = req.user; // Comes from UserAuth- //This "user" will get me the user Details of the loggedIn User.
    // if(!validateCurrentPassword(loggedInUser, currentPassword)){
    if (!(await validateCurrentPassword(loggedInUser, currentPassword))) {
        throw new Error("Current password is incorrect.");
     }
    
    // Hash the password manually before saving
    const hashed = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashed;

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your password was updated successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports=profileRouter;