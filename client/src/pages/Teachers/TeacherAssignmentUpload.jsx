// pages/Teachers/TeacherAssignmentUpload.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 

// Define options (keep these consistent)
const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

export default function TeacherAssignmentUpload() {
    const [form, setForm] = useState({
        subject: "", 
        semester: SEMESTER_OPTIONS[0] || "",
        division: DIVISION_OPTIONS[0] || "",
        category: "Theory",
    });
    const [file, setFile] = useState(null);
    const [assignments, setAssignments] = useState([]); // Assignments fetched from API
    const [message, setMessage] = useState("");
    const [availableSubjects, setAvailableSubjects] = useState([]); 

    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Effect 1: Fetch subjects whenever the SEMESTER changes
    useEffect(() => {
        const fetchAvailableSubjects = async () => {
            if (!form.semester) return;
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/subjects?semester=${form.semester}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAvailableSubjects(res.data);
                if (!res.data.find(sub => sub.name === form.subject)) {
                    setForm(prev => ({ ...prev, subject: res.data.length > 0 ? res.data[0].name : "" }));
                }
            } catch (err) {
                console.error("Fetch subjects error:", err);
                setAvailableSubjects([]);
            }
        };
        fetchAvailableSubjects();
    }, [form.semester, token]); 

    // Effect 2: Fetch all assignments for the list
    const fetchAssignments = async () => {
        try {
            // API: GET /api/assignments (Fetch all assignments)
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

            await axios.post(
                "http://localhost:5000/api/assignments/upload",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("Assignment uploaded successfully!");
            setForm(prev => ({ ...prev, subject: availableSubjects.length > 0 ? availableSubjects[0].name : "", category: "Theory" }));
            setFile(null);
            fetchAssignments(); // Refresh the list
        } catch (err) {
            console.error("Upload Error:", err);
            setMessage(err.response?.data?.message || "Upload failed");
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
            <h2>Upload Assignment</h2>
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
            
            {/* ... Form Section (unchanged) ... */}
            <form onSubmit={handleSubmit}>
                <select name="semester" value={form.semester} onChange={handleChange} required>
                    {SEMESTER_OPTIONS.map(sem => (<option key={sem} value={sem}>{sem}</option>))}
                </select>
                
                <select name="subject" value={form.subject} onChange={handleChange} required disabled={availableSubjects.length === 0}>
                    {availableSubjects.length === 0 ? (
                        <option value="">No Subjects for {form.semester}</option>
                    ) : (
                        availableSubjects.map(sub => (
                            <option key={sub.code} value={sub.name}>{sub.name} ({sub.code})</option>
                        ))
                    )}
                </select>

                <select name="division" value={form.division} onChange={handleChange} required>
                    {DIVISION_OPTIONS.map(div => (<option key={div} value={div}>Division {div}</option>))}
                </select>
                
                <select name="category" value={form.category} onChange={handleChange}>
                    <option value="Theory">Theory</option>
                    <option value="Practical">Practical</option>
                </select>
                
                <input type="file" onChange={handleFileChange} />
                
                <button type="submit" disabled={!form.subject}>Upload</button>

            </form>

            {/* ✅ FIXED: Uploaded Assignments List with Review Link */}
            <h3 style={{ marginTop: '30px' }}>Uploaded Assignments</h3>
            
            {assignments.length === 0 ? (
                <p>No assignments uploaded yet.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {assignments.map((a) => (
                        <li key={a._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexGrow: 1 }}>
                                <strong>{a.subject}</strong> ({a.semester} / {a.division}) - {a.category}{" "}
                            </span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {/* Link to download the question file */}
                                {a.assignment_file_q && (
                                    <a href={`http://localhost:5000/uploads/assignments/teacher/${a.assignment_file_q}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '5px', border: '1px solid #007bff', color: '#007bff' }}>
                                        View Question
                                    </a>
                                )}
                                
                                {/* Link to the grading page */}
                                <Link 
                                    to={`/teacher/assignments/${a._id}/review`} 
                                    style={{ textDecoration: 'none', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', borderRadius: '4px' }}
                                >
                                    Grade Submissions
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}