const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  sendOTP,
  verifyOTP,
  adminDashboard,
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/auth');

// Public authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Email Verification routes
router.get('/verify-email', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);

// Phone OTP Verification routes (Can be called with { phone, otp } or by authenticated user)
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Protected user profile route
router.get('/me', protect, getMe);

// Protected role-based admin route
router.get('/admin-dashboard', protect, authorize('admin'), adminDashboard);

module.exports = router;
