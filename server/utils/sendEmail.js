const nodemailer = require('nodemailer');

const USER = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;

let transporter = null;
if (USER && PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: USER, pass: PASS }
  });
} else {
  console.warn('EMAIL_USER or EMAIL_PASS not set — emails will be logged to console instead of sent');
}

async function sendEmail(to, subject, text) {
  // If no transporter configured, just log the email (dev fallback)
  if (!transporter) {
    console.log('--- sendEmail fallback ---')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Text: ${text}`)
    console.log('--- end email ---')
    return true
  }

  try {
    await transporter.sendMail({ from: USER, to, subject, text });
    return true
  } catch (err) {
    console.error('Failed to send email:', err.message || err);
    // Log the attempted email content as a fallback so OTPs are recoverable in dev
    console.log('--- failed email content ---')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Text: ${text}`)
    console.log('--- end failed email content ---')
    return false
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { sendEmail, generateOTP };
