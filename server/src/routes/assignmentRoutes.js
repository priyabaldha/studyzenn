// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const Giving_Assignments = require("../models/Giving_Assignments");
const Student = require("../models/Student");
const Student_Submission = require("../models/Student_Submission");
const User = require("../models/User");

// ----------------- Multer setup -----------------
const teacherStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/assignments/teacher");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const teacherUpload = multer({ storage: teacherStorage });

const studentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/assignments/student");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const studentUpload = multer({ storage: studentStorage });

// ----------------- Teacher Routes -----------------

// Upload assignment (Teacher)
router.post("/upload", auth, teacherUpload.single("assignment_file_q"), async (req, res) => {
  try {
    const { subject, semester, division, category } = req.body;
    const teacherId = req.user.id; // teacher ID from JWT

    const newAssignment = new Giving_Assignments({
      teacherId,
      subject,
      semester,
      division,
      category,
      assignment_file_q: req.file ? req.file.filename : null,
      upload_status: false,
    });

    await newAssignment.save();
    res.status(201).json({ message: "Assignment uploaded successfully!" });
  } catch (error) {
    console.error("Teacher upload error:", error);
    res.status(500).json({ message: "Failed to upload assignment." });
  }
});

// Get all assignments (Teacher view)
router.get("/", auth, async (req, res) => {
  try {
    const assignments = await Giving_Assignments.find().sort({ uploadDate: -1 });
    res.json(assignments);
  } catch (error) {
    console.error("Teacher fetch error:", error);
    res.status(500).json({ message: "Failed to fetch assignments." });
  }
});

// ----------------- Student Routes -----------------

// ✅ PRIORITY 1 (MUST COME FIRST): Get assignments list for logged-in student (specific path: /student)
router.get("/student", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.user.email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const assignments = await Giving_Assignments.find({
      semester: student.semester,
      division: student.division,
    }).sort({ uploadDate: -1 });

    res.status(200).json(assignments);
  } catch (err) {
    console.error("Fetch student assignments error:", err);
    res.status(500).json({ message: "Failed to fetch assignments." });
  }
});

// ✅ ADDED FIX: Get a single student's submission for an assignment (Fixes 404 in StudentAssignmentView)
router.get("/student/submission/:assignmentId", auth, async (req, res) => {
  try {
    const studentUser = await User.findById(req.user.id);
    const studentProfile = await Student.findOne({ email: studentUser.email });

    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found." });
    }

    const submission = await Student_Submission.findOne({
      assignmentId: req.params.assignmentId,
      studentId: studentProfile._id
    });

    if (!submission) {
      // 404 is desired if no submission exists yet (Frontend interprets as 'Pending')
      return res.status(404).json({ message: "No submission found for this assignment." });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error("Fetch student submission error:", error);
    res.status(500).json({ message: "Failed to fetch submission details." });
  }
});


// ✅ CORRECTED LOGIC: Upload assignment file by student (Uses Student_Submission model)
router.post(
  "/student/upload/:assignmentId",
  auth,
  studentUpload.single("submitted_file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      // 1. Get student IDs
      const studentUser = await User.findById(req.user.id);
      const studentProfile = await Student.findOne({ email: studentUser.email });
      if (!studentProfile) return res.status(404).json({ message: "Student profile not found" });

      const assignmentId = req.params.assignmentId;

      // 2. Find and update the existing submission, or create a new one
      const submission = await Student_Submission.findOneAndUpdate(
        { assignmentId: assignmentId, studentId: studentProfile._id },
        {
          submitted_file: req.file.filename,
          submissionDate: Date.now(),
          // Reset grading status on re-upload
          isGraded: false,
          marks: null,
          grade: null
        },
        { upsert: true, new: true, setDefaultsOnInsert: true } // upsert: create if not found
      );

      res.json({ message: "Assignment uploaded successfully", submission });
    } catch (err) {
      console.error("Student upload error:", err);
      res.status(500).json({ message: "Failed to upload assignment" });
    }
  }
);


// ----------------- New Teacher Review/Grading Routes -----------------

// ✅ 2. NEW: Get submissions for a specific assignment (Teacher view)
router.get("/teacher/submissions/:assignmentId", auth, async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;

    // Fetch all submissions for this assignment, populating student name/rollNo
    const submissions = await Student_Submission.find({ assignmentId })
      .populate('studentId', 'name rollNo semester division') // Only fetch relevant student fields
      .sort({ submissionDate: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Teacher fetch submissions error:", error);
    res.status(500).json({ message: "Failed to fetch submissions." });
  }
});

// ✅ 3. NEW: Apply grade/marks/feedback to a submission
router.patch("/teacher/grade/:submissionId", auth, async (req, res) => {
  try {
    const { marks, grade, feedback } = req.body;
    const submissionId = req.params.submissionId;

    const updatedSubmission = await Student_Submission.findByIdAndUpdate(
      submissionId,
      {
        marks,
        grade,
        feedback,
        isGraded: true
      },
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.json({ message: "Grade saved successfully!", submission: updatedSubmission });
  } catch (error) {
    console.error("Teacher grading error:", error);
    res.status(500).json({ message: "Failed to save grade." });
  }
});


// ✅ PRIORITY 2 (MUST COME AFTER /student): Get a single assignment by ID (generic path: /:id)
router.get("/:id", auth, async (req, res) => {
  try {
    const assignment = await Giving_Assignments.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.status(200).json(assignment);
  } catch (error) {
    // Catches errors like invalid MongoDB ID format
    console.error("Fetch single assignment error:", error);
    res.status(500).json({ message: "Failed to fetch assignment details." });
  }
});


// ❌ REMOVED THIS REDUNDANT ROUTE: The logic is now in router.post("/student/upload/:assignmentId") above.
// router.post( "/student/upload/:id", ... )

module.exports = router;