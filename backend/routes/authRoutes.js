const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  adminDashboard,
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/auth');

// Public authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected user profile route
router.get('/me', protect, getMe);

// Protected role-based admin route
router.get('/admin-dashboard', protect, authorize('admin'), adminDashboard);

module.exports = router;
