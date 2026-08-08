const nodemailer = require('nodemailer');

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 5,
  });
}

async function sendOtpEmail(email, otp) {
  const transporter = createTransporter();
  if (!transporter) {
    return { sent: false, reason: 'SMTP credentials not configured' };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@w3solutions.com',
    to: email,
    subject: 'Your W3 verification code',
    html: `<p>Your verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
  });

  return { sent: true };
}

module.exports = { sendOtpEmail };
