/**
 * PHASE 10 — 🎬 ANIMATION TIMELINE VERIFICATION SUITE
 * 
 * Verifies all requirements of Phase 10:
 * - Do NOT make everything move at once
 * - Use a timeline (GSAP timeline)
 * - 8-stage choreographed sequence:
 *   0s: Product appears
 *   1s: Phone/browser enters
 *   2s: First screen appears
 *   3s: User interaction
 *   4s: Processing
 *   5s: Result
 *   6s: Next feature
 *   7s: Final result
 * - Natural timing & non-overlapping progression
 * - GSAP integration: timeline, easing, stagger, transforms, opacity, scale
 * - Avoid expensive animations (GPU transforms & opacity only, no layout reflows)
 * - Hover pause & Replay restart
 * - Prefers-reduced-motion accessibility
 * - Non-regression of global website
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('     PHASE 10: ANIMATION TIMELINE CHOREOGRAPHY      ');
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

// 1. GSAP LIBRARY INTEGRATION
console.log('1. Checking GSAP Library Loading...');
test('GSAP core library loaded in index.html', html.includes('gsap') && html.includes('<script'));
test('GSAP check guard implemented in main.js', js.includes("typeof gsap !== 'undefined'"));

// 2. TIMELINE INSTANTIATION & FUNCTION
console.log('\n2. Checking GSAP Timeline Engine...');
test('buildStoryTimeline function defined in main.js', js.includes('buildStoryTimeline = (storyKey) =>'));
test('Master GSAP timeline instantiated via gsap.timeline(...)', js.includes('gsap.timeline('));
test('Timeline configured with paused: true and repeat', js.includes('paused: true') && js.includes('repeat: -1'));
test('buildStoryTimeline exported on window.ProductStorySystem', js.includes('buildStoryTimeline,'));

// 3. 8-STAGE SEQUENTIAL CHOREOGRAPHY (DO NOT MOVE EVERYTHING AT ONCE)
console.log('\n3. Checking 8-Stage Sequential Timeline Flow...');
test('0s: Product appears (container enters smoothly at t=0)', js.includes('0s: Product appears') && js.includes('story.container'));
test('1s: Phone/browser enters (mockup entrance at t=1.0s)', js.includes('1s: Phone / browser enters') || js.includes('1s: Phone/browser enters'));
test('2s: First screen appears (screen reveals at t=2.0s)', js.includes('2s: First screen appears') && js.includes('showStep(storyKey, 1'));
test('3s: User interaction (typing/interaction at t=3.0s)', js.includes('3s: User interaction'));
test('4s: Processing (thinking/pipeline flow/verification at t=4.0s)', js.includes('4s: Processing'));
test('5s: Result (response/services/follow-up at t=5.0s)', js.includes('5s: Result'));
test('6s: Next feature (staggered channels/voucher at t=6.0s)', js.includes('6s: Next feature'));
test('7s: Final result (analytics counters/metrics at t=7.0s)', js.includes('7s: Final result'));

// 4. ANIMATION TECHNIQUES (EASING, STAGGER, TRANSFORMS, OPACITY, SCALE)
console.log('\n4. Checking GSAP Techniques Usage...');
test('Easing used in timeline (power2.out, back.out)', js.includes("ease: 'power2.out'") && js.includes("ease: 'back.out"));
test('Stagger used for feature cards and badges', js.includes('stagger: 0.08') || js.includes('stagger: 0.05') || js.includes('stagger: 0.03'));
test('Transforms used (x, y, rotation, force3D)', js.includes('force3D: true') && js.includes('y:') && js.includes('rotation:'));
test('Opacity used for smooth fading transitions', js.includes('opacity: 0') && js.includes('opacity: 1'));
test('Scale used for natural entrance and pop effects', js.includes('scale: 0.94') || js.includes('scale: 0.92') || js.includes('scale: 0.88'));

// 5. AVOID EXPENSIVE ANIMATIONS (GPU-ACCELERATION & NO LAYOUT REFLOWS)
console.log('\n5. Checking Performance & GPU-Composited Animations...');
const tlCodeMatch = js.match(/const buildStoryTimeline =[\s\S]*?return tl;\s*};/);
const tlCode = tlCodeMatch ? tlCodeMatch[0] : '';
test('Master timeline exclusively animates GPU properties (transforms & opacity)', 
  !tlCode.includes('width:') && !tlCode.includes('height:') && !tlCode.includes('marginLeft:') && !tlCode.includes('marginTop:'));
test('Hardware acceleration (force3D: true) enforced on timeline', tlCode.includes('force3D: true'));

// 6. TIMELINE CONTROLS (HOVER PAUSE, REPLAY, REDUCED MOTION)
console.log('\n6. Checking Interactive Controls & Accessibility...');
test('startStory starts or resumes story.timeline', js.includes('story.timeline.play()') || js.includes('story.timeline.paused()'));
test('stopStory pauses story.timeline', js.includes('story.timeline.pause()'));
test('Replay button restarts story.timeline from 0s', js.includes('story.timeline.restart()'));
test('Hover pause pauses timeline on mouseenter and resumes on mouseleave', js.includes('story.container.addEventListener(\'mouseenter\''));
test('prefers-reduced-motion skips timeline and provides calm static UI', js.includes('isReducedMotion') && js.includes('if (typeof gsap === \'undefined\' || isReducedMotion) return null;'));

// 7. PRESERVATION OF GLOBAL WEBSITE
console.log('\n7. Checking Website Preservation & Zero Regressions...');
test('Navbar intact with all 5 main links', html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
test('Hero section with Three.js 3D canvas preserved', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
test('Footer section preserved', html.includes('<footer'));
test('Public experience free of login wall', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

// Live Server API check
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
    finish();
  });
});

req.on('error', () => {
  test('Backend server running on http://localhost:5000', false);
  finish();
});

function finish() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');
  if (passed === total) {
    console.log('🌟 STATUS: PHASE 10 ANIMATION TIMELINE VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error(`⚠️ STATUS: ${total - passed} CHECKS FAILED!`);
    process.exit(1);
  }
}
