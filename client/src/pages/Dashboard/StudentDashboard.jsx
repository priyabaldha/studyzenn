import React from "react";
import { Link } from "react-router-dom";
import { hasRole } from "../../utils/roleCheck";

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!hasRole(["student"])) {
      return <h3>Access Denied: You do not have permission to view this page.</h3>;
    }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <ul>
        <li>🎓 View Profile</li>
        <li>📄 Check Attendance</li>
        <li>🧪 View Marks</li>
      </ul>
    </div>
  );
};

export default StudentDashboard;
