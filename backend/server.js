/**
 * Vani Technologies - Backend Server
 * Main application entry point
 */
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./config/db');
const { seedProductsIfNeeded } = require('./utils/seedProducts');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database & Seed default portfolio products
connectDB().then(() => seedProductsIfNeeded());

// Security and Logging Middleware
const rateLimit = require('express-rate-limit');

// Production Helmet configuration
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows CDN resources (Tailwind, FontAwesome, AOS, ThreeJS)
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Dynamic CORS configuration
const allowedOrigins = [
  'https://www.vanitechnologies.in',
  'https://vanitechnologies.in',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS security policy.'));
    },
    credentials: true,
  })
);

// Body parsers with payload size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging: combined in production, dev in development
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || (process.env.NODE_ENV === 'production' ? 100 : 1000),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});
app.use('/api/', apiLimiter);

// Specific stricter rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 30 : 300,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});
app.use('/api/auth/', authLimiter);

// Serve Frontend Static Files & Assets
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Explicit route for robots.txt & sitemap.xml
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(frontendPath, 'robots.txt'));
});
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(frontendPath, 'sitemap.xml'));
});

// Health Check API Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vani Technologies API is running smoothly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Fallback for API routes not found
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Server Error]:', err.stack);
  } else {
    console.error('[Server Error]:', err.message);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Vani Technologies Server is running on port ${PORT}`);
  console.log(`🌐 Website URL:  http://localhost:${PORT}`);
  console.log(`🩺 Health API:   http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});

// Handle Server Port Conflict & Errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [PORT CONFLICT] Port ${PORT} is already in use by another running Node.js process.`);
    console.error(`💡 Tip: Stop the process currently occupying port ${PORT} by running:`);
    console.error(`   npx kill-port ${PORT}  OR  Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
  } else {
    console.error('[Server Error]:', err.message);
  }
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Gracefully shutting down Vani Technologies server...');
  server.close(() => {
    process.exit(0);
  });
});
