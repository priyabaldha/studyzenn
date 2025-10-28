// routes/subjectRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Subject = require("../models/Subject");

// Middleware to ensure user is Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin required." });
    }
    next();
};

// 1. POST /api/subjects (Add New Subject)
router.post("/", auth, isAdmin, async (req, res) => {
    try {
        const { name, semester, code, description } = req.body;
        
        const newSubject = new Subject({ name, semester, code, description });
        await newSubject.save();
        
        res.status(201).json({ message: "Subject added successfully!", subject: newSubject });
    } catch (error) {
        console.error("Add subject error:", error);
        res.status(500).json({ message: "Failed to add subject." });
    }
});

// 2. GET /api/subjects (Get All Subjects, or filtered by semester)
router.get("/", auth, async (req, res) => {
    try {
        const { semester } = req.query;
        
        // Build query based on optional semester filter
        const query = {};
        if (semester) {
            query.semester = semester;
        }

        const subjects = await Subject.find(query).sort({ semester: 1, name: 1 });
        
        res.json(subjects);
    } catch (error) {
        console.error("Fetch subjects error:", error);
        res.status(500).json({ message: "Failed to fetch subjects." });
    }
});

// 3. PUT /api/subjects/:id (Update Subject)
router.put("/:id", auth, isAdmin, async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedSubject) {
            return res.status(404).json({ message: "Subject not found." });
        }

        res.json({ message: "Subject updated successfully!", subject: updatedSubject });
    } catch (error) {
        console.error("Update subject error:", error);
        res.status(500).json({ message: "Failed to update subject." });
    }
});

// 4. DELETE /api/subjects/:id (Delete Subject)
router.delete("/:id", auth, isAdmin, async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

        if (!deletedSubject) {
            return res.status(404).json({ message: "Subject not found." });
        }

        res.json({ message: "Subject deleted successfully." });
    } catch (error) {
        console.error("Delete subject error:", error);
        res.status(500).json({ message: "Failed to delete subject." });
    }
});

module.exports = router;