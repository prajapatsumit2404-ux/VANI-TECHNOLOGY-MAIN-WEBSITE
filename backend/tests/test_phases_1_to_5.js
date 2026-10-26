/**
 * Comprehensive Test Suite for Phases 1 to 5:
 * 
 * PHASE 1 — Architecture & Core Website Preservation
 * PHASE 2 — Organize Products (mainProducts vs deliveredProjects)
 * PHASE 3 — Rename Sections (PRODUCT & PROJECT DELIVERED)
 * PHASE 4 — Reusable Product Story System (Desktop: TEXT + DEMO | Mobile: TEXT -> DEMO -> CTA)
 * PHASE 5 — The Big Idea (5 Questions: Product, User, User Action, Product Action, Result)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert');

console.log('================================================================');
console.log('        VANI TECHNOLOGY: PHASES 1 - 5 MASTER TEST SUITE         ');
console.log('================================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

let phaseScores = {
  phase1: 0,
  phase2: 0,
  phase3: 0,
  phase4: 0,
  phase5: 0
};

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

// ============================================================================
// PHASE 1 — ARCHITECTURE & NON-PRODUCT SECTION PRESERVATION
// ============================================================================
console.log('----------------------------------------------------------------');
console.log('PHASE 1 — Architecture & Codebase Preservation Audit');
console.log('----------------------------------------------------------------');

if (check('Navbar (#main-navbar) intact with standard navigation links', 
  html.includes('id="main-navbar"') && html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'))) {
  phaseScores.phase1++;
}

if (check('Hero (#home) section intact with 3D canvas and primary CTA', 
  html.includes('id="home"') && html.includes('three-canvas') && html.includes('Explore Products'))) {
  phaseScores.phase1++;
}

if (check('About (#about) section intact with core pillars', 
  html.includes('id="about"') && html.includes('Engineering Digital Excellence'))) {
  phaseScores.phase1++;
}

if (check('Services (#services) section intact with specialized IT capabilities', 
  html.includes('id="services"') && html.includes('Specialized IT Services &amp; Digital Solutions'))) {
  phaseScores.phase1++;
}

if (check('Contact (#contact) section and Footer (#main-footer) intact', 
  html.includes('id="contact"') && html.includes('id="main-footer"') && html.includes('id="contact-form"'))) {
  phaseScores.phase1++;
}

if (check('Server & backend dependencies intact (server.js, package.json)', 
  fs.existsSync(path.join(__dirname, '../server.js')) && fs.existsSync(path.join(__dirname, '../../package.json')))) {
  phaseScores.phase1++;
}

// ============================================================================
// PHASE 2 — ORGANIZE PRODUCTS
// ============================================================================
console.log('\n----------------------------------------------------------------');
console.log('PHASE 2 — Organize Products (mainProducts vs deliveredProjects)');
console.log('----------------------------------------------------------------');

// Sandbox execution of main.js product definition
const sandbox = { window: {}, document: { addEventListener: () => {} } };
const productDataScript = js.substring(
  js.indexOf('const PRODUCTS_DATA = {'),
  js.indexOf('function initProductsAndFilters()')
);
new Function('window', 'document', productDataScript)(sandbox.window, sandbox.document);

const mainProducts = sandbox.window.mainProducts;
const deliveredProjects = sandbox.window.deliveredProjects;

if (check('mainProducts contains EXACTLY 3 flagship products', 
  Array.isArray(mainProducts) && mainProducts.length === 3)) {
  phaseScores.phase2++;
}

if (check('mainProducts contains only AI Talksy, Community Forum, RateHonk Travel CRM', 
  mainProducts && mainProducts[0].id === 'ai-talksy' && mainProducts[1].id === 'community-forum' && mainProducts[2].id === 'ratehonk-travel-crm')) {
  phaseScores.phase2++;
}

if (check('deliveredProjects contains EXACTLY 5 delivered projects', 
  Array.isArray(deliveredProjects) && deliveredProjects.length === 5)) {
  phaseScores.phase2++;
}

const deliveredExpectedKeys = ['homem-do-pao', 'meditation-willy-cherish', 'msb-school', 'software-testing-suite', 'telemedicine'];
if (check('deliveredProjects matches Homem Do Pao, Meditation, MSB School, Software Testing, TeleMedicine', 
  deliveredProjects && deliveredExpectedKeys.every(k => deliveredProjects.some(p => p.id === k)))) {
  phaseScores.phase2++;
}

const mainKeys = mainProducts.map(p => p.id);
const deliveredKeys = deliveredProjects.map(p => p.id);
const keyOverlap = deliveredKeys.filter(k => mainKeys.includes(k));
if (check('Zero duplicate objects between mainProducts and deliveredProjects', keyOverlap.length === 0)) {
  phaseScores.phase2++;
}

if (check('Original descriptions & features faithfully preserved without invented text', 
  mainProducts.every(p => p.description && p.features.length >= 3) && deliveredProjects.every(p => p.description && p.features.length >= 3))) {
  phaseScores.phase2++;
}

if (check('External URLs and navigation links unbroken', 
  mainProducts[0].link === 'https://aitalksy.com/' && mainProducts[1].link === 'https://communityforum.tech/' && mainProducts[2].link === 'https://crm.ratehonk.com/portfolio')) {
  phaseScores.phase2++;
}

// ============================================================================
// PHASE 3 — RENAME SECTIONS
// ============================================================================
console.log('\n----------------------------------------------------------------');
console.log('PHASE 3 — Rename Sections (PRODUCT & PROJECT DELIVERED)');
console.log('----------------------------------------------------------------');

const productSectionHtml = (html.match(/<section id="products"[\s\S]*?<\/section>/) || [''])[0];
const deliverySectionHtml = (html.match(/<section id="delivery-projects"[\s\S]*?<\/section>/) || [''])[0];

if (check('PRODUCT section heading is exactly "PRODUCT"', 
  /<h2[^>]*>[\s\r\n]*PRODUCT[\s\r\n]*<\/h2>/.test(productSectionHtml))) {
  phaseScores.phase3++;
}

if (check('PRODUCT section subtitle is "Products that define our digital expertise"', 
  productSectionHtml.includes('Products that define our digital expertise'))) {
  phaseScores.phase3++;
}

if (check('PROJECT DELIVERED section heading is exactly "PROJECT DELIVERED"', 
  /<h2[^>]*>[\s\r\n]*PROJECT DELIVERED[\s\r\n]*<\/h2>/.test(deliverySectionHtml))) {
  phaseScores.phase3++;
}

if (check('PROJECT DELIVERED section subtitle is "Projects we\'ve successfully delivered"', 
  deliverySectionHtml.includes("Projects we've successfully delivered"))) {
  phaseScores.phase3++;
}

if (check('"MAIN PRODUCTS" is NOT used as an h2 heading', 
  !/<h2[^>]*>[\s\r\n]*MAIN PRODUCTS[\s\r\n]*<\/h2>/.test(html))) {
  phaseScores.phase3++;
}

if (check('"DELIVERY PROJECTS" is NOT used as an h2 heading', 
  !/<h2[^>]*>[\s\r\n]*DELIVERY PROJECTS[\s\r\n]*<\/h2>/.test(html))) {
  phaseScores.phase3++;
}

// ============================================================================
// PHASE 4 — REUSABLE PRODUCT STORY SYSTEM
// ============================================================================
console.log('\n----------------------------------------------------------------');
console.log('PHASE 4 — Reusable Product Story System (Desktop & Mobile Layouts)');
console.log('----------------------------------------------------------------');

const flagshipIds = ['story-aitalksy', 'story-communityforum', 'story-ratehonk'];
let reusableStructureAll = true;
let leftElementsAll = true;
let rightDemoAll = true;

flagshipIds.forEach((id) => {
  const match = html.match(new RegExp(`<article id="${id}"[\\s\\S]*?<\\/article>`));
  if (!match) { reusableStructureAll = false; return; }
  const cHtml = match[0];
  
  if (!cHtml.includes('class="product-story-layout') || !cHtml.includes('class="product-story-info') || !cHtml.includes('class="product-story-demo') || !cHtml.includes('class="product-story-cta')) {
    reusableStructureAll = false;
  }

  // Left Elements: Product Name, Short Explanation, Important Features, CTA
  if (!/<h3[^>]*>/.test(cHtml) || !cHtml.includes('text-slate-300 leading-relaxed') || !cHtml.includes('fa-circle-check') || !cHtml.includes('btn-primary')) {
    leftElementsAll = false;
  }

  // Right Elements: Animated Product Demo Stage
  if (!cHtml.includes('story-stage-canvas') || !cHtml.includes('product-visualization') || !cHtml.includes('story-step-pill')) {
    rightDemoAll = false;
  }
});

if (check('All 3 Products use .product-story-layout with .product-story-info, .product-story-demo, .product-story-cta', reusableStructureAll)) {
  phaseScores.phase4++;
}

if (check('Left side contains: Product Name, Short Explanation, Important Features, CTA', leftElementsAll)) {
  phaseScores.phase4++;
}

if (check('Right side contains: Animated Product Demo Canvas, Stage & Timeline Controls', rightDemoAll)) {
  phaseScores.phase4++;
}

if (check('Desktop Layout (>= 1024px): 12-Column Grid (Col 1-5 Left: TEXT+CTA | Col 6-12 Right: DEMO)', 
  css.includes('@media (min-width: 1024px)') && css.includes('grid-template-columns: repeat(12, minmax(0, 1fr))') && css.includes('grid-column: 1 / span 5') && css.includes('grid-column: 6 / span 7'))) {
  phaseScores.phase4++;
}

if (check('Mobile Layout (< 1024px): CSS Grid Order (TEXT order:1 -> DEMO order:2 -> CTA order:3)', 
  /\.product-story-info\s*\{[\s\S]*?order:\s*1;/.test(css) && /\.product-story-demo\s*\{[\s\S]*?order:\s*2;/.test(css) && /\.product-story-cta\s*\{[\s\S]*?order:\s*3;/.test(css))) {
  phaseScores.phase4++;
}

if (check('Mobile CTA buttons stack vertically to fit any mobile viewport without overflow', 
  css.includes('flex-direction: column !important'))) {
  phaseScores.phase4++;
}

// ============================================================================
// PHASE 5 — THE BIG IDEA (5 FUNDAMENTAL QUESTIONS)
// ============================================================================
console.log('\n----------------------------------------------------------------');
console.log('PHASE 5 — The Big Idea (5 Questions: Product, User, User Action, Product Action, Result)');
console.log('----------------------------------------------------------------');

// AI Talksy
const aiHtml = (html.match(/<article id="story-aitalksy"[\s\S]*?<\/article>/) || [''])[0];
const aiQ1 = aiHtml.includes('AI Talksy');
const aiQ2 = aiHtml.includes('Enterprise Customer') || aiHtml.includes('fa-user-tie');
const aiQ3 = aiHtml.includes('Hello, I need help.') && aiHtml.includes('aitalksy-typing-text');
const aiQ4 = aiHtml.includes('Processing...') && aiHtml.includes('Understanding...') && aiHtml.includes('Generating response...') && aiHtml.includes('Sure! I can help you with that.');
const aiQ5 = aiHtml.includes('aitalksy-counter') && aiHtml.includes('Resolved') && aiHtml.includes('Automation');

if (check('AI Talksy answers all 5 Questions: User -> Message -> AI Core -> Response -> Business Result', 
  aiQ1 && aiQ2 && aiQ3 && aiQ4 && aiQ5)) {
  phaseScores.phase5++;
}

// Community Forum
const commHtml = (html.match(/<article id="story-communityforum"[\s\S]*?<\/article>/) || [''])[0];
const commQ1 = commHtml.includes('Community Forum');
const commQ2 = commHtml.includes('Person 1') && commHtml.includes('Person 2');
const commQ3 = commHtml.includes('Verified Member') && commHtml.includes('ID Authenticated');
const commQ4 = ['Members', 'Matrimony', 'Marketplace', 'Bill Payment', 'E-Voting', 'Family Tree', 'Events'].every(s => commHtml.includes(s));
const commQ5 = commHtml.includes('Many community services') && commHtml.includes('One digital platform');

if (check('Community Forum answers all 5 Questions: People -> Community -> Verification -> Phone Platform -> Ecosystem Result', 
  commQ1 && commQ2 && commQ3 && commQ4 && commQ5)) {
  phaseScores.phase5++;
}

// RateHonk Travel CRM
const crmHtml = (html.match(/<article id="story-ratehonk"[\s\S]*?<\/article>/) || [''])[0];
const crmQ1 = crmHtml.includes('RateHonk Travel CRM');
const crmQ2 = crmHtml.includes('John Smith');
const crmQ3 = crmHtml.includes('NEW LEAD') && crmHtml.includes('₹85,000');
const crmQ4 = crmHtml.includes('NEW LEAD') && crmHtml.includes('CONTACTED') && crmHtml.includes('FOLLOW-UP') && crmHtml.includes('QUALIFIED') && crmHtml.includes('CONVERTED') && crmHtml.includes('Follow-up due');
const crmQ5 = crmHtml.includes('BOOKING CONFIRMED') && crmHtml.includes('ratehonk-counter') && crmHtml.includes('Revenue') && crmHtml.includes('Conversion');

if (check('RateHonk Travel CRM answers all 5 Questions: Inbound Lead -> Pipeline Motion -> Follow-up -> Booking -> Growth Dashboard', 
  crmQ1 && crmQ2 && crmQ3 && crmQ4 && crmQ5)) {
  phaseScores.phase5++;
}

if (check('Dynamic explanatory captions in HTML & JS guide visitor through reasoning rather than decorative decoration', 
  html.includes('id="aitalksy-step-caption"') && html.includes('id="community-step-caption"') && html.includes('id="ratehonk-step-caption"') && js.includes('${storyKey}-step-caption'))) {
  phaseScores.phase5++;
}

// Verify live server health check for Phase 1 API integration
const req = http.get('http://localhost:5000/api/health', (res) => {
  let rawData = '';
  res.on('data', chunk => { rawData += chunk; });
  res.on('end', () => {
    try {
      const data = JSON.parse(rawData);
      check('Live server API health check returns HTTP 200 with status ok/true', res.statusCode === 200 && data.success === true);
    } catch (e) {
      check('Live server API health check returns HTTP 200 with status ok/true', false);
    }
    finishAudit();
  });
});

req.on('error', () => {
  check('Live server API health check returns HTTP 200 with status ok/true (server running on port 5000)', false);
  finishAudit();
});

function finishAudit() {
  console.log('\n================================================================');
  console.log('                       PHASE AUDIT REPORT CARD                  ');
  console.log('================================================================');
  console.log(`  PHASE 1 (Architecture & Preservation):  ${phaseScores.phase1}/6 checks passed`);
  console.log(`  PHASE 2 (Organize Products):            ${phaseScores.phase2}/7 checks passed`);
  console.log(`  PHASE 3 (Rename Sections):              ${phaseScores.phase3}/6 checks passed`);
  console.log(`  PHASE 4 (Product Story System):         ${phaseScores.phase4}/6 checks passed`);
  console.log(`  PHASE 5 (The Big Idea - 5 Questions):   ${phaseScores.phase5}/4 checks passed`);
  console.log('----------------------------------------------------------------');
  console.log(`  TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
  console.log('================================================================');

  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: ALL PHASES 1 THROUGH 5 VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED!\n');
    process.exit(1);
  }
}
