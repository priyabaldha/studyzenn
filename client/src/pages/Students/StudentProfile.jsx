import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch student profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("You are not logged in.");
                    setLoading(false);
                    return;
                }

                const res = await axios.get("http://localhost:5000/api/students/profile/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProfile(res.data);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError(err.response?.data?.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handle image selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Upload profile image
    const handleUpload = async () => {
        if (!selectedFile) return alert("Please select a file first");

        const formData = new FormData();
        formData.append("student_image", selectedFile);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "http://localhost:5000/api/students/profile/upload-image",
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );

            setProfile(res.data.student); // Update profile with new image
            alert("Image uploaded successfully!");
            setSelectedFile(null); // Clear selected file after upload
        } catch (err) {
            console.error("Upload error:", err);
            alert(err.response?.data?.message || "Failed to upload image.");
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    
    // Ensure profile exists before accessing its properties
    if (!profile) return <p>Profile data not available.</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
            <h2>My Profile</h2>

            {profile.student_image && (
                <img
                    src={`http://localhost:5000/uploads/students/${profile.student_image}`}
                    alt="Profile"
                    style={{ width: "120px", borderRadius: "50%", marginBottom: "1rem" }}
                />
            )}


            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Roll No:</strong> {profile.rollNo}</p>
            
            {/* ✅ UPDATED FIELDS: Display Semester and Division instead of Class */}
            <p><strong>Semester:</strong> {profile.semester}</p>
            <p><strong>Division:</strong> {profile.division}</p> 
            
            <p><strong>Age:</strong> {profile.age}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Guardian:</strong> {profile.guardian}</p>
            <p><strong>Guardian Phone:</strong> {profile.guardian_phone}</p>

            <div style={{ marginTop: "1rem" }}>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload} style={{ marginLeft: "10px" }} disabled={!selectedFile}>
                    Upload Image
                </button>
            </div>
        </div>
    );
}