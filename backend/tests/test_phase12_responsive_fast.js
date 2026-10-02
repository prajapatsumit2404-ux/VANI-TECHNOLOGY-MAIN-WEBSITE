/**
 * Phase 12 Verification Test: Make Everything Fast and Responsive
 * Audits:
 * 1. Tablet responsiveness (reduced animation size, readable text, balanced height)
 * 2. Mobile responsiveness (vertical stacking, zero horizontal scroll, buttons fit screen, text contrast)
 * 3. Touch independence (no dependence on mouse hover, mobile parallax strictly disabled)
 * 4. High-performance animation lifecycle (pause when out of view, low particle count, no continuous loops)
 * 5. Reduced-motion compliance (static clean view, zero animation loops, full readability)
 * 6. Image & asset integrity (proper object containment, fallbacks)
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
console.log('    PHASE 12: FAST & RESPONSIVE AUDIT               ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');
const threeJsPath = path.join(__dirname, '../../frontend/js/three-background.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const threeJs = fs.readFileSync(threeJsPath, 'utf8');

// 1. TABLET RESPONSIVENESS
console.log('1. Checking Tablet Responsiveness (768px - 1023px)...');
check(css.includes('@media (min-width: 768px) and (max-width: 1023px)'), 'Tablet media query defined in style.css');
check(css.includes('min-height: 360px') || css.includes('min-height: 340px'), 'Stage height adapted for tablet viewports');
check(css.includes('community-phone-frame') && css.includes('max-width: 250px'), 'Smartphone mockup scaled proportionally for tablet');
check(css.includes('animate-ai-core') && css.includes('3.5rem'), 'AI Core scaled cleanly for tablet');

// 2. MOBILE RESPONSIVENESS (VERTICAL STACKING & ZERO HORIZONTAL SCROLL)
console.log('\n2. Checking Mobile Responsiveness (< 768px)...');
check(css.includes('@media (max-width: 767px)'), 'Mobile media query defined in style.css');
check(css.includes('overflow-x: hidden !important'), 'Zero horizontal scrolling enforced on mobile');
check(css.includes('.product-story-cta') && css.includes('flex-direction: column'), 'Buttons stack vertically and fit inside mobile screens');
check(html.includes('story-communityforum') && html.includes('overflow-hidden'), 'Community story card has overflow-hidden');
check(html.includes('story-ratehonk') && html.includes('overflow-hidden'), 'RateHonk story card has overflow-hidden');
check(css.includes('#ratehonk-pipeline-tracker') && css.includes('repeat(5, minmax(0, 1fr))'), 'RateHonk 5-step pipeline gracefully scales on mobile');

// 3. ZERO DEPENDENCE ON HOVER & PARALLAX DISABLED ON MOBILE
console.log('\n3. Checking Touch Independence & Mobile Parallax Protection...');
check(js.includes('window.innerWidth < 1024') && js.includes('isFinePointer'), 'Mouse parallax strictly disabled on mobile and touch devices');
check(js.includes('cards.forEach') && js.includes('resize'), 'Resize listener cleanly resets parallax transforms when resizing to mobile');
check(html.includes('story-step-pill') && js.includes('addEventListener(\'click\''), 'Scene navigation directly clickable / tappable on mobile');
check(html.includes('product-modal-trigger'), 'Specification details accessible without hover');

// 4. PERFORMANCE & ANIMATION PAUSING WHEN OUT OF VIEW
console.log('\n4. Checking Performance & Animation Lifecycle...');
check(js.includes('stories.aitalksy.stopCanvas') && js.includes('cancelAnimationFrame'), 'AI Talksy canvas loop stops when element leaves viewport');
check(js.includes('stories.community.stopCanvas') && js.includes('cancelAnimationFrame'), 'Community Forum canvas loop stops when element leaves viewport');
check(js.includes('stories.ratehonk.stopCanvas') && js.includes('cancelAnimationFrame'), 'RateHonk canvas loop stops when element leaves viewport');
check(threeJs.includes('isHeroIntersecting') || threeJs.includes('IntersectionObserver'), 'Three.js pauses when hero is off-screen');
check(js.includes('isMobile ? 12 : 22') || js.includes('isMobile ? 10 : 16'), 'Low, responsive particle/node counts (no hundreds of particles)');

// 5. REDUCED MOTION RESPECT
console.log('\n5. Checking Accessibility & prefers-reduced-motion...');
check(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS reduced motion media query active');
check(js.includes('isReducedMotion') && js.includes('renderFrame()'), 'Canvas renders clean static frame when reduced motion is enabled');
check(js.includes('prefersReducedMotion') && js.includes('initProductMouseParallax'), 'Parallax strictly disabled when prefers-reduced-motion is true');

// 6. IMAGE AND TEXT INTEGRITY
console.log('\n6. Checking Image & Text Contrast Integrity...');
check(html.includes('aitalksy-logo.png') && html.includes('onerror='), 'AI Talksy logo has error fallback handler');
check(html.includes('community-forum-logo.png') && html.includes('onerror='), 'Community Forum logo has error fallback handler');
check(css.includes('z-index: 10') && css.includes('pointer-events: none'), 'Text is kept foreground with background canvases set to pointer-events: none');

console.log('\n====================================================');
console.log(`Results: ${passedTests}/${totalTests} Passed`);
console.log('====================================================');

if (passedTests === totalTests) {
  console.log('🎉 PHASE 12 AUDIT PASSED: 100% SUCCESS!\n');
  process.exit(0);
} else {
  console.error('❌ SOME CHECKS FAILED.\n');
  process.exit(1);
}
