// pages/Students/StudentAttendance.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentAttendance() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ present: 0, absent: 0, total: 0, percentage: 0 });

    const token = localStorage.getItem('token');

    const fetchAttendance = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(
                'http://localhost:5000/api/attendance/student/me',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const data = res.data;
            setHistory(data);

            // Calculate stats
            const totalDays = data.length;
            const presentDays = data.filter(record => record.status === 'Present' || record.status === 'Late').length;
            const absentDays = totalDays - presentDays;
            const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
            
            setStats({
                present: presentDays,
                absent: absentDays,
                total: totalDays,
                percentage: percentage
            });

        } catch (err) {
            console.error('Fetch attendance error:', err);
            setError(err.response?.data?.message || 'Failed to fetch attendance history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    if (loading) return <p>Loading attendance history...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const statusStyle = (status) => {
        switch (status) {
            case 'Present': return { color: 'green', fontWeight: 'bold' };
            case 'Absent': return { color: 'red', fontWeight: 'bold' };
            case 'Late': return { color: 'orange', fontWeight: 'bold' };
            default: return {};
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>My Attendance Summary</h2>

            {/* Attendance Statistics Card */}
            <div style={{ padding: '15px', marginBottom: '30px', border: '2px solid #007bff', borderRadius: '8px', background: '#f8f9fa' }}>
                <p style={{ fontSize: '1.2em', margin: '0 0 10px 0' }}>
                    Overall Attendance: 
                    <span style={{ color: stats.percentage >= 75 ? 'green' : 'red', fontWeight: 'bold', marginLeft: '10px' }}>
                        {stats.percentage}%
                    </span>
                </p>
                <p>Total Days Recorded: {stats.total}</p>
                <p>Days Present/Late: {stats.present}</p>
                <p>Days Absent: {stats.absent}</p>
                {stats.percentage < 75 && (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Warning: Your attendance is below 75%.</p>
                )}
            </div>

            {/* History Table */}
            <h3>Detailed History</h3>
            {history.length === 0 ? (
                <p>No attendance records found yet.</p>
            ) : (
                <table border="1" cellPadding="10" width="100%">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((record) => (
                            <tr key={record._id}>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td style={statusStyle(record.status)}>
                                    {record.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}