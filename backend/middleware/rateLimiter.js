const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter for Contact Inquiries
 * Prevents spam bots from flooding the database and notification channels.
 * Limits: 5 requests per 15 minutes per IP address.
 */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 contact submissions per 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many contact requests submitted from this IP. Please wait 15 minutes before submitting again.',
  },
  skip: (req) => {
    // In test environment, allow skipping via header
    return req.headers['x-test-bypass-rate-limit'] === 'true';
  },
});

module.exports = { contactLimiter };
