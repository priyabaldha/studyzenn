// routes/examResultRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Exam = require("../models/Exam");
const Result = require("../models/Result");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

// Middleware to check Admin/Teacher roles
const isAdminOrTeacher = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
        return res.status(403).json({ message: "Access denied. Admin or Teacher required." });
    }
    next();
};

// ----------------- EXAM SCHEDULE MANAGEMENT (Admin/Teacher) -----------------

// 1. POST /api/exams (Create Exam Schedule)
router.post("/exams", auth, isAdminOrTeacher, async (req, res) => {
    try {
        const newExam = new Exam(req.body);
        await newExam.save();
        res.status(201).json({ message: "Exam scheduled successfully!", exam: newExam });
    } catch (error) {
        console.error("Exam schedule error:", error);
        res.status(500).json({ message: "Failed to schedule exam." });
    }
});

// 2. GET /api/exams (Get All Exams, optionally filtered by semester/division)
router.get("/exams", auth, async (req, res) => {
    try {
        const { semester, division } = req.query;
        const query = {};
        if (semester) query.semester = semester;
        if (division) query.division = division;

        const exams = await Exam.find(query)
            .populate('subjectId', 'name code') // Show subject details
            .sort({ examDate: 1 });
            
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch exam schedules." });
    }
});

// ----------------- RESULT ENTRY (Teacher) -----------------

// 3. GET /api/exams/:examId/students (Get students eligible for result entry)
router.get("/exams/:examId/students", auth, isAdminOrTeacher, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.examId);
        if (!exam) return res.status(404).json({ message: "Exam not found." });

        // Find all students in that specific class
        const students = await Student.find({ semester: exam.semester, division: exam.division }).select('_id name rollNo');
        
        // Fetch existing results for this exam to pre-populate the form
        const existingResults = await Result.find({ examId: exam._id });
        const resultsMap = existingResults.reduce((map, result) => {
            map[result.studentId] = result;
            return map;
        }, {});

        // Combine student list with existing marks
        const studentListWithMarks = students.map(student => ({
            studentId: student._id,
            name: student.name,
            rollNo: student.rollNo,
            marksObtained: resultsMap[student._id]?.marksObtained || '',
            resultId: resultsMap[student._id]?._id || null,
        }));

        res.json({ exam, students: studentListWithMarks });
    } catch (error) {
        console.error("Fetch students for result entry error:", error);
        res.status(500).json({ message: "Failed to fetch student list." });
    }
});

// 4. POST /api/results (Submit/Update Exam Results - Bulk Operation)
router.post("/results", auth, isAdminOrTeacher, async (req, res) => {
    try {
        const { examId, results } = req.body; // results is array of {studentId, marksObtained}
        
        if (!examId || !Array.isArray(results)) {
            return res.status(400).json({ message: "Invalid exam or results data." });
        }

        const operations = results.map(r => ({
            updateOne: {
                filter: { examId: examId, studentId: r.studentId },
                update: { $set: { marksObtained: r.marksObtained } },
                upsert: true
            }
        }));

        await Result.bulkWrite(operations);
        
        res.status(200).json({ message: "Results saved successfully!" });
    } catch (error) {
        console.error("Result submission error:", error);
        res.status(500).json({ message: "Failed to save results." });
    }
});

// ----------------- RESULT VIEWING (Student/Admin) -----------------

// 5. GET /api/results/student/me (View own results)
router.get("/results/student/me", auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: "Access denied." });
        }
        
        const studentProfile = await Student.findOne({ email: req.user.email });
        if (!studentProfile) return res.status(404).json({ message: "Student not found." });

        // Fetch all results for the logged-in student
        const studentResults = await Result.find({ studentId: studentProfile._id, isPublished: true })
            .populate({
                path: 'examId',
                select: 'subjectId title examDate maxMarks',
                populate: {
                    path: 'subjectId',
                    select: 'name code' // Get subject name/code from exam
                }
            })
            .sort({ 'examId.examDate': -1 });

        res.json(studentResults);
    } catch (error) {
        console.error("Student result view error:", error);
        res.status(500).json({ message: "Failed to fetch results." });
    }
});

// ----------------- STUDENT VIEWING EXAM SCHEDULE -----------------

// 6. GET /api/exams/student/me (View own exam schedule)
router.get("/exams/student/me", auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: "Access denied." });
        }
        
        const studentProfile = await Student.findOne({ email: req.user.email });
        if (!studentProfile) return res.status(404).json({ message: "Student profile not found." });

        const { semester, division } = studentProfile;

        // Find exams matching the student's class
        const examSchedule = await Exam.find({
            semester: semester,
            division: division
        })
        .populate('subjectId', 'name code') // Display subject details
        .sort({ examDate: 1 }); // Sort by upcoming date

        res.json(examSchedule);
    } catch (error) {
        console.error("Student exam schedule view error:", error);
        res.status(500).json({ message: "Failed to fetch exam schedule." });
    }
});

// 7. PATCH /api/results/publish/:examId (Publish Results)
router.patch("/results/publish/:examId", auth, isAdminOrTeacher, async (req, res) => {
    try {
        const { examId } = req.params;

        // Set isPublished to true for all results belonging to this exam
        const updateResult = await Result.updateMany(
            { examId: examId },
            { $set: { isPublished: true } }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ message: "No results found or already published for this exam." });
        }

        res.status(200).json({ 
            message: `Successfully published results for ${updateResult.modifiedCount} student(s).`,
            modifiedCount: updateResult.modifiedCount 
        });
    } catch (error) {
        console.error("Result publish error:", error);
        res.status(500).json({ message: "Failed to publish results." });
    }
});




module.exports = router;