const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ["SUPPORT", "USER"],
    require: true
  },
  type: {
    type: String,
    enum: ["TEXT", "FILE"],
    required: true
  },
  message: {
    type: String,
    required: false
  },
  roomId: {
    type: String,
    required: true
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mdeia",
    required: false,
  },
  path: {
    type: String,
    required: false
  },

}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
