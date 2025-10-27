import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define possible values to ensure consistency across forms (Teacher/Admin)
const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    setEditStudent(student);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      alert("Student deleted successfully.");
      fetchStudents();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting student.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/students/${editStudent._id}`,
        editStudent
      );
      alert("Student updated!");
      setEditStudent(null);
      fetchStudents();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
      alert("Error updating student.");
    }
  };

  return (
    <div>
      <h2>Student List</h2>

      <button
        style={{ marginBottom: "15px" }}
        onClick={() => navigate("/admin/students/add")}
      >
        ➕ Add Student
      </button>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roll No</th>
            <th>Semester</th>
            <th>Division</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Guardian</th>
            <th>Guardian Phone</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="11">No students found.</td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.rollNo}</td>
                <td>{student.semester}</td>
                <td>{student.division}</td>
                <td>{student.age}</td>
                <td>{student.gender}</td>
                <td>{student.guardian}</td>
                <td>{student.guardian_phone}</td>
                <td>
                  {student.student_image ? (
                    <img
                      src={`http://localhost:5000/uploads/students/${student.student_image}`}
                      alt="student"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(student)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(student._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editStudent && (
        <div style={{ marginTop: "20px" }}>
          <h3>Edit Student: {editStudent.name}</h3>
          <form onSubmit={handleUpdate}>
            {/* Standard Input Fields */}
            <input name="name" value={editStudent.name} onChange={handleChange} placeholder="Name" required />
            <input name="email" value={editStudent.email} onChange={handleChange} placeholder="Email" required />
            <input name="rollNo" value={editStudent.rollNo} onChange={handleChange} placeholder="Roll No" required />
            
            {/* 🔄 Dropdown for Semester */}
            <select 
              name="semester" 
              value={editStudent.semester} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>Select Semester</option>
              {SEMESTER_OPTIONS.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
            
            {/* 🔄 Dropdown for Division */}
            <select 
              name="division" 
              value={editStudent.division} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>Select Division</option>
              {DIVISION_OPTIONS.map(div => (
                <option key={div} value={div}>Division {div}</option>
              ))}
            </select>
            
            <input name="age" type="number" value={editStudent.age} onChange={handleChange} placeholder="Age" required />
            <select name="gender" value={editStudent.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input name="guardian" value={editStudent.guardian} onChange={handleChange} placeholder="Guardian Name" required />
            <input name="guardian_phone" value={editStudent.guardian_phone} onChange={handleChange} placeholder="Guardian Phone" required />
            <input name="student_image" value={editStudent.student_image} onChange={handleChange} placeholder="Image URL" />

            <br />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditStudent(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentsList;