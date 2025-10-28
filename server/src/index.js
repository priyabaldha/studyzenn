// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth"); // make sure this file exists
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const assignmentRoutes = require("./routes/assignmentRoutes");
const attendanceRoutes = require('./routes/attendanceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const subjectRoutes = require('./routes/subjectRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
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
