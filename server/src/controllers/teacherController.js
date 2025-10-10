// controllers/teacherController.js
const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
console.log("REQ BODY:", req.body);
exports.addTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      designation,
      phone,
      address,
      teacher_image,
    } = req.body;

    // Check for required fields
    if (!name || !email || !password || !department || !designation) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user for login
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
    });

    await user.save();

    // Create teacher profile
    const teacher = new Teacher({
      name,
      email,
      department,
      designation,
      phone,
      address,
      teacher_image,
    });

    await teacher.save();

    res.status(201).json({ message: "Teacher created successfully", teacher });
  } catch (err) {
    console.error("Error adding teacher:", err);
    res.status(500).json({ error: "Failed to create teacher" });
  }
};


// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password"); // Hide password
    res.json(teachers);
  } catch (err) {
    console.error("Failed to fetch teachers:", err);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
};
