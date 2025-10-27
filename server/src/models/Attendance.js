// models/Attendance.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    teacherId: { // To track who recorded the attendance
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming 'User' or 'Teacher' model tracks login identity
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late"],
        required: true
    }
});

// Ensures a student can only have one attendance record per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);