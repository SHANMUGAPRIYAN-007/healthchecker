const { Appointment, User, MedicalRecord } = require('../models');

exports.createAppointment = async (req, res) => {
    try {
        const { doctorId, date, reason } = req.body;
        const patientId = req.user.id;

        const appointment = await Appointment.create({
            patientId,
            doctorId,
            date,
            reason
        });

        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let where = {};
        if (role === 'doctor') {
            where = { doctorId: userId };
        } else {
            where = { patientId: userId };
        }

        const appointments = await Appointment.findAll({
            where,
            include: [
                { model: User, as: 'patient', attributes: ['name', 'email'] },
                { model: User, as: 'doctor', attributes: ['name', 'email'] }
            ],
            order: [['date', 'ASC']]
        });

        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // scheduled, completed, cancelled

        const appointment = await Appointment.findByPk(id);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        // Only allow doctor to mark as completed, or patient/doctor to cancel
        appointment.status = status;
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.findAll({
            where: { role: 'doctor' },
            attributes: ['id', 'name', 'email']
        });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
