// pages/Teachers/ResultEntry.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ResultEntry() {
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [examDetails, setExamDetails] = useState(null);
    const [studentResults, setStudentResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // Helper function to extract subject name safely
    const getSubjectName = (exam, examsList) => {
        const currentExam = exam?.subjectId?.name ? exam : examsList.find(e => e._id === exam?._id);
        return currentExam?.subjectId?.name || 'N/A';
    };

    // 1. Data Fetching Logic (Accessible everywhere)
    const fetchStudentsAndResults = useCallback(async (examId) => {
        if (!examId) {
            setStudentResults([]);
            setExamDetails(null);
            return;
        }
        setMessage('');
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:5000/api/exams/${examId}/students`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setStudentResults(res.data.students);
            setExamDetails(res.data.exam);
        } catch (err) {
            console.error('Failed to fetch student results:', err);
            setMessage(err.response?.data?.message || "Failed to load students for result entry.");
            setStudentResults([]);
            setExamDetails(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Effect 1: Fetch all scheduled exams on initial load
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/exams', { headers: { Authorization: `Bearer ${token}` } });
                setExams(res.data);
            } catch (err) {
                console.error('Failed to fetch exams:', err);
                setMessage("Error fetching exam list.");
            } finally {
                setLoading(false); 
            }
        };
        fetchExams();
    }, [token]);

    // Effect 2: Fetch students when the selected exam ID changes
    useEffect(() => {
        fetchStudentsAndResults(selectedExamId);
    }, [selectedExamId, fetchStudentsAndResults]);

    // Handle marks change in the input field
    const handleMarkChange = (studentId, marks) => {
        setStudentResults(prevResults => prevResults.map(student => 
            student.studentId === studentId 
                ? { ...student, marksObtained: marks } 
                : student
        ));
    };

    // 2. The submit handler for saving marks
    const handleSubmitResults = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const maxMarks = examDetails?.maxMarks || 0;

        // 1. Format and Validate Data
        const resultsToSubmit = studentResults
            .filter(s => s.marksObtained !== null && s.marksObtained !== '')
            .map(s => ({
                studentId: s.studentId,
                marksObtained: parseInt(s.marksObtained),
            }));
            
        if (resultsToSubmit.length === 0) {
            setMessage("Error: Please enter marks for at least one student.");
            setLoading(false);
            return;
        }

        if (maxMarks) {
            const invalidMarks = resultsToSubmit.filter(r => r.marksObtained > maxMarks || r.marksObtained < 0);
            if (invalidMarks.length > 0) {
                setMessage(`Error: Marks cannot exceed ${maxMarks}.`);
                setLoading(false);
                return;
            }
        }

        try {
            // 2. Submit Results
            await axios.post(
                'http://localhost:5000/api/results', 
                { examId: selectedExamId, results: resultsToSubmit },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // 3. Display success message and delay refresh
            setMessage('Results successfully saved! Refreshing list...');
            
            // Use setTimeout to allow the success message to display for a moment
            setTimeout(() => {
                 fetchStudentsAndResults(selectedExamId); 
            }, 500); 

        } catch (err) {
            console.error('Result submission error:', err);
            setMessage(err.response?.data?.message || 'Failed to save results. Check server logs.');
            setLoading(false); // Ensure loading stops on error
        } 
    };

    // 🆕 3. PUBLISH RESULTS HANDLER
    const handlePublishResults = async () => {
        if (!selectedExamId || studentResults.length === 0) {
            setMessage("Cannot publish: Select an exam with saved results first.");
            return;
        }

        // Use window.confirm instead of alert for better UX on critical action
        if (!window.confirm(`Are you sure you want to PUBLISH all results for this exam? Students will be able to see them immediately.`)) {
            return;
        }
        
        setLoading(true);
        setMessage('');

        try {
            // API: PATCH /api/results/publish/:examId
            const res = await axios.patch(
                `http://localhost:5000/api/results/publish/${selectedExamId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to publish results.');
            console.error('Publish error:', err);
        } finally {
            setLoading(false);
        }
    };


    const maxMarks = examDetails?.maxMarks || 0;

    if (loading && exams.length === 0) return <p>Loading exam schedules...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '20px' }}>
            <h2>✏️ Exam Result Entry</h2>
            
            {/* Exam Selector */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Exam:</label>
                <select value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)} disabled={loading}>
                    <option value="">-- Choose Exam --</option>
                    {exams.map(exam => (
                        <option key={exam._id} value={exam._id}>
                            {getSubjectName(exam, exams)} ({exam.semester}/{exam.division} - {new Date(exam.examDate).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {/* Message Display (will now persist for 500ms after success) */}
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

            {examDetails && (
                <div style={{ border: '1px solid #007bff', padding: '15px', marginBottom: '20px', backgroundColor: '#f0f8ff' }}>
                    <h3>{getSubjectName(examDetails, exams)} - {examDetails.title}</h3>
                    <p>Class: **{examDetails.semester} / {examDetails.division}** | Max Marks: **{maxMarks}**</p>
                </div>
            )}

            {/* Results Table and Submit Form */}
            {studentResults.length > 0 && examDetails && (
                <form onSubmit={handleSubmitResults}>
                    <table border="1" cellPadding="10" width="100%">
                        <thead>
                            <tr style={{ backgroundColor: '#ccc' }}>
                                <th>Roll No</th>
                                <th>Student Name</th>
                                <th>Marks ({maxMarks})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentResults.map(student => (
                                <tr key={student.studentId}>
                                    <td>{student.rollNo}</td>
                                    <td>{student.name}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={student.marksObtained}
                                            onChange={(e) => handleMarkChange(student.studentId, e.target.value)}
                                            min="0"
                                            max={maxMarks}
                                            required
                                            style={{ width: '80px', textAlign: 'center' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '20px' }}>
                        {/* 1. SAVE RESULTS BUTTON */}
                        <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', marginRight: '15px' }}>
                            {loading ? 'Saving...' : 'Save Results'}
                        </button>

                        {/* 2. PUBLISH RESULTS BUTTON */}
                        <button 
                            type="button" 
                            onClick={handlePublishResults} 
                            disabled={loading} 
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: 'red', 
                                color: 'white' 
                            }}
                        >
                            {loading ? 'Publishing...' : '📢 Publish Results'}
                        </button>
                    </div>
                </form>
            )}
            
            {/* Show message if exam selected but no students found */}
            {selectedExamId && !loading && studentResults.length === 0 && (
                 <p style={{ color: 'orange' }}>No students found for this class ({examDetails?.semester}/{examDetails?.division}).</p>
            )}

        </div>
    );
}