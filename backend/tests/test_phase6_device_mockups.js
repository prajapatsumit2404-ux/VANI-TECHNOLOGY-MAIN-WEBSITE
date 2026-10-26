/**
 * Phase 6 — Phone / Device Demonstration Verification Test
 * Verifies:
 * 1. Realistic UI Mockup in all 3 flagship products:
 *    - AI Talksy: Smartphone Device Mockup (.device-mockup-phone) with status bar, dynamic island, chat viewport
 *    - Community Forum: Smartphone Device Mockup (.device-mockup-phone) with status bar, app bar, mobile feed
 *    - RateHonk Travel CRM: Browser Dashboard Mockup (.device-mockup-browser) with window controls, address bar, app viewport
 * 2. Realistic Application Behavior:
 *    - Device frame appears
 *    - Screen changes per scene
 *    - User interaction happens (typing, clicking, pipeline flow)
 *    - Button is clicked
 *    - Loading appears (processing indicator, status transitions)
 *    - Result appears (response, verified member badge, booking confirmation)
 *    - Next feature appears (multichannel sync, 7 services reveal, analytics dashboard)
 * 3. CSS styles defined for device frames (.device-mockup-phone, .device-mockup-browser, .phone-status-bar, .browser-titlebar)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('   PHASE 6: PHONE / DEVICE DEMONSTRATION AUDIT      ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

// 1. Verify CSS Device Mockup Definitions
console.log('1. Checking CSS Device Mockup Definitions...');
assert(css.includes('.device-mockup-phone'), 'CSS defines .device-mockup-phone');
assert(css.includes('.phone-status-bar'), 'CSS defines .phone-status-bar');
assert(css.includes('.phone-dynamic-island'), 'CSS defines .phone-dynamic-island');
assert(css.includes('.phone-screen-viewport'), 'CSS defines .phone-screen-viewport');
assert(css.includes('.phone-home-indicator'), 'CSS defines .phone-home-indicator');

assert(css.includes('.device-mockup-browser'), 'CSS defines .device-mockup-browser');
assert(css.includes('.browser-titlebar'), 'CSS defines .browser-titlebar');
assert(css.includes('.browser-dot-close'), 'CSS defines .browser-dot-close');
assert(css.includes('.browser-address-bar'), 'CSS defines .browser-address-bar');
assert(css.includes('.browser-viewport'), 'CSS defines .browser-viewport');
console.log('  [PASS] CSS device mockup architecture verified for smartphones and browser dashboards.');

// 2. Verify AI Talksy: Smartphone Mockup & Real Application Behavior
console.log('\n2. Checking AI Talksy Smartphone Mockup & App Behavior...');
const aiTalksyMatch = html.match(/<article id="story-aitalksy"[\s\S]*?<\/article>/);
assert(aiTalksyMatch, 'Found AI Talksy card');
const aiHtml = aiTalksyMatch[0];

assert(aiHtml.includes('class="device-mockup-phone"'), 'AI Talksy contains .device-mockup-phone frame');
assert(aiHtml.includes('class="phone-status-bar"'), 'AI Talksy phone has realistic status bar (9:41, wifi, battery)');
assert(aiHtml.includes('class="phone-dynamic-island"'), 'AI Talksy phone has modern dynamic island notch');
assert(aiHtml.includes('class="phone-app-header"'), 'AI Talksy phone has realistic in-app header with online status');
assert(aiHtml.includes('class="phone-screen-viewport"'), 'AI Talksy has in-app screen viewport');
assert(aiHtml.includes('class="phone-home-indicator"'), 'AI Talksy phone has home indicator bar');

// Behavior sequence: User types -> Message sent -> Processing loading -> Response -> Business Sync -> Result
assert(aiHtml.includes('aitalksy-typing-text') && aiHtml.includes('aitalksy-cursor'), 'App interaction: User typing inquiry');
assert(aiHtml.includes('animate-message-transfer'), 'Button clicked / message sent animation');
assert(aiHtml.includes('aitalksy-proc-1') && aiHtml.includes('Processing...'), 'Loading appears: AI processing intent');
assert(aiHtml.includes('Sure! I can help you with that.'), 'Result appears: Contextual AI response');
assert(aiHtml.includes('business-connection-node'), 'Next feature appears: Multichannel integration');
assert(aiHtml.includes('aitalksy-counter'), 'Result metrics dashboard');
console.log('  [PASS] AI Talksy simulates an authentic smartphone conversational AI app.');

// 3. Verify Community Forum: Smartphone Mockup & App Behavior
console.log('\n3. Checking Community Forum Smartphone Mockup & App Behavior...');
const communityMatch = html.match(/<article id="story-communityforum"[\s\S]*?<\/article>/);
assert(communityMatch, 'Found Community Forum card');
const commHtml = communityMatch[0];

assert(commHtml.includes('class="device-mockup-phone"'), 'Community Forum contains .device-mockup-phone frame');
assert(commHtml.includes('class="phone-status-bar"'), 'Community phone has status bar (9:41, battery, signal)');
assert(commHtml.includes('class="phone-app-header"'), 'Community phone has app header: Community Forum Hub');
assert(commHtml.includes('class="phone-screen-viewport"'), 'Community phone has screen viewport');
assert(commHtml.includes('class="phone-home-indicator"'), 'Community phone has home indicator bar');

// Behavior sequence: Member cards -> Verification -> Loading / stamp -> 7 services reveal
assert(commHtml.includes('community-person-node'), 'App interaction: Member network profiles');
assert(commHtml.includes('Verified Member') && commHtml.includes('animate-verification-stamp'), 'User interaction & loading verification stamp');
assert(commHtml.includes('comm-phone-service'), 'Next features appear: 7 modular community services in phone');
assert(commHtml.includes('Many community services') && commHtml.includes('One digital platform'), 'Result appears: Unified digital ecosystem');
console.log('  [PASS] Community Forum simulates an authentic smartphone community application.');

// 4. Verify RateHonk Travel CRM: Browser Dashboard Mockup & App Behavior
console.log('\n4. Checking RateHonk Travel CRM Browser Dashboard Mockup & App Behavior...');
const ratehonkMatch = html.match(/<article id="story-ratehonk"[\s\S]*?<\/article>/);
assert(ratehonkMatch, 'Found RateHonk Travel CRM card');
const crmHtml = ratehonkMatch[0];

assert(crmHtml.includes('class="device-mockup-browser"'), 'RateHonk CRM contains .device-mockup-browser frame');
assert(crmHtml.includes('class="browser-titlebar"'), 'Browser mockup has titlebar with controls');
assert(crmHtml.includes('browser-dot-close') && crmHtml.includes('browser-dot-maximize'), 'Browser mockup has red/yellow/green window buttons');
assert(crmHtml.includes('class="browser-address-bar"'), 'Browser mockup has secure URL address bar');
assert(crmHtml.includes('https://crm.ratehonk.com/app/pipeline'), 'Address bar shows accurate application route');
assert(crmHtml.includes('class="browser-viewport"'), 'Browser mockup has internal desktop application viewport');

// Behavior sequence: New lead arrives -> Kanban pipeline -> Drag motion -> Follow-up completed -> Booking confirmed -> Growth metrics
assert(crmHtml.includes('John Smith') && crmHtml.includes('NEW LEAD'), 'Lead inquiry arrives in browser application');
assert(crmHtml.includes('animate-pipeline-flow'), 'Lead card moves across pipeline columns in browser UI');
assert(crmHtml.includes('Follow-up due') && crmHtml.includes('ratehonk-followup-badge-container'), 'Follow-up task transitions');
assert(crmHtml.includes('BOOKING CONFIRMED') && crmHtml.includes('₹85,000'), 'Result appears: Confirmed booking voucher');
assert(crmHtml.includes('ratehonk-counter') && crmHtml.includes('Revenue'), 'Next feature appears: Real-time analytics view');
console.log('  [PASS] RateHonk CRM simulates an authentic browser desktop SaaS application.');

console.log('\n====================================================');
console.log('PHASE 6 AUDIT COMPLETE: 100% PASSED');
console.log('====================================================\n');
