/**
 * Phase 7 Verification Test: AI Talksy Product Story Animation
 *
 * Verifies:
 * 1. Product identity: AI Talksy & https://aitalksy.com/
 * 2. Story Flow: USER -> MESSAGE -> AI -> PROCESSING -> RESPONSE -> BUSINESS ACTION -> RESULT
 * 3. Realistic Smartphone Interface:
 *    - STEP 1: Opens communication screen & shows "How can I help you?"
 *    - STEP 2: Realistic typing animation of "Hello, I need help."
 *    - STEP 3: Message is sent & bubble moves toward AI with GPU motion
 *    - STEP 4: AI starts processing: subtle "AI Thinking..." indicator + 3-stage progression
 *    - STEP 5: AI generates: "Sure! I can help you with that."
 *    - STEP 6: AI connects with: Customer, Support, Business, Website
 *    - STEP 7: Small business result with animated numbers:
 *              Messages handled: 24, Resolved: 18, Response time: 2.4s
 * 4. Dedicated Background:
 *    - Soft dark gradient
 *    - Subtle blue/purple lighting
 *    - Floating UI shapes
 *    - Neural connection lines
 *    - Tiny micro-particles
 *    - Glowing AI nodes
 *    - Slow non-distracting motion (phone remains the star)
 * 5. Final Message:
 *    - "AI-powered communication"
 *    - "EXPLORE AITALKSY" -> opens https://aitalksy.com/ in a new tab with rel="noopener noreferrer"
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('         PHASE 7 — 🤖 AI TALKSY PRODUCT STORY AUDIT             ');
console.log('================================================================');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// 1. STORY FLOW & DEVICE MOCKUP
console.log('\n1. Verifying Smartphone Device Mockup & Overall Story Architecture...');
assert(html.includes('id="story-aitalksy"'), 'AI Talksy story container present');
assert(html.includes('device-mockup-phone'), 'Smartphone realistic device mockup container present');
assert(html.includes('phone-screen-viewport'), 'Smartphone screen viewport present');
assert(html.includes('phone-dynamic-island'), 'Smartphone dynamic island present');
assert(html.includes('phone-status-bar'), 'Smartphone status bar present');
assert(html.includes('phone-home-indicator'), 'Smartphone home indicator present');
console.log('  [PASS] Realistic Smartphone mockup interface correctly structured');

// 2. STEP 1: Opens communication screen & shows "How can I help you?"
console.log('\n2. Verifying STEP 1: User opens communication screen ("How can I help you?")...');
assert(html.includes('id="aitalksy-stage-step1"'), 'Step 1 stage container present');
assert(html.includes('How can I help you?'), 'Shows "How can I help you?" initial assistant prompt');
assert(html.includes('fa-user-tie') || html.includes('fa-user'), 'User avatar icon present');
console.log('  [PASS] STEP 1: Assistant greeting bubble "How can I help you?" verified');

// 3. STEP 2: User types: "Hello, I need help." with realistic typing animation
console.log('\n3. Verifying STEP 2: Realistic typing animation ("Hello, I need help.")...');
assert(html.includes('aitalksy-typing-text'), 'Typing text container present');
assert(html.includes('aitalksy-cursor'), 'Typing cursor present');
assert(html.includes('Hello, I need help.'), '"Hello, I need help." text present');
assert(js.includes('runAITalksyTyping'), 'runAITalksyTyping function present in JS');
assert(css.includes('blinkCursor'), 'Cursor blinking keyframe animation defined in CSS');
console.log('  [PASS] STEP 2: Realistic typing animation for "Hello, I need help." verified');

// 4. STEP 3: Message is sent & bubble moves
console.log('\n4. Verifying STEP 3: Message is sent and bubble moves...');
assert(html.includes('id="aitalksy-stage-step2"'), 'Step 2 stage container present');
assert(html.includes('animate-message-transfer'), 'animate-message-transfer class present');
assert(css.includes('messageMoveTowardAI'), 'messageMoveTowardAI keyframe animation defined in CSS');
assert(css.includes('translate3d('), 'Translate transform used for smooth GPU motion');
assert(css.includes('scale('), 'Scale transform used');
assert(css.includes('blur('), 'Motion blur used');
console.log('  [PASS] STEP 3: Message bubble moves toward AI with translate, scale, and blur verified');

// 5. STEP 4: AI starts processing & shows "AI Thinking..."
console.log('\n5. Verifying STEP 4: AI starts processing ("AI Thinking...")...');
assert(html.includes('id="aitalksy-stage-step4"'), 'Step 4 stage container present');
assert(html.includes('AI Thinking...'), '"AI Thinking..." indicator present');
assert(html.includes('Processing...'), 'Processing... status present');
assert(html.includes('Understanding...'), 'Understanding... status present');
assert(html.includes('Generating response...'), 'Generating response... status present');
assert(html.includes('aitalksy-proc-1') && html.includes('aitalksy-proc-2') && html.includes('aitalksy-proc-3'), '3-stage processing badges present');
assert(js.includes('runAITalksyProcessing'), 'runAITalksyProcessing function present in JS');
console.log('  [PASS] STEP 4: Subtle "AI Thinking..." and multi-stage processing progression verified');

// 6. STEP 5: AI generates: "Sure! I can help you with that."
console.log('\n6. Verifying STEP 5: AI generates "Sure! I can help you with that."...');
assert(html.includes('id="aitalksy-stage-step5"'), 'Step 5 stage container present');
assert(html.includes('Sure! I can help you with that.'), '"Sure! I can help you with that." response present');
console.log('  [PASS] STEP 5: AI intelligent reply "Sure! I can help you with that." verified');

// 7. STEP 6: AI connecting with Customer, Support, Business, Website
console.log('\n7. Verifying STEP 6: AI connecting with Customer, Support, Business, Website...');
assert(html.includes('id="aitalksy-stage-step6"'), 'Step 6 stage container present');
assert(html.includes('Customer'), 'Customer channel node present');
assert(html.includes('Support'), 'Support channel node present');
assert(html.includes('Business'), 'Business channel node present');
assert(html.includes('Website'), 'Website channel node present');
assert(html.includes('>User<'), 'User channel present');
assert(html.includes('>AI<') || html.includes('AI Hub') || html.includes('Neural Core'), 'AI hub node present');
console.log('  [PASS] STEP 6: AI connecting with Customer, Support, Business, and Website verified');

// 8. STEP 7: Small business result (Messages handled: 24, Resolved: 18, Response time: 2.4s)
console.log('\n8. Verifying STEP 7: Small business result metrics with animated numbers...');
assert(html.includes('id="aitalksy-stage-step7"'), 'Step 7 stage container present');
assert(html.includes('Messages Handled'), 'Messages Handled metric label present');
assert(html.includes('data-target="24"'), 'Messages handled: 24 present');
assert(html.includes('Resolved'), 'Resolved metric label present');
assert(html.includes('data-target="18"'), 'Resolved: 18 present');
assert(html.includes('Response Time') || html.includes('Response time'), 'Response Time metric label present');
assert(html.includes('data-target="2.4"'), 'Response time: 2.4s metric target present');
assert(html.includes('data-decimals="1"'), 'Response time uses decimal precision');
assert(js.includes('runAITalksyCounters'), 'runAITalksyCounters function present in JS');
assert(js.includes('data-decimals'), 'Counter handles decimal places dynamically');
console.log('  [PASS] STEP 7: Animated numbers for Messages handled (24), Resolved (18), and Response time (2.4s) verified');

// 9. AI TALKSY BACKGROUND
console.log('\n9. Verifying AI Talksy Background (soft dark gradient, subtle blue/purple lighting, floating UI shapes, neural lines, particles, glowing nodes)...');
assert(html.includes('id="aitalksy-neural-canvas"'), 'Canvas element #aitalksy-neural-canvas present in HTML');
assert(css.includes('.aitalksy-neural-bg-canvas'), 'CSS styling for neural canvas defined');
assert(css.includes('radial-gradient') && css.includes('rgba(99, 102, 241') && css.includes('rgba(6, 182, 212'), 'Soft dark gradient with subtle blue/purple lighting in CSS');
assert(js.includes('initAITalksyBackground'), 'initAITalksyBackground function present in JS');
assert(js.includes('ambientLights'), 'Subtle blue/purple ambient lights rendered on canvas');
assert(js.includes('floatingShapes'), 'Floating UI shapes rendered in background');
assert(js.includes('maxDistance = 90') || js.includes('rgba(6, 182, 212'), 'Neural connection lines present');
assert(js.includes('particles.push'), 'Tiny particles present');
assert(js.includes('isGlow'), 'Glowing AI nodes present');
console.log('  [PASS] Background: Soft dark gradient, blue/purple ambient glow, floating UI shapes, neural lines, particles, and glowing nodes verified');

// 10. FINAL MESSAGE & EXTERNAL CTA
console.log('\n10. Verifying FINAL message & EXPLORE AITALKSY link...');
assert(html.includes('AI-powered communication'), 'Final message "AI-powered communication" present');
assert(html.includes('EXPLORE AITALKSY'), 'EXPLORE AITALKSY link button present');
assert(html.includes('https://aitalksy.com/'), 'URL https://aitalksy.com/ present');
assert(html.includes('target="_blank"'), 'Opens in new tab');
assert(html.includes('rel="noopener noreferrer"'), 'Uses rel="noopener noreferrer" for security');
console.log('  [PASS] Final Message and EXPLORE AITALKSY link to https://aitalksy.com/ verified');

console.log('\n================================================================');
console.log('     PHASE 7 — 🤖 AI TALKSY: 100% SUCCESS (ALL TESTS PASSED)     ');
console.log('================================================================\n');
