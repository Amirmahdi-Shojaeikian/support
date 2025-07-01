const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionEn: {
    type: String,
    required: true
  },
  actionFa: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false 
  },
  details: {
    type: mongoose.Schema.Types.Mixed, 
    default: {}
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model('Activity', activitySchema);