// pages/Students/StudentProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/students/profile/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(
          err.response?.data?.message || "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Handle file input
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  // Upload profile image
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("student_image", selectedFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/students/profile/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(res.data.student);
      alert("Image uploaded successfully!");
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Failed to upload image.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>Profile data not available.</p>;

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
              My Profile
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
              Manage your personal details and profile image.
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
                  to="/student/profile"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Profile
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* ================ End Banner ================= */}

      {/* ================ Profile Section ================= */}
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
            maxWidth: "600px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          {profile.student_image && (
            <img
              src={`http://localhost:5000/uploads/students/${profile.student_image}`}
              alt="Profile"
              style={{
                width: "120px",
                borderRadius: "50%",
                marginBottom: "1rem",
              }}
            />
          )}

          <h2>{profile.name}</h2>

          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Roll No:</strong> {profile.rollNo}</p>
          <p><strong>Semester:</strong> {profile.semester}</p>
          <p><strong>Division:</strong> {profile.division}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Guardian:</strong> {profile.guardian}</p>
          <p><strong>Guardian Phone:</strong> {profile.guardian_phone}</p>

          <div style={{ marginTop: "1rem" }}>
            <input type="file" onChange={handleFileChange} />
            <button
              onClick={handleUpload}
              style={{
                marginLeft: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              disabled={!selectedFile}
            >
              Upload Image
            </button>
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
