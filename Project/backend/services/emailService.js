const nodemailer = require('nodemailer');

const getSmtpMissingVars = () => {
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_MAIL', 'SMTP_PASS'];
  return requiredEnvVars.filter(key => !process.env[key]);
};

const createConfiguredTransporter = () => {
  const port = Number(process.env.SMTP_PORT);
  
  // Brevo typically uses port 587 (STARTTLS).
  // Port 465 is usually implicit SSL/TLS.
  const isSecure = port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: isSecure, // true for 465, false for other ports (will upgrade to STARTTLS if server supports)
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    logger: true,
    debug: true
  });
};

module.exports = {
  getSmtpMissingVars,
  createConfiguredTransporter
};
