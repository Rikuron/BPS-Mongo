const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.EMAIL.USER,
                pass: config.EMAIL.PASS,
            }
        });
    }

    // Send email
    async sendEmail(to, subject, html) {
        try {
            const mailOptions = {
                from: config.EMAIL.USER,
                to,
                subject,
                html,
            };
            
            const info = await this.transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = EmailService;