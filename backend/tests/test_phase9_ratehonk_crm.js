/**
 * PHASE 9 — RATEHONK TRAVEL CRM TEST SUITE
 * 
 * Tests the complete Product Story Demonstration for RateHonk Travel CRM:
 * 1. Product identity: RateHonk Travel CRM
 * 2. Narrative story: NEW LEAD -> CRM -> CONTACTED -> FOLLOW-UP -> QUALIFIED -> CONVERTED -> BOOKING -> BUSINESS RESULT
 * 3. Browser dashboard UI mockup (.device-mockup-browser)
 * 4. Step 1: Inbound Lead (John Smith, Travel Package, ₹85,000, NEW LEAD)
 * 5. Step 2: CRM Ingestion (5-stage pipeline: NEW LEAD, CONTACTED, FOLLOW-UP, QUALIFIED, CONVERTED)
 * 6. Step 3: Physical card movement through the 5 stages
 * 7. Step 4: Smart Follow-up (FOLLOW-UP DUE -> ✓ FOLLOW-UP COMPLETED)
 * 8. Step 5: Organized Customer details (Customer, Destination, Trip, Booking Date, Status)
 * 9. Step 6: Booking Confirmed (BOOKING CONFIRMED, ₹85,000)
 * 10. Step 7: CRM Growth Dashboard with animated numbers (Leads, Customers, Follow-ups, Bookings, Revenue, Conversion Rate)
 * 11. RateHonk Background (professional gradient, subtle grid, dashboard glow, moving data lines, small floating UI cards, subtle chart animation)
 * 12. Final: Turn Leads Into Organized Business Growth & CTA EXPLORE RATEHONK CRM → (https://crm.ratehonk.com/portfolio in new tab)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const http = require('http');

console.log('====================================================');
console.log('      PHASE 9: RATEHONK TRAVEL CRM AUDIT           ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [✓] ${desc}`);
    return true;
  } else {
    console.error(`  [✗] FAILED: ${desc}`);
    return false;
  }
}

// 1. PRODUCT IDENTIFICATION & WEBSITE
console.log('1. Checking Product Identification & External Link...');
check('Product name "RateHonk Travel CRM" is present', html.includes('RateHonk Travel CRM'));
check('External portfolio link https://crm.ratehonk.com/portfolio is present', html.includes('https://crm.ratehonk.com/portfolio'));
check('External link opens in new tab with target="_blank"', html.includes('href="https://crm.ratehonk.com/portfolio"') && html.includes('target="_blank"'));
check('External link includes rel="noopener noreferrer"', html.includes('rel="noopener noreferrer"'));

// 2. DEVICE MOCKUP (BROWSER DASHBOARD)
console.log('\n2. Checking Browser Dashboard Mockup Structure...');
check('Browser dashboard mockup container (.device-mockup-browser) exists', html.includes('device-mockup-browser'));
check('Browser titlebar (.browser-titlebar) exists with window controls', html.includes('browser-titlebar') && html.includes('browser-dot-close'));
check('Browser address bar points to RateHonk CRM pipeline', html.includes('https://crm.ratehonk.com/app/pipeline'));
check('Browser viewport (.browser-viewport) houses the 7 product story scenes', html.includes('browser-viewport'));

// 3. STEP 1: INBOUND LEAD CARD
console.log('\n3. Checking Step 1: Inbound Lead...');
const step1 = (html.match(/id="ratehonk-stage-step1"[\s\S]*?(?=id="ratehonk-stage-step2")/i) || [''])[0];
check('Step 1 container exists (#ratehonk-stage-step1)', html.includes('id="ratehonk-stage-step1"'));
check('Card shows customer "John Smith"', step1.includes('John Smith'));
check('Card shows "Travel Package"', step1.includes('Travel Package'));
check('Card shows package value "₹85,000"', step1.includes('₹85,000'));
check('Card shows status badge "NEW LEAD"', step1.includes('NEW LEAD'));

// 4. STEP 2: CRM PIPELINE INGESTION
console.log('\n4. Checking Step 2: CRM Ingestion...');
const step2 = (html.match(/id="ratehonk-stage-step2"[\s\S]*?(?=id="ratehonk-stage-step3")/i) || [''])[0];
check('Step 2 container exists (#ratehonk-stage-step2)', html.includes('id="ratehonk-stage-step2"'));
check('Pipeline column 1: NEW LEAD', step2.includes('NEW LEAD'));
check('Pipeline column 2: CONTACTED', step2.includes('CONTACTED'));
check('Pipeline column 3: FOLLOW-UP', step2.includes('FOLLOW-UP'));
check('Pipeline column 4: QUALIFIED', step2.includes('QUALIFIED'));
check('Pipeline column 5: CONVERTED', step2.includes('CONVERTED'));

// 5. STEP 3: PHYSICAL CARD MOVEMENT THROUGH 5 STAGES
console.log('\n5. Checking Step 3: Physical Pipeline Motion...');
const step3 = (html.match(/id="ratehonk-stage-step3"[\s\S]*?(?=id="ratehonk-stage-step4")/i) || [''])[0];
check('Step 3 container exists (#ratehonk-stage-step3)', html.includes('id="ratehonk-stage-step3"'));
check('5-stage pipeline tracker exists with .pipeline-step-col elements', step3.includes('pipeline-step-col'));
check('Moving lead card with .animate-pipeline-flow exists', step3.includes('animate-pipeline-flow'));
check('Lead card explicitly moves through NEW LEAD -> CONTACTED -> FOLLOW-UP -> QUALIFIED -> CONVERTED in JS', 
  js.includes('runRateHonkPipelineFlow') && js.includes('translateX') && js.includes('active-col'));
check('Lead to Customer conversion transformation indicator exists', step3.includes('Lead') && step3.includes('Customer'));

// 6. STEP 4: FOLLOW-UP AUTOMATION (FOLLOW-UP DUE -> ✓ FOLLOW-UP COMPLETED)
console.log('\n6. Checking Step 4: Smart Follow-up Due & Completion...');
const step4 = (html.match(/id="ratehonk-stage-step4"[\s\S]*?(?=id="ratehonk-stage-step5")/i) || [''])[0];
check('Step 4 container exists (#ratehonk-stage-step4)', html.includes('id="ratehonk-stage-step4"'));
check('Shows FOLLOW-UP DUE in status badge', step4.includes('FOLLOW-UP DUE') || step4.includes('Follow-up due'));
check('runRateHonkFollowUp function implemented in JS', js.includes('runRateHonkFollowUp'));
check('Transitions dynamically to ✓ FOLLOW-UP COMPLETED', js.includes('FOLLOW-UP COMPLETED'));

// 7. STEP 5: ORGANIZED CUSTOMER DETAILS
console.log('\n7. Checking Step 5: Organized Customer Dossier...');
const step5 = (html.match(/id="ratehonk-stage-step5"[\s\S]*?(?=id="ratehonk-stage-step6")/i) || [''])[0];
check('Step 5 container exists (#ratehonk-stage-step5)', html.includes('id="ratehonk-stage-step5"'));
check('Customer field present (John Smith)', step5.includes('Customer') && step5.includes('John Smith'));
check('Destination field present', step5.includes('Destination'));
check('Trip field present', step5.includes('Trip'));
check('Booking Date field present', step5.includes('Booking Date'));
check('Status field present', step5.includes('Status'));

// 8. STEP 6: BOOKING CONFIRMED
console.log('\n8. Checking Step 6: Booking Confirmed...');
const step6 = (html.match(/id="ratehonk-stage-step6"[\s\S]*?(?=id="ratehonk-stage-step7")/i) || [''])[0];
check('Step 6 container exists (#ratehonk-stage-step6)', html.includes('id="ratehonk-stage-step6"'));
check('Shows BOOKING CONFIRMED badge', step6.includes('BOOKING CONFIRMED'));
check('Shows confirmed deal amount ₹85,000', step6.includes('₹85,000'));
check('Animated voucher stamp styling applied', step6.includes('animate-voucher-stamp') && css.includes('voucherStampPop'));

// 9. STEP 7: CRM GROWTH DASHBOARD & ANIMATED COUNTERS
console.log('\n9. Checking Step 7: Growth Dashboard & Animated Metrics...');
const step7 = (html.match(/id="ratehonk-stage-step7"[\s\S]*?(?=<\/div>[\s\r\n]*<\/div>[\s\r\n]*<\/div>[\s\r\n]*<!-- Visual Animation)/i) || [''])[0];
check('Step 7 container exists (#ratehonk-stage-step7)', html.includes('id="ratehonk-stage-step7"'));
check('Dashboard shows "Leads" metric', html.includes('Leads') && html.includes('data-target="1420"'));
check('Dashboard shows "Customers" metric', html.includes('Customers') && html.includes('data-target="385"'));
check('Dashboard shows "Follow-ups" metric', html.includes('Follow-ups') && html.includes('data-target="98"'));
check('Dashboard shows "Bookings" metric', html.includes('Bookings') && html.includes('data-target="342"'));
check('Dashboard shows "Revenue" metric', html.includes('Revenue') && html.includes('data-target="85"'));
check('Dashboard shows "Conversion Rate" metric', html.includes('Conversion Rate') && html.includes('data-target="34.8"'));
check('Animated counter class (.ratehonk-counter) and JS runner implemented', html.includes('ratehonk-counter') && js.includes('runRateHonkCounters'));

// 10. RATEHONK BACKGROUND CANVAS
console.log('\n10. Checking RateHonk Professional SaaS Background...');
check('RateHonk SaaS canvas element (#ratehonk-saas-canvas) exists', html.includes('id="ratehonk-saas-canvas"'));
check('Canvas styled with .ratehonk-saas-bg-canvas and .theme-ratehonk-stage', css.includes('.ratehonk-saas-bg-canvas') && css.includes('.theme-ratehonk-stage'));
check('initRateHonkBackground function implemented in JS', js.includes('initRateHonkBackground'));
check('Subtle grid coordinate system rendered', js.includes('Coordinate Grid') || js.includes('gridSize = 45'));
check('Dashboard glow radial gradient implemented', js.includes('Dashboard Glow') || js.includes('glowGrad'));
check('Moving chart animation implemented', js.includes('Chart Trend Line') || js.includes('chartPhase'));
check('Moving data lines particles implemented', js.includes('Moving Data Lines') || js.includes('particleCount'));
check('Small floating UI cards implemented', js.includes('floatingCards') && js.includes('Small Floating UI Cards'));

// 11. FINAL MESSAGE & CTA
console.log('\n11. Checking Final Message & CTA...');
check('Shows "Turn Leads Into Organized Business Growth"', html.includes('Turn Leads Into Organized Business Growth'));
check('Shows CTA "EXPLORE RATEHONK CRM →"', html.includes('EXPLORE RATEHONK CRM →'));
check('CTA button links to https://crm.ratehonk.com/portfolio', html.includes('href="https://crm.ratehonk.com/portfolio"'));

// 12. WEBSITE PRESERVATION INTEGRITY
console.log('\n12. Checking Non-Regression Integrity...');
check('Navbar preserved (#home, #about, #services, #products, #contact)', 
  html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
check('Hero section preserved (#home)', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
check('Footer preserved', html.includes('<footer'));
check('Authentication login page removed from public navigation', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

// API Check
const req = http.get('http://localhost:5000/api/health', (res) => {
  let rawData = '';
  res.on('data', chunk => { rawData += chunk; });
  res.on('end', () => {
    try {
      const data = JSON.parse(rawData);
      check('Server API health check returns HTTP 200 with success: true', res.statusCode === 200 && data.success === true);
    } catch (e) {
      check('Server API health check returns HTTP 200 with success: true', false);
    }
    finishTest();
  });
});

req.on('error', () => {
  check('Server API health check returns HTTP 200 with success: true', false);
  finishTest();
});

function finishTest() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
  console.log('====================================================');

  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: PHASE 9 RATEHONK TRAVEL CRM VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED!\n');
    process.exit(1);
  }
}
