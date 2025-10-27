// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const User = require("../models/User"); // Assuming User is needed to link teacherId

// ----------------- Helper Function: Get Student List for Marking -----------------

// 1. GET /api/attendance/students/:semester/:division
// Fetches list of students for the teacher to mark
router.get("/students/:semester/:division", auth, async (req, res) => {
    try {
        const { semester, division } = req.params;

        // Ensure only authenticated users (Teacher/Admin) can fetch this list
        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied." });
        }

        const students = await Student.find({
            semester: semester,
            division: division
        }).select('_id name rollNo'); // Only send necessary fields

        res.json(students);
    } catch (error) {
        console.error("Fetch students for attendance error:", error);
        res.status(500).json({ message: "Failed to fetch student list." });
    }
});


// ----------------- Main Function: Save Attendance -----------------

// 2. POST /api/attendance/save
// Receives an array of attendance records from the frontend
router.post("/save", auth, async (req, res) => {
    try {
        const attendanceRecords = req.body.records; // Expects an array of {studentId, date, status}
        const teacherId = req.user.id; // ID of the teacher/user taking attendance

        if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
            return res.status(400).json({ message: "No attendance records provided." });
        }

        const operations = attendanceRecords.map(record => {
            // Clean and validate data
            const dateOnly = new Date(record.date).setHours(0, 0, 0, 0); // Normalize date to prevent duplicates
            
            return {
                updateOne: {
                    filter: { studentId: record.studentId, date: dateOnly },
                    update: { 
                        $set: { 
                            status: record.status, 
                            teacherId: teacherId 
                        } 
                    },
                    upsert: true // Insert if not found, update if exists (overwrite previous marking)
                }
            };
        });

        const result = await Attendance.bulkWrite(operations);

        res.status(200).json({ 
            message: "Attendance saved successfully.",
            details: result 
        });

    } catch (error) {
        // Log the error detail
        console.error("Save attendance error:", error);
        res.status(500).json({ message: "Failed to save attendance." });
    }
});

router.get("/student/me", auth, async (req, res) => {
    try {
        // Ensure the request is from a student
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: "Access denied. Only students can view this route." });
        }

        // Find the student profile using the authenticated user's email
        const studentProfile = await Student.findOne({ email: req.user.email });
        if (!studentProfile) {
            return res.status(404).json({ message: "Student profile not found." });
        }

        // Fetch all attendance records for this student, sorted by date
        const attendanceHistory = await Attendance.find({ studentId: studentProfile._id })
            .select('date status') // Only fetch date and status
            .sort({ date: -1 });

        res.status(200).json(attendanceHistory);
    } catch (error) {
        console.error("Fetch student attendance error:", error);
        res.status(500).json({ message: "Failed to fetch attendance history." });
    }
});

router.get("/admin/report/:semester/:division", auth, async (req, res) => {
    try {
        const { semester, division } = req.params;

        // 1. Role Check
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only administrators can view this report." });
        }

        // 2. Find all students in the specified class
        const students = await Student.find({ semester, division }).select('_id name rollNo');
        
        if (students.length === 0) {
            return res.status(404).json({ message: "No students found for this class." });
        }
        
        const studentIds = students.map(s => s._id);

        // 3. Get all attendance records for these students
        // We use $in to query all records belonging to the list of student IDs
        const attendanceRecords = await Attendance.find({ studentId: { $in: studentIds } });

        // 4. Calculate Attendance Summary (Client-side aggregation)
        const summaryMap = {};
        
        // Initialize summary map with student details
        students.forEach(student => {
            summaryMap[student._id] = {
                id: student._id,
                name: student.name,
                rollNo: student.rollNo,
                Present: 0,
                Absent: 0,
                Late: 0,
                Total: 0
            };
        });

        // Tally up the records by status
        attendanceRecords.forEach(record => {
            const studentSummary = summaryMap[record.studentId];
            if (studentSummary) {
                studentSummary[record.status] += 1;
                studentSummary.Total += 1;
            }
        });

        // Convert the map back to an array and calculate percentage
        const report = Object.values(summaryMap).map(s => {
            const total = s.Total;
            // Count Present and Late as attended days
            const presentOrLate = s.Present + s.Late; 
            const percentage = total > 0 ? Math.round((presentOrLate / total) * 100) : 0;
            return {
                ...s,
                percentage: percentage,
                Absent: total - presentOrLate // Total records minus attended records
            };
        });

        res.status(200).json(report);

    } catch (error) {
        console.error("Admin attendance report error:", error);
        res.status(500).json({ message: "Failed to generate attendance report." });
    }
});

// ----------------- Reporting/History Routes (for later) -----------------
// router.get("/teacher/history", auth, ...); 
// router.get("/student/me", auth, ...); 

module.exports = router;