const userModel = require("./../models/user");
const chatModel = require("./../models/chat");
const messageChatModel = require("./../models/messageChat");
const messageModel = require("./../models/message");
const mediaModel = require("./../models/media");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');


const onlineUsers = new Map();
exports.initConnectionUserInternal = (io) => {

  io.of("/internal").use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.auth;

      if (!token || !token.startsWith('Bearer ')) {
        return next(new Error('توکن ارسال نشده یا فرمت اشتباه است'));
      }

      const pureToken = token.split(' ')[1];
      const decoded = jwt.verify(pureToken, process.env.JWT_SECRET);

      const user = await userModel.findOne({ _id: decoded._id });
      if (!user) return next(new Error('کاربر یافت نشد'));

      socket.user = user;
      next();
    } catch (err) {
      console.error('خطای احراز هویت:', err);
      return next(new Error('احراز هویت ناموفق'));
    }
  });

  io.of("/internal").on("connection", async (socket) => {
    const userId = socket.user._id.toString();

    if (onlineUsers.has(userId)) {
      const oldSocketId = onlineUsers.get(userId);
      io.of("/internal").to(oldSocketId).emit("forceDisconnect");
    }

    onlineUsers.set(userId, socket.id);
    await userModel.findByIdAndUpdate(userId, { online: true });

    socket.on("joinChat", ({ roomId }) => {
      if (roomId) socket.join(roomId);
    });

    socket.on("leaveChat", ({ roomId }) => {
      if (roomId) socket.leave(roomId);
    });

    socket.on("getChats", async () => {
      try {
        const chats = await chatModel
          .find({ participants: userId, status: { $ne: 'archived' } })
          .populate('participants', 'name username')
          .populate('departmentId', 'name')
          .populate('organizationId', 'name')
          .sort({ lastMessageAt: -1 })
          .lean();

        const enrichedChats = await Promise.all(chats.map(async (chat) => {
          const unreadCount = await messageChatModel.countDocuments({
            chatId: chat._id,
            userId: { $ne: userId },
            isSeen: false,
          });

          return { ...chat, unreadCount };
        }));

        socket.emit("chatsList", enrichedChats);
      } catch (error) {
        console.error("❌ خطا در دریافت لیست چت‌ها:", error);
        socket.emit("chatsListError", { message: "خطا در دریافت لیست چت‌ها" });
      }
    });

    socket.on("getOneChat", async ({ chatId, limit = 100 }) => {
      try {
        if (!chatId) return socket.emit("chatOneListError", { message: "chatId الزامی است" });

        const chat = await chatModel
          .findOne({ _id: chatId, participants: userId, status: { $ne: 'archived' } })
          .populate('participants', 'name username')
          .populate('departmentId', 'name')
          .populate('organizationId', 'name')
          .lean();

        if (!chat) {
          return socket.emit("chatOneListError", { message: "چت پیدا نشد" });
        }

        // (۵) محدودسازی تعداد پیام‌ها
        const messages = await messageChatModel
          .find({ chatId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();

        // پیام‌ها به ترتیب قدیمی → جدید
        messages.reverse();

        socket.emit("chatOneList", { chat, messages });
      } catch (error) {
        console.error("❌ خطا در دریافت یک چت:", error);
        socket.emit("chatOneListError", { message: "خطا در دریافت چت" });
      }
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { chatId, message, type, file } = data;

        if (!chatId || (!message && !file)) {
          return socket.emit("sendMessageError", { message: "chatId و message یا file الزامی است" });
        }

        const chat = await chatModel.findById(chatId).lean();
        if (!chat) return socket.emit("sendMessageError", { message: "چت پیدا نشد" });

        // (۱) بررسی اینکه کاربر عضو چت باشد
        if (!chat.participants.map(id => id.toString()).includes(userId)) {
          return socket.emit("sendMessageError", { message: "شما عضو این چت نیستید" });
        }

        // (۲) بررسی وجود roomId
        if (!chat.roomId) {
          return socket.emit("sendMessageError", { message: "roomId برای این چت تعریف نشده است" });
        }

        const newMessage = await messageChatModel.create({
          chatId,
          userId,
          message: message || '',
          type: type || (file ? 'file' : 'text'),
          file: file || null,
        });

        await chatModel.findByIdAndUpdate(chatId, { lastMessageAt: new Date() });

        io.of("/internal").to(chat.roomId).emit("newMessage", newMessage);

      } catch (error) {
        console.error("❌ خطا در ارسال پیام:", error);
        socket.emit("sendMessageError", { message: "ارسال پیام ناموفق بود" });
      }
    });

    socket.on("seenMessages", async ({ chatId, messageIds }) => {
      try {
        if (!chatId || !messageIds?.length) return;

        const isChat = await chatModel.findOne({ _id: chatId });

        await messageChatModel.updateMany(
          {
            _id: { $in: messageIds },
            chatId,
            userId: { $ne: userId },
            isSeen: false
          },
          { $set: { isSeen: true } }
        );

        io.of("/internal").to(isChat.roomId).emit("messagesSeen", {
          chatId,
          seenBy: userId,
          seenMessageIds: messageIds
        });

      } catch (error) {
        console.error("❌ خطا در seenMessages:", error);
        socket.emit("seenError", { message: "خطا در بروزرسانی پیام‌های دیده‌شده" });
      }
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(userId);
      await userModel.findByIdAndUpdate(userId, { online: false });
    });
  });
};


