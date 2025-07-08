const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        organizationId: {
            type: mongoose.Types.ObjectId,
            ref: "Organization",
            require: false
        },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model("Department", Schema);
