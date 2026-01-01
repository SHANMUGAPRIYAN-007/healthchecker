import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, MessageSquare, Upload, Shield, Clock, Brain, Heart, FileText } from 'lucide-react';

const Features = () => {
    const navigate = useNavigate();
    const features = [
        {
            icon: <Brain className="feature-icon" />,
            title: "AI-Powered Symptom Analysis",
            description: "Get instant, intelligent health assessments powered by advanced AI technology. Our system analyzes your symptoms and provides comprehensive insights to help you understand your condition better."
        },
        {
            icon: <MessageSquare className="feature-icon" />,
            title: "Real-Time Doctor Consultation",
            description: "Connect with healthcare professionals instantly through our secure chat platform. Get expert medical advice and answers to your health concerns in real-time, from anywhere."
        },
        {
            icon: <Upload className="feature-icon" />,
            title: "Smart Document Processing",
            description: "Upload medical records, prescriptions, and lab reports with ease. Our advanced OCR technology automatically extracts and organizes information from your documents for quick access."
        },
        {
            icon: <Shield className="feature-icon" />,
            title: "Secure & Private",
            description: "Your health data is protected with enterprise-grade encryption and security measures. We prioritize your privacy and comply with healthcare data protection standards."
        },
        {
            icon: <Clock className="feature-icon" />,
            title: "24/7 Availability",
            description: "Access healthcare support whenever you need it. Our platform is available round-the-clock, ensuring you can get help and information at any time of day or night."
        },
        {
            icon: <FileText className="feature-icon" />,
            title: "Comprehensive Health Records",
            description: "Maintain a complete digital history of your medical records, consultations, and health assessments. All your health information is organized and accessible in one secure location."
        },
        {
            icon: <Activity className="feature-icon" />,
            title: "Personalized Health Insights",
            description: "Receive tailored health recommendations based on your medical history and current symptoms. Our AI learns from your data to provide increasingly accurate and personalized guidance."
        },
        {
            icon: <Heart className="feature-icon" />,
            title: "Holistic Care Approach",
            description: "We consider your complete health profile, including medical history, lifestyle factors, and current symptoms, to provide comprehensive care recommendations that address your overall wellbeing."
        }
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Features</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                    Discover how Televita combines cutting-edge technology with compassionate care to revolutionize your healthcare experience.
                </p>
            </div>

            <div className="dashboard-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        {feature.icon}
                        <h3>{feature.title}</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '0.5rem' }}>
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="feature-card" style={{ marginTop: '3rem', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Ready to Get Started?</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
                    Join thousands of users who trust Televita for their healthcare needs.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/symptom-checker')}
                        style={{ width: 'auto', padding: '1rem 2rem' }}
                    >
                        Try Symptom Checker
                    </button>
                    <button
                        onClick={() => navigate('/chat')}
                        style={{
                            width: 'auto',
                            padding: '1rem 2rem',
                            background: 'transparent',
                            border: '2px solid var(--primary)',
                            color: 'var(--primary)'
                        }}
                    >
                        Chat with a Doctor
                    </button>
                    <button
                        onClick={() => navigate('/records/upload')}
                        style={{
                            width: 'auto',
                            padding: '1rem 2rem',
                            background: 'transparent',
                            border: '2px solid var(--primary)',
                            color: 'var(--primary)'
                        }}
                    >
                        Upload Records
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Features;
