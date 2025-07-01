const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        uniqueId : {
            type: String,
            required: true,
            unique: true,
        },
        country: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        phoneNumber: {
            type: String,
            required: true
        },
        PostalCode: {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: false
        },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model("Organization", Schema);
