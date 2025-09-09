const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//creating the userSchema
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required:true,     //these are teh complusory field while inserting the new user in the database.
       minlength:3,
       maxlength: 50 ,   //we can add more validate in the schema
        trim: true,
    },
    lastName:{
        type: String
    },
    emailId: {
        type: String,
        lowercase: true, //to have teh email in lowercase, when they entered in Uppercase.
          required:true,
          unique:true , // the emailId is unique
          trim:true,    //wmail should be trim before saving it , it should not contain any space in the email. to while space shoild be added.
          validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address : " + value);
            }
          },
        },
    password: {
        type: String,
          required:true,
          validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter the string password : " + value);
            }
          },
    },
    age: {
        type: Number,
        min:18,
         max:100,
        validate(value){
            if (!Number.isInteger(value)) {
                throw new Error("Age must be an integer");
            }
        }
    }, 
    gender: {      //adding the "custom validation" to the user schema
        type: String,
        enum : {
            values : ["male" , "female" , "other"],
            message : `{VALUE} Gender data is not valid `
        },

        // validate(value){        //thus function only run if new user/data is added, it will not called with the exciting data.--so see the documentation, in the specific MODEL api.
        //   if(!["male" , "female" , "other"].includes(value)){      //this is teh custom validation
        //         throw new Error("Gender data is not valid");
        //   }
        // },
    },
    photoUrl: {
        type: String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg",
        validate(value){
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo URL : " + value);
            }
        }
    },
    about:{   
        type: String,             
        default:"This is the default about of the user",    //when the user is inserted without the aboyt , then the default about will be added--this is default one.
        maxlength: 500
    },
    skills: {
        type: [String]    //they may have may skills, so in the array.
    }

} , {                //it is always good to keep timestamp.
    timestamps:true    //it automattically adds the timestamp to all the user who registered.
});


userSchema.methods.getJWT = async function(){     //this is the good way of getting the jwt token by the schema methods, and we can also reuse it.
    const user = this;    //this keyword does not wirk in the arrow function.

 const token = await jwt.sign({_id: user._id} , "codecrew@123",{ expiresIn: "1d"})   // jwt.sign({keep data that need to hidden} ,"secret key")--here we hiding the userId

return token;
}


//validating the password.
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
const passwordHash = user.password;
const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
    );

    return isPasswordValid;
};


//creating the model.
const User= mongoose.model("User" , userSchema);
module.exports = User;  



//we can use the validator library for validating....for example for validating the email.--by installing it

