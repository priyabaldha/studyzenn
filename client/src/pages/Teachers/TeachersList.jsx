import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Admin/components/AdminHeader";
import AdminSlidebar from "../Admin/components/AdminSlidebar";

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

      <div
        style={{
          marginLeft: "260px",
          paddingTop: "120px",
          minHeight: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "50px",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#111",
            marginBottom: "15px",
            textAlign: "center",
            borderBottom: "3px solid #000",
            display: "inline-block",
            paddingBottom: "5px",
          }}
        >
          Teachers List
        </h1>

        {/* Add Teacher Button */}
        <button
          onClick={() => navigate("/admin/teachers/add")}
          style={{
            marginBottom: "25px",
            padding: "10px 25px",
            backgroundColor: "#000",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000")}
        >
          ➕ Add Teacher
        </button>

        {/* Table Container */}
        <div
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            padding: "25px 30px",
            overflowX: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "Poppins, sans-serif",
              textAlign: "center",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#111",
                  color: "#fff",
                  fontSize: "16px",
                  letterSpacing: "0.5px",
                }}
              >
                <th style={{ padding: "14px" }}>Name</th>
                <th style={{ padding: "14px" }}>Email</th>
                <th style={{ padding: "14px" }}>Qualification</th>
                <th style={{ padding: "14px" }}>Age</th>
                <th style={{ padding: "14px" }}>Gender</th>
                <th style={{ padding: "14px" }}>Image</th>
                <th style={{ padding: "14px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? (
                teachers.map((t, index) => (
                  <tr
                    key={t._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#fff",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? "#fafafa" : "#fff")
                    }
                  >
                    <td style={{ padding: "12px" }}>{t.name}</td>
                    <td style={{ padding: "12px", color: "#555" }}>{t.email}</td>
                    <td style={{ padding: "12px" }}>{t.qualification}</td>
                    <td style={{ padding: "12px" }}>{t.age || "N/A"}</td>
                    <td style={{ padding: "12px" }}>{t.gender || "N/A"}</td>
                    <td style={{ padding: "12px" }}>
                      {t.teacher_image ? (
                        <img
                          src={t.teacher_image}
                          alt={t.name}
                          style={{
                            width: "100px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "2px solid #000",
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() => setEditTeacher(t)}
                          style={{
                            backgroundColor: "#000",
                            color: "#fff",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          style={{
                            backgroundColor: "#e60000",
                            color: "#fff",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#999",
                      fontStyle: "italic",
                    }}
                  >
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Form */}
        {editTeacher && (
          <div
            style={{
              marginTop: "40px",
              backgroundColor: "#f9f9f9",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              width: "100%",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>
              Edit Teacher: {editTeacher.name}
            </h3>
            <form
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
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "center",
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
              <div style={{ width: "100%", marginTop: "15px" }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "5px",
                    marginRight: "10px",
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditTeacher(null)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "5px",
                  }}
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
