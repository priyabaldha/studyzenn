  import React, { useState, useContext } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { AuthContext } from "../../context/AuthContext";

  const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);  // 👈 use context

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", form);
        const user = res.data.user;
        localStorage.setItem("token", res.data.token);
        // localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(user);  // 👈 this is critical

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
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };

  export default Login;
