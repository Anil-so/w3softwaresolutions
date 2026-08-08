const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const { validateEnvironment } = require('./config/env');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const applicantRoutes = require('./routes/applicant');
const applicationRoutes = require('./routes/applications');
const paymentRoutes = require('./routes/payments');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173', 'https://w3-solution-craft.vercel.app'].filter(Boolean);
const vercelPattern = /^https:\/\/([a-z0-9-]+\.)?vercel\.app$/i;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS policy does not allow this origin'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

const envStatus = validateEnvironment();
if (envStatus.warnings.length) {
  console.warn('[env] Warnings:', envStatus.warnings);
}

app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/applicant', applicantRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/payments', paymentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
