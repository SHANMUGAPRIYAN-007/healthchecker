const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Please enter a valid email address" });
        }

        // Simple password length check - accept any characters (symbols, digits, letters)
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "An account with this email already exists" });
        }

        // Create user - password will be hashed by User model hook
        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            message: "Registration successful! Please login to continue.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('\n🔐 Login attempt for:', email);
        console.log('Password provided:', password ? `${password.substring(0, 3)}***` : 'EMPTY');

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Please enter a valid email address" });
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('❌ User not found');
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log('✅ User found:', user.email);
        console.log('Stored password hash:', user.password ? `${user.password.substring(0, 10)}...` : 'EMPTY');

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            console.log('❌ Password does not match\n');
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log('✅ Login successful\n');

        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: "Login failed. Please try again." });
    }
});

// Forgot Password - Send Reset Email
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ where: { email } });

        // For security, always return success message even if user doesn't exist
        if (!user) {
            return res.json({
                message: "If an account with that email exists, a password reset link has been sent.",
                mode: 'security'
            });
        }

        // Generate secure reset token using crypto
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = expiry;
        await user.save();

        // Send email with reset link
        const emailService = require('../utils/emailService');
        const emailResult = await emailService.sendPasswordResetEmail(email, resetToken);

        console.log(`[PASSWORD RESET] Token generated for ${email}`);
        console.log(`Email mode: ${emailService.getMode()}`);

        res.json({
            message: "Password reset link has been sent to your email. Please check your inbox.",
            mode: emailService.getMode(),
            // Only include link in response for mock mode (development)
            ...(emailService.getMode() === 'mock' && { resetLink: emailResult.resetLink })
        });

    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: "Unable to process password reset request. Please try again." });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ where: { resetToken: token } });

        if (!user || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // Update password (hooks will hash it)
        user.password = newPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.json({ message: "Password reset successful. You can login now." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
