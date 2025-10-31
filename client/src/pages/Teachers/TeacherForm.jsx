import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/TeacherForm.css"; // ✅ External CSS

const TeacherForm = () => {
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    password: "",
    qualification: "",
    age: "",
    gender: "",
    teacher_image: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/teachers", teacher);
      alert("✅ Teacher added successfully!");
      navigate("/teachers");
    } catch (err) {
      console.error("Failed to add teacher:", err.response?.data || err);
      alert("❌ Failed to add teacher: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="teacher-form-wrapper">
      <div className="teacher-form-container">
        <h2 className="teacher-form-title">Add New Teacher</h2>
        <form onSubmit={handleSubmit} className="teacher-form">
          <div className="form-group">
            <input
              name="name"
              value={teacher.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              type="email"
              name="email"
              value={teacher.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={teacher.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <input
              name="qualification"
              value={teacher.qualification}
              onChange={handleChange}
              placeholder="Qualification"
              required
            />
          </div>

          <div className="form-group">
            <input
              name="age"
              type="number"
              value={teacher.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />
            <select
              name="gender"
              value={teacher.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <input
            name="teacher_image"
            value={teacher.teacher_image}
            onChange={handleChange}
            placeholder="Teacher Image URL"
          />

          <button type="submit" className="teacher-form-btn">
            Add Teacher
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;