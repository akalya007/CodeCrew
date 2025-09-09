
//1.creating the server
// const express = require("express");   //express is a popular web framework for Node.js that makes it easier to build APIs and web servers.

// const app= express();   //creating the application ----creating the server--then want to keep listens on the port.
                           
// app.listen(3000 , ()=>{
//     console.log("server is Successfully listening on port 3000 ")
// });



//2.after creating the server , we want to handle it.

// const express = require("express");

// const app= express();   //creating the application ----creating the server--then want to keep listens on the port.

// app.use((req,res)=>{        //the callback function is known as the requets handler.
//     res.send("Hello world from the server");
// });


// app.listen(3000 , ()=>{
//     console.log("server is Successfully listening on port 3000 ")
// });


//3.with Route and the router handlers.

// const express = require("express");

// const app= express();   //creating the application ----creating the server--then want to keep listens on the port.

// // app.use("/hello",(req,res)=>{        //the callback function is known as the requets handler.--
// //     res.send("Hello Akalssssss");       //--if any other router, which starts form "/helo" , this will be mathched over this--it means "localhost.3000/hello/234"--the output of this is same as "hello hello helloooo"
// // });                                 //it starts matching the route form the top.
// app.use("/",(req,res)=>{        //the callback function is known as the requets handler.
//     res.send("Hello helo heloooooo");
// });

// app.use("/test",(req,res)=>{        //the callback function is known as the requets handler.
//     res.send("Hello world from the server");
// });

// app.listen(3000 , ()=>{
//     console.log("server is Successfully listening on port 3000 ")
// });

//nodemon--it automattically refresh the server we dont want to run again and again.before nodemon we 

//=================================================================================================
//testing the api in the postman

// const express = require("express");

// const app= express();   

// //this will only handle GET call with "/user"
// app.get("/user",(req , res) => {   
//     res.send(res.send({firstName: "Akalya" , lastName: "dhanapal"}));
// })

// //This will match all the HTTP method API calls to /test
// app.use("/test",(req,res)=>{      
//     res.send("Hello world from the server");
// });


// app.listen(3000 , ()=>{
//     console.log("server is Successfully listening on port 3000 ")
// });


//====================================================================================================================
//Advanced Routing concept

// const express = require("express");

// const app= express();   

// // work with /abc /ac----"b" is optional.
// // Route that matches "/abc" or "/ac" (the "b" is optional)
// app.get("/ab?c", (req, res) => {
//     res.send({ firstName: "Akalya", lastName: "dhanapal" });
// });


// // here we can put as many b's after "b".
// app.get("/ab+c",(req , res) => {   
//   res.send({firstName: "Akalya" , lastName: "dhanapal"});
// })

// // here we can write anything between "ab---cd"--is ab--cd is missing it will not work.
// app.get("/ab*cd",(req , res) => {   
//    res.send({firstName: "Akalya" , lastName: "dhanapal"});
// })

// app.listen(3000 , ()=>{
//     console.log("server is Successfully listening on port 3000 ")
// });
//=================================================================================

//Advanced Routing concept--with using the Regax Route

// const express = require("express");

// const app= express();   

// // work with /abc /ac----"b" is optional.
// // Route that matches "/abc" or "/ac" (the "b" is optional)
// app.get(/^\/ab?c$/, (req, res) => {
//   res.send({ firstName: "Akalya", lastName: "dhanapal" });
// });

// app.get(/^\/ab+c$/, (req, res) => {
//   res.send({ firstName: "Akalya", lastName: "dhanapal" });
// });

// app.get(/^\/a(bc)?d$/, (req, res) => {
//   res.send({ firstName: "Akalya", lastName: "dhanapal" });
// }); 

// app.get(/^\/ab.*cd$/, (req, res) => {
//   res.send({ firstName: "Akalya", lastName: "dhanapal" });
// });

// //if in the path 'a' is present , then it will work.--it will work in the url present with "cab"--here the a is present.
// app.get(/a/, (req, res) => {
// //   res.send({ firstName: "Akalya", lastName: "dhanapal" });
// });

// app.get(/.*fly$/, (req, res) => {
//   res.send({ firstName: "Akalya", lastName: "dhanapal" });
// });

// app.get("/user", (req, res) => {
//     console.log(req.query);
//   res.send({ firstName: "Akalya", lastName: "dhanapal" });
// });     //url====http://localhost:3000/user?userId=101&password=testing----dynamic user Id and the parrword

