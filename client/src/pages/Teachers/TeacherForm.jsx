import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      alert("Teacher added!");
      navigate("/teachers");
    } catch (err) {
      console.error("Failed to add teacher:", err.response?.data || err);
      alert("Failed to add teacher: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div>
      <h2>Add Teacher</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={teacher.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={teacher.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
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
        <input
          name="age"
          value={teacher.age}
          onChange={handleChange}
          placeholder="Age"
          type="number"
        />
        <input
          name="gender"
          value={teacher.gender}
          onChange={handleChange}
          placeholder="Gender"
        />
        <input
          name="teacher_image"
          value={teacher.teacher_image}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <br />
        <button type="submit">Add Teacher</button>
      </form>
    </div>
  );
};

export default TeacherForm;
