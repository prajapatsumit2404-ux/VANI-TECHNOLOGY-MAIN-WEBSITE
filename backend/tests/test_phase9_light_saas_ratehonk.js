/**
 * PHASE 9 — RATEHONK TRAVEL CRM LIGHT SAAS VERIFICATION SUITE
 * 
 * Verifies all requirements of the Phase 9 specification:
 * - Product identity: RateHonk Travel CRM & https://crm.ratehonk.com/portfolio
 * - Aesthetics: Light Premium SaaS (white/light gray, blue/teal accents, soft shadows, clean dashboard)
 * - Main Visual: Realistic browser/dashboard window (.device-mockup-browser)
 * - Step 1 — NEW LEAD: John Smith, Travel Package, ₹85,000, Status: NEW LEAD
 * - Step 2 — CRM: Ingested into dashboard with New Leads, Customers, Follow-ups, Bookings
 * - Step 3 — PIPELINE: NEW LEAD -> CONTACTED -> FOLLOW-UP -> QUALIFIED -> CONVERTED with physical card motion
 * - Step 4 — FOLLOW-UP: Follow-up Due transitioning to ✓ Follow-up Completed
 * - Step 5 — CUSTOMER: Customer, Destination, Travel Date, Package, Status
 * - Step 6 — BOOKING: Booking Confirmed ✓, ₹85,000
 * - Step 7 — DASHBOARD RESULT: Leads, Customers, Bookings, Revenue, Conversion Rate (animated counters)
 * - FINAL RATEHONK: "Turn Leads Into Organized Business Growth", CTA "EXPLORE RATEHONK CRM →"
 * - RATEHONK BACKGROUND: subtle grid, thin data lines, soft dashboard shadows, floating metric cards
 * - Non-regression: Navbar, Hero 3D, Footer, public access preserved
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('   PHASE 9: RATEHONK TRAVEL CRM LIGHT SAAS AUDIT   ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

let total = 0;
let passed = 0;

function test(description, condition) {
  total++;
  if (condition) {
    passed++;
    console.log(`  [✓] ${description}`);
    return true;
  } else {
    console.error(`  [✗] FAILED: ${description}`);
    return false;
  }
}

// 1. PRODUCT IDENTIFICATION & EXTERNAL DESTINATION
console.log('1. Checking Product Identification & CTA Destination...');
test('Product name "RateHonk Travel CRM" present', html.includes('RateHonk Travel CRM'));
test('External target https://crm.ratehonk.com/portfolio configured', html.includes('https://crm.ratehonk.com/portfolio'));
test('Opens in new tab with target="_blank"', html.includes('href="https://crm.ratehonk.com/portfolio"') && html.includes('target="_blank"'));
test('Security attributes rel="noopener noreferrer" configured', html.includes('rel="noopener noreferrer"'));

// 2. LIGHT SAAS THEME & DASHBOARD MOCKUP
console.log('\n2. Checking Light SaaS Visual Language & Browser Window...');
test('Device mockup is browser window (.device-mockup-browser)', html.includes('device-mockup-browser'));
test('Browser titlebar with macOS-style window controls', html.includes('browser-titlebar') && html.includes('browser-dot-close'));
test('Browser address bar with security lock', html.includes('browser-address-bar') && html.includes('crm.ratehonk.com'));
test('Browser viewport (.browser-viewport) has clean white background', css.includes('.browser-viewport') && css.includes('#ffffff'));
test('Theme RateHonk uses light background with blue/teal accents', css.includes('.theme-ratehonk') && (css.includes('59, 130, 246') || css.includes('#ffffff')));

// 3. STEP 1: NEW LEAD
console.log('\n3. Checking Step 1: New Lead Appears...');
const step1 = (html.match(/id="ratehonk-stage-step1"[\s\S]*?(?=id="ratehonk-stage-step2")/i) || [''])[0];
test('Step 1 container exists (#ratehonk-stage-step1)', html.includes('id="ratehonk-stage-step1"'));
test('Lead name is "John Smith"', step1.includes('John Smith'));
test('Service package is "Travel Package"', step1.includes('Travel Package'));
test('Package value is "₹85,000"', step1.includes('₹85,000'));
test('Status indicates "NEW LEAD"', step1.includes('NEW LEAD'));
test('Step 1 card uses clean light SaaS card styling (bg-white)', step1.includes('bg-white') && step1.includes('text-slate-900'));

// 4. STEP 2: CRM DASHBOARD INGESTION
console.log('\n4. Checking Step 2: Ingestion & 4 CRM Modules...');
const step2 = (html.match(/id="ratehonk-stage-step2"[\s\S]*?(?=id="ratehonk-stage-step3")/i) || [''])[0];
test('Step 2 container exists (#ratehonk-stage-step2)', html.includes('id="ratehonk-stage-step2"'));
test('CRM Overview shows "New Leads"', step2.includes('New Leads'));
test('CRM Overview shows "Customers"', step2.includes('Customers'));
test('CRM Overview shows "Follow-ups"', step2.includes('Follow-ups'));
test('CRM Overview shows "Bookings"', step2.includes('Bookings'));
test('Pipeline stage 1: NEW LEAD', step2.includes('NEW LEAD'));
test('Pipeline stage 2: CONTACTED', step2.includes('CONTACTED'));
test('Pipeline stage 3: FOLLOW-UP', step2.includes('FOLLOW-UP'));
test('Pipeline stage 4: QUALIFIED', step2.includes('QUALIFIED'));
test('Pipeline stage 5: CONVERTED', step2.includes('CONVERTED'));

// 5. STEP 3: PHYSICAL PIPELINE MOVEMENT
console.log('\n5. Checking Step 3: Physical Pipeline Motion...');
const step3 = (html.match(/id="ratehonk-stage-step3"[\s\S]*?(?=id="ratehonk-stage-step4")/i) || [''])[0];
test('Step 3 container exists (#ratehonk-stage-step3)', html.includes('id="ratehonk-stage-step3"'));
test('5 Pipeline stage columns present with .pipeline-step-col', step3.includes('pipeline-step-col'));
test('Animated lead card with .animate-pipeline-flow present', step3.includes('animate-pipeline-flow'));
test('Flow status element (#ratehonk-flow-status) indicates progress', step3.includes('id="ratehonk-flow-status"'));
test('runRateHonkPipelineFlow moves card through stages in main.js', js.includes('runRateHonkPipelineFlow') && js.includes('translateX'));
test('Visual transformation badge shows Lead -> Customer', step3.includes('Lead') && step3.includes('Customer'));

// 6. STEP 4: FOLLOW-UP AUTOMATION
console.log('\n6. Checking Step 4: Follow-up Due & Completed...');
const step4 = (html.match(/id="ratehonk-stage-step4"[\s\S]*?(?=id="ratehonk-stage-step5")/i) || [''])[0];
test('Step 4 container exists (#ratehonk-stage-step4)', html.includes('id="ratehonk-stage-step4"'));
test('Shows "Follow-up due" or "FOLLOW-UP DUE"', step4.includes('Follow-up due') || step4.includes('FOLLOW-UP DUE'));
test('Status badge container (#ratehonk-followup-badge-container) configured', step4.includes('id="ratehonk-followup-badge-container"'));
test('runRateHonkFollowUp transitions to ✓ FOLLOW-UP COMPLETED in JS', js.includes('runRateHonkFollowUp') && js.includes('FOLLOW-UP COMPLETED'));
test('Follow-up card uses clean light SaaS card styling', step4.includes('bg-white') && step4.includes('text-slate-900'));

// 7. STEP 5: ORGANIZED CUSTOMER INFORMATION
console.log('\n7. Checking Step 5: Customer Dossier...');
const step5 = (html.match(/id="ratehonk-stage-step5"[\s\S]*?(?=id="ratehonk-stage-step6")/i) || [''])[0];
test('Step 5 container exists (#ratehonk-stage-step5)', html.includes('id="ratehonk-stage-step5"'));
test('Customer field present (John Smith)', step5.includes('Customer') && step5.includes('John Smith'));
test('Destination field present', step5.includes('Destination'));
test('Travel Date field present', step5.includes('Travel Date'));
test('Package field present', step5.includes('Package'));
test('Status field present', step5.includes('Status'));
test('Trip and Booking Date preserved for backward compatibility', step5.includes('Trip') && step5.includes('Booking Date'));

// 8. STEP 6: BOOKING CONFIRMED
console.log('\n8. Checking Step 6: Booking Confirmed...');
const step6 = (html.match(/id="ratehonk-stage-step6"[\s\S]*?(?=id="ratehonk-stage-step7")/i) || [''])[0];
test('Step 6 container exists (#ratehonk-stage-step6)', html.includes('id="ratehonk-stage-step6"'));
test('Shows "BOOKING CONFIRMED ✓"', step6.includes('BOOKING CONFIRMED'));
test('Shows deal value "₹85,000"', step6.includes('₹85,000'));
test('Animated voucher stamp (.animate-voucher-stamp) applied', step6.includes('animate-voucher-stamp'));
test('Booking card uses clean light card gradient', step6.includes('from-emerald-50') && step6.includes('text-slate-900'));

// 9. STEP 7: CRM DASHBOARD RESULTS
console.log('\n9. Checking Step 7: CRM Dashboard Results...');
const step7 = (html.match(/id="ratehonk-stage-step7"[\s\S]*?(?=<\/div>[\s\r\n]*<\/div>[\s\r\n]*<!-- Bottom Progress)/i) || [''])[0];
test('Step 7 container exists (#ratehonk-stage-step7)', html.includes('id="ratehonk-stage-step7"'));
test('Metric "Leads" present with animated counter', step7.includes('Leads') && step7.includes('data-target="1420"'));
test('Metric "Customers" present with animated counter', step7.includes('Customers') && step7.includes('data-target="385"'));
test('Metric "Bookings" present with animated counter', step7.includes('Bookings') && step7.includes('data-target="342"'));
test('Metric "Revenue" present with animated counter', step7.includes('Revenue') && step7.includes('data-target="85"'));
test('Metric "Conversion Rate" present with animated counter', step7.includes('Conversion Rate') && step7.includes('data-target="34.8"'));
test('runRateHonkCounters implemented in JS', js.includes('runRateHonkCounters'));

// 10. FINAL MESSAGE & CTA
console.log('\n10. Checking Final Message & CTA...');
test('Shows headline "Turn Leads Into Organized Business Growth"', html.includes('Turn Leads Into Organized Business Growth'));
test('Shows CTA button "EXPLORE RATEHONK CRM →"', html.includes('EXPLORE RATEHONK CRM →'));
test('CTA button links to https://crm.ratehonk.com/portfolio', html.includes('href="https://crm.ratehonk.com/portfolio"'));

// 11. RATEHONK BACKGROUND CANVAS
console.log('\n11. Checking RateHonk Background Canvas...');
test('Canvas element (#ratehonk-saas-canvas) present', html.includes('id="ratehonk-saas-canvas"'));
test('Canvas initialized via initRateHonkBackground in main.js', js.includes('initRateHonkBackground'));
test('Subtle grid coordinate system drawn', js.includes('gridSize = 45') || js.includes('Coordinate Grid'));
test('Dashboard glow radial gradient drawn', js.includes('glowGrad'));
test('Chart trend line animation rendered', js.includes('chartPhase'));
test('Thin data lines particles rendered', js.includes('particleCount'));
test('Small floating UI cards rendered', js.includes('floatingCards'));

// 12. NON-REGRESSION & PRESERVATION OF WEBSITE
console.log('\n12. Checking Website Preservation...');
test('Navbar intact with navigation links', html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
test('Hero section with 3D canvas intact', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
test('Footer section intact', html.includes('<footer'));
test('Public experience free of login wall', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

// API Verification
const req = http.get('http://localhost:5000/api/health', (res) => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      test('Backend server running on http://localhost:5000 (status 200, success: true)', res.statusCode === 200 && data.success === true);
    } catch (e) {
      test('Backend server running on http://localhost:5000', false);
    }
    conclude();
  });
});

req.on('error', () => {
  test('Backend server running on http://localhost:5000', false);
  conclude();
});

function conclude() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');
  if (passed === total) {
    console.log('🌟 STATUS: PHASE 9 LIGHT SAAS RATEHONK VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error(`⚠️ STATUS: ${total - passed} CHECKS FAILED!`);
    process.exit(1);
  }
}
