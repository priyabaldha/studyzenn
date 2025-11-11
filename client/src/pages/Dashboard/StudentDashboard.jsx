import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hasRole } from "../../utils/roleCheck";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ----------- HIGHLIGHT HELPERS (no UI changes) -----------
  const HIGHLIGHT_ATTR = "data-ik-highlight";

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const clearHighlights = () => {
    document.querySelectorAll(`mark[${HIGHLIGHT_ATTR}="1"]`).forEach((m) => {
      const parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
      parent.normalize?.();
    });
  };

  const highlightInElement = (root, regex) => {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim())
            return NodeFilter.FILTER_REJECT;
          if (
            node.parentElement &&
            node.parentElement.closest(`mark[${HIGHLIGHT_ATTR}="1"]`)
          )
            return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      },
      false
    );

    const toProcess = [];
    while (walker.nextNode()) toProcess.push(walker.currentNode);

    toProcess.forEach((textNode) => {
      let text = textNode.nodeValue;
      let match;
      let currentNode = textNode;

      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null) {
        const before = currentNode.splitText(match.index);
        const after = before.splitText(match[0].length);

        const mark = document.createElement("mark");
        mark.setAttribute(HIGHLIGHT_ATTR, "1");
        mark.setAttribute(
          "style",
          "background:#ffe58f;padding:0 .15em;border-radius:2px;"
        );
        mark.appendChild(before.cloneNode(true));

        before.parentNode.replaceChild(mark, before);

        currentNode = after;
        text = currentNode.nodeValue;
        regex.lastIndex = 0;
      }
    });
  };

  const highlightAll = (term) => {
    clearHighlights();
    if (!term || term.trim().length < 1) return;

    const regex = new RegExp(escapeRegExp(term.trim()), "gi");

    // Scope to dashboard content (not overlay/header)
    const containers = document.querySelectorAll(`
      section.home-banner-area,
      section.feature-area,
      section.popular-course-area,
      section.video-area,
      section.other-feature-area,
      section.testimonials-area,
      footer.footer-area
    `);

    containers.forEach((el) => highlightInElement(el, regex));
  };

  useEffect(() => {
    highlightAll(searchTerm);
  }, [searchTerm]);

  const closeSearch = () => {
    setShowSearch(false);
    setSearchTerm("");
    clearHighlights();
  };
  // ----------------------------------------------------------

  if (!hasRole(["student"])) {
    return <h3>Access Denied: You do not have permission to view this page.</h3>;
  }

  return (
    <>
      {token && user && (
        <header className="default-header">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container">
              <h1
                className="navbar-brand mb-0"
                style={{ color: "#ffffff", fontWeight: "700" }}
              >
                {/* STUDYZEN */}
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
                  <li>
                    <Link to="/student/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/messages">Notice</Link>
                  </li>
                  {/* <li className="nav-item mr-3">
                    {/* 🔗 Added navigate to /messages */}
                    {/* <button
                      onClick={() => navigate("/messages")}
                      className="nav-link nav-link-lg btn btn-link"
                      style={{ color: "#eaebefff"}}
                    ></button>
                  </li> */}
                  <li className="nav-item d-flex align-items-center ms-3">
                    <b><strong style={{ color: "#fff" }}>👋 Welcome,</strong></b>&nbsp;
                    <b><strong style={{ color: "#fff" }}>{user.name}</strong></b>&nbsp;
                    <b><span style={{ color: "#fff" }}>[{user.role}]</span></b>
                  </li>
                  <li className="nav-item ms-2">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline btn-sm"
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="btn"></button>
                  <span
                    className="lnr lnr-cross"
                    id="close-search"
                    title="Close Search"
                    onClick={closeSearch}
                  ></span>
                </form>
              </div>
            </div>
          )}
        </header>
      )}

      <section className="home-banner-area">
        <div className="container">
          <div className="row justify-content-center fullscreen align-items-center">
            <div className="col-lg-5 col-md-8 home-banner-left">
              <h1 className="text-white">
                StudyZen <br />
                {/* Learn Smarter */}
              </h1>
              <h2 className="text-white">
                Welcome Back, {user?.name}! <br />
                Keep Learning & Growing📘
              </h2>
              <p className="mx-auto text-white mt-20 mb-40">
                Access your assignments, marks, attendance, report card, and
                profile all in one place.
              </p>
            </div>
            <div className="offset-lg-2 col-lg-5 col-md-12 home-banner-right">
              <img
                className="img-fluid"
                src="/img/header-img.png"
                alt="Student Banner"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="feature-area">
        <div className="container-fluid">
          <div className="feature-inner row">
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex">
                <i className="ti-book"></i>
                <div className="ml-20">
                  <h4>Assignments</h4>
                  <p>View and submit your assignments with ease and track your progress.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex">
                <i className="ti-medall"></i>
                <div className="ml-20">
                  <h4>Marks</h4>
                  <p>Check your subject-wise marks and performance anytime.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex border-right-0">
                <i className="ti-clipboard"></i>
                <div className="ml-20">
                  <h4>Attendance</h4>
                  <p>Keep track of your attendance record and improve consistency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* popular courses */}
