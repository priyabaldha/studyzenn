// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require("../models/Message"); // Updated structure
const MessageStatus = require("../models/MessageStatus"); // New model
const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
// ----------------- Helper: Fetch Recipients -----------------


// 1. GET /api/messages/recipients
// Fetches a list of all users that can be messaged (for dropdown)
router.get("/recipients", auth, async (req, res) => {
    try {
        // Fetch all users but exclude the password field
        const recipients = await User.find().select('_id name email role');
        
        // Optionally, filter out the currently logged-in user
        const list = recipients.filter(user => user._id.toString() !== req.user.id);
        
        res.json(list);
    } catch (error) {
        console.error("Fetch recipients error:", error);
        res.status(500).json({ message: "Failed to fetch recipient list." });
    }
});


// ----------------- Send Message -----------------

// 2. POST /api/messages - Handles both individual and group send (REVISED)
router.post("/", auth, async (req, res) => {
    try {
        const { recipientId, targetRole, targetSemester, targetDivision, subject, body } = req.body;
        const senderId = req.user.id;
        
        let newMessage;

        // --- 1. Validation and Role Check ---
        if (targetRole || (targetSemester && targetDivision)) {
             // Admin/Teacher check for mass send
             if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
                 return res.status(403).json({ message: "Access denied for group messaging." });
             }
        }
        
        if (!subject || !body || (!recipientId && !targetRole && !targetSemester)) {
             return res.status(400).json({ message: "Recipient/Target, subject, and body are required." });
        }

        // --- 2. Create Single Message Record ---
        newMessage = new Message({
            senderId,
            recipientId: recipientId || null,
            subject,
            body,
            targetRole: targetRole || null,
            targetSemester: targetSemester || null,
            targetDivision: targetDivision || null,
        });

        await newMessage.save();

        res.status(201).json({ 
            message: `Message sent successfully!`, 
            messageType: recipientId ? 'Individual' : 'Group'
        });

    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ message: "Failed to send message." });
    }
});

// ----------------- Inbox/Outbox Views -----------------

// 3. GET /api/messages/inbox (HYBRID Fetch)
router.get("/inbox", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role; // Assuming role is in JWT
        
        // Fetch student profile for class filtering (only if they are a student)
        let userSemester, userDivision;
        if (userRole === 'student') {
            const student = await Student.findOne({ email: req.user.email }).select('semester division');
            userSemester = student?.semester;
            userDivision = student?.division;
        }

        // --- 1. Build Query for Messages (Message Model) ---
        let messageQuery = { $or: [
            // Case 1: Individual messages sent directly to me
            { recipientId: userId },
            // Case 2: Group/System messages I qualify for
            {
                $and: [
                    { recipientId: null }, // Must be a group message
                    { $or: [
                        // A: Targeted by Role (e.g., ALL_STUDENTS, ALL_TEACHERS, or ALL)
                        { targetRole: userRole },
                        { targetRole: 'all' },
                        
                        // B: Targeted by Class (only check if I am a student)
                        ...(userRole === 'student' ? [{
                            targetSemester: userSemester,
                            targetDivision: userDivision
                        }] : [])
                    ]}
                ]
            }
        ]};

        const receivedMessages = await Message.find(messageQuery)
            .populate('senderId', 'name email role')
            .sort({ sentDate: -1 });

        const messageIds = receivedMessages.map(m => m._id);

        // --- 2. Fetch Read Status for all these messages (MessageStatus Model) ---
        const statusRecords = await MessageStatus.find({
            messageId: { $in: messageIds },
            userId: userId
        });

        const statusMap = statusRecords.reduce((map, status) => {
            map[status.messageId.toString()] = status;
            return map;
        }, {});

        // --- 3. Combine Message Data with Read Status ---
        const inbox = receivedMessages.map(msg => {
            const status = statusMap[msg._id.toString()];
            return {
                ...msg.toObject(),
                readStatus: status ? status.readStatus : false, // Default to unread
                statusId: status?._id // Useful if we want to delete/update status later
            };
        });

        res.json(inbox);
    } catch (error) {
        console.error("Fetch hybrid inbox error:", error);
        res.status(500).json({ message: "Failed to fetch inbox." });
    }
});

// 4. GET /api/messages/sent
// Get all messages sent by the logged-in user
router.get("/sent", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find messages where the logged-in user is the sender
        // Populate recipient details for display
        const sent = await Message.find({ senderId: userId })
            .populate('recipientId', 'name email role')
            .sort({ sentDate: -1 });

        res.json(sent);
    } catch (error) {
        console.error("Fetch sent messages error:", error);
        res.status(500).json({ message: "Failed to fetch sent messages." });
    }
});


