const adminAuth = (req , res , next)=>{
    console.log("Admin auth is getting checked");
    const token ="xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).res.send("Authorized request");
    }else{
        next();
    }
};

const UserAuth = (req , res , next)=>{
    console.log("User auth is getting checked");
    const token ="xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).res.send("Authorized request");
    }else{
        next();
    }
};

module.exports={
    adminAuth,
    UserAuth
};
