import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [editTeacher, setEditTeacher] = useState(null);
  const navigate = useNavigate();

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${id}`);
      alert("Teacher deleted successfully");
      fetchTeachers();
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      alert("Error deleting teacher");
    }
  };

  return (
    <div>
      <h2>Teachers List</h2>

      <button
        style={{ marginBottom: "15px" }}
        onClick={() => navigate("/admin/teachers/add")}
      >
        ➕ Add Teacher
      </button>

      {teachers.length === 0 ? (
        <p>No teachers found.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Qualification</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.qualification}</td>
                <td>{t.age || "N/A"}</td>
                <td>{t.gender || "N/A"}</td>
                <td>
                  {t.teacher_image ? (
                    <img
                      src={t.teacher_image}
                      alt={t.name}
                      width={50}
                      height={50}
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <button onClick={() => setEditTeacher(t)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeachersList;
