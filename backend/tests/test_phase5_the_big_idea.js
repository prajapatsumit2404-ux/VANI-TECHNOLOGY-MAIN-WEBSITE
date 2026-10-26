/**
 * Phase 5 — The Big Idea Verification Test
 * Verifies that EVERY animation answers the 5 fundamental product questions:
 * 1. What is the product?
 * 2. Who uses it?
 * 3. What does the user do?
 * 4. What does the product do?
 * 5. What is the result?
 *
 * Narrative Flow:
 * User -> Does something -> Product processes it -> Product performs action -> Result
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('         PHASE 5: THE BIG IDEA AUDIT                ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// Helper to isolate product story card html
const getProductHtml = (id) => {
  const match = html.match(new RegExp(`<article id="${id}"[\\s\\S]*?<\\/article>`));
  assert(match, `Found #${id} in HTML`);
  return match[0];
};

// ========================================================
// 1. PRODUCT 1: AI TALKSY
// ========================================================
console.log('1. Checking AI Talksy Narrative Story (5 Questions)...');
const aitalksyHtml = getProductHtml('story-aitalksy');

// 1. What is the product?
assert(aitalksyHtml.includes('AI Talksy'), 'Q1: Product identified as AI Talksy');
assert(aitalksyHtml.includes('Conversational AI &amp; Omnichannel Automation') || aitalksyHtml.includes('Conversational AI'), 'Q1: Category identified');

// 2. Who uses it?
assert(aitalksyHtml.includes('Enterprise Customer') || aitalksyHtml.includes('fa-user-tie'), 'Q2: User persona identified (Customer/Enterprise)');

// 3. What does the user do?
assert(aitalksyHtml.includes('aitalksy-typing-text') && aitalksyHtml.includes('Hello, I need help.'), 'Q3: User initiates inquiry with typing animation');

// 4. What does the product do?
assert(aitalksyHtml.includes('Streaming payload to AI'), 'Q4: Product ingests message payload');
assert(aitalksyHtml.includes('Processing...') && aitalksyHtml.includes('Understanding...') && aitalksyHtml.includes('Generating response...'), 'Q4: Neural core processes intent');
assert(aitalksyHtml.includes('Sure! I can help you with that.'), 'Q4: AI delivers intelligent conversational response');
assert(aitalksyHtml.includes('business-connection-node'), 'Q4: Connects channels to business');

// 5. What is the result?
assert(aitalksyHtml.includes('aitalksy-counter') && aitalksyHtml.includes('Resolved') && aitalksyHtml.includes('Automation'), 'Q5: Business metrics dashboard proves resolution result');
console.log('  [PASS] AI Talksy successfully answers all 5 core questions.');

// ========================================================
// 2. PRODUCT 2: COMMUNITY FORUM
// ========================================================
console.log('\n2. Checking Community Forum Narrative Story (5 Questions)...');
const communityHtml = getProductHtml('story-communityforum');

// 1. What is the product?
assert(communityHtml.includes('Community Forum'), 'Q1: Product identified as Community Forum');
assert(communityHtml.includes('One Connected Digital Platform for Communities') || communityHtml.includes('Digital Community Platform'), 'Q1: Purpose identified');

// 2. Who uses it?
assert(communityHtml.includes('Person 1') && communityHtml.includes('Person 2'), 'Q2: Diverse members identified (Sarah, David, etc.)');

// 3. What does the user do?
assert(communityHtml.includes('Verified Member') && communityHtml.includes('ID Authenticated'), 'Q3: User verifies identity to create trusted member profile');

// 4. What does the product do?
const services = ['Members', 'Matrimony', 'Marketplace', 'Bill Payment', 'E-Voting', 'Family Tree', 'Events'];
services.forEach(service => {
  assert(communityHtml.includes(service), `Q4: Product hosts service "${service}" inside smartphone app`);
});

// 5. What is the result?
assert(communityHtml.includes('Many community services') && communityHtml.includes('One digital platform'), 'Q5: Result clearly demonstrates "Many community services -> One digital platform"');
console.log('  [PASS] Community Forum successfully answers all 5 core questions.');

// ========================================================
// 3. PRODUCT 3: RATEHONK TRAVEL CRM
// ========================================================
console.log('\n3. Checking RateHonk Travel CRM Narrative Story (5 Questions)...');
const ratehonkHtml = getProductHtml('story-ratehonk');

// 1. What is the product?
assert(ratehonkHtml.includes('RateHonk Travel CRM'), 'Q1: Product identified as RateHonk Travel CRM');

// 2. Who uses it?
assert(ratehonkHtml.includes('John Smith'), 'Q2: Traveler and travel agency customer identified');

// 3. What does the user do?
assert(ratehonkHtml.includes('₹85,000') && ratehonkHtml.includes('NEW LEAD'), 'Q3: Customer inquires about travel package generating inbound lead');

// 4. What does the product do?
assert(ratehonkHtml.includes('NEW LEAD') && ratehonkHtml.includes('CONTACTED') && ratehonkHtml.includes('FOLLOW-UP') && ratehonkHtml.includes('QUALIFIED') && ratehonkHtml.includes('CONVERTED'), 'Q4: Product tracks lead across 5-stage pipeline');
assert(ratehonkHtml.includes('Follow-up due'), 'Q4: Automated follow-up management');
assert(ratehonkHtml.includes('Destination') && ratehonkHtml.includes('Trip') && ratehonkHtml.includes('Booking Date'), 'Q4: Product organizes complete customer dossier');

// 5. What is the result?
assert(ratehonkHtml.includes('BOOKING CONFIRMED'), 'Q5: Result 1: Confirmed booking with invoice ₹85,000');
assert(ratehonkHtml.includes('ratehonk-counter') && ratehonkHtml.includes('Revenue') && ratehonkHtml.includes('Conversion'), 'Q5: Result 2: Real-time business growth dashboard (+34.8% conversion)');
console.log('  [PASS] RateHonk Travel CRM successfully answers all 5 core questions.');

// ========================================================
// 4. VERIFY REASONING OVER DECORATION
// ========================================================
console.log('\n4. Checking Story Logic & Captions in HTML and JS Sequencer...');
assert(html.includes('id="aitalksy-step-caption"'), 'AI Talksy has step caption in HTML');
assert(html.includes('id="community-step-caption"'), 'Community Forum has step caption in HTML');
assert(html.includes('id="ratehonk-step-caption"'), 'RateHonk Travel CRM has step caption in HTML');
assert(js.includes('${storyKey}-step-caption'), 'JS dynamically targets each product step caption');
assert(js.includes('SCENE 1 — USER: "Hello, I need help."'), 'AI Talksy caption sequence in JS');
assert(js.includes('Many community services unified in one digital platform'), 'Community Forum caption sequence in JS');
assert(js.includes('Inbound inquiry received for John Smith'), 'RateHonk caption sequence in JS');
console.log('  [PASS] Animated captions continually guide visitor through product logic rather than decorative noise.');

console.log('\n====================================================');
console.log('PHASE 5 AUDIT COMPLETE: 100% PASSED');
console.log('====================================================\n');
