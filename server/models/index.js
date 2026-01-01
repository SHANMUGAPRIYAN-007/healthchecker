const User = require('./User');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');

// Associations
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'patientAppointments' });
User.hasMany(Appointment, { foreignKey: 'doctorId', as: 'doctorAppointments' });

Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

User.hasMany(MedicalRecord, { foreignKey: 'patientId', as: 'records' });
MedicalRecord.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

module.exports = { User, Appointment, MedicalRecord };
