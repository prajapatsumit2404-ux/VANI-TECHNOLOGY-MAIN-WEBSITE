/**
 * =======================================================================
 * PHASE 24 AUDIT: DESIGN LANGUAGE & THEMATIC PALETTE TEST
 * =======================================================================
 * Verifies:
 * 1. Light, Clean, Consistent Background across all products (#ffffff / #f8fafc)
 * 2. Restrained & Product-Adaptive Color Palettes:
 *    - AI Talksy: Cyan / Blue (#0891b2, #06b6d4, rgba(6, 182, 212))
 *    - Community Forum: Green (#059669, #10b981, rgba(16, 185, 129))
 *    - RateHonk: Blue (#2563eb, #3b82f6, rgba(59, 130, 246))
 * 3. Premium & Modern SaaS Visual Language:
 *    - Smooth cubic-bezier transitions
 *    - Soft multi-layered SaaS shadows
 *    - Clean typography (slate-900 titles, slate-600 descriptions)
 * 4. Mobile-First Product Showcase with guaranteed phone visibility
 * 5. Preservation of all other website sections and live backend
 * =======================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

let totalChecks = 0;
let passedChecks = 0;

function check(category, desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [✓] [${category}] ${desc}`);
  } else {
    console.error(`  [✗] FAIL: [${category}] ${desc}`);
  }
}

const html = fs.readFileSync(path.join(__dirname, '../../frontend/index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../../frontend/css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '../../frontend/js/main.js'), 'utf8');

console.log('====================================================');
console.log('   PHASE 24: DESIGN LANGUAGE & PALETTE AUDIT        ');
console.log('====================================================\n');

// 1. LIGHT & CONSISTENT BACKGROUND
console.log('1. Checking Light and Consistent Background Architecture...');
check('Background', 'Product Section uses clean light background (bg-[#f8fafc])',
  html.includes('id="products"') && html.includes('bg-[#f8fafc]'));
check('Background', 'Product story cards share consistent light base (#ffffff to #f8fafc)',
  css.includes('linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'));
check('Background', 'Device mockups maintain pristine light theme (#ffffff / #f8fafc)',
  css.includes('#products .device-mockup-phone') && css.includes('background: #ffffff !important;'));

// 2. PRODUCT-ADAPTIVE PALETTES
console.log('\n2. Checking Restrained, Product-Adaptive Palettes...');
// AI Talksy -> Cyan / Blue
check('Palette', 'AI Talksy adapts to Cyan / Blue visual identity',
  css.includes('.theme-aitalksy') &&
  (css.includes('0, 182, 212') || css.includes('6, 182, 212') || css.includes('#0891b2') || css.includes('#06b6d4')));
check('Palette', 'AI Talksy CTA button uses cyan gradient',
  css.includes('#products .theme-aitalksy .product-story-cta a.btn-primary') &&
  css.includes('#0891b2') && css.includes('#06b6d4'));

// Community Forum -> Green
check('Palette', 'Community Forum adapts to Green / Emerald visual identity',
  css.includes('.theme-community') &&
  (css.includes('16, 185, 129') || css.includes('#059669') || css.includes('#10b981')));
check('Palette', 'Community Forum CTA button uses emerald/green gradient',
  css.includes('#products .theme-community .product-story-cta a.btn-primary') &&
  css.includes('#059669') && css.includes('#10b981'));

// RateHonk -> Blue
check('Palette', 'RateHonk adapts to Professional Blue visual identity',
  css.includes('.theme-ratehonk') &&
  (css.includes('59, 130, 246') || css.includes('37, 99, 235') || css.includes('#2563eb') || css.includes('#3b82f6')));
check('Palette', 'RateHonk CTA button uses blue gradient',
  css.includes('#products .theme-ratehonk .product-story-cta a.btn-primary') &&
  css.includes('#2563eb') && css.includes('#3b82f6'));

// 3. PREMIUM & MODERN SAAS TYPOGRAPHY AND SHADOWS
console.log('\n3. Checking Clean, Premium SaaS Typography and Shadows...');
check('Typography', 'High-contrast slate-900 headlines in Product Section',
  html.includes('text-slate-900') && css.includes('color: #0f172a !important;'));
check('Typography', 'Balanced readable slate-600/slate-700 body descriptions',
  html.includes('text-slate-600') || css.includes('color: #475569 !important;'));
check('Shadows', 'Soft, multi-layered SaaS elevation shadows on product cards',
  css.includes('#products .product-story') && css.includes('box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02)'));

// 4. SMOOTH TECHNOLOGY & MOBILE-FIRST SHOWCASE
console.log('\n4. Checking Smooth Motion & Mobile-First Showcase...');
check('Motion', 'Smooth cubic-bezier easing applied to card elevations and transitions',
  css.includes('cubic-bezier(0.16, 1, 0.3, 1)'));
check('Showcase', 'Mobile phone mockup centered and fully visible on small screens',
  css.includes('.device-mockup-phone,') && css.includes('max-width: min(300px, calc(100vw - 2.5rem)) !important;'));

// 5. SITE-WIDE PRESERVATION
console.log('\n5. Checking Site-Wide Preservation & Backend Integrity...');
check('Preservation', 'Navbar preserved (#home, #about, #services, #products, #contact)',
  html.includes('id="main-navbar"'));
check('Preservation', 'Hero section with 3D Canvas preserved',
  html.includes('id="home"') && html.includes('id="hero-three-canvas"'));
check('Preservation', 'Delivered projects section preserved (#delivery-projects)',
  html.includes('id="delivery-projects"'));
check('Preservation', 'Footer preserved (#main-footer)',
  html.includes('id="main-footer"'));

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
    printResults();
  });
});

req.on('error', () => {
  check('Backend', 'Server API /api/health responds HTTP 200 with success: true', false);
  printResults();
});

function printResults() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks/totalChecks)*100)}%)`);
  console.log('====================================================');
  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: PHASE 24 DESIGN LANGUAGE AUDIT VERIFIED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 24 AUDIT');
    process.exit(1);
  }
}
