/**
 * Phase 10: Complete Testing & Bug-Fixing Pass
 * Comprehensive Automated End-to-End Suite for Vani Technologies
 */
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://127.0.0.1:5000';
const JWT_SECRET = process.env.JWT_SECRET || 'vani_technologies_super_secret_jwt_key_2026';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
  }
}

async function runPhase10Tests() {
  console.log('====================================================');
  console.log('       PHASE 10: COMPLETE TEST & BUG-FIX SUITE       ');
  console.log('====================================================\n');

  // Connect Mongoose for DB assertions
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vani_technologies');

  // ========================================================
  // 1. BACKEND API ENDPOINTS
  // ========================================================
  console.log('1. Testing Backend Core API Endpoints...');

  // 1.1 GET /api/health
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    assert(res.status === 200, 'GET /api/health returns 200 OK');
    assert(data.success === true, 'Health check returns success: true');
    assert(typeof data.timestamp === 'string', 'Health check returns timestamp');
  } catch (err) {
    assert(false, `GET /api/health error: ${err.message}`);
  }

  // 1.2 POST /api/auth/register (New User & Admin)
  const timestamp = Date.now();
  const testUser = {
    fullName: `Test User ${timestamp}`,
    email: `tester_${timestamp}@vanitechnologies.in`,
    phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
    password: 'Password@123',
    confirmPassword: 'Password@123',
  };

  let userToken = '';
  let adminToken = '';
  let createdUserId = '';

  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const data = await res.json();
    assert(res.status === 201, 'POST /api/auth/register returns 201 Created');
    assert(data.success === true, 'Registration returns success: true');
    assert(!!data.token, 'Registration returns JWT token');
    userToken = data.token;
    createdUserId = data.user?._id;
  } catch (err) {
    assert(false, `Registration failed: ${err.message}`);
  }

  // 1.3 Create an Admin User to test Admin Routes
  const adminUser = {
    fullName: `Admin Test ${timestamp}`,
    email: `admin_${timestamp}@vanitechnologies.in`,
    phone: `+9199${Math.floor(10000000 + Math.random() * 90000000)}`,
    password: 'AdminPassword@123',
    confirmPassword: 'AdminPassword@123',
  };

  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminUser),
    });
    const data = await res.json();
    
    // Elevate this test user to admin directly in MongoDB
    const User = require('../models/User');
    await User.findByIdAndUpdate(data.user._id, { role: 'admin' });

    // Login to get fresh admin JWT
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: adminUser.email,
        password: adminUser.password,
      }),
    });
    const loginData = await loginRes.json();
    adminToken = loginData.token;
    assert(loginData.user?.role === 'admin', 'Admin account role elevated successfully');
  } catch (err) {
    assert(false, `Admin creation failed: ${err.message}`);
  }

  // 1.4 POST /api/auth/login
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: testUser.email,
        password: testUser.password,
      }),
    });
    const data = await res.json();
    assert(res.status === 200, 'POST /api/auth/login (by email) returns 200 OK');
    assert(data.success === true, 'Login returns success: true');
    assert(!!data.token, 'Login returns valid token');
  } catch (err) {
    assert(false, `Login by email failed: ${err.message}`);
  }

  // 1.5 Login with phone
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: testUser.phone,
        password: testUser.password,
      }),
    });
    const data = await res.json();
    assert(res.status === 200, 'POST /api/auth/login (by phone) returns 200 OK');
    assert(data.success === true, 'Login by phone returns success: true');
  } catch (err) {
    assert(false, `Login by phone failed: ${err.message}`);
  }

  // 1.6 GET /api/auth/me
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    assert(res.status === 200, 'GET /api/auth/me with valid token returns 200 OK');
    assert(data.user?.email === testUser.email, 'GET /api/auth/me returns matching user');
  } catch (err) {
    assert(false, `GET /api/auth/me failed: ${err.message}`);
  }

  // 1.7 GET /api/products
  let testProductId = '';
  try {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    assert(res.status === 200, 'GET /api/products returns 200 OK');
    assert(data.success === true, 'Public products success is true');
    assert(Array.isArray(data.products), 'Products is an array');
    assert(data.products.length >= 8, `Catalog contains at least 8 seeded products (found: ${data.products.length})`);
  } catch (err) {
    assert(false, `GET /api/products failed: ${err.message}`);
  }

  // 1.8 POST /api/products (Admin Protected)
  try {
    // A. Unauthenticated
    const unauthRes = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Test Tool' }),
    });
    assert(unauthRes.status === 401, 'POST /api/products without token is rejected (401)');

    // B. Normal User (Non-admin)
    const userRes = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ name: 'New Test Tool' }),
    });
    assert(userRes.status === 403, 'POST /api/products by normal user is rejected (403 Forbidden)');

    // C. Admin User
    const adminRes = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: `Automated Tool ${timestamp}`,
        category: 'AI',
        description: 'Comprehensive test automated SaaS tool created during Phase 10 verification pass.',
        pricing: '$49/mo Enterprise',
        features: ['Automated CI', 'Smart Analytics'],
        status: 'active',
      }),
    });
    const adminData = await adminRes.json();
    assert(adminRes.status === 201, 'POST /api/products by Admin creates product (201 Created)');
    assert(adminData.success === true, 'Created product returns success: true');
    testProductId = adminData.product?._id;
  } catch (err) {
    assert(false, `POST /api/products failed: ${err.message}`);
  }

  // 1.9 PUT /api/products/:id
  try {
    const res = await fetch(`${BASE_URL}/api/products/${testProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        pricing: '$79/mo Updated',
        features: ['Automated CI', 'Smart Analytics', 'New Feature Added'],
      }),
    });
    const data = await res.json();
    assert(res.status === 200, 'PUT /api/products/:id updates product (200 OK)');
    assert(data.product?.pricing === '$79/mo Updated', 'Product pricing was updated');
  } catch (err) {
    assert(false, `PUT /api/products/:id failed: ${err.message}`);
  }

  // 1.10 DELETE /api/products/:id
  try {
    const res = await fetch(`${BASE_URL}/api/products/${testProductId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    assert(res.status === 200, 'DELETE /api/products/:id deletes product (200 OK)');
    assert(data.success === true, 'Delete product returns success: true');
  } catch (err) {
    assert(false, `DELETE /api/products/:id failed: ${err.message}`);
  }

  // 1.11 POST /api/contact
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase 10 Tester',
        email: 'tester10@vanitechnologies.in',
        phone: '+917773895639',
        company: 'Vani Technologies QA',
        service: 'Web Application Development',
        message: 'Comprehensive verification inquiry sent during Phase 10 test pass.',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'POST /api/contact returns 201 Created');
    assert(data.success === true, 'Contact submission returns success: true');
  } catch (err) {
    assert(false, `POST /api/contact failed: ${err.message}`);
  }

  // ========================================================
  // 2. AUTHENTICATION & SECURITY EDGE CASES
  // ========================================================
  console.log('\n2. Testing Authentication & Security Edge Cases...');

  // 2.1 Duplicate Email
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Duplicate Email User',
        email: testUser.email,
        phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'Password@123',
        confirmPassword: 'Password@123',
      }),
    });
    assert(res.status === 400, 'Duplicate email registration rejected with 400 Bad Request');
  } catch (err) {
    assert(false, `Duplicate email check failed: ${err.message}`);
  }

  // 2.2 Duplicate Phone
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Duplicate Phone User',
        email: `unique_${Date.now()}@vanitechnologies.in`,
        phone: testUser.phone,
        password: 'Password@123',
        confirmPassword: 'Password@123',
      }),
    });
    assert(res.status === 400, 'Duplicate phone registration rejected with 400 Bad Request');
  } catch (err) {
    assert(false, `Duplicate phone check failed: ${err.message}`);
  }

  // 2.3 Wrong Password
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: testUser.email,
        password: 'WrongPassword999!',
      }),
    });
    assert(res.status === 401, 'Wrong password login rejected with 401 Unauthorized');
  } catch (err) {
    assert(false, `Wrong password check failed: ${err.message}`);
  }

  // 2.4 Missing Token
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`);
    assert(res.status === 401, 'Protected route without token returns 401 Unauthorized');
  } catch (err) {
    assert(false, `Missing token check failed: ${err.message}`);
  }

  // 2.5 Expired Token
  try {
    const expiredToken = jwt.sign(
      { id: createdUserId, role: 'user' },
      JWT_SECRET,
      { expiresIn: '-1s' }
    );
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    assert(res.status === 401, 'Expired JWT token rejected with 401 Unauthorized');
  } catch (err) {
    assert(false, `Expired token check failed: ${err.message}`);
  }

  // 2.6 Invalid / Malformed Token
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: 'Bearer this.is.an.invalid.token' },
    });
    assert(res.status === 401, 'Invalid/tampered token rejected with 401 Unauthorized');
  } catch (err) {
    assert(false, `Invalid token check failed: ${err.message}`);
  }

  // 2.7 Normal User Accessing Admin Routes
  try {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(res.status === 403, 'Normal user accessing admin dashboard rejected with 403 Forbidden');
  } catch (err) {
    assert(false, `Normal user admin block check failed: ${err.message}`);
  }

  // 2.8 Admin User Accessing Admin Routes
  try {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    assert(res.status === 200, 'Admin user accessing admin dashboard authorized with 200 OK');
    assert(data.success === true, 'Admin dashboard returns success: true');
  } catch (err) {
    assert(false, `Admin dashboard check failed: ${err.message}`);
  }

  // ========================================================
  // 3. FRONTEND STATIC PAGES & ACCESSIBILITY
  // ========================================================
  console.log('\n3. Testing Frontend Pages Delivery...');
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Login', path: '/login.html' },
    { name: 'Register', path: '/register.html' },
    { name: 'Forgot Password', path: '/forgot-password.html' },
    { name: 'Profile', path: '/profile.html' },
    { name: 'Admin Dashboard', path: '/admin.html' },
    { name: 'Contact Page', path: '/contact.html' },
    { name: 'Email Verification', path: '/verify-email.html' },
    { name: 'Phone Verification', path: '/verify-phone.html' },
  ];

  for (const page of pages) {
    try {
      const res = await fetch(`${BASE_URL}${page.path}`);
      const text = await res.text();
      assert(res.status === 200, `${page.name} (${page.path}) delivers 200 OK`);
      assert(text.includes('<!DOCTYPE html>'), `${page.name} is valid HTML document`);
      assert(text.includes('viewport'), `${page.name} contains responsive viewport meta tag`);
    } catch (err) {
      assert(false, `Page ${page.name} failed: ${err.message}`);
    }
  }

  // ========================================================
  // 4. RESPONSIVE BREAKPOINT & ACCESSIBILITY AUDIT
  // ========================================================
  console.log('\n4. Testing Responsive Breakpoint & Accessibility Audit...');
  const indexHtml = fs.readFileSync(path.resolve(__dirname, '../../frontend/index.html'), 'utf8');
  const styleCss = fs.readFileSync(path.resolve(__dirname, '../../frontend/css/style.css'), 'utf8');

  // Verify responsive Tailwind breakpoint support
  const breakpoints = ['sm:', 'md:', 'lg:', 'xl:'];
  breakpoints.forEach((bp) => {
    assert(indexHtml.includes(bp), `HTML includes Tailwind responsive breakpoint: ${bp}`);
  });

  // Verify prefers-reduced-motion media query
  assert(
    styleCss.includes('@media (prefers-reduced-motion: reduce)'),
    'CSS includes prefers-reduced-motion media query'
  );

  // Verify :focus-visible accessibility outline
  assert(
    styleCss.includes(':focus-visible'),
    'CSS includes :focus-visible accessible focus rings'
  );

  // Verify modal accessibility attributes
  assert(indexHtml.includes('role="dialog"'), 'Modals include role="dialog" accessibility attribute');
  assert(indexHtml.includes('aria-modal="true"'), 'Modals include aria-modal="true" attribute');

  // Disconnect MongoDB cleanly
  await mongoose.disconnect();

  // Print Summary
  console.log('\n====================================================');
  console.log(`PHASE 10 TEST RESULTS: ${passedTests} of ${totalTests} passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('====================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runPhase10Tests().catch((err) => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
