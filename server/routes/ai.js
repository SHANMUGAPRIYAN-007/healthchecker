const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// Protect this route? Maybe allow public? stricter is better.
router.post('/check-symptoms', auth, aiController.analyzeSymptoms);
router.post('/analyze-image', auth, aiController.analyzeImage);
router.post('/health-summary', auth, aiController.generateHealthSummary);

module.exports = router;
