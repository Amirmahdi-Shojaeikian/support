const mongoose = require('mongoose');

const messageChatSchema = new mongoose.Schema({
  message: {
    type: String,
    default: ''
  },
  file: {
    type: String 
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'video', 'audio'],
    default: 'text'
  },
  isSeen:{
    type : Boolean,
    default : false
}
}, { timestamps: true });

const MessageChat = mongoose.model('MessageChat', messageChatSchema);
module.exports = MessageChat;
