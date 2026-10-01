const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

/**
 * @desc    Register a new user & generate email verification token
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

    // 6. Create User Instance
    const userRole = role === 'admin' ? 'admin' : 'user';

    const user = new User({
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password,
      role: userRole,
      emailVerified: false,
      phoneVerified: false,
    });

    // 7. Generate Secure Email Verification Token (SHA-256 hashed in DB)
    const rawVerifyToken = user.generateEmailVerificationToken();

    // 8. Save user to database
    await user.save();

    // 9. Dispatch Verification Email (Mock or SMTP)
    const origin = `${req.protocol}://${req.get('host')}`;
    const emailResult = await emailService.sendVerificationEmail({
      email: user.email,
      fullName: user.fullName,
      token: rawVerifyToken,
      origin,
    });

    // 10. Generate JWT Auth Token
    const token = user.generateAuthToken();

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Please verify your email address.',
      token,
      user: user.toJSON(),
      emailVerification: {
        sent: true,
        // In development/mock mode, provide raw token & URL for automated tests
        ...(emailResult.mock ? { mockToken: rawVerifyToken, verifyUrl: emailResult.verifyUrl } : {}),
      },
    });
  } catch (error) {
    console.error('[Register Error]:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `An account with this ${field} already exists.`,
      });
    }

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
 * @desc    Verify email address using token
 * @route   GET /api/auth/verify-email
 * @access  Public
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      if (req.accepts('html') && !req.xhr && !req.path.endsWith('.json')) {
        return res.redirect('/verify-email.html?status=error&message=Missing+verification+token');
      }
      return res.status(400).json({
        success: false,
        message: 'Verification token is required.',
      });
    }

    // Hash the raw token to match against the stored SHA-256 hash in DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token.trim())
      .digest('hex');

    // Find user with matching active token that has not expired
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      if (req.accepts('html') && !req.xhr && !req.path.endsWith('.json')) {
        return res.redirect('/verify-email.html?status=error&message=Invalid+or+expired+verification+link');
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token. Please request a new link.',
      });
    }

    // Mark email as verified and invalidate token
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    await user.save();

    // If accessed directly from browser click, redirect to beautiful success page
    if (req.accepts('html') && !req.xhr && !req.path.endsWith('.json')) {
      return res.redirect('/verify-email.html?status=success');
    }

    return res.status(200).json({
      success: true,
      message: 'Email address verified successfully!',
      emailVerified: true,
    });
  } catch (error) {
    console.error('[Verify Email Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during email verification.',
    });
  }
};

/**
 * @desc    Resend email verification link
 * @route   POST /api/auth/resend-verification-email
 * @access  Public or Private
 */
exports.resendVerificationEmail = async (req, res) => {
  try {
    const email = req.user ? req.user.email : req.body.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'This email address is already verified.',
      });
    }

    // Generate new verification token
    const rawToken = user.generateEmailVerificationToken();
    await user.save();

    // Dispatch email
    const origin = `${req.protocol}://${req.get('host')}`;
    const emailResult = await emailService.sendVerificationEmail({
      email: user.email,
      fullName: user.fullName,
      token: rawToken,
      origin,
    });

    return res.status(200).json({
      success: true,
      message: 'A new verification email has been sent.',
      ...(emailResult.mock ? { mockToken: rawToken, verifyUrl: emailResult.verifyUrl } : {}),
    });
  } catch (error) {
    console.error('[Resend Verification Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resend verification email.',
    });
  }
};

/**
 * @desc    Send 6-Digit Phone OTP with Rate Limiting
 * @route   POST /api/auth/send-otp
 * @access  Public or Private
 */
