const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const csvtojson = require('csvtojson'); 
const fs = require('fs');

exports.bulkAddTeachers = async (req, res) => {
    const filePath = req.filePath;
    
    if (!filePath) {
        return res.status(400).json({ error: "No file received for processing." });
    }

    try {
        const teachersJson = await csvtojson().fromFile(filePath);

        const userOperations = [];
        const teacherOperations = [];
        let teachersProcessed = 0;

        for (const teacherData of teachersJson) {
            if (!teacherData.email || !teacherData.name || !teacherData.password || !teacherData.qualification) {
                 continue;
            }

            const hashedPassword = await bcrypt.hash(teacherData.password, 10);
            
            teacherOperations.push({
                updateOne: {
                    filter: { email: teacherData.email },
                    update: { 
                        $set: {
                            name: teacherData.name,
                            qualification: teacherData.qualification,
                            age: teacherData.age || 'N/A',
                            gender: teacherData.gender || 'N/A',
                            teacher_image: teacherData.teacher_image || '',
                        }
                    },
                    upsert: true
                }
            });

            userOperations.push({
                updateOne: {
                    filter: { email: teacherData.email },
                    update: { 
                        $set: {
                            name: teacherData.name,
                            password: hashedPassword,
                            role: 'teacher',
                        }
                    },
                    upsert: true
                }
            });
            teachersProcessed++;
        }

        await Teacher.bulkWrite(teacherOperations, { ordered: false });
        await User.bulkWrite(userOperations, { ordered: false });

        res.status(200).json({ 
            message: `Successfully processed and imported ${teachersProcessed} teachers.`, 
            details: { importedCount: teachersProcessed }
        });

    } catch (error) {
        console.error("Bulk import failed:", error);
        res.status(500).json({ error: "Internal server error during import." });
    } finally {
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting temp CSV file:", err);
        });
    }
};

exports.addTeacher = async (req, res) => {
    // NOTE: This function's logic is fully contained within teacherRoutes.js 
    // for simple single add, so we only need to ensure it's exported.
};

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().select("-password");
        res.json(teachers);
    } catch (err) {
        console.error("Failed to fetch teachers:", err);
        res.status(500).json({ error: "Failed to fetch teachers" });
    }
};