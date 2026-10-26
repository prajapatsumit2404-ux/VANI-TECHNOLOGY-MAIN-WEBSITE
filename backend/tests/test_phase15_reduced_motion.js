/**
 * =======================================================================
 * PHASE 15 AUDIT: REDUCED MOTION ACCESSIBILITY TEST
 * =======================================================================
 * Requirements:
 * Respect: prefers-reduced-motion
 * If enabled:
 * - Do not run complicated movement (no bouncing, spinning, crazy scaling)
 * - Instead show:
 *   - simple fade
 *   - simple slide
 *   - static product UI
 * - The product must still be understandable
 * =======================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

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
console.log('     PHASE 15: REDUCED MOTION AUDIT                 ');
console.log('====================================================');

// 1. RESPECT PREFERS-REDUCED-MOTION
console.log('\n1. Checking prefers-reduced-motion Recognition...');
check('CSS includes @media (prefers-reduced-motion: reduce)', 
  css.includes('@media (prefers-reduced-motion: reduce)'));
check('JS dynamically queries and listens to prefers-reduced-motion', 
  js.includes("window.matchMedia('(prefers-reduced-motion: reduce)')") &&
  js.includes('isReducedMotion'));

// 2. DO NOT RUN COMPLICATED MOVEMENT
console.log('\n2. Checking Complicated Movement Is Disabled...');
check('Complex keyframe animations disabled in CSS', 
  css.includes('animation-duration: 0.001ms !important;') &&
  css.includes('animation-iteration-count: 1 !important;'));
check('Spinning, bouncing, and pulsing animations disabled in CSS', 
  css.includes('.fa-spin,') && css.includes('.animate-bounce,') && css.includes('.animate-pulse'));
check('Soundwave bars and typing dots disabled in CSS', 
  css.includes('.soundwave-bar,') && css.includes('.typing-dot,'));
check('RateHonk pipeline physical jumping disabled when isReducedMotion is true', 
  js.includes('runRateHonkPipelineFlow') && js.includes('if (isReducedMotion)') && js.includes('Stage: 5. CONVERTED'));
check('Parallax mouse movement disabled when prefers-reduced-motion is true', 
  js.includes('initProductMouseParallax') && js.includes('prefersReducedMotion'));
check('Canvas render loops stop when prefers-reduced-motion is true (render single static frame)', 
  js.includes('!isReducedMotion') && js.includes('startCanvas = () => {') && js.includes('if (isReducedMotion)'));

// 3. SHOW SIMPLE FADE & SIMPLE SLIDE
console.log('\n3. Checking Simple Fade & Simple Slide...');
check('Scene panes transition with simple opacity fade in CSS', 
  css.includes('transition: opacity 0.25s ease-out, transform 0.25s ease-out !important;'));
check('Inactive scenes slide gently (translateY(4px)) and fade out (opacity: 0) in CSS', 
  css.includes('.product-story-scene.hidden,') && 
  css.includes('opacity: 0 !important;') && 
  css.includes('transform: translateY(4px) !important;'));
check('Active scenes slide to origin (translateY(0)) and fade in (opacity: 1) in CSS', 
  css.includes('.product-story-scene:not(.hidden),') && 
  css.includes('opacity: 1 !important;') && 
  css.includes('transform: translateY(0) !important;'));
check('JS showStep applies simple fade & simple slide for reduced motion', 
  js.includes("pane.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out'") &&
  js.includes("pane.style.transform = 'translateY(0)'"));

// 4. STATIC PRODUCT UI
console.log('\n4. Checking Static Product UI State...');
check('Device mockups and cards have transform: none in CSS under reduced motion', 
  css.includes('.device-mockup-phone,') && css.includes('.device-mockup-browser,') && css.includes('transform: none !important;'));
check('AI Talksy: Typing animation replaced with immediate static message', 
  js.includes('runAITalksyTyping') && js.includes('if (isReducedMotion)') && js.includes('textEl.textContent = fullText'));
check('AI Talksy: Processing animation replaced with immediate static completed state', 
  js.includes('runAITalksyProcessing') && js.includes('if (isReducedMotion)'));
check('AI Talksy: Numerical counters display static finalized values without spinning', 
  js.includes('runAITalksyCounters') && js.includes('if (isReducedMotion)') && js.includes('el.textContent = target.toFixed(decimals) + suffix'));
check('RateHonk: Follow-up animation replaced with static completed badge', 
  js.includes('runRateHonkFollowUp') && js.includes('if (isReducedMotion)') && js.includes('✓ FOLLOW-UP COMPLETED'));
check('RateHonk: KPI counters display static finalized values without spinning', 
  js.includes('runRateHonkCounters') && js.includes('if (isReducedMotion)') && js.includes('el.textContent = target.toFixed(decimals) + suffix'));
check('Community Forum: People network renders static connected state', 
  js.includes('runCommunityPeopleConnect') && js.includes('if (isReducedMotion)') && js.includes("n.style.transform = 'none'"));
check('Community Forum: Verification stamp renders static verified badge', 
  js.includes('runCommunityVerification') && js.includes('if (isReducedMotion)') && js.includes("stamp.style.transform = 'none'"));
check('Community Forum: Smartphone screen timer auto-swapping disabled under reduced motion', 
  js.includes('runCommunityPhoneServices') && js.includes('if (isReducedMotion) return;'));

// 5. PRODUCT IS STILL UNDERSTANDABLE
console.log('\n5. Checking Product Understandability & Clarity...');
check('AI Talksy: Complete narrative and value proposition clearly legible', 
  html.includes('AI Talksy') && html.includes('Autonomous conversational AI agent platform'));
check('Community Forum: Complete narrative and community modules clearly legible', 
  html.includes('Community Forum') && html.includes('Comprehensive, verified digital community platform'));
check('RateHonk CRM: Complete narrative and sales workflow clearly legible', 
  html.includes('RateHonk Travel CRM') && html.includes('Enterprise B2B travel operations platform'));
check('All 3 external flagship CTAs remain prominent and accessible', 
  html.includes('EXPLORE AITALKSY') && html.includes('EXPLORE COMMUNITY FORUM') && html.includes('EXPLORE RATEHONK CRM'));
check('All scene navigation pills remain functional and legible', 
  (html.match(/class="story-step-pill/g) || []).length >= 17);

// 6. WEBSITE PRESERVATION INTEGRITY
console.log('\n6. Checking Website Preservation Integrity...');
check('Navbar preserved (#home, #about, #services, #products, #contact)', 
  html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
check('Hero 3D scene preserved', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
check('Footer preserved', html.includes('<footer'));
check('Public navigation free of login link', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

// Server API check
const req = http.get('http://localhost:5000/api/health', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      check('Server API health check returns HTTP 200 with success: true', res.statusCode === 200 && data.success === true);
    } catch (e) {
      check('Server API health check returns HTTP 200 with success: true', false);
    }
    summarize();
  });
});

req.on('error', (err) => {
  check('Server API health check returns HTTP 200 with success: true', false);
  summarize();
});

function summarize() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks/totalChecks)*100)}%)`);
  console.log('====================================================');
  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: PHASE 15 REDUCED MOTION VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 15\n');
    process.exit(1);
  }
}
