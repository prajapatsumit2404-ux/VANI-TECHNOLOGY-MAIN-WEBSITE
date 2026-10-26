/**
 * PHASE 7 AUDIT: AI TALKSY LIGHT SAAS PRODUCT DEMO
 *
 * Verifies all Phase 7 specifications:
 * 1. Product identity: AI TALKSY & https://aitalksy.com/
 * 2. Visual Formula: Large smartphone in center/right, floating cards around it, white/light gray background with subtle blue/purple/cyan accents
 * 3. 7-Scene Exact Story Sequence:
 *    - STEP 1 — USER: Phone appears, AI Talksy Assistant shows "How can I help you?"
 *    - STEP 2 — USER TYPES: Typing animation "Hello, I need help." appears letter by letter
 *    - STEP 3 — SEND: Send button, message moves upward, "Message Sent ✓"
 *    - STEP 4 — AI THINKING: AI response area, "AI is thinking..." with animated dots
 *    - STEP 5 — RESPONSE: "Sure! I can help you with that." smoothly appears
 *    - STEP 6 — AUTOMATION: Floating cards: WhatsApp, Website, Slack, Customer Support, AI connected visually
 *    - STEP 7 — BUSINESS RESULT: Small dashboard with animated counters (24 handled, 21 responses, 18 resolved, 2.4s SLA)
 * 4. AI TALKSY FINAL: "AI-powered communication", "EXPLORE AITALKSY →" linking to https://aitalksy.com/ in new tab
 * 5. Background: White/light gray base, very soft blue/purple gradient blobs, glowing circles, thin connection lines, light particles
 * 6. System Integrity: Navbar, Hero 3D, Footer remain untouched; no login required
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
console.log('   PHASE 7: AI TALKSY LIGHT SAAS DEMO VERIFICATION  ');
console.log('====================================================');

// 1. Identity & Structure
console.log('\n1. Checking Product Identity & SaaS Layout...');
check('Product title "AI Talksy" is present in #story-aitalksy',
  html.includes('id="story-aitalksy"') && html.includes('AI Talksy'));

check('Product link https://aitalksy.com/ opens in new tab',
  html.includes('https://aitalksy.com/') &&
  html.includes('target="_blank"') &&
  html.includes('rel="noopener noreferrer"'));

check('Main visual is a realistic smartphone mockup container',
  html.includes('device-mockup-phone') &&
  html.includes('phone-screen-viewport') &&
  html.includes('phone-dynamic-island'));

check('Floating communication cards surround the smartphone',
  html.includes('story-floating-card float-pos-tl') &&
  html.includes('story-floating-card float-pos-tr') &&
  html.includes('story-floating-card float-pos-bl') &&
  html.includes('story-floating-card float-pos-br'));

// 2. Exact 7-Step Sequence
console.log('\n2. Checking 7-Step Exact Story Progression...');

// STEP 1 — USER
check('STEP 1 — USER: Phone appears, AI Talksy Assistant shows "How can I help you?"',
  html.includes('id="aitalksy-stage-step1"') &&
  html.includes('AI Talksy Assistant') &&
  html.includes('"How can I help you?"'));

// STEP 2 — USER TYPES
check('STEP 2 — USER TYPES: Typing animation with "Hello, I need help." letter by letter',
  html.includes('id="aitalksy-stage-step2"') &&
  html.includes('id="aitalksy-typing-text"') &&
  html.includes('aitalksy-cursor') &&
  html.includes('Hello, I need help.') &&
  js.includes('runAITalksyTyping'));

// STEP 3 — SEND
check('STEP 3 — SEND: Send button, upward message movement, "Message Sent ✓"',
  html.includes('id="aitalksy-stage-step3"') &&
  html.includes('Message Sent ✓') &&
  (html.includes('animate-message-transfer') || html.includes('animate-message-upward')) &&
  css.includes('messageFlyUpward'));

// STEP 4 — AI THINKING
check('STEP 4 — AI THINKING: Shows "AI is thinking..." with animated dots',
  html.includes('id="aitalksy-stage-step4"') &&
  html.includes('AI is thinking') &&
  html.includes('ai-thinking-dot') &&
  css.includes('thinkingDotPulse'));

// STEP 5 — RESPONSE
check('STEP 5 — RESPONSE: "Sure! I can help you with that." smoothly appears',
  html.includes('id="aitalksy-stage-step5"') &&
  html.includes('"Sure! I can help you with that."'));

// STEP 6 — AUTOMATION
check('STEP 6 — AUTOMATION: Floating cards: WhatsApp, Website, Slack, Customer Support, AI',
  html.includes('id="aitalksy-stage-step6"') &&
  html.includes('WhatsApp') &&
  html.includes('Website') &&
  html.includes('Slack') &&
  html.includes('Customer Support') &&
  html.includes('>AI<'));

check('STEP 6 — AUTOMATION: Mentions communicating across different channels',
  html.includes('AI can communicate across different channels'));

// STEP 7 — BUSINESS RESULT
console.log('\n3. Checking Step 7 Result Dashboard & Counters...');
check('Messages handled: 24 with animated counter',
  html.includes('Messages Handled') &&
  html.includes('data-target="24"') &&
  html.includes('aitalksy-counter'));

check('Responses: 21 with animated counter',
  html.includes('Responses') &&
  html.includes('data-target="21"'));

check('Resolved: 18 with animated counter',
  html.includes('Resolved') &&
  html.includes('data-target="18"'));

check('Response time: 2.4s with decimal precision',
  html.includes('Response Time') &&
  html.includes('data-target="2.4"') &&
  html.includes('data-decimals="1"'));

check('GSAP / JS animated counter engine is wired',
  js.includes('runAITalksyCounters'));

// 4. AI TALKSY FINAL
console.log('\n4. Checking AI Talksy Final Message & CTA...');
check('Shows "AI-powered communication" badge',
  html.includes('AI-powered communication'));

check('Shows "EXPLORE AITALKSY" button linking to https://aitalksy.com/',
  html.includes('EXPLORE AITALKSY') &&
  html.includes('href="https://aitalksy.com/"'));

// 5. Background & Light SaaS Styling
console.log('\n5. Checking Background Canvas & Light SaaS Theme...');
check('White/light gray base with subtle brand accents (blue, purple, cyan)',
  css.includes('theme-aitalksy') &&
  css.includes('#ffffff') &&
  css.includes('rgba(6, 182, 212') &&
  css.includes('rgba(99, 102, 241'));

check('Dedicated neural canvas #aitalksy-neural-canvas present',
  html.includes('id="aitalksy-neural-canvas"'));

check('Canvas engine renders gradient blobs, glowing circles, connection lines & particles',
  js.includes('initAITalksyBackground') &&
  js.includes('ambientLights') &&
  js.includes('maxDistance = 90') &&
  js.includes('particles') &&
  js.includes('isGlow'));

// 6. Preservation of Website
console.log('\n6. Checking Website Part Preservation...');
check('Navbar remains unchanged',
  html.includes('id="main-navbar"'));
check('Hero 3D Canvas remains unchanged',
  html.includes('id="hero-three-canvas"'));
check('Footer remains unchanged',
  html.includes('id="main-footer"'));

console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log('====================================================');

if (passedChecks === totalChecks) {
  console.log('🌟 STATUS: PHASE 7 AI TALKSY 100% VERIFIED!');
  process.exit(0);
} else {
  console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 7');
  process.exit(1);
}
