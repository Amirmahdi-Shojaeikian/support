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
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        },
        phoneNumber: {
            type: String,
            required: false
        },
        roleId: {
            type: String,
            required: false
        },
        active: {
            type: Boolean,
            default: true,
            required: false
        },
        accessToken: {
            type: String,
            default: "",
            required: false
        }

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

module.exports = mongoose.model("UserAdmin", userSchema);
