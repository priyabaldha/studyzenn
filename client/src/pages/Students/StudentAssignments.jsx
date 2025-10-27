// client/src/pages/Students/StudentAssignments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You are not logged in.");

        // CORRECT URL: Uses the dedicated backend route /api/assignments/student
        const res = await axios.get(
          "http://localhost:5000/api/assignments/student",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAssignments(res.data);
      } catch (err) {
        console.error("Assignments fetch error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (assignments.length === 0) return <p>No assignments available for your current Semester/Division.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>Assignments</h2>
      <p>Total Assignments: {assignments.length}</p>
      <ul>
        {assignments.map((a) => {
          // 🛑 DEBUGGING STEP: Check if the ID is valid right before rendering the link
          console.log("Rendering Assignment Link for ID:", a._id); 

          return (
            <li 
              key={a._id} 
              style={{ marginBottom: "1rem", borderBottom: '1px solid #ccc', paddingBottom: '10px' }}
            >
              <strong>{a.subject}</strong> | {a.category} | Semester: {a.semester} | Division: {a.division} | Uploaded: {new Date(a.uploadDate).toLocaleDateString()}
              <br />
              <Link to={`/student/assignments/${a._id}`}>View Details</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}