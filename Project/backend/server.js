require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./database');

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  'https://inciden-t-iq.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// TODO: Import and use routes
app.use('/api/auth', require('./routes/auth').router);
app.use('/api/incidents', require('./routes/incidents').router);
app.use('/api/reports', require('./routes/reports').router);
app.use('/api/ai', require('./routes/ai').router);
app.use('/api/email', require('./routes/email').router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  if (process.env.NODE_ENV === 'production') {
    console.log(`[SMTP] Environment: production. Loading SMTP configuration...`);
    console.log(`[SMTP] Host: ${process.env.SMTP_HOST ? 'Configured' : 'Missing'}`);
    console.log(`[SMTP] Port: ${process.env.SMTP_PORT ? 'Configured' : 'Missing'}`);
    console.log(`[SMTP] Mail: ${process.env.SMTP_MAIL ? 'Configured' : 'Missing'}`);
    console.log(`[SMTP] Pass: ${process.env.SMTP_PASS ? 'Configured' : 'Missing'}`);
  }

  const { getSmtpMissingVars, createConfiguredTransporter } = require('./services/emailService');
  const missingVars = getSmtpMissingVars();
  if (missingVars.length === 0) {
    const transporter = createConfiguredTransporter();
    try {
      await transporter.verify();
      console.log('[SMTP] Connection successful. Ready to send emails.');
    } catch (error) {
      console.error('[SMTP] Connection failed during startup:', error.message);
    }
  } else {
    console.warn('[SMTP] Missing one or more SMTP credentials. Email functionality may not work.');
  }

  const aiService = require('./services/aiService');
  await aiService.testGeminiModels();
});