const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type : String,
    required : true
  }, 
  sender: {
    type : String,
    enum : ["SUPPORT","USER"],
    require : true
  },
  path: {
    type : String,
    required : true
  }, 
  roomId: {
    type : String,
    required : true
  }, 
  
},{ timestamps: true });

module.exports = mongoose.model('Media', messageSchema);
