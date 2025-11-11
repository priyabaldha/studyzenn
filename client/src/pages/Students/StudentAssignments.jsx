import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (!token) throw new Error("You are not logged in.");

        const res = await axios.get(
          "http://localhost:5000/api/assignments/student",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAssignments(res.data);
      } catch (err) {
        console.error("Assignments fetch error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [token]);

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
              Assignments
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
              Stay updated and complete your assignments on time.
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
                  to="/student/assignments"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Assignments
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* ================ End Banner Area ================= */}

      {/* ================ Assignments Section ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "15vh",
          width: "100vw",
          backgroundColor: "white",
          flexDirection: "column",
          paddingBottom: "100px",
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
          <h2 style={{ marginBottom: "20px" }}>My Assignments</h2>

          {assignments.length === 0 ? (
            <p>No assignments available for your current Semester/Division.</p>
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
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Semester</th>
                    <th>Division</th>
                    <th>Uploaded</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a._id}>
                      <td>{a.subject}</td>
                      <td>{a.category}</td>
                      <td>{a.semester}</td>
                      <td>{a.division}</td>
                      <td>{new Date(a.uploadDate).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/student/assignments/${a._id}`}>View Details</Link>
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
