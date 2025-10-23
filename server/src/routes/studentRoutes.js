const User = require("../models/User");
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Student = require("../models/Student");

const {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getProfile,
  // updateProfile,
  // uploadProfileImage,
} = require("../controllers/studentController");

const auth = require("../middleware/auth");

// Multer config for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/students");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Profile routes
// router.get("/:id/profile", auth, getProfile);
  // router.put("/:id/profile", auth, updateProfile);
  // router.post("/:id/profile-picture", auth, upload.single("student_image"), uploadProfileImage);
// GET logged-in student profile
// GET logged-in student profile
router.get("/profile/me", auth, async (req, res) => {
  try {
    // 1️⃣ Get the logged-in User from JWT
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Find the corresponding Student by email
    const student = await Student.findOne({ email: user.email }).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    // 3️⃣ Return the student profile
    res.status(200).json(student);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Student CRUD routes
router.post("/", addStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);


module.exports = router;
