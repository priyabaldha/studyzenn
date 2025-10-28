// models/Subject.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true // Subject names should typically be unique
    },
    semester: {
        type: String,
        enum: ["1st", "2nd", "3rd", "4th", "5th", "6th"], // Match your existing semester options
        required: true
    },
    code: { // Optional: A short code for the subject (e.g., CS401)
        type: String,
        unique: true,
        trim: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model("Subject", subjectSchema);