const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  roomId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'archived'],
    default: 'open'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
