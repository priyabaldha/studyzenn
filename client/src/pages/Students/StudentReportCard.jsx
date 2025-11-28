// pages/Students/StudentReportCard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { Link, useNavigate } from "react-router-dom";

export default function StudentReportCard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Fetch Report Data
  const fetchReport = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/reports/student/performance",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report.");
      console.error("Report fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [token]);

  // Download Report Card as PDF
  const handleDownloadPDF = () => {
    if (!report) return;

    const element = document.getElementById("report-card-content");
    const filename = `ReportCard_${report.profile.rollNo}_${report.profile.semester}.pdf`;

    const opt = {
      margin: 0.5,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const gradeCalc = (obtained, max) => {
    if (!max) return "N/A";
    const p = (obtained / max) * 100;
    if (p >= 90) return "A+";
    if (p >= 75) return "B";
    if (p >= 50) return "C";
    return "F";
  };

  if (loading) return <p>Generating performance report...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!report) return <p>No data available to generate report.</p>;

  const { profile, attendance, examResults, assignmentStatus } = report;

  return (
    <>
      {/* ================ Header ================= */}
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
                <ul
                  className="navbar-nav d-flex align-items-center"
                  style={{
                    gap: "5px", // reduced spacing (was 20px)
                    fontWeight: "500",
                  }}
                >
                  <li>
                    <Link to="/dashboard/student" style={{ color: "#fff", textDecoration: "none" }}>
                      Home
                    </Link>
                  </li>
                
                  <li>
                    <Link to="/student/assignments" style={{ color: "#fff", textDecoration: "none" }}>
                      Assignments
                    </Link>
                  </li>
                
                  <li>
                    <Link to="/student/attendance" style={{ color: "#fff", textDecoration: "none" }}>
                      Attendance
                    </Link>
                  </li>
                
                  <li className="dropdown">
                    <a
                      className="dropdown-toggle"
                      href="#"
                      data-bs-toggle="dropdown"
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      Exam
                    </a>
                    <div className="dropdown-menu">
                      <Link className="dropdown-item" to="/student/exam-schedule">
                        Exam Schedule
                      </Link>
                      <Link className="dropdown-item" to="/student/results">
                        Exam Results
                      </Link>
                      <Link className="dropdown-item" to="/student/report-card">
                        Report Card
                      </Link>
                    </div>
                  </li>
                
                  <li>
                    <Link to="/student/profile" style={{ color: "#fff", textDecoration: "none" }}>
                      Profile
                    </Link>
                  </li>
                
                  {/* Notice Icon */}
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <Link
                      to="/messages"
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                      }}
                      title="Notice Board"
                    >
                      <i className="lnr lnr-bullhorn"></i>
                    </Link>
                  </li>
                
                  {/* Welcome Text */}
                  <li
                    className="nav-item d-flex align-items-center"
                    style={{ color: "#fff", fontWeight: "600", marginLeft: "10px" }}
                  >
                    👋 Welcome,&nbsp;
                    <strong>{user.name}</strong>&nbsp;
                    [{user.role}]
                  </li>
                
                  {/* Logout Button */}
                  <li className="nav-item" style={{ marginLeft: "10px" }}>
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-light btn-sm"
                      style={{ padding: "3px 10px" }}
                    >
                      Logout
                    </button>
                  </li>
                
                  {/* Search Icon */}
                  <li style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}>
                    <button
                      className="search btn btn-link p-0"
                      onClick={() => setShowSearch(true)}
                      style={{ color: "#fff" }}
                    >
                      <span className="lnr lnr-magnifier" id="search"></span>
                    </button>
                  </li>
                                </ul>
              </div>
            </div>
          </nav>

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
                    placeholder="Search Here"
                  />
                  <button type="submit" className="btn"></button>
                  <span
                    className="lnr lnr-cross"
                    title="Close Search"
                    onClick={() => setShowSearch(false)}
                  ></span>
                </form>
              </div>
            </div>
          )}
        </header>
      )}
      {/* ================ End Header ================= */}

      {/* ================ Banner ================= */}
      <section
        className="banner-area"
        style={{
          position: "relative",
          backgroundImage: "url('/img/banner-bg.png')",
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
            justifyContent: "flex-end",
            alignItems: "flex-end",
            height: "350px",
          }}
        >
          <div
            className="banner-right"
            style={{
              textAlign: "right",
              maxWidth: "500px",
              color: "#fff",
              marginRight: "80px",
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
              Report Card
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
              Review your academic performance with ease.
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
                  to="/student/report-card"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Report Card
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* ================ End Banner ================= */}

      {/* ================ Report Section ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "15vh",
          width: "100vw",
          backgroundColor: "white",
          flexDirection: "column",
          paddingBottom: "50px", 
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "900px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          <h2>📚 Combined Performance Report</h2>

          <button
            onClick={handleDownloadPDF}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              marginBottom: "20px",
              cursor: "pointer",
            }}
          >
            ⬇️ Download Report Card (PDF)
          </button>

          <div
            id="report-card-content"
            style={{
              padding: "30px",
              border: "1px solid #333",
              backgroundColor: "white",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                borderBottom: "2px solid #333",
                paddingBottom: "10px",
              }}
            >
              STUDENT REPORT CARD
            </h1>

            {/* Profile Details */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                fontSize: "1.1em",
              }}
            >
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Roll No:</strong> {profile.rollNo}</p>
              <p><strong>Class:</strong> {profile.semester} / {profile.division}</p>
            </div>

            {/* Attendance Summary */}
            <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px", marginTop: "30px" }}>
              Attendance Summary
            </h3>
            <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0" }}>
              <p><strong>Total Days:</strong> {attendance.totalDays}</p>
              <p><strong>Present:</strong> {attendance.presentDays}</p>
              <p>
                <strong>Percentage:</strong>{" "}
                <span style={{ fontWeight: "bold", color: attendance.percentage < 75 ? "red" : "green" }}>
                  {attendance.percentage}%
                </span>
              </p>
            </div>

            {/* Exam Results */}
            <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px", marginTop: "30px" }}>
              Exam Performance
            </h3>
            {examResults.length > 0 ? (
              <table border="1" cellPadding="10" width="100%" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th>Subject</th>
                    <th>Exam Title</th>
                    <th>Marks</th>
                    <th>Max Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {examResults.map((r) => (
                    <tr key={r._id}>
                      <td>{r.examId.subjectId.name}</td>
                      <td>{r.examId.title}</td>
                      <td>{r.marksObtained}</td>
                      <td>{r.examId.maxMarks}</td>
                      <td>{gradeCalc(r.marksObtained, r.examId.maxMarks)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No published exam results found.</p>
            )}

            {/* Assignment Status */}
            <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px", marginTop: "30px" }}>
              Assignment Status
            </h3>
            {assignmentStatus.length > 0 ? (
              <table border="1" cellPadding="10" width="100%" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th>Subject</th>
                    <th>Submission Status</th>
                    <th>Grading Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentStatus.map((a, i) => (
                    <tr key={i}>
                      <td>{a.subject} ({a.title})</td>
                      <td style={{ color: a.submitted ? "green" : "red" }}>
                        {a.submitted ? "Submitted" : "Missing"}
                      </td>
                      <td style={{ color: a.isGraded ? "blue" : "gray" }}>
                        {a.isGraded ? "Graded" : "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No assignments found for this class.</p>
            )}
          </div>
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
