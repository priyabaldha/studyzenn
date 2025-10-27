// models/MessageStatus.js
const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true
    },
    userId: { // The user who received and/or viewed the message
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    readStatus: {
        type: Boolean,
        default: false
    },
    readDate: {
        type: Date,
        default: null
    }
});

// Ensures we track status once per user/message pair
statusSchema.index({ messageId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("MessageStatus", statusSchema);