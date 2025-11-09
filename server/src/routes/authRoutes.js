const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Explicit host
    port: 587,              // Standard TLS Port
    secure: false,          // Use STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        ciphers: 'SSLv3'    // Sometimes needed for older Node.js setups
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.error("====================================================================");
        console.error("NODEMAILER AUTH FAILED! Check EMAIL_USER and EMAIL_PASS in your .env");
        console.error("ERROR DETAILS:", error);
        console.error("====================================================================");
    } else {
        console.log("Server is ready to take our messages (Nodemailer OK)");
    }
});

// 🆕 1. POST /forgot-password - Step 1: Initiate Reset and Send OTP
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Security measure: return generic success message but DO NOT send email
            return res.json({ message: "If a user exists with that email, an OTP has been sent." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set token and expiration (10 minutes)
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
        await user.save();

        // ✅ FIXED EMAIL LOGIC: mailOptions is now defined before sendMail is called
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset OTP',
            text: `You requested a password reset. Your One-Time Password (OTP) is: ${otp}. This code is valid for 10 minutes.`,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("OTP Email sent:", info.response); 
        } catch (mailError) {
            // Log authentication/connection errors without crashing the API
            console.error("NODEMAILER AUTH/CONNECTION ERROR:", mailError); 
            // We return success to the client for security, but the teacher should check logs if they report no email
            return res.status(500).json({ error: "Failed to send OTP. Check server logs for config error." });
        }

        res.json({ message: "OTP sent to your email." });

    } catch (err) {
        console.error("Forgot password general error:", err);
        res.status(500).json({ error: "Failed to process reset request." });
    }
});


// 🆕 2. POST /verify-otp - Step 2: Verify OTP
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        res.json({ message: "OTP verified. Proceed to set new password." });

    } catch (err) {
        console.error("Verify OTP error:", err);
        res.status(500).json({ error: "Verification failed." });
    }
});


// 🆕 3. POST /reset-password - Step 3: Set New Password
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired OTP. Please restart the reset process." });
        }

        // Hash and update password
        user.password = await bcrypt.hash(newPassword, 10);

        // Clear reset fields after successful update
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password successfully updated. You can now log in." });

    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ error: "Password reset failed." });
    }
});


// Signup route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "student" // fallback to student
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Signup failed" });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed" });
    }
});


module.exports = router;