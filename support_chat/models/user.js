const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {

    name: {
      type : String,
      required : true
    },
    email: {
      type : String,
      required : false
    },
    phonNumber: {
      type : String,
      required : false
    },
    roomId: {
      type : String,
      required : false
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
