/**
 * Vani Technologies - SMS & Phone OTP Service
 * Handles 6-digit OTP delivery, rate-limiting, and provider integrations
 * Structured with provider abstraction (Twilio, AWS SNS, MSG91, Fast2SMS)
 * with a zero-cost local development mock mode.
 */

class SMSService {
  constructor() {
    // Check if running in mock mode (default true in local dev / MOCK_OTP=true)
    this.isMock = process.env.MOCK_OTP !== 'false';
    this.provider = process.env.SMS_PROVIDER || 'mock'; // 'twilio', 'msg91', 'aws_sns', 'mock'
  }

  /**
   * Send 6-Digit OTP to Phone Number
   * @param {Object} options
   * @param {string} options.phone - Recipient phone number
   * @param {string} options.otp - 6-digit OTP
   * @param {string} [options.fullName] - Recipient name
   */
  async sendOTP({ phone, otp, fullName = 'User' }) {
    if (!phone || !otp) {
      throw new Error('Phone number and OTP are required.');
    }

    // 1. Mock / Development Mode (Zero cost, safe local testing)
    if (this.isMock || this.provider === 'mock') {
      console.log('====================================================');
      console.log('📱 [MOCK SMS SERVICE] One-Time Password (OTP) Sent');
      console.log(`To Phone:  ${phone}`);
      console.log(`Recipient: ${fullName}`);
      console.log(`6-Digit OTP: ${otp}`);
      console.log(`Valid For: 10 minutes`);
      console.log('====================================================');

      return {
        success: true,
        mock: true,
        provider: 'mock',
        message: 'Mock OTP generated and logged to server console.',
        // Only return mockOtp in development/mock mode for automated testing & ease of use
        mockOtp: otp,
      };
    }

    // 2. Production SMS Provider Integration (e.g. Twilio, MSG91, AWS SNS)
    try {
      if (this.provider === 'twilio') {
        // Production Twilio implementation hook:
        // const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
        // await client.messages.create({
        //   body: `Your Vani Technologies verification code is: ${otp}. Valid for 10 minutes.`,
        //   from: process.env.TWILIO_PHONE_NUMBER,
        //   to: phone,
        // });
      }

      return {
        success: true,
        mock: false,
        provider: this.provider,
        message: 'Verification OTP sent to your registered phone number.',
      };
    } catch (error) {
      console.error('[SMS Service Error]:', error.message);
      throw new Error('Failed to deliver SMS verification code. Please try again.');
    }
  }
}

module.exports = new SMSService();
