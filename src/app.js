
//Building the proper API--for CodeCrew.

const express=require("express");
const app = express();
const connectDB = require("./config/database");   //for connecting the database.
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require('dotenv').config()

app.use(cors({
    origin:"http://localhost:5173",   //vitelisting the domain name.
    credentials:true,
}));
app.use(express.json())  //this is the middleware , that convert the json object to the javasript object.(hence it is apply for all the routes).//without the middeware , it will be undefined.
app.use(cookieParser());   //to read the cookie


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

const server = http.createServer(app);   //creating the server..this app is the existing our application.---we need this server for the initializing of the socker.io.
initializeSocket(server);

connectDB()       //hence it is the promise, we were handling it.
.then(()=>{
    console.log("Database connection extablished......");
    //app.listen(3000 , ()=>{
     server.listen(3000, () => {
    console.log("Server is successfully listening on the port 3000...");
});
})
.catch((err)=>{
    console.log("Database cannot be connected!");
})