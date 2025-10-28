// pages/Admin/AdminSubjectManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

export default function AdminSubjectManager() {
    const [subjects, setSubjects] = useState([]);
    const [form, setForm] = useState({ name: '', semester: SEMESTER_OPTIONS[0] || '', code: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterSemester, setFilterSemester] = useState(''); // Filter state

    const token = localStorage.getItem('token');

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            // Include filterSemester in the query string
            const filterQuery = filterSemester ? `?semester=${filterSemester}` : '';
            const res = await axios.get(
                `http://localhost:5000/api/subjects${filterQuery}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubjects(res.data);
        } catch (err) {
            console.error('Failed to fetch subjects:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, [token, filterSemester]); // Refetch when filter changes

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/subjects/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post('http://localhost:5000/api/subjects', form, { headers: { Authorization: `Bearer ${token}` } });
            }
            
            setForm({ name: '', semester: SEMESTER_OPTIONS[0] || '', code: '', description: '' });
            setEditingId(null);
            fetchSubjects(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save subject.');
        }
    };

    const handleEdit = (subject) => {
        setForm(subject);
        setEditingId(subject._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/subjects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchSubjects();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete subject.');
        }
    };

    if (loading) return <p>Loading subjects...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '20px' }}>
            <h2>Subject Management</h2>

            {/* Subject Add/Edit Form */}
            <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '30px' }}>
                <h3>{editingId ? 'Edit Subject' : 'Add New Subject'}</h3>
                <form onSubmit={handleFormSubmit}>
                    <input name="name" placeholder="Name (e.g., Computer Science)" value={form.name} onChange={handleChange} required />
                    <input name="code" placeholder="Code (e.g., CS401)" value={form.code} onChange={handleChange} required />
                    
                    <select name="semester" value={form.semester} onChange={handleChange} required>
                        <option value="">Select Semester</option>
                        {SEMESTER_OPTIONS.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                    </select>

                    <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ width: '100%', marginTop: '10px' }} />
                    
                    <button type="submit" style={{ backgroundColor: editingId ? 'orange' : 'green', color: 'white', border: 'none', padding: '10px 15px', marginRight: '10px' }}>
                        {editingId ? 'Update Subject' : 'Add Subject'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', semester: SEMESTER_OPTIONS[0] || '', code: '', description: '' }); }}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            {/* Subject List and Filter */}
            <h3>Available Subjects</h3>
            <div style={{ marginBottom: '15px' }}>
                Filter by Semester:
                <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)}>
                    <option value="">View All</option>
                    {SEMESTER_OPTIONS.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                </select>
            </div>

            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Semester</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.length === 0 ? (
                        <tr><td colSpan="4">No subjects found for this filter.</td></tr>
                    ) : (
                        subjects.map(subject => (
                            <tr key={subject._id}>
                                <td>{subject.name}</td>
                                <td>{subject.code}</td>
                                <td>{subject.semester}</td>
                                <td>
                                    <button onClick={() => handleEdit(subject)}>Edit</button>
                                    <button onClick={() => handleDelete(subject._id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}