import React from "react";
import { Link } from "react-router-dom";
import { hasRole } from "../../utils/roleCheck";

const AdminDashboard = () => {
  if (!hasRole(["admin"])) {
    return <h3>Access Denied</h3>;
  }

  return (
    <>
      {/* ================ Start Banner Area ================= */}
      <section className="home-banner-area">
        <div className="container">
          <div className="row justify-content-center fullscreen align-items-center">
            <div className="col-lg-5 col-md-8 home-banner-left">
              <h1 className="text-white">
                Take the first step <br />
                to manage effectively
              </h1>
              <p className="mx-auto text-white mt-20 mb-40">
                Welcome to the Admin Dashboard. Manage users, teachers, and
                students all in one place efficiently.
              </p>
            </div>
            <div className="offset-lg-2 col-lg-5 col-md-12 home-banner-right">
              <img className="img-fluid" src="/img/header-img.png" alt="Admin Banner" />
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
                  <h4>New Classes</h4>
                  <p>
                    In the history of modern astronomy, there is probably no one
                    greater leap forward.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex">
                <i className="ti-cup"></i>
                <div className="ml-20">
                  <h4>Top Courses</h4>
                  <p>
                    In the history of modern astronomy, there is probably no one
                    greater leap forward.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="feature-item d-flex border-right-0">
                <i className="ti-desktop"></i>
                <div className="ml-20">
                  <h4>Full E-Books</h4>
                  <p>
                    In the history of modern astronomy, there is probably no one
                    greater leap forward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================ End Feature Area ================= */}

      {/* ================ Start Logical Admin Section ================= */}
      <section className="admin-dashboard-section mt-5 mb-5 text-center">
        <div className="container">
          <h1>👋 Welcome to Admin Dashboard</h1>
          <p className="lead mb-4">
            Use the options below to manage your platform efficiently.
          </p>
          <div className="admin-links">
            <p>
              <Link to="/admin/users" className="btn btn-primary m-2">
                👥 View All Users
              </Link>
            </p>
            <p>
              <Link to="/teachers" className="btn btn-success m-2">
                📚 Manage Teachers
              </Link>
            </p>
            <p>
              <Link to="/students" className="btn btn-info m-2">
                🎓 Manage Students
              </Link>
            </p>
            <p>
              <Link to="/admin/attendance/report" className="btn btn-info m-2">
                🎓 Student's attendance
              </Link>
            </p>
            <p>
              <Link to="/admin/assignment/status" className="btn btn-info m-2">
                🎓 Student's assignment
              </Link>
            </p>
            <p>
              <Link to="/messages" className="btn btn-info m-2">
                🎓 Messages
              </Link>
            </p>
            <p>
              <Link to="/admin/subjects" className="btn btn-info m-2">
                🎓 Subjects
              </Link>
            </p>
          </div>
        </div>
      </section>
      {/* ================ End Logical Admin Section ================= */}
    </>
  );
};

export default AdminDashboard;
