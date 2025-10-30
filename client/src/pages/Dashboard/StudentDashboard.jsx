import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hasRole } from "../../utils/roleCheck";

const StudentDashboard = () => {
  // ===== HEADER LOGIC START =====
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  // ===== HEADER LOGIC END =====

  if (!hasRole(["student"])) {
    return <h3>Access Denied: You do not have permission to view this page.</h3>;
  }

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

                  {/* Dropdown: Pages */}
                  <li className="dropdown">
                    <a
                      className="dropdown-toggle"
                      href="#"
                      data-bs-toggle="dropdown"
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
                        Report-card
                      </Link>
                    </div>
                  </li>

                  {/* Dropdown: Blog */}
                  {/* <li className="dropdown">
                    <a
                      className="dropdown-toggle"
                      href="#"
                      data-bs-toggle="dropdown"
                    >
                      Pages
                    </a>
                    <div className="dropdown-menu">
                      <Link className="dropdown-item" to="/blog-home">
                        Notice
                      </Link>
                      <Link className="dropdown-item" to="/blog-single">
                        Subjects
                      </Link>
                      <Link className="dropdown-item" to="/blog-single">
                        Schedule Exam
                      </Link>
                    </div>
                  </li> */}

                  <li>
                    <Link to="/student/profile">Profile</Link>
                  </li>


                  {/* Welcome + Logout */}
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
      <section className="home-banner-area">
        <div className="container">
          <div className="row justify-content-center fullscreen align-items-center">
            <div className="col-lg-5 col-md-8 home-banner-left">
              <h1 className="text-white">
                Welcome Back, {user?.name}! <br />
                Keep Learning & Growing 📘
              </h1>
              <p className="mx-auto text-white mt-20 mb-40">
                Access your assignments, marks, attendance, and profile all in one place.
              </p>
            </div>
            <div className="offset-lg-2 col-lg-5 col-md-12 home-banner-right">
              <img className="img-fluid" src="/img/header-img.png" alt="Student Banner" />
            </div>
          </div>
        </div>
      </section>
      {/* ================ End Banner Area ================= */}

      {/* ================ Start Feature Area ================= */}
      <section className="feature-area">
        <div className="container-fluid">
          <div className="feature-inner row">
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex">
                <i className="ti-book"></i>
                <div className="ml-20">
                  <h4>Assignments</h4>
                  <p>
                    View and submit your assignments with ease and track your progress.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex">
                <i className="ti-medall"></i>
                <div className="ml-20">
                  <h4>Marks</h4>
                  <p>
                    Check your subject-wise marks and performance anytime.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex border-right-0">
                <i className="ti-clipboard"></i>
                <div className="ml-20">
                  <h4>Attendance</h4>
                  <p>
                    Keep track of your attendance record and improve consistency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================ End Feature Area ================= */}


      {/* ================ start footer Area ================= */}
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
              <p>You can trust us. we only send promo offers,</p>
              <div className="form-wrap" id="mc_embed_signup">
                <form
                  target="_blank"
                  action="https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&amp;id=92a4423d01"
                  method="get"
                  className="form-inline"
                >
                  <input
                    className="form-control"
                    name="EMAIL"
                    placeholder="Your Email Address"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) =>
                      (e.target.placeholder = "Your Email Address")
                    }
                    required
                    type="email"
                  />
                  <button className="click-btn btn btn-default text-uppercase">
                    subscribe
                  </button>
                  <div style={{ position: "absolute", left: "-5000px" }}>
                    <input
                      name="b_36c4fd991d266f23781ded980_aefe40901a"
                      tabIndex="-1"
                      value=""
                      type="text"
                    />
                  </div>

                  <div className="info"></div>
                </form>
              </div>
            </div>
          </div>
          <div className="footer-bottom row align-items-center">
            <p className="footer-text m-0 col-lg-8 col-md-12">
              {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
              Copyright &copy;
              <script>document.write(new Date().getFullYear());</script> All
              rights reserved | This template is made with{" "}
              <i className="fa fa-heart-o" aria-hidden="true"></i> by{" "}
              <a href="https://colorlib.com" target="_blank">
                Colorlib
              </a>
              {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
            </p>
            <div className="col-lg-4 col-md-12 footer-social">
              <a href="#">
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fa fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fa fa-dribbble"></i>
              </a>
              <a href="#">
                <i className="fa fa-behance"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* ================ End footer Area ================= */}
    </>
  );
};

export default StudentDashboard;
