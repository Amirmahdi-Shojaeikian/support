const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        default: null
    },
    isSeen:{
        type : Boolean,
        default : false
    }

}, { timestamps: true });

const message = mongoose.model('MessageTicket', messageSchema);
module.exports = message;
