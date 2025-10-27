// client/src/pages/Students/StudentAssignmentView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function StudentAssignmentView() {
    // Note: Parameter name changed to assignmentId for clarity
    const { id: assignmentId } = useParams(); 
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Holds the student's specific submission record (file, date, grade)
    const [submission, setSubmission] = useState(null); 
    
    // Submission Form State
    const [submittedFile, setSubmittedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");

    // Read token outside fetch for dependency array and initial check
    const token = localStorage.getItem("token"); 

    const fetchAssignment = async () => {
        // Stop if ID or Token is missing
        if (!assignmentId || !token) { 
            setLoading(false);
            setError("User not logged in or session expired. Please log in again.");
            return;
        }

        try {
            // 1. Fetch Assignment Details (The question)
            const assignmentRes = await axios.get(`http://localhost:5000/api/assignments/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignment(assignmentRes.data);

            // 2. Fetch Student's Submission Record (Marks/File/Feedback) - CRITICAL FIX URL
            const submissionRes = await axios.get(`http://localhost:5000/api/assignments/student/submission/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubmission(submissionRes.data); // Should receive the graded object here

        } catch (err) {
            // Handle 404 silently (if no submission exists)
            if (err.response?.status === 404) {
                setSubmission(null);
            } else {
                console.error("Assignment fetch error:", err);
                // The JWT error also comes here, and setting error will show the message
                setError(err.response?.data?.message || err.message); 
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignment();
    }, [assignmentId, token]);

    // ----------------- Submission Handlers -----------------

    const handleFileChange = (e) => {
        setSubmittedFile(e.target.files[0]);
        setUploadMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!submittedFile) {
            setUploadMessage("Please select a file to upload.");
            return;
        }

        try {
            setUploadMessage("Uploading...");
            const formData = new FormData();
            formData.append("submitted_file", submittedFile);

            await axios.post(
                `http://localhost:5000/api/assignments/student/upload/${assignmentId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setUploadMessage("Assignment uploaded successfully! Page refreshing...");
            setSubmittedFile(null);
            fetchAssignment(); // Refresh data to show updated status
        } catch (err) {
            console.error("Submission Error:", err);
            setUploadMessage(
                err.response?.data?.message || "Failed to upload assignment."
            );
        }
    };
    
    // ----------------- Rendering Logic -----------------

    if (loading) return <p>Loading assignment...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!assignment) return <p>Assignment not found.</p>;

    // Determine status based on the submission object
    const isSubmitted = !!submission?.submitted_file;
    const isGraded = submission?.isGraded;
    
    // Status Logic
    let statusText = "Pending";
    let statusColor = "orange";
    
    if (isGraded) {
        statusText = "Graded";
        statusColor = "blue";
    } else if (isSubmitted) {
        statusText = "Submitted (Awaiting Grade)";
        statusColor = "green";
    }
    
    // File paths
    const teacherFilePath = `http://localhost:5000/uploads/assignments/teacher/${assignment.assignment_file_q}`;
    const studentFilePath = `http://localhost:5000/uploads/assignments/student/${submission?.submitted_file}`;


    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto", border: '1px solid #ddd', padding: '20px' }}>
            <h2>{assignment.subject} - {assignment.category}</h2>
            
            {/* Assignment Details */}
            <p><strong>Semester:</strong> {assignment.semester}</p>
            <p><strong>Division:</strong> {assignment.division}</p>
            <p>
                <strong>Status:</strong> <span style={{ color: statusColor, fontWeight: 'bold' }}>{statusText}</span>
            </p>

            {/* Graded Details */}
            {isGraded && (
                <div style={{ border: '2px solid blue', padding: '15px', marginTop: '20px' }}>
                    <h3>✅ Graded!</h3>
                    <p><strong>Marks:</strong> {submission.marks} / 100</p>
                    <p><strong>Grade:</strong> {submission.grade}</p>
                    <p><strong>Teacher Feedback:</strong> {submission.feedback || "No specific feedback provided."}</p>
                </div>
            )}

            {/* Teacher's Question File */}
            {assignment.assignment_file_q && (
                <p>
                    <a href={teacherFilePath} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                        📥 Download Question File
                    </a>
                </p>
            )}
            
            {/* Student's Submission File */}
            {isSubmitted && submission?.submitted_file && (
                <p>
                    <strong>Your Submitted File:</strong> 
                    <a href={studentFilePath} target="_blank" rel="noreferrer" style={{ marginLeft: '10px' }}>
                        View/Download
                    </a>
                    {submission.submissionDate && 
                        <small style={{ marginLeft: '15px', color: '#666' }}>Submitted on: {new Date(submission.submissionDate).toLocaleString()}</small>
                    }
                </p>
            )}
            
            <hr style={{ margin: '20px 0' }} />

            {/* ASSIGNMENT SUBMISSION FORM */}
            <h3 style={{ marginBottom: '15px' }}>Submit Your Work</h3>
            {uploadMessage && <p style={{ color: uploadMessage.includes("success") ? "green" : "red" }}>{uploadMessage}</p>}
            
            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    name="submitted_file"
                    onChange={handleFileChange} 
                    required 
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button 
                    type="submit" 
                    disabled={!submittedFile}
                    style={{ marginLeft: '10px', padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {isSubmitted ? 'Resubmit Assignment' : 'Upload Submission'}
                </button>
            </form>
            
        </div>
    );
}