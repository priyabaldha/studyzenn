import React, { useState } from "react";
import axios from "axios";

// Define possible values (Same as in TeacherAssignmentUpload)
const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Set default value for dropdowns to the first valid option
    semester: SEMESTER_OPTIONS[0] || "",
    division: DIVISION_OPTIONS[0] || "",
    age: "",
    // Ensure gender has a selectable default or is an empty string
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
      const res = await axios.post("http://localhost:5000/api/students", formData);
      alert("Student added successfully");
      // Reset form to default selected values
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
      alert("Failed to add student. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input name="rollNo" placeholder="Roll No" value={formData.rollNo} onChange={handleChange} required />

        {/* ✅ Dropdown for Semester */}
        <select 
          name="semester" 
          value={formData.semester} 
          onChange={handleChange} 
          required
        >
          {/* Removed 'disabled' from the first option and use the first SEMESTER_OPTIONS value as default */}
          {SEMESTER_OPTIONS.map(sem => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>

        {/* ✅ Dropdown for Division */}
        <select 
          name="division" 
          value={formData.division} 
          onChange={handleChange} 
          required
        >
          {/* Removed 'disabled' from the first option and use the first DIVISION_OPTIONS value as default */}
          {DIVISION_OPTIONS.map(div => (
            <option key={div} value={div}>Division {div}</option>
          ))}
        </select>

        {/* Demographic Info */}
        <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        
        {/* Guardian Info */}
        <input name="guardian" placeholder="Guardian Name" value={formData.guardian} onChange={handleChange} required />
        <input name="guardian_phone" placeholder="Guardian Phone" value={formData.guardian_phone} onChange={handleChange} required />
        
        {/* Image */}
        <input name="student_image" placeholder="Student Image URL" value={formData.student_image} onChange={handleChange} />
        
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default StudentForm;