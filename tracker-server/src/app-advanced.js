const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const connectDB = require('./utils/db');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CORS_ORIGIN || 'https://we-spend.netlify.app']
    : true,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/expenses', expenseRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Tracker API Running',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api/docs',
    health: '/health'
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'Expense Tracker API',
    version: '1.0.0',
    endpoints: {
      'GET /': 'API information',
      'GET /health': 'Health check',
      'GET /api/expenses': 'Get all expenses',
      'POST /api/expenses': 'Create new expense',
      'PUT /api/expenses/:id': 'Update expense',
      'DELETE /api/expenses/:id': 'Delete expense',
      'GET /api/expenses/entries/:year/:month/:day': 'Get entries by date',
      'GET /api/expenses/sum/income/:year/:month/:day': 'Get income sum by date',
      'GET /api/expenses/sum/expense/:year/:month/:day': 'Get expense sum by date',
      'GET /api/expenses/netbalance/:year/:month': 'Get monthly net balance',
      'GET /api/expenses/expense-summary/:year/:month': 'Get expense summary by category',
      'GET /api/expenses/yearly-expenses/:year': 'Get yearly expenses',
      'GET /api/expenses/summary/june-2025': 'Get monthly data from June 2025'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Log error to external service if configured
  if (process.env.SENTRY_DSN) {
    // Sentry logging would go here
    console.log('Error logged to Sentry');
  }
  
  res.status(err.status || 500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    availableRoutes: ['/api/expenses', '/health', '/api/docs'],
    timestamp: new Date().toISOString()
  });
});

module.exports = app; 