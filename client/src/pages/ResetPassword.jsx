import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Lock } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Extract token from URL query parameter
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!token) {
            setError('Invalid or missing reset token');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const res = await axios.post('/api/user/reset-password', { token, newPassword });
            setMessage(res.data.message);
            setError('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed');
            setMessage('');
        }
    };

    return (
        <div className="auth-container">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Lock size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ textAlign: 'center' }}>Reset Your Password</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Enter your new password below
            </p>

            {message && <div style={{ color: '#10b981', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>{message}</div>}
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password (min. 6 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--text-muted)',
                            width: 'auto',
                            boxShadow: 'none'
                        }}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <button type="submit" className="auth-btn">Reset Password</button>
            </form>

            <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/login">Back to Login</Link>
            </p>
        </div>
    );
};

export default ResetPassword;
