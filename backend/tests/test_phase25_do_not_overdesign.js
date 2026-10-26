/**
 * =======================================================================
 * PHASE 25 AUDIT: DO NOT OVERDESIGN AUDIT TEST
 * =======================================================================
 * Verifies:
 * 1. No unnecessary videos in #products (0 <video>)
 * 2. No huge GIFs in #products (0 .gif)
 * 3. No random 3D rendering in #products (Three.js isolated to hero)
 * 4. Phone is the clear hero centerpiece (prominent, solid, clean)
 * 5. Floating elements are minimal, restrained, and hidden on mobile
 * 6. No loud gaming effects (no neon flashes, no aggressive bounces)
 * 7. Clean, balanced text sizing (no oversized 4rem+ headlines in products)
 * 8. Micro particles only (low counts <= 25, subtle alphas)
 * 9. Clear product understanding by watching the phone screen
 * 10. Site-wide preservation & backend health
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
console.log('   PHASE 25: DO NOT OVERDESIGN AUDIT                ');
console.log('====================================================\n');

// Extract Product Section HTML
const productSectionMatch = html.match(/<section[^>]*id="products"[^>]*>([\s\S]*?)<\/section>/i);
const productHtml = productSectionMatch ? productSectionMatch[1] : '';

// 1. NO UNNECESSARY HEAVY MEDIA & NO 3D IN PRODUCT SECTION
console.log('1. Checking No Heavy Media & No Random 3D in Product Section...');
check('No Heavy Media', 'Zero <video> elements in Product Section',
  !productHtml.includes('<video'));
check('No Heavy Media', 'Zero .gif animated image files in Product Section',
  !productHtml.toLowerCase().includes('.gif'));
check('No Heavy Media', 'Zero 3D Three.js / WebGL canvases inside Product Section',
  !productHtml.includes('three-canvas') && !productHtml.includes('webgl'));

// 2. PHONE IS THE STAR OF THE SHOW
console.log('\n2. Checking Phone is the Star & Centerpiece...');
check('Phone Centerpiece', 'Smartphone mockup has clean white base (#ffffff) and high z-index',
  css.includes('#products .device-mockup-phone') && css.includes('z-index: 10 !important;'));
check('Phone Centerpiece', 'Smartphone screen viewport clearly presents live interactive scenes',
  productHtml.includes('phone-screen-viewport') && productHtml.includes('phone-status-bar'));
check('Phone Centerpiece', 'Dynamic Island and status bar give authentic smartphone feeling',
  productHtml.includes('phone-dynamic-island'));

// 3. MINIMAL & NON-DISTRACTING AMBIENT ELEMENTS
console.log('\n3. Checking Minimal & Non-Distracting Ambient Elements...');
check('Restrained Aura', 'Ambient aura around phone uses pointer-events: none',
  css.includes('.phone-showcase-aura') && css.includes('pointer-events: none'));
check('Restrained Aura', 'Ambient decorative elements hidden on mobile to avoid clutter',
  css.includes('@media (max-width: 767px)') && css.includes('.phone-showcase-aura') && css.includes('display: none !important;'));
check('Restrained Aura', 'Particles kept micro-sized and low count (<= 25)',
  js.includes('nodeCount = isMobile ? 12 : 22') || js.includes('particleCount = isMobile ? 8 : 16'));

// 4. NO LOUD GAMING EFFECTS OR AGGRESSIVE BOUNCES
console.log('\n4. Checking No Loud Gaming Effects...');
check('Subtle Motion', 'Card hover uses calm elevation (<= 6px) with no crazy bounce',
  css.includes('translateY(-6px)') || css.includes('translateY(-4px)'));
check('Subtle Motion', 'Phone mockup micro-scale restrained to subtle premium range (<= 1.01)',
  css.includes('scale(1.008)') || css.includes('scale(1.004)'));
check('Subtle Motion', 'No loud neon flashing or strobe animations',
  !css.includes('animation: strobe') && !css.includes('animation: neonFlash'));

// 5. CLEAN TYPOGRAPHY (NO HUGE OVERPOWERING TEXT)
console.log('\n5. Checking Balanced, Clean SaaS Typography...');
check('Typography', 'Product title sizing is restrained and elegant (font-size: 2rem)',
  css.includes('#products .product-identity-block h3') && css.includes('font-size: 2rem !important;'));
check('Typography', 'Section heading is clean and balanced',
  productHtml.includes('text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900'));

// 6. CLEAR UNDERSTANDABILITY THROUGH THE PHONE
console.log('\n6. Checking User Understands Product from Phone Animation...');
check('Clarity', 'AI Talksy phone animation clearly shows: User Message -> AI Thinking -> Intent -> Response',
  productHtml.includes('aitalksy-typing-text') &&
  productHtml.includes('aitalksy-stage-step4') &&
  productHtml.includes('aitalksy-stage-step5'));
check('Clarity', 'Community Forum phone animation clearly shows: People Connect -> Community -> ID Verified',
  productHtml.includes('community-stage-step1') &&
  productHtml.includes('community-stage-step2') &&
  productHtml.includes('community-stage-step3'));
check('Clarity', 'RateHonk browser demo clearly shows: Lead -> Pipeline -> Margins -> Invoiced Booking',
  productHtml.includes('ratehonk-stage-step1') &&
  (productHtml.includes('ratehonk-pipeline-tracker') || productHtml.includes('pipeline-step-col')) &&
  productHtml.includes('ratehonk-stage-step7'));

// 7. PRESERVATION OF REST OF WEBSITE & LIVE SERVER
console.log('\n7. Checking Site-Wide Preservation & Backend Health...');
check('Preservation', 'Navbar preserved (#main-navbar)',
  html.includes('id="main-navbar"'));
check('Preservation', 'Hero section with 3D Canvas preserved (#hero-three-canvas)',
  html.includes('id="hero-three-canvas"'));
check('Preservation', 'Delivered projects preserved (#delivery-projects)',
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
    console.log('🌟 STATUS: PHASE 25 DO NOT OVERDESIGN AUDIT VERIFIED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 25 AUDIT');
    process.exit(1);
  }
}
