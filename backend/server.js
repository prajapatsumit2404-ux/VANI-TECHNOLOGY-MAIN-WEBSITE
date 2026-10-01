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

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Security and Logging Middleware
// helmet configured to allow CDN resources in development
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve Frontend Static Files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

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

// Fallback for API routes not found
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
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
