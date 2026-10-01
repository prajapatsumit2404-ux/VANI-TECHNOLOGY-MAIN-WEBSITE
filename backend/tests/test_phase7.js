const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Contact = require('../models/Contact');
const User = require('../models/User');

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
  console.log('    PHASE 7: CONTACT SYSTEM & ADMIN PROTECTION      ');
  console.log('====================================================\n');

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vani_technologies');

  // Clean up any old test contacts
  await Contact.deleteMany({ email: /@test-contact\.com$/ });

  // Create mock regular user and mock admin user tokens
  let normalUser = await User.findOne({ email: 'normal_contact_tester@test-contact.com' });
  if (!normalUser) {
    normalUser = await User.create({
      fullName: 'Normal User',
      email: 'normal_contact_tester@test-contact.com',
      phone: '9888811111',
      password: 'Password123!',
      role: 'user',
    });
  }
  const normalToken = jwt.sign({ id: normalUser._id, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });

  let adminUser = await User.findOne({ email: 'admin_contact_tester@test-contact.com' });
  if (!adminUser) {
    adminUser = await User.create({
      fullName: 'Admin User',
      email: 'admin_contact_tester@test-contact.com',
      phone: '9888822222',
      password: 'Password123!',
      role: 'admin',
    });
  }
  const adminToken = jwt.sign({ id: adminUser._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

  // 1. Test Valid Contact Submission
  console.log('1. Testing Valid Contact Submission (POST /api/contact)...');
  const validSubmission = {
    name: 'Jane Doe Enterprise',
    email: 'jane@test-contact.com',
    phone: '+91 9876543210',
    company: 'Apex Innovations',
    service: 'Full Stack Development',
    message: 'We are looking to develop a secure enterprise ERP platform for our supply chain.',
  };

  const res1 = await request('/contact', {
    method: 'POST',
    body: JSON.stringify(validSubmission),
  });

  assert(res1.status === 201, 'Status code is 201 Created');
  assert(res1.data.success === true, 'Response success is true');
  assert(res1.data.data && res1.data.data.id, 'Response returns newly created enquiry ID');
  assert(res1.data.data.name === 'Jane Doe Enterprise', 'Enquiry name matches');

  // Verify in MongoDB
  const savedContact = await Contact.findById(res1.data.data.id);
  assert(!!savedContact, 'Enquiry is securely saved in MongoDB');
  assert(savedContact.company === 'Apex Innovations', 'Company saved correctly');
  assert(savedContact.service === 'Full Stack Development', 'Service saved correctly');
  assert(savedContact.status === 'new', 'Initial status is "new"');

  // 2. Testing Field Validations
  console.log('\n2. Testing Form Validations...');
  const testHeaders = { 'x-test-bypass-rate-limit': 'true' };

  // Missing name
  const resBadName = await request('/contact', {
    method: 'POST',
    headers: testHeaders,
    body: JSON.stringify({ ...validSubmission, name: ' ' }),
  });
  assert(resBadName.status === 400, 'Blank name rejected with 400');

  // Invalid email
  const resBadEmail = await request('/contact', {
    method: 'POST',
    headers: testHeaders,
    body: JSON.stringify({ ...validSubmission, email: 'notanemail' }),
  });
  assert(resBadEmail.status === 400, 'Invalid email format rejected with 400');

  // Short phone
  const resBadPhone = await request('/contact', {
    method: 'POST',
    headers: testHeaders,
    body: JSON.stringify({ ...validSubmission, phone: '123' }),
  });
  assert(resBadPhone.status === 400, 'Short phone (< 7 chars) rejected with 400');

  // Missing service
  const resBadService = await request('/contact', {
    method: 'POST',
    headers: testHeaders,
    body: JSON.stringify({ ...validSubmission, service: '' }),
  });
  assert(resBadService.status === 400, 'Missing service rejected with 400');

  // Short message (< 10 chars)
  const resBadMsg = await request('/contact', {
    method: 'POST',
    headers: testHeaders,
    body: JSON.stringify({ ...validSubmission, message: 'Hi' }),
  });
  assert(resBadMsg.status === 400, 'Short message (< 10 chars) rejected with 400');

  // 3. Testing Admin Protection on GET /api/contact
  console.log('\n3. Testing Admin Protection on GET /api/contact...');
  // No token
  const resNoAuth = await request('/contact', { method: 'GET' });
  assert(resNoAuth.status === 401, 'Unauthenticated request rejected with 401 Unauthorized');

  // Regular user token
  const resUserAuth = await request('/contact', {
    method: 'GET',
    headers: { Authorization: `Bearer ${normalToken}` },
  });
  assert(resUserAuth.status === 403, 'Normal user rejected with 403 Forbidden');

  // Admin token
  const resAdminAuth = await request('/contact', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(resAdminAuth.status === 200, 'Admin authorized with 200 OK');
  assert(resAdminAuth.data.success === true, 'Admin query success is true');
  assert(Array.isArray(resAdminAuth.data.contacts), 'Admin receives contacts array');
  assert(resAdminAuth.data.contacts.length >= 1, 'Contacts array includes submitted enquiries');

  // 4. Testing Admin Status Update & Single Item Fetch
  console.log('\n4. Testing Admin Status Update & Single Item Fetch...');
  const contactId = res1.data.data.id;
  const resSingle = await request(`/contact/${contactId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(resSingle.status === 200, 'Admin can fetch single contact details');

  const resStatus = await request(`/contact/${contactId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: 'contacted' }),
  });
  assert(resStatus.status === 200, 'Admin can update enquiry status to "contacted"');
  assert(resStatus.data.contact.status === 'contacted', 'Contact status successfully updated');

  console.log('\n====================================================');
  console.log(`PHASE 7 BACKEND TESTS: ${passed} of ${passed + failed} passed (${Math.round((passed / (passed + failed)) * 100)}%)`);
  console.log('====================================================\n');

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
