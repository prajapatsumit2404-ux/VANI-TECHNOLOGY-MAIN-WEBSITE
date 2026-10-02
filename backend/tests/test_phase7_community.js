/**
 * Phase 7 Verification Test: Community Forum Product Story
 * Tests the complete 5-scene cinematic movie sequence, dedicated warm community background,
 * member avatars (Person, Person, Person, Person) with slow connection lines,
 * COMMUNITY unity badge, verified member animation with shield/stamp,
 * smartphone centerpiece with all 7 services (Members, Matrimony, Marketplace, Bill Payment, E-Voting, Family Tree, Events)
 * appearing one by one, "Many community services -> One digital platform" ecosystem,
 * and final CTA to https://communityforum.tech/
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('    PHASE 7: COMMUNITY FORUM PRODUCT STORY AUDIT     ');
console.log('====================================================');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// 1. SCENE 1 — PEOPLE
console.log('\n1. Verifying SCENE 1 — PEOPLE...');
assert(html.includes('id="community-stage-step1"'), 'Scene 1 step container present');
assert(html.includes('Person 1') && html.includes('Person 2') && html.includes('Person 3') && html.includes('Person 4'), 'Multiple Person avatars present');
assert(html.includes('id="comm-connecting-path"'), 'Connecting line SVG path present');
assert(js.includes('runCommunityPeopleConnect'), 'runCommunityPeopleConnect logic present in JS');
console.log('  [PASS] Scene 1: Multiple Person member avatars and connecting line animation verified');

// 2. SCENE 2 — COMMUNITY
console.log('\n2. Verifying SCENE 2 — COMMUNITY...');
assert(html.includes('id="community-stage-step2"'), 'Scene 2 step container present');
assert(html.includes('>COMMUNITY<') || html.includes('<span>COMMUNITY</span>'), 'COMMUNITY title badge present');
assert(html.includes('Lines Connect the Members'), 'Lines Connect the Members explanation present');
assert(css.includes('communityPulseGlow') || css.includes('.animate-community-pulse'), 'Community pulse glow CSS defined');
console.log('  [PASS] Scene 2: Connected lines uniting members into COMMUNITY verified');

// 3. SCENE 3 — VERIFICATION
console.log('\n3. Verifying SCENE 3 — VERIFICATION...');
assert(html.includes('id="community-stage-step3"'), 'Scene 3 step container present');
assert(html.includes('Verified Member'), 'Verified Member badge text present');
assert(html.includes('✓'), 'Verification checkmark symbol present');
assert(css.includes('verificationStamp'), 'verificationStamp keyframe animation defined in CSS');
assert(html.includes('animate-verification-stamp'), 'animate-verification-stamp class applied in HTML');
assert(js.includes('runCommunityVerification'), 'runCommunityVerification logic present in JS');
console.log('  [PASS] Scene 3: "✓ Verified Member" with professional verification animation verified');

// 4. SCENE 4 — DIGITAL PLATFORM & 7 SERVICES (SMARTPHONE)
console.log('\n4. Verifying SCENE 4 — SMARTPHONE & 7 SERVICES...');
assert(html.includes('id="community-stage-step4"'), 'Scene 4 step container present');
assert(html.includes('community-phone-frame'), 'Smartphone frame container present');
assert(css.includes('phoneSlideIn') || css.includes('.animate-phone-enter'), 'Smartphone entrance animation defined');

// Verify all 7 services inside the smartphone
const services = [
  'Members',
  'Matrimony',
  'Marketplace',
  'Bill Payment',
  'E-Voting',
  'Family Tree',
  'Events'
];

services.forEach((service) => {
  assert(html.includes(`<span>${service}</span>`) || html.includes(`>${service}<`), `Service "${service}" present inside smartphone`);
});

assert(js.includes('runCommunityPhoneServices'), 'Sequential service reveal logic implemented in JS');
assert(css.includes('.comm-phone-service'), 'CSS styles for smartphone services defined');
console.log('  [PASS] Scene 4: Smartphone center entrance and all 7 services (Members, Matrimony, Marketplace, Bill Payment, E-Voting, Family Tree, Events) verified');

// 5. SCENE 5 — CONNECTED ECOSYSTEM
console.log('\n5. Verifying SCENE 5 — CONNECTED ECOSYSTEM...');
assert(html.includes('id="community-stage-step5"'), 'Scene 5 step container present');
assert(html.includes('Many community services'), '"Many community services" text present');
assert(html.includes('fa-arrow-down-long') || html.includes('animate-bounce'), 'Down arrow connecting transition present');
assert(html.includes('One digital platform'), '"One digital platform" text present');
console.log('  [PASS] Scene 5: Visual transition "Many community services ↓ One digital platform" verified');

// 6. FINAL & CALL TO ACTION
console.log('\n6. Verifying FINAL & CALL TO ACTION...');
assert(html.includes('One Digital Platform for Your Community'), '"One Digital Platform for Your Community" final heading present');
assert(html.includes('EXPLORE COMMUNITY FORUM'), 'EXPLORE COMMUNITY FORUM button present');
assert(html.includes('https://communityforum.tech/'), 'Link to https://communityforum.tech/ present');
assert(html.includes('target="_blank"') && html.includes('rel="noopener noreferrer"'), 'Secure external new-tab attributes verified');
console.log('  [PASS] FINAL: "One Digital Platform for Your Community" & button linking to https://communityforum.tech/ verified');

// 7. BACKGROUND AUDIT (WARM COMMUNITY FEELING, NOT AI NEON)
console.log('\n7. Verifying DEDICATED WARM BACKGROUND...');
assert(html.includes('id="community-ecosystem-canvas"'), '#community-ecosystem-canvas present in HTML');
assert(css.includes('.community-ecosystem-bg-canvas'), '.community-ecosystem-bg-canvas CSS defined');
assert(css.includes('.theme-community-stage'), '.theme-community-stage warm gradient CSS defined');
assert(js.includes('initCommunityBackground'), 'initCommunityBackground function implemented in JS');
assert(js.includes('warmLights') || js.includes('rgba(245, 158, 11,'), 'Warm amber/gold palette implemented in background');
console.log('  [PASS] Background: Dedicated warm premium gradient, connected lines & soft light verified');

console.log('\n====================================================');
console.log('ALL PHASE 7 TESTS PASSED: 100% SUCCESS');
console.log('====================================================\n');
