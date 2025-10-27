// components/UserSendMessage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Used to reliably check user role

// Constants must be defined here for use in the frontend selector
const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];
const ADMIN_GROUPS = [
    { value: 'all', label: 'All System Users' },
    { value: 'teacher', label: 'All Teachers' },
    { value: 'student', label: 'All Students' },
];

export default function UserSendMessage({ onMessageSent }) {
    const [recipients, setRecipients] = useState([]);
    const [sendType, setSendType] = useState('individual'); // 'individual', 'group', 'division'
    
    const [form, setForm] = useState({
        recipientId: '',
        targetRole: '', 
        targetSemester: SEMESTER_OPTIONS[0] || '',
        targetDivision: DIVISION_OPTIONS[0] || '',
        subject: '',
        body: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');
    
    // Reliably determine role from JWT or localStorage
    const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'student');

    useEffect(() => {
        // Use jwtDecode to reliably set the role if the token exists
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role);
            } catch (e) {
                console.warn("JWT Decode failed in send form, relying on localStorage.");
            }
        }
        
        const fetchRecipients = async () => {
            try {
                const res = await axios.get(
                    'http://localhost:5000/api/messages/recipients',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRecipients(res.data);
            } catch (err) {
                console.error('Failed to fetch recipients:', err);
            }
        };
        fetchRecipients();
    }, [token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSendTypeChange = (type) => {
        setSendType(type);
        // Reset specific target fields when type changes
        setForm({ 
            ...form, 
            recipientId: '', 
            targetRole: '', 
            targetSemester: SEMESTER_OPTIONS[0] || '', 
            targetDivision: DIVISION_OPTIONS[0] || '' 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // 1. Prepare Payload: Send ONLY the required recipient fields
        let payload = { subject: form.subject, body: form.body };
        
        if (sendType === 'individual' && form.recipientId) {
            payload.recipientId = form.recipientId;
        } else if (sendType === 'group' && form.targetRole) {
            payload.targetRole = form.targetRole;
        } else if (sendType === 'division') {
            // ✅ Send the semester and division for backend filtering
            payload.targetSemester = form.targetSemester;
            payload.targetDivision = form.targetDivision;
        } else {
            setMessage('Please select a valid recipient.');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                'http://localhost:5000/api/messages',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(res.data.message);
            // Reset form
            setForm({ recipientId: '', targetRole: '', targetSemester: SEMESTER_OPTIONS[0] || '', targetDivision: DIVISION_OPTIONS[0] || '', subject: '', body: '' });
            if (onMessageSent) onMessageSent(); 
            
        } catch (err) {
            console.error('Send message failed:', err);
            setMessage(err.response?.data?.message || 'Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    const isAdminOrTeacher = userRole === 'admin' || userRole === 'teacher';

    const renderRecipientSelector = () => {
        
        if (sendType === 'individual') {
            return (
                <select name="recipientId" value={form.recipientId} onChange={handleChange} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
                    <option value="">Select Individual Recipient</option>
                    {recipients.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.name} ({user.role})
                        </option>
                    ))}
                </select>
            );
        }

        if (userRole === 'admin' && sendType === 'group') {
             return (
                <select name="targetRole" value={form.targetRole} onChange={handleChange} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
                    <option value="">Select System Group</option>
                    {ADMIN_GROUPS.map(group => (
                        <option key={group.value} value={group.value}>
                            {group.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (isAdminOrTeacher && sendType === 'division') {
            // ✅ Division/Semester selector controls
            return (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <select name="targetSemester" value={form.targetSemester} onChange={handleChange} required>
                        {SEMESTER_OPTIONS.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                    </select>
                    <select name="targetDivision" value={form.targetDivision} onChange={handleChange} required>
                        {DIVISION_OPTIONS.map(div => <option key={div} value={div}>Division {div}</option>)}
                    </select>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #6c757d', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h3>Compose New Message</h3>
            
            {/* Role-Based Send Type Selector */}
            {isAdminOrTeacher && (
                <div style={{ marginBottom: '15px' }}>
                    <strong>Send To:</strong>
                    <button type="button" onClick={() => handleSendTypeChange('individual')} style={{ marginLeft: '10px', fontWeight: sendType === 'individual' ? 'bold' : 'normal', backgroundColor: sendType === 'individual' ? '#ced4da' : 'white', border: '1px solid #ced4da' }}>Individual</button>
                    <button type="button" onClick={() => handleSendTypeChange('division')} style={{ fontWeight: sendType === 'division' ? 'bold' : 'normal', backgroundColor: sendType === 'division' ? '#ced4da' : 'white', border: '1px solid #ced4da' }}>Division</button>
                    {userRole === 'admin' && (
                        <button type="button" onClick={() => handleSendTypeChange('group')} style={{ fontWeight: sendType === 'group' ? 'bold' : 'normal', backgroundColor: sendType === 'group' ? '#ced4da' : 'white', border: '1px solid #ced4da' }}>System Group</button>
                    )}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                {renderRecipientSelector()}

                <input 
                    name="subject" 
                    placeholder="Subject" 
                    value={form.subject} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />

                <textarea
                    name="body"
                    placeholder="Message Body"
                    value={form.body}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows="5"
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />

                <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red', marginTop: '10px' }}>{message}</p>}
        </div>
    );
}