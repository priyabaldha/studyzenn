import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../Admin/components/AdminHeader";
import AdminSlidebar from "../Admin/components/AdminSlidebar";
import "../../css/AdminSubjectManager.css";

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
      <div className="subject-manager-container">
        <h2 className="page-title">Subject Management</h2>

        <div className="form-card">
          <h3>{editingId ? "Edit Subject" : "Add New Subject"}</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="form-row">
              <input
                name="name"
                placeholder="Name (e.g., Computer Science)"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="code"
                placeholder="Code (e.g., CS401)"
                value={form.code}
                onChange={handleChange}
                required
              />
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                required
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
            />

            <div className="button-row">
              <button type="submit" className={editingId ? "btn-edit" : "btn-add"}>
                {editingId ? "Update Subject" : "Add Subject"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      name: "",
                      semester: SEMESTER_OPTIONS[0] || "",
                      code: "",
                      description: "",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <h3>Available Subjects</h3>
        <div className="filter-row">
          Filter by Semester:
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
          >
            <option value="">View All</option>
            {SEMESTER_OPTIONS.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        <table className="subject-table">
          <thead>
            <tr>
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
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(subject)} className="btn-black">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subject._id)}
                      className="btn-red"
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
