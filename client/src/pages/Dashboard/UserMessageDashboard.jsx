// pages/Dashboard/UserMessageDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSendMessage from '../../components/UserSendMessage'; 
import { jwtDecode } from 'jwt-decode';
// import TeacherSlidebar from "../Teachers/components/TeacherSlidebar";
import '../../css/UserMessageDashboard.css';

export default function UserMessageDashboard() {
    const [inbox, setInbox] = useState([]);
    const [sent, setSent] = useState([]);
    const [view, setView] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role') || 'student'); 

    const fetchMessages = async () => {
        setLoading(true);
        try {
            let userRoleFromToken = currentUserRole;
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    userRoleFromToken = decoded.role;
                    setCurrentUserRole(decoded.role);
                } catch (e) {
                    console.warn("JWT Decode failed, relying on stored role.", e);
                }
            }

            const inboxRes = await axios.get(
                'http://localhost:5000/api/messages/inbox',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setInbox(inboxRes.data);

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
            if (view === 'inbox' && !msg.readStatus) fetchMessages();
        } catch (err) {
            console.error('Failed to fetch message details:', err);
        }
    };

    const renderMessageList = (messages, type) => (
        <table className="message-table">
            <thead>
                <tr>
                    <th>{type === 'inbox' ? 'From' : 'To Target'}</th>
                    <th>Subject</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {messages.length === 0 ? (
                    <tr><td colSpan="3" className="empty-msg">No messages in {type}.</td></tr>
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
                                className={isUnread ? 'unread-row' : ''}
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
            <div className="single-message">
                <button className="back-btn" onClick={() => setView('inbox')}>
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
                <hr />
                <p className="message-body">{selectedMessage.body}</p>
            </div>
        )
    );

    const canCompose = currentUserRole !== 'student'; 

    return (
        <div className="teacher-upload-wrapper">
        {/* ✅ Sidebar added */}
        {/* <TeacherSlidebar /> */}
        <div className="message-dashboard-container">
            <h2 className="page-title">Messaging Dashboard</h2>
            <div className="message-nav">
                <button 
                    onClick={() => setView('inbox')}
                    className={`nav-btn ${view === 'inbox' ? 'active' : ''}`}
                >
                    Inbox ({inbox.filter(m => !m.readStatus).length} Unread)
                </button>
                {canCompose && (
                    <>
                        <button 
                            onClick={() => setView('sent')}
                            className={`nav-btn ${view === 'sent' ? 'active' : ''}`}
                        >
                            Sent
                        </button>
                        <button 
                            onClick={() => setView('compose')}
                            className="nav-btn compose-btn"
                        >
                            Compose Message
                        </button>
                    </>
                )}
            </div>

            {loading ? (
                <p className="loading">Loading messages...</p>
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
        </div>
    );
}
