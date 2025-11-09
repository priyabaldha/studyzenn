// pages/Auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../../css/Login.css"; // Use the existing styles

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Backend Handlers ---

    // Step 1: Send Email (Initiate Reset)
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // API: POST /api/auth/forgot-password
            const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
            setMessage(res.data.message); // Should be the generic "If a user exists..." message
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.error || "Error sending OTP. Please check your email address.");
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
            // API: POST /api/auth/verify-otp
            const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
            setMessage(res.data.message);
            setStep(3);
        } catch (err) {
            setMessage(err.response?.data?.error || "OTP verification failed. Try again.");
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
            // API: POST /api/auth/reset-password
            const res = await axios.post("http://localhost:5000/api/auth/reset-password", { email, otp, newPassword });
            alert(res.data.message);
            // Redirect back to Login on successful reset
            window.location.href = '/'; 
        } catch (err) {
            setMessage(err.response?.data?.error || "Password reset failed.");
        } finally {
            setLoading(false);
        }
    };

    // --- Step Content Renderer ---

    const renderStepContent = () => {
        if (step === 1) {
            return (
                <form onSubmit={handleSendOtp} className="login-form">
                    <p className="mb-4">Enter your email address to initiate the password reset process.</p>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                    <div className="forgot-password-link mt-3">
                         <Link to="/">Back to Login</Link>
                    </div>
                </form>
            );
        } else if (step === 2) {
            return (
                <form onSubmit={handleVerifyOtp} className="login-form">
                    <p className="mb-4">A code has been sent to **{email}**. Please check your inbox and spam folder.</p>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                    <p className="forgot-password-link mt-3"><a href="#" onClick={(e) => {e.preventDefault(); setStep(1);}}>Resend Code</a></p>
                </form>
            );
        } else if (step === 3) {
            return (
                <form onSubmit={handleResetPassword} className="login-form">
                    <p className="mb-4">Code verified. Set your new secure password.</p>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                    <p className="forgot-password-link mt-3"><Link to="/">Go to Login</Link></p>
                </form>
            );
        }
    };

    return (
        <div className="login-fullpage-wrapper">
            {/* Replicate the Banner Area for consistent look */}
            <section className="banner-area">
                <div className="container banner-container banner-center">
                    <h1 className="text-white" style={{ fontWeight: "bold", fontSize: "52px" }}>
                        Password Recovery
                    </h1>
                </div>
            </section>

            {/* ================ Reset Form Container ================= */}
            <div className="login-page-container">
                <div className="login-form-wrapper gradient-form" style={{ minHeight: '350px' }}>
                    <h2 className="login-title">Step {step} of 3</h2>
                    
                    {message && <p style={{ color: message.includes('success') || message.includes('sent') ? 'green' : 'red', marginBottom: '15px' }}>{message}</p>}
                    
                    {renderStepContent()}
                    
                </div>
            </div>
            
            {/* Footer Area (omitted for brevity, but should be included in final file) */}
        </div>
    );
}