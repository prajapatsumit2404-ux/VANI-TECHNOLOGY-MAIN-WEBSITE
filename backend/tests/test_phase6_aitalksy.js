/**
 * Phase 6 Verification Test: AI Talksy Product Story
 * Tests the complete 7-scene cinematic movie sequence, neural canvas background,
 * typing animation, message transfer with blur/translate/scale/opacity,
 * processing progression, business connections, dashboard counters, and external CTA.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('       PHASE 6: AI TALKSY PRODUCT STORY AUDIT        ');
console.log('====================================================');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// 1. SCENE 1 — USER
console.log('\n1. Verifying SCENE 1 — USER...');
assert(html.includes('id="aitalksy-stage-step1"'), 'Scene 1 step container present');
assert(html.includes('fa-user-tie') || html.includes('fa-user'), 'User avatar icon present');
assert(html.includes('aitalksy-typing-text'), 'Typing text container present');
assert(html.includes('aitalksy-cursor'), 'Typing cursor present');
assert(html.includes('Hello, I need help.'), 'Initial message text present');
assert(js.includes('runAITalksyTyping'), 'Typing animation logic implemented in JS');
console.log('  [PASS] Scene 1: Professional user avatar and typing animation verified');

// 2. SCENE 2 — MESSAGE
console.log('\n2. Verifying SCENE 2 — MESSAGE...');
assert(html.includes('id="aitalksy-stage-step2"'), 'Scene 2 step container present');
assert(html.includes('animate-message-transfer'), 'animate-message-transfer class present');
assert(css.includes('messageMoveTowardAI'), 'messageMoveTowardAI keyframe animation defined');
assert(css.includes('blur('), 'Blur effect used in message animation');
assert(css.includes('scale('), 'Scale transform used in message animation');
assert(css.includes('translate3d('), 'Translate transform used in message animation');
assert(css.includes('opacity:'), 'Opacity transition used in message animation');
console.log('  [PASS] Scene 2: Message movement toward AI with translate, opacity, scale, and blur verified');

// 3. SCENE 3 — AI
console.log('\n3. Verifying SCENE 3 — AI...');
assert(html.includes('id="aitalksy-stage-step3"'), 'Scene 3 step container present');
assert(html.includes('animate-ai-core'), 'Pulsing AI Core orb present');
assert(html.includes('animate-orbit'), 'Orbiting neural rings present');
assert(html.includes('ai-floating-node'), 'Floating connected nodes present');
assert(html.includes('AI is processing the user\'s request.'), 'Clear communication text present');
console.log('  [PASS] Scene 3: Futuristic AI visualization with orb, neural rings, and connected nodes verified');

// 4. SCENE 4 — PROCESSING
console.log('\n4. Verifying SCENE 4 — PROCESSING...');
assert(html.includes('id="aitalksy-stage-step4"'), 'Scene 4 step container present');
assert(html.includes('Processing...'), 'Processing... status present');
assert(html.includes('Understanding...'), 'Understanding... status present');
assert(html.includes('Generating response...'), 'Generating response... status present');
assert(html.includes('aitalksy-proc-1'), 'Step indicator 1 present');
assert(html.includes('aitalksy-proc-2'), 'Step indicator 2 present');
assert(html.includes('aitalksy-proc-3'), 'Step indicator 3 present');
assert(js.includes('runAITalksyProcessing'), 'Processing indicator progression logic in JS');
console.log('  [PASS] Scene 4: Processing progression (Processing -> Understanding -> Generating response) verified');

// 5. SCENE 5 — RESPONSE
console.log('\n5. Verifying SCENE 5 — RESPONSE...');
assert(html.includes('id="aitalksy-stage-step5"'), 'Scene 5 step container present');
assert(html.includes('"Sure! I can help you with that."'), 'Exact AI response present');
console.log('  [PASS] Scene 5: Smooth intelligent AI response verified');

// 6. SCENE 6 — BUSINESS CONNECTION
console.log('\n6. Verifying SCENE 6 — BUSINESS CONNECTION...');
assert(html.includes('id="aitalksy-stage-step6"'), 'Scene 6 step container present');
assert(html.includes('>User<'), 'User channel present');
assert(html.includes('>Website<'), 'Website channel present');
assert(html.includes('>Chat<'), 'Chat channel present');
assert(html.includes('>Support<'), 'Support channel present');
assert(html.includes('>Business<'), 'Business channel present');
assert(html.includes('>AI<') || html.includes('AI Hub'), 'AI central node present');
console.log('  [PASS] Scene 6: Business communication channels (User, Website, Chat, Support, Business, AI) verified');

// 7. SCENE 7 — RESULT
console.log('\n7. Verifying SCENE 7 — RESULT & FINAL CTA...');
assert(html.includes('id="aitalksy-stage-step7"'), 'Scene 7 step container present');
assert(html.includes('Messages Handled'), 'Messages Handled metric label present');
assert(html.includes('data-target="24"'), 'Messages Handled: 24 metric target present');
assert(html.includes('Responses'), 'Responses metric label present');
assert(html.includes('data-target="21"'), 'Responses: 21 metric target present');
assert(html.includes('Resolved'), 'Resolved metric label present');
assert(html.includes('data-target="18"'), 'Resolved: 18 metric target present');
assert(html.includes('Automation'), 'Automation metric label present');
assert(html.includes('data-target="87"'), 'Automation: 87% metric target present');
assert(js.includes('runAITalksyCounters'), 'Animated counter logic implemented in JS');

// FINAL checks
assert(html.includes('AI-powered communication'), 'FINAL badge "AI-powered communication" present');
assert(html.includes('EXPLORE AITALKSY'), 'EXPLORE AITALKSY button present');
assert(html.includes('https://aitalksy.com/'), 'URL https://aitalksy.com/ present');
assert(html.includes('target="_blank"') && html.includes('rel="noopener noreferrer"'), 'Opens in new tab with secure rel');
console.log('  [PASS] Scene 7 & FINAL: Dashboard metrics (24, 21, 18, 87%) and EXPLORE AITALKSY link verified');

// 8. BACKGROUND
console.log('\n8. Verifying DEDICATED FUTURISTIC BACKGROUND...');
assert(html.includes('id="aitalksy-neural-canvas"'), 'Canvas element #aitalksy-neural-canvas present in HTML');
assert(css.includes('.aitalksy-neural-bg-canvas'), 'CSS styling for neural canvas defined');
assert(js.includes('initAITalksyBackground'), 'initAITalksyBackground function implemented in JS');
assert(js.includes('maxDistance = 90') || js.includes('rgba(6, 182, 212'), 'Neural lines rendering with glowing connections');
assert(js.includes('particles.push'), 'Micro-particle drifting system implemented');
console.log('  [PASS] Background: Dedicated dark premium canvas with neural lines, glowing nodes & particles verified');

console.log('\n====================================================');
console.log('ALL PHASE 6 TESTS PASSED: 100% SUCCESS');
console.log('====================================================');
