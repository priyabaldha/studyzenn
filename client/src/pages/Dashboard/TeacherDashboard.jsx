import React from "react";
import { Link } from "react-router-dom";
import { hasRole } from "../../utils/roleCheck";

const TeacherDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!hasRole(["teacher"])) {
    return <h3>Access Denied: You do not have permission to view this page.</h3>;
  }

  if (!user || user.role !== "teacher") {
    return <h3>Access Denied: You do not have permission to view this page.</h3>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Teacher Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <ul>
        <p>
          <Link to="/teacher/students">📄 View Students</Link>
        </p>
        <div className="student-links">
            <p>
              <Link to="/teacher/profile" className="btn btn-primary m-2">
                👤 View Profile
              </Link>
            </p>
            <p>
              <Link to="/teacher/upload-assignment" className="btn btn-primary m-2">
                👤 Upload-assignment
              </Link>
            </p>
        
            <p>
              <Link to="/teacher/attendance" className="btn btn-primary m-2">
                👤 Attendance
              </Link>
            </p>
            <p>
              <Link to="/messages" className="btn btn-primary m-2">
                👤 Messages
              </Link>
            </p>
            <p>
              <Link to="/teacher/schedule-exam" className="btn btn-primary m-2">
                👤 Schedule-exam
              </Link>
            </p>
            <p>
              <Link to="/teacher/result-entry" className="btn btn-primary m-2">
                👤 Result-entry
              </Link>
            </p>
            
        </div>
        <li>📝 Manage Students</li>
        <li>📊 View Reports</li>
        <li>📅 Assign Subjects</li>
      </ul>
    </div>
  );
};

export default TeacherDashboard;
