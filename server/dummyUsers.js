// dummyUsers.js
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./src/models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("📦 Connected to DB");

  const hashedPassword = await bcrypt.hash("123456", 10); // Same password for testing

  const dummyUsers = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    },
    {
      name: "Teacher User",
      email: "teacher@example.com",
      password: hashedPassword,
      role: "teacher"
    },
    {
      name: "Student User",
      email: "student@example.com",
      password: hashedPassword,
      role: "student"
    }
  ];

  try {
    await User.deleteMany({}); // Optional: clear old
    await User.insertMany(dummyUsers);
    console.log("✅ Dummy users added");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
});
