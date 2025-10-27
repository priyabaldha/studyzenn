// pages/Teachers/TeacherAttendance.jsx
import React, { useState } from 'react';
import axios from 'axios';

// Define options (must match model enums)
const STATUS_OPTIONS = ["Present", "Absent", "Late"];
const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

export default function TeacherAttendance() {
    const [filter, setFilter] = useState({
        semester: SEMESTER_OPTIONS[0] || '',
        division: DIVISION_OPTIONS[0] || '',
        date: new Date().toISOString().split('T')[0] // Default to today
    });
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({}); // {studentId: 'Status'}
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('token');

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const fetchStudents = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await axios.get(
                `http://localhost:5000/api/attendance/students/${filter.semester}/${filter.division}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setStudents(res.data);
            
            // Initialize attendance data to 'Present' for all fetched students
            const initialAttendance = {};
            res.data.forEach(student => {
                initialAttendance[student._id] = 'Present'; 
            });
            setAttendanceData(initialAttendance);

        } catch (err) {
            console.error('Fetch students error:', err);
            setMessage('Failed to fetch students. Check if the class exists.');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // 1. Format data for the backend
        const records = students.map(student => ({
            studentId: student._id,
            date: filter.date,
            status: attendanceData[student._id]
        }));
        
        // 2. Submit data
        try {
            await axios.post(
                'http://localhost:5000/api/attendance/save',
                { records },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Attendance successfully recorded for ' + students.length + ' students!');
        } catch (err) {
            console.error('Save attendance error:', err);
            setMessage('Failed to save attendance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Record Daily Attendance</h2>
            
            {/* Filter Section */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                <select name="semester" value={filter.semester} onChange={handleFilterChange} disabled={loading}>
                    {SEMESTER_OPTIONS.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                </select>
                <select name="division" value={filter.division} onChange={handleFilterChange} disabled={loading}>
                    {DIVISION_OPTIONS.map(div => <option key={div} value={div}>Division {div}</option>)}
                </select>
                <input type="date" name="date" value={filter.date} onChange={handleFilterChange} disabled={loading} />
                
                <button onClick={fetchStudents} disabled={loading}>
                    {loading ? 'Loading...' : 'Get Students'}
                </button>
            </div>
            
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

            {/* Attendance Marking Table */}
            {students.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <p>Marking attendance for: <strong>{filter.semester} - Division {filter.division}</strong> on {filter.date}</p>
                    <table border="1" cellPadding="10" width="100%">
                        <thead>
                            <tr>
                                <th>Roll No</th>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td>{student.rollNo}</td>
                                    <td>{student.name}</td>
                                    <td>
                                        <select 
                                            value={attendanceData[student._id]}
                                            onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                                        >
                                            {STATUS_OPTIONS.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <button type="submit" disabled={loading} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white' }}>
                        {loading ? 'Saving...' : 'Save Attendance'}
                    </button>
                </form>
            )}
            
            {students.length === 0 && !loading && message && <p>Select a class and click 'Get Students'.</p>}

        </div>
    );
}