import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TeacherSlidebar from "./components/TeacherSlidebar";
import "../../css/TeacherAssignmentUpload.css";

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
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState([]);

  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  useEffect(() => {
    const fetchAvailableSubjects = async () => {
      if (!form.semester) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/subjects?semester=${form.semester}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAvailableSubjects(res.data);
        if (!res.data.find((sub) => sub.name === form.subject)) {
          setForm((prev) => ({
            ...prev,
            subject: res.data.length > 0 ? res.data[0].name : "",
          }));
        }
      } catch (err) {
        console.error("Fetch subjects error:", err);
        setAvailableSubjects([]);
      }
    };
    fetchAvailableSubjects();
  }, [form.semester, token]);

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
    if (!form.subject) return setMessage("Error: Please select a subject.");

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

      setMessage("✅ Assignment uploaded successfully!");
      setFile(null);
      fetchAssignments();
    } catch (err) {
      console.error("Upload Error:", err);
      setMessage(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="teacher-upload-wrapper">
      <TeacherSlidebar />

      {/* ✅ Centered Layout Wrapper */}
      <div
        className="upload-container"
        style={{
          marginLeft: "250px", // space for sidebar
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #ffffff 60%, #eef2ff)",
          padding: "40px 20px",
        }}
      >
        <div
          className="upload-card"
          style={{
            width: "100%",
            maxWidth: "800px",
            background: "linear-gradient(135deg, #ffffff 70%, #f3f4ff)",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(127, 127, 213, 0.2)",
            padding: "35px",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h2 className="upload-title">Upload Assignment</h2>
          {message && <p className="message">{message}</p>}

          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label>Semester</label>
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
              >
                {SEMESTER_OPTIONS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                disabled={availableSubjects.length === 0}
              >
                {availableSubjects.length === 0 ? (
                  <option value="">No Subjects for {form.semester}</option>
                ) : (
                  availableSubjects.map((sub) => (
                    <option key={sub.code} value={sub.name}>
                      {sub.name} ({sub.code})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Division</label>
              <select
                name="division"
                value={form.division}
                onChange={handleChange}
              >
                {DIVISION_OPTIONS.map((div) => (
                  <option key={div} value={div}>
                    Division {div}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assignment File</label>
              <input type="file" onChange={handleFileChange} />
            </div>

            <button type="submit" className="upload-btn">
              Upload Assignment
            </button>
          </form>
        </div>

        {/* ✅ Uploaded Assignments Card */}
        <div
          className="uploaded-list"
          style={{
            width: "100%",
            maxWidth: "800px",
            background: "linear-gradient(135deg, #ffffff 70%, #f3f4ff)",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(127, 127, 213, 0.2)",
            padding: "25px 30px",
            textAlign: "center",
          }}
        >
          <h3>📚 Uploaded Assignments</h3>
          {assignments.length === 0 ? (
            <p className="no-data">No assignments uploaded yet.</p>
          ) : (
            <ul>
              {assignments.map((a) => (
                <li key={a._id} className="assignment-item">
                  <div className="assignment-info">
                    <strong>{a.subject}</strong> ({a.semester} / {a.division}) —{" "}
                    {a.category}
                  </div>
                  <div className="assignment-actions">
                    {a.assignment_file_q && (
                      <a
                        href={`http://localhost:5000/uploads/assignments/teacher/${a.assignment_file_q}`}
                        target="_blank"
                        rel="noreferrer"
                        className="view-btn"
                      >
                        View Question
                      </a>
                    )}
                    <Link
                      to={`/teacher/assignments/${a._id}/review`}
                      className="grade-btn"
                    >
                      Grade Submissions
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
