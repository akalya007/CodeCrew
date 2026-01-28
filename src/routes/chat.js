// const express = require("express");
// const { UserAuth } = require("../middleware/auth");
// const { Chat } = require("../model/chat");

// const chatRouter = express.Router();

// chatRouter.get("/chat/:targetUserId", UserAuth, async (req, res) => {
//   const { targetUserId } = req.params;
//   const userId = req.user._id;

//   try {
//     let chat = await Chat.findOne({
//       participants: { $all: [userId, targetUserId] },
//     }).populate({
//       path: "messages.senderId",
//       select: "firstName lastName",
//     });
//     if (!chat) {
//       chat = new Chat({
//         participants: [userId, targetUserId],
//         messages: [],
//       });
//       await chat.save();
//     }
//     res.json(chat);
//   } catch (err) {
//     console.error(err);
//   }
// });

// module.exports = chatRouter;



const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../model/chat"); // ✅ FIXED HERE

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      // origin: "http://localhost:3000",
          // origin:"https://codecrew-web.onrender.com",
      origin:"https://connecthub-web.onrender.com",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

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
