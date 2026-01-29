//this the connection  Schema between two User.
const mongoose = require('mongoose');

//defining the Schema

const connectionRequestSchema = new mongoose.Schema({
fromUserId :{
type : mongoose.Types.ObjectId,
ref: "User", // refernce to the user collection
required:true
},

toUserId :{
type : mongoose.Types.ObjectId,
  ref: "User",
required:true
},

status :{
    type : String,
    required:true,
    enum : {        
        values :["ignored" , "interested", "accepted" , "rejected"],   //enum is use to define a field with a restricted set of possible values. when the value outside the defined enum , then the mongoose will throw a validation error.
        message : `{VALUE} is Incorrect status type `
    }
}
},
{  timestamps: true,}
);

//creating the index //Compound index
connectionRequestSchema.index({fromUserId : 1 , toUserId : 1});  //creating the index for both the fields.[Compound index in  mongo db]


//keeping such validation make sense. our Schema should protect.--before saving always this method is called.
connectionRequestSchema.pre("save" , function(next){    //this will validate before saving , hence the name is "pre".--only should use normal function , no arrow function.
    const connectionRequest = this;
    //check if the fromUserId is same as toUserId.(eg --Akal is sending request to Akal)
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection requets to Yourself..!");
    } 
    next();   //this very important, because this act as the middleware.
})



//creating the Model
const ConnectionRequest = new mongoose.model("Connectrequest" , connectionRequestSchema);
module.exports = ConnectionRequest;