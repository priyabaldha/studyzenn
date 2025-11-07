// pages/Students/StudentAttendance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function StudentAttendance() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    total: 0,
    percentage: 0,
  });
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/attendance/student/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setHistory(data);

      // Calculate stats
      const totalDays = data.length;
      const presentDays = data.filter(
        (record) => record.status === "Present" || record.status === "Late"
      ).length;
      const absentDays = totalDays - presentDays;
      const percentage =
        totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      setStats({
        present: presentDays,
        absent: absentDays,
        total: totalDays,
        percentage: percentage,
      });
    } catch (err) {
      console.error("Fetch attendance error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch attendance history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) return <p>Loading attendance history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const statusStyle = (status) => {
    switch (status) {
      case "Present":
        return { color: "green", fontWeight: "bold" };
      case "Absent":
        return { color: "red", fontWeight: "bold" };
      case "Late":
        return { color: "orange", fontWeight: "bold" };
      default:
        return {};
    }
  };

  return (
    <>
      {/* ================ Start Header Area ================= */}
      {token && user && (
        <header className="default-header">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container">
              <h1 className="navbar-brand mb-0" style={{ color: "#ffffff", fontWeight: "700" }}>
                STUDYZEN
              </h1>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="lnr lnr-menu"></span>
              </button>

              <div
                className="collapse navbar-collapse justify-content-end align-items-center"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav">
                  <li>
                    <Link to="/dashboard/student">Home</Link>
                  </li>
                  <li>
                    <Link to="/student/assignments">Assignments</Link>
                  </li>
                  <li>
                    <Link to="/student/attendance">Attendance</Link>
                  </li>
                  <li>
                    <Link to="/messages">Notice</Link>
                  </li>

                  {/* Dropdown: Exam */}
                  <li className="dropdown">
                    <a
                      className="dropdown-toggle"
                      href="#"
                      data-bs-toggle="dropdown"
                    >
                      Exam
                    </a>
                    <div className="dropdown-menu">
                      <Link
                        className="dropdown-item"
                        to="/student/exam-schedule"
                      >
                        Exam Schedule
                      </Link>
                      <Link className="dropdown-item" to="/student/results">
                        Exam Results
                      </Link>
                      <Link className="dropdown-item" to="/student/report-card">
                        Report-card
                      </Link>
                    </div>
                  </li>

                  <li>
                    <Link to="/student/profile">Profile</Link>
                  </li>

                  {/* Welcome + Logout */}
                  <li className="nav-item d-flex align-items-center ms-3">
                    <b><strong style={{ color: "#fff" }}>👋 Welcome,</strong></b>&nbsp;
                    <b><strong style={{ color: "#fff" }}>{user.name}</strong></b>&nbsp;
                    <b><span style={{ color: "#fff" }}>[{user.role}]</span></b>
                  </li>
                  
                  <li className="nav-item ms-2">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-light btn-sm"
                    >
                      Logout
                    </button>
                  </li>

                  {/* Search Button */}
                  <li>
                    <button
                      className="search"
                      onClick={() => setShowSearch(true)}
                    >
                      <span className="lnr lnr-magnifier" id="search"></span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Search Input Box */}
          {showSearch && (
            <div className="search-input" id="search-input-box">
              <div className="container">
                <form
                  className="d-flex justify-content-between"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="search-input"
                    placeholder="Search Here"
                  />
                  <button type="submit" className="btn"></button>
                  <span
                    className="lnr lnr-cross"
                    id="close-search"
                    title="Close Search"
                    onClick={() => setShowSearch(false)}
                  ></span>
                </form>
              </div>
            </div>
          )}
        </header>
      )}
      {/* ================ End Header Area ================= */}

      {/* ================ Start Banner Area ================= */} 
        <section
        className="banner-area"
        style={{
            position: "relative",
            backgroundImage: "url('/img/banner-bg.png')", // your wave image here
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "120px 0",
            overflow: "hidden",
        }}
        >
        <div
            className="container"
            style={{
            display: "flex",
            justifyContent: "flex-end", // move text to right
            alignItems: "flex-end",     // move text to bottom
            height: "350px",            // adjust height to match image
            }}
        >
            <div
            className="banner-right"
            style={{
                textAlign: "right",
                maxWidth: "500px",
                color: "#fff",
            }}
            >
            <h1
                className="text-white"
                style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: "48px",
                marginBottom: "10px",
                }}
            >
                Attendance
            </h1>

            <p
                className="mx-auto text-white mt-20 mb-40"
                style={{
                color: "#fff",
                fontSize: "18px",
                marginTop: "10px",
                marginBottom: "30px",
                }}
            >
                Track your daily attendance with ease and accuracy. 
            </p>

            <div className="link-nav">
                <span className="box" style={{ color: "#fff" }}>
                <Link
                    to="/dashboard/student"
                    style={{
                    color: "#fff",
                    textDecoration: "none",
                    marginRight: "8px",
                    }}
                >
                    Home
                </Link>
                <i className="lnr lnr-arrow-right" style={{ margin: "0 8px" }}></i>
                <Link
                    to="/about"
                    style={{ color: "#fff", textDecoration: "none" }}
                >
                    About
                </Link>
                </span>
            </div>
            </div>
        </div>
        </section>
        {/* ================ End Banner Area ================= */}


      {/* ================ Attendance Section ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "15vh",
          width: "100vw",
          backgroundColor: "white",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "800px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>My Attendance Summary</h2>

          {/* Attendance Statistics Card */}
          <div
            style={{
              padding: "15px",
              marginBottom: "30px",
              border: "2px solid #007bff",
              borderRadius: "8px",
              background: "#f8f9fa",
            }}
          >
            <p style={{ fontSize: "1.2em", margin: "0 0 10px 0" }}>
              Overall Attendance:
              <span
                style={{
                  color: stats.percentage >= 75 ? "green" : "red",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
              >
                {stats.percentage}%
              </span>
            </p>
            <p>Total Days Recorded: {stats.total}</p>
            <p>Days Present/Late: {stats.present}</p>
            <p>Days Absent: {stats.absent}</p>
            {stats.percentage < 75 && (
              <p style={{ color: "red", fontWeight: "bold" }}>
                ⚠️ Warning: Your attendance is below 75%.
              </p>
            )}
          </div>

          {/* History Table */}
          <h3>Detailed History</h3>
          {history.length === 0 ? (
            <p>No attendance records found yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                border="1"
                cellPadding="10"
                width="100%"
                style={{
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                <thead style={{ backgroundColor: "#007bff", color: "white" }}>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record._id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td style={statusStyle(record.status)}>
                        {record.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================ Start Footer Area ================= */}
      <footer className="footer-area section-gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 single-footer-widget">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 single-footer-widget">
              <h4>Features</h4>
              <ul>
                <li><a href="#">Assignments</a></li>
                <li><a href="#">Grades</a></li>
                <li><a href="#">Attendance</a></li>
                <li><a href="#">Reports</a></li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 single-footer-widget">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">User Guide</a></li>
                <li><a href="#">Teacher Portal</a></li>
                <li><a href="#">Student Guide</a></li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 single-footer-widget">
              <h4>Stay Updated</h4>
              <p>Get StudyZen news and updates.</p>
              <form className="d-flex align-items-center">
                <input
                  className="form-control me-2"
                  type="email"
                  placeholder="Your Email"
                  required
                  style={{ flex: 1, minWidth: "0" }}
                />
                <button className="click-btn btn btn-default text-uppercase" type="submit">
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </div>

          <div className="footer-bottom row align-items-center mt-4">
            <p className="footer-text m-0 col-lg-12 text-center">
              © {new Date().getFullYear()} StudyZen | Empowering education with ❤️ by the StudyZen Team.
            </p>
          </div>
        </div>
      </footer>
      {/* ================ End Footer Area ================= */}
    </>
  );
}