// app.get("/user/:userId", (req, res) => {   //dynamic api [with :(colon)]
//     console.log(req.params);
//   res.send({ firstName: "Akalya", lastName: "dhanapal" });
// });  

// app.get("/user/:userId/:name/:password", (req, res) => {   //dynamic api [with :(colon)]
//     console.log(req.params);
//   res.send({ firstName: "Akalya", lastName: "dhanapal" });
// }); 

// app.listen(3000 , ()=>{
//     console.log("server is Successfully listening on port 3000 ")
// });


//========================================================================================================================================
//Episode 05--Route and Middleware.
//=================================
//Empty Route handler

// const express =  require("express");
// const app = express();

// app.use("/user" ,(req , res) =>{
//     //Route Handler--It can Handle any type of the Methods--get/put/delete/post.
//    // res.send("Router Handler 1");   //If we command this--is it is the empty route handlers , it will nothing send
//    console.log(" 1 Route Message");   //when there is no route handlers,req from the Postman will come into this Route handler and it will console it and it will do nothing. BUt thats not the correct.
// //res.send(" 1 response");
// })

// app.listen(3000 , ()=>{
//     console.log("Server us successfully listening on the port 3000");
// })
//===============================================================================================

//one Route can have More that one  Route handlers
//==================================================

//Route handlers
/**
 * one route can have multiple Routehandlers
 * 
 * app.use("/user" , ()=>{
 * Router hander 
 * },
 * ()=>{
 * Route handler2
 * }
 * )
 */


// const express =  require("express");
// const app = express();

// app.use("/user" ,(req , res) =>{ 
//    //res.send("Router Handler 1");   //If we command this--is it is the empty route handlers , it will nothing send
//    console.log(" 1 Route Message");  
//   //res.send(" 1 response");   //when we command --there will be no response. and the next route will not be called.
// },
//   (req,res)=>{
//    console.log("Route handling 2");
//    res.send(" 2nd Response");
//    })

// app.listen(3000 , ()=>{
//     console.log("Server us successfully listening on the port 3000");
// })


//===================================================================================================
//when there is no response sended, the request will be hanged. so expressjs has the next() parameter  to go for the 
// const express =  require("express");
// const app = express();

// app.use("/user" ,(req , res , next) =>{ 

//     console.log(" 1 Route Message");  
//     res.send(" 1 response");   //when we command --there will be no response. and the next route will not be called.
//     next();    //it is the funcrion given by the express, to called the next Route handler---bur gives the error message, one router should handle only one router handlers. 
// },
//   (req,res)=>{
//    console.log("Route handling 2");
//    res.send(" 2nd Response");
//    })

// app.listen(3000 , ()=>{
//     console.log("Server us successfully listening on the port 3000");
// })
//when the request is sent , it comes into the app.use and it execute line by line .

//=====================================================================================================
//another case--playing with route handling.

// const express =  require("express");
// const app = express();

// app.use("/user",
//     (req , res , next) =>{ 
//     console.log(" 1 Route Message");
//     next();   //this one .
//    // res.send(" 1 response");   
// },
//   (req,res , next)=>{
//    console.log("Route handling 2");
//   //res.send(" 2nd Response");
//    next();
//    },
//     (req,res , next)=>{
//     console.log("Route handling 3");
//   // res.send(" 3nd Response");
//     next();
//    },
//     (req,res , next)=>{
//     console.log("Route handling 4");
//    //res.send(" 4nd Response");
//     next();
//    },
//     (req,res , next)=>{
//      console.log("Route handling 5");
//      res.send(" 5nd Response");
//     next();
//    }
// )

// app.listen(3000 , ()=>{
//     console.log("Server us successfully listening on the port 3000");
// })

//=======================================================================================================
//CORNER CASE.

//we  can also place the route handlers inside the array.

// const express =  require("express");
// const app = express();

// app.use("/user",
//    [ (req , res , next) =>{ 
//     console.log(" 1 Route Message");
//     next();   //this one .
//    // res.send(" 1 response");   
// },
//   (req,res , next)=>{
//    console.log("Route handling 2");
//   // res.send(" 2nd Response");
//    next();
//    },
//     (req,res , next)=>{
//     console.log("Route handling 3");
//   // res.send(" 3nd Response");
//     next();
//    },
//     (req,res , next)=>{
//     console.log("Route handling 4");
//    //res.send(" 4nd Response");
//     next();
//    },
//     (req,res , next)=>{
//      console.log("Route handling 5");
//     // res.send(" 5nd Response");    //when No response in the route handlers.--it will be error
//     next();  //when there is no respose, and giving this next()--the 'express' is waiting for the 'next Route Handlers', so there will be error.
//    }   //But when we command this, the reqused will hang .
// ])

