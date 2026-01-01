const OpenAI = require('openai');
require('dotenv').config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.analyzeSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;

        // MOCK RESPONSE if Key is placeholder or missing
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('placeholder')) {
            console.log('Using Mock AI Response (No API Key provided)');
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
            return res.json({
                urgency: "Medium",
                causes: ["Viral Infection (Mock)", "Dehydration (Mock)", "Fatigue (Mock)"],
                next_steps: ["Rest and hydration", "Monitor temperature", "Consult doctor if worsens"],
                disclaimer: "This is a MOCK response because no valid OpenAI API Key was found in .env."
            });
        }

        const prompt = `
      Act as a medical assistant. Analyze the following patient data:
      Symptoms: ${symptoms}
      Age: ${req.body.age}
      Gender: ${req.body.gender}
      Medical History: ${req.body.history}
      
      Provide a list of potential causes (differential diagnosis), recommended next steps, and urgency level (Low, Medium, High).
      Format the output as JSON with keys: 'causes' (array), 'next_steps' (array), 'urgency' (string), 'disclaimer'.
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        // Attempt to parse JSON if GPT returned purely JSON, otherwise return text
        let data;
        try {
            data = JSON.parse(content);
        } catch (e) {
            data = { raw_response: content };
        }

        res.json(data);
    } catch (err) {
        console.error('AI Error:', err.message);
        // Fallback Mock on Error too
        res.json({
            urgency: "Unknown",
            causes: ["Error analyzing symptoms"],
            next_steps: ["Please check server logs", "Ensure OpenAI Key is valid"],
            disclaimer: "Failed to contact AI service."
        });
    }
};

exports.analyzeImage = async (req, res) => {
    try {
        const { imageUrl, imageType } = req.body; // imageType could be 'xray', 'mri', 'skin', etc.

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('placeholder')) {
            console.log('Using Mock Image AI Response');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return res.json({
                analysis: `[MOCK] Preliminary analysis for ${imageType || 'uploaded image'}.`,
                findings: ["No obvious fractures detected (Mock)", "Tissue density appears normal (Mock)"],
                recommendation: "Please consult a specialist for a formal radiological report.",
                urgency: "Low",
                disclaimer: "This is a MOCK vision analysis. OpenAI API key is missing or invalid."
            });
        }

        const prompt = `
            Act as a radiological assistant. Analyze this medical image (${imageType || 'General'}).
            Provide:
            1. Brief analysis of what is visible.
            2. Key findings.
            3. Preliminary recommendation.
            4. Urgency level (Low, Medium, High).
            
            IMPORTANT: State clearly that this is for screening only and not a final diagnosis.
            Format the response as JSON with keys: 'analysis', 'findings' (array), 'recommendation', 'urgency', 'disclaimer'.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: { "url": imageUrl },
                        },
                    ],
                },
            ],
            max_tokens: 500,
        });

        const content = response.choices[0].message.content;
        let data;
        try {
            // OpenAI Vision sometimes wraps JSON in markdown blocks
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            data = jsonMatch ? JSON.parse(jsonMatch[0]) : { analysis: content };
        } catch (e) {
            data = { analysis: content };
        }

        res.json(data);
    } catch (err) {
        console.error('Vision AI Error:', err.message);
        res.status(500).json({ error: 'Failed to analyze image' });
    }
};

exports.generateHealthSummary = async (req, res) => {
    try {
        const { patientId } = req.body;

        // Fetch all records for this patient
        const records = await MedicalRecord.findAll({ where: { patientId } });

        if (records.length === 0) {
            return res.json({ summary: "No medical records found for this patient." });
        }

        const historyText = records.map(r => `Title: ${r.title}\nExtracted Data: ${r.extractedText}`).join('\n\n---\n\n');

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('placeholder')) {
            return res.json({
                summary: "[MOCK] The patient has a history of respiratory issues and regular lab tests. All values appear to be within normal ranges for their age group.",
                recommendations: ["Regular checkups", "Focus on cardiovascular health"],
                disclaimer: "Mock AI Summary"
            });
        }

        const prompt = `
            Act as a senior clinical advisor. Below is a patient's medical history extracted via OCR.
            Summarize this history into a professional clinical briefing for a consulting physician.
            Highlight:
            1. Major chronic conditions or recurring patterns.
            2. Recent lab findings or acute issues.
            3. Areas requiring immediate attention.
            
            HISTORY:
            ${historyText}
            
            Format as JSON with keys: 'summary', 'recommendations' (array), 'disclaimer'.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        });

        const content = response.choices[0].message.content;
        let data;
        try {
            data = JSON.parse(content);
        } catch (e) {
            data = { summary: content };
        }

        res.json(data);
    } catch (err) {
        console.error('Summary Error:', err.message);
        res.status(500).json({ error: 'Failed to generate health summary' });
    }
};
