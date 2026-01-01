const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

router.post('/', auth, appointmentController.createAppointment);
router.get('/', auth, appointmentController.getAppointments);
router.get('/doctors', auth, appointmentController.getDoctors);
router.patch('/:id/status', auth, appointmentController.updateStatus);

module.exports = router;
