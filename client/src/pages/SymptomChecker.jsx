import React, { useState } from 'react';
import axios from 'axios';

const SymptomChecker = () => {
    const [formData, setFormData] = useState({ symptoms: '', age: '', gender: '', history: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await axios.post('/api/ai/check-symptoms', formData);
            setResult(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to check symptoms');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>AI Symptom Checker</h1>
            <form onSubmit={handleSubmit} className="symptom-checker-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                    placeholder="Describe your symptoms..."
                    value={formData.symptoms}
                    onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                    rows={4}
                    required
                    style={{ padding: '0.5rem' }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        placeholder="Age"
                        type="number"
                        value={formData.age}
                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                        style={{ padding: '0.5rem', flex: 1 }}
                    />
                    <select
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        style={{ padding: '0.5rem', flex: 1 }}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <textarea
                    placeholder="Medical History (Optional)"
                    value={formData.history}
                    onChange={e => setFormData({ ...formData, history: e.target.value })}
                    rows={2}
                    style={{ padding: '0.5rem' }}
                />
                <button disabled={loading} type="submit" style={{ padding: '1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {loading ? 'Analyzing...' : 'Check Symptoms'}
                </button>
            </form>

            {result && (
                <div className="symptom-checker-card" style={{ marginTop: '2rem', borderTop: '4px solid #10b981' }}>
                    <h2>Analysis Result</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <strong>Urgency:</strong>
                        <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            background: result.urgency === 'High' ? '#fee2e2' : '#ecfdf5',
                            color: result.urgency === 'High' ? '#dc2626' : '#059669',
                            fontWeight: 'bold'
                        }}>{result.urgency}</span>
                    </div>

                    <h3>Potential Causes</h3>
                    <ul>
                        {result.causes?.map((cause, i) => <li key={i}>{cause}</li>)}
                    </ul>

                    <h3>Recommended Next Steps</h3>
                    <ul>
                        {result.next_steps?.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SymptomChecker;
