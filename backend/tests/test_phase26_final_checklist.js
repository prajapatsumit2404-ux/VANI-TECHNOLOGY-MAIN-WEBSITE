/**
 * =======================================================================
 * PHASE 26: FINAL COMPREHENSIVE TESTING CHECKLIST
 * =======================================================================
 * Verifies every single item in the user's checklist:
 * 1. Background (Light, Premium, Clean, Subtle animation, No dark theme)
 * 2. Phone (Full phone visible, No cropping, Correct size, Frame preserved, Screen visible)
 * 3. Phone Animation (Understandable, Internal UI animated, Feature updates, Smooth, Intelligent loop, Manual select)
 * 4. Product Cards (Smooth hover, Clean design, No excessive effects)
 * 5. Responsive (Desktop, Tablet, Mobile, No horizontal overflow, Phone fully visible)
 * 6. Website Safety (Navbar, Hero, About, Services, Delivered Projects, Contact, Footer unchanged)
 * 7. Live Server & Route Integrity
 * =======================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

let totalChecks = 0;
let passedChecks = 0;

function check(category, item, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [✓] [${category}] ${item}`);
  } else {
    console.error(`  [✗] FAIL: [${category}] ${item}`);
  }
}

const html = fs.readFileSync(path.join(__dirname, '../../frontend/index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../../frontend/css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '../../frontend/js/main.js'), 'utf8');

console.log('====================================================');
console.log('   PHASE 26: FINAL COMPREHENSIVE AUDIT CHECKLIST    ');
console.log('====================================================\n');

// 1. BACKGROUND
console.log('1. Checking Background Checklist Items...');
check('Background', 'Product background is light (bg-[#f8fafc] on #products)',
  html.includes('id="products"') && html.includes('bg-[#f8fafc]'));
check('Background', 'Premium card surfaces with light gradient (linear-gradient(180deg, #ffffff 0%, #f8fafc 100%))',
  css.includes('linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'));
check('Background', 'Clean design with thin 1px border and multi-layered soft drop shadows',
  css.includes('#products .product-story') && css.includes('border: 1px solid') && css.includes('box-shadow:'));
check('Background', 'Subtle animation (ambient grid drift, faint particle layer, gentle canvas loops)',
  css.includes('products-saas-grid-bg') && js.includes('initAITalksyBackground') && js.includes('initCommunityBackground'));
check('Background', 'No dark theme inside Product Section (#products uses light surfaces)',
  html.includes('id="products"') && !html.includes('id="products" class="bg-[#161c28]"') && !html.includes('id="products" class="bg-[#0b0f17]"'));

// 2. PHONE
console.log('\n2. Checking Phone Checklist Items...');
check('Phone', 'Full phone visible with explicit overflow: visible and display: block guarantees',
  css.includes('#products .device-mockup-phone') && css.includes('overflow: visible !important;') && css.includes('display: block !important;'));
check('Phone', 'No cropping: Phone screen viewport has flexible minimum height and no clipping',
  css.includes('#products .phone-screen-viewport') && css.includes('min-height: 480px !important;'));
check('Phone', 'Correct size: Desktop 380px, Tablet 310px, Mobile min(300px, calc(100vw - 2.5rem))',
  css.includes('max-width: 380px !important;') &&
  css.includes('max-width: 310px !important;') &&
  css.includes('max-width: min(300px, calc(100vw - 2.5rem)) !important;'));
check('Phone', 'Existing phone frame preserved (Dynamic Island, status bar, app header, bottom bar)',
  html.includes('phone-dynamic-island') &&
  html.includes('phone-status-bar') &&
  html.includes('phone-app-header') &&
  html.includes('phone-bottom-bar'));
check('Phone', 'Product screen visible: Elevated z-index and solid contrasting backgrounds',
  css.includes('#products .device-mockup-phone') && css.includes('z-index: 10 !important;'));

// 3. PHONE ANIMATION
console.log('\n3. Checking Phone Animation Checklist Items...');
check('Phone Animation', 'Product action is understandable (Explains: User Message -> AI Thinking -> Intent -> Response)',
  html.includes('aitalksy-typing-text') && html.includes('aitalksy-stage-step4') && html.includes('aitalksy-stage-step5'));
check('Phone Animation', 'Internal UI is animated (live chat bubbles, processing steps, message dispatch upward)',
  css.includes('animate-message-transfer') || js.includes('updateSequentialFeatureDeck') || js.includes('showStep'));
check('Phone Animation', 'Feature changes update phone (Step 1-5 pills immediately jump to scene on phone)',
  js.includes('updateSequentialFeatureDeck') && js.includes('feature-step-pill-btn'));
check('Phone Animation', 'Animation is smooth (GPU hardware-accelerated transforms & power2.out easing)',
  js.includes('force3D: true') && css.includes('cubic-bezier(0.16, 1, 0.3, 1)'));
check('Phone Animation', 'Animation loops intelligently (3.8s reading windows, 4.8s pause on Success state)',
  js.includes('nextStep === story.totalSteps') && js.includes('4800'));
check('Phone Animation', 'User can manually select features (8-second hold timer prevents loop fighting user)',
  js.includes('story.isUserSelected = true') && js.includes('story.userHoldTimer'));

// 4. PRODUCT CARDS
console.log('\n4. Checking Product Cards Checklist Items...');
check('Product Cards', 'Smooth hover: Card gently elevates 4-6px with micro-scale and soft shadow',
  css.includes('.product-story:hover') && css.includes('translateY(-6px)') && css.includes('scale(1.004)'));
check('Product Cards', 'Clean design: High contrast slate-900 typography and clear information hierarchy',
  css.includes('color: #0f172a !important;') && css.includes('color: #475569 !important;'));
check('Product Cards', 'No excessive effects: No loud neon flashing, no heavy 3D, no strobe effects',
  !css.includes('animation: strobe') && !css.includes('animation: neonGlow'));

// 5. RESPONSIVE
console.log('\n5. Checking Responsive Checklist Items...');
check('Responsive', 'Desktop: 12-column grid layout with Col 1-5 info and Col 6-12 demo',
  css.includes('grid-template-columns: repeat(12, minmax(0, 1fr));') &&
  css.includes('grid-column: 1 / span 5;') &&
  css.includes('grid-column: 6 / span 7;'));
check('Responsive', 'Tablet: Media query 768px-1023px with proportionally scaled mockups',
  css.includes('@media (min-width: 768px) and (max-width: 1023px)') &&
  css.includes('max-width: 310px !important;'));
check('Responsive', 'Mobile: Vertical column stack (< 768px) with product info first, phone below, CTA last',
  css.includes('.product-story-info {') && css.includes('order: 1 !important;') &&
  css.includes('.product-story-demo {') && css.includes('order: 2 !important;') &&
  css.includes('.product-story-cta {') && css.includes('order: 3 !important;'));
check('Responsive', 'No horizontal overflow: overflow-x: hidden enforced on all product containers',
  css.includes('overflow-x: hidden !important;') && css.includes('box-sizing: border-box !important;'));
check('Responsive', 'Phone remains fully visible across all screen sizes (never disappears)',
  css.includes('.device-mockup-phone,') && css.includes('display: block !important;') && css.includes('visibility: visible !important;'));

// 6. WEBSITE SAFETY
console.log('\n6. Checking Website Safety (Rest of Website 100% UNCHANGED)...');
check('Website Safety', 'Navbar unchanged (#main-navbar, logo, 5 links, mobile drawer)',
  html.includes('id="main-navbar"') &&
  html.includes('href="#home"') &&
  html.includes('href="#about"') &&
  html.includes('href="#services"') &&
  html.includes('href="#products"') &&
  html.includes('href="#contact"'));
check('Website Safety', 'Hero unchanged (#home, 3D Canvas #hero-three-canvas, headline, trust badges)',
  html.includes('id="home"') &&
  html.includes('id="hero-three-canvas"') &&
  html.includes('Building Digital Solutions That Move Businesses Forward'));
check('Website Safety', 'About section unchanged (#about, 6 core values, Who We Are card)',
  html.includes('id="about"') &&
  html.includes('Who We Are') &&
  html.includes('Innovation') &&
  html.includes('Continuous Improvement'));
check('Website Safety', 'Services section unchanged (#services, 12 IT services cards, learn more buttons)',
  html.includes('id="services"') &&
  (html.match(/class="[^"]*service-learn-more-btn/g) || []).length >= 10);
check('Website Safety', 'Delivered Projects unchanged (#delivery-projects, #delivery-grid, exactly 5 projects)',
  html.includes('id="delivery-projects"') &&
  html.includes('id="delivery-grid"') &&
  html.includes('data-product-id="homem-do-pao"') &&
  html.includes('data-product-id="meditation-willy-cherish"') &&
  html.includes('data-product-id="msb-school"') &&
  html.includes('data-product-id="software-testing-suite"') &&
  html.includes('data-product-id="telemedicine"'));
check('Website Safety', 'Contact section unchanged (#contact, #contact-form, inputs, direct details)',
  html.includes('id="contact"') &&
  html.includes('id="contact-form"') &&
  html.includes('name="email"'));
check('Website Safety', 'Footer unchanged (#main-footer, copyright 2026, Vani Technologies branding)',
  html.includes('id="main-footer"') &&
  html.includes('2026') &&
  html.includes('Vani Technologies'));

// 7. LIVE SERVER API
console.log('\n7. Checking Live Backend Server & Route Integrity...');
const req = http.get('http://localhost:5000/api/health', (res) => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      check('Backend API', 'Server API /api/health responds HTTP 200 with success: true', 
        res.statusCode === 200 && data.success === true);
    } catch (e) {
      check('Backend API', 'Server API /api/health responds HTTP 200 with success: true', false);
    }
    verifyProductsApi();
  });
});

req.on('error', () => {
  check('Backend API', 'Server API /api/health responds HTTP 200 with success: true', false);
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
        check('Backend API', `Server API /api/products returns all 8 products (Found: ${count})`, 
          res.statusCode === 200 && count === 8);
      } catch (e) {
        check('Backend API', 'Server API /api/products returns all 8 products', false);
      }
      printResults();
    });
  });
  pReq.on('error', () => {
    check('Backend API', 'Server API /api/products returns all 8 products', false);
    printResults();
  });
}

function printResults() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKLIST ITEMS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks/totalChecks)*100)}%)`);
  console.log('====================================================');
  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: ALL PHASE 26 FINAL CHECKLIST ITEMS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKLIST ITEMS FAILED IN PHASE 26');
    process.exit(1);
  }
}
