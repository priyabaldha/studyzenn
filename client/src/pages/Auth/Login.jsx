import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Login.css"; // Import the external CSS

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const user = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(user);

      alert("Login successful");

      if (user.role === "admin") {
        navigate("/dashboard/admin");
      } else if (user.role === "teacher") {
        navigate("/dashboard/teacher");
      } else if (user.role === "student") {
        navigate("/dashboard/student");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-page-container">
        {/* We use a wrapper div to center the content, as defined in CSS */}
        <div className="login-form-wrapper">
            <h2 className="login-title">User Login</h2>

            <form onSubmit={handleSubmit} className="login-form">
                
                {/* Email Input using placeholder */}
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
                
                {/* Password Input using placeholder */}
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
                
                {/* Forgot Password Link */}
                <div className="forgot-password-link">
                    <Link to="/forgot-password" className="text-muted">
                        Forgot Password?
                    </Link>
                </div>
                
                {/* Login Button with Gradient Class */}
                <button type="submit" className="login-button">
                    LOGIN
                </button>
                
                {/* Register Link */}
                <p className="register-text">
                    Don't have an account? 
                    <Link to="/register" className="register-link">Register Here</Link>
                </p>
            </form>
        </div>
    </div>
  );
};

export default Login;