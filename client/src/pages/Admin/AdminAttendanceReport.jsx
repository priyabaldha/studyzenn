// pages/Admin/AdminAttendanceReport.jsx
import React, { useState } from 'react';
import axios from 'axios';

const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

export default function AdminAttendanceReport() {
    const [filter, setFilter] = useState({
        semester: SEMESTER_OPTIONS[0] || '',
        division: DIVISION_OPTIONS[0] || ''
    });
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Select a class and click "Generate Report".');

    const token = localStorage.getItem('token');

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const generateReport = async () => {
        setLoading(true);
        setMessage('');
        setReport([]);

        try {
            const res = await axios.get(
                `http://localhost:5000/api/attendance/admin/report/${filter.semester}/${filter.division}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setReport(res.data);
            setMessage(`Report generated for ${res.data.length} students.`);

        } catch (err) {
            console.error('Admin report error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to generate report. Check server status or class existence.';
            setMessage(`Error: ${errorMessage}`);
            setReport([]);
        } finally {
            setLoading(false);
        }
    };

    // 🆕 NEW FUNCTION: Converts JSON data to CSV and triggers download
    const downloadReport = () => {
        if (report.length === 0) {
            alert("No data to download.");
            return;
        }

        // 1. Define CSV Headers
        const headers = [
            "Roll No",
            "Student Name",
            "Semester", // Add Semester and Division for context
            "Division",
            "Total Days",
            "Present",
            "Late",
            "Absent",
            "Percentage"
        ].join(',');
        
        // 2. Map data rows
        const csvRows = report.map(student => {
            // Ensure the order matches the headers
            return [
                student.rollNo,
                `"${student.name}"`, // Quote names in case they contain commas
                filter.semester, 
                filter.division,
                student.Total,
                student.Present,
                student.Late,
                student.Absent,
                student.percentage + '%'
            ].join(',');
        });

        // 3. Combine headers and rows
        const csvContent = headers + '\n' + csvRows.join('\n');

        // 4. Create and trigger download (CSV is essentially text)
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        // Use class details for the filename
        const fileName = `Attendance_Report_${filter.semester}_Div${filter.division}.csv`;

        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Admin Attendance Report 📊</h2>
            
            {/* Filter Section */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                <select name="semester" value={filter.semester} onChange={handleFilterChange} disabled={loading}>
                    {SEMESTER_OPTIONS.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                </select>
                <select name="division" value={filter.division} onChange={handleFilterChange} disabled={loading}>
                    {DIVISION_OPTIONS.map(div => <option key={div} value={div}>Division {div}</option>)}
                </select>
                
                <button 
                    onClick={generateReport} 
                    disabled={loading} 
                    style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>

                {/* 🆕 NEW DOWNLOAD BUTTON */}
                {report.length > 0 && (
                    <button 
                        onClick={downloadReport} 
                        style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        ⬇️ Download CSV
                    </button>
                )}
            </div>
            
            <p style={{ color: report.length > 0 ? 'green' : 'black' }}>{message}</p>

            {/* Attendance Report Table */}
            {report.length > 0 && (
                <table border="1" cellPadding="10" width="100%" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>Roll No</th>
                            <th>Student Name</th>
                            <th>Total Days</th>
                            <th>Present</th>
                            <th>Late</th>
                            <th>Absent</th>
                            <th>Percentage</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map(student => (
                            <tr key={student.id}>
                                <td>{student.rollNo}</td>
                                <td>{student.name}</td>
                                <td>{student.Total}</td>
                                <td style={{ color: 'green' }}>{student.Present}</td>
                                <td style={{ color: 'orange' }}>{student.Late}</td>
                                <td style={{ color: 'red' }}>{student.Absent}</td>
                                <td style={{ fontWeight: 'bold', color: student.percentage >= 75 ? 'green' : 'red' }}>
                                    {student.percentage}%
                                </td>
                                <td>
                                    {student.percentage >= 75 ? 'Satisfactory' : '🚨 Low'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}