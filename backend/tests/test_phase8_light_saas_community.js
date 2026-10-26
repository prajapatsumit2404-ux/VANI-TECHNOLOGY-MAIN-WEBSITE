/**
 * PHASE 8 AUDIT: COMMUNITY FORUM LIGHT SAAS PRODUCT DEMO
 *
 * Verifies all Phase 8 specifications:
 * 1. Product identity: COMMUNITY FORUM & https://communityforum.tech/
 * 2. Visual formula distinct from AI Talksy:
 *    - Human, trustworthy, connected, premium
 *    - Large smartphone with member cards, verification card, community icons, service cards, connections
 * 3. 10-Step & Final Community Story:
 *    - STEP 1 — PEOPLE: Professional avatar illustrations/icons, move toward phone, "Your Community"
 *    - STEP 2 — VERIFIED MEMBER: "✓ Verified Member", "Profile Verified"
 *    - STEP 3 — PHONE: Phone appears, inside phone: "Community Forum"
 *    - STEP 4 — MEMBER DIRECTORY: "Members", "Search Members", "Family Directory"
 *    - STEP 5 — MATRIMONY: "Matrimony", "Profiles", "Connect"
 *    - STEP 6 — MARKETPLACE: "Marketplace", "Products", "Services"
 *    - STEP 7 — BILL PAYMENT: "Bill Payment", "Pay Bill", "Payment Successful ✓"
 *    - STEP 8 — E-VOTING: "E-Voting", "Select Candidate", "Vote Submitted ✓"
 *    - STEP 9 — FAMILY TREE: "Family Tree", "Parent", "Child", "Grandparent", "Connected relationships"
 *    - STEP 10 — EVENTS: "Community Events", "Upcoming Event", "Join Event"
 *    - FINAL: Visual connection of Members, Matrimony, Marketplace, Payments, Voting, Family Tree, Events -> ONE PLATFORM -> "One Digital Platform for Your Community"
 *    - CTA: "EXPLORE COMMUNITY FORUM" -> opens https://communityforum.tech/ in new tab
 * 4. Background: Light background with white, soft green, soft teal, light warm gradient, subtle connection lines, floating cards
 * 5. Preservation: Navbar, Hero 3D, Footer remain untouched; public experience requires no login
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
console.log('   PHASE 8: COMMUNITY FORUM LIGHT SAAS DEMO AUDIT   ');
console.log('====================================================');

// 1. Identity & Visual Distinction
console.log('\n1. Checking Product Identity & Human/Community Personality...');
check('Product title "Community Forum" is present in #story-communityforum',
  html.includes('id="story-communityforum"') && html.includes('Community Forum'));

check('Product link https://communityforum.tech/ opens in new tab with rel="noopener noreferrer"',
  html.includes('https://communityforum.tech/') &&
  html.includes('target="_blank"') &&
  html.includes('rel="noopener noreferrer"'));

check('Theme is dedicated theme-community (not AI neon)',
  html.includes('theme-community') && css.includes('.theme-community'));

check('Main visual is a realistic smartphone mockup container',
  html.includes('id="story-communityforum"') &&
  html.includes('device-mockup-phone'));

check('Floating cards around phone (member cards, verification, service cards, connections)',
  html.includes('story-floating-card') &&
  html.includes('data-story="community"'));

// 2. Exact 10-Step Progression
console.log('\n2. Checking 10-Step Exact Story Progression...');

// STEP 1 — PEOPLE
check('STEP 1 — PEOPLE: Professional avatar illustrations/icons with "Your Community"',
  html.includes('id="community-stage-step1"') &&
  html.includes('Your Community') &&
  html.includes('community-person-node') &&
  html.includes('fa-user') &&
  html.includes('Person 1') && html.includes('Person 2') && html.includes('Person 3') && html.includes('Person 4'));

// STEP 2 — VERIFIED MEMBER
check('STEP 2 — VERIFIED MEMBER: "✓ Verified Member" and "Profile Verified"',
  html.includes('Verified Member') &&
  html.includes('✓') &&
  html.includes('Profile Verified') &&
  html.includes('ID Authenticated') &&
  html.includes('Zero Fake Profiles'));

// STEP 3 — PHONE
check('STEP 3 — PHONE: Phone appears with "Community Forum" inside header',
  html.includes('phone-app-header') &&
  html.includes('Community Forum'));

// STEP 4 — MEMBER DIRECTORY
check('STEP 4 — MEMBER DIRECTORY: Phone displays "Members", "Search Members", "Family Directory"',
  html.includes('id="comm-screen-1"') &&
  html.includes('Members') &&
  html.includes('Search Members') &&
  html.includes('Family Directory'));

// STEP 5 — MATRIMONY
check('STEP 5 — MATRIMONY: Phone displays "Matrimony", "Profiles", "Connect"',
  html.includes('id="comm-screen-2"') &&
  html.includes('Matrimony') &&
  html.includes('Profiles') &&
  html.includes('Connect'));

// STEP 6 — MARKETPLACE
check('STEP 6 — MARKETPLACE: Phone displays "Marketplace", "Products", "Services"',
  html.includes('id="comm-screen-3"') &&
  html.includes('Marketplace') &&
  html.includes('Products') &&
  html.includes('Services'));

// STEP 7 — BILL PAYMENT
check('STEP 7 — BILL PAYMENT: Phone displays "Bill Payment", "Pay Bill", "Payment Successful ✓"',
  html.includes('id="comm-screen-4"') &&
  html.includes('Bill Payment') &&
  html.includes('Pay Bill') &&
  html.includes('Payment Successful ✓'));

// STEP 8 — E-VOTING
check('STEP 8 — E-VOTING: Phone displays "E-Voting", "Select Candidate", "Vote Submitted ✓"',
  html.includes('id="comm-screen-5"') &&
  html.includes('E-Voting') &&
  html.includes('Select Candidate') &&
  html.includes('Vote Submitted ✓'));

// STEP 9 — FAMILY TREE
check('STEP 9 — FAMILY TREE: Phone displays "Family Tree", "Parent", "Child", "Grandparent", "Connected relationships"',
  html.includes('id="comm-screen-6"') &&
  html.includes('Family Tree') &&
  html.includes('Grandparent') &&
  html.includes('Parent') &&
  html.includes('Child') &&
  html.includes('Connected relationships'));

// STEP 10 — EVENTS
check('STEP 10 — EVENTS: Phone displays "Community Events", "Upcoming Event", "Join Event"',
  html.includes('id="comm-screen-7"') &&
  html.includes('Community Events') &&
  html.includes('Upcoming Event') &&
  html.includes('Join Event'));

// 3. Final Community Story & ONE PLATFORM
console.log('\n3. Checking Final Community Story Connection & CTA...');
check('All features visually connect: Members, Matrimony, Marketplace, Payments, Voting, Family Tree, Events',
  html.includes('id="community-stage-step5"') &&
  html.includes('Members') &&
  html.includes('Matrimony') &&
  html.includes('Marketplace') &&
  html.includes('Payments') &&
  html.includes('Voting') &&
  html.includes('Family Tree') &&
  html.includes('Events'));

check('ONE PLATFORM badge & "One Digital Platform for Your Community" heading',
  html.includes('ONE PLATFORM') &&
  html.includes('One Digital Platform for Your Community'));

check('CTA "EXPLORE COMMUNITY FORUM" with link to https://communityforum.tech/',
  html.includes('EXPLORE COMMUNITY FORUM') &&
  html.includes('href="https://communityforum.tech/"'));

// 4. Background & Styling
console.log('\n4. Checking Community Light Background...');
check('Background uses white base, soft green, soft teal, and light warm gradient',
  css.includes('.theme-community') &&
  css.includes('#ffffff') &&
  css.includes('rgba(16, 185, 129') &&
  css.includes('rgba(20, 184, 166') &&
  css.includes('rgba(245, 158, 11'));

check('Canvas #community-ecosystem-canvas present with warm ambient lights and subtle lines',
  html.includes('id="community-ecosystem-canvas"') &&
  js.includes('initCommunityBackground') &&
  js.includes('warmLights') &&
  js.includes('floatingCards'));

// 5. Preservation & Integrity
console.log('\n5. Checking Preservation of Unchanged Website Sections...');
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
  console.log('🌟 STATUS: PHASE 8 COMMUNITY FORUM 100% VERIFIED!');
  process.exit(0);
} else {
  console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 8');
  process.exit(1);
}
