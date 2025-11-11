// client/src/pages/Students/StudentAssignmentView.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function StudentAssignmentView() {
    const { id: assignmentId } = useParams(); 
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submission, setSubmission] = useState(null); 
    const [submittedFile, setSubmittedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [user, setUser] = useState(null);

    const token = localStorage.getItem("token"); 
    const navigate = useNavigate();

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Fetch user details from localStorage (if available)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                console.error("Failed to parse user data.");
            }
        }
    }, []);

    const fetchAssignment = async () => {
        if (!assignmentId || !token) { 
            setLoading(false);
            setError("User not logged in or session expired. Please log in again.");
            return;
        }

        try {
            const assignmentRes = await axios.get(`http://localhost:5000/api/assignments/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignment(assignmentRes.data);

            const submissionRes = await axios.get(`http://localhost:5000/api/assignments/student/submission/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubmission(submissionRes.data);

        } catch (err) {
            if (err.response?.status === 404) {
                setSubmission(null);
            } else {
                console.error("Assignment fetch error:", err);
                setError(err.response?.data?.message || err.message); 
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignment();
    }, [assignmentId, token]);

    const handleFileChange = (e) => {
        setSubmittedFile(e.target.files[0]);
        setUploadMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!submittedFile) {
            setUploadMessage("Please select a file to upload.");
            return;
        }

        try {
            setUploadMessage("Uploading...");
            const formData = new FormData();
            formData.append("submitted_file", submittedFile);

            await axios.post(
                `http://localhost:5000/api/assignments/student/upload/${assignmentId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setUploadMessage("Assignment uploaded successfully! Page refreshing...");
            setSubmittedFile(null);
            fetchAssignment();
        } catch (err) {
            console.error("Submission Error:", err);
            setUploadMessage(
                err.response?.data?.message || "Failed to upload assignment."
            );
        }
    };

    if (loading) return <p>Loading assignment...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!assignment) return <p>Assignment not found.</p>;

    const isSubmitted = !!submission?.submitted_file;
    const isGraded = submission?.isGraded;

    let statusText = "Pending";
    let statusColor = "orange";
    if (isGraded) {
        statusText = "Graded";
        statusColor = "blue";
    } else if (isSubmitted) {
        statusText = "Submitted (Awaiting Grade)";
        statusColor = "green";
    }

    const teacherFilePath = `http://localhost:5000/uploads/assignments/teacher/${assignment.assignment_file_q}`;
    const studentFilePath = `http://localhost:5000/uploads/assignments/student/${submission?.submitted_file}`;

    return (
        <>
            {/* ================ Start Header Area ================= */}
            {token && user && (
                <header className="default-header">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container">
                            <h1 className="navbar-brand mb-0" style={{ color: "#ffffff", fontWeight: "700" }}>
                                STUDYZEN
                            </h1>

                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="lnr lnr-menu"></span>
                            </button>

                            <div
                                className="collapse navbar-collapse justify-content-end align-items-center"
                                id="navbarSupportedContent"
                            >
                                <ul
                                    className="navbar-nav d-flex align-items-center"
                                    style={{
                                        gap: "5px",
                                        fontWeight: "500",
                                    }}
                                >
                                    <li>
                                        <Link to="/dashboard/student" style={{ color: "#fff", textDecoration: "none" }}>
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/student/assignments" style={{ color: "#fff", textDecoration: "none" }}>
                                            Assignments
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/student/attendance" style={{ color: "#fff", textDecoration: "none" }}>
                                            Attendance
                                        </Link>
                                    </li>
                                    <li className="dropdown">
                                        <a
                                            className="dropdown-toggle"
                                            href="#"
                                            data-bs-toggle="dropdown"
                                            style={{ color: "#fff", textDecoration: "none" }}
                                        >
                                            Exam
                                        </a>
                                        <div className="dropdown-menu">
                                            <Link className="dropdown-item" to="/student/exam-schedule">
                                                Exam Schedule
                                            </Link>
                                            <Link className="dropdown-item" to="/student/results">
                                                Exam Results
                                            </Link>
                                            <Link className="dropdown-item" to="/student/report-card">
                                                Report Card
                                            </Link>
                                        </div>
                                    </li>
                                    <li>
                                        <Link to="/student/profile" style={{ color: "#fff", textDecoration: "none" }}>
                                            Profile
                                        </Link>
                                    </li>
                                    <li style={{ display: "flex", alignItems: "center" }}>
                                        <Link
                                            to="/messages"
                                            style={{
                                                color: "#fff",
                                                textDecoration: "none",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "18px",
                                            }}
                                            title="Notice Board"
                                        >
                                            <i className="lnr lnr-bullhorn"></i>
                                        </Link>
                                    </li>
                                    <li
                                        className="nav-item d-flex align-items-center"
                                        style={{ color: "#fff", fontWeight: "600", marginLeft: "10px" }}
                                    >
                                        👋 Welcome,&nbsp;
                                        <strong>{user.name}</strong>&nbsp;[{user.role}]
                                    </li>
                                    <li className="nav-item" style={{ marginLeft: "10px" }}>
                                        <button
                                            onClick={handleLogout}
                                            className="btn btn-outline-light btn-sm"
                                            style={{ padding: "3px 10px" }}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                    <li style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}>
                                        <button
                                            className="search btn btn-link p-0"
                                            onClick={() => setShowSearch(true)}
                                            style={{ color: "#fff" }}
                                        >
                                            <span className="lnr lnr-magnifier" id="search"></span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    {showSearch && (
                        <div className="search-input" id="search-input-box">
                            <div className="container">
                                <form className="d-flex justify-content-between" onSubmit={(e) => e.preventDefault()}>
                                    <input type="text" className="form-control" id="search-input" placeholder="Search Here" />
                                    <button type="submit" className="btn"></button>
                                    <span
                                        className="lnr lnr-cross"
                                        id="close-search"
                                        title="Close Search"
                                        onClick={() => setShowSearch(false)}
                                    ></span>
                                </form>
                            </div>
                        </div>
                    )}
                </header>
            )}
            {/* ================ End Header Area ================= */}

           {/* ================ Start Banner Area ================= */}
            <section
            className="banner-area"
            style={{
                position: "relative",
                width: "123vw", // full viewport width
                left: "70%",
                right: "50%",
                marginLeft: "-50vw", // removes Bootstrap container limits
                marginRight: "-50vw",
                backgroundImage: "url('/img/banner-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                padding: "100px 0 120px",
                overflow: "hidden",
                zIndex: 0,
            }}
            >
            <div
                style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "100%",
                maxWidth: "1140px", // same as Bootstrap container width
                margin: "0 auto",
                padding: "0 15px",
                }}
            >
                <div
                className="banner-right"
                style={{
                    textAlign: "right",
                    maxWidth: "600px",
                    color: "#fff",
                    zIndex: 2,
                    position: "relative",
                }}
                >
                <h1
                    className="text-white"
                    style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "52px",
                    marginBottom: "15px",
                    }}
                >
                    Assignments
                </h1>

                <p
                    className="mx-auto text-white mt-20 mb-40"
                    style={{
                    color: "#fff",
                    fontSize: "18px",
                    marginTop: "10px",
                    marginBottom: "30px",
                    }}
                >
                    Stay updated and complete your assignments on time.
                </p>

                <div className="link-nav">
                    <span className="box" style={{ color: "#fff" }}>
                    <Link
                        to="/dashboard/student"
                        style={{
                        color: "#fff",
                        textDecoration: "none",
                        marginRight: "8px",
                        }}
                    >
                        Home
                    </Link>
                    <i className="lnr lnr-arrow-right" style={{ margin: "0 8px" }}></i>
                    <Link to="/student/assignments" style={{ color: "#fff", textDecoration: "none" }}>
                        Assignments
                    </Link>
                    </span>
                </div>
                </div>
            </div>
            </section>
           {/* ================ End Banner Area ================= */}


            {/* Original Page Content (unchanged) */}
            <div
                style={{
                    maxWidth: "600px",
                    margin: "2rem auto",
                    border: "1px solid #ddd",
                    padding: "20px",
                }}
            >
                <h2>
                    {assignment.subject} - {assignment.category}
                </h2>
                <p>
                    <strong>Semester:</strong> {assignment.semester}
                </p>
                <p>
                    <strong>Division:</strong> {assignment.division}
                </p>
                <p>
                    <strong>Status:</strong>{" "}
                    <span style={{ color: statusColor, fontWeight: "bold" }}>{statusText}</span>
                </p>

                {isGraded && (
                    <div style={{ border: "2px solid blue", padding: "15px", marginTop: "20px" }}>
                        <h3>✅ Graded!</h3>
                        <p>
                            <strong>Marks:</strong> {submission.marks} / 100
                        </p>
                        <p>
                            <strong>Grade:</strong> {submission.grade}
                        </p>
                        <p>
                            <strong>Teacher Feedback:</strong>{" "}
                            {submission.feedback || "No specific feedback provided."}
                        </p>
                    </div>
                )}

                {assignment.assignment_file_q && (
                    <p>
                        <a
                            href={teacherFilePath}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: "inline-block",
                                padding: "5px 10px",
                                backgroundColor: "#007bff",
                                color: "white",
                                textDecoration: "none",
                                borderRadius: "4px",
                            }}
                        >
                            📥 Download Question File
                        </a>
                    </p>
                )}

                {isSubmitted && submission?.submitted_file && (
                    <p>
                        <strong>Your Submitted File:</strong>
                        <a href={studentFilePath} target="_blank" rel="noreferrer" style={{ marginLeft: "10px" }}>
                            View/Download
                        </a>
                        {submission.submissionDate && (
                            <small style={{ marginLeft: "15px", color: "#666" }}>
                                Submitted on: {new Date(submission.submissionDate).toLocaleString()}
                            </small>
                        )}
                    </p>
                )}

                <hr style={{ margin: "20px 0" }} />

                <h3 style={{ marginBottom: "15px" }}>Submit Your Work</h3>
                {uploadMessage && (
                    <p style={{ color: uploadMessage.includes("success") ? "green" : "red" }}>{uploadMessage}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        name="submitted_file"
                        onChange={handleFileChange}
                        required
                        style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                    <button
                        type="submit"
                        disabled={!submittedFile}
                        style={{
                            marginLeft: "10px",
                            padding: "10px 15px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        {isSubmitted ? "Resubmit Assignment" : "Upload Submission"}
                    </button>
                </form>
            </div>

           {/* ================ Start Footer Area (FIXED STYLING) ================= */}
            <footer
                className="footer-area section-gap"
                style={{
                    position: "relative",
                    width: "190%", // Default width should be sufficient if container is fluid
                    marginTop: "-150px", // Pull the footer up the page to align the wave correctly
                    paddingTop: "250px", // Add space for the wave image peak
                    paddingBottom: "50px",
                    // Apply the dark background color for the bottom section
                    color: "#fbfafaff", // Set default text color to BLACK for visibility on the white wave
                    overflow: "hidden",
                    zIndex: 0, 
                    // Add the wave image background
                    backgroundImage: "url('/img/footer-bg.png')", // Assuming this path is correct for the wave
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Footer Content Wrapper */}
                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <div className="row">
                        <div className="col-lg-3 col-md-6 single-footer-widget">
                            <h4 style={{ color: "#faf3f3ff" }}>Quick Links</h4>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>About Us</a></li>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>Dashboard</a></li>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>Support</a></li>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>Contact</a></li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-md-6 single-footer-widget">
                            <h4 style={{ color: "#fdf7f7ff" }}>Features</h4>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>Assignments</a></li>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>Grades</a></li>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>Attendance</a></li>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>Reports</a></li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-md-6 single-footer-widget">
                            <h4 style={{ color: "#fbf8f8ff" }}>Resources</h4>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>Help Center</a></li>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>User Guide</a></li>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>Teacher Portal</a></li>
                                <li><a href="#" style={{ color: "#a5a5a5ff", textDecoration: "none" }}>Student Guide</a></li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-md-6 single-footer-widget">
                            <h4 style={{ color: "#fbf8f8ff" }}>Stay Updated</h4>
                            <p style={{ color: "#a5a5a5ff" }}>Get StudyZen news and updates.</p>
                            <form className="d-flex align-items-center" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    className="form-control me-2"
                                    type="email"
                                    placeholder="Your Email"
                                    required
                                    style={{ flex: 1, minWidth: "0", backgroundColor: "#fff", color: "#333", border: "none" }}
                                />
                                <button 
                                    className="click-btn btn btn-default text-uppercase" 
                                    type="submit" 
                                    style={{ backgroundColor: "#7F41E1", color: "white", border: "none" }} 
                                >
                                    SUBSCRIBE
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Copyright Section (This will inherit the dark background color, so text must be white) */}
                    <div className="footer-bottom row align-items-center mt-4" style={{ borderTop: "1px solid #333", paddingTop: "20px" }}>
                        <p className="footer-text m-0 col-lg-12 text-center" style={{ color: "#ccc" }}>
                            © {new Date().getFullYear()} StudyZen | Empowering education with <span style={{ color: "red" }}>❤️</span> by the StudyZen Team.
                        </p>
                    </div>
                </div>
            </footer> 
            {/* ================ End Footer Area ================= */}

        </>
    );
}
