// src/pages/Students/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("studentToken"); // or from cookies
        const res = await axios.get("http://localhost:5000/api/students/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudent(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Could not load profile.");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p>{error}</p>;
  if (!student) return <p>Loading...</p>;

  return (
    <div className="student-profile">
      <h2>Welcome, {student.name}</h2>
      <p>Email: {student.email}</p>
      <p>Roll No: {student.rollNo}</p>
      <p>Class: {student.class}</p>
      <p>Age: {student.age}</p>
      <p>Gender: {student.gender}</p>
      <p>Guardian: {student.guardian}</p>
      <p>Guardian Phone: {student.guardian_phone}</p>
      {student.student_image && (
        <img src={student.student_image} alt="Student" width="120" />
      )}
    </div>
  );
};

export default StudentProfile;
