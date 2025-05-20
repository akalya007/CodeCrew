
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


//3.with Route.

const express = require("express");

const app= express();   //creating the application ----creating the server--then want to keep listens on the port.

app.use("/hello",(req,res)=>{        //the callback function is known as the requets handler.

    res.send("Hello Akalssssss");
});
app.use("/",(req,res)=>{        //the callback function is known as the requets handler.
    res.send("Hello Akalssssss");
});

app.use("/test",(req,res)=>{        //the callback function is known as the requets handler.
    res.send("Hello world from the server");
});

app.listen(3000 , ()=>{
    console.log("server is Successfully listening on port 3000 ")
});





//nodemon--it automattically refresh the server we dont want to run again and again.before nodemon we 