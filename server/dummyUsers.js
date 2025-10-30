// dummyUsers.js
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./src/models/User");

// Get the MONGO_URI from the environment file
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ MONGO_URI is not defined in the .env file!");
  process.exit(1);
}

// 1. Connect to the database
mongoose.connect(mongoUri)
  .then(async () => {
    console.log("📦 Connected to DB");

    // 2. Prepare the data
    const hashedPassword = await bcrypt.hash("123456", 10); // Hash the password

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

    // 3. Seed the database
    try {
      // Find out if we need to clean up first
      const existingUsersCount = await User.countDocuments();
      if (existingUsersCount > 0) {
        await User.deleteMany({});
        console.log(`🧹 Cleared ${existingUsersCount} existing users.`);
      }

      const insertedUsers = await User.insertMany(dummyUsers);
      
      console.log(`✅ Dummy users added: ${insertedUsers.length} users inserted.`);
      
      // 4. Exit the process gracefully
      process.exit(0);

    } catch (err) {
      // 5. Catch errors during seeding (e.g., validation, unique constraint)
      console.error("❌ Error seeding users:", err.message);
      process.exit(1);
    }
  })
  // Catch errors during the initial database connection
  .catch((err) => {
    console.error("❌ Mongoose Connection Failed. Check MONGO_URI:", err.message);
    process.exit(1);
  });
