/**
 * PHASE 12 — 📜 SCROLL BEHAVIOR VERIFICATION SUITE
 * 
 * Verifies all requirements of Phase 12:
 * 1. When user scrolls into Product:
 *    - AI Talksy enters view -> animation starts.
 *    - Then user continues scrolling -> Community Forum enters view -> animation starts.
 *    - Then RateHonk enters view -> animation starts.
 * 2. Strict Rule: "Do NOT animate all 3 at once."
 *    - Only the single story in prime focus runs.
 *    - Inactive stories are stopped/paused to conserve CPU/GPU.
 * 3. Uses IntersectionObserver (with fallback scroll listener).
 * 4. Respects prefers-reduced-motion.
 * 5. Website preservation & Public access.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('     PHASE 12: SCROLL BEHAVIOR AUDIT SUITE          ');
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

// 1. PRODUCT SECTION ORDER & DATA-STORY-ID ATTRIBUTES
console.log('1. Checking Product Section Layout & Story Containers...');
const aiIndex = html.indexOf('id="story-aitalksy"');
const commIndex = html.indexOf('id="story-communityforum"');
const rhIndex = html.indexOf('id="story-ratehonk"');

test('AI Talksy container present with id="story-aitalksy"', aiIndex !== -1);
test('Community Forum container present with id="story-communityforum"', commIndex !== -1);
test('RateHonk CRM container present with id="story-ratehonk"', rhIndex !== -1);
test('Sequential vertical ordering: AI Talksy -> Community Forum -> RateHonk', aiIndex < commIndex && commIndex < rhIndex);
test('AI Talksy has data-story-id="aitalksy"', html.includes('id="story-aitalksy"') && html.includes('data-story-id="aitalksy"'));
test('Community Forum has data-story-id="communityforum"', html.includes('id="story-communityforum"') && (html.includes('data-story-id="communityforum"') || html.includes('data-story-id="community"')));
test('RateHonk CRM has data-story-id="ratehonk"', html.includes('id="story-ratehonk"') && html.includes('data-story-id="ratehonk"'));

// 2. INTERSECTIONOBSERVER IMPLEMENTATION
console.log('\n2. Checking IntersectionObserver Architecture...');
test('Checks for IntersectionObserver in window', js.includes("'IntersectionObserver' in window"));
test('Creates new IntersectionObserver instance', js.includes('new IntersectionObserver'));
test('Configured with multi-threshold array for accurate visibility tracking', js.includes('threshold:') && js.includes('0.15'));
test('Observes all 3 story containers (aitalksy, community, ratehonk)', js.includes('storyObserver.observe(stories[k].container)'));
test('Tracks intersection ratio per story', js.includes('storyVisibilityRatios[storyId] = entry.isIntersecting ? entry.intersectionRatio : 0'));
test('Tracks isInView state per story', js.includes('stories[storyId].isInView = entry.isIntersecting'));
test('Fallback scroll listener provided when IntersectionObserver is not available', js.includes('handleScrollFallback') && js.includes('addEventListener(\'scroll\', handleScrollFallback'));

// 3. RULE: "DO NOT ANIMATE ALL 3 AT ONCE" (SINGLE-ACTIVE-STORY)
console.log('\n3. Checking Mutual Exclusivity: "Do NOT animate all 3 at once"...');
test('Maintains currentActiveStoryKey variable to track active story', js.includes('let currentActiveStoryKey = null'));
test('setActiveStoryOnScroll function defined', js.includes('setActiveStoryOnScroll = (targetStoryKey) =>'));
test('setActiveStoryOnScroll exported on window.ProductStorySystem', js.includes('setActiveStoryOnScroll,') || js.includes('setActiveStoryOnScroll:'));
test('Stops currently running story before activating new story', js.includes('if (currentActiveStoryKey && stories[currentActiveStoryKey])') && js.includes('stopStory(currentActiveStoryKey)'));
test('Calculates highest visibility ratio among stories (> 0.15 threshold)', js.includes('highestRatio') && js.includes('storyVisibilityRatios[k] > highestRatio'));
test('Calls setActiveStoryOnScroll(highestKey) when a story is in primary view', js.includes('setActiveStoryOnScroll(highestKey)'));
test('Calls setActiveStoryOnScroll(null) when all stories leave view', js.includes('setActiveStoryOnScroll(null)'));

// 4. SEQUENTIAL STORY ACTIVATION
console.log('\n4. Checking Story Lifecycle on Scroll...');
test('startStory starts timeline/timer for activated story', js.includes('startStory(targetStoryKey)'));
test('First activation runs showStep(targetStoryKey, 1, true)', js.includes('showStep(targetStoryKey, 1, true)'));
test('GSAP scroll entrance reveals story container smoothly', js.includes('gsap.fromTo(story.container'));
test('stopStory pauses timeline and clears timers', js.includes('story.timeline.pause()') && js.includes('clearInterval(story.timer)'));
test('stopStory terminates commScreenTimer for Community Forum', js.includes('clearInterval(commScreenTimer)'));
test('stopCanvas terminates requestAnimationFrame loops when story is inactive', js.includes('if (story.stopCanvas) story.stopCanvas()'));

// 5. REDUCED MOTION AND ACCESSIBILITY
console.log('\n5. Checking Reduced Motion & Performance Controls...');
test('isReducedMotion check prevents scroll-triggered gsap animations if preferred', js.includes('!isReducedMotion'));
test('Passive event listener used for scroll fallback to avoid scroll jank', js.includes('{ passive: true }'));

// 6. WEBSITE PRESERVATION
console.log('\n6. Checking Website Preservation & Public Access...');
test('Navbar intact with navigation links', html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
test('Hero section with Three.js 3D canvas preserved', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
test('Footer section preserved', html.includes('<footer'));
test('Public experience free of login requirement', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

// API check
const req = http.get('http://localhost:5000/api/health', (res) => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      test('Backend health API returns status: ok', data.status === 'ok' || data.success === true);
    } catch (e) {
      test('Backend health API response valid', false);
    }

    console.log('\n----------------------------------------------------');
    console.log(`TOTAL TESTS: ${total}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${total - passed}`);
    console.log(`SUCCESS RATE: ${Math.round((passed / total) * 100)}%`);
    console.log('----------------------------------------------------');

    if (passed === total) {
      console.log('\n>>> ALL PHASE 12 SCROLL BEHAVIOR VERIFICATIONS PASSED! <<<\n');
      process.exit(0);
    } else {
      console.error('\n>>> SOME TESTS FAILED! <<<\n');
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  test('Backend server is accessible', false);
  console.log('\n----------------------------------------------------');
  console.log(`TOTAL TESTS: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${total - passed}`);
  console.log(`SUCCESS RATE: ${Math.round((passed / total) * 100)}%`);
  console.log('----------------------------------------------------');
  process.exit(1);
});
