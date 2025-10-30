// components/PasswordResetComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function PasswordResetComponent({ onComplete }) {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Send Email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
            setMessage(res.data.message);
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.error || "Error sending OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
            setMessage(res.data.message);
            setStep(3);
        } catch (err) {
            setMessage(err.response?.data?.error || "OTP verification failed.");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/reset-password", { email, otp, newPassword });
            alert(res.data.message);
            onComplete(); // Close modal and refresh login page
        } catch (err) {
            setMessage(err.response?.data?.error || "Password reset failed.");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        if (step === 1) {
            return (
                <form onSubmit={handleSendOtp}>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: 'block', margin: '10px 0' }} />
                    <button type="submit" disabled={loading}>Send OTP</button>
                </form>
            );
        } else if (step === 2) {
            return (
                <form onSubmit={handleVerifyOtp}>
                    <p>OTP sent to {email}. Check your inbox.</p>
                    <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required style={{ display: 'block', margin: '10px 0' }} />
                    <button type="submit" disabled={loading}>Verify Code</button>
                </form>
            );
        } else if (step === 3) {
            return (
                <form onSubmit={handleResetPassword}>
                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ display: 'block', margin: '10px 0' }} />
                    <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ display: 'block', margin: '10px 0' }} />
                    <button type="submit" disabled={loading}>Reset Password</button>
                </form>
            );
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', minWidth: '300px' }}>
                <h3>Password Reset (Step {step} of 3)</h3>
                <p style={{ color: 'red' }}>{message}</p>
                {renderStep()}
                <button onClick={onComplete} style={{ marginTop: '15px' }}>Cancel</button>
            </div>
        </div>
    );
}