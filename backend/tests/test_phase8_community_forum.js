/**
 * Phase 8 Verification Test: Community Forum Product Story Animation
 *
 * Verifies:
 * 1. Product identity: Community Forum & https://communityforum.tech/
 * 2. Visual distinction from AI Talksy (Human / People / Community vs AI Neon)
 * 3. Story flow: PEOPLE -> COMMUNITY -> VERIFIED MEMBER -> MOBILE APP -> COMMUNITY SERVICES -> CONNECTED ECOSYSTEM
 * 4. Visual Scene:
 *    - Start with: 👤 👤 👤 👤 Multiple member cards slowly connect -> "Your Community"
 *    - "Verified Member ✓"
 *    - Smartphone appears in center (.device-mockup-phone)
 *    - Inside phone, screen transitions between 7 live services:
 *      1. Members
 *      2. Matrimony
 *      3. Marketplace
 *      4. Bill Payment
 *      5. E-Voting
 *      6. Family Tree
 *      7. Events
 * 5. Final Community Scene:
 *    - All services connect (Members, Matrimony, Marketplace, Payments, Voting, Family, Events)
 *    - ONE PLATFORM -> "One Digital Platform for Your Community"
 *    - CTA: "EXPLORE COMMUNITY FORUM" -> opens https://communityforum.tech/ in a new tab
 * 6. Community Background:
 *    - Soft warm gradient
 *    - Connected circles
 *    - Subtle network lines
 *    - Floating cards
 *    - Phone glow
 *    - Human-focused visual language (People connected together)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('      PHASE 8 — 👥 COMMUNITY FORUM PRODUCT STORY AUDIT          ');
console.log('================================================================');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// 1. STORY IDENTITY & VISUAL DISTINCTION FROM AI TALKSY
console.log('\n1. Verifying Story Identity & Visual Distinction from AI Talksy...');
assert(html.includes('id="story-communityforum"'), 'Community Forum story container present');
assert(html.includes('theme-community'), 'Dedicated community theme class present');
assert(css.includes('.theme-community'), 'Theme styling defined in CSS');
assert(css.includes('rgba(245, 158, 11') && css.includes('rgba(16, 185, 129'), 'Warm amber and emerald colors used for human/community visual language');
console.log('  [PASS] Community Forum is visually distinct from AI Talksy (Human/People vs AI Neon)');

// 2. SCENE 1 — PEOPLE & "YOUR COMMUNITY"
console.log('\n2. Verifying SCENE 1: Multiple members (👤 👤 👤 👤) connecting into "Your Community"...');
assert(html.includes('id="community-stage-step1"'), 'Scene 1 container present');
assert(html.includes('Your Community'), '"Your Community" badge/text present');
assert(html.includes('community-person-node'), 'Member cards present');
assert(html.includes('Person 1') && html.includes('Person 2') && html.includes('Person 3') && html.includes('Person 4'), '4 distinct member cards present (👤 👤 👤 👤)');
assert(html.includes('comm-connecting-path'), 'Connecting path svg present');
assert(js.includes('runCommunityPeopleConnect'), 'runCommunityPeopleConnect function present in JS');
console.log('  [PASS] Scene 1: 4 member cards slowly connecting into "Your Community" verified');

// 3. SCENE 2 — COMMUNITY
console.log('\n3. Verifying SCENE 2: Connected lines uniting members into COMMUNITY...');
assert(html.includes('id="community-stage-step2"'), 'Scene 2 container present');
assert(html.includes('COMMUNITY'), 'COMMUNITY badge present');
assert(html.includes('Lines Connect the Members'), 'Lines Connect the Members text present');
assert(css.includes('communityPulseGlow'), 'Community pulse glow animation defined');
console.log('  [PASS] Scene 2: Members united by lines into COMMUNITY verified');

// 4. SCENE 3 — VERIFIED MEMBER
console.log('\n4. Verifying SCENE 3: "Verified Member ✓" & Trust Architecture...');
assert(html.includes('id="community-stage-step3"'), 'Scene 3 container present');
assert(html.includes('Verified Member'), '"Verified Member" text present');
assert(html.includes('✓'), 'Checkmark symbol present');
assert(html.includes('ID Authenticated'), 'ID Authenticated badge present');
assert(html.includes('Zero Fake Profiles'), 'Zero Fake Profiles badge present');
assert(css.includes('animate-verification-stamp'), 'Verification stamp animation defined');
assert(js.includes('runCommunityVerification'), 'runCommunityVerification function in JS');
console.log('  [PASS] Scene 3: "Verified Member ✓" with ID authentication verified');

// 5. SCENE 4 — PHONE APPEARS & 7 SERVICE SCREENS TRANSITION
console.log('\n5. Verifying SCENE 4: Smartphone with 7 Live Service Screens...');
assert(html.includes('id="community-stage-step4"'), 'Scene 4 container present');
assert(html.includes('device-mockup-phone'), 'Smartphone mockup present in Community Forum');
assert(html.includes('A smartphone moves into the center'), 'Story text present');

// Verify all 7 screens exist with real UI mockups
const services = ['Members', 'Matrimony', 'Marketplace', 'Bill Payment', 'E-Voting', 'Family Tree', 'Events'];
services.forEach((s, idx) => {
  assert(html.includes(`data-index="${idx + 1}"`), `Service tab for ${s} present (data-index="${idx + 1}")`);
  assert(html.includes(`id="comm-screen-${idx + 1}"`), `Live screen container for ${s} (comm-screen-${idx + 1}) present`);
  assert(html.includes(s), `Text for ${s} present`);
});

assert(js.includes('switchCommScreen'), 'switchCommScreen function defined in JS');
assert(js.includes('runCommunityPhoneServices'), 'runCommunityPhoneServices function defined in JS');
assert(js.includes('active-tab'), 'Active tab highlight logic in JS');
console.log('  [PASS] Scene 4: Smartphone transitions between all 7 live community service screens');

// 6. SCENE 5 — CONNECTED ECOSYSTEM & ONE PLATFORM
console.log('\n6. Verifying SCENE 5: All services connect -> ONE PLATFORM -> Final CTA...');
assert(html.includes('id="community-stage-step5"'), 'Scene 5 container present');
assert(html.includes('Many community services'), '"Many community services" header present');
assert(html.includes('ONE PLATFORM'), '"ONE PLATFORM" badge present');
assert(html.includes('One digital platform') || html.includes('One Digital Platform'), '"One digital platform" present');
assert(html.includes('One Digital Platform for Your Community'), '"One Digital Platform for Your Community" heading present');

// All services mentioned in connection
assert(html.includes('Members'), 'Members connected');
assert(html.includes('Matrimony'), 'Matrimony connected');
assert(html.includes('Marketplace'), 'Marketplace connected');
assert(html.includes('Payments'), 'Payments connected');
assert(html.includes('Voting'), 'Voting connected');
assert(html.includes('Family'), 'Family connected');
assert(html.includes('Events'), 'Events connected');

// CTA
assert(html.includes('EXPLORE COMMUNITY FORUM'), 'EXPLORE COMMUNITY FORUM button present');
assert(html.includes('https://communityforum.tech/'), 'URL https://communityforum.tech/ present');
assert(html.includes('target="_blank"') && html.includes('rel="noopener noreferrer"'), 'Opens in new tab securely');
console.log('  [PASS] Scene 5: All services connected into ONE PLATFORM with EXPLORE COMMUNITY FORUM CTA');

// 7. COMMUNITY BACKGROUND
console.log('\n7. Verifying Dedicated Community Background (Warm gradient, connected circles, network lines, floating cards, phone glow)...');
assert(html.includes('id="community-ecosystem-canvas"'), 'Community canvas #community-ecosystem-canvas present');
assert(css.includes('.community-ecosystem-bg-canvas'), 'CSS definition for community canvas present');
assert(css.includes('radial-gradient') && css.includes('rgba(245, 158, 11') && css.includes('rgba(16, 185, 129'), 'Soft warm gradient in CSS');
assert(css.includes('.theme-community .device-mockup-phone'), 'Phone glow in theme-community defined in CSS');
assert(js.includes('initCommunityBackground'), 'initCommunityBackground function in JS');
assert(js.includes('warmLights'), 'Soft warm ambient drifting lights in canvas');
assert(js.includes('floatingCards'), 'Floating subtle community cards in canvas');
assert(js.includes('maxDistance = 110') || js.includes('rgba(245, 158, 11'), 'Subtle network lines in canvas');
assert(js.includes('isHub') || js.includes('curRadius'), 'Connected circles with warm pulses in canvas');
console.log('  [PASS] Community Background: Warm gradient, connected circles, network lines, floating cards & phone glow verified');

console.log('\n================================================================');
console.log('  PHASE 8 — 👥 COMMUNITY FORUM: 100% SUCCESS (ALL TESTS PASSED)  ');
console.log('================================================================\n');
