// pages/Students/StudentExamSchedule.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentExamSchedule() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                // Call the new dedicated student route
                const res = await axios.get(
                    'http://localhost:5000/api/exams/student/me', 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSchedule(res.data);
            } catch (err) {
                console.error('Fetch schedule error:', err);
                setError(err.response?.data?.message || 'Failed to load schedule.');
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [token]);

    if (loading) return <p>Loading exam schedule...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '20px' }}>
            <h2>📅 My Exam Schedule</h2>
            
            {schedule.length === 0 ? (
                <p>No exams currently scheduled for your class.</p>
            ) : (
                <table border="1" cellPadding="10" width="100%">
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>Date</th>
                            <th>Subject</th>
                            <th>Title</th>
                            <th>Max Marks</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map(exam => (
                            <tr key={exam._id}>
                                <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                                <td>{exam.subjectId.name} ({exam.subjectId.code})</td>
                                <td>{exam.title}</td>
                                <td>{exam.maxMarks}</td>
                                <td>{exam.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}