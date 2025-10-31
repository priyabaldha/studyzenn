// pages/Admin/AdminAssignmentStatus.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from "../Admin/components/AdminHeader";
import AdminSlidebar from "../Admin/components/AdminSlidebar";
import '../../css/AdminAssignmentStatus.css'; // ✅ Import external CSS

export default function AdminAssignmentStatus() {
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Select an assignment to view submission status.');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/assignments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAssignments(res.data);
            } catch (err) {
                console.error('Failed to fetch assignments:', err);
            }
        };
        fetchAssignments();
    }, [token]);

    const handleAssignmentChange = (e) => {
        setSelectedAssignmentId(e.target.value);
        setReportData(null);
        setMessage('');
    };

    const generateReport = async () => {
        if (!selectedAssignmentId) {
            setMessage('Please select an assignment first.');
            return;
        }

        setLoading(true);
        setMessage('');
        setReportData(null);

        try {
            const res = await axios.get(
                `http://localhost:5000/api/assignments/admin/status/${selectedAssignmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReportData(res.data);
            setMessage(`Status report generated for ${res.data.report.length} students.`);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to generate report.';
            setMessage(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (submitted, graded) => {
        if (graded) return { text: 'Graded ✅', color: 'blue' };
        if (submitted) return { text: 'Submitted (Pending Grade)', color: 'green' };
        return { text: 'Pending Submission ❌', color: 'red' };
    };

    return (
        <div>
            <AdminHeader />
            <AdminSlidebar />

            <div className="assignment-container">
                <h2 className="assignment-title">Admin Assignment Status Report</h2>

                {/* Filter Section */}
                <div className="assignment-filter">
                    <select
                        value={selectedAssignmentId}
                        onChange={handleAssignmentChange}
                        disabled={loading}
                    >
                        <option value="">Select Assignment</option>
                        {assignments.map(a => (
                            <option key={a._id} value={a._id}>
                                {a.subject} - {a.semester} / {a.division} ({new Date(a.uploadDate).toLocaleDateString()})
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={generateReport}
                        disabled={loading || !selectedAssignmentId}
                        className="btn-view"
                    >
                        {loading ? 'Generating...' : 'View Status'}
                    </button>
                </div>

                <p className={`assignment-message ${reportData ? 'success' : ''}`}>{message}</p>

                {reportData && reportData.report.length > 0 && (
                    <>
                        <h3 className="assignment-subtitle">
                            Assignment: {reportData.assignmentDetails.subject} ({reportData.assignmentDetails.semester} / {reportData.assignmentDetails.division})
                        </h3>

                        <table className="assignment-table">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Student Name</th>
                                    <th>Submission Status</th>
                                    <th>Grading Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.report.map(student => {
                                    const status = getStatusStyle(student.submitted, student.isGraded);
                                    return (
                                        <tr key={student.id}>
                                            <td>{student.rollNo}</td>
                                            <td>{student.name}</td>
                                            <td style={{ color: status.color, fontWeight: 'bold' }}>
                                                {status.text}
                                            </td>
                                            <td>{student.isGraded ? 'Graded' : (student.submitted ? 'Pending' : 'N/A')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}