// ----------------- View Single Message -----------------

// 5. GET /api/messages/:id (View Single Message & Mark Read)
router.get("/:id", auth, async (req, res) => {
    try {
        const messageId = req.params.id;
        const userId = req.user.id;

        const message = await Message.findById(messageId)
            .populate('senderId', 'name email role');

        if (!message) return res.status(404).json({ message: "Message not found." });

        // --- 1. Security Check (Simplified for Hybrid) ---
        // We only check if it's NOT a 1-to-1 message for someone else. 
        if (message.recipientId && message.recipientId.toString() !== userId && message.senderId._id.toString() !== userId) {
            return res.status(403).json({ message: "Access denied." });
        }

        // --- 2. Mark as Read (Create/Update Status Record) ---
        const status = await MessageStatus.findOneAndUpdate(
            { messageId: messageId, userId: userId },
            { $set: { readStatus: true, readDate: Date.now() } },
            { upsert: true, new: true } // Creates the status record if it doesn't exist
        );

        // --- 3. Return Combined Message Data ---
        const fullMessage = {
            ...message.toObject(),
            readStatus: status.readStatus,
            readDate: status.readDate
        };

        res.json(fullMessage);

    } catch (error) {
        console.error("View message error:", error);
        res.status(500).json({ message: "Failed to fetch message." });
    }
});

// 6. DELETE /api/messages/:id (Delete a message record)
router.delete("/:id", auth, async (req, res) => {
    try {
        const messageId = req.params.id;
        const userId = req.user.id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Message not found." });
        }

        // Security check: Only the sender or the specific recipient can delete their copy.
        if (message.senderId.toString() !== userId && message.recipientId?.toString() !== userId) {
             return res.status(403).json({ message: "Access denied. Not authorized to delete this message." });
        }
        
        // Delete the single message record (this removes the copy from sender/recipient who initiated delete)
        await Message.findByIdAndDelete(messageId);

        res.json({ message: "Message deleted successfully." });

    } catch (error) {
        console.error("Delete message error:", error);
        res.status(500).json({ message: "Failed to delete message." });
    }
});
 
router.post("/", auth, async (req, res) => {
    try {
        const { recipientId, targetGroup, targetSemester, targetDivision, subject, body } = req.body;
        const senderId = req.user.id;
        
        // Array to hold the IDs of the final recipients
        let finalRecipientIds = [];

        // --- 1. Determine Recipients (One-to-One vs. Group) ---
        if (recipientId) {
            // Case 1: Individual message (1-to-1)
            finalRecipientIds.push(recipientId);

        } else if (targetGroup && req.user.role === 'admin') {
            // Case 2: Admin group messages (e.g., ALL_TEACHERS)
            let query = {};
            if (targetGroup === 'ALL_TEACHERS') query = { role: 'teacher' };
            else if (targetGroup === 'ALL_STUDENTS') query = { role: 'student' };
            
            const groupUsers = await User.find(query).select('_id');
            finalRecipientIds = groupUsers.map(u => u._id);

        } else if (targetSemester && targetDivision && (req.user.role === 'admin' || req.user.role === 'teacher')) {
            // Case 3: Division message (Teacher/Admin to a specific class)
            const students = await Student.find({ 
                semester: targetSemester, 
                division: targetDivision 
            }).select('email');
            
            // Look up User IDs based on student emails
            const userEmails = students.map(s => s.email);
            const targetUsers = await User.find({ email: { $in: userEmails } }).select('_id');
            finalRecipientIds = targetUsers.map(u => u._id);
            
        } else {
            return res.status(400).json({ message: "Invalid recipient information provided." });
        }
        
        // Filter out the sender from the list
        finalRecipientIds = finalRecipientIds.filter(id => id.toString() !== senderId.toString());

        if (finalRecipientIds.length === 0) {
            return res.status(400).json({ message: "No valid recipients found." });
        }

        // --- 2. Create Multiple Message Records (Fan-out) ---
        const messagesToCreate = finalRecipientIds.map(id => ({
            senderId,
            recipientId: id,
            subject,
            body
        }));

        await Message.insertMany(messagesToCreate);

        res.status(201).json({ 
            message: `Message sent successfully to ${finalRecipientIds.length} recipient(s).` 
        });

    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ message: "Failed to send message." });
    }
});

module.exports = router;