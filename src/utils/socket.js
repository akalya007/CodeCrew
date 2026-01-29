const socket = require("socket.io");  //3
const crypto = require("crypto");
const { Chat } = require("../model/chat");
//const ConnectionRequest = require("../model/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {    //to have the room Id in the secure way
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))   //we can sort this , so that rooId of two people can be same .
    .digest("hex");   //This final step converts the hashed value into a readable hexadecimal string.
};  //That’s your secret room ID — long, random-looking, and secure.

const initializeSocket = (server) => {
  const io = socket(server, {   //we need this server to initialize the io./or for the configiuration of the socket.io
    cors: {            //to handle the cors issues , while communicating to the websockets.
      origin: "https://connecthub-web.onrender.com",
    },
  });

  //using this io , to receive the Connection.
  io.on("connection", (socket) => {     //accept the conncetion.[start listening.]
    //events.
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {   //whenever there is the chat happens , that created inside the room.
      const roomId = getSecretRoomId(userId, targetUserId);     //note👇--creating the room with the unique id(this is the reason where we need both the userid)..then socket.join() room.
         console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    //once the mesage is send in the frontent , we can listen to it
    socket.on("sendMessage",async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          // TODO: Check if userId & targetUserId are friends

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },   //all the people inside the array will be the participants.
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
           //doni sended the msg in backens ,how to send the msg back to virat koli. 
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });  
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;


//note 😀

/**
 * when there is teh socket connection , we can create te room --room has the room id.--there will be the thounsand of participants.
 * There will be thousand of users , we dont know ,who wnat to chat with who ...
 * so , bacsically , we create the room . inside the room there will be participates
 * creating the room with the unique ID's , [userOd and the targetUserId]
 * 
 * 
 * suppose there are 100s of user, 
 * 
 * we want to connect dhoni and the virat,--we make sure their roomID are correct.
 * if virat sended the msg in room , it will sent to the dhoni---if dhoni sent the msg in the roon , it will sent to the virat.
 * 
 * 
 * 😀when the page loads , we need to create the socketConnetion with th eserver.
// we need to create the room with the unique Id , and then socket.join(), and thw=ere will one connection is establish in the particular room .


 */


/**
 * in the io.on("connection" , (socket) =>{
 * 
 * 
 * handle events
 * =============
 * 
 * socket.on("joinChat" , ()=>{
 * })
 *  
 * socket.on("sendMessage" , ()=>{
 * })
 * 
 * socket.on("disconncet" , ()=>{
 * })
 * 
 *  })
 */


/**
 * 1️⃣ crypto.createHash("sha256")

crypto is Node.js’s built-in cryptography module.

createHash("sha256") → creates a SHA-256 hash function.

SHA-256 is a secure one-way hashing algorithm, meaning it converts any input into a 64-character hexadecimal string that can’t be reversed back to the original
 */



