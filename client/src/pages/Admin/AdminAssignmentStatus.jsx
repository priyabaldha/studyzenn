// pages/Admin/AdminAssignmentStatus.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminAssignmentStatus() {
    const [assignments, setAssignments] = useState([]); // List of all assignments (for dropdown)
    const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Select an assignment to view submission status.');

    const token = localStorage.getItem('token');

    // Fetch all assignments for the dropdown
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                // Using the teacher's 'get all assignments' route, assuming admin has access
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
            // Call the new backend route
            const res = await axios.get(
                `http://localhost:5000/api/assignments/admin/status/${selectedAssignmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setReportData(res.data);
            setMessage(`Status report generated for ${res.data.report.length} students.`);

        } catch (err) {
            console.error('Admin status report error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to generate report.';
            setMessage(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };
    
    // Helper function for status display
    const getStatusStyle = (submitted, graded) => {
        if (graded) return { text: 'Graded ✅', color: 'blue' };
        if (submitted) return { text: 'Submitted (Pending Grade)', color: 'green' };
        return { text: 'Pending Submission ❌', color: 'red' };
    };

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Admin Submission Status Report</h2>
            
            {/* Filter Section */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                <select value={selectedAssignmentId} onChange={handleAssignmentChange} disabled={loading}>
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
                    style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {loading ? 'Generating...' : 'View Status'}
                </button>
            </div>
            
            <p style={{ color: reportData ? 'green' : 'black' }}>{message}</p>

            {/* Submission Status Table */}
            {reportData && reportData.report.length > 0 && (
                <>
                    <h3 style={{ marginTop: '20px' }}>
                        Assignment: {reportData.assignmentDetails.subject} ({reportData.assignmentDetails.semester} / {reportData.assignmentDetails.division})
                    </h3>
                    <table border="1" cellPadding="10" width="100%" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
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
                                        <td>
                                            {student.isGraded ? 'Graded' : (student.submitted ? 'Pending' : 'N/A')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}