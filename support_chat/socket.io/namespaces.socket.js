const userModel = require("./../models/user");
const supportModel = require("./../models/support");
const messageModel = require("./../models/message");
const mediaModel = require("./../models/media");
const conversationModel = require("./../models/conversation");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path"); 



exports.initConnectionUser = (io) => {
  io.on("connection", async (socket) => {
    socket.emit("privateChats", "test connection");
  });
};

exports.initConnectionSupport = (io) => {
  io.of("/support").on("connection", async (socket) => {
    const users = await userModel.find({}).lean()
    socket.emit("privateChats", users);

  });
};

exports.chatuser = (io) => {
  io.of("/pvs/user").on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    //* join user to chat
    socket.on("joinUser", async ({ data }) => {
      try {
        const { roomId } = data
        console.log(roomId);
        const getMessage = await messageModel.find({ roomId })

        socket.join(`${roomId}`);


        socket.emit("joined", getMessage);

      } catch (error) {
        console.error("Error in supportMessage:", error);
      }
    });

    socket.on("newMsg", async ({ data }) => {
      try {

        const { roomId, type, message,file, filename } = data
        socket.join(`${roomId}`);
        const user = await userModel.findOne({ roomId });
        if (type === "FILE") {
          const ext = path.extname(filename);
          const mediaPath = `uploads/${String(Date.now() + ext)}`;
          fs.writeFile(`public/${mediaPath}`, file, async (err) => {
            if (!err) {
              const newMedia = await mediaModel.create({ userId: user._id, sender: "USER", type, path: `${mediaPath}`, roomId });
              console.log(newMedia);
              const newMessage = await messageModel.create({ userId: user._id, sender: "USER", type, message, roomId,file:newMedia._id ,path :newMedia.path  })
              console.log(newMessage);
              io.of("/pvs/user").to(roomId).emit("userMsg", newMessage);
              io.of("/pvs/support").to(roomId).emit("supportMsg", newMessage);
            }
          });
        }else{
        const newMessage = await messageModel.create({ userId: user._id, sender: "USER", type, message, roomId })
        const prevChat = Array.from(socket.rooms);
        console.log(`newMsg user ${prevChat}`);


        // socket.emit("confirmMsg", newMessage);
        io.of("/pvs/user").to(roomId).emit("userMsg", newMessage);
        io.of("/pvs/support").to(roomId).emit("supportMsg", newMessage);}

      } catch (error) {
        console.error("Error in supportMessage:", error);
      }
    });


  });
};

exports.chatsupport = (io) => {
  io.of("/pvs/support").on("connection", async (socket) => {
    console.log("Supporter connected:", socket.id);

    //* join supporter to chat
    socket.on("joinsupport", async ({ data }) => {
      try {
        const { roomId } = data
        console.log(roomId);
        const getMessage = await messageModel.find({ roomId })
        socket.join(`${roomId}`);
        const prevChat = Array.from(socket.rooms);
        console.log(prevChat);

        socket.emit("joined", getMessage);

      } catch (error) {
        console.error("Error in supportMessage:", error);
      }
    });

    socket.on("newMsg", async ({ data }) => {
      try {

        const { roomId, message, type, spporterId } = data
        socket.join(`${roomId}`);
        const supporter = await supportModel.findOne({ _id: spporterId });
        const newMessage = await messageModel.create({ userId: supporter._id, sender: "SUPPORT", type, message, roomId })
        const prevChat = Array.from(socket.rooms);
        console.log(`newMsg support ${prevChat}`);
        io.of("/pvs/user").to(roomId).emit("userMsg", newMessage);
        io.of("/pvs/support").to(roomId).emit("supportMsg", newMessage);
      } catch (error) {
        console.error("Error in supportMessage:", error);
      }
    });


  });
};



const getMedia = (io, socket) => {
  socket.on("newMedia", async (data) => {
    console.log("New Media ->", data);
    const { filename, file, sender, roomName } = data;
    const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });
    const ext = path.extname(filename);
    const mediaPath = `uploads/${String(Date.now() + ext)}`;

    fs.writeFile(`public/${mediaPath}`, file, async (err) => {
      if (!err) {
        await NamespaceModel.updateOne(
          {
            _id: namespace._id,
            "rooms.title": roomName,
          },
          {
            $push: {
              "rooms.$.medias": {
                sender,
                path: mediaPath,
              },
            },
          }
        );

        io.of(namespace.href).in(roomName).emit("confirmMedia", data);
      } else {
        // Error Emit
      }
    });
  });
};