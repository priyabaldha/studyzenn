import React, { useState } from "react";
import axios from "axios";
import AdminHeader from "../Admin/components/AdminHeader";
import AdminSlidebar from "../Admin/components/AdminSlidebar";
import "../../css/AdminAttendanceReport.css";

const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

export default function AdminAttendanceReport() {
  const [filter, setFilter] = useState({
    semester: SEMESTER_OPTIONS[0],
    division: DIVISION_OPTIONS[0],
  });
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    'Select a class and click "Generate Report".'
  );

  const token = localStorage.getItem("token");

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const generateReport = async () => {
    setLoading(true);
    setMessage("");
    setReport([]);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/admin/report/${filter.semester}/${filter.division}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReport(res.data);
      setMessage(`Report generated for ${res.data.length} students.`);
    } catch (err) {
      console.error("Admin report error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to generate report. Check server status or class existence.";
      setMessage(`Error: ${errorMessage}`);
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (report.length === 0) {
      alert("No data to download.");
      return;
    }

    const headers = [
      "Roll No",
      "Student Name",
      "Semester",
      "Division",
      "Total Days",
      "Present",
      "Late",
      "Absent",
      "Percentage",
    ].join(",");

    const csvRows = report.map((student) => {
      return [
        student.rollNo,
        `"${student.name}"`,
        filter.semester,
        filter.division,
        student.Total,
        student.Present,
        student.Late,
        student.Absent,
        student.percentage + "%",
      ].join(",");
    });

    const csvContent = headers + "\n" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const fileName = `Attendance_Report_${filter.semester}_Div${filter.division}.csv`;

    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-attendance-page">
      <AdminHeader />
      <AdminSlidebar />

      <main className="admin-attendance-main">
        <div className="attendance-box">
          <h2 className="attendance-title">Attendance Report</h2>

          <div className="attendance-filter">
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

            <button
              className="btn-generate"
              onClick={generateReport}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>

            {report.length > 0 && (
              <button className="btn-download" onClick={downloadReport}>
                ⬇️ Download CSV
              </button>
            )}
          </div>

          <p
            className={`attendance-message ${
              report.length > 0 ? "success" : ""
            }`}
          >
            {message}
          </p>

          {report.length > 0 && (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Total Days</th>
                  <th>Present</th>
                  <th>Late</th>
                  <th>Absent</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {report.map((student) => (
                  <tr key={student.id}>
                    <td>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td>{student.Total}</td>
                    <td className="present">{student.Present}</td>
                    <td className="late">{student.Late}</td>
                    <td className="absent">{student.Absent}</td>
                    <td
                      className={
                        student.percentage >= 75 ? "good" : "bad"
                      }
                    >
                      {student.percentage}%
                    </td>
                    <td>
                      {student.percentage >= 75
                        ? "Satisfactory"
                        : "🚨 Low"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
