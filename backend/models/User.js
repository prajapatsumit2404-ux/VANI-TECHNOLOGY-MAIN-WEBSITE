const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      unique: true,
      trim: true,
      match: [
        /^[+]?[0-9]{7,15}$/,
        'Please provide a valid phone number (digits only, optionally prefixed with +)',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Email Verification fields
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      select: false,
    },
    // Phone OTP Verification fields
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    otpLastSent: {
      type: Date,
      select: false,
    },
    // Password reset fields
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to securely hash password before storing
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare entered password against stored bcrypt hash
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JSON Web Token (JWT)
 */
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'vani_technologies_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

/**
 * Generate Email Verification Token
 * Returns raw unhashed token for verification link, stores SHA-256 hash in DB
 */
UserSchema.methods.generateEmailVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');

  // Hash token and store in user model
  this.verificationToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  // Token expires in 24 hours
  this.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

  return rawToken;
};

/**
 * Generate Secure 6-digit Phone OTP
 * Returns raw 6-digit OTP for SMS provider, stores SHA-256 hash in DB
 */
UserSchema.methods.generatePhoneOTP = function () {
  // Generate random 6-digit number between 100000 and 999999
  const rawOtp = crypto.randomInt(100000, 999999).toString();

  // Hash OTP before storing so real OTP is never stored in plain-text
  this.otp = crypto
    .createHash('sha256')
    .update(rawOtp)
    .digest('hex');

  // OTP expires in 10 minutes
  this.otpExpiry = Date.now() + 10 * 60 * 1000;
  this.otpAttempts = 0;
  this.otpLastSent = Date.now();

  return rawOtp;
};

/**
 * Ensure passwords, verification tokens, and OTP secrets are never leaked in toJSON()
 */
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  delete userObject.verificationToken;
  delete userObject.verificationTokenExpiry;
  delete userObject.otp;
  delete userObject.otpExpiry;
  delete userObject.otpAttempts;
  delete userObject.otpLastSent;
  return userObject;
};

module.exports = mongoose.model('User', UserSchema);
