import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from "../Admin/components/AdminHeader";
import AdminSlidebar from "../Admin/components/AdminSlidebar";
import "../../css/AdminSubjectManager.css"; // Import the external CSS

const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

export default function AdminSubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    semester: SEMESTER_OPTIONS[0] || "",
    code: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterSemester, setFilterSemester] = useState("");
  const token = localStorage.getItem("token");

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const filterQuery = filterSemester ? `?semester=${filterSemester}` : "";
      const res = await axios.get(
        `http://localhost:5000/api/subjects${filterQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [token, filterSemester]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/subjects/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/subjects", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({
        name: "",
        semester: SEMESTER_OPTIONS[0] || "",
        code: "",
        description: "",
      });
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save subject.");
    }
  };

  const handleEdit = (subject) => {
    setForm(subject);
    setEditingId(subject._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete subject.");
    }
  };

  if (loading) return <p>Loading subjects...</p>;

  return (
    <div>
      <AdminHeader />
      <AdminSlidebar />
      <div
        style={{
          marginLeft: "260px", // ✅ Added spacing to push content right
          padding: "40px 60px",
          paddingTop: "120px",
          maxWidth: "1100px",
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>
          Subject Management
        </h2>

        {/* Add/Edit Form */}
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>
            {editingId ? "Edit Subject" : "Add New Subject"}
          </h3>
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <input
                name="name"
                placeholder="Name (e.g., Computer Science)"
                value={form.name}
                onChange={handleChange}
                required
                style={{ flex: "1", minWidth: "220px", padding: "8px" }}
              />
              <input
                name="code"
                placeholder="Code (e.g., CS401)"
                value={form.code}
                onChange={handleChange}
                required
                style={{ flex: "1", minWidth: "120px", padding: "8px" }}
              />
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                required
                style={{ flex: "1", minWidth: "120px", padding: "8px" }}
              >
                <option value="">Select Semester</option>
                {SEMESTER_OPTIONS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "10px",
                borderRadius: "6px",
              }}
            />

            <div style={{ marginTop: "15px" }}>
              <button
                type="submit"
                style={{
                  backgroundColor: editingId ? "orange" : "green",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                {editingId ? "Update Subject" : "Add Subject"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      name: "",
                      semester: SEMESTER_OPTIONS[0] || "",
                      code: "",
                      description: "",
                    });
                  }}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Subject List */}
        <h3 style={{ marginBottom: "15px" }}>Available Subjects</h3>
        <div style={{ marginBottom: "15px" }}>
          Filter by Semester:{" "}
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            style={{ padding: "5px 10px" }}
          >
            <option value="">View All</option>
            {SEMESTER_OPTIONS.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        <table
          border="1"
          cellPadding="10"
          width="100%"
          style={{
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th>Name</th>
              <th>Code</th>
              <th>Semester</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="4">No subjects found for this filter.</td>
              </tr>
            ) : (
              subjects.map((subject) => (
                <tr key={subject._id}>
                  <td>{subject.name}</td>
                  <td>{subject.code}</td>
                  <td>{subject.semester}</td>
                  <td style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button
                      onClick={() => handleEdit(subject)}
                      style={{
                        backgroundColor: "#000",
                        color: "white",
                        padding: "5px 12px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subject._id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "5px 12px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