<section className="popular-course-area section-gap">
  <div className="container-fluid">
    <div className="row justify-content-center section-title">
      <div className="col-lg-12">
        <h2>
          Explore StudyZen’s <br />
          Most Popular Student Tools
        </h2>
        <p>Empowering students to manage academics smartly and efficiently.</p>
      </div>
    </div>
    <div className="owl-carousel popuar-course-carusel">
      <div className="single-popular-course">
        <div className="thumb">
          <img
            className="f-img img-fluid mx-auto"
            src="img/popular-course/p1.jpg"
            alt="Assignments"
          />
        </div>
        <div className="details">
          <div className="d-flex justify-content-between mb-20">
            <p className="name">Assignments</p>
            <p className="value">New</p>
          </div>
          <a href="#">
            <h4>Submit and Track Assignments Easily</h4>
          </a>
          <div className="bottom d-flex mt-15">
            <ul className="list">
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star-half-o"></i></li>
            </ul>
            <p className="ml-20">4.8 Rated</p>
          </div>
        </div>
      </div>
      <div className="single-popular-course">
        <div className="thumb">
          <img
            className="f-img img-fluid mx-auto"
            src="img/popular-course/p2.jpg"
            alt="Attendance"
          />
        </div>
        <div className="details">
          <div className="d-flex justify-content-between mb-20">
            <p className="name">Attendance</p>
            <p className="value">Daily</p>
          </div>
          <a href="#">
            <h4>Keep Track of Every Lecture You Attend</h4>
          </a>
          <div className="bottom d-flex mt-15">
            <ul className="list">
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
            </ul>
            <p className="ml-20">5.0 Rated</p>
          </div>
        </div>
      </div>
      <div className="single-popular-course">
        <div className="thumb">
          <img
            className="f-img img-fluid mx-auto"
            src="img/popular-course/p3.jpg"
            alt="Report Card"
          />
        </div>
        <div className="details">
          <div className="d-flex justify-content-between mb-20">
            <p className="name">Report Card</p>
            <p className="value">Smart View</p>
          </div>
          <a href="#">
            <h4>Analyze Your Academic Growth at a Glance</h4>
          </a>
          <div className="bottom d-flex mt-15">
            <ul className="list">
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star-o"></i></li>
            </ul>
            <p className="ml-20">4.6 Rated</p>
          </div>
        </div>
      </div>
      <div className="single-popular-course">
        <div className="thumb">
          <img
            className="f-img img-fluid mx-auto"
            src="img/popular-course/p4.jpg"
            alt="Notice Board"
          />
        </div>
        <div className="details">
          <div className="d-flex justify-content-between mb-20">
            <p className="name">Notice Board</p>
            <p className="value">Live</p>
          </div>
          <a href="#">
            <h4>Stay Updated with All School Announcements</h4>
          </a>
          <div className="bottom d-flex mt-15">
            <ul className="list">
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star"></i></li>
              <li><i className="fa fa-star-half-o"></i></li>
            </ul>
            <p className="ml-20">4.9 Rated</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/* end popular courses */}


{/* video area */}
<section
  className="video-area section-gap-bottom"
  style={{
    position: "relative",
    backgroundImage: "url('/img/video-area-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
    padding: "100px 0",
  }}
