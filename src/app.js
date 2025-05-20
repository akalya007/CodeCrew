
//1.creating the server
// const express = require("express");

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


//here we can put as many b's after "b".
// app.get("/ab+c",(req , res) => {   
//   res.send({firstName: "Akalya" , lastName: "dhanapal"});
// })

//here we can write anything between "ab---cd"--is ab--cd is missing it will not work.
// app.get("/ab*cd",(req , res) => {   
//    res.send({firstName: "Akalya" , lastName: "dhanapal"});
// })

// app.listen(3000 , ()=>{
//     console.log("server is Successfully listening on port 3000 ")
// });
//=================================================================================

//Advanced Routing concept--with using the Regax Route

const express = require("express");

const app= express();   

// work with /abc /ac----"b" is optional.
// Route that matches "/abc" or "/ac" (the "b" is optional)
app.get(/^\/ab?c$/, (req, res) => {
  res.send({ firstName: "Akalya", lastName: "dhanapal" });
});

app.get(/^\/ab+c$/, (req, res) => {
  res.send({ firstName: "Akalya", lastName: "dhanapal" });
});

app.get(/^\/a(bc)?d$/, (req, res) => {
  res.send({ firstName: "Akalya", lastName: "dhanapal" });
}); 

app.get(/^\/ab.*cd$/, (req, res) => {
  res.send({ firstName: "Akalya", lastName: "dhanapal" });
});

//if in the path 'a' is present , then it will work.--it will work in the url present with "cab"--here the a is present.
app.get(/a/, (req, res) => {
  res.send({ firstName: "Akalya", lastName: "dhanapal" });
});

app.get(/.*fly$/, (req, res) => {
  res.send({ firstName: "Akalya", lastName: "dhanapal" });
});

app.get("/user", (req, res) => {
    console.log(req.query);
  res.send({ firstName: "Akalya", lastName: "dhanapal" });
});     //url====http://localhost:3000/user?userId=101&password=testing----dynamic user Id and the parrword

app.get("/user/:userId", (req, res) => {   //dynamic api [with :(colon)]
    console.log(req.params);
  res.send({ firstName: "Akalya", lastName: "dhanapal" });
});  

app.get("/user/:userId/:name/:password", (req, res) => {   //dynamic api [with :(colon)]
    console.log(req.params);
  res.send({ firstName: "Akalya", lastName: "dhanapal" });
}); 

app.listen(3000 , ()=>{
    console.log("server is Successfully listening on port 3000 ")
});
 