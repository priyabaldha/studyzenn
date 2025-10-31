import React, { useState } from "react";
import axios from "axios";
import "../../css/StudentForm.css"; // ✅ Import external CSS

const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    semester: SEMESTER_OPTIONS[0] || "",
    division: DIVISION_OPTIONS[0] || "",
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
    student_image: "",
    rollNo: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/students", formData);
      alert("✅ Student added successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        semester: SEMESTER_OPTIONS[0] || "",
        division: DIVISION_OPTIONS[0] || "",
        age: "",
        gender: "",
        guardian: "",
        guardian_phone: "",
        student_image: "",
        rollNo: "",
      });
    } catch (err) {
      console.error("Add student failed:", err.response?.data || err);
      alert("❌ Failed to add student. Check console for details.");
    }
  };

  return (
    <div className="student-form-wrapper">
      <div className="student-form-container">
        <h2 className="student-form-title">Add New Student</h2>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input name="rollNo" placeholder="Roll Number" value={formData.rollNo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <select name="semester" value={formData.semester} onChange={handleChange} required>
              {SEMESTER_OPTIONS.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>

            <select name="division" value={formData.division} onChange={handleChange} required>
              {DIVISION_OPTIONS.map((div) => (
                <option key={div} value={div}>Division {div}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <input name="guardian" placeholder="Guardian Name" value={formData.guardian} onChange={handleChange} required />
            <input name="guardian_phone" placeholder="Guardian Phone" value={formData.guardian_phone} onChange={handleChange} required />
          </div>

          <input name="student_image" placeholder="Student Image URL" value={formData.student_image} onChange={handleChange} />

          <button type="submit" className="student-form-btn">Add Student</button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;