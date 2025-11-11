// pages/Teachers/TeacherSubmissionReview.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TeacherSlidebar from "../Teachers/components/TeacherSlidebar";

const SubmissionReview = () => {
  const { id: assignmentId } = useParams(); // Assignment ID from URL
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(null); // Submission ID currently being graded
  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState({});

  const token = localStorage.getItem("token");
  const sidebarWidth = 250; // Estimate sidebar width based on common UI (adjust if necessary)

  // Fetch submissions for this assignment
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
      res.data.forEach((sub) => {
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
      if (submissionMarks === "" || submissionMarks === null) {
        alert("Please enter marks.");
        return;
      }

      await axios.patch(
        `http://localhost:5000/api/assignments/teacher/grade/${submissionId}`,
        {
          marks: submissionMarks,
          grade:
            submissionMarks >= 70
              ? "A"
              : submissionMarks >= 50
              ? "B"
              : "C", // Simple auto-grade logic
          feedback: submissionFeedback,
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
    <div>
      <TeacherSlidebar />
      {/* The main content wrapper is shifted to the right */}
      <div 
            style={{ 
                marginLeft: `${sidebarWidth}px`, // Push content right to clear the sidebar
                padding: "2rem", // Add padding for aesthetics
                // Remove the max-width constraint to let the table use the necessary space
                // Keep the width flexible
                width: `calc(100% - ${sidebarWidth}px)`, 
                boxSizing: 'border-box' // Include padding in width calculation
            }}
        >
        <h2>Submissions for Assignment: </h2>

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
                  <td>{sub.studentId?.name || "N/A"}</td>
                  <td>{sub.studentId?.rollNo || "N/A"}</td>
                  <td>
                    {sub.submissionDate
                      ? new Date(sub.submissionDate).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {sub.submitted_file ? (
                      <a
                        href={`http://localhost:5000/uploads/assignments/student/${sub.submitted_file}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download File
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>
                  <td>{sub.marks || "N/A"}</td>
                  <td
                    style={{
                      color: sub.isGraded ? "blue" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {sub.isGraded ? "Graded" : "Submitted"}
                  </td>
                  <td>
                    {grading === sub._id ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        <input
                          type="number"
                          placeholder="Marks (0–100)"
                          value={marks[sub._id]}
                          onChange={(e) =>
                            setMarks({
                              ...marks,
                              [sub._id]: e.target.value,
                            })
                          }
                          max="100"
                          min="0"
                        />
                        <textarea
                          placeholder="Feedback"
                          value={feedback[sub._id]}
                          onChange={(e) =>
                            setFeedback({
                              ...feedback,
                              [sub._id]: e.target.value,
                            })
                          }
                        />
                        <button onClick={() => handleGradeSubmit(sub._id)}>
                          Save Grade
                        </button>
                        <button
                          onClick={() => setGrading(null)}
                          style={{ background: "gray", color: "white" }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setGrading(sub._id)}>
                        {sub.isGraded ? "Edit Grade" : "Grade"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SubmissionReview;