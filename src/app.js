
// Building the proper API--for CodeCrew.
require('dotenv').config()
console.log("Mongo URI:", process.env.DATABASE_CONNECTION_STRING);


const express=require("express");
const app = express();
const connectDB = require("./config/database");   //for connecting the database.
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");  //1  The "http" module lets you create a web server



app.use(cors({ 
    origin:"https://connecthub-web.onrender.com",   //vitelisting the domain name.   //to set the cookie in the web, so adding this configuration.
    credentials:true,
}));
app.use(express.json())  //this is the middleware , that convert the json object to the javasript object.(hence it is apply for all the routes).//without the middeware , it will be undefined.
app.use(cookieParser());   //to read the cookie


// console.log("Mongo URI from .env:", process.env.DATABASE_CONNECTION_STRING); // 👈 check for tetsing
//importing the router
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/" , authRouter);   //whenever we get the route i.e all the middleware , all the request handlers , and send the response, from wherever it gets the first. expresjs try to go one by one 
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);  //2 //creating the server..this app is the existing our  express application.---we need this server for the initializing of the socker.io./ or configuration of the socket.io.
initializeSocket(server);

connectDB()       //hence it is the promise, we were handling it.
.then(()=>{
    
    console.log("Database connection extablished......");
    
    //app.listen(3000 , ()=>{
        const PORT = process.env.PORT || 3000;
     server.listen(PORT, "0.0.0.0", () => {   //4 //instead od app.listen , we want to write server.listen--
    console.log("Server is successfully listening on the port 3000...");
});
})
.catch((err) => {
  console.error("Database cannot be connected! ❌ Error:", err.message);
});
///======================================
//for deployment2
// const express = require("express");
// const app = express();
// const connectDB = require("./config/database");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const http = require("http");

// require('dotenv').config();

// const port = process.env.PORT || 3000;
// console.log("Port set to:", port);  // for debugging

// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true,
// }));
// app.use(express.json());
// app.use(cookieParser());

// const authRouter = require("./routes/auth");
// const profileRouter = require("./routes/profile");
// const requestRouter = require("./routes/request");
// const userRouter = require("./routes/user");
// const chatRouter = require("./routes/chat");

// const initializeSocket = require("./utils/socket");

// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);
// app.use("/", userRouter);
// app.use("/", chatRouter);

// const server = http.createServer(app);
// initializeSocket(server);

// connectDB()
// .then(() => {
//     console.log("Database connection established...");
//     server.listen(port, () => {
//         console.log(`Server is successfully listening on port ${port}`);
//     });
// })
// .catch((err) => {
//     console.error("Database cannot be connected! ❌ Error:", err.message);
// });
