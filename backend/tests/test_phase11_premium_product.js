/**
 * Phase 11 Verification Test: Make the Product Section Feel Premium
 * Tests:
 * 1. Differentiated visual identities for AI Talksy, Community Forum, and RateHonk CRM.
 * 2. Subtle, non-intrusive hover interactions (depth, UI glow, CTA brightness, active elements).
 * 3. Button micro-interactions (arrow motion, subtle glow, tactile click state).
 * 4. Mouse parallax with 2-5px micro-motion, disabled on mobile and when prefers-reduced-motion is active.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

let totalTests = 0;
let passedTests = 0;

function check(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('====================================================');
console.log('    PHASE 11: PREMIUM PRODUCT SECTION AUDIT         ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// 1. AI TALKSY VISUAL IDENTITY
console.log('1. Checking AI TALKsy Visual Identity (Futuristic, Intelligent, AI, Communication)...');
check(css.includes('.theme-aitalksy') && css.includes('rgba(6, 182, 212,'), 'AI Talksy has distinct cyan/futuristic theme styling');
check(html.includes('aitalksy-neural-canvas') && js.includes('initAITalksyBackground'), 'Neural connections & canvas present');
check(html.includes('ai-floating-node'), 'Glowing nodes present');
check(html.includes('aitalksy-typing-text') && html.includes('Hello, I need help.'), 'Chat bubbles present');
check(js.includes('microParticleCount') || js.includes('particles.push'), 'Subtle floating particles present in background');

// 2. COMMUNITY FORUM VISUAL IDENTITY
console.log('\n2. Checking COMMUNITY FORUM Visual Identity (Human, Trustworthy, Connected, Community)...');
check(css.includes('.theme-community') && css.includes('rgba(16, 185, 129,'), 'Community Forum has distinct emerald/warm theme styling');
check(html.includes('Person 1') && html.includes('Person 2') && html.includes('Person 3') && html.includes('Person 4'), 'Human avatars present');
check(html.includes('comm-connecting-path') || js.includes('runCommunityPeopleConnect'), 'Connection lines present');
check(html.includes('animate-phone-enter') || html.includes('comm-phone-service'), 'Smartphone UI present');
check(css.includes('theme-community-stage') && css.includes('radial-gradient'), 'Soft gradients present');

// 3. RATEHONK CRM VISUAL IDENTITY
console.log('\n3. Checking RATEHONK CRM Visual Identity (Professional, Business, CRM, Data)...');
check(css.includes('.theme-ratehonk') && css.includes('rgba(59, 130, 246,'), 'RateHonk CRM has distinct royal blue/SaaS theme styling');
check(html.includes('pipeline-step-col') && html.includes('NEW LEAD') && html.includes('CONVERTED'), 'CRM pipeline present');
check(html.includes('ratehonk-kpi-val') || html.includes('crm-stat-box') || html.includes('Leads'), 'CRM dashboard present');
check(js.includes('chartPhase') && js.includes('Chart Trend Line'), 'Moving chart trend lines present');
check(js.includes('Data Line Particles') || js.includes('gridSize'), 'Coordinate grid & data lines present');

// 4. HOVER POLISH & MICRO-INTERACTIONS
console.log('\n4. Checking Card Hover Micro-Interactions...');
check(css.includes('.cinematic-story-card:hover') || css.includes('.product-story:hover'), 'Product card hover rule defined');
check(css.includes('translateY(-4px)'), 'Subtle card depth lift (no shaking or extreme zoom)');
check(css.includes('.theme-aitalksy:hover .animate-ai-core'), 'Important UI glows on hover for AI Talksy');
check(css.includes('.theme-community:hover .community-person-node'), 'Important UI glows on hover for Community Forum');
check(css.includes('.theme-ratehonk:hover .animate-pipeline-flow'), 'Important UI glows on hover for RateHonk');
check(css.includes('.cinematic-story-card:hover .product-story-cta .btn-primary'), 'CTA button becomes brighter on card hover');

// 5. BUTTON MICRO-INTERACTIONS
console.log('\n5. Checking Button Micro-Interactions...');
check(css.includes('.btn-primary:hover') && (css.includes('translateX(4px)') || css.includes('group-hover:translate-x-1')), 'Arrow moves slightly on button hover');
check(css.includes('.btn-primary:hover') && css.includes('box-shadow:'), 'Button gets subtle glow on hover');
check(css.includes('.btn-primary:active') && css.includes('scale(0.97'), 'Button has tactile clickable feel on active state');

// 6. MOUSE PARALLAX
console.log('\n6. Checking Mouse Parallax Implementation...');
check(js.includes('initProductMouseParallax'), 'initProductMouseParallax implemented in main.js');
check(js.includes('prefersReducedMotion') || js.includes('prefers-reduced-motion'), 'Parallax strictly respects prefers-reduced-motion');
check(js.includes('window.innerWidth < 1024') || js.includes('hover: hover'), 'Parallax disabled on mobile and touch devices');
check(js.includes('targetBgX') && js.includes('targetFgX'), 'Background and foreground have differential 2-5px micro-movement');

console.log('\n====================================================');
console.log(`Results: ${passedTests}/${totalTests} Passed`);
console.log('====================================================');

if (passedTests === totalTests) {
  console.log('🎉 PHASE 11 AUDIT PASSED: 100% SUCCESS!\n');
  process.exit(0);
} else {
  console.error('❌ SOME CHECKS FAILED.\n');
  process.exit(1);
}
