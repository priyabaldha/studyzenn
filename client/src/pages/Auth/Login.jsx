import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Login.css";
// ✅ Import the new component (assuming the dedicated page is in the same directory structure)
import ForgotPasswordPage from "./ForgotPasswordPage"; 

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showSearch, setShowSearch] = useState(false); // Kept for existing UI logic
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", form);
            const userData = res.data.user;
            
            // Set login data
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("role", userData.role); // Ensure role is saved separately
            setUser(userData);
            
            alert("Login successful");

            // Redirect based on role
            if (userData.role === "admin") navigate("/dashboard/admin");
            else if (userData.role === "teacher") navigate("/dashboard/teacher");
            else if (userData.role === "student") navigate("/dashboard/student");
            else navigate("/");
        } catch (err) {
            alert(err.response?.data?.error || "Login failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role"); 
        setUser(null);
        navigate("/");
    };

    if (token) {
        // Simple redirection/status if already logged in
        return (
            <div className="login-fullpage-wrapper">
                <p>You are already logged in as {user?.name || 'User'}.</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }
    
    return (
        <div className="login-fullpage-wrapper">
            {/* ================ Header ================= */}
            <header className="default-header">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="container">
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
                    </div>
                </nav>
            </header>
            {showSearch && (
                <div className="search-input" id="search-input-box">
                    {/* Search functionality code (omitted for brevity) */}
                </div>
            )}
            {/* ================ End Header ================= */}

            {/* ================ Banner ================= */}
            <section className="banner-area">
                <div className="container banner-container banner-center">
                    <h1
                        className="text-white"
                        style={{ fontWeight: "bold", fontSize: "52px", marginBottom: "10px" }}
                    >
                        Welcome to StudyZen
                    </h1>
                    <p style={{ fontSize: "18px", color: "#fff", opacity: "0.9" }}>
                        Login to access your assignments, marks, and attendance.
                    </p>
                </div>
            </section>
            {/* ================ End Banner ================= */}

            {/* ================ Login Form ================= */}
            <div className="login-page-container">
                <div className="login-form-wrapper gradient-form">
                    <h2 className="login-title">User Login</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter Email Address"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="forgot-password-link">
                            {/* ✅ Link to the new dedicated Forgot Password Page */}
                            <Link to="/forgot-password" className="text-muted" style={{color: 'white'}}>
                                Forgot Password?
                            </Link>
                        </div>

                        <button type="submit" className="login-button">
                            LOGIN
                        </button>
                    </form>
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

        </div>
    );
};

export default Login;