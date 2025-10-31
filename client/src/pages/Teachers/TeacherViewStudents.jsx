import React, { useEffect, useState } from "react";
import axios from "axios";
import TeacherSlidebar from "../Teachers/components/TeacherSlidebar";
import "../../css/TeachersViewStudents.css"; // ✅ Import CSS file

const TeacherViewStudents = () => {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed backticks
        });
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };
    fetchStudents();
  }, [token]); // ✅ Include token in dependency array

  return (
    <div className="teacher-view-container">
      <TeacherSlidebar />
      <div className="teacher-view-main">
        <div className="teacher-view-card">
          <h2 className="teacher-view-title">Students List (Read-Only)</h2>

          <div className="teacher-view-table-container">
            <table className="teacher-view-table">
              <thead>
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Roll No",
                    "Semester",
                    "Division",
                    "Age",
                    "Gender",
                    "Guardian",
                    "Guardian Phone",
                    "Image",
                  ].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="teacher-view-empty">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.rollNo}</td>
                      <td>{student.semester}</td>
                      <td>{student.division}</td>
                      <td>{student.age}</td>
                      <td>{student.gender}</td>
                      <td>{student.guardian}</td>
                      <td>{student.guardian_phone}</td>
                      <td>
                        {student.student_image ? (
                          <img
                            src={`http://localhost:5000/uploads/students/${student.student_image}`} // ✅ Fixed URL template
                            alt="student"
                            className="teacher-view-image"
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherViewStudents;
