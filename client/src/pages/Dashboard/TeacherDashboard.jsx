import React from "react";
import { Link } from "react-router-dom";
import { hasRole } from "../../utils/roleCheck";

const TeacherDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // --- Start of Teacher-Specific Logical Code (Kept Unchanged) ---
  if (!hasRole(["teacher"])) {
    return <h3>Access Denied: You do not have permission to view this page.</h3>;
  }

  if (!user || user.role !== "teacher") {
    return <h3>Access Denied: You do not have permission to view this page.</h3>;
  }
  // --- End of Teacher-Specific Logical Code ---

  return (
    <>
      {/* ================ Start Banner Area ================= */}
      <section className="home-banner-area">
        <div className="container">
          <div className="row justify-content-center fullscreen align-items-center">
            <div className="col-lg-5 col-md-8 home-banner-left">
              <h1 className="text-white">
                Welcome Back, {user?.name}! <br />
                Ready to Inspire? 🍎
              </h1>
              <p className="mx-auto text-white mt-20 mb-40">
                Manage your classes, assignments, attendance, and student progress all in one place.
              </p>
            </div>
            <div className="offset-lg-2 col-lg-5 col-md-12 home-banner-right">
              <img className="img-fluid" src="/img/header-img.png" alt="Teacher Banner" />
            </div>
          </div>
        </div>
      </section>
      {/* ================ End Banner Area ================= */}

      {/* ================ Start Feature Area ================= */}
      <section className="feature-area">
        <div className="container-fluid">
          <div className="feature-inner row">
            {/* Feature 1: Assignments */}
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex">
                <i className="ti-folder"></i>
                <div className="ml-20">
                  <h4>Assignments</h4>
                  <p>
                    Upload and review student submissions for your classes.
                  </p>
                </div>
              </div>
            </div>
            {/* Feature 2: Students/Marks */}
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex">
                <i className="ti-user"></i>
                <div className="ml-20">
                  <h4>Students</h4>
                  <p>
                    View student profiles and manage their data efficiently.
                  </p>
                </div>
              </div>
            </div>
            {/* Feature 3: Attendance */}
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex border-right-0">
                <i className="ti-clipboard"></i>
                <div className="ml-20">
                  <h4>Attendance</h4>
                  <p>
                    Mark and track class attendance easily and accurately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================ End Feature Area ================= */}

      {/* ================ Start Logical Teacher Section (Student CSS Class used for styling) ================= */}
      <section className="student-dashboard-section mt-5 mb-5 text-center">
        <div className="container">
          <h1>👨‍🏫 Teacher Dashboard</h1>
          <p className="lead mb-4">
            Use the options below to manage your teaching activities.
          </p>
          <div className="student-links">
            {/* NOTE: I've converted your original list items (like <li>) into <p><Link>...</Link></p> structure to match the student dashboard's styling conventions. */}
            
            <p>
              <Link to="/teacher/profile" className="btn btn-primary m-2">
                👤 View Profile
              </Link>
            </p>
            <p>
              <Link to="/teacher/students" className="btn btn-success m-2">
                📄 View Students
              </Link>
            </p>
            <p>
              <Link to="/teacher/upload-assignment" className="btn btn-info m-2">
                ⬆ Upload Assignment
              </Link>
            </p>
            {/* <p>
                // Original commented-out link, kept commented
                <Link to="/teacher/assignments/:id/review" className="btn btn-primary m-2">
                  👤 assignment review
                </Link>
            </p> */}
            <p>
              <Link to="/teacher/attendance" className="btn btn-warning m-2">
                📅 Manage Attendance
              </Link>
            </p>
            <p>
              <Link to="/messages" className="btn btn-secondary m-2">
                💬 Messages
              </Link>
            </p>
            <p>
              <Link to="/teacher/schedule-exam" className="btn btn-danger m-2">
                📝 Schedule Exam
              </Link>
            </p>
            <p>
              <Link to="/teacher/result-entry" className="btn btn-dark m-2">
                🧾 Result Entry
              </Link>
            </p>

            {/* Original list items removed as they didn't have corresponding Link components:
            <li>📝 Manage Students</li> 
            <li>📊 View Reports</li>
            <li>📅 Assign Subjects</li> 
            */}
          </div>
        </div>
      </section>
      {/* ================ End Logical Teacher Section ================= */}
    </>
  );
};

export default TeacherDashboard;