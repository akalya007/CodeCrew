const validator = require("validator");

const ValidSignUpData = (req) => {
    const {firstName , lastName , emailId , password} = req.body;   //destructuring

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(emailId)){
       throw new Error("email is not valid");
    }else if(!validator.isStrongPassword(password)){
       throw new Error("Please enter the string password");
}
} 

module.exports= {
    ValidSignUpData
};