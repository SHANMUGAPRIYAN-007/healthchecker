import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RecordUpload = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isVisionMode, setIsVisionMode] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setAnalysisResult(null);

        try {
            if (isVisionMode) {
                const formData = new FormData();
                formData.append('file', file);

                
                const uploadRes = await axios.post('/api/records/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // Then analyze the uploaded image URL
                const analyzeRes = await axios.post('/api/ai/analyze-image', {
                    imageUrl: uploadRes.data.record.fileUrl,
                    imageType: 'General Medical'
                });
                setAnalysisResult(analyzeRes.data);
            } else {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', title);

                await axios.post('/api/records/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            alert('Operation failed');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Upload size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
                <h1 style={{ marginTop: '1rem' }}>{t('upload_medical_record')}</h1>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        onClick={() => setIsVisionMode(false)}
                        style={{ padding: '0.5rem 1rem', background: !isVisionMode ? 'var(--primary)' : 'transparent', color: !isVisionMode ? 'white' : 'var(--text-main)', border: '1px solid var(--border-color)', width: 'auto' }}
                    >
                        Standard OCR
                    </button>
                    <button
                        onClick={() => setIsVisionMode(true)}
                        style={{ padding: '0.5rem 1rem', background: isVisionMode ? 'var(--primary)' : 'transparent', color: isVisionMode ? 'white' : 'var(--text-main)', border: '1px solid var(--border-color)', width: 'auto' }}
                    >
                        Vision AI Analysis
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="feature-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {!isVisionMode && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-main)' }}>
                            <FileText size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Record Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Lab Report - Dec 2023"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                fontSize: '1rem',
                                transition: 'var(--transition)'
                            }}
                        />
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-main)' }}>
                        <Upload size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        {isVisionMode ? 'Medical Image (X-ray, MRI, etc.)' : 'File (Image/PDF)'}
                    </label>
                    <input
                        type="file"
                        onChange={e => setFile(e.target.files[0])}
                        accept="image/*,application/pdf"
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    />
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    style={{
                        padding: '1rem',
                        background: loading ? 'var(--text-muted)' : 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'var(--transition)'
                    }}
                >
                    {loading ? (
                        <>
                            <Loader size={20} className="spin" />
                            {isVisionMode ? 'Analyzing with AI...' : 'Uploading & Processing...'}
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            {isVisionMode ? t('analyze_image') : t('upload_records')}
                        </>
                    )}
                </button>
            </form>

            {analysisResult && (
                <div className="feature-card" style={{ marginTop: '2rem', borderLeft: '4px solid var(--primary)' }}>
                    <h3>🔍 {t('analyze_image')} {t('findings')}</h3>
                    <p style={{ marginTop: '1rem' }}>{analysisResult.analysis}</p>

                    <h4 style={{ marginTop: '1rem' }}>📋 {t('findings')}:</h4>
                    <ul>
                        {analysisResult.findings?.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>

                    <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                        {t('recommendation')}: {analysisResult.recommendation}
                    </p>
                    <p style={{ color: analysisResult.urgency === 'High' ? '#ef4444' : 'var(--primary)' }}>
                        {t('urgency')}: {analysisResult.urgency}
                    </p>

                    <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', fontSize: '0.75rem', borderRadius: '4px' }}>
                        ⚠️ {t('disclaimer_vision')}
                    </div>
                </div>
            )}

            <div className="feature-card" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>📋 What happens next?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    Your document will be securely stored and processed using OCR technology to extract text and important medical information automatically.
                </p>
            </div>
        </div>
    );
};

export default RecordUpload;
