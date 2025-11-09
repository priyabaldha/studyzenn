// src/index.js
require('dotenv').config();
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("./src/middleware/auth"); // make sure this file exists
const studentRoutes = require("./src/routes/studentRoutes");
const authRoutes = require("./src/routes/authRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");
const userRoutes = require("./src/routes/userRoutes");
const path = require("path");
const assignmentRoutes = require("./src/routes/assignmentRoutes");
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const subjectRoutes = require('./src/routes/subjectRoutes');
const examResultRoutes = require('./src/routes/examResultRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());require('dotenv').config(); 
app.use(cookieParser());

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/assignments", assignmentRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/api/attendance', attendanceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api', examResultRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

// protected route
app.get("/api/admin/dashboard", auth, (req, res) => {
  res.json({ message: `Hello ${req.user.role}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
