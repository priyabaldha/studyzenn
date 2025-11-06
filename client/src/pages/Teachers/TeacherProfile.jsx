import React, { useEffect, useState } from "react";
import axios from "axios";
import TeacherSlidebar from "../Teachers/components/TeacherSlidebar";
import "../../css/TeacherProfile.css";

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
        const res = await axios.get(
          "http://localhost:5000/api/teachers/profile/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle image selection
  const handleImageChange = (e) => setImage(e.target.files[0]);

  // Update profile info
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/teachers/profile/update",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      await axios.post(
        "http://localhost:5000/api/teachers/profile/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Image uploaded successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image");
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <TeacherSlidebar />

      {/* Centered Profile Section */}
      <div
        style={{
          flex: 1,
          marginLeft: "250px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="profile-container">
          <h2 className="profile-title">Teacher Profile</h2>

          {profile.teacher_image && (
            <img
              src={`http://localhost:5000/uploads/teachers/${profile.teacher_image}`}
              alt="Profile"
              className="profile-image"
            />
          )}

          <form onSubmit={handleUploadImage} className="image-form">
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <button type="submit" className="profile-btn upload">
              Upload Image
            </button>
          </form>

          {!isEditing ? (
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Qualification:</strong> {profile.qualification}
              </p>
              <p>
                <strong>Age:</strong> {profile.age}
              </p>
              <p>
                <strong>Gender:</strong> {profile.gender}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="profile-btn edit"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="profile-form">
              <input
                type="text"
                name="qualification"
                placeholder="Qualification"
                value={form.qualification}
                onChange={handleChange}
                required
                className="profile-input"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                className="profile-input"
              />
              <input
                type="text"
                name="gender"
                placeholder="Gender"
                value={form.gender}
                onChange={handleChange}
                className="profile-input"
              />
              <div>
                <button type="submit" className="profile-btn save">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="profile-btn cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
