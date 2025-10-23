// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollNo: { type: String, required: true }, // ✅ Add this
  class: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  guardian: { type: String, required: true },
  guardian_phone: { type: String, required: true },
  image: { type: String, default: "" },
});

module.exports = mongoose.model("Student", studentSchema);
