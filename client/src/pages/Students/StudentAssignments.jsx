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
                  <li><Link to="/dashboard/student">Home</Link></li>
                  <li><Link to="/student/assignments">Assignments</Link></li>
                  <li><Link to="/student/attendance">Attendance</Link></li>
                  <li><Link to="/messages">Notice</Link></li>

                  <li className="dropdown">
                    <a className="dropdown-toggle" href="#" data-bs-toggle="dropdown">
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
                        Report-card
                      </Link>
                    </div>
                  </li>

                  <li><Link to="/student/profile">Profile</Link></li>

                  <li className="nav-item d-flex align-items-center ms-3">
                    👋 Welcome,&nbsp;<strong>{user.name}</strong>&nbsp;[{user.role}]
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
            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Top Products</h4>
              <ul>
                <li><a href="#">Managed Website</a></li>
                <li><a href="#">Manage Reputation</a></li>
                <li><a href="#">Power Tools</a></li>
                <li><a href="#">Marketing Service</a></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">Jobs</a></li>
                <li><a href="#">Brand Assets</a></li>
                <li><a href="#">Investor Relations</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Features</h4>
              <ul>
                <li><a href="#">Jobs</a></li>
                <li><a href="#">Brand Assets</a></li>
                <li><a href="#">Investor Relations</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Guides</a></li>
                <li><a href="#">Research</a></li>
                <li><a href="#">Experts</a></li>
                <li><a href="#">Agencies</a></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6 single-footer-widget">
              <h4>Newsletter</h4>
              <p>You can trust us. We only send promo offers.</p>
              <div className="form-wrap" id="mc_embed_signup">
                <form target="_blank" action="#" method="get" className="form-inline">
                  <input
                    className="form-control"
                    name="EMAIL"
                    placeholder="Your Email Address"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "Your Email Address")}
                    required
                    type="email"
                  />
                  <button className="click-btn btn btn-default text-uppercase">
                    SUBSCRIBE
                  </button>
                  <div style={{ position: "absolute", left: "-5000px" }}>
                    <input
                      name="b_36c4fd991d266f23781ded980_aefe40901a"
                      tabIndex="-1"
                      value=""
                      type="text"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="footer-bottom row align-items-center">
            <p className="footer-text m-0 col-lg-8 col-md-12">
              Copyright © {new Date().getFullYear()} All rights reserved | This
              template is made with <i className="fa fa-heart-o"></i> by{" "}
              <a href="https://colorlib.com" target="_blank" rel="noreferrer">
                Colorlib
              </a>
            </p>
          </div>
        </div>
      </footer>
      {/* ================ End Footer Area ================= */}
    </>
  );
}
