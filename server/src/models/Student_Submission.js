const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    // Link to the main assignment question
    assignmentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Giving_Assignments", 
        required: true 
    },
    // Link to the student who submitted it
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Student", 
        required: true 
    },
    
    submitted_file: { type: String, required: true },
    submissionDate: { type: Date, default: Date.now },

    // Grading fields
    marks: { type: Number, default: null },
    grade: { type: String, default: null },
    feedback: { type: String, default: "" },
    isGraded: { type: Boolean, default: false },
});

// Ensures a student can only submit one file per assignment
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Student_Submission", submissionSchema);