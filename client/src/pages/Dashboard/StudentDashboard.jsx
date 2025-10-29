import React from "react";
import { Link } from "react-router-dom";
import { hasRole } from "../../utils/roleCheck";

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!hasRole(["student"])) {
    return <h3>Access Denied: You do not have permission to view this page.</h3>;
  }

  return (
    <>
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

      {/* ================ Start Logical Student Section ================= */}
      <section className="student-dashboard-section mt-5 mb-5 text-center">
        <div className="container">
          <h1>🎓 Student Dashboard</h1>
          <p className="lead mb-4">
            Use the options below to manage your student activities.
          </p>
          <div className="student-links">
            <p>
              <Link to="/student/profile" className="btn btn-primary m-2">
                👤 View Profile
              </Link>

            </p>
            <p>
              <Link to="/student/assignments" className="btn btn-success m-2">
                📚 View Assignments
              </Link>
            </p>
            <p>
              <Link to="/student/marks" className="btn btn-info m-2">
                🧾 View Marks
              </Link>
            </p>
            <p>
              <Link to="/student/attendance" className="btn btn-warning m-2">
                📅 Check Attendance
              </Link>
            </p>
            <p>
              <Link to="/messages" className="btn btn-warning m-2">
                📅 Messages
              </Link>
            </p>
            <p>
              <Link to="/student/exam-schedule" className="btn btn-warning m-2">
                📅 Exam-Schedule
              </Link>
            </p>
            <p>
              <Link to="/student/results" className="btn btn-warning m-2">
                📅 Results
              </Link>
            </p>
          </div>
        </div>
      </section>
      {/* ================ End Logical Student Section ================= */}
    </>
  );
};

export default StudentDashboard;
