// const mongoose = require("mongoose");

// const teacherSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },  // Password field
//   department: { type: String, required: true },
//   designation: { type: String, required: true },
//   phone: { type: String, default: "" },  // Optional fields
//   address: { type: String, default: "" },
//   teacher_image: { type: String, default: "" },
// }, { timestamps: true });

// module.exports = mongoose.model("Teacher", teacherSchema);

const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  qualification: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  teacher_image: { type: String },
});

module.exports = mongoose.model("Teacher", teacherSchema);

