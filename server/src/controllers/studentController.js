const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 🧑‍💻 Create a new student (admin)
const addStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      semester, // New field
      division, // New field
      age,
      gender,
      guardian,
      guardian_phone,
      student_image,
      rollNo,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !semester || !division || !age || !gender || !guardian || !guardian_phone || !rollNo) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Check existing student
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: "Student with this email already exists." });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student record
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      semester, // Updated field
      division, // Updated field
      age,
      gender,
      guardian,
      guardian_phone,
      student_image,
      rollNo,
    });
    await newStudent.save();

    // Create login user
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

// 📋 Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// 🧑 Get student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// ✏️ Update student (admin)
const updateStudent = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Hash password if it's being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
      
      // Also update the password in the User collection if the email is provided in the updates.
      if (updates.email) {
          await User.findOneAndUpdate(
              { email: updates.email },
              { password: updates.password }
          );
      }
    }

    // Find and update the student document
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // Update name/email in User collection if they were updated
    if (updates.name || updates.email) {
        await User.findOneAndUpdate(
            { email: updatedStudent.email },
            { 
                name: updatedStudent.name,
                email: updatedStudent.email,
            }
        );
    }

    res.json({ message: "Student updated", student: updatedStudent });
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ error: "Failed to update student" });
  }
};

// 🗑️ Delete student
const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // Also delete the associated user login record
    await User.findOneAndDelete({ email: deletedStudent.email, role: "student" });

    res.json({ message: "Student and associated user deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// 👤 Get profile (student self or admin)
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// ✅ Final export
module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getProfile,
};