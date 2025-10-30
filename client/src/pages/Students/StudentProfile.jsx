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
              <Link className="navbar-brand" to="/">
                <img src="/img/logo.png" alt="Logo" />
              </Link>

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

                  <li className="nav-item d-flex align-items-center ms-3">
                    👋 Welcome,&nbsp;
                    <strong>{user.name}</strong>&nbsp;[{user.role}]
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
                  to="/"
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

      {/* ================ Footer ================= */}
      <footer className="footer-area section-gap">
        <div className="container">
          <div className="footer-bottom row align-items-center">
            <p className="footer-text m-0 col-lg-8 col-md-12">
              Copyright © {new Date().getFullYear()} All rights reserved | Made
              with <i className="fa fa-heart-o"></i> by{" "}
              <a href="https://colorlib.com" target="_blank" rel="noreferrer">
                Colorlib
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
