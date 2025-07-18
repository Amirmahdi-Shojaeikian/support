const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: false 
    },
    email: {
      type: String,
      required: false
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true
    },
    type: {
      type: String,
      enum: ["internal", "external","guest"],
      required: true
    },
    password: {
      type: String,
      required: false
    },
    organizationId: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      require: false
    },
    roleId: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      require: false,
      default: null

    },
    accessToken: {
      type: String,
      default: "",
      required: false
    },
    admin: {
      type: Boolean,
      default: false,
      required: true
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      require: false
    },
    online: {
      type: Boolean,
      default: false
    },
    // roomId: {
    //   type : String,
    //   required : false
    // },

  },
  { timestamps: true }
);
userSchema.pre("save", function () {
  const salt = bcrypt.genSaltSync(10)
  this.password = bcrypt.hashSync(this.password, salt)

})

userSchema.pre("update", function () {
  const salt = bcrypt.genSaltSync(10)
  this.password = bcrypt.hashSync(this.password, salt)

})

module.exports = mongoose.model("User", userSchema);
