const { sendEmail } = require('../utils/email');
const config = require('../config/config');

exports.sendContactEmail = async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ success: false, message: 'Email and message are required.' });
  }

  // Validate email format (basic validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  try {
    const subject = `Dulag BPS Inquiry`;
    const htmlBody = `
      <h1>New Contact Form Submission</h1>
      <p><strong>From:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    const recipientEmail = config.EMAIL.ADMIN_EMAIL; 

    await sendEmail(recipientEmail, subject, htmlBody);

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error in sendContactEmail controller:', error);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
  }
}; 