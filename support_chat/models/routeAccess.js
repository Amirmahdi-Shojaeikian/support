const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        path: {
            type: String,            
            unique: true,
            required: true
        },
        type: {
            type: String,
            enum : ["admin","others"],
            required: true
        },
        // organizationId: {
        //     type: mongoose.Types.ObjectId,
        //     ref: "Carmodel",
        //     require: true
        // },
    },
    { timestamps: true }
);

module.exports = mongoose.model("RouteAccess", Schema);
