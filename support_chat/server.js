const { default: mongoose } = require("mongoose");
const http = require("http");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();
const socketIoConnection = require("./utils/socketConnection");
const socketHandler = require("./socket.io/index");

//* Database Connection
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.log(`Error Connection To MongoDB: ${err}`);
    process.exit(1);
  }
};

//* Start app
const startServer = () => {
  const port = process.env.PORT || 4003;
  const httpServer = http.createServer(app);
  const io = socketIoConnection(httpServer);
  socketHandler(io);
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

const run = async () => {
  await connectToDB();
  startServer();
};

run();








// const userModel = require("./../models/user");
// const supportModel = require("./../models/support");
// const messageModel = require("./../models/message");
// const conversationModel = require("./../models/conversation");
// const { v4: uuidv4 } = require("uuid");

// exports.initConnectionUser = (io) => {
//   io.of("/auth/user").on("connection", async (socket) => {
//     console.log("User connected:", socket.id);
//   });
// };

// exports.initConnectionSupport = (io) => {
//   io.of("/auth/support").on("connection", async (socket) => {
//     console.log("support connected:", socket.id);
//   });
// };

// exports.chat = (io) => {
//   io.of("/pvs").on("connection", async (socket) => {
//     console.log("User connected:", socket.id);

//     //* join user to chat
//     socket.on("joinUser", async ({ name, topic, email, phonNumber }) => {
//       try {
//         const userId = uuidv4();
//         const findUser = await userModel.findOne({ email, phonNumber });
//         if (!findUser) {
//           const user = await userModel.create({
//             userId,
//             name,
//             topic,
//             email,
//             phonNumber,
//           });
//           socket.emit("resultUser", user);

//           socket.join(user.userId); // کاربر وارد اتاق خودش می‌شود
//           console.log(`User ${user.userId} joined chat`);
//           let userChat = findUser.userId;
//           // بازیابی پیام‌های قبلی از Conversation
//           const conversation = await conversationModel
//             .findOne({ userId: userChat })
//             .populate("messages");

//           if (conversation) {
//             socket.emit("previousMessages", conversation.messages);
//           }
//         } else {
//           socket.emit("resultUser", findUser);

//           socket.join(findUser.userId); // کاربر وارد اتاق خودش می‌شود
//           console.log(`User ${findUser.userId} joined chat`);
//           userChat = findUser.userId;
//           // بازیابی پیام‌های قبلی از Conversation
//           const conversation = await conversationModel
//             .findOne({ userId: userChat })
//             .populate("messages");
//           if (conversation) {
//             socket.emit("previousMessages", conversation.messages);
//           }
//         }
//       } catch (error) {
//         console.error("Error in joinSupportChat:", error);
//       }
//     });

//     //* createUserMessage
//     socket.on("userMessage", async ({ userId, message }) => {
//       try {
//         const findUser = await userModel.findOne({ userId });
//         const newMessage = await messageModel.create({
//           userId,
//           sender: "USER",
//           message,
//         });

//         let conversation = await conversationModel.findOne({ userId });
//         if (!conversation) {
//           conversation = await conversationModel.create({
//             name: findUser.name,
//             userId,
//             messages: [newMessage],
//           });
//         } else {
//           conversation.messages.push(newMessage);
//           await conversation.save(); // ذخیره‌سازی مکالمه
//         }

//         socket.join(userId);
//         io.in(userId).emit("messageFromUser", { message: 'Message from user' });
//       } catch (error) {
//         console.error("Error in userMessage:", error);
//       }
//     });

//     //* support
//     socket.on("home", async () => {
//       try {
//         const conversations = await conversationModel
//           .find({})
//           .populate("messages");
//         socket.emit("getAllConversations", conversations);
//       } catch (error) {
//         console.error("Error in joinSupportChat:", error);
//       }
//     });

//     //* join supporter to chat
//     socket.on("joinSupport", async ({ userId }) => {
//       try {
//         const conversations = await conversationModel.find({});
//         socket.join(userId);
//         console.log(`supporter ${userId} joined chat`);

//         // بازیابی پیام‌های قبلی از Conversation
//         const conversation = await conversationModel
//           .findOne({ userId })
//           .populate("messages");

//         if (conversation) {
//           socket.emit("previousMessages", conversation.messages);
//         }
//       } catch (error) {
//         console.error("Error in joinSupportChat:", error);
//       }
//     });

//     // if (!support) {
//     //   console.error("No support available");
//     //   return; // یا می‌توانید یک پیام به کاربر ارسال کنید
//     // }

//     //* createSupportMessage
//     socket.on("supportMessage", async ({ userId, message }) => {
//       try {
//         const support = await supportModel.findOne({});
//         const newMessage = await messageModel.create({
//           userId: userId,
//           sender: "SUPPORT",
//           message: message,
//         });

//         let conversation = await conversationModel.findOne({ userId });
//         if (conversation) {          
//           conversation.messages.push(newMessage);
//           await conversation.save(); // ذخیره‌سازی مکالمه
//         }

//         socket.join(userId);
//         // ارسال پیام به کاربر
//         io.in(userId).emit("messageFromSupport",  { message: 'Hello from support!' });
//       } catch (error) {
//         console.error("Error in supportMessage:", error);
//       }
//     });
//   });
// };