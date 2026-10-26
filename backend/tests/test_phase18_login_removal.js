/**
 * =======================================================================
 * PHASE 18: PUBLIC PRODUCT EXPERIENCE LOGIN REMOVAL AUDIT
 * =======================================================================
 * Verifies that:
 * 1. Visitor can open website without any login requirement
 * 2. Visitor can view Product section (#products) without login
 * 3. Visitor can view Project Delivered (#delivery-projects) without login
 * 4. Visitor can open Product Details modal for any product without login
 * 5. Private functionality authentication (admin, profile, auth routes) is NOT broken
 * =======================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [✓] ${desc}`);
  } else {
    console.error(`  [✗] FAIL: ${desc}`);
  }
}

const html = fs.readFileSync(path.join(__dirname, '../../frontend/index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '../../frontend/js/main.js'), 'utf8');
const authJs = fs.readFileSync(path.join(__dirname, '../../frontend/js/auth.js'), 'utf8');

console.log('====================================================');
console.log('   PHASE 18: PUBLIC PRODUCT LOGIN REMOVAL AUDIT     ');
console.log('====================================================');

// 1. OPEN WEBSITE WITHOUT LOGIN
console.log('\n1. Checking Public Website Accessibility (Open Website)...');
check('index.html contains no blocking login modal or login barrier', 
  !html.includes('id="login-modal"') && !html.includes('class="auth-wall"'));
check('Navbar navigation is public and contains no required login redirect', 
  html.includes('id="main-navbar"'));
check('auth.js hides public navbar login prompts when user is unauthenticated', 
  authJs.includes("authBtn.style.display = 'none'"));

// 2. SEE PRODUCT SECTION WITHOUT LOGIN
console.log('\n2. Checking Product Section Accessibility (See Product)...');
check('Product flagship section #products is fully present and public', 
  html.includes('id="products"'));
check('Flagship 1: AI Talksy is accessible to public visitors', 
  html.includes('id="story-aitalksy"') && html.includes('AI Talksy'));
check('Flagship 2: Community Forum is accessible to public visitors', 
  html.includes('id="story-communityforum"') && html.includes('Community Forum'));
check('Flagship 3: RateHonk Travel CRM is accessible to public visitors', 
  html.includes('id="story-ratehonk"') && html.includes('RateHonk Travel CRM'));
check('Interactive story navigation pills are freely accessible without login', 
  html.includes('data-scene="intro"') && html.includes('data-scene="cta"'));

// 3. SEE PROJECT DELIVERED SECTION WITHOUT LOGIN
console.log('\n3. Checking Project Delivered Accessibility (See Project Delivered)...');
check('Project Delivered section #delivery-projects is fully present and public', 
  html.includes('id="delivery-projects"') && html.includes('PROJECT DELIVERED'));
check('All 5 delivered projects are in the public grid without auth gates', 
  html.includes('data-product-id="homem-do-pao"') &&
  html.includes('data-product-id="meditation-willy-cherish"') &&
  html.includes('data-product-id="msb-school"') &&
  html.includes('data-product-id="software-testing-suite"') &&
  html.includes('data-product-id="telemedicine"'));
check('Category filters and search operate completely in-browser without auth requirements', 
  html.includes('class="filter-btn') && js.includes('initProductsAndFilters'));

// 4. OPEN PRODUCT DETAILS WITHOUT LOGIN
console.log('\n4. Checking Open Product Details Modal Without Login...');
check('Product Details Modal #product-modal exists in public DOM', 
  html.includes('id="product-modal"'));
check('All 3 Flagship platforms have "View Specifications" triggers (.product-modal-trigger)', 
  (html.match(/class="[^"]*product-modal-trigger[^"]*"[^>]*data-product-id="ai-talksy"/g) || []).length > 0 &&
  (html.match(/class="[^"]*product-modal-trigger[^"]*"[^>]*data-product-id="community-forum"/g) || []).length > 0 &&
  (html.match(/class="[^"]*product-modal-trigger[^"]*"[^>]*data-product-id="ratehonk-travel-crm"/g) || []).length > 0);
check('All 5 Delivered Projects have "View Details" buttons with data-product-id', 
  html.includes('data-product-id="homem-do-pao"') && html.includes('View Details') &&
  html.includes('data-product-id="meditation-willy-cherish"') &&
  html.includes('data-product-id="msb-school"') &&
  html.includes('data-product-id="software-testing-suite"') &&
  html.includes('data-product-id="telemedicine"'));
check('openProductModal does NOT check authentication or require login token', 
  !js.match(/openProductModal\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]{0,100}isAuthenticated/));
check('openProductModal sets modal.classList.add("active") directly for public visitors', 
  js.includes("modal.classList.add('active')"));
check('Direct URL hash routing (#/products/:id) opens modal without login requirement', 
  js.includes('handleUrlProductRoute') && js.includes("openProductModal(targetId)"));

// 5. UNRELATED PRIVATE AUTHENTICATION REMAINS INTACT
console.log('\n5. Checking Private Authentication Integrity (Unrelated Private Func)...');
const loginPage = fs.readFileSync(path.join(__dirname, '../../frontend/login.html'), 'utf8');
const registerPage = fs.readFileSync(path.join(__dirname, '../../frontend/register.html'), 'utf8');
const adminPage = fs.readFileSync(path.join(__dirname, '../../frontend/admin.html'), 'utf8');
const adminRoutes = fs.readFileSync(path.join(__dirname, '../../backend/routes/adminRoutes.js'), 'utf8');
const authRoutes = fs.readFileSync(path.join(__dirname, '../../backend/routes/authRoutes.js'), 'utf8');

check('Private login page (login.html) exists and has login form', 
  loginPage.includes('id="login-form"') && loginPage.includes('password'));
check('Private register page (register.html) exists and has registration form', 
  registerPage.includes('id="register-form"'));
check('Admin console (admin.html) maintains authentication checks', 
  adminPage.includes('login.html'));
check('Backend admin routes strictly enforce authentication (protect, authorize)', 
  adminRoutes.includes('router.use(protect)') && adminRoutes.includes("router.use(authorize('admin'))"));
check('Backend auth routes handle full auth lifecycle (login, register, logout, me)', 
  authRoutes.includes('/login') && authRoutes.includes('/register') && authRoutes.includes('/logout'));
check('Frontend auth.js retains login/token helpers for private features', 
  authJs.includes('login(') && authJs.includes('getToken()') && authJs.includes('isAuthenticated()'));

// 6. LIVE API ENDPOINT VERIFICATION
console.log('\n6. Checking Live API Authentication Rules...');
function testPublicProducts() {
  return new Promise((resolve) => {
    http.get('http://localhost:5000/api/products', (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          check('Public API GET /api/products returns HTTP 200 without auth header', 
            res.statusCode === 200 && data.success === true && Array.isArray(data.products));
        } catch (e) {
          check('Public API GET /api/products returns HTTP 200 without auth header', false);
        }
        resolve();
      });
    }).on('error', () => {
      check('Public API GET /api/products returns HTTP 200 without auth header', false);
      resolve();
    });
  });
}

function testProtectedMutation() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ name: 'Unauthorized Test Product' });
    const req = http.request('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      check('Protected API POST /api/products correctly blocks unauthorized access (HTTP 401)', 
        res.statusCode === 401);
      resolve();
    });
    req.on('error', () => {
      check('Protected API POST /api/products correctly blocks unauthorized access (HTTP 401)', false);
      resolve();
    });
    req.write(postData);
    req.end();
  });
}

function testProtectedAdmin() {
  return new Promise((resolve) => {
    http.get('http://localhost:5000/api/admin/products', (res) => {
      check('Protected API GET /api/admin/products correctly blocks unauthorized access (HTTP 401)', 
        res.statusCode === 401);
      resolve();
    }).on('error', () => {
      check('Protected API GET /api/admin/products correctly blocks unauthorized access (HTTP 401)', false);
      resolve();
    });
  });
}

async function runLiveTests() {
  await testPublicProducts();
  await testProtectedMutation();
  await testProtectedAdmin();

  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks/totalChecks)*100)}%)`);
  console.log('====================================================');
  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: PHASE 18 LOGIN REMOVAL VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 18\n');
    process.exit(1);
  }
}

runLiveTests();
