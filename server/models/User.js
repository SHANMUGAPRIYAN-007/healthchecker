const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name is required'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: {
            msg: 'An account with this email already exists'
        },
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Please enter a valid email address'
            },
            notEmpty: {
                msg: 'Email is required'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password is required'
            },
            len: {
                args: [6, 255],
                msg: 'Password must be at least 6 characters long'
            }
        }
    },
    role: {
        type: DataTypes.ENUM('patient', 'doctor'),
        defaultValue: 'patient'
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

module.exports = User;
