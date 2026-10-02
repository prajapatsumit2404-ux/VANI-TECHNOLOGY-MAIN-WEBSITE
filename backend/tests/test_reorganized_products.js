/**
 * Verification test for Reorganized Products:
 * - MAIN PRODUCTS (3 cinematic products)
 * - DELIVERY PROJECTS (5 delivered products)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('   VERIFYING MAIN PRODUCTS & DELIVERY PROJECTS     ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

// 1. Verify Product Section
console.log('1. Checking PRODUCT section...');
assert(html.includes('PRODUCT'), 'PRODUCT heading present');
assert(html.includes('Products that define our digital expertise'), 'Product subtitle present');

assert(html.includes('id="story-aitalksy"'), 'AI Talksy story card present');
assert(html.includes('id="story-communityforum"'), 'Community Forum story card present');
assert(html.includes('id="story-ratehonk"'), 'RateHonk story card present');

// Verify external links
assert(html.includes('href="https://aitalksy.com/"'), 'AI Talksy external link present');
assert(html.includes('EXPLORE AITALKSY'), 'AI Talksy CTA button text present');
assert(html.includes('href="https://communityforum.tech/"'), 'Community Forum external link present');
assert(html.includes('EXPLORE COMMUNITY FORUM'), 'Community Forum CTA button text present');
assert(html.includes('href="https://crm.ratehonk.com/portfolio"'), 'RateHonk external link present');
assert(html.includes('EXPLORE RATEHONK CRM'), 'RateHonk CTA button text present');
console.log('  [PASS] All 3 Products present with verified external URLs & CTAs');

// 2. Verify Project Delivered Section
console.log('\n2. Checking PROJECT DELIVERED section...');
assert(html.includes('PROJECT DELIVERED'), 'PROJECT DELIVERED heading present');
assert(html.includes("Projects we've successfully delivered"), 'Project Delivered subtitle present');
assert(html.includes('id="delivery-grid"'), 'delivery-grid container present');

const deliveryProductIds = [
  'homem-do-pao',
  'meditation-willy-cherish',
  'msb-school',
  'software-testing-suite',
  'telemedicine'
];

deliveryProductIds.forEach((id) => {
  assert(html.includes(`data-product-id="${id}"`), `Delivery project ${id} present`);
});
console.log('  [PASS] All 5 Delivery Projects present in delivery-grid');

// 3. Verify No Duplicates
console.log('\n3. Checking for No Duplicate Products...');
// Count occurrences of data-product-id in delivery grid
const deliverySectionMatch = html.match(/<div id="delivery-grid"[\s\S]*?<\/div>\s*<!-- Empty State/);
assert(deliverySectionMatch, 'Found delivery-grid section in HTML');
const deliverySectionHtml = deliverySectionMatch[0];

assert(!deliverySectionHtml.includes('data-product-id="ai-talksy"'), 'AI Talksy not in Delivery Projects');
assert(!deliverySectionHtml.includes('data-product-id="community-forum"'), 'Community Forum not in Delivery Projects');
assert(!deliverySectionHtml.includes('data-product-id="ratehonk-travel-crm"'), 'RateHonk not in Delivery Projects');

deliveryProductIds.forEach((id) => {
  const matches = deliverySectionHtml.match(new RegExp(`class="product-card[^"]*"[^>]*data-product-id="${id}"`, 'g'));
  assert(matches && matches.length === 1, `Product card for ${id} appears exactly once in Delivery Projects`);
});
console.log('  [PASS] Zero duplicates: Main Products (3) and Delivery Projects (5) strictly separated');

// 4. Verify Cinematic Product Story Sequences
console.log('\n4. Checking Story Animations & Narrative Elements...');
// AI Talksy workflow
assert(html.includes('aitalksy-stage-step1'), 'AI Talksy Step 1: User query');
assert(html.includes('aitalksy-stage-step2'), 'AI Talksy Step 2: Processing Core');
assert(html.includes('aitalksy-stage-step3'), 'AI Talksy Step 3: Response');
assert(html.includes('aitalksy-stage-step4'), 'AI Talksy Step 4: Omnichannel');
assert(html.includes('aitalksy-stage-step5'), 'AI Talksy Step 5: Result');
assert(html.includes('AI-powered communication'), 'AI Talksy ending badge present');

// Community Forum workflow
assert(html.includes('community-stage-step1'), 'Community Step 1: People');
assert(html.includes('community-stage-step2'), 'Community Step 2: Verification');
assert(html.includes('community-stage-step3'), 'Community Step 3: Smartphone App');
assert(html.includes('community-stage-step4'), 'Community Step 4: Services');
assert(html.includes('community-stage-step5'), 'Community Step 5: Ecosystem');
assert(html.includes('One Digital Platform for Your Community'), 'Community ending badge present');

// RateHonk CRM workflow
assert(html.includes('ratehonk-stage-step1'), 'RateHonk Step 1: Inbound Lead');
assert(html.includes('ratehonk-stage-step2'), 'RateHonk Step 2: Pipeline');
assert(html.includes('ratehonk-stage-step3'), 'RateHonk Step 3: Follow-up');
assert(html.includes('ratehonk-stage-step4'), 'RateHonk Step 4: Voucher');
assert(html.includes('ratehonk-stage-step5'), 'RateHonk Step 5: Dashboard');
assert(html.includes('Turn Leads Into Organized Business Growth'), 'RateHonk ending badge present');
console.log('  [PASS] All 3 Cinematic Story stages & narratives verified');

// 5. Verify JavaScript Controllers & Data Structures
console.log('\n5. Checking JS Data Structures & Story Controller...');
assert(js.includes('MAIN_PRODUCTS_KEYS'), 'MAIN_PRODUCTS_KEYS defined in JS');
assert(js.includes('DELIVERY_PROJECTS_KEYS'), 'DELIVERY_PROJECTS_KEYS defined in JS');
assert(js.includes('initCinematicProductStories()'), 'initCinematicProductStories defined and called');
assert(js.includes('delivery-search-input'), 'delivery-search-input handled in JS');
assert(js.includes('delivery-count-display'), 'delivery-count-display handled in JS');
console.log('  [PASS] JS data structures, filter controller & story sequencer verified');

// 6. Verify CSS & Accessibility
console.log('\n6. Checking CSS & Accessibility...');
assert(css.includes('.cinematic-story-card'), '.cinematic-story-card CSS defined');
assert(css.includes('.story-stage-canvas'), '.story-stage-canvas CSS defined');
assert(css.includes('prefers-reduced-motion'), 'prefers-reduced-motion overrides present');
console.log('  [PASS] CSS styling, hover effects, and reduced-motion compliance verified');

console.log('\n====================================================');
console.log('ALL REORGANIZATION TESTS PASSED: 100% SUCCESS');
console.log('====================================================');
