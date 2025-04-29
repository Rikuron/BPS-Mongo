const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const config = require('./config/config');

// Import Routes
const residentRoutes = require('./routes/residents');
const announcementRoutes = require('./routes/announcements');
const caseRoutes = require('./routes/cases');
const eventRoutes = require('./routes/events');
const staffRoutes = require('./routes/staff');
const activityRoutes = require('./routes/activities');
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email');

// Security Middleware
const helmet = require('helmet');
const morgan = require('morgan');

// Create Express App
const app = express(); 

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
}));
app.use(morgan('dev'));

// Basic Middleware
app.use(cors({}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Static File Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/activities', activityRoutes);

// Email route
// app.use('/api/send-email', emailRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Handle JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
  });
});

// Handle uncaught exceptions and promises rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection: ', reason);
  process.exit(1);
});

// Start the server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running in ${config.NODE_ENV} mode on port http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