>
  {/* Top Wave */}
  <svg
    style={{
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100px",
      zIndex: "1",
    }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
  >
    <path
      fill="#fff"
      d="M0,128L60,149.3C120,171,240,213,360,197.3C480,181,600,107,720,74.7C840,43,960,53,1080,85.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
    ></path>
  </svg>

  <div
    className="container"
    style={{
      position: "relative",
      zIndex: "2",
      display: "flex",
      // Keeps content positioned upward
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexWrap: "wrap",
      padding: "60px 40px",
    }}
  >
    {/* Left Text Section */}
    <div
      className="text-section"
      style={{
        flex: "1 1 45%",
        color: "#fff",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <h2
        style={{
          fontSize: "38px",
          fontWeight: "700",
          marginBottom: "20px",
          lineHeight: "1.3",
          color: "#fff",
        }}
      >
        Discover StudyZen <br /> In Action
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.8", marginBottom: "30px" }}>
        See how StudyZen simplifies assignments, attendance, and results in one intuitive dashboard.
      </p>

      {/* The h4 and the following p tag have been removed as requested previously */}
    </div>

    {/* Right Video Section */}
    <div
      className="video-wrapper"
      style={{
        flex: "1 1 45%",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        }}
      >
        {/* Thumbnail Image */}
        <img
          src="/img/video-study.jpeg"
          alt="StudyZen Demo"
          style={{
            width: "480px",
            height: "270px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />

        {/* Play Button Overlay */}
        <a
          // CHANGED: Updated href to the new YouTube video link
          href="https://www.youtube.com/watch?v=KYLO9eEwrU0&list=PL5koSNwRQrpmkJW_PSkPfLnklSeuxo7B1&index=1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#8e24aa",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 20px rgba(0,0,0,0.4)",
            transition: "0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#ba68c8")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#8e24aa")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            fill="#fff"
            viewBox="0 0 16 16"
          >
            <path d="M6.79 5.093A.5.5 0 0 1 7.5 5.5v5a.5.5 0 0 1-.79.407L3.5 8.972V7.028l3.29-1.935z" />
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
          </svg>
        </a>
      </div>
    </div>
  </div>

  {/* Bottom Wave */}
  <svg
    style={{
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
      height: "100px",
      zIndex: "1",
    }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
  >
    <path
      fill="#fff"
      d="M0,64L60,90.7C120,117,240,171,360,170.7C480,171,600,117,720,101.3C840,85,960,107,1080,122.7C1200,139,1320,149,1380,154.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    ></path>
  </svg>
</section>
{/* end video area */}


{/* ================ Start Feature Area ================= */}
<section className="other-feature-area">
  <div className="container">
    <div className="feature-inner row">
      <div className="col-lg-12">
        <div className="section-title text-left">
          <h2>
            StudyZen Features <br />
            That Empower Students
          </h2>
          <p>
            Simplifying education through innovative digital tools.
          </p>
        </div>
      </div>
      <div className="col-lg-4 col-md-6">
        <Link 
          to="/student/assignments" // Set the destination path
          style={{ textDecoration: 'none', color: 'inherit' }} // Optional: Style the link to look like a div
        >
          <div className="other-feature-item">
            <i className="ti-book"></i>
            <h4>Assignments</h4>
            <div>
              <p>Access, complete, and submit your homework with ease.</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Attendance Feature - Linked to /student/attendance */}
      <div className="col-lg-4 col-md-6 mt--160">
        <Link 
          to="/student/attendance" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="other-feature-item">
            <i className="ti-bar-chart"></i>
            <h4>Attendance</h4>
            <div>
              <p>Track your daily attendance with visual analytics.</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Report Card Feature - Linked to /student/report-card */}
      <div className="col-lg-4 col-md-6 mt--260">
        <Link 
          to="/student/report-card" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="other-feature-item">
            <i className="ti-clipboard"></i>
            <h4>Report Card</h4>
            <div>
              <p>Monitor your academic progress across all subjects.</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Exam Schedule Feature - Linked to /student/exam-schedule */}
      <div className="col-lg-4 col-md-6">
        <Link 
          to="/student/exam-schedule" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="other-feature-item">
            {/* CHANGED ICON: ti-announcement to ti-calendar */}
            <i className="ti-calendar"></i>
            {/* CHANGED HEADING */}
            <h4>Exam Schedule</h4>
            <div>
              {/* CHANGED PARAGRAPH */}
              <p>View the complete timetable and dates for all upcoming examinations.</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Messages Feature - Linked to /messages (as per header) */}
      <div className="col-lg-4 col-md-6 mt--160">
        <Link 
          to="/messages" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="other-feature-item">
            <i className="ti-email"></i>
            <h4>Messages</h4>
            <div>
              <p>Communicate with teachers and classmates securely.</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Exam Results Feature - Linked to /student/results */}
      <div className="col-lg-4 col-md-6 mt--260">
        <Link 
          to="/student/results" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="other-feature-item">
            {/* CHANGED ICON: ti-layers to ti-medall (similar to Marks icon used earlier) */}
            <i className="ti-medall"></i>
            {/* CHANGED HEADING */}
            <h4>Exam Results</h4>
            <div>
              {/* CHANGED PARAGRAPH */}
              <p>View your scores and detailed performance reports for all exams.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  </div>
</section>
{/* ================ End Feature Area ================= */}


{/* ================ Start Testimonials Area ================= */}
<section className="testimonials-area section-gap">
  <div className="container">
    <div className="testi-slider owl-carousel" data-slider-id="1">
      <div className="row align-items-center">
        <div className="col-lg-5">
          <div className="item">
            <div className="testi-item">
              <img src="img/quote.png" alt="Quote" />
              <div className="mt-40 text">
                <p>
                  "StudyZen helped me stay on top of my assignments and attendance. It's like having a digital school assistant!"
                </p>
              </div>
              <h4>Ananya R.</h4>
              <p>High School Student</p>
            </div>
          </div>
        </div>
        <div className="offset-lg-1 col-lg-6">
          <img src="img/testimonial/t1.jpg" alt="Student testimonial" />
        </div>
      </div>

      <div className="row align-items-center">
        <div className="col-lg-5">
          <div className="item">
            <div className="testi-item">
              <img src="img/quote.png" alt="Quote" />
              <div className="mt-40 text">
                <p>
                  "From results to report cards, everything’s organized. StudyZen truly simplifies my academic life."
                </p>
              </div>
              <h4>Rohit K.</h4>
              <p>College Student</p>
            </div>
          </div>
        </div>
        <div className="offset-lg-1 col-lg-6">
          <img src="img/testimonial/t2.jpg" alt="Student testimonial" />
        </div>
      </div>
    </div>
  </div>
</section>
{/* ================ End Testimonials Area ================= */}

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
};

export default StudentDashboard;
