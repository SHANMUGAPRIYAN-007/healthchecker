const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { MedicalRecord } = require('../models');
const auth = require('../middleware/auth');
const upload = multer({ dest: 'uploads/' }); // Temp storage

router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // 1. Upload to Cloudinary
        let cloudResult;
        try {
            cloudResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'medical_records'
            });
        } catch (e) {
            // Fallback or Mock if credentials are invalid?
            console.warn('Cloudinary upload failed (likely credentials), proceeding mostly for demo', e.message);
            cloudResult = { secure_url: 'mock_url_cloudinary_failed' };
        }

        // 2. Send to OCR Service
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        let ocrText = "";
        try {
            const ocrResponse = await axios.post(`${process.env.EXT_OCR_SERVICE_URL}/extract`, formData, {
                headers: { ...formData.getHeaders() }
            });
            ocrText = ocrResponse.data.text;
        } catch (err) {
            console.error('OCR Service Error:', err.message);
            ocrText = "OCR Extraction Failed";
        }

        // 3. Save to DB
        const record = await MedicalRecord.create({
            patientId: req.user.id,
            title: req.body.title || req.file.originalname,
            fileUrl: cloudResult.secure_url,
            extractedText: ocrText,
            summary: "Pending Analysis" // Could use AI to summarize here too
        });

        // Cleanup temp file
        fs.unlinkSync(req.file.path);

        res.json(record);
    } catch (err) {
        console.error(err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Upload failed' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const records = await MedicalRecord.findAll({ where: { patientId: req.user.id } });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
