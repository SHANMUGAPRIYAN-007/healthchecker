import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Activity, FileText, MessageSquare, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                <Heart fill="currentColor" /> Televita
            </Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/" className="nav-link">{t('home')}</Link>
                        <Link to="/features" className="nav-link">{t('features')}</Link>
                        <Link to="/chat" className="nav-link">{t('chat')}</Link>
                        <span className="nav-user">Hello, {user.name}</span>
                        <ThemeToggle />
                        <button onClick={handleLogout} className="nav-logout">
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                        <ThemeToggle />
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
