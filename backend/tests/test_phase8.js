const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Contact = require('../models/Contact');

const API_BASE = 'http://127.0.0.1:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'vani_technologies_super_secret_jwt_key_2026';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    data = { raw: await res.text() };
  }
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('====================================================');
  console.log('    PHASE 8: ADMIN DASHBOARD & SECURITY TESTS       ');
  console.log('====================================================\n');

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vani_technologies');

  // Set up mock regular user and admin user
  let normalUser = await User.findOne({ email: 'phase8_user@test.com' });
  if (!normalUser) {
    normalUser = await User.create({
      fullName: 'Standard User',
      email: 'phase8_user@test.com',
      phone: '9777711111',
      password: 'Password123!',
      role: 'user',
    });
  }
  const normalToken = jwt.sign({ id: normalUser._id, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });

  let adminUser = await User.findOne({ email: 'phase8_admin@test.com' });
  if (!adminUser) {
    adminUser = await User.create({
      fullName: 'Lead Admin',
      email: 'phase8_admin@test.com',
      phone: '9777722222',
      password: 'Password123!',
      role: 'admin',
    });
  }
  const adminToken = jwt.sign({ id: adminUser._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

  // 1. Strict Backend Verification Tests (No Token & Regular User)
  console.log('1. Testing Security Protection on Admin APIs...');
  
  // Unauthenticated requests
  const endpointsToTest = [
    '/admin/dashboard',
    '/admin/users',
    '/admin/products',
    '/admin/analytics',
    '/admin/settings',
    '/contact',
  ];

  for (const ep of endpointsToTest) {
    const unauthRes = await request(ep, { method: 'GET' });
    assert(unauthRes.status === 401, `GET ${ep} without token returns 401 Unauthorized`);
  }

  // Regular user (role: 'user') forbidden tests
  for (const ep of endpointsToTest) {
    const forbiddenRes = await request(ep, {
      method: 'GET',
      headers: { Authorization: `Bearer ${normalToken}` },
    });
    assert(forbiddenRes.status === 403, `GET ${ep} with user role returns 403 Forbidden`);
  }

  // 2. Admin Dashboard Overview
  console.log('\n2. Testing Admin Dashboard API (GET /api/admin/dashboard)...');
  const dashRes = await request('/admin/dashboard', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(dashRes.status === 200, 'Admin can access dashboard overview (200 OK)');
  assert(dashRes.data.success === true, 'Dashboard success is true');
  assert(typeof dashRes.data.summary.totalUsers === 'number', 'Summary contains totalUsers');
  assert(typeof dashRes.data.summary.totalProducts === 'number', 'Summary contains totalProducts');
  assert(Array.isArray(dashRes.data.recentUsers), 'Summary contains recentUsers list');
  assert(Array.isArray(dashRes.data.recentContacts), 'Summary contains recentContacts list');

  // 3. Admin User Management
  console.log('\n3. Testing Admin User Management (GET, PATCH, DELETE)...');
  const usersRes = await request('/admin/users', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(usersRes.status === 200, 'Admin can view all users (200 OK)');
  assert(Array.isArray(usersRes.data.users), 'Returns users array');
  assert(usersRes.data.users.length > 0, 'Users array is populated');
  // Check password is excluded
  assert(usersRes.data.users[0].password === undefined, 'Passwords are never exposed in user list');

  // Self demotion and self deletion protection
  const selfDemoteRes = await request(`/admin/users/${adminUser._id}/role`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ role: 'user' }),
  });
  assert(selfDemoteRes.status === 400, 'Admin cannot demote own account (400 Bad Request)');

  const selfDeleteRes = await request(`/admin/users/${adminUser._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(selfDeleteRes.status === 400, 'Admin cannot delete own account (400 Bad Request)');

  // 4. Product Management: CRUD, Featured & Status
  console.log('\n4. Testing Product Management (Create, Edit, Featured, Status, Delete)...');
  
  // Create product
  const newProductData = {
    name: 'Quantum Cloud Engine',
    category: 'AI',
    description: 'High-speed cloud optimization engine powered by machine learning algorithms.',
    features: ['Auto Scaling', 'Multi-Region Mesh', 'Zero-Latency Cache'],
    pricing: 'Enterprise Tier',
    image: 'https://www.vanitechnologies.in/assets/dist/portfolio/Mockup_11.png',
    liveUrl: 'https://example.com/quantum',
    featured: false,
    status: 'draft',
  };

  const createRes = await request('/admin/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify(newProductData),
  });
  assert(createRes.status === 201, 'Admin can create a new product (201 Created)');
  assert(createRes.data.product && createRes.data.product.name === 'Quantum Cloud Engine', 'Created product name matches');
  const productId = createRes.data.product._id;

  // Edit product
  const updateRes = await request(`/admin/products/${productId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      description: 'Updated description for cloud optimization engine.',
      pricing: 'Custom Retainer',
    }),
  });
  assert(updateRes.status === 200, 'Admin can edit product details (200 OK)');
  assert(updateRes.data.product.pricing === 'Custom Retainer', 'Product pricing updated');

  // Mark product featured
  const featuredRes = await request(`/admin/products/${productId}/featured`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ featured: true }),
  });
  assert(featuredRes.status === 200, 'Admin can mark product featured (200 OK)');
  assert(featuredRes.data.product.featured === true, 'Product featured is now true');

  // Change product status
  const statusRes = await request(`/admin/products/${productId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: 'active' }),
  });
  assert(statusRes.status === 200, 'Admin can change product status (200 OK)');
  assert(statusRes.data.product.status === 'active', 'Product status is now active');

  // Delete product
  const deleteRes = await request(`/admin/products/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(deleteRes.status === 200, 'Admin can delete product (200 OK)');

  // Verify deleted from DB
  const verifyDeleted = await Product.findById(productId);
  assert(verifyDeleted === null, 'Product permanently removed from database');

  // 5. Analytics & Diagnostics
  console.log('\n5. Testing Analytics & Diagnostics API...');
  const analyticsRes = await request('/admin/analytics', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(analyticsRes.status === 200, 'Admin can access analytics (200 OK)');
  assert(Array.isArray(analyticsRes.data.analytics.leadsByService), 'Returns leads by service analytics');
  assert(Array.isArray(analyticsRes.data.analytics.productsByCategory), 'Returns products by category analytics');
  assert(typeof analyticsRes.data.analytics.verificationMetrics.emailVerificationRate === 'number', 'Returns verification metrics');
  assert(!!analyticsRes.data.analytics.diagnostics.nodeVersion, 'Returns server diagnostics');

  // 6. Settings API
  console.log('\n6. Testing Settings API...');
  const settingsRes = await request('/admin/settings', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(settingsRes.status === 200, 'Admin can access settings (200 OK)');
  assert(settingsRes.data.settings.supportPhone === '+91-7773895639', 'Settings contains official contact details');

  console.log('\n====================================================');
  console.log(`PHASE 8 TESTS: ${passed} of ${passed + failed} passed (${Math.round((passed / (passed + failed)) * 100)}%)`);
  console.log('====================================================\n');

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
