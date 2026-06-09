const express = require('express');
const { getSmtpMissingVars, createConfiguredTransporter } = require('../services/emailService');

const router = express.Router();

router.get('/test', async (req, res) => {
  try {
    const missingVars = getSmtpMissingVars();
    
    if (missingVars.length > 0) {
      return res.status(500).json({ 
        success: false,
        error: `Missing SMTP credentials: ${missingVars.join(', ')}` 
      });
    }

    const transporter = createConfiguredTransporter();
    
    await transporter.verify();
    
    res.json({
      success: true,
      message: 'SMTP connection verified successfully',
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT
    });
  } catch (error) {
    console.error('[SMTP Test Endpoint Error]:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command
    });
  }
});

exports.router = router;
