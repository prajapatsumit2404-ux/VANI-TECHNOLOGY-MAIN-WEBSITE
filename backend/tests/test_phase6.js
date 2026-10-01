const mongoose = require('mongoose');
const User = require('../models/User');

const API_BASE = 'http://127.0.0.1:5000/api/auth';

async function runPhase6Tests() {
  console.log('====================================================');
  console.log('    PHASE 6: EMAIL & OTP VERIFICATION TEST SUITE    ');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
    }
  }

  await mongoose.connect('mongodb://127.0.0.1:27017/vani_technologies');
  await User.deleteMany({ email: /phase6.*@vanitechnologies\.in/ });

  try {
    // -------------------------------------------------------------
    // Test 1: Registration with Email Verification Token Generation
    // -------------------------------------------------------------
    console.log('1. Testing Registration & Verification Token Generation...');
    const regRes = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Devika Patel',
        email: 'phase6.devika@vanitechnologies.in',
        phone: '9898001122',
        password: 'Password@2026',
        confirmPassword: 'Password@2026',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'Registration returns 201 Created');
    assert(regData.user.emailVerified === false, 'emailVerified defaults to false');
    assert(regData.user.phoneVerified === false, 'phoneVerified defaults to false');
    assert(!!regData.emailVerification.mockToken, 'Mock verification token returned in dev mode');
    const rawVerifyToken = regData.emailVerification.mockToken;

    // Check DB to ensure token is HASHED (never plain text)
    const dbUserBefore = await User.findOne({ email: 'phase6.devika@vanitechnologies.in' }).select('+verificationToken +verificationTokenExpiry');
    assert(!!dbUserBefore.verificationToken, 'verificationToken is stored in DB');
    assert(dbUserBefore.verificationToken !== rawVerifyToken, 'Stored verificationToken is SHA-256 HASHED (not plain text)');
    assert(dbUserBefore.verificationToken.length === 64, 'Stored token is valid 64-char SHA-256 hash');
    assert(dbUserBefore.verificationTokenExpiry > new Date(), 'verificationTokenExpiry is in the future (+24h)');

    // -------------------------------------------------------------
    // Test 2: Invalid Email Verification Token
    // -------------------------------------------------------------
    console.log('\n2. Testing Invalid Email Verification Token...');
    const invalidVerifyRes = await fetch(`${API_BASE}/verify-email?token=fake_invalid_token_123`, {
      headers: { Accept: 'application/json' },
    });
    const invalidVerifyData = await invalidVerifyRes.json();
    assert(invalidVerifyRes.status === 400, 'Invalid token returns 400 Bad Request');
    assert(invalidVerifyData.success === false, 'Success is false for invalid token');

    // -------------------------------------------------------------
    // Test 3: Valid Email Verification
    // -------------------------------------------------------------
    console.log('\n3. Testing Valid Email Verification...');
    const validVerifyRes = await fetch(`${API_BASE}/verify-email?token=${rawVerifyToken}`, {
      headers: { Accept: 'application/json' },
    });
    const validVerifyData = await validVerifyRes.json();
    assert(validVerifyRes.status === 200, 'Valid verification returns 200 OK');
    assert(validVerifyData.success === true, 'Success is true');
    assert(validVerifyData.emailVerified === true, 'emailVerified is confirmed true');

    // Check DB to verify token cleared and emailVerified true
    const dbUserAfter = await User.findOne({ email: 'phase6.devika@vanitechnologies.in' }).select('+verificationToken');
    assert(dbUserAfter.emailVerified === true, 'DB user.emailVerified is true');
    assert(dbUserAfter.verificationToken === undefined, 'verificationToken is cleared after verification');

    // -------------------------------------------------------------
    // Test 4: Re-verification with same token fails
    // -------------------------------------------------------------
    console.log('\n4. Testing Re-use of Used Verification Token...');
    const reuseVerifyRes = await fetch(`${API_BASE}/verify-email?token=${rawVerifyToken}`, {
      headers: { Accept: 'application/json' },
    });
    assert(reuseVerifyRes.status === 400, 'Re-using token returns 400 Bad Request');

    // -------------------------------------------------------------
    // Test 5: Phone OTP Generation & Secure Hashing
    // -------------------------------------------------------------
    console.log('\n5. Testing Phone OTP Generation...');
    const sendOtpRes = await fetch(`${API_BASE}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9898001122' }),
    });
    const sendOtpData = await sendOtpRes.json();
    assert(sendOtpRes.status === 200, 'Send OTP returns 200 OK');
    assert(!!sendOtpData.mockOtp, 'Mock OTP generated for development');
    assert(/^\d{6}$/.test(sendOtpData.mockOtp), 'OTP is exactly a 6-digit numeric string');
    const rawOtp = sendOtpData.mockOtp;

    // Check DB to verify OTP is stored HASHED
    const dbOtpUser = await User.findOne({ phone: '9898001122' }).select('+otp +otpExpiry +otpAttempts +otpLastSent');
    assert(!!dbOtpUser.otp, 'OTP hash is stored in DB');
    assert(dbOtpUser.otp !== rawOtp, 'Stored OTP is SHA-256 HASHED (never stored in plain text)');
    assert(dbOtpUser.otp.length === 64, 'OTP hash length is 64 chars (SHA-256)');
    assert(dbOtpUser.otpExpiry > new Date(), 'OTP expiry is set 10 minutes in the future');
    assert(dbOtpUser.otpAttempts === 0, 'Initial otpAttempts counter is 0');

    // -------------------------------------------------------------
    // Test 6: Rate Limiting & Cooldown on Resending OTP
    // -------------------------------------------------------------
    console.log('\n6. Testing OTP Resend Rate Limiting (60s Cooldown)...');
    const resendImmediateRes = await fetch(`${API_BASE}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9898001122' }),
    });
    const resendImmediateData = await resendImmediateRes.json();
    assert(resendImmediateRes.status === 429, 'Immediate resend returns 429 Too Many Requests');
    assert(resendImmediateData.success === false, 'Rate limit response success is false');
    assert(resendImmediateData.message.includes('second'), 'Message warns user of remaining cooldown');

    // -------------------------------------------------------------
    // Test 7: Wrong OTP Attempts & Counter Increment
    // -------------------------------------------------------------
    console.log('\n7. Testing Wrong OTP Attempt...');
    const wrongOtpRes = await fetch(`${API_BASE}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9898001122', otp: '000000' }),
    });
    const wrongOtpData = await wrongOtpRes.json();
    assert(wrongOtpRes.status === 400, 'Wrong OTP returns 400 Bad Request');
    assert(wrongOtpData.remainingAttempts === 4, 'Remaining attempts is 4 after 1 fail');

    // -------------------------------------------------------------
    // Test 8: Maximum OTP Attempts Exceeded (Security Shield)
    // -------------------------------------------------------------
    console.log('\n8. Testing Maximum OTP Attempts Exceeded...');
    // Manually set otpAttempts to 5 in DB to simulate attack
    await User.updateOne({ phone: '9898001122' }, { otpAttempts: 5 });

    const maxAttemptsRes = await fetch(`${API_BASE}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9898001122', otp: rawOtp }),
    });
    const maxAttemptsData = await maxAttemptsRes.json();
    assert(maxAttemptsRes.status === 429, 'Exceeded attempts returns 429 Too Many Requests');
    assert(maxAttemptsData.message.includes('invalidated'), 'Message confirms OTP was invalidated');

    // Verify OTP was cleared in DB
    const dbInvalidatedUser = await User.findOne({ phone: '9898001122' }).select('+otp');
    assert(dbInvalidatedUser.otp === undefined, 'Compromised OTP was wiped from DB');

    // -------------------------------------------------------------
    // Test 9: Request Fresh OTP and Verify Successfully
    // -------------------------------------------------------------
    console.log('\n9. Testing Fresh OTP Generation & Verification...');
    // Reset otpLastSent to bypass cooldown for automated test
    await User.updateOne({ phone: '9898001122' }, { otpLastSent: new Date(Date.now() - 70000) });

    const freshOtpRes = await fetch(`${API_BASE}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9898001122' }),
    });
    const freshOtpData = await freshOtpRes.json();
    assert(freshOtpRes.status === 200, 'Fresh OTP generated with 200 OK');
    const freshRawOtp = freshOtpData.mockOtp;

    // Verify valid fresh OTP
    const verifyFreshRes = await fetch(`${API_BASE}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9898001122', otp: freshRawOtp }),
    });
    const verifyFreshData = await verifyFreshRes.json();
    assert(verifyFreshRes.status === 200, 'Valid OTP returns 200 OK');
    assert(verifyFreshData.phoneVerified === true, 'phoneVerified confirmed true');

    // Check DB to verify phoneVerified and OTP cleanup
    const dbVerifiedUser = await User.findOne({ phone: '9898001122' }).select('+otp');
    assert(dbVerifiedUser.phoneVerified === true, 'DB user.phoneVerified is true');
    assert(dbVerifiedUser.otp === undefined, 'OTP cleared from DB after successful verification');

    // -------------------------------------------------------------
    // Test 10: Verify that secrets are NEVER leaked in API
    // -------------------------------------------------------------
    console.log('\n10. Testing Password & Secret Exclusion from API Responses...');
    const userRes = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'phase6.devika@vanitechnologies.in',
        password: 'Password@2026',
      }),
    });
    const userData = await userRes.json();
    assert(userData.user.password === undefined, 'password is not in user object');
    assert(userData.user.verificationToken === undefined, 'verificationToken is not in user object');
    assert(userData.user.otp === undefined, 'otp is not in user object');
    assert(userData.user.emailVerified === true, 'emailVerified correctly reflected in profile');
    assert(userData.user.phoneVerified === true, 'phoneVerified correctly reflected in profile');

    // Cleanup
    await User.deleteMany({ email: /phase6.*@vanitechnologies\.in/ });
    console.log(`\n====================================================`);
    console.log(`PHASE 6 BACKEND TESTS: ${passed} of ${total} passed (${Math.round((passed/total)*100)}%)`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runPhase6Tests();
