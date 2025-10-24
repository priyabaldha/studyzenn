const User = require("../models/User");
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const Student = require("../models/Student");

const {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getProfile,
} = require("../controllers/studentController");

const auth = require("../middleware/auth");

// ✅ Ensure upload folder exists
const uploadDir = "uploads/students";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer config for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET logged-in student profile
router.get("/profile/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const student = await Student.findOne({ email: user.email }).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Upload student profile image
router.post("/profile/upload-image", auth, upload.single("student_image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const student = await Student.findOneAndUpdate(
      { email: req.user.email },
      { student_image: req.file.filename },
      { new: true }
    ).select("-password");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Image uploaded successfully", student });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

// ✅ Student CRUD routes
router.post("/", addStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
