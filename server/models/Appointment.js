const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
        defaultValue: 'scheduled'
    },
    reason: {
        type: DataTypes.TEXT
    }
});

module.exports = Appointment;
