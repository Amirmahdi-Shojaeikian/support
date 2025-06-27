const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const supportSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);
supportSchema.pre("save" ,  function (){
  const salt = bcrypt.genSaltSync(10)
  this.password = bcrypt.hashSync(this.password,salt)

})

supportSchema.pre("update" ,  function (){
  const salt = bcrypt.genSaltSync(10)
  this.password = bcrypt.hashSync(this.password,salt)

})


module.exports = mongoose.model("Support", supportSchema);



    // online: {
    //   type: Boolean,
    //   default: false,
    // },
    // assignedUsers: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    //   },
    // ],
    // accessToken: {
    //     type:String,
    //     default : "",
    //     required : false 
    // },