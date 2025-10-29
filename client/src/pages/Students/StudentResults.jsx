// pages/Students/StudentResults.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // API: GET /api/results/student/me
                const res = await axios.get(
                    'http://localhost:5000/api/results/student/me', 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setResults(res.data);
            } catch (err) {
                console.error('Fetch results error:', err);
                setError(err.response?.data?.message || 'Failed to load results.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [token]);

    if (loading) return <p>Loading results...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const calculateGrade = (obtained, max) => {
        if (max === 0) return 'N/A';
        const percentage = (obtained / max) * 100;
        if (percentage >= 90) return { grade: 'A+', color: 'blue' };
        if (percentage >= 80) return { grade: 'A', color: 'green' };
        if (percentage >= 70) return { grade: 'B', color: 'darkgreen' };
        if (percentage >= 50) return { grade: 'C', color: 'orange' };
        return { grade: 'F (Fail)', color: 'red' };
    };

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '20px' }}>
            <h2>📈 My Exam Results</h2>
            
            {results.length === 0 ? (
                <p>No published exam results found yet.</p>
            ) : (
                <table border="1" cellPadding="10" width="100%">
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>Exam Title</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Marks Obtained</th>
                            <th>Max Marks</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => {
                            const gradeInfo = calculateGrade(result.marksObtained, result.examId.maxMarks);
                            return (
                                <tr key={result._id}>
                                    <td>{result.examId.title}</td>
                                    <td>{result.examId.subjectId.name} ({result.examId.subjectId.code})</td>
                                    <td>{new Date(result.examId.examDate).toLocaleDateString()}</td>
                                    <td>{result.marksObtained}</td>
                                    <td>{result.examId.maxMarks}</td>
                                    <td style={{ color: gradeInfo.color, fontWeight: 'bold' }}>{gradeInfo.grade}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}