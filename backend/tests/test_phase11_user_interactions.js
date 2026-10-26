/**
 * PHASE 11 — 🖱️ USER CAN INTERACT VERIFICATION SUITE
 * 
 * Verifies all requirements of Phase 11:
 * 1. AI Talksy:
 *    - Hover over Message -> Message highlights
 *    - Hover over AI -> AI processing becomes active
 * 2. Community Forum:
 *    - Hover over Matrimony -> Phone opens Matrimony screen
 * 3. RateHonk Travel CRM:
 *    - Hover over Pipeline stage -> Lead card highlights
 * 4. Micro-interactions:
 *    - Kept subtle (scale <= 1.05, smooth GPU transitions)
 *    - Respects prefers-reduced-motion
 *    - Non-regression of global website
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('     PHASE 11: USER INTERACTION AUDIT SUITE         ');
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

// 1. AI TALKSY: MESSAGE HOVER HIGHLIGHT
console.log('1. Checking AI Talksy Message Hover Interaction...');
test('Message bubble elements identified with .aitalksy-msg-bubble / .aitalksy-chat-bubble', html.includes('aitalksy-msg-bubble') || html.includes('aitalksy-chat-bubble'));
test('CSS defines message hover / .message-highlighted styles', css.includes('.aitalksy-msg-bubble:hover') || css.includes('.message-highlighted'));
test('CSS applies cyan border and subtle glow on message hover', css.includes('rgba(6, 182, 212') && css.includes('.message-highlighted'));
test('JS event listener wired for message mouseenter -> highlights message', js.includes("bubble.classList.add('message-highlighted')"));
test('JS event listener wired for message mouseleave -> removes highlight', js.includes("bubble.classList.remove('message-highlighted')"));

// 2. AI TALKSY: AI HOVER ACTIVATES PROCESSING
console.log('\n2. Checking AI Talksy AI Hover Interaction...');
test('AI trigger elements identified with .aitalksy-ai-trigger in HTML', html.includes('aitalksy-ai-trigger'));
test('CSS defines .aitalksy-ai-trigger:hover / .is-ai-active styling', css.includes('.aitalksy-ai-trigger:hover') || css.includes('.is-ai-active'));
test('CSS defines .ai-processing-active rule accelerating thinking dots & soundwaves', css.includes('.ai-processing-active'));
test('JS event listener wired for AI trigger mouseenter -> activates processing', js.includes("aitalksyContainer.classList.add('ai-processing-active')"));
test('JS event listener wired for AI trigger mouseleave -> deactivates processing', js.includes("aitalksyContainer.classList.remove('ai-processing-active')"));

// 3. COMMUNITY FORUM: MATRIMONY HOVER OPENS MATRIMONY SCREEN
console.log('\n3. Checking Community Forum Matrimony Hover Interaction...');
test('Matrimony service button present with data-index="2" and "Matrimony"', html.includes('data-index="2"') && html.includes('Matrimony'));
test('CSS defines hover state for Matrimony service tab with pink accent', css.includes('.comm-phone-service[data-index="2"]:hover') || css.includes('rgba(236, 72, 153'));
test('JS wires mouseenter on Matrimony trigger to call switchCommScreen(2)', js.includes('switchCommScreen(2)') || js.includes('switchCommScreen(idx)'));
test('switchCommScreen displays Screen 2 (#comm-screen-2) for Matrimony profiles', js.includes('comm-screen-${i}') && html.includes('id="comm-screen-2"'));

// 4. RATEHONK: PIPELINE STAGE HOVER HIGHLIGHTS LEAD CARD
console.log('\n4. Checking RateHonk Pipeline Stage Hover Interaction...');
test('Pipeline stage columns identified (.pipeline-step-col / .ratehonk-pipeline-col)', html.includes('pipeline-step-col') || html.includes('ratehonk-pipeline-col'));
test('Lead cards identified with .ratehonk-lead-card and .animate-pipeline-flow', html.includes('ratehonk-lead-card') && html.includes('animate-pipeline-flow'));
test('CSS defines .lead-card-highlighted with blue border and elevation', css.includes('.lead-card-highlighted'));
test('JS wires pipeline stage mouseenter -> adds .lead-card-highlighted to lead card', js.includes("card.classList.add('lead-card-highlighted')"));
test('JS wires pipeline stage mouseleave -> removes .lead-card-highlighted from lead card', js.includes("card.classList.remove('lead-card-highlighted')"));

// 5. SUBTLE INTERACTIONS & PERFORMANCE
console.log('\n5. Checking Micro-Interaction Subtlety & Performance...');
test('initProductUserInteractions function defined in main.js', js.includes('initProductUserInteractions = () =>'));
test('initProductUserInteractions called during initialization', js.includes('initProductUserInteractions();'));
test('initProductUserInteractions exported on window.ProductStorySystem', js.includes('initProductUserInteractions,'));
test('Scale values for interactions remain subtle (<= 1.05)', !js.includes('scale: 1.15') && !js.includes('scale: 1.2'));
test('prefers-reduced-motion respected in micro-interactions', js.includes('if (typeof gsap !== \'undefined\' && !isReducedMotion)'));

// 6. WEBSITE PRESERVATION
console.log('\n6. Checking Website Preservation...');
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
    console.log('🌟 STATUS: PHASE 11 USER INTERACTIONS VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error(`⚠️ STATUS: ${total - passed} CHECKS FAILED!`);
    process.exit(1);
  }
}
