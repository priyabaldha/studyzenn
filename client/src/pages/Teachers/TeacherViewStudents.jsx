import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherViewStudents = () => {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student List (Read-Only)</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th><th>Roll No</th><th>Enrollment No</th><th>Department</th><th>Semester</th><th>Division</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.rollNo}</td>
              <td>{s.enrollmentNo}</td>
              <td>{s.department}</td>
              <td>{s.semester}</td>
              <td>{s.division}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherViewStudents;
