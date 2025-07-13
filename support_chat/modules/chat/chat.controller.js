const chatModel = require("../../models/chat");
const messageChatModel = require("../../models/messageChat");
// const messageModel = require("../../models/");
const { logActivity } = require("../../utils/createActivity");
const { v4: uuidv4 } = require('uuid'); 


exports.addExternal = async (req, res) => {
  try {
    const { participants, departmentId, organizationId } = req.body;
    const createdBy = req.userExternal._id; 

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: 'لیست شرکت‌کنندگان الزامی است' });
    }
    if (!departmentId || !organizationId) {
      return res.status(400).json({ message: 'departmentId و organizationId الزامی هستند' });
    }

    if (!Array.isArray(participants) || participants.length !== 2) {
      return res.status(400).json({ message: 'دو کاربر باید در چت شرکت داشته باشند.' });
    }

    const existingChat = await chatModel.findOne({
      participants: { $all: participants, $size: 2 },
      departmentId,
      organizationId
    });

    if (existingChat) {
      return res.status(200).json({
        message: 'چت قبلاً ایجاد شده است.',
        chat: existingChat
      });
    }


    const newChat = new chatModel({
      participants,
      departmentId,
      organizationId,
      roomId: uuidv4(),
      createdBy,
      status : "open"
    });

    await newChat.save();

    await logActivity({
      userId: req.userExternal._id,
      actionEn: 'create_chat_external',
      actionFa: 'ایجاد چت',
      targetType: 'Chat',
      targetId: newChat._id,
      details: {
        organizationId: organizationId,
        departmentId: departmentId
      }
    });
    return res.status(201).json({
      message: 'چت با موفقیت ایجاد شد',
      chat: newChat
    });

  } catch (error) {
    console.error('خطا در ایجاد چت:', error);
    return res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
};
exports.getAllExternal = async (req, res) => {
  try {
    const userId = req.userExternal;

    const chats = await chatModel.find({ participants: userId })
      .sort({ lastMessageAt: -1 })
      .lean();

    const chatList = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await messageChatModel.countDocuments({
          chatId: chat._id,
          userId: { $ne: userId },
          isSeen: false,
        });

        return {
          ...chat,
          unreadCount,
        };
      })
    );

    res.json(chatList);
  } catch (err) {
    console.error("خطا در گرفتن لیست چت‌ها:", err);
    res.status(500).json({ message: "خطای سرور" });
  }
};



exports.getAllInternal = async (req, res) => {
  try {
    const userId = req.userInternal;

    const chats = await chatModel.find({ participants: userId })
      .sort({ lastMessageAt: -1 })
      .lean();

    const chatList = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await messageChatModel.countDocuments({
          chatId: chat._id,
          userId: { $ne: userId },
          isSeen: false,
        });

        return {
          ...chat,
          unreadCount,
        };
      })
    );

    res.json(chatList);
  } catch (err) {
    console.error("خطا در گرفتن لیست چت‌ها:", err);
    res.status(500).json({ message: "خطای سرور" });
  }
};
exports.addInternal = async (req, res) => {
  try {
    const { participants, departmentId, organizationId } = req.body;
    const createdBy = req.userInternal._id; 

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: 'لیست شرکت‌کنندگان الزامی است' });
    }
    if (!departmentId || !organizationId) {
      return res.status(400).json({ message: 'departmentId و organizationId الزامی هستند' });
    }

    if (!Array.isArray(participants) || participants.length !== 2) {
      return res.status(400).json({ message: 'دو کاربر باید در چت شرکت داشته باشند.' });
    }

    const existingChat = await chatModel.findOne({
      participants: { $all: participants, $size: 2 },
      departmentId,
      organizationId
    });

    if (existingChat) {
      return res.status(200).json({
        message: 'چت قبلاً ایجاد شده است.',
        chat: existingChat
      });
    }


    const newChat = new chatModel({
      participants,
      departmentId,
      organizationId,
      roomId: uuidv4(),
      createdBy,
      status : "open"
    });

    await newChat.save();

    await logActivity({
      userId: req.userInternal._id,
      actionEn: 'create_chat_internal',
      actionFa: 'ایجاد چت',
      targetType: 'Chat',
      targetId: newChat._id,
      details: {
        organizationId: organizationId,
        departmentId: departmentId
      }
    });
    return res.status(201).json({
      message: 'چت با موفقیت ایجاد شد',
      chat: newChat
    });

  } catch (error) {
    console.error('خطا در ایجاد چت:', error);
    return res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
};
exports.updateIntenal = async (req, res) => {
  try {
    const chatId = req.params.id;
    const { status } = req.body;
    const supporterId = req.userInternal._id;
    console.log(req.userInternal._id);
    
    

    const chat = await chatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'چت پیدا نشد' });
    }

    const isParticipant = chat.participants.some(
      id => id.toString() === supporterId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'شما اجازه ویرایش این چت را ندارید' });
    }

    if (status !== undefined) chat.status = status;



    const updatedChat = await chat.save();

    await logActivity({
      userId: req.userInternal._id,
      actionEn: 'update_chat_internal',
      actionFa: 'اپدیت چت',
      targetType: 'Chat',
      targetId: updatedChat._id,
      details: {
        organizationId: updatedChat.organizationId,
        departmentId: updatedChat.departmentId,
      }
    });

    return res.status(200).json({
      message: 'چت با موفقیت ویرایش شد ',
      chat: updatedChat
    });

  } catch (error) {
    console.error('Update Ticket Error:', error);
    return res.status(500).json({ message: 'خطا در ویرایش تیکت', error: error.message });
  }
};

