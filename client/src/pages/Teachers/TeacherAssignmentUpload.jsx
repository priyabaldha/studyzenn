// pages/Teachers/TeacherAssignmentUpload.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Assuming Link is used for navigation

// Define options (keep these consistent)
const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

export default function TeacherAssignmentUpload() {
    const [form, setForm] = useState({
        subject: "", // This will hold the selected subject name
        semester: SEMESTER_OPTIONS[0] || "",
        division: DIVISION_OPTIONS[0] || "",
        category: "Theory",
    });
    const [file, setFile] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState("");
    const [availableSubjects, setAvailableSubjects] = useState([]); // 🆕 NEW STATE

    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // 🆕 Effect to fetch subjects whenever the SEMESTER changes
    useEffect(() => {
        const fetchAvailableSubjects = async () => {
            if (!form.semester) return;
            try {
                // Fetch subjects filtered by the selected semester
                const res = await axios.get(
                    `http://localhost:5000/api/subjects?semester=${form.semester}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAvailableSubjects(res.data);
                // Reset selected subject if it no longer exists for this semester
                if (!res.data.find(sub => sub.name === form.subject)) {
                    setForm(prev => ({ ...prev, subject: res.data.length > 0 ? res.data[0].name : "" }));
                }
            } catch (err) {
                console.error("Fetch subjects error:", err);
                setAvailableSubjects([]);
            }
        };
        fetchAvailableSubjects();
    }, [form.semester, token]); // Runs whenever the semester filter changes

    const fetchAssignments = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/assignments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignments(res.data);
        } catch (err) {
            console.error("Fetch assignments error:", err);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.subject) {
             setMessage("Error: Please select a subject.");
             return;
        }

        try {
            const formData = new FormData();
            formData.append("subject", form.subject);
            formData.append("semester", form.semester);
            formData.append("division", form.division);
            formData.append("category", form.category);
            if (file) formData.append("assignment_file_q", file);

            const res = await axios.post(
                "http://localhost:5000/api/assignments/upload",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(res.data.message);
            // Reset form (keep class selectors but clear subject/file)
            setForm(prev => ({ ...prev, subject: availableSubjects.length > 0 ? availableSubjects[0].name : "", category: "Theory" }));
            setFile(null);
            fetchAssignments();
        } catch (err) {
            console.error("Upload Error:", err);
            setMessage(err.response?.data?.message || "Upload failed");
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
            <h2>Upload Assignment</h2>
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                
                {/* 1. SEMESTER DROPDOWN (Filters Subjects) */}
                <select name="semester" value={form.semester} onChange={handleChange} required>
                    {SEMESTER_OPTIONS.map(sem => (<option key={sem} value={sem}>{sem}</option>))}
                </select>
                
                {/* 🆕 2. SUBJECT DROPDOWN (Dynamic based on semester) */}
                <select name="subject" value={form.subject} onChange={handleChange} required disabled={availableSubjects.length === 0}>
                    {availableSubjects.length === 0 ? (
                        <option value="">No Subjects for {form.semester}</option>
                    ) : (
                        availableSubjects.map(sub => (
                            <option key={sub.code} value={sub.name}>{sub.name} ({sub.code})</option>
                        ))
                    )}
                </select>

                {/* 3. DIVISION DROPDOWN */}
                <select name="division" value={form.division} onChange={handleChange} required>
                    {DIVISION_OPTIONS.map(div => (<option key={div} value={div}>Division {div}</option>))}
                </select>
                
                {/* 4. CATEGORY DROPDOWN */}
                <select name="category" value={form.category} onChange={handleChange}>
                    <option value="Theory">Theory</option>
                    <option value="Practical">Practical</option>
                </select>
                
                <input type="file" onChange={handleFileChange} />
                
                <button type="submit" disabled={!form.subject}>Upload</button>

            </form>

            {/* Uploaded Assignments List */}
            <h3 style={{ marginTop: '30px' }}>Uploaded Assignments</h3>
            {/* ... (The rest of the assignment list rendering remains the same) ... */}
        </div>
    );
}