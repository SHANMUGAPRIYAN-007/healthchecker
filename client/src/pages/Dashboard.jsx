import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, MessageSquare, Activity, Upload, Calendar, Clock, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [records, setRecords] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recordsRes, apptsRes] = await Promise.all([
                    axios.get('/api/records'),
                    axios.get('/api/appointments')
                ]);
                setRecords(recordsRes.data);
                setAppointments(apptsRes.data);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const isDoctor = user.role === 'doctor';

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>{t('loading')}...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>{t('welcome')}, {user.name}</h1>
                <span style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {isDoctor ? 'Healthcare Provider' : 'Patient'}
                </span>
            </div>

            <div className="dashboard-grid">
                {!isDoctor && (
                    <>
                        <Link to="/symptom-checker" className="feature-card">
                            <Activity className="feature-icon" />
                            <h3>{t('symptom_checker')}</h3>
                        </Link>
                        <Link to="/appointments/book" className="feature-card">
                            <Calendar className="feature-icon" />
                            <h3>Book Appointment</h3>
                        </Link>
                        <Link to="/records/upload" className="feature-card">
                            <Upload className="feature-icon" />
                            <h3>{t('upload_records')}</h3>
                        </Link>
                    </>
                )}
                {isDoctor && (
                    <>
                        <Link to="/chat" className="feature-card">
                            <MessageSquare className="feature-icon" />
                            <h3>Patient Consultations</h3>
                        </Link>
                        <div className="feature-card">
                            <Activity className="feature-icon" />
                            <h3>Live Queue: {appointments.filter(a => a.status === 'scheduled').length}</h3>
                        </div>
                        <div className="feature-card">
                            <FileText className="feature-icon" />
                            <h3>Total Records: {records.length}</h3>
                        </div>
                    </>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                {/* Left Column: Appointments */}
                <div>
                    <h2>{isDoctor ? 'Consultation Queue' : 'My Appointments'}</h2>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        {appointments.length > 0 ? appointments.map(appt => (
                            <div key={appt.id} className="feature-card" style={{ padding: '1rem', borderLeft: appt.status === 'scheduled' ? '4px solid var(--primary)' : '4px solid #94a3b8' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>{isDoctor ? appt.patient?.name : `Dr. ${appt.doctor?.name}`}</strong>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(appt.date).toLocaleString()}</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{appt.reason}</p>
                                {isDoctor && (
                                    <Link to={`/patients/${appt.patientId}`} style={{ color: 'var(--primary)', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>
                                        View Patient Records & AI Summary
                                    </Link>
                                )}
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '4px', textTransform: 'capitalize' }}>
                                        {appt.status}
                                    </span>
                                </div>
                            </div>
                        )) : <p style={{ color: 'var(--text-muted)' }}>No upcoming appointments found.</p>}
                    </div>
                </div>

                {/* Right Column: Recent Activity / Records */}
                <div>
                    <h2>{!isDoctor ? 'Recent Records' : 'Global Records Feed'}</h2>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        {records.length > 0 ? records.map(record => (
                            <div key={record.id} className="feature-card" style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h4 style={{ margin: 0 }}>{record.title}</h4>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(record.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>{record.summary}</p>
                                <details>
                                    <summary style={{ cursor: 'pointer', color: 'var(--primary)', fontSize: '0.85rem' }}>View Detail</summary>
                                    <pre style={{ whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.02)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                                        {record.extractedText?.substring(0, 200)}...
                                    </pre>
                                </details>
                            </div>
                        )) : <p style={{ color: 'var(--text-muted)' }}>No records uploaded yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
