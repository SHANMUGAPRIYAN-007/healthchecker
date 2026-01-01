import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await axios.get('/api/appointments/doctors');
            setDoctors(res.data);
        };
        fetchDoctors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/appointments', {
                doctorId: selectedDoctor,
                date,
                reason
            });
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            alert('Failed to book appointment');
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div style={{ maxWidth: '500px', margin: '5rem auto', textAlign: 'center' }} className="feature-card">
                <CheckCircle size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
                <h2>Appointment Requested!</h2>
                <p style={{ color: 'var(--text-muted)' }}>Your request has been sent to the doctor. Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
            <h1>Book a Consultation</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Schedule a time with one of our specialized healthcare providers.</p>

            <form onSubmit={handleSubmit} className="feature-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        <User size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Select Doctor
                    </label>
                    <select
                        value={selectedDoctor}
                        onChange={e => setSelectedDoctor(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                    >
                        <option value="">Choose a doctor...</option>
                        {doctors.map(doc => (
                            <option key={doc.id} value={doc.id}>{doc.name} ({doc.email})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        <Calendar size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Appointment Date & Time
                    </label>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Reason for Visit
                    </label>
                    <textarea
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Describe your symptoms or reason for the consultation..."
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', minHeight: '100px' }}
                    />
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    style={{ padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {loading ? 'Processing...' : 'Request Appointment'}
                </button>
            </form>
        </div>
    );
};

export default BookAppointment;
