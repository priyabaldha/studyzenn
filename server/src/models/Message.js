// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    // --- Recipient Fields for HYBRID Model ---
    
    // For 1-to-1 messages (will be null for group messages)
    recipientId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    
    // For Group/Mass messages (used for querying who should receive it)
    targetRole: {
        type: String,
        enum: ['admin', 'teacher', 'student', 'all'], // Targeting by role
        default: null
    },
    targetSemester: { // For Teacher -> specific class
        type: String,
        default: null
    },
    targetDivision: { // For Teacher -> specific class
        type: String,
        default: null
    },
    // ------------------------------------------

    subject: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    sentDate: {
        type: Date,
        default: Date.now
    }
    // We cannot store readStatus here for mass messages. 
    // We will track read status using a new, separate model/collection (see Step 1.2).
});

module.exports = mongoose.model("Message", messageSchema);