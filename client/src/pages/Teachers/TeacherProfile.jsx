import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ qualification: "", age: "", gender: "" });
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/teachers/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setForm({
          qualification: res.data.qualification || "",
          age: res.data.age || "",
          gender: res.data.gender || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle text input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle image selection
  const handleImageChange = (e) => setImage(e.target.files[0]);

  // Update profile info
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/teachers/profile/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
      window.location.reload(); // Refresh to show updated info
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    }
  };

  // Upload profile image
  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image first!");
    try {
      const formData = new FormData();
      formData.append("teacher_image", image);
      await axios.post("http://localhost:5000/api/teachers/profile/upload-image", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("Image uploaded successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image");
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Teacher Profile</h2>

      {profile.teacher_image && (
        <img
          src={`http://localhost:5000/uploads/teachers/${profile.teacher_image}`}
          alt="Profile"
          style={styles.image}
        />
      )}

      <form onSubmit={handleUploadImage} style={styles.imageForm}>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button type="submit" style={styles.button}>
          Upload Image
        </button>
      </form>

      {!isEditing ? (
        <div style={styles.infoBox}>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Qualification:</strong> {profile.qualification}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} style={styles.form}>
          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={form.qualification}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={form.gender}
            onChange={handleChange}
            style={styles.input}
          />
          <div>
            <button type="submit" style={styles.saveBtn}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// 🎨 Inline styles
const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1.5rem",
    border: "1px solid #ccc",
    borderRadius: "12px",
    background: "#f9f9f9",
    textAlign: "center",
  },
  title: { marginBottom: "1rem", color: "#333" },
  image: { width: "120px", borderRadius: "50%", marginBottom: "1rem" },
  infoBox: { textAlign: "left", marginTop: "1rem" },
  form: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  input: {
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  editBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  saveBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "0.5rem",
  },
  cancelBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  imageForm: { marginBottom: "1rem" },
};

export default TeacherProfile;
