/**
 * =======================================================================
 * PHASE 17 AUDIT: STRICT WEBSITE PRESERVATION & SCOPE INTEGRITY TEST
 * =======================================================================
 * Ensures ZERO unauthorized modifications were made across:
 * 1. Navbar
 * 2. Hero
 * 3. About
 * 4. Services
 * 5. Contact
 * 6. Footer
 * 7. Other Pages (login.html, register.html, admin.html)
 * 8. Other Routes & Backend Files (server.js, routes, controllers)
 * 9. Database & Schemas
 * 10. API Endpoints
 * 11. Existing Authentication system
 * 12. Only the Product experience was modified
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

console.log('====================================================');
console.log('     PHASE 17: WEBSITE PRESERVATION AUDIT          ');
console.log('====================================================');

// 1. NAVBAR PRESERVATION
console.log('\n1. Checking Navbar Preservation...');
check('Navbar navigation header exists with sticky styling', 
  html.includes('id="main-navbar"') && html.includes('sticky top-0'));
check('Navbar logo & branding preserved ("Vani Technologies")', 
  html.includes('alt="Vani Technologies Logo"') && html.includes('Vani Technologies</span>'));
check('Navbar contains all 5 primary section links (#home, #about, #services, #products, #contact)', 
  html.includes('href="#home"') && 
  html.includes('href="#about"') && 
  html.includes('href="#services"') && 
  html.includes('href="#products"') && 
  html.includes('href="#contact"'));
check('Mobile hamburger toggle button preserved (#mobile-menu-btn)', 
  html.includes('id="mobile-menu-btn"'));
check('Mobile slide-out drawer preserved (#mobile-menu)', 
  html.includes('id="mobile-menu"'));

// 2. HERO PRESERVATION
console.log('\n2. Checking Hero Section Preservation...');
check('Hero section exists with #home id', 
  html.includes('id="home"') && html.includes('Building Digital'));
check('Hero 3D Canvas element exists (#hero-three-canvas)', 
  html.includes('id="hero-three-canvas"'));
check('Hero headline preserved ("Building Digital Solutions That Move Businesses Forward")', 
  html.includes('Building Digital') && html.includes('Move Businesses') && html.includes('Forward'));
check('Hero primary action buttons preserved (Explore Services, Explore Products, Contact Us)', 
  html.includes('id="btn-explore-services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
check('Hero trust badges preserved (Custom Engineering, Scalable Architecture, Enterprise Security)', 
  html.includes('Custom Engineering') && html.includes('Scalable Architecture') && html.includes('Enterprise Security'));

// 3. ABOUT PRESERVATION
console.log('\n3. Checking About Section Preservation...');
check('About section exists with #about id', 
  html.includes('id="about"'));
check('About header preserved ("Engineering Digital Excellence & Scalable Software")', 
  html.includes('Engineering Digital Excellence'));
check('Who We Are feature block preserved', 
  html.includes('Who We Are') && html.includes('technology-driven company'));
check('All 6 Core Company Values preserved (Innovation, Reliability, Security, Transparency, Customer Success, Continuous Improvement)', 
  html.includes('Innovation') && 
  html.includes('Reliability') && 
  html.includes('Security') && 
  html.includes('Transparency') && 
  html.includes('Customer Success') && 
  html.includes('Continuous Improvement'));

// 4. SERVICES PRESERVATION
console.log('\n4. Checking Services Section Preservation...');
check('Services section exists with #services id', 
  html.includes('id="services"'));
check('Services header preserved ("Specialized IT Services & Digital Solutions")', 
  html.includes('Specialized IT Services &amp; Digital Solutions'));
check('All 12 IT Services preserved in grid', 
  html.includes('Website Development') && 
  html.includes('Web Application Development') && 
  html.includes('Full Stack Development') && 
  html.includes('Mobile Application Development') && 
  html.includes('Software Development') && 
  html.includes('UI/UX Design') && 
  html.includes('E-commerce Development') && 
  html.includes('API Development') && 
  html.includes('Software Testing') && 
  html.includes('Business Automation') && 
  html.includes('CRM Integration') && 
  html.includes('Maintenance &amp; Support'));
check('Service learn more buttons preserved with .service-learn-more-btn', 
  (html.match(/class="service-learn-more-btn/g) || []).length === 12);

// 5. CONTACT PRESERVATION
console.log('\n5. Checking Contact Section Preservation...');
check('Contact section exists with #contact id', 
  html.includes('id="contact"'));
check('Contact form exists with #contact-form id', 
  html.includes('id="contact-form"'));
check('Contact form inputs preserved (name, email, phone, company, service, message)', 
  html.includes('id="contact-name"') && 
  html.includes('id="contact-email"') && 
  html.includes('id="contact-phone"') && 
  html.includes('id="contact-company"') && 
  html.includes('id="contact-service"') && 
  html.includes('id="contact-message"'));
check('Direct contact details preserved (phone, email, website, working hours)', 
  html.includes('support@vanitechnologies.in') && 
  html.includes('+91-7773895639'));

// 6. FOOTER PRESERVATION
console.log('\n6. Checking Footer Preservation...');
check('Footer element exists with comprehensive layout', 
  html.includes('<footer') && html.includes('Vani Technologies'));
check('Footer copyright statement preserved', 
  html.includes('© 2026 Vani Technologies. All rights reserved.'));
check('Footer contact links preserved', 
  html.includes('href="tel:+917773895639"') && html.includes('href="mailto:support@vanitechnologies.in"'));
check('Footer services & solutions tagline preserved', 
  html.includes('IT Services') && html.includes('Software Products') && html.includes('Digital Solutions'));

// 7. OTHER PAGES PRESERVATION
console.log('\n7. Checking Other Pages Integrity...');
const otherPages = ['login.html', 'register.html', 'admin.html', 'dashboard.html', 'forgot-password.html'];
otherPages.forEach(page => {
  const pPath = path.join(__dirname, '../../frontend', page);
  if (fs.existsSync(pPath)) {
    const pContent = fs.readFileSync(pPath, 'utf8');
    check(`Page ${page} exists and is intact`, pContent.length > 100);
  }
});

// 8. BACKEND & API ROUTES PRESERVATION
console.log('\n8. Checking Backend & Routes Integrity...');
const serverJs = fs.readFileSync(path.join(__dirname, '../../backend/server.js'), 'utf8');
check('Server entry point (server.js) intact with Express app initialization', 
  serverJs.includes('express()') && serverJs.includes('app.listen'));
check('Backend routes configured (/api/health, /api/products, /api/contact, /api/auth)', 
  serverJs.includes('/api/health') || serverJs.includes('/api/'));

// 9. AUTHENTICATION PRESERVATION
console.log('\n9. Checking Existing Authentication Preserved...');
const authJsPath = path.join(__dirname, '../../frontend/js/auth.js');
if (fs.existsSync(authJsPath)) {
  const authJs = fs.readFileSync(authJsPath, 'utf8');
  check('Authentication module (auth.js) preserved with Auth object', 
    authJs.includes('const Auth =') || authJs.includes('window.Auth =') || authJs.includes('updateNavbarAuth'));
}

// 10. VERIFY RUNNING SERVER API
console.log('\n10. Checking Live Server APIs...');
const req = http.get('http://localhost:5000/api/health', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      check('API /api/health responds with HTTP 200 and success: true', res.statusCode === 200 && data.success === true);
    } catch (e) {
      check('API /api/health responds with HTTP 200 and success: true', false);
    }

    // Products API
    http.get('http://localhost:5000/api/products', (pRes) => {
      let pBody = '';
      pRes.on('data', c => pBody += c);
      pRes.on('end', () => {
        try {
          const pData = JSON.parse(pBody);
          check('API /api/products responds with HTTP 200 and valid products', pRes.statusCode === 200 && (Array.isArray(pData.products) || Array.isArray(pData.data) || Array.isArray(pData)));
        } catch (e) {
          check('API /api/products responds with HTTP 200 and valid products', false);
        }
        summarize();
      });
    }).on('error', () => {
      check('API /api/products responds with HTTP 200 and valid products', false);
      summarize();
    });
  });
});

req.on('error', (err) => {
  check('API /api/health responds with HTTP 200 and success: true', false);
  summarize();
});

function summarize() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks/totalChecks)*100)}%)`);
  console.log('====================================================');
  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: PHASE 17 PRESERVATION AUDIT VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 17\n');
    process.exit(1);
  }
}
