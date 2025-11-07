// pages/Students/StudentResults.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const { user, setUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔹 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // 🔹 Fetch Student Results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/results/student/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(res.data);
      } catch (err) {
        console.error("Fetch results error:", err);
        setError(err.response?.data?.message || "Failed to load results.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchResults();
  }, [token]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // 🔹 Grade Calculation
  const calculateGrade = (obtained, max) => {
    if (max === 0) return { grade: "N/A", color: "gray" };
    const percentage = (obtained / max) * 100;
    if (percentage >= 90) return { grade: "A+", color: "blue" };
    if (percentage >= 80) return { grade: "A", color: "green" };
    if (percentage >= 70) return { grade: "B", color: "darkgreen" };
    if (percentage >= 50) return { grade: "C", color: "orange" };
    return { grade: "F (Fail)", color: "red" };
  };

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
                <ul className="navbar-nav">
                  <li><Link to="/dashboard/student">Home</Link></li>
                  <li><Link to="/student/assignments">Assignments</Link></li>
                  <li><Link to="/student/attendance">Attendance</Link></li>
                  <li><Link to="/messages">Notice</Link></li>

                  <li className="dropdown">
                    <a className="dropdown-toggle" href="#" data-bs-toggle="dropdown">Exam</a>
                    <div className="dropdown-menu">
                      <Link className="dropdown-item" to="/student/exam-schedule">Exam Schedule</Link>
                      <Link className="dropdown-item" to="/student/results">Exam Results</Link>
                      <Link className="dropdown-item" to="/student/report-card">Report Card</Link>
                    </div>
                  </li>

                  <li><Link to="/student/profile">Profile</Link></li>

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

                  <li>
                    <button className="search" onClick={() => setShowSearch(true)}>
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

      {/* ================ Banner Area ================= */}
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
              Exam Results
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
              Review your performance across all subjects and exams.
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

      {/* ================ Results Section ================= */}
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
            maxWidth: "800px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>My Exam Results</h2>

          {results.length === 0 ? (
            <p>No published exam results found yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                border="1"
                cellPadding="10"
                width="100%"
                style={{ borderCollapse: "collapse", textAlign: "center" }}
              >
                <thead style={{ backgroundColor: "#007bff", color: "white" }}>
                  <tr>
                    <th>Exam Title</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Marks Obtained</th>
                    <th>Max Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => {
                    const gradeInfo = calculateGrade(
                      result.marksObtained,
                      result.examId.maxMarks
                    );
                    return (
                      <tr key={result._id}>
                        <td>{result.examId.title}</td>
                        <td>
                          {result.examId.subjectId.name} (
                          {result.examId.subjectId.code})
                        </td>
                        <td>
                          {new Date(result.examId.examDate).toLocaleDateString()}
                        </td>
                        <td>{result.marksObtained}</td>
                        <td>{result.examId.maxMarks}</td>
                        <td
                          style={{
                            color: gradeInfo.color,
                            fontWeight: "bold",
                          }}
                        >
                          {gradeInfo.grade}
                        </td>
                      </tr>
                    );
                  })}
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
