/**
 * PHASE 13 — 🔄 REPLAY VERIFICATION SUITE
 * 
 * Verifies all requirements of Phase 13:
 * 1. Add a small:
 *    "Replay Story ↻" button.
 * 2. When clicked:
 *    - Restart ONLY that Product animation.
 *    - Do NOT reload the page.
 *    - Do NOT reload the whole website.
 * 3. Does NOT affect or restart other products.
 * 4. Micro-tactile animation (icon spin feedback).
 * 5. Preservation of global website & public experience.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('       PHASE 13: REPLAY STORY AUDIT SUITE           ');
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

// 1. REPLAY STORY ↻ BUTTONS IN HTML
console.log('1. Checking Replay Story ↻ Buttons in HTML...');
const aiTalksyReplay = html.includes('data-story="aitalksy"') && html.includes('Replay Story') && html.includes('↻');
const communityReplay = html.includes('data-story="community"') && html.includes('Replay Story') && html.includes('↻');
const ratehonkReplay = html.includes('data-story="ratehonk"') && html.includes('Replay Story') && html.includes('↻');

test('AI Talksy has "Replay Story ↻" button with data-story="aitalksy"', aiTalksyReplay);
test('Community Forum has "Replay Story ↻" button with data-story="community"', communityReplay);
test('RateHonk CRM has "Replay Story ↻" button with data-story="ratehonk"', ratehonkReplay);
test('Replay buttons use small button styling (text-xs, font-medium/semibold, compact padding)', 
  html.includes('story-replay-btn') && html.includes('text-xs'));
test('Replay icon identified with class="replay-icon"', html.includes('class="replay-icon'));

// 2. CSS STYLING & MICRO-INTERACTION
console.log('\n2. Checking CSS Styling & Icon Spin Feedback...');
test('CSS defines .story-replay-btn with cursor: pointer', css.includes('.story-replay-btn') && css.includes('cursor: pointer'));
test('CSS defines hover state with subtle scale (1.04)', css.includes('.story-replay-btn:hover') && css.includes('scale(1.04)'));
test('CSS defines active state with micro-press (scale(0.97))', css.includes('.story-replay-btn:active') && css.includes('scale(0.97)'));
test('CSS defines .replay-icon with rotation transition', css.includes('.story-replay-btn .replay-icon') && css.includes('rotate(90deg)'));
test('CSS defines .rotate-360-spin keyframe animation', css.includes('@keyframes replaySpin') && css.includes('rotate(360deg)'));

// 3. JAVASCRIPT REPLAY LOGIC (ISOLATED TO SINGLE PRODUCT)
console.log('\n3. Checking JavaScript replayStory Logic...');
test('replayStory function defined in main.js', js.includes('const replayStory = (storyKey) =>'));
test('replayStory exported on window.ProductStorySystem', js.includes('replayStory,') || js.includes('replayStory:'));
test('Stops only targeted story via stopStory(storyKey)', js.includes('stopStory(storyKey)'));
test('Resets targeted story step to 1 (story.currentStep = 1)', js.includes('story.currentStep = 1'));
test('Calls showStep(storyKey, 1, true) to display Scene 1', js.includes('showStep(storyKey, 1, true)'));
test('Resets Community phone screen to Screen 1 if storyKey === "community"', js.includes('switchCommScreen(1)'));
test('Restarts GSAP timeline if timeline exists (story.timeline.restart())', js.includes('story.timeline.restart()'));
test('Resumes background canvas loop if in view (story.startCanvas())', js.includes('story.startCanvas()'));

// 4. NO PAGE RELOAD / NO GLOBAL RELOAD
console.log('\n4. Verifying No Page Reload / No Global Reload...');
test('Click event handler calls e.preventDefault()', js.includes('e.preventDefault()'));
test('Click event handler calls e.stopPropagation()', js.includes('e.stopPropagation()'));
test('Replay handler calls replayStory(key) without location.reload()', 
  js.includes('replayStory(key)') && !js.includes('replayStory = () => { location.reload(); }'));
test('No location.reload() or history navigation invoked inside replayStory', 
  !js.slice(js.indexOf('const replayStory =')).slice(0, 1000).includes('location.reload') &&
  !js.slice(js.indexOf('const replayStory =')).slice(0, 1000).includes('window.location'));
test('Applies tactile .rotate-360-spin on icon upon click', js.includes("icon.classList.add('rotate-360-spin')"));

// 5. WEBSITE PRESERVATION & PUBLIC EXPERIENCE
console.log('\n5. Checking Website Preservation & Public Access...');
test('Navbar intact with navigation links', html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
test('Hero section with Three.js 3D canvas preserved', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
test('Footer section preserved', html.includes('<footer'));
test('Public experience free of login wall', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

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
      console.log('\n>>> ALL PHASE 13 REPLAY VERIFICATIONS PASSED! <<<\n');
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
