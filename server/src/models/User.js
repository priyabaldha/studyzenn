// // models/User.js
// const mongoose = require('mongoose');
// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }, // hashed
//   role: { type: String, enum: ['admin','teacher','student'], required: true },
//   refId: { type: mongoose.Schema.Types.ObjectId }, // link to Student/Teacher doc if needed
//   createdAt: { type: Date, default: Date.now }
// });
// module.exports = mongoose.model('User', UserSchema);


// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin","teacher","student"], required: true },
});

module.exports = mongoose.model("User", userSchema);

