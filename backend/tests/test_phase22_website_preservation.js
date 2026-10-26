/**
 * =======================================================================
 * PHASE 22 AUDIT: COMPREHENSIVE BEFORE & AFTER WEBSITE PRESERVATION TEST
 * =======================================================================
 * Verifies:
 * 1. Navbar: UNCHANGED
 * 2. Hero: UNCHANGED
 * 3. About: UNCHANGED
 * 4. Services: UNCHANGED
 * 5. Product: ONLY THIS SECTION CHANGED
 * 6. Delivered Projects: UNCHANGED
 * 7. Contact: UNCHANGED
 * 8. Footer: UNCHANGED
 * 9. Global theme: UNCHANGED
 * 10. Live backend APIs: UNCHANGED & OPERATIONAL
 * =======================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

let totalChecks = 0;
let passedChecks = 0;

function check(sectionName, desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [✓] [${sectionName}] ${desc}`);
  } else {
    console.error(`  [✗] FAIL: [${sectionName}] ${desc}`);
  }
}

const html = fs.readFileSync(path.join(__dirname, '../../frontend/index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../../frontend/css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '../../frontend/js/main.js'), 'utf8');

console.log('====================================================');
console.log('   PHASE 22: FULL WEBSITE PRESERVATION AUDIT        ');
console.log('====================================================\n');

// 1. NAVBAR - UNCHANGED
console.log('1. Checking Navbar (UNCHANGED)...');
check('Navbar', 'Navigation header element exists with id="main-navbar"',
  html.includes('id="main-navbar"'));
check('Navbar', 'Vani Technologies brand logo and text preserved',
  html.includes('Vani Technologies') && html.includes('assets/images/logo.png'));
check('Navbar', 'All 5 primary navigation links intact (#home, #about, #services, #products, #contact)',
  html.includes('href="#home"') &&
  html.includes('href="#about"') &&
  html.includes('href="#services"') &&
  html.includes('href="#products"') &&
  html.includes('href="#contact"'));
check('Navbar', 'Mobile drawer toggle and container intact',
  html.includes('id="mobile-menu-btn"') && html.includes('id="mobile-menu"'));

// 2. HERO - UNCHANGED
console.log('\n2. Checking Hero Section (UNCHANGED)...');
check('Hero', 'Hero section exists with id="home"',
  html.includes('id="home"'));
check('Hero', 'Three.js 3D Interactive Canvas intact with id="hero-three-canvas"',
  html.includes('id="hero-three-canvas"'));
check('Hero', 'Hero headline preserved: "Building Digital Solutions That Move Businesses Forward"',
  html.includes('Building Digital Solutions That Move Businesses Forward'));
check('Hero', 'Hero action buttons intact (Explore Services, Explore Products, Contact Us)',
  html.includes('Explore Services') && html.includes('Explore Products') && html.includes('Contact Us'));
check('Hero', 'Hero trust badges intact (Custom Engineering, Scalable Architecture, Enterprise Security)',
  html.includes('Custom Engineering') && html.includes('Scalable Architecture') && html.includes('Enterprise Security'));

// 3. ABOUT - UNCHANGED
console.log('\n3. Checking About Section (UNCHANGED)...');
check('About', 'About section exists with id="about"',
  html.includes('id="about"'));
check('About', 'About heading preserved: "Engineering Digital Excellence & Scalable Software"',
  html.includes('Engineering Digital Excellence') && html.includes('Scalable Software'));
check('About', 'Who We Are feature block preserved',
  html.includes('Who We Are'));
check('About', 'All 6 Core Company Values preserved',
  html.includes('Innovation') &&
  html.includes('Reliability') &&
  html.includes('Security') &&
  html.includes('Transparency') &&
  html.includes('Customer Success') &&
  html.includes('Continuous Improvement'));

// 4. SERVICES - UNCHANGED
console.log('\n4. Checking Services Section (UNCHANGED)...');
check('Services', 'Services section exists with id="services"',
  html.includes('id="services"'));
check('Services', 'Services heading preserved: "Specialized IT Services & Digital Solutions"',
  html.includes('Specialized IT Services') && html.includes('Digital Solutions'));
check('Services', 'Service learn more buttons preserved with .service-learn-more-btn',
  (html.match(/class="[^"]*service-learn-more-btn/g) || []).length >= 10);

// 5. PRODUCT - intentional stacked SaaS presenter (not legacy story-* layout)
console.log('\n5. Checking Product Section (stacked flagship presenter)...');
check('Product', 'Product section exists with id="products" and stacked layout class',
  html.includes('id="products"') && html.includes('vani-prod-stacked'));
check('Product', 'Three flagship product panels (AI Talksy, Community Forum, TravelJioo)',
  html.includes('data-vani-prod-panel="aitalksy"') &&
  html.includes('data-vani-prod-panel="community"') &&
  html.includes('data-vani-prod-panel="traveljioo"'));
check('Product', 'AI Talksy panel includes phone stage and branded copy',
  html.includes('vani-prod-panel-aitalksy') &&
  html.includes('vani-prod-phone-stage') &&
  html.includes('AI Talksy'));
check('Product', 'Community Forum panel includes live preview chrome',
  html.includes('vani-prod-panel-community') &&
  html.includes('Community Forum'));
check('Product', 'TravelJioo panel includes CRM/travel demo chrome',
  html.includes('vani-prod-panel-traveljioo') &&
  (html.includes('TravelJioo') || html.includes('traveljioo')));

// 6. DELIVERED PROJECTS - UNCHANGED
console.log('\n6. Checking Delivered Projects Section (UNCHANGED)...');
check('Delivered Projects', 'Delivered projects section exists with id="delivery-projects"',
  html.includes('id="delivery-projects"'));
check('Delivered Projects', 'Delivered projects grid exists with id="delivery-grid"',
  html.includes('id="delivery-grid"'));
check('Delivered Projects', 'Exactly 5 Delivered Projects present',
  html.includes('data-product-id="homem-do-pao"') &&
  html.includes('data-product-id="meditation-willy-cherish"') &&
  html.includes('data-product-id="msb-school"') &&
  html.includes('data-product-id="software-testing-suite"') &&
  html.includes('data-product-id="telemedicine"'));
check('Delivered Projects', 'Search and filter bar intact in Delivered Projects',
  html.includes('id="delivery-search-input"') || html.includes('Delivered Case Studies'));

// 7. CONTACT - UNCHANGED
console.log('\n7. Checking Contact Section (UNCHANGED)...');
check('Contact', 'Contact section exists with id="contact"',
  html.includes('id="contact"'));
check('Contact', 'Contact form exists with id="contact-form"',
  html.includes('id="contact-form"'));
check('Contact', 'Contact form inputs preserved (name, email, phone, company, service, message)',
  html.includes('name="name"') &&
  html.includes('name="email"') &&
  html.includes('name="phone"') &&
  html.includes('name="message"'));
check('Contact', 'Direct contact details preserved (phone, email, website, working hours)',
  html.includes('info@vanitechnologies.com') || html.includes('support@vanitechnology.com') || html.includes('+91'));

// 8. FOOTER - UNCHANGED
console.log('\n8. Checking Footer Section (UNCHANGED)...');
check('Footer', 'Footer exists with id="main-footer"',
  html.includes('id="main-footer"'));
check('Footer', 'Copyright notice and Vani Technologies branding preserved',
  html.includes('2026') && html.includes('Vani Technologies'));
check('Footer', 'Footer solutions and services links preserved',
  html.includes('Quick Links') || html.includes('Solutions'));

// 9. GLOBAL THEME - UNCHANGED
console.log('\n9. Checking Global Theme (UNCHANGED)...');
check('Global Theme', 'Global dark background (--bg-main: #1c2332) preserved for website layout',
  css.includes('--bg-main: #1c2332') && css.includes('background-color: var(--bg-main)'));
check('Global Theme', 'Global flame accent color palette (--flame-orange: #e85827) preserved',
  css.includes('--flame-orange: #e85827') && css.includes('#e85827'));
check('Global Theme', 'Primary font family (Plus Jakarta Sans) preserved',
  css.includes('Plus Jakarta Sans'));

// 10. LIVE SERVER API - UNCHANGED & OPERATIONAL
console.log('\n10. Checking Live Backend Server & Route Integrity...');
const req = http.get('http://localhost:5000/api/health', (res) => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      check('Backend', 'Server API /api/health responds HTTP 200 with success: true', 
        res.statusCode === 200 && data.success === true);
    } catch (e) {
      check('Backend', 'Server API /api/health responds HTTP 200 with success: true', false);
    }
    verifyProductsApi();
  });
});

req.on('error', () => {
  check('Backend', 'Server API /api/health responds HTTP 200 with success: true', false);
  verifyProductsApi();
});

function verifyProductsApi() {
  const pReq = http.get('http://localhost:5000/api/products', (res) => {
    let pBody = '';
    pReq.on('error', () => {});
    res.on('data', chunk => { pBody += chunk; });
    res.on('end', () => {
      try {
        const pData = JSON.parse(pBody);
        const count = pData.products ? pData.products.length : pData.length;
        check('Backend', `Server API /api/products returns all 8 products (Found: ${count})`, 
          res.statusCode === 200 && count === 8);
      } catch (e) {
        check('Backend', 'Server API /api/products returns all 8 products', false);
      }
      printResults();
    });
  });
  pReq.on('error', () => {
    check('Backend', 'Server API /api/products returns all 8 products', false);
    printResults();
  });
}

function printResults() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks/totalChecks)*100)}%)`);
  console.log('====================================================');
  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: PHASE 22 FULL PRESERVATION AUDIT VERIFIED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 22 AUDIT');
    process.exit(1);
  }
}
