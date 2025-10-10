import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  return (
    <div>
      <h2>Student List</h2>

      <button
        style={{ marginBottom: "15px" }}
        onClick={() => navigate("/admin/students")}
      >
        ➕ Add Student
      </button>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roll No</th>
            <th>Class</th>
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
              <td colSpan="10">No students found.</td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.rollNo}</td>
                <td>{student.class}</td>
                <td>{student.age}</td>
                <td>{student.gender}</td>
                <td>{student.guardian}</td>
                <td>{student.guardian_phone}</td>
                <td>
                  {student.student_image ? (
                    <img
                      src={student.student_image}
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
          <h3>Edit Student</h3>
          <form
            onSubmit={async (e) => {
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
                console.error("Update failed:", err);
                alert("Error updating student.");
              }
            }}
          >
            <input name="name" value={editStudent.name} onChange={handleChange} placeholder="Name" required />
            <input name="email" value={editStudent.email} onChange={handleChange} placeholder="Email" required />
            <input name="rollNo" value={editStudent.rollNo} onChange={handleChange} placeholder="Roll No" required />
            <input name="class" value={editStudent.class} onChange={handleChange} placeholder="Class" required />
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
