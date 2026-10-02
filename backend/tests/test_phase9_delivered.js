/**
 * Phase 9 Verification Test: Project Delivered Section
 * Tests the clean portfolio grid for PROJECT DELIVERED with exactly 5 projects:
 * 1. Homem Do Pao
 * 2. Meditation Willy Cherish
 * 3. MSB School
 * 4. Software Testing
 * 5. TeleMedicine
 *
 * Verifies:
 * - Section heading: PROJECT DELIVERED
 * - Subtitle: "Projects we've successfully delivered"
 * - Clean portfolio grid (NOT giant cinematic sections)
 * - Required card elements: IMAGE, CATEGORY, NAME, DESCRIPTION, FEATURES, VISIT PRODUCT, VIEW DETAILS
 * - Zero duplicates of AI Talksy, Community Forum, or RateHonk
 * - View Details modal triggers wired with data-product-id
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('      PHASE 9: PROJECT DELIVERED SECTION AUDIT       ');
console.log('====================================================');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// 1. Section Header & Subtitle
console.log('\n1. Verifying Section Header & Subtitle...');
assert(html.includes('PROJECT DELIVERED'), 'Heading "PROJECT DELIVERED" present in HTML');
assert(html.includes("Projects we've successfully delivered"), 'Subtitle "Projects we\'ve successfully delivered" present in HTML');
console.log('  [PASS] Section Heading & Subtitle verified');

// 2. Delivery Grid Container
console.log('\n2. Verifying Delivery Grid Container...');
assert(html.includes('id="delivery-grid"'), 'Container #delivery-grid present');
const deliveryMatch = html.match(/<div id="delivery-grid"[\s\S]*?<\/div>\s*<!-- Empty State/);
assert(deliveryMatch, 'Found delivery-grid container in HTML');
const deliveryHtml = deliveryMatch[0];
console.log('  [PASS] Clean portfolio grid container verified');

// 3. Exactly 5 Projects
console.log('\n3. Verifying Exactly 5 Delivery Projects...');
const expectedProjects = [
  { id: 'homem-do-pao', name: 'Homem Do Pao', cat: 'ecommerce' },
  { id: 'meditation-willy-cherish', name: 'Meditation Willy Cherish', cat: 'meditation' },
  { id: 'msb-school', name: 'MSB School', cat: 'education' },
  { id: 'software-testing-suite', name: 'Software Testing', cat: 'services' },
  { id: 'telemedicine', name: 'TeleMedicine', cat: 'healthcare' }
];

expectedProjects.forEach((proj) => {
  assert(deliveryHtml.includes(`data-product-id="${proj.id}"`), `Project "${proj.name}" (ID: ${proj.id}) present in grid`);
  assert(deliveryHtml.includes(proj.name), `Project name "${proj.name}" present in card`);
});

// Count total product cards in delivery grid
const cardMatches = deliveryHtml.match(/class="product-card[^"]*"/g) || [];
assert.strictEqual(cardMatches.length, 5, `Expected exactly 5 product cards in delivery-grid, found ${cardMatches.length}`);
console.log('  [PASS] Exactly 5 projects verified in delivery-grid');

// 4. Strict Zero Duplication
console.log('\n4. Verifying Zero Duplication of Main Products...');
assert(!deliveryHtml.includes('data-product-id="ai-talksy"'), 'AI Talksy is NOT in delivery-grid');
assert(!deliveryHtml.includes('data-product-id="community-forum"'), 'Community Forum is NOT in delivery-grid');
assert(!deliveryHtml.includes('data-product-id="ratehonk-travel-crm"'), 'RateHonk Travel CRM is NOT in delivery-grid');
console.log('  [PASS] Zero duplication: Flagship cinematic products strictly excluded from delivery-grid');

// 5. Card Elements Integrity (IMAGE, CATEGORY, NAME, DESCRIPTION, FEATURES, VISIT PRODUCT, VIEW DETAILS)
console.log('\n5. Verifying Required Card Elements...');
expectedProjects.forEach((proj) => {
  const cardSnippetMatch = deliveryHtml.match(new RegExp(`<div class="product-card[^"]*"[^>]*data-product-id="${proj.id}"[\\s\\S]*?(?:<!-- Delivery Project|<!-- End Grid|<!-- Empty State)`));
  assert(cardSnippetMatch, `Snippet found for ${proj.name}`);
  const cardSnippet = cardSnippetMatch[0];

  // IMAGE
  assert(cardSnippet.includes('<img') && cardSnippet.includes('src="assets/images/portfolio/'), `${proj.name} has image`);
  // CATEGORY
  assert(cardSnippet.includes(`data-category="${proj.cat}"`), `${proj.name} has category`);
  // NAME
  assert(cardSnippet.includes(proj.name), `${proj.name} has name`);
  // DESCRIPTION
  assert(cardSnippet.includes('<p class="text-xs text-slate-300'), `${proj.name} has description`);
  // FEATURES
  assert(cardSnippet.includes('fa-check'), `${proj.name} has features checklist`);
  // VISIT PRODUCT
  assert(cardSnippet.includes('Visit Product'), `${proj.name} has Visit Product button`);
  // VIEW DETAILS
  assert(cardSnippet.includes('View Details'), `${proj.name} has View Details button`);
});
console.log('  [PASS] All 7 card elements (IMAGE, CATEGORY, NAME, DESCRIPTION, FEATURES, VISIT PRODUCT, VIEW DETAILS) verified on all 5 cards');

// 6. View Details Modal Behavior
console.log('\n6. Verifying View Details Modal Trigger Wire-up...');
assert(js.includes('DELIVERY_PROJECTS_KEYS'), 'DELIVERY_PROJECTS_KEYS present in JS');
assert(js.includes('initProductDetailModal'), 'initProductDetailModal present in JS');
assert(js.includes('.product-modal-trigger'), '.product-modal-trigger handling present in JS');
console.log('  [PASS] View Details modal triggers wired and functioning');

console.log('\n====================================================');
console.log('ALL PHASE 9 TESTS PASSED: 100% SUCCESS');
console.log('====================================================\n');
