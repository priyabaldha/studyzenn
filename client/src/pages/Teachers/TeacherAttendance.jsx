import React, { useState } from "react";
import axios from "axios";
import TeacherSlidebar from "../Teachers/components/TeacherSlidebar";
import "../../css/TeacherAttendance.css";

const STATUS_OPTIONS = ["Present", "Absent", "Late"];
const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

export default function TeacherAttendance() {
  const [filter, setFilter] = useState({
    semester: SEMESTER_OPTIONS[0] || "",
    division: DIVISION_OPTIONS[0] || "",
    date: new Date().toISOString().split("T")[0],
  });
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const fetchStudents = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/students/${filter.semester}/${filter.division}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(res.data);
      const initialAttendance = {};
      res.data.forEach((student) => {
        initialAttendance[student._id] = "Present";
      });
      setAttendanceData(initialAttendance);
    } catch (err) {
      console.error("Fetch students error:", err);
      setMessage("❌ Failed to fetch students. Check if the class exists.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const records = students.map((student) => ({
      studentId: student._id,
      date: filter.date,
      status: attendanceData[student._id],
    }));

    try {
      await axios.post(
        "http://localhost:5000/api/attendance/save",
        { records },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ Attendance recorded for ${students.length} students!`);
    } catch (err) {
      console.error("Save attendance error:", err);
      setMessage("❌ Failed to save attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-attendance-wrapper">
      <TeacherSlidebar />

      {/* ✅ Centered Wrapper */}
      <div
        className="attendance-container"
        style={{
          marginLeft: "250px", // make room for sidebar
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #ffffff 60%, #eef2ff)",
          padding: "40px 20px",
        }}
      >
        <div
          className="attendance-card"
          style={{
            width: "100%",
            maxWidth: "900px",
            background: "linear-gradient(135deg, #ffffff 70%, #f3f4ff)",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(127, 127, 213, 0.2)",
            padding: "35px",
            textAlign: "center",
          }}
        >
          <h2 className="attendance-title">Record Daily Attendance</h2>

          <div className="filter-section">
            <select
              name="semester"
              value={filter.semester}
              onChange={handleFilterChange}
              disabled={loading}
            >
              {SEMESTER_OPTIONS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>

            <select
              name="division"
              value={filter.division}
              onChange={handleFilterChange}
              disabled={loading}
            >
              {DIVISION_OPTIONS.map((div) => (
                <option key={div} value={div}>
                  Division {div}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
              disabled={loading}
            />

            <button
              className="fetch-btn"
              onClick={fetchStudents}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Students"}
            </button>
          </div>

          {message && (
            <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </p>
          )}

          {students.length > 0 && (
            <form onSubmit={handleSubmit}>
              <p className="marking-info">
                Marking attendance for <strong>{filter.semester}</strong> – Division{" "}
                <strong>{filter.division}</strong> on {filter.date}
              </p>

              <div
                style={{
                  overflowX: "auto",
                  marginTop: "20px",
                  borderRadius: "10px",
                }}
              >
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td>{student.rollNo}</td>
                        <td>{student.name}</td>
                        <td>
                          <select
                            value={attendanceData[student._id]}
                            onChange={(e) =>
                              handleAttendanceChange(student._id, e.target.value)
                            }
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Attendance"}
              </button>
            </form>
          )}

          {students.length === 0 && !loading && !message && (
            <p className="no-data">
              Select a class and click <strong>Get Students</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
