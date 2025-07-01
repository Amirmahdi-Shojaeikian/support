const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        routeAccessId: [{
            type: mongoose.Types.ObjectId,
            ref: "RouteAccess",
            require: false
        }],
        type: {
            type: String,
            enum : ["admin","others"],
            required: true
        },
        organizationId: {
            type: mongoose.Types.ObjectId,
            ref: "Carmodel",
            require: false
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Role", Schema);
