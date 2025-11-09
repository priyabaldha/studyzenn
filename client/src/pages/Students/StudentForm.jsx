import React, { useState } from "react";
import axios from "axios";
import AdminHeader from "../Admin/components/AdminHeader";
import AdminSlidebar from "../Admin/components/AdminSlidebar"; 
import "../../css/StudentForm.css"; 

const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

const StudentForm = () => {
    // We only need the URL/placeholder in formData, but not the file itself
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", semester: SEMESTER_OPTIONS[0] || "",
        division: DIVISION_OPTIONS[0] || "", age: "", gender: "",
        guardian: "", guardian_phone: "", rollNo: "",
    });

    // 🆕 NEW STATE: To hold the actual file object for Multer
    const [selectedFile, setSelectedFile] = useState(null); 

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // 🆕 NEW HANDLER: To capture the selected image file
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // 🆕 MODIFIED SUBMIT HANDLER to use FormData for image
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Create FormData object to handle binary file data
        const dataToSend = new FormData();
        
        // Append all standard fields
        for (const key in formData) {
            dataToSend.append(key, formData[key]);
        }
        
        // Append the file if one was selected
        if (selectedFile) {
            // The key 'student_image' must match the key used in your Multer setup on the backend
            dataToSend.append("student_image", selectedFile); 
        }

        try {
            // NOTE: axios automatically sets Content-Type: multipart/form-data when using FormData
            await axios.post("http://localhost:5000/api/students", dataToSend);
            
            alert("✅ Student added successfully!");
            
            // Reset form states
            setFormData({
                name: "", email: "", password: "", semester: SEMESTER_OPTIONS[0] || "",
                division: DIVISION_OPTIONS[0] || "", age: "", gender: "",
                guardian: "", guardian_phone: "", rollNo: "",
            });
            setSelectedFile(null); // Clear file input
            
        } catch (err) {
            console.error("Add student failed:", err.response?.data || err);
            alert("❌ Failed to add student. Check console for details.");
        }
    };

    return (
        <div className="student-form-wrapper"> 
            <AdminHeader />
            <AdminSlidebar /> 
            
            <div className="student-form-container">
                <h2 className="student-form-title">Add New Student</h2>

                {/* NOTE: We removed the `enctype` attribute as it's handled by axios/FormData */}
                <form onSubmit={handleSubmit} className="student-form"> 
                    
                    <div className="form-group">
                        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                        <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <input name="rollNo" placeholder="Roll Number" value={formData.rollNo} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <select name="semester" value={formData.semester} onChange={handleChange} required>
                            {SEMESTER_OPTIONS.map((sem) => (<option key={sem} value={sem}>{sem}</option>))}
                        </select>

                        <select name="division" value={formData.division} onChange={handleChange} required>
                            {DIVISION_OPTIONS.map((div) => (<option key={div} value={div}>Division {div}</option>))}
                        </select>
                    </div>

                    <div className="form-group">
                        <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
                        <select name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <input name="guardian" placeholder="Guardian Name" value={formData.guardian} onChange={handleChange} required />
                        <input name="guardian_phone" placeholder="Guardian Phone" value={formData.guardian_phone} onChange={handleChange} required />
                    </div>

                    {/* ✅ INPUT FIELD FOR FILE UPLOAD */}
                    <div className="form-group" style={{ flexDirection: 'column' }}>
                         <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>Student Profile Image (Optional):</label>
                         <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            // Note: We don't use 'value' here as file inputs are uncontrolled
                            className="file-input" 
                         />
                    </div>
                    {/* The old text input for student_image is removed as we handle the file directly */}

                    <button type="submit" className="student-form-btn">Add Student</button>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;