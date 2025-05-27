const express = require('express');
const requestRouter  = express.Router();

const {UserAuth}= require("../middleware/auth");


requestRouter.post("/sentConnectionRequest" , UserAuth , (req , res) =>{
const user = req.user;

    console.log("Connection request has sent");
    res.send( user.firstName +" sent a conntion request");
})


module.exports=requestRouter;