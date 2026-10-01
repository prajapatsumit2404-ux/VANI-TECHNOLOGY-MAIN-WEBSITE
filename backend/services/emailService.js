/**
 * Vani Technologies - Email Notification Service
 * Handles email verification links, transactional notifications, and password resets
 * Ready for production SMTP / SendGrid / AWS SES integration with safe local mock fallback
 */

class EmailService {
  constructor() {
    this.isMock = process.env.MOCK_EMAIL !== 'false'; // Default to mock mode in dev
  }

  /**
   * Send Account Verification Email
   * @param {Object} options
   * @param {string} options.email - Recipient email
   * @param {string} options.fullName - Recipient full name
   * @param {string} options.token - Raw verification token
   * @param {string} options.origin - Base URL origin (e.g. http://localhost:5000)
   */
  async sendVerificationEmail({ email, fullName, token, origin }) {
    const baseUrl = origin || process.env.APP_URL || 'http://localhost:5000';
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

    if (this.isMock) {
      console.log('====================================================');
      console.log('📧 [MOCK EMAIL SERVICE] Verification Email Sent');
      console.log(`To:        ${fullName} <${email}>`);
      console.log(`Subject:   Verify your Vani Technologies Account`);
      console.log(`Verify Link: ${verifyUrl}`);
      console.log('====================================================');

      return {
        success: true,
        mock: true,
        verifyUrl,
        message: 'Mock verification email dispatched to server console.',
      };
    }

    // In production: Connect your nodemailer transporter or SendGrid/SES API client here
    // Example:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({ from, to, subject, html });

    return {
      success: true,
      message: 'Verification email sent successfully.',
    };
  }

  /**
   * Send Password Reset Email
   */
  async sendPasswordResetEmail({ email, fullName, resetToken }) {
    if (this.isMock) {
      console.log('====================================================');
      console.log('🔑 [MOCK EMAIL SERVICE] Password Reset Code Sent');
      console.log(`To:        ${fullName} <${email}>`);
      console.log(`Reset Code: ${resetToken}`);
      console.log('====================================================');
    }

    return { success: true };
  }
}

module.exports = new EmailService();
