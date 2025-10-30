// pages/Students/StudentReportCard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js'; // 🆕 You must install this: npm install html2pdf.js

export default function StudentReportCard() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const fetchReport = async () => {
        try {
            // API: GET /api/reports/student/performance
            const res = await axios.get(
                'http://localhost:5000/api/reports/student/performance', 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReport(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load report.');
            console.error('Report fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [token]);

    const handleDownloadPDF = () => {
        if (!report) return;

        const element = document.getElementById('report-card-content');
        const filename = `ReportCard_${report.profile.rollNo}_${report.profile.semester}.pdf`;

        const opt = {
            margin: 0.5,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Use the imported library to generate PDF from the specific div
        html2pdf().set(opt).from(element).save();
    };

    if (loading) return <p>Generating performance report...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!report) return <p>No data available to generate report.</p>;

    const gradeCalc = (obtained, max) => {
        if (!max) return 'N/A';
        const p = (obtained / max) * 100;
        if (p >= 90) return 'A+';
        if (p >= 75) return 'B';
        if (p >= 50) return 'C';
        return 'F';
    };
    
    const { profile, attendance, examResults, assignmentStatus } = report;

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '20px' }}>
            <h2>📚 Combined Performance Report</h2>
            
            <button onClick={handleDownloadPDF} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', marginBottom: '20px' }}>
                ⬇️ Download Report Card (PDF)
            </button>

            <div id="report-card-content" style={{ padding: '30px', border: '1px solid #333', backgroundColor: 'white' }}>
                <h1 style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '10px' }}>STUDENT REPORT CARD</h1>
                
                {/* Profile and Class Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.1em' }}>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Roll No:</strong> {profile.rollNo}</p>
                    <p><strong>Class:</strong> {profile.semester} / {profile.division}</p>
                </div>

                {/* Section 1: Attendance Summary */}
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '30px' }}>Attendance Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
                    <p><strong>Total Days Recorded:</strong> {attendance.totalDays}</p>
                    <p><strong>Days Present/Late:</strong> {attendance.presentDays}</p>
                    <p><strong>Percentage:</strong> <span style={{ fontWeight: 'bold', color: attendance.percentage < 75 ? 'red' : 'green' }}>{attendance.percentage}%</span></p>
                </div>
                
                {/* Section 2: Exam Results */}
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '30px' }}>Exam Performance</h3>
                {examResults.length > 0 ? (
                    <table border="1" cellPadding="10" width="100%" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th>Subject</th>
                                <th>Exam Title</th>
                                <th>Marks Obtained</th>
                                <th>Max Marks</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examResults.map(r => (
                                <tr key={r._id}>
                                    <td>{r.examId.subjectId.name}</td>
                                    <td>{r.examId.title}</td>
                                    <td>{r.marksObtained}</td>
                                    <td>{r.examId.maxMarks}</td>
                                    <td>{gradeCalc(r.marksObtained, r.examId.maxMarks)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No published exam results found.</p>}

                {/* Section 3: Assignment Submission Status */}
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '30px' }}>Assignment Status</h3>
                {assignmentStatus.length > 0 ? (
                    <table border="1" cellPadding="10" width="100%" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th>Subject</th>
                                <th>Submission Status</th>
                                <th>Grading Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignmentStatus.map((a, index) => (
                                <tr key={index}>
                                    <td>{a.subject} ({a.title})</td>
                                    <td style={{ color: a.submitted ? 'green' : 'red' }}>{a.submitted ? 'Submitted' : 'Missing'}</td>
                                    <td style={{ color: a.isGraded ? 'blue' : 'gray' }}>{a.isGraded ? 'Graded' : 'Pending'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No assignments found for this class.</p>}
                
            </div>
        </div>
    );
}