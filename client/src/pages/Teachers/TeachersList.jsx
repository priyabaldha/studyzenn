import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Admin/components/AdminHeader";
import AdminSlidebar from "../Admin/components/AdminSlidebar";
import "../../css/AdminTeachersList.css";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditTeacher((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <AdminHeader />
      <AdminSlidebar />

      <div className="teachers-container">
        <h1 className="teachers-title">Teachers List</h1>

        <button
          className="add-teacher-btn"
          onClick={() => navigate("/admin/teachers/add")}
        >
          ➕ Add Teacher
        </button>

        <div className="teachers-table-container">
          <table className="teachers-table">
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
              {teachers.length > 0 ? (
                teachers.map((t) => (
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
                          className="teachers-img"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => setEditTeacher(t)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(t._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editTeacher && (
          <div className="edit-form-container">
            <h3>Edit Teacher: {editTeacher.name}</h3>
            <form
              className="edit-form"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await axios.put(
                    `http://localhost:5000/api/teachers/${editTeacher._id}`,
                    editTeacher
                  );
                  alert("Teacher updated successfully!");
                  setEditTeacher(null);
                  fetchTeachers();
                } catch (err) {
                  console.error("Update failed:", err);
                  alert("Error updating teacher.");
                }
              }}
            >
              <input
                name="name"
                value={editTeacher.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
              <input
                name="email"
                value={editTeacher.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <input
                name="qualification"
                value={editTeacher.qualification}
                onChange={handleChange}
                placeholder="Qualification"
                required
              />
              <input
                name="age"
                type="number"
                value={editTeacher.age}
                onChange={handleChange}
                placeholder="Age"
                required
              />
              <select
                name="gender"
                value={editTeacher.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                name="teacher_image"
                value={editTeacher.teacher_image}
                onChange={handleChange}
                placeholder="Image URL"
              />

              <div className="form-buttons">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditTeacher(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default TeachersList;
