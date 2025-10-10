const Student = require("../models/Student");
const User = require("../models/User");  
const bcrypt = require("bcryptjs");

// Create a new student (admin)
const addStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      class: studentClass,
      age,
      gender,
      guardian,
      guardian_phone,
      student_image,
      rollNo,
    } = req.body;

    // Validation
    if (!name || !email || !password || !studentClass || !age || !gender || !guardian || !guardian_phone || !rollNo) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Check in Student collection
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: "Student with this email already exists." });
    }

    // Also check in User collection to avoid duplicate login accounts
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      class: studentClass,
      age,
      gender,
      guardian,
      guardian_phone,
      student_image,
      rollNo,
    });

    await newStudent.save();

    // Create user for login
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });
    await newUser.save();

    res.status(201).json({ message: "Student created successfully and login user created." });

  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ error: "Failed to add student" });
  }
};



// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// Update a student
const updateStudent = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student updated", student: updatedStudent });
  } catch (err) {
    res.status(500).json({ error: "Failed to update student" });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete student" });
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
