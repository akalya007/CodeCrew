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


const validateEditProfileData =(req)=>{
    const allowedEditFields = ["firstName" , "lastName" ,"emailId","gender", "about" , "age" , "photoUrl" , "skills"];

    const isEditAllowed = Object.keys(req.body).every((field) =>    //looping every fields in the allowedEditFields.      
            allowedEditFields.includes(field));

    return isEditAllowed;
}

const validateCurrentPassword = async (loggedInUser, currentPassword) => {
    const isValid = await loggedInUser.validatePassword(currentPassword);
    
    return isValid;
};

module.exports= {
    ValidSignUpData,
    validateEditProfileData,
    validateCurrentPassword
};