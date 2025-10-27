// pages/Dashboard/UserMessageDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSendMessage from '../../components/UserSendMessage'; 
import { jwtDecode } from 'jwt-decode';

export default function UserMessageDashboard() {
    const [inbox, setInbox] = useState([]);
    const [sent, setSent] = useState([]);
    const [view, setView] = useState('inbox'); // 'inbox', 'sent', or 'single'
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    // State to hold the role reliably after token check
    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role') || 'student'); 


    const fetchMessages = async () => {
        setLoading(true);
        try {
            // 1. CONFIRM ROLE: Decode token to confirm user role
            let userRoleFromToken = currentUserRole;
            if (token) {
                 try {
                     const decoded = jwtDecode(token);
                     userRoleFromToken = decoded.role;
                     setCurrentUserRole(decoded.role); // Update state with confirmed role
                 } catch (e) {
                     // Token might be malformed or expired; rely on current state for now
                     console.warn("JWT Decode failed, relying on stored role.", e);
                 }
            }
            
            // 2. Fetch Inbox (hybrid)
            const inboxRes = await axios.get(
                'http://localhost:5000/api/messages/inbox',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setInbox(inboxRes.data);

            // 3. Fetch Sent messages (only if they can compose)
            if (userRoleFromToken !== 'student') {
                const sentRes = await axios.get(
                    'http://localhost:5000/api/messages/sent',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSent(sentRes.data);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [token]);


    const handleViewMessage = async (msg) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/messages/${msg._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSelectedMessage(res.data);
            setView('single');
            
            if (view === 'inbox' && !msg.readStatus) {
                fetchMessages();
            }
        } catch (err) {
            console.error('Failed to fetch message details:', err);
        }
    };

    const renderMessageList = (messages, type) => (
        <table border="1" cellPadding="10" width="100%">
            <thead>
                <tr style={{ backgroundColor: '#212529', color: 'white' }}>
                    <th>{type === 'inbox' ? 'From' : 'To Target'}</th>
                    <th>Subject</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {messages.length === 0 ? (
                    <tr><td colSpan="3">No messages in {type}.</td></tr>
                ) : (
                    messages.map(msg => {
                        const correspondent = type === 'inbox' ? msg.senderId : msg; 
                        const isUnread = type === 'inbox' && !msg.readStatus;

                        const getTargetLabel = (m) => {
                            if (m.recipientId) return `${m.recipientId.name} (${m.recipientId.role})`;
                            if (m.targetRole) return `System Group: ${m.targetRole.toUpperCase()}`;
                            if (m.targetSemester) return `${m.targetSemester} / ${m.targetDivision}`;
                            return 'N/A';
                        };

                        return (
                            <tr 
                                key={msg._id} 
                                onClick={() => handleViewMessage(msg)}
                                style={{ 
                                    cursor: 'pointer', 
                                    fontWeight: isUnread ? 'bold' : 'normal', 
                                    backgroundColor: isUnread ? '#e9ecef' : 'white', 
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <td>{type === 'inbox' ? `${correspondent.name} (${correspondent.role})` : getTargetLabel(msg)}</td>
                                <td>{msg.subject}</td>
                                <td>{new Date(msg.sentDate).toLocaleDateString()}</td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );

    const renderSingleMessage = () => (
        selectedMessage && (
            <div style={{ border: '1px solid #adb5bd', padding: '20px', marginTop: '20px', backgroundColor: '#f8f9fa' }}>
                <button 
                    onClick={() => setView(selectedMessage.senderId._id === selectedMessage.recipientId?._id ? 'sent' : 'inbox')} 
                    style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', marginBottom: '15px' }}
                >
                    &larr; Back to List
                </button>
                <h3>Subject: {selectedMessage.subject}</h3>
                
                <p><strong>From:</strong> {selectedMessage.senderId.name} ({selectedMessage.senderId.role})</p>
                
                {selectedMessage.recipientId ? (
                    <p><strong>To:</strong> {selectedMessage.recipientId.name} ({selectedMessage.recipientId.role})</p>
                ) : (
                    <p><strong>Target:</strong> {selectedMessage.targetRole ? selectedMessage.targetRole.toUpperCase() : `${selectedMessage.targetSemester} / ${selectedMessage.targetDivision}`}</p>
                )}
                
                <p><strong>Date Sent:</strong> {new Date(selectedMessage.sentDate).toLocaleString()}</p>
                <hr style={{ borderColor: '#adb5bd' }}/>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage.body}</p>
            </div>
        )
    );

    const canCompose = currentUserRole !== 'student'; 

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '20px' }}>
            <h2>Messaging Dashboard</h2>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => setView('inbox')} style={{ fontWeight: view === 'inbox' ? 'bold' : 'normal', backgroundColor: view === 'inbox' ? '#007bff' : '#f0f0f0', color: view === 'inbox' ? 'white' : 'black', border: '1px solid #007bff' }}>
                    Inbox ({inbox.filter(m => !m.readStatus).length} Unread)
                </button>
                
                {canCompose && (
                    <>
                        <button onClick={() => setView('sent')} style={{ fontWeight: view === 'sent' ? 'bold' : 'normal', backgroundColor: view === 'sent' ? '#007bff' : '#f0f0f0', color: view === 'sent' ? 'white' : 'black', border: '1px solid #007bff' }}>
                            Sent
                        </button>
                        <button onClick={() => setView('compose')} style={{ fontWeight: view === 'compose' ? 'bold' : 'normal', backgroundColor: '#28a745', color: 'white', border: '1px solid #28a745' }}>
                            Compose Message
                        </button>
                    </>
                )}
            </div>

            {loading ? (
                <p>Loading messages...</p>
            ) : view === 'inbox' ? (
                renderMessageList(inbox, 'inbox')
            ) : view === 'sent' ? (
                renderMessageList(sent, 'sent')
            ) : view === 'compose' ? (
                <UserSendMessage onMessageSent={() => { setView('sent'); fetchMessages(); }} />
            ) : (
                renderSingleMessage()
            )}
        </div>
    );
}