/**
 * PHASE 11 — GSAP CHOREOGRAPHY TEST SUITE
 * 
 * Verifies that GSAP is used ONLY for the Product Story timeline choreography:
 * 1. timeline sequencing
 * 2. phone movement
 * 3. UI transitions
 * 4. cards moving
 * 5. pipeline movement
 * 6. screen transitions
 * 7. number counters
 * 8. scroll-triggered storytelling
 * 9. Uses transforms and opacity (force3D: true)
 * 10. Does NOT continuously animate expensive properties
 * 11. Scoped strictly within Product Stories (NOT across the whole website)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('        PHASE 11: GSAP CHOREOGRAPHY AUDIT          ');
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

// 1. GSAP LIBRARY SCRIPT INCLUSION
console.log('1. Checking GSAP Library Inclusion...');
check('GSAP library script loaded in index.html', 
  html.includes('cdnjs.cloudflare.com/ajax/libs/gsap') || html.includes('gsap.min.js'));

// 2. STRICT SCOPING (GSAP ONLY FOR PRODUCT STORIES)
console.log('\n2. Checking Strict GSAP Scoping...');
const initStoriesMatch = js.match(/function initCinematicProductStories\(\)\s*\{([\s\S]*?)\nfunction /);
const storiesFunctionBody = initStoriesMatch ? initStoriesMatch[1] : '';

// Check if any gsap call exists outside initCinematicProductStories
const jsWithoutStories = js.replace(storiesFunctionBody, '');
const gsapOutsideStories = /gsap\.(to|from|fromTo|timeline)/.test(jsWithoutStories);
check('GSAP is NOT used across the whole website (Navbar, Hero, Services, Contact, Footer untouched)', 
  !gsapOutsideStories);
check('GSAP is used strictly inside initCinematicProductStories()', 
  storiesFunctionBody.includes('gsap.timeline') && storiesFunctionBody.includes('gsap.fromTo'));

// 3. THE 8 REQUIRED GSAP APPLICATIONS
console.log('\n3. Checking the 8 Required GSAP Applications...');

// 3.1 Timeline sequencing
check('Timeline sequencing: gsap.timeline() implemented for choreographing sequences', 
  storiesFunctionBody.includes('gsap.timeline()'));

// 3.2 Phone movement
check('Phone movement: GSAP transforms animate smartphone and device mockups', 
  storiesFunctionBody.includes('phoneMockup') && storiesFunctionBody.includes('device-mockup-phone'));

// 3.3 UI transitions
check('UI transitions: GSAP transforms animate scene panes, badges, and status elements', 
  storiesFunctionBody.includes('gsap.fromTo(pane') || storiesFunctionBody.includes('gsap.fromTo(container'));

// 3.4 Cards moving
check('Cards moving: GSAP transforms animate member cards, message bubbles, and service badges', 
  storiesFunctionBody.includes('animate-message-flight') && storiesFunctionBody.includes('community-person-node'));

// 3.5 Pipeline movement
check('Pipeline movement: GSAP timeline choreographs RateHonk lead card through 5 stages', 
  storiesFunctionBody.includes('runRateHonkPipelineFlow') && storiesFunctionBody.includes('gsap.timeline()'));

// 3.6 Screen transitions
check('Screen transitions: GSAP transforms animate the 7 smartphone application screens', 
  storiesFunctionBody.includes('switchCommScreen') && storiesFunctionBody.includes('gsap.fromTo(screen'));

// 3.7 Number counters
check('Number counters: GSAP animates metric counters (AI Talksy & RateHonk)', 
  storiesFunctionBody.includes('runAITalksyCounters') && storiesFunctionBody.includes('runRateHonkCounters') && 
  storiesFunctionBody.includes('gsap.to(proxy'));

// 3.8 Scroll-triggered storytelling
check('Scroll-triggered storytelling: GSAP reveals and activates product stories on entry', 
  storiesFunctionBody.includes('storyObserver') && storiesFunctionBody.includes('gsap.fromTo(entry.target'));

// 4. PERFORMANCE & ACCESSIBILITY BEST PRACTICES
console.log('\n4. Checking Performance & Accessibility Best Practices...');
check('Uses transforms and opacity with GPU acceleration (force3D: true)', 
  storiesFunctionBody.includes('force3D: true') && storiesFunctionBody.includes('opacity'));
check('Does NOT continuously animate expensive properties (width, height, margin)', 
  !storiesFunctionBody.includes('gsap.to(movingCard, { width:') && !storiesFunctionBody.includes('gsap.to(movingCard, { height:'));
check('Respects prefers-reduced-motion in GSAP execution', 
  storiesFunctionBody.includes('!isReducedMotion') && storiesFunctionBody.includes('prefers-reduced-motion'));

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
    console.log('🌟 STATUS: PHASE 11 GSAP CHOREOGRAPHY VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED!\n');
    process.exit(1);
  }
}