// app.listen(3000 , ()=>{
//     console.log("Server us successfully listening on the port 3000");
// })

//app.use("/route" , [rH1 , rH2 , rH3], rH4,rH5)
//===============================================================================
//another way of defining the Route handlers.
//Using the same Route and using Route handlers.


// const express =  require("express");
// const app = express();

// app.use("/user" , (req , res , next) =>{
//     console.log("Route handler 1");   //this chain od methods are called the         middleware , it was called between the reqest handler.
//     next();
// })
// app.use("/user" , (req , res , next) =>{
//     console.log("Route handler 2");        //this is actuaaly the response. handler. It send the response , so it is called soo.
//     res.send("Route 2");
//     next();
// })

// app.listen(3000 , ()=>{
//     console.log("Server us successfully listening on the port 3000");
// })


//=================================================================================
//Authorized

// const express=require("express");
// const app = express();

// //Handle Auth middle for all the methods GET , POST......requests.
// app.use("/admin" , (req , res , next)=>{
//     console.log("Admin auth is getting checked");
//     const token ="xyz";
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(401).res.send("Authorized request");
//     }else{
//         next();
//     }
// });

// app.get("/user" , (req,res) =>{   //auth router is hanlde here.
//     res.send("user data sent");
// })
// app.get("/admin/getAlluser" , (req,res) =>{
//     res.send("All data sent");
// })
// app.get("/admin/deleteAlluser" , (req,res) =>{
//     res.send("delete data sent");
// })

// app.listen(3000 , ()=>{
//     console.log("Server is successfully listening on the port 3000");
// })


//============================================================================
//can use another clean way of using the auth.(Middleware)

// const express=require("express");
// const app = express();

// const {adminAuth  , UserAuth} = require("./middleware/auth");
// //Handle Auth middle for all the methods GET , POST......requests.
// app.use("/admin" , adminAuth);

// app.get("/user" , UserAuth, (req,res) =>{   //we have only one route for the user, so we can userAuth inside it like this.
//     res.send("user data sent");
// })

// app.get("/admin/getAlluser" , (req,res) =>{
//     res.send("All data sent");
// })
// app.get("/admin/deleteAlluser" , (req,res) =>{
//     res.send("delete data sent");
// })

// app.listen(3000 , ()=>{
//     console.log("Server is successfully listening on the port 3000");
// })
//=======================================================================
//error handling.

// const express=require("express");
// const app = express();
//                                            //order maters....use the wild card error handling always to the end .
// app.use("/" , (err , req , res , next)=>{ //make sure , the error should always comes in the front , next at the last(this is te formate)--but using try-catch mathod is the best way.
// if(err){
//     console.log("first");
//     res.status(500).send("Something went wrong");
// }
// }) 
// app.get("/getUserData" , (req, res)=>{
//     console.log("checking the getuserdata")
//     throw new Error("jbxgfd");
//     res.send("User data sent");
// }
// )

// app.use("/" , (err , req , res , next)=>{ //make sure , the error should always comes in the front , next at the last(this is te formate)--but using try-catch mathod is the best way.
// if(err){
//     console.log("Second")
//     res.status(500).send("Something went wrong");
// }
// }); 

// app.listen(3000 , ()=>{
//     console.log("Server is successfully listening on the port 3000");
// });


//============================================================
//using try and catch for error handling.

// const express=require("express");
// const app = express();


// app.get("/getUserData" , (req, res)=>{
//     try{
//    console.log("checking the getuserdata")
//     throw new Error("jbxgfd");
//     }catch{
//      res.send("catched data ");
//     }  
// }
// )

// app.listen(3000 , ()=>{
//     console.log("Server is successfully listening on the port 3000");
// });

//================================================================================

//DATABASE SCHEMA


// const express=require("express");
// const app = express();

// const connectDB = require("./config/database");


// connectDB()       //hence it is the promise, we were handling it.
// .then(()=>{
//     console.log("Database connection extablished......");
//     app.listen(3000 , ()=>{
//     console.log("Server is successfully listening on the port 3000...");
// });
// })
// .catch((err)=>{
//     console.log("Database cannot be connected!");
// })

