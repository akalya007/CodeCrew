const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../model/chat");
//const ConnectionRequest = require("../model/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))   //we can sort this , so that rooId of two people can be same .
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {            //to handle the cors issues , while communicating to the websockets.
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {     //accept the conncetion.[start listening.]
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);     //note👇--creating the room.
      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          // TODO: Check if userId & targetUserId are friends

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
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
 * There will be thousand of users , we dont know ,who wnat to chat with who ...
 * so , bacsically , we create the room . inside the room there will be participates
 * creating the room with the unique ID's , [userOd and the targetUserId]
 * 
 * 
 * suppose there are 100s of user, 
 * 
 * we want to connect dhoni and the virat,we make sure , their roomID are correct.
 * if virat sended the msg in room , it will sent to the dhoni---if dhoni sent the msg in the roon , it will sent to the virat.
 */

