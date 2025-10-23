import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/students/profile/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>My Profile</h2>

      {profile.image && (
        <img
          src={`http://localhost:5000/uploads/students/${profile.image}`}
          alt="Profile"
          style={{ width: "120px", borderRadius: "50%", marginBottom: "1rem" }}
        />
      )}

      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Roll No:</strong> {profile.rollNo}</p>
      <p><strong>Class:</strong> {profile.class}</p>
      <p><strong>Age:</strong> {profile.age}</p>
      <p><strong>Gender:</strong> {profile.gender}</p>
      <p><strong>Guardian:</strong> {profile.guardian}</p>
      <p><strong>Guardian Phone:</strong> {profile.guardian_phone}</p>
    </div>
  );
}
