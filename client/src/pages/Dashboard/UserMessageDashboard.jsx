import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSendMessage from '../../components/UserSendMessage';
import { jwtDecode } from 'jwt-decode';
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
    
    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm("Are you sure you want to delete this message?")) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/messages/${messageId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            fetchMessages(); 
            alert("Message successfully deleted!");
            
        } catch (err) {
            console.error('Delete message error:', err);
            alert(err.response?.data?.message || 'Failed to delete message.');
        }
    };


    const renderMessageList = (messages, type) => (
        <table className="message-table" role="table" aria-label={`${type} messages`}>
            <thead>
                <tr>
                    <th>{type === 'inbox' ? 'From' : 'To Target'}</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Actions</th> 
                </tr>
            </thead>
            <tbody>
                {messages.length === 0 ? (
                    <tr><td colSpan="4" className="empty-msg">No messages in {type}.</td></tr>
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
                                className={isUnread ? 'unread-row' : ''}
                                role="row"
                            >
                                <td onClick={() => handleViewMessage(msg)} style={{cursor: 'pointer'}}>{type === 'inbox' ? `${correspondent.name} (${correspondent.role})` : getTargetLabel(msg)}</td>
                                <td onClick={() => handleViewMessage(msg)} style={{cursor: 'pointer'}}>{msg.subject}</td>
                                <td className="date-col" onClick={() => handleViewMessage(msg)} style={{cursor: 'pointer'}}>
                                    {new Date(msg.sentDate).toLocaleDateString()}
                                </td>

                                <td className="delete-col">
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteMessage(msg._id);
                                        }}
                                    >
                                        {/* Trash Icon SVG */}
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                            <path d="M10 11v6" />
                                            <path d="M14 11v6" />
                                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                        </svg>
                                    </button>
                                </td>

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
                <h3 style={{ marginTop: 12 }}>Subject: {selectedMessage.subject}</h3>
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
        <div className="revamp-root">
            <div className="revamp-content">
                <div className="message-dashboard-container">
                    <h2 className="page-title">Messaging Dashboard</h2>

                    <div className="message-nav">
                        <button
                            onClick={() => setView('inbox')}
                            className={`nav-btn ${view === 'inbox' ? 'active' : ''}`}
                            aria-pressed={view === 'inbox'}
                        >
                            Inbox ({inbox.filter(m => !m.readStatus).length} Unread)
                        </button>

                        {canCompose && (
                            <>
                                <button
                                    onClick={() => setView('sent')}
                                    className={`nav-btn ${view === 'sent' ? 'active' : ''}`}
                                    aria-pressed={view === 'sent'}
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
                        <div className="compose-card">
                            <UserSendMessage onMessageSent={() => { setView('sent'); fetchMessages(); }} />
                        </div>
                    ) : (
                        renderSingleMessage()
                    )}
                </div>
            </div>
        </div>
    );
} 