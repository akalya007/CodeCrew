const mongoose = require("mongoose");

const connectDB = async () => {
await mongoose.connect(
    "mongodb+srv://akalya:akalya@cluster0.3oea8tv.mongodb.net/Codecrew"
);
}; 

//But by connecting the databse here is not the good way.It will listen to the port 3000 first and then it will connect to the database. it is not good way. so use it the app.js
//start your server only after connecting to the database.

// connectDB()       //hence it is the promise, we were handling it.
// .then(()=>{
//     console.log("Database connection extablished......");
// })
// .catch((error)=>{
//     console.log("Database cannot be connected!");
// })


module.exports = connectDB;