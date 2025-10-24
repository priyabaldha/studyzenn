const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Teacher = require("../models/Teacher");
const User = require("../models/User"); // ✅ make sure this exists and is correct
const auth = require("../middleware/auth");
const path = require("path");
const multer = require("multer");

// Multer config for teacher image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/teachers");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Update teacher profile (text fields)
router.put("/profile/update", auth, async (req, res) => {
  try {
    const { qualification, age, gender } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const teacher = await Teacher.findOneAndUpdate(
      { email: user.email },
      { qualification, age, gender },
      { new: true }
    ).select("-password");

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json({ message: "Profile updated successfully", teacher });
  } catch (err) {
    console.error("Update teacher profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Upload teacher profile image
router.post("/profile/upload-image", auth, upload.single("teacher_image"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const teacher = await Teacher.findOneAndUpdate(
      { email: user.email },
      { teacher_image: req.file.filename },
      { new: true }
    ).select("-password");

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json({ message: "Image uploaded successfully", teacher });
  } catch (err) {
    console.error("Upload teacher image error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Create Teacher (and User for login)
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      qualification,
      age,
      gender,
      teacher_image,
    } = req.body;

    if (!name || !email || !password || !qualification) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create User
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
    });
    await user.save();

    // ✅ Create Teacher Profile
    const newTeacher = new Teacher({
      name,
      email,
      qualification,
      age,
      gender,
      teacher_image,
    });
    await newTeacher.save();

    res.status(201).json({ message: "Teacher created successfully" });
  } catch (err) {
    console.error("Create teacher error:", err);
    res.status(500).json({ error: "Failed to create teacher" });
  }
});

// ✅ Get All Teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

// ✅ Get Teacher by ID
router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: "Error fetching teacher" });
  }
});

// ✅ Update Teacher Profile (not user login details)
router.put("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // we don't update password here
    const updated = await Teacher.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update teacher" });
  }
});

// ✅ Delete Teacher and linked user
router.delete("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    await Teacher.findByIdAndDelete(req.params.id);
    await User.findOneAndDelete({ email: teacher.email }); // also delete user account
    res.json({ message: "Teacher and user deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete teacher" });
  }
});

router.get("/profile/me", auth, async (req, res) => {
  try {
    // 1️⃣ Get the logged-in user from token
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Find the corresponding teacher
    const teacher = await Teacher.findOne({ email: user.email }).select("-password");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // 3️⃣ Return the teacher profile
    res.status(200).json(teacher);
  } catch (err) {
    console.error("Teacher profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
