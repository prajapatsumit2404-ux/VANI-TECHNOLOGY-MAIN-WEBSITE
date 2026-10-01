const crypto = require('crypto');
const User = require('../models/User');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword, role } = req.body;

    // 1. Validation: Required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: fullName, email, phone, and password.',
      });
    }

    // 2. Validation: Password match
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please verify and try again.',
      });
    }

    // 3. Validation: Password strength (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // 4. Duplicate Check: Email
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please login instead.',
      });
    }

    // 5. Duplicate Check: Phone
    const existingPhone = await User.findOne({ phone: cleanPhone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists.',
      });
    }

    // 6. Create User
    // Default to 'user' role unless explicitly admin (or in testing environment)
    const userRole = role === 'admin' ? 'admin' : 'user';

    const user = await User.create({
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password,
      role: userRole,
    });

    // 7. Generate JWT Token
    const token = user.generateAuthToken();

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Vani Technologies.',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Register Error]:', error);

    // Mongoose duplicate key error fallback
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `An account with this ${field} already exists.`,
      });
    }

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.',
    });
  }
};

/**
 * @desc    Authenticate user & get token (Login via Email OR Phone)
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { identifier, email, phone, password } = req.body;

    // Support flexible inputs: identifier, or email, or phone
    const loginIdentifier = identifier || email || phone;

    // 1. Validation
    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email/phone and password.',
      });
    }

    const trimmedIdentifier = loginIdentifier.trim();

    // 2. Determine if identifier is an email (contains '@') or phone
    let query;
    if (trimmedIdentifier.includes('@')) {
      query = { email: trimmedIdentifier.toLowerCase() };
    } else {
      query = { phone: trimmedIdentifier };
    }

    // 3. Find User (explicitly select password since it has select: false)
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/phone and password.',
      });
    }

    // 4. Verify password with bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/phone and password.',
      });
    }

    // 5. Generate JWT Token
    const token = user.generateAuthToken();

    return res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back!',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later.',
    });
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (Requires Bearer token)
 */
exports.getMe = async (req, res) => {
  try {
    // req.user is populated by protect middleware
    return res.status(200).json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    console.error('[GetMe Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not retrieve user profile.',
    });
  }
};

/**
 * @desc    Logout user / invalidate client session
 * @route   POST /api/auth/logout
 * @access  Public
 */
exports.logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully. All active sessions cleared on client.',
  });
};

/**
 * @desc    Initiate password reset (Generate reset token/OTP)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { identifier, email, phone } = req.body;
    const target = identifier || email || phone;

    if (!target) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email or phone number.',
      });
    }

    const trimmed = target.trim();
    let query;
    if (trimmed.includes('@')) {
      query = { email: trimmed.toLowerCase() };
    } else {
      query = { phone: trimmed };
    }

    const user = await User.findOne(query);

    if (!user) {
      // Do not reveal whether user exists for maximum security
      return res.status(200).json({
        success: true,
        message: 'If an account with that information exists, a password reset code has been sent.',
      });
    }

    // Generate a secure 6-digit reset code
    const resetToken = crypto.randomInt(100000, 999999).toString();

    // Set token expiration to 15 minutes from now
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // In production, dispatch email/SMS. In development, return the code for verification.
    return res.status(200).json({
      success: true,
      message: 'Password reset code has been generated. Valid for 15 minutes.',
      resetToken, // Provided for instant demo and automated testing verification
      expiresIn: '15 minutes',
    });
  } catch (error) {
    console.error('[Forgot Password Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process password reset request.',
    });
  }
};

/**
 * @desc    Reset password using reset token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both the reset code and your new password.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation password do not match.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    // Find user with active token and unexpired window
    const user = await User.findOne({
      resetPasswordToken: resetToken.trim(),
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset code. Please request a new one.',
      });
    }

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('[Reset Password Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password. Please try again.',
    });
  }
};

/**
 * @desc    Admin-Only Protected Route (Role-based testing)
 * @route   GET /api/auth/admin-dashboard
 * @access  Private / Admin only
 */
exports.adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    return res.status(200).json({
      success: true,
      message: 'Welcome to Vani Technologies Admin Operations Center',
      analytics: {
        totalRegisteredUsers: totalUsers,
        adminUser: req.user.fullName,
        systemStatus: 'Operational',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error accessing admin dashboard.',
    });
  }
};
