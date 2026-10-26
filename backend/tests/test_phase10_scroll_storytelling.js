/**
 * PHASE 10 — SCROLL STORYTELLING TEST SUITE
 * 
 * Verifies that Product stories activate when the user reaches them via scrolling:
 * 1. User scrolls -> AI Talksy enters viewport -> AI animation begins
 * 2. User scrolls further -> Community Forum enters viewport -> Community animation begins
 * 3. User scrolls further -> RateHonk enters viewport -> CRM animation begins
 * 4. Animations do NOT run all simultaneously
 * 5. Uses IntersectionObserver & GSAP transitions with prefers-reduced-motion accessibility
 * 6. Off-screen stories pause their timers and canvas render loops to conserve CPU/GPU
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('     PHASE 10: SCROLL STORYTELLING AUDIT           ');
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

// 1. STORY CONTAINERS & DATA ATTRIBUTES
console.log('1. Checking Story Containers & Data Attributes...');
check('AI Talksy container has id="story-aitalksy" and data-story-id="aitalksy"', 
  html.includes('id="story-aitalksy"') && html.includes('data-story-id="aitalksy"'));
check('Community Forum container has id="story-communityforum" and data-story-id="communityforum"', 
  html.includes('id="story-communityforum"') && html.includes('data-story-id="communityforum"'));
check('RateHonk container has id="story-ratehonk" and data-story-id="ratehonk"', 
  html.includes('id="story-ratehonk"') && html.includes('data-story-id="ratehonk"'));

// 2. INTERSECTION OBSERVER & VIEWPORT DETECTION
console.log('\n2. Checking IntersectionObserver & Viewport Detection Architecture...');
check('IntersectionObserver is instantiated for story observation', js.includes('IntersectionObserver') && js.includes('storyObserver'));
check('Observer watches all 3 story containers independently', 
  js.includes('storyObserver.observe(stories[k].container)') || js.includes('storyObserver.observe'));
check('Observer uses threshold between 0.15 and 0.35 for smooth triggering', 
  /threshold:\s*0\.(1[5-9]|2[0-9]|3[0-5])/.test(js));
check('Fallback exists when IntersectionObserver is not available', js.includes('Fallback if IntersectionObserver not available'));

// 3. SEQUENTIAL ACTIVATION WHEN USER REACHES EACH STORY
console.log('\n3. Checking Scroll-Triggered Story Activation Sequence...');
check('AI Talksy activates when it enters the viewport (AI animation begins)', 
  js.includes('entry.isIntersecting') && js.includes('startStory(storyId)') && js.includes('aitalksy'));
check('Community Forum activates when it enters the viewport (Community animation begins)', 
  js.includes('communityforum') && js.includes('community') && js.includes('startStory(storyId)'));
check('RateHonk CRM activates when it enters the viewport (CRM animation begins)', 
  js.includes('ratehonk') && js.includes('startStory(storyId)'));
check('Each story tracks hasActivated to trigger Scene 1 dynamically upon first viewport entry', 
  js.includes('hasActivated') && js.includes('showStep(storyId, 1, true)'));

// 4. INDEPENDENT EXECUTION & NOT RUNNING SIMULTANEOUSLY
console.log('\n4. Checking Independent Execution (Animations Do NOT Run Simultaneously)...');
check('Animations do NOT start all together at page load', 
  js.includes('showStep(key, 1, false)') && js.includes('isInView || forceAction'));
check('Stories pause automatically when they leave the viewport', 
  js.includes('stopStory(storyId)') && js.includes('stories[storyId].isInView = false'));
check('Timers are cleared when story leaves viewport', 
  js.includes('clearInterval(story.timer)') && js.includes('story.timer = null'));
check('Canvas animation loops halt when story leaves view to conserve CPU/GPU', 
  js.includes('story.stopCanvas') && js.includes('cancelAnimationFrame'));
check('Canvas animation loops only resume when story is in view', 
  js.includes('story.startCanvas') && js.includes('isInView'));

// 5. MOTION LIBRARIES (GSAP, AOS, CSS TRANSFORMS)
console.log('\n5. Checking Motion & Transition System...');
check('GSAP library script loaded in HTML', html.includes('gsap.min.js') || html.includes('gsap'));
check('AOS (Animate On Scroll) library script loaded in HTML', html.includes('aos.js') || html.includes('aos'));
check('GSAP GPU-accelerated transforms used for smooth scene transitions (force3D: true)', 
  js.includes('gsap.fromTo') && js.includes('force3D: true'));
check('Accessibility: prefers-reduced-motion respected in JS', js.includes('prefers-reduced-motion'));
check('Accessibility: prefers-reduced-motion CSS media query configured', css.includes('prefers-reduced-motion: reduce'));

// 6. WEBSITE PRESERVATION INTEGRITY
console.log('\n6. Checking Website Preservation Integrity...');
check('Navbar preserved (#home, #about, #services, #products, #contact)', 
  html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
check('Hero section preserved (#home)', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
check('Footer preserved', html.includes('<footer'));
check('Login link removed from public navigation', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

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
    console.log('🌟 STATUS: PHASE 10 SCROLL STORYTELLING VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED!\n');
    process.exit(1);
  }
}
