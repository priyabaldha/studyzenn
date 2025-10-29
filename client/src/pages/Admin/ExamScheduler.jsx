// pages/Admin/ExamScheduler.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Assuming Subject model options are defined here or imported
const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

export default function ExamScheduler() {
    const [form, setForm] = useState({
        subjectId: '',
        title: '',
        semester: SEMESTER_OPTIONS[0] || '',
        division: DIVISION_OPTIONS[0] || '',
        examDate: '',
        maxMarks: 100,
        duration: '3 hours',
    });
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    // Effect 1: Fetch subjects based on selected semester
    useEffect(() => {
        const fetchSubjects = async () => {
            if (!form.semester) return;
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/subjects?semester=${form.semester}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSubjects(res.data);
                // Set default subject if available
                setForm(prev => ({ ...prev, subjectId: res.data.length > 0 ? res.data[0]._id : '' }));
            } catch (err) {
                console.error('Failed to fetch subjects:', err);
                setSubjects([]);
            }
        };
        fetchSubjects();
    }, [form.semester, token]);

    // Effect 2: Fetch all scheduled exams
    useEffect(() => {
        fetchExams();
    }, [token]);

    const fetchExams = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/exams', { headers: { Authorization: `Bearer ${token}` } });
            setExams(res.data);
        } catch (err) {
            console.error('Failed to fetch exams:', err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post('http://localhost:5000/api/exams', form, { headers: { Authorization: `Bearer ${token}` } });
            setMessage('Exam scheduled successfully!');
            setForm(prev => ({ // Reset form but keep class/semester/duration defaults
                ...prev, 
                title: '', 
                examDate: '', 
                maxMarks: 100 
            }));
            fetchExams();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to schedule exam.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '20px' }}>
            <h2>🗓️ Exam Schedule Manager</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                
                {/* Exam Scheduling Form */}
                <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                    <h3>Schedule New Exam</h3>
                    <form onSubmit={handleSubmit}>
                        
                        {/* Class Selectors */}
                        <select name="semester" value={form.semester} onChange={handleChange} required disabled={loading} style={{ marginBottom: '10px' }}>
                            {SEMESTER_OPTIONS.map(sem => <option key={sem} value={sem}>{sem} Semester</option>)}
                        </select>
                        <select name="division" value={form.division} onChange={handleChange} required disabled={loading} style={{ marginBottom: '10px' }}>
                            {DIVISION_OPTIONS.map(div => <option key={div} value={div}>Division {div}</option>)}
                        </select>

                        {/* Subject Selector (Dynamically filtered) */}
                        <select name="subjectId" value={form.subjectId} onChange={handleChange} required disabled={subjects.length === 0 || loading} style={{ marginBottom: '10px' }}>
                            {subjects.length === 0 ? (
                                <option value="">No Subjects Found for {form.semester}</option>
                            ) : (
                                subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>)
                            )}
                        </select>

                        {/* Details */}
                        <input name="title" placeholder="Exam Title (e.g., Midterm)" value={form.title} onChange={handleChange} required disabled={loading} style={{ marginBottom: '10px' }}/>
                        <input name="maxMarks" type="number" placeholder="Max Marks" value={form.maxMarks} onChange={handleChange} required disabled={loading} style={{ marginBottom: '10px' }}/>
                        <input name="duration" placeholder="Duration (e.g., 3 hours)" value={form.duration} onChange={handleChange} disabled={loading} style={{ marginBottom: '10px' }}/>
                        
                        {/* Date Picker */}
                        <label style={{ display: 'block', margin: '10px 0 5px 0' }}>Exam Date:</label>
                        <input name="examDate" type="date" value={form.examDate} onChange={handleChange} required disabled={loading} style={{ marginBottom: '10px' }}/>

                        <button type="submit" disabled={!form.subjectId || loading} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white' }}>
                            {loading ? 'Scheduling...' : 'Schedule Exam'}
                        </button>
                    </form>
                    {message && <p style={{ color: message.includes('success') ? 'green' : 'red', marginTop: '10px' }}>{message}</p>}
                </div>

                {/* Scheduled Exams List */}
                <div>
                    <h3>Upcoming Scheduled Exams ({exams.length})</h3>
                    <table border="1" cellPadding="10" width="100%">
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th>Subject</th>
                                <th>Class</th>
                                <th>Date</th>
                                <th>Max Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map(exam => (
                                <tr key={exam._id}>
                                    <td>{exam.subjectId.name} ({exam.title})</td>
                                    <td>{exam.semester}/{exam.division}</td>
                                    <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                                    <td>{exam.maxMarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}