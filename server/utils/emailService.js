const nodemailer = require('nodemailer');

// Email service utility for sending password reset emails
class EmailService {
    constructor() {
        // Check which email service to use
        const emailService = process.env.EMAIL_SERVICE;

        if (emailService === 'mailgun') {
            // Mailgun configuration
            this.useMailgun = true;
            this.mode = 'mailgun';

            // Mailgun will be initialized when sending
            this.mailgunConfig = {
                apiKey: process.env.MAILGUN_API_KEY,
                domain: process.env.MAILGUN_DOMAIN,
                from: process.env.MAILGUN_FROM || `Televita <noreply@${process.env.MAILGUN_DOMAIN}>`
            };
        } else if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            // SMTP configuration (Gmail, Outlook, etc.)
            this.useMailgun = false;
            this.transporter = nodemailer.createTransport({
                service: emailService || 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            this.mode = 'smtp';
        } else {
            // Mock email configuration (logs to console)
            this.useMailgun = false;
            this.transporter = nodemailer.createTransport({
                streamTransport: true,
                newline: 'unix',
                buffer: true
            });
            this.mode = 'mock';
        }
    }

    async sendPasswordResetEmail(email, resetToken) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

        const emailContent = {
            subject: 'Password Reset Request - Televita',
            html: this.getEmailTemplate(resetLink)
        };

        try {
            if (this.mode === 'mailgun') {
                return await this.sendViaMailgun(email, emailContent);
            } else if (this.mode === 'smtp') {
                return await this.sendViaSMTP(email, emailContent, resetLink);
            } else {
                return this.sendMockEmail(email, emailContent, resetLink);
            }
        } catch (error) {
            console.error('❌ Email sending error:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendViaMailgun(email, emailContent) {
        const mailgun = require('mailgun-js')({
            apiKey: this.mailgunConfig.apiKey,
            domain: this.mailgunConfig.domain
        });

        const data = {
            from: this.mailgunConfig.from,
            to: email,
            subject: emailContent.subject,
            html: emailContent.html
        };

        const result = await mailgun.messages().send(data);
        console.log('✅ Email sent via Mailgun:', result.id);

        return {
            success: true,
            message: 'Email sent successfully via Mailgun',
            messageId: result.id
        };
    }

    async sendViaSMTP(email, emailContent, resetLink) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: emailContent.subject,
            html: emailContent.html
        };

        const info = await this.transporter.sendMail(mailOptions);
        console.log('✅ Email sent via SMTP:', info.messageId);

        return {
            success: true,
            message: 'Email sent successfully via SMTP',
            messageId: info.messageId
        };
    }

    sendMockEmail(email, emailContent, resetLink) {
        console.log('\n📧 ========== MOCK EMAIL ==========');
        console.log('From: noreply@televita.com');
        console.log('To:', email);
        console.log('Subject:', emailContent.subject);
        console.log('\n🔗 Password Reset Link:');
        console.log(resetLink);
        console.log('\n💡 Copy this link and paste it in your browser to reset your password.');
        console.log('===================================\n');

        return {
            success: true,
            message: 'Mock email logged to console',
            resetLink: resetLink
        };
    }

    getEmailTemplate(resetLink) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏥 Televita</h1>
                        <p>Password Reset Request</p>
                    </div>
                    <div class="content">
                        <h2>Hello!</h2>
                        <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        
                        <div style="text-align: center;">
                            <a href="${resetLink}" class="button">Reset Password</a>
                        </div>
                        
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all;">
                            ${resetLink}
                        </p>
                        
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong>
                            <ul>
                                <li>This link will expire in <strong>1 hour</strong></li>
                                <li>If you didn't request this, please ignore this email</li>
                                <li>Never share this link with anyone</li>
                            </ul>
                        </div>
                        
                        <p>If you have any questions, please contact our support team.</p>
                        
                        <p>Best regards,<br>The Televita Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Televita. All rights reserved.</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    getMode() {
        return this.mode;
    }
}

module.exports = new EmailService();
