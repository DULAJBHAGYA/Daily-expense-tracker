const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./utils/db');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Lazy DB connection middleware (only for routes that need DB)
const ensureDbConnection = (req, res, next) => {
  connectDB()
    .then(() => next())
    .catch(next);
};

// Middleware
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: isProduction ? (allowedOrigins.length ? allowedOrigins : true) : true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint (no DB)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes (ensure DB connection)
app.use('/api/expenses', ensureDbConnection, expenseRoutes);

// Root (no DB)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Tracker API Running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
