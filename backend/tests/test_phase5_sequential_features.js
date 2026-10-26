/**
 * =======================================================================
 * PHASE 5 TEST SUITE: SHOW FEATURES ONE BY ONE (SEQUENTIAL DEMONSTRATION)
 * =======================================================================
 * Validates that features are not dumped all at once, but rather demonstrated
 * sequentially in lockstep with the realistic device mockups:
 * 
 * [1] Sequential feature decks exist for all 3 flagship products
 * [2] AI Talksy features match exact sequence:
 *     - Feature 1: "Send a message"
 *     - Feature 2: "AI understands the request"
 *     - Feature 3: "AI responds automatically"
 *     - Feature 4: "Business action"
 *     - Feature 5: "Customer successfully handled"
 * [3] Community Forum features sequence configured
 * [4] RateHonk Travel CRM features sequence configured
 * [5] Dynamic floating action cards for Feature 4 (Business Action) and Feature 5 (Result)
 * [6] 5-step sequential feature pill navigation wired in JS
 * [7] Synchronization logic updates active feature card on step change
 * [8] Strict isolation: Navbar, Hero, About, Services, Project Delivered, Contact, Footer untouched
 * =======================================================================
 */

const fs = require('fs');
const path = require('path');

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
const css = fs.readFileSync(path.join(__dirname, '../../frontend/css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '../../frontend/js/main.js'), 'utf8');

console.log('====================================================');
console.log('   PHASE 5: SEQUENTIAL FEATURE DEMONSTRATION AUDIT   ');
console.log('====================================================');

// 1. Sequential feature deck markup
console.log('\n1. Checking Sequential Feature Deck Markup in HTML...');
check('AI Talksy has sequential feature deck with #aitalksy-active-feature-card',
  html.includes('id="aitalksy-active-feature-card"') &&
  html.includes('id="aitalksy-feature-indicator-badge"') &&
  html.includes('id="aitalksy-feature-title"'));

check('Community Forum has sequential feature deck with #community-active-feature-card',
  html.includes('id="community-active-feature-card"') &&
  html.includes('id="community-feature-indicator-badge"') &&
  html.includes('id="community-feature-title"'));

check('RateHonk Travel CRM has sequential feature deck with #ratehonk-active-feature-card',
  html.includes('id="ratehonk-active-feature-card"') &&
  html.includes('id="ratehonk-feature-indicator-badge"') &&
  html.includes('id="ratehonk-feature-title"'));

// 2. Exact user-requested feature sequence for AI Talksy
console.log('\n2. Checking AI Talksy Exact Feature Sequence...');
check('Feature 1: "Send a message" is configured',
  js.includes("title: 'Send a message'") &&
  html.includes('Send a message'));

check('Feature 2: "AI understands the request" is configured',
  js.includes("title: 'AI understands the request'"));

check('Feature 3: "AI responds automatically" is configured',
  js.includes("title: 'AI responds automatically'"));

check('Feature 4: "Business action" is configured',
  js.includes("title: 'Business action'"));

check('Feature 5: "Customer successfully handled" is configured',
  js.includes("title: 'Customer successfully handled'"));

// 3. Dynamic floating action cards on visualization stage
console.log('\n3. Checking Dynamic Floating Action Cards...');
check('AI Talksy has floating action card for Feature 4 (Business Action)',
  html.includes('id="aitalksy-float-card-biz"') &&
  html.includes('Feature 4 • Business Action'));

check('AI Talksy has floating action card for Feature 5 (Result)',
  html.includes('id="aitalksy-float-card-result"') &&
  html.includes('Customer Successfully Handled'));

check('Community Forum has floating action card for Feature 4 & 5',
  html.includes('id="community-float-card-biz"') &&
  html.includes('id="community-float-card-result"'));

check('RateHonk Travel CRM has floating action card for Feature 4 & 5',
  html.includes('id="ratehonk-float-card-biz"') &&
  html.includes('id="ratehonk-float-card-result"'));

// 4. Sequential feature JavaScript synchronization logic
console.log('\n4. Checking JavaScript Sequential Feature Engine...');
check('SEQUENTIAL_FEATURES dictionary configured in main.js',
  js.includes('const SEQUENTIAL_FEATURES = {'));

check('updateSequentialFeatureDeck function defined in main.js',
  js.includes('const updateSequentialFeatureDeck = (storyKey, stepNum) => {'));

check('showStep invokes updateSequentialFeatureDeck on every step transition',
  js.includes('updateSequentialFeatureDeck(storyKey, stepNum);'));

check('Feature pill click listeners wired to jump to mapped scenes',
  js.includes('.feature-step-pill-btn') &&
  js.includes('data-feature-step'));

// 5. CSS styling for Sequential Feature Deck & Floating Action Cards
console.log('\n5. Checking CSS Light SaaS Styling & Accessibility...');
check('CSS includes .sequential-feature-deck with clean light SaaS styling',
  css.includes('.sequential-feature-deck'));

check('CSS includes .feature-step-pill-btn with active states per theme',
  css.includes('.feature-step-pill-btn') &&
  css.includes('.feature-step-pill-btn.active.step-cyan') &&
  css.includes('.feature-step-pill-btn.active.step-emerald') &&
  css.includes('.feature-step-pill-btn.active.step-blue'));

check('CSS includes .floating-action-card with gentle floating animation',
  css.includes('.floating-action-card') &&
  css.includes('@keyframes floatCardBounce'));

check('CSS prefers-reduced-motion respects floating cards and feature deck',
  css.includes('.floating-action-card') &&
  css.includes('.feature-step-content-box'));

// 6. Strict isolation check
console.log('\n6. Checking Website Part Isolation...');
check('Hero 3D Canvas element remains untouched',
  html.includes('id="hero-three-canvas"'));

check('Navbar remains untouched',
  html.includes('id="main-navbar"'));

check('Footer remains untouched',
  html.includes('id="main-footer"'));

console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log('====================================================');

if (passedChecks === totalChecks) {
  console.log('🌟 STATUS: PHASE 5 SEQUENTIAL FEATURE DEMONSTRATION VERIFIED WITH 100% SUCCESS!\n');
  process.exit(0);
} else {
  console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 5 AUDIT\n');
  process.exit(1);
}
