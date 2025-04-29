const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const EmailService = require('../utils/email');
const emailService = new EmailService();

// POST endpoint for sending emails
router.post('/', async (req, res) => {
    const { email, message } = req.body;

    try {
        await emailService.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Message from Barangay Dulag Website',
            text: `Email: ${email}\n\nMessage: ${message}`,
            html: `<p><strong>From</strong></p>: ${email}<br><p><strong>Message</strong></p>: ${message}`
        });

        res.status(200).json({
            success: true,
            message: 'Email sent successfully'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

module.exports = router;