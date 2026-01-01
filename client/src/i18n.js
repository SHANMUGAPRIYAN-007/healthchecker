import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "welcome": "Welcome to Televita",
            "home": "Home",
            "symptom_checker": "Symptom Checker",
            "chat": "Chat with Doctor",
            "upload_records": "Upload Records",
            "features": "Features",
            "login": "Login",
            "register": "Register",
            "logout": "Logout",
            "upload_medical_record": "Upload Medical Record",
            "analyze_image": "Analyze Image (Vision AI)",
            "findings": "Findings",
            "recommendation": "Recommendation",
            "urgency": "Urgency",
            "disclaimer_vision": "This is for screening only and not a final diagnosis."
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
