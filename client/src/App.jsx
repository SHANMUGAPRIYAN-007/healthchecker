import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import SymptomChecker from './pages/SymptomChecker';
import Chat from './pages/Chat';
import RecordUpload from './pages/RecordUpload';
import BookAppointment from './pages/BookAppointment';
import PatientDetails from './pages/PatientDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider>
                    <div className="app-container">
                        <Navbar />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />

                            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/features" element={<ProtectedRoute><Features /></ProtectedRoute>} />
                            <Route path="/symptom-checker" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
                            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                            <Route path="/records/upload" element={<ProtectedRoute><RecordUpload /></ProtectedRoute>} />
                            <Route path="/appointments/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
                            <Route path="/patients/:id" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
                        </Routes>
                    </div>
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
