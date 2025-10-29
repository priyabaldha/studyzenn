// models/Exam.js
const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    title: { // E.g., Midterm Exam, Final Exam, Unit Test
        type: String,
        required: true
    },
    semester: {
        type: String,
        enum: ["1st", "2nd", "3rd", "4th", "5th", "6th"],
        required: true
    },
    division: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true
    },
    examDate: {
        type: Date,
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
    duration: { // Optional: Exam duration in minutes or hours
        type: String,
        default: "3 hours"
    }
});

// Ensures a unique exam schedule entry for a specific subject/class/title/date combination
examSchema.index({ subjectId: 1, semester: 1, division: 1, examDate: 1 }, { unique: true });

module.exports = mongoose.model("Exam", examSchema);