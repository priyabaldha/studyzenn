// pages/Teachers/TeacherSubmissionReview.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

// Note: You might need another component here to first select the assignment

const SubmissionReview = () => {
    const { id: assignmentId } = useParams(); // ID of the main assignment question
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [grading, setGrading] = useState(null); // Submission ID currently being graded
    const [marks, setMarks] = useState({});
    const [feedback, setFeedback] = useState({});

    const token = localStorage.getItem("token");

    const fetchSubmissions = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/assignments/teacher/submissions/${assignmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubmissions(res.data);

            // Initialize marks and feedback states
            const initialMarks = {};
            const initialFeedback = {};
            res.data.forEach(sub => {
                initialMarks[sub._id] = sub.marks || "";
                initialFeedback[sub._id] = sub.feedback || "";
            });
            setMarks(initialMarks);
            setFeedback(initialFeedback);

        } catch (err) {
            console.error("Fetch submissions error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (assignmentId) fetchSubmissions();
    }, [assignmentId, token]);

    const handleGradeSubmit = async (submissionId) => {
        try {
            const submissionMarks = marks[submissionId];
            const submissionFeedback = feedback[submissionId];
            
            // Simple validation
            if (!submissionMarks) {
                alert("Please enter marks.");
                return;
            }

            await axios.patch(
                `http://localhost:5000/api/assignments/teacher/grade/${submissionId}`,
                { 
                    marks: submissionMarks,
                    grade: submissionMarks >= 70 ? "A" : (submissionMarks >= 50 ? "B" : "C"), // Simple auto-grade logic
                    feedback: submissionFeedback 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Grade saved successfully!");
            setGrading(null);
            fetchSubmissions(); // Refresh list
        } catch (err) {
            console.error("Grading error:", err);
            alert("Failed to save grade.");
        }
    };

    if (loading) return <p>Loading submissions...</p>;

    return (
        <div style={{ maxWidth: "900px", margin: "2rem auto" }}>
            <h2>Submissions for Assignment: {assignmentId}</h2> {/* Use assignment title here */}
            
            {submissions.length === 0 ? (
                <p>No submissions yet.</p>
            ) : (
                <table border="1" cellPadding="10" width="100%">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Roll No</th>
                            <th>Date Submitted</th>
                            <th>File</th>
                            <th>Marks</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((sub) => (
                            <tr key={sub._id}>
                                <td>{sub.studentId.name}</td>
                                <td>{sub.studentId.rollNo}</td>
                                <td>{new Date(sub.submissionDate).toLocaleString()}</td>
                                <td>
                                    <a 
                                        href={`http://localhost:5000/uploads/assignments/student/${sub.submitted_file}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                    >
                                        Download File
                                    </a>
                                </td>
                                <td>{sub.marks || 'N/A'}</td>
                                <td style={{ color: sub.isGraded ? 'blue' : 'green' }}>
                                    {sub.isGraded ? 'Graded' : 'Submitted'}
                                </td>
                                <td>
                                    {grading === sub._id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <input
                                                type="number"
                                                placeholder="Marks (0-100)"
                                                value={marks[sub._id]}
                                                onChange={(e) => setMarks({...marks, [sub._id]: e.target.value})}
                                                max="100"
                                                min="0"
                                            />
                                            <textarea
                                                placeholder="Feedback"
                                                value={feedback[sub._id]}
                                                onChange={(e) => setFeedback({...feedback, [sub._id]: e.target.value})}
                                            />
                                            <button onClick={() => handleGradeSubmit(sub._id)}>Save Grade</button>
                                            <button onClick={() => setGrading(null)} style={{ background: 'gray' }}>Cancel</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setGrading(sub._id)}>
                                            {sub.isGraded ? 'Edit Grade' : 'Grade'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SubmissionReview;