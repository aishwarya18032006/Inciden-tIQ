require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./database');

const app = express();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  const aiService = require('./services/aiService');
  await aiService.testGeminiModels();
});