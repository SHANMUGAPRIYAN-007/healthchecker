const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileUrl: {
        type: DataTypes.STRING
    },
    extractedText: {
        type: DataTypes.TEXT
    },
    summary: {
        type: DataTypes.TEXT
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
});

module.exports = MedicalRecord;
