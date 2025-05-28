const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: config.EMAIL.USER,
        pass: config.EMAIL.PASS,
    },
});

// Function to send an email
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `Dulag BPS <${config.EMAIL.USER}>`, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
};

module.exports = {
    sendEmail,
};