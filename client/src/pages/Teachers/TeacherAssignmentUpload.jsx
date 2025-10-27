import React, { useState, useEffect } from "react";
import axios from "axios";
// 🆕 Import Link from react-router-dom
import { Link } from "react-router-dom"; 

// Define possible values (keep these consistent)
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

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchAssignments = async () => {
    try {
      // ⚠️ Note: This route fetches all assignments regardless of who uploaded them. 
      // It might be better to filter by teacherId if you implement that in the backend.
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
        { 
            headers: { 
                Authorization: `Bearer ${token}`,
                // Ensure the Content-Type is not set manually for FormData
            } 
        }
      );

      setMessage(res.data.message);
      setForm({ subject: "", semester: SEMESTER_OPTIONS[0] || "", division: DIVISION_OPTIONS[0] || "", category: "Theory" });
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
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
        
        {/* Dropdown for Semester */}
        <select name="semester" value={form.semester} onChange={handleChange} required>
          {SEMESTER_OPTIONS.map(sem => (<option key={sem} value={sem}>{sem}</option>))}
        </select>
        
        {/* Dropdown for Division */}
        <select name="division" value={form.division} onChange={handleChange} required>
          {DIVISION_OPTIONS.map(div => (<option key={div} value={div}>Division {div}</option>))}
        </select>
        
        {/* Category dropdown */}
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="Theory">Theory</option>
          <option value="Practical">Practical</option>
        </select>
        
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      <h3 style={{ marginTop: '30px' }}>Uploaded Assignments</h3>
      {assignments.length === 0 ? (
        <p>No assignments uploaded yet.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {assignments.map((a) => (
            <li key={a._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ flexGrow: 1 }}>
                <strong>{a.subject}</strong> - {a.semester} - {a.division} - {a.category}{" "}
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                {a.assignment_file_q && (
                  <a href={`http://localhost:5000/uploads/assignments/teacher/${a.assignment_file_q}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '5px', border: '1px solid #007bff', color: '#007bff' }}>
                    View Question
                  </a>
                )}
                
                {/* 🆕 NEW BUTTON/LINK TO GRADING PAGE */}
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