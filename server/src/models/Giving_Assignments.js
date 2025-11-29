// const mongoose = require("mongoose");

// const assignmentSchema = new mongoose.Schema({
//   teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
//   subject: { type: String, required: true },
//   semester: { type: String, required: true },
//   division: { type: String, required: true },
//   category: { type: String, enum: ["Practical", "Theory"], required: true },
//   assignment_file_q: { type: String }, // uploaded question file
//   uploadDate: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Giving_Assignments", assignmentSchema);


const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    subject: { type: String, required: true },
    semester: { type: String, required: true },
    division: { type: String, required: true },
    category: { type: String, enum: ["Practical", "Theory"], required: true },
    assignment_file_q: { type: String }, // uploaded question file (by teacher)
    uploadDate: { type: Date, default: Date.now },

    // NEW FIELDS FOR STUDENT SUBMISSION TRACKING
    submitted_file: { type: String, default: null }, // Student's uploaded file name
    submissionDate: { type: Date, default: null },   // Date student submitted
    upload_status: { type: Boolean, default: false }, // Status flag
});

module.exports = mongoose.model("Giving_Assignments", assignmentSchema);