exports.sendOTP = async (req, res) => {
  try {
    const phone = req.user ? req.user.phone : req.body.phone;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number.',
      });
    }

    const cleanPhone = phone.trim();
    const user = await User.findOne({ phone: cleanPhone }).select('+otpLastSent +otp +otpExpiry');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account registered with this phone number.',
      });
    }

    if (user.phoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already verified.',
      });
    }

    // Rate Limiting: 60-second cooldown between OTP requests
    if (user.otpLastSent) {
      const timeSinceLastOtp = Date.now() - user.otpLastSent.getTime();
      const cooldownMs = 60 * 1000;

      if (timeSinceLastOtp < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastOtp) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds} second(s) before requesting a new OTP.`,
          cooldownRemaining: remainingSeconds,
        });
      }
    }

    // Invalidate old OTP & Generate new secure 6-digit OTP (stored as SHA-256)
    const rawOtp = user.generatePhoneOTP();
    await user.save();

    // Dispatch OTP via SMS service
    const smsResult = await smsService.sendOTP({
      phone: user.phone,
      otp: rawOtp,
      fullName: user.fullName,
    });

    return res.status(200).json({
      success: true,
      message: '6-digit OTP sent successfully. Valid for 10 minutes.',
      cooldownSeconds: 60,
      // In development/mock mode, return mockOtp for automated testing & cost-free development
      ...(smsResult.mock ? { mockOtp: rawOtp } : {}),
    });
  } catch (error) {
    console.error('[Send OTP Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to dispatch verification OTP. Please try again.',
    });
  }
};

/**
 * @desc    Verify Phone OTP with Maximum Attempts & Expiry Validation
 * @route   POST /api/auth/verify-otp
 * @access  Public or Private
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { otp, phone } = req.body;
    const targetPhone = req.user ? req.user.phone : phone;

    if (!otp || !targetPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both phone number and 6-digit OTP code.',
      });
    }

    const cleanOtp = otp.toString().trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a valid 6-digit numeric code.',
      });
    }

    // Find user and explicitly select OTP security fields
    const user = await User.findOne({ phone: targetPhone.trim() }).select(
      '+otp +otpExpiry +otpAttempts'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    if (user.phoneVerified) {
      return res.status(200).json({
        success: true,
        message: 'Phone number is already verified.',
        phoneVerified: true,
      });
    }

    // Check if an active OTP was generated
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP found. Please request a new verification code.',
      });
    }

    // 1. Check Maximum Attempts (Security Shield: 5 attempts max)
    const MAX_ATTEMPTS = 5;
    if (user.otpAttempts >= MAX_ATTEMPTS) {
      // Invalidate the compromised OTP
      user.otp = undefined;
      user.otpExpiry = undefined;
      user.otpAttempts = 0;
      await user.save();

      return res.status(429).json({
        success: false,
        message: 'Maximum OTP verification attempts exceeded. For your security, this code has been invalidated. Please request a new OTP.',
      });
    }

    // 2. Check Expiry (10 minutes)
    if (user.otpExpiry.getTime() < Date.now()) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      user.otpAttempts = 0;
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'Verification OTP has expired. Please request a new one.',
      });
    }

    // 3. Hash entered OTP and compare against stored SHA-256 hash
    const hashedEnteredOtp = crypto
      .createHash('sha256')
      .update(cleanOtp)
      .digest('hex');

    if (hashedEnteredOtp !== user.otp) {
      // Increment failed attempt counter
      user.otpAttempts += 1;
      const remainingAttempts = MAX_ATTEMPTS - user.otpAttempts;
      await user.save();

      return res.status(400).json({
        success: false,
        message: `Invalid OTP code. You have ${remainingAttempts} attempt(s) remaining.`,
        remainingAttempts,
      });
    }

    // 4. Verification Successful! Mark phone as verified and invalidate OTP
    user.phoneVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Phone number verified successfully!',
      phoneVerified: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Verify OTP Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during OTP verification.',
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
    const { identifier, email, phone, emailOrPhone, password } = req.body;
    const loginIdentifier = identifier || email || phone || emailOrPhone;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email/phone and password.',
      });
    }

    const trimmedIdentifier = loginIdentifier.trim();
    let query;
    if (trimmedIdentifier.includes('@')) {
      query = { email: trimmedIdentifier.toLowerCase() };
    } else {
      query = { phone: trimmedIdentifier };
    }

    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/phone and password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/phone and password.',
      });
    }

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
 * @desc    Initiate password reset (Generate reset token)
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
      return res.status(200).json({
        success: true,
        message: 'If an account with that information exists, a password reset code has been sent.',
      });
    }

    const resetToken = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: 'Password reset code has been generated. Valid for 15 minutes.',
      resetToken,
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
 * @desc    Admin-Only Protected Route
 * @route   GET /api/auth/admin-dashboard
 * @access  Private / Admin only
 */
exports.adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ emailVerified: true });
    return res.status(200).json({
      success: true,
      message: 'Welcome to Vani Technologies Admin Operations Center',
      analytics: {
        totalRegisteredUsers: totalUsers,
        emailVerifiedUsers: verifiedUsers,
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
