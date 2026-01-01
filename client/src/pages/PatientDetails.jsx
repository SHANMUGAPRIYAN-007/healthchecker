import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { User, FileText, Brain, ChevronLeft, Loader } from 'lucide-react';

const PatientDetails = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const res = await axios.get('/api/records');
                const patientRecords = res.data.filter(r => r.patientId === id);
                setRecords(patientRecords);
                setPatient({ name: 'Patient Client', id });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [id]);

    const handleGenerateSummary = async () => {
        setLoadingSummary(true);
        try {
            const res = await axios.post('/api/ai/health-summary', { patientId: id });
            setSummary(res.data);
        } catch (err) {
            alert('Failed to generate AI summary');
        }
        setLoadingSummary(false);
    };

    if (loading) return <div>Loading patient data...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textDecoration: 'none' }}>
                <ChevronLeft size={18} /> Back to Dashboard
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1>{patient.name}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Patient ID: {id}</p>
                </div>
                <button
                    onClick={handleGenerateSummary}
                    disabled={loadingSummary}
                    style={{ background: 'var(--secondary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
                >
                    {loadingSummary ? <Loader className="spin" size={20} /> : <Brain size={20} />}
                    Generate AI Health Summary
                </button>
            </div>

            {summary && (
                <div className="feature-card" style={{ marginBottom: '2rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Brain color="var(--primary)" />
                        <h2 style={{ margin: 0 }}>AI Clinical Briefing</h2>
                    </div>
                    <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>{summary.summary}</p>

                    <h4 style={{ marginTop: '1.5rem' }}>Recommendations:</h4>
                    <ul>
                        {summary.recommendations?.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Disclaimer: {summary.disclaimer}
                    </div>
                </div>
            )}

            <h2>Medical History ({records.length} Records)</h2>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                {records.map(record => (
                    <div key={record.id} className="feature-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={20} color="var(--primary)" />
                                {record.title}
                            </h3>
                            <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p>{record.summary}</p>
                        <details>
                            <summary style={{ cursor: 'pointer', color: 'var(--primary)' }}>View Raw OCR Data</summary>
                            <pre style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                {record.extractedText}
                            </pre>
                        </details>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientDetails;
