// models/Result.js
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    marksObtained: {
        type: Number,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    }
});

// Ensures a student can only have one result record per exam
resultSchema.index({ examId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);