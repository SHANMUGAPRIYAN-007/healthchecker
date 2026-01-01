import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resetLink, setResetLink] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setResetLink('');

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        try {
            const res = await axios.post('/api/user/forgot-password', { email });
            setMessage(res.data.message);
            setIsSubmitted(true);

            // If in mock mode, show the reset link
            if (res.data.resetLink) {
                setResetLink(res.data.resetLink);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset email');
        }
    };

    if (isSubmitted) {
        return (
            <div className="auth-container" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto' }} />
                </div>
                <h2>Check Your Email</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    {message}
                </p>

                {resetLink && (
                    <div style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        border: '1px solid var(--primary)'
                    }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <strong>🔧 Development Mode:</strong> Click the link below to reset your password
                        </p>
                        <a
                            href={resetLink}
                            style={{
                                color: 'var(--primary)',
                                wordBreak: 'break-all',
                                textDecoration: 'underline'
                            }}
                        >
                            {resetLink}
                        </a>
                    </div>
                )}

                <div style={{ marginTop: '2rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Didn't receive an email? Check your spam folder or{' '}
                        <button
                            onClick={() => setIsSubmitted(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                padding: 0,
                                width: 'auto',
                                boxShadow: 'none'
                            }}
                        >
                            try again
                        </button>
                    </p>
                </div>

                <p style={{ marginTop: '2rem' }}>
                    <Link to="/login">Back to Login</Link>
                </p>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Mail size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ textAlign: 'center' }}>Forgot Password?</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="auth-btn">Send Reset Link</button>
            </form>

            <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/login">Back to Login</Link>
            </p>
        </div>
    );
};

export default ForgotPassword;
