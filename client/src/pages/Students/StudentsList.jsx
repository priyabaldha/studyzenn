import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Admin/components/AdminHeader";
import AdminSlidebar from "../Admin/components/AdminSlidebar";
import "../../css/AdminStudentsList.css"; 

const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [editStudent, setEditStudent] = useState(null);
    const [csvFile, setCsvFile] = useState(null); // 🆕 New state for CSV file
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

    const handleEdit = (student) => setEditStudent(student);

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
    
    // 🆕 Handler for CSV file selection
    const handleCsvFileChange = (e) => {
        setCsvFile(e.target.files[0]);
    };

    // 🆕 Handler for CSV file upload submission
    const handleCsvUpload = async () => {
        if (!csvFile) return alert("Please select a CSV file.");
        
        if (!csvFile.name.endsWith('.csv')) {
            return alert("Please upload a valid CSV file.");
        }
        
        const formData = new FormData();
        formData.append('file', csvFile); // Key 'file' must match backend router

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                'http://localhost:5000/api/students/upload-csv',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(res.data.message);
            setCsvFile(null); // Clear file selection
            fetchStudents(); // Refresh the student list
        } catch (err) {
            console.error("CSV Upload Error:", err);
            alert(err.response?.data?.error || "Failed to import students via CSV.");
        }
    };


    return (
        <div className="students-page-container">
            <AdminHeader />
            <AdminSlidebar />

            <div className="students-content">
                <div className="students-card">
                    <h2>Students List</h2>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                        
                        {/* 1. Add Student Button (Manual Entry) */}
                        <button
                            className="add-student-btn"
                            onClick={() => navigate("/admin/students/add")}
                        >
                            ➕ Add Student (Manual)
                        </button>
                        
                        {/* 2. CSV Upload Section */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                                type="file" 
                                accept=".csv" 
                                onChange={handleCsvFileChange} 
                                style={{ maxWidth: '170px' }} 
                            />
                            <button
                                className="add-student-btn"
                                onClick={handleCsvUpload}
                                disabled={!csvFile}
                                style={{ backgroundColor: csvFile ? '#007bff' : '#ccc' }}
                            >
                                ⬆️ Upload CSV
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="students-table">
                            <thead>
                                <tr>
                                    {[
                                        "Name", "Email", "Roll No", "Semester", "Division", "Age", "Gender", 
                                        "Guardian", "Guardian Phone", "Image", "Actions",
                                    ].map((header) => (
                                        <th key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" className="no-students">
                                            No students found.
                                        </td>
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
                                                        className="student-img" 
                                                    />
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className="action-btn edit-btn"
                                                    onClick={() => handleEdit(student)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="action-btn delete-btn"
                                                    onClick={() => handleDelete(student._id)}
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

                    {/* Edit Student Form Block */}
                    {editStudent && (
                        <div className="edit-form-container">
                            <h3>Edit Student: {editStudent.name}</h3>
                            <form className="edit-form" onSubmit={handleUpdate}>
                                <input className="edit-input" name="name" value={editStudent.name} onChange={handleChange} placeholder="Full Name" required />
                                <input className="edit-input" name="email" value={editStudent.email} onChange={handleChange} placeholder="Email" required />
                                
                                <input className="edit-input" name="rollNo" value={editStudent.rollNo} onChange={handleChange} placeholder="Roll No" required />
                                <input className="edit-input" name="password" onChange={handleChange} placeholder="New Password (optional)" />
                                
                                <select className="edit-input" name="semester" value={editStudent.semester} onChange={handleChange} required>
                                    <option value="" disabled>Select Semester</option>
                                    {SEMESTER_OPTIONS.map((sem) => (<option key={sem} value={sem}>{sem}</option>))}
                                </select>
                                <select className="edit-input" name="division" value={editStudent.division} onChange={handleChange} required>
                                    <option value="" disabled>Select Division</option>
                                    {DIVISION_OPTIONS.map((div) => (<option key={div} value={div}>Division {div}</option>))}
                                </select>

                                <input className="edit-input" name="age" type="number" value={editStudent.age} onChange={handleChange} placeholder="Age" required />
                                <select className="edit-input" name="gender" value={editStudent.gender} onChange={handleChange} required>
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                
                                <input className="edit-input" name="guardian" value={editStudent.guardian} onChange={handleChange} placeholder="Guardian Name" required />
                                <input className="edit-input" name="guardian_phone" value={editStudent.guardian_phone} onChange={handleChange} placeholder="Guardian Phone" required />

                                <input className="edit-input" name="student_image" placeholder="Image URL (optional)" value={editStudent.student_image || ''} onChange={handleChange} />


                                <div style={{ width: "100%", marginTop: "10px" }}>
                                    <button type="submit" className="save-btn">Save Changes</button>
                                    <button
                                        type="button"
                                        onClick={() => setEditStudent(null)}
                                        className="cancel-btn"
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentsList;