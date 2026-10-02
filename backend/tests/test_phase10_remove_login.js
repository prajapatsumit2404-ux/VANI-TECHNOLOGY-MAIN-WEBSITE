/**
 * Test Suite: Phase 10 - Remove Login Completely from Public Website Flow
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
  }
}

async function requestGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function runPhase10Tests() {
  console.log('====================================================');
  console.log('  PHASE 10: VERIFY ZERO LOGIN ON PUBLIC FLOW        ');
  console.log('====================================================\n');

  const indexPath = path.join(__dirname, '../../frontend/index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');

  const contactPath = path.join(__dirname, '../../frontend/contact.html');
  const contactHtml = fs.readFileSync(contactPath, 'utf-8');

  const authJsPath = path.join(__dirname, '../../frontend/js/auth.js');
  const authJs = fs.readFileSync(authJsPath, 'utf-8');

  // Test 1: Verify Desktop Navbar in index.html has no Login button
  console.log('1. Checking Desktop Navbar in index.html...');
  const desktopNavMatch = indexHtml.match(/<!-- Desktop Action Buttons -->([\s\S]*?)<\/div>/);
  assert(desktopNavMatch && !desktopNavMatch[1].includes('login.html'), 'Desktop Action Buttons do NOT contain login.html link');
  assert(desktopNavMatch && !desktopNavMatch[1].includes('>Login<'), 'Desktop Action Buttons do NOT contain "Login" text');
  assert(desktopNavMatch && !desktopNavMatch[1].includes('Sign In'), 'Desktop Action Buttons do NOT contain "Sign In" text');

  // Test 2: Verify Mobile Navigation Drawer in index.html has no Login button
  console.log('\n2. Checking Mobile Navigation Drawer in index.html...');
  const mobileNavMatch = indexHtml.match(/<!-- Mobile Slide-out Navigation Drawer -->([\s\S]*?)<\/header>/);
  assert(mobileNavMatch && !mobileNavMatch[1].includes('login.html'), 'Mobile Drawer does NOT contain login.html link');
  assert(mobileNavMatch && !mobileNavMatch[1].includes('>Login<') && !mobileNavMatch[1].includes(' Login'), 'Mobile Drawer does NOT contain "Login" label');

  // Test 3: Verify contact.html Navbar has no Login button
  console.log('\n3. Checking contact.html Navbar...');
  assert(!contactHtml.includes('href="login.html"'), 'contact.html contains NO links to login.html');
  assert(!contactHtml.includes('>Login<'), 'contact.html contains NO "Login" button text');

  // Test 4: Verify auth.js does not inject Login button for unauthenticated visitors
  console.log('\n4. Checking auth.js Navbar logic and redirects...');
  assert(authJs.includes("authBtn.style.display = 'none'") || authJs.includes('authBtn.style.display = "none"'), 'auth.js hides authBtn if user is not authenticated');
  assert(!authJs.includes("authBtn.href = 'login.html'"), 'auth.js does NOT set authBtn.href to login.html');
  assert(authJs.includes("window.location.href = 'index.html'"), 'auth.js logout redirects safely to index.html');

  // Test 5: Verify public HTTP routes load directly without auth redirects or guards
  console.log('\n5. Checking HTTP access without authentication...');
  try {
    const homeRes = await requestGet('http://127.0.0.1:5000/');
    assert(homeRes.status === 200, 'Homepage http://localhost:5000/ opens with status 200 (No redirect)');
    assert(!homeRes.headers.location, 'No redirect header on homepage');

    const productsRes = await requestGet('http://127.0.0.1:5000/api/products');
    assert(productsRes.status === 200, 'Public products API returns 200 OK without token');
    const productsData = JSON.parse(productsRes.body);
    assert(productsData.success === true && Array.isArray(productsData.products), 'Public products data is accessible without auth');
  } catch (err) {
    assert(false, `HTTP access error: ${err.message}`);
  }

  // Test 6: Verify Backend Authentication endpoints remain fully functional
  console.log('\n6. Checking Backend Auth System integrity...');
  try {
    const postData = JSON.stringify({ email: 'nonexistent_test_probe@example.com', password: 'Password@123' });
    const authRes = await new Promise((resolve, reject) => {
      const req = http.request('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
    // 401 Unauthorized expected for invalid credentials, showing the endpoint is responsive and working
    assert(authRes.status === 401 || authRes.status === 400, 'Backend /api/auth/login route is responsive and intact');
  } catch (err) {
    assert(false, `Backend auth endpoint error: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log(`Results: ${passedTests}/${totalTests} Passed`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    console.log('🎉 PHASE 10 VERIFICATION PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME PHASE 10 VERIFICATION CHECKS FAILED.\n');
    process.exit(1);
  }
}

runPhase10Tests().catch(err => {
  console.error('Fatal error in tests:', err);
  process.exit(1);
});
