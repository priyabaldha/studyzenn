// pages/Teachers/TeacherSubmissionReview.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TeacherSlidebar from "../Teachers/components/TeacherSlidebar";

const SubmissionReview = () => {
  const { id: assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(null);
  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState({});

  const token = localStorage.getItem("token");
  const sidebarWidth = 250;

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/assignments/teacher/submissions/${assignmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmissions(res.data);

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
              : "C",
          feedback: submissionFeedback,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Grade saved successfully!");
      setGrading(null);
      fetchSubmissions();
    } catch (err) {
      console.error("Grading error:", err);
      alert("Failed to save grade.");
    }
  };

  if (loading) return <p>Loading submissions...</p>;

  return (
    <>
      <style>{`
        :root {
          --sidebar-width: 250px;
          --accent1: #4e54c8;
          --accent2: #8f94fb;
        }

        .review-container {
          margin-left: var(--sidebar-width);
          margin-top: 80px;
          padding: 100px;
          width: calc(100% - var(--sidebar-width));
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffff 60%, #eef2ff);
          font-family: 'Poppins', sans-serif;
        }

        .review-title {
          font-size: 1.9rem;
          font-weight: 700;
          color: var(--accent1);
          margin-bottom: 20px;
          padding-bottom: 6px;
          border-bottom: 3px solid var(--accent2);
          display: inline-block;
        }

        .review-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(78,84,200,0.18);
        }

        .review-table thead tr {
          background: linear-gradient(90deg, var(--accent1), var(--accent2));
          color: #fff;
        }

        .review-table th, .review-table td {
          padding: 14px;
          border-bottom: 1px solid #e8e8ff;
          text-align: left;
        }

        .review-table tbody tr:nth-child(even) {
          background: #f9faff;
        }

        .review-table tbody tr:hover {
          background: #eef2ff;
          transform: scale(1.01);
          transition: 0.1s;
        }

        .status-submitted {
          color: green;
          font-weight: bold;
        }

        .status-graded {
          color: blue;
          font-weight: bold;
        }

        .grade-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .grade-input, .grade-textarea {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ccc;
          background: #fdfdfeff;
          color: black
        }

        .grade-textarea {
          min-height: 70px;
        }

        .btn-save {
          padding: 8px 12px;
          border: none;
          background: var(--accent1);
          color: white;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-cancel {
          padding: 8px 12px;
          border: none;
          background: gray;
          color: white;
          border-radius: 8px;
          cursor: pointer;
        }

        .grade-btn {
          padding: 8px 14px;
          background: var(--accent1);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>

      <TeacherSlidebar />

      <div className="review-container">
        <h2 className="review-title">Submissions</h2>

        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <table className="review-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Date</th>
                <th>File</th>
                <th>Marks</th>
                <th>Status</th>
                <th>Grade</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id}>
                  <td>{sub.studentId?.name}</td>
                  <td>{sub.studentId?.rollNo}</td>
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
                        Download
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>

                  <td>{sub.marks || "N/A"}</td>

                  <td className={sub.isGraded ? "status-graded" : "status-submitted"}>
                    {sub.isGraded ? "Graded" : "Submitted"}
                  </td>

                  <td>
                    {grading === sub._id ? (
                      <div className="grade-box">
                        <input
                          type="number"
                          className="grade-input"
                          value={marks[sub._id]}
                          onChange={(e) =>
                            setMarks({ ...marks, [sub._id]: e.target.value })
                          }
                          max="100"
                          min="0"
                        />

                        <textarea
                          className="grade-textarea"
                          value={feedback[sub._id]}
                          onChange={(e) =>
                            setFeedback({ ...feedback, [sub._id]: e.target.value })
                          }
                        />

                        <button
                          className="btn-save"
                          onClick={() => handleGradeSubmit(sub._id)}
                        >
                          Save Grade
                        </button>

                        <button
                          className="btn-cancel"
                          onClick={() => setGrading(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="grade-btn"
                        onClick={() => setGrading(sub._id)}
                      >
                        {sub.isGraded ? "Edit" : "Grade"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default SubmissionReview;
