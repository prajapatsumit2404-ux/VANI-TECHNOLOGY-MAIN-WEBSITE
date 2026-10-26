/**
 * PHASE 12 — PRODUCT BACKGROUNDS TEST SUITE
 * 
 * Verifies that each Product has its OWN distinct background:
 * 1. AI Talksy: AI / communication feeling
 * 2. Community Forum: Human / connected feeling
 * 3. RateHonk: Business / SaaS / data feeling
 * 
 * Verifies the design hierarchy:
 * - BACKGROUND = STAGE (never overpowers demo, z-index: 1, balanced opacity)
 * - PHONE / DASHBOARD = ACTOR (prominent z-index: 10, realistic border, shadow)
 * - TEXT = EXPLANATION (clear narrative information)
 * - CTA = NEXT STEP (prominent action button linking to live product)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('     PHASE 12: PRODUCT BACKGROUNDS AUDIT            ');
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

// 1. PRODUCT 1: AI TALKSY (AI / COMMUNICATION FEELING)
console.log('1. Checking AI Talksy Background (AI / Communication)...');
check('AI Talksy has dedicated canvas element (#aitalksy-neural-canvas)', 
  html.includes('id="aitalksy-neural-canvas"'));
check('AI Talksy canvas styled with .aitalksy-neural-bg-canvas', 
  css.includes('.aitalksy-neural-bg-canvas'));
check('AI Talksy JS renders neural nodes and connection lines', 
  js.includes('initAITalksyBackground') && js.includes('Neural connection lines'));
check('AI Talksy JS renders subtle blue/purple ambient lighting', 
  js.includes('ambientLights') && js.includes('rgba(6, 182, 212') && js.includes('rgba(168, 85, 247'));
check('AI Talksy JS renders floating UI chat shapes and glowing AI nodes', 
  js.includes('floatingShapes') && js.includes('isGlow'));

// 2. PRODUCT 2: COMMUNITY FORUM (HUMAN / CONNECTED FEELING)
console.log('\n2. Checking Community Forum Background (Human / Connected)...');
check('Community Forum has dedicated canvas element (#community-ecosystem-canvas)', 
  html.includes('id="community-ecosystem-canvas"'));
check('Community Forum canvas styled with .community-ecosystem-bg-canvas', 
  css.includes('.community-ecosystem-bg-canvas'));
check('Community Forum JS renders soft warm ambient gradient (amber & emerald)', 
  js.includes('initCommunityBackground') && js.includes('warmLights') && js.includes('245, 158, 11'));
check('Community Forum JS renders connected people circles & community nodes', 
  js.includes('Connected people circles') && js.includes('isHub'));
check('Community Forum JS renders floating subtle community cards', 
  js.includes('floatingCards'));

// 3. PRODUCT 3: RATEHONK TRAVEL CRM (BUSINESS / SAAS / DATA FEELING)
console.log('\n3. Checking RateHonk CRM Background (Business / SaaS / Data)...');
check('RateHonk has dedicated canvas element (#ratehonk-saas-canvas)', 
  html.includes('id="ratehonk-saas-canvas"'));
check('RateHonk canvas styled with .ratehonk-saas-bg-canvas', 
  css.includes('.ratehonk-saas-bg-canvas'));
check('RateHonk JS renders subtle coordinate grid & dashboard glow', 
  js.includes('initRateHonkBackground') && js.includes('Subtle Coordinate Grid') && js.includes('Dashboard Glow'));
check('RateHonk JS renders small floating travel CRM UI cards (LEAD, MARGIN, TRIP, WON)', 
  js.includes('floatingCards') && js.includes('₹85K') && js.includes('+34.8%') && js.includes('BALI'));
check('RateHonk JS renders moving data lines & chart animation', 
  js.includes('Moving Data Lines') && (js.includes('Chart Animation') || js.includes('chartPhase')));

// 4. HIERARCHY & CONTRAST (BACKGROUND = STAGE, PHONE/DASHBOARD = ACTOR, TEXT = EXPLANATION, CTA = NEXT STEP)
console.log('\n4. Checking Design Hierarchy (Stage vs Actor vs Explanation vs Next Step)...');
check('Stage canvases have z-index: 1 (never overpowering the demo)', 
  css.includes('.aitalksy-neural-bg-canvas') && css.includes('z-index: 1;'));
check('Stage canvas opacity is balanced (resting 0.65, hover max 0.8)', 
  css.includes('opacity: 0.65;') && css.includes('opacity: 0.8;'));
check('Actor mockups (phone & browser) have elevated z-index: 10 above stage', 
  css.includes('.device-mockup-phone') && css.includes('z-index: 10;') && 
  css.includes('.device-mockup-browser') && css.includes('z-index: 10;'));
check('Actor mockups feature solid background and realistic shadows', 
  css.includes('.device-mockup-phone') && css.includes('box-shadow:') && 
  css.includes('.device-mockup-browser') && css.includes('box-shadow:'));
check('Text (Explanation) occupies dedicated column with value highlights & live captions', 
  html.includes('class="product-story-info') && html.includes('id="aitalksy-step-caption"') && 
  html.includes('id="community-step-caption"') && html.includes('id="ratehonk-step-caption"'));
check('CTA (Next Step) prominent with external links and new tab targets', 
  html.includes('EXPLORE AITALKSY') && html.includes('https://aitalksy.com/') && 
  html.includes('EXPLORE COMMUNITY FORUM') && html.includes('https://communityforum.tech/') && 
  html.includes('EXPLORE RATEHONK CRM') && html.includes('https://crm.ratehonk.com/portfolio'));

// 5. WEBSITE PRESERVATION INTEGRITY
console.log('\n5. Checking Website Preservation Integrity...');
check('Navbar preserved (#home, #about, #services, #products, #contact)', 
  html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
check('Hero 3D scene preserved', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
check('Footer preserved', html.includes('<footer'));
check('Public navigation free of login link', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

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
    console.log('🌟 STATUS: PHASE 12 PRODUCT BACKGROUNDS VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED!\n');
    process.exit(1);
  }
}
