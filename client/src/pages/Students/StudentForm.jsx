import React, { useState } from "react";
import axios from "axios";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    class: "",
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
    student_image: "",
    rollNo: "",       // if your schema has rollNo
    // any other required fields
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
      const res = await axios.post("http://localhost:5000/api/students", formData);
      alert("Student added successfully");
      // optionally clear form, navigate, etc.
    } catch (err) {
      console.error("Add student failed:", err.response?.data || err);
      alert("Failed to add student");
    }
  };

  return (
    <div>
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input name="class" placeholder="Class" value={formData.class} onChange={handleChange} required />
        <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input name="guardian" placeholder="Guardian Name" value={formData.guardian} onChange={handleChange} required />
        <input name="guardian_phone" placeholder="Guardian Phone" value={formData.guardian_phone} onChange={handleChange} required />
        <input name="student_image" placeholder="Student Image URL" value={formData.student_image} onChange={handleChange} />
        <input name="rollNo" placeholder="Roll No" value={formData.rollNo} onChange={handleChange} required />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default StudentForm;
