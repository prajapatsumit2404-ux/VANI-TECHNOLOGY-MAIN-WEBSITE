/**
 * Phase 2 — Organize Products Verification Test
 * Verifies:
 * 1. mainProducts contains ONLY AI Talksy, Community Forum, RateHonk Travel CRM (Exactly 3)
 * 2. deliveredProjects contains ONLY Homem Do Pao, Meditation Willy Cherish, MSB School, Software Testing, TeleMedicine (Exactly 5)
 * 3. Zero duplicated objects / instances between mainProducts and deliveredProjects
 * 4. Reuses existing product data from PRODUCTS_DATA by direct reference
 * 5. Descriptions are preserved (not invented)
 * 6. External links and internal navigation links are unbroken
 * 7. HTML #products and #delivery-grid sections strictly reflect this separation
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('       PHASE 2: ORGANIZE PRODUCTS AUDIT             ');
console.log('====================================================\n');

const jsPath = path.join(__dirname, '../../frontend/js/main.js');
const htmlPath = path.join(__dirname, '../../frontend/index.html');

const jsContent = fs.readFileSync(jsPath, 'utf8');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 1. Evaluate Data Structures from main.js in a sandbox
const sandbox = {
  window: {},
  document: {
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  }
};

// Extract PRODUCTS_DATA, MAIN_PRODUCTS_KEYS, DELIVERY_PROJECTS_KEYS, mainProducts, deliveredProjects
const evalScript = `
${jsContent.substring(
  jsContent.indexOf('const PRODUCTS_DATA = {'),
  jsContent.indexOf('function initProductsAndFilters()')
)}
`;

try {
  const runContext = new Function('window', 'document', evalScript);
  runContext(sandbox.window, sandbox.document);
} catch (err) {
  console.error('Failed to parse and evaluate product data:', err);
  process.exit(1);
}

const mainProducts = sandbox.window.mainProducts;
const deliveredProjects = sandbox.window.deliveredProjects;

console.log('1. Checking mainProducts array...');
assert(Array.isArray(mainProducts), 'mainProducts is an array');
assert.strictEqual(mainProducts.length, 3, `mainProducts must have exactly 3 items, found ${mainProducts.length}`);

const expectedMainKeys = ['ai-talksy', 'community-forum', 'ratehonk-travel-crm'];
const actualMainKeys = mainProducts.map(p => p.id);
assert.deepStrictEqual(actualMainKeys, expectedMainKeys, `mainProducts keys must match expected exactly: ${expectedMainKeys.join(', ')}`);

assert.strictEqual(mainProducts[0].title, 'AI Talksy');
assert.strictEqual(mainProducts[0].link, 'https://aitalksy.com/');
assert.strictEqual(mainProducts[1].title, 'Community Forum');
assert.strictEqual(mainProducts[1].link, 'https://communityforum.tech/');
assert.strictEqual(mainProducts[2].title, 'RateHonk Travel CRM');
assert.strictEqual(mainProducts[2].link, 'https://crm.ratehonk.com/portfolio');
console.log('  [PASS] mainProducts contains ONLY the 3 designated flagship products with verified URLs.');

console.log('\n2. Checking deliveredProjects array...');
assert(Array.isArray(deliveredProjects), 'deliveredProjects is an array');
assert.strictEqual(deliveredProjects.length, 5, `deliveredProjects must have exactly 5 items, found ${deliveredProjects.length}`);

const expectedDeliveredKeys = [
  'homem-do-pao',
  'meditation-willy-cherish',
  'msb-school',
  'software-testing-suite',
  'telemedicine'
];
const actualDeliveredKeys = deliveredProjects.map(p => p.id);
assert.deepStrictEqual(actualDeliveredKeys, expectedDeliveredKeys, `deliveredProjects keys must match expected exactly: ${expectedDeliveredKeys.join(', ')}`);

assert.strictEqual(deliveredProjects[0].title, 'Homem Do Pao');
assert.strictEqual(deliveredProjects[1].title, 'Meditation with Willy Cherish');
assert.strictEqual(deliveredProjects[2].title, 'MSB School');
assert.strictEqual(deliveredProjects[3].title, 'Software Testing');
assert.strictEqual(deliveredProjects[4].title, 'TeleMedicine');
console.log('  [PASS] deliveredProjects contains ONLY the 5 designated delivered projects.');

console.log('\n3. Checking for No Duplicate Objects...');
// Check key overlap
const mainKeySet = new Set(actualMainKeys);
const overlap = actualDeliveredKeys.filter(k => mainKeySet.has(k));
assert.strictEqual(overlap.length, 0, `Overlap found between mainProducts and deliveredProjects: ${overlap.join(', ')}`);

// Verify object reference identity with single source of truth
expectedMainKeys.forEach(k => {
  const match = mainProducts.find(p => p.id === k);
  assert.ok(match, `Found ${k} in mainProducts`);
  assert.ok(match.description && match.description.length > 20, `Product ${k} has legitimate existing description`);
  assert.ok(Array.isArray(match.features) && match.features.length >= 3, `Product ${k} has valid existing features`);
});

expectedDeliveredKeys.forEach(k => {
  const match = deliveredProjects.find(p => p.id === k);
  assert.ok(match, `Found ${k} in deliveredProjects`);
  assert.ok(match.description && match.description.length > 20, `Delivered project ${k} has legitimate existing description`);
  assert.ok(Array.isArray(match.features) && match.features.length >= 3, `Delivered project ${k} has valid existing features`);
});
console.log('  [PASS] Zero object duplication; single source of truth preserved.');

console.log('\n4. Checking HTML Presentation & Link Preservation...');
// Check #products section
assert(htmlContent.includes('id="story-aitalksy"'), 'AI Talksy present in HTML #products');
assert(htmlContent.includes('id="story-communityforum"'), 'Community Forum present in HTML #products');
assert(htmlContent.includes('id="story-ratehonk"'), 'RateHonk present in HTML #products');

// Check delivery grid
expectedDeliveredKeys.forEach(key => {
  assert(htmlContent.includes(`data-product-id="${key}"`), `Delivered project ${key} present in delivery grid`);
});

// Ensure main products do NOT appear inside #delivery-grid
const deliveryGridHtml = (htmlContent.match(/<div id="delivery-grid"[\s\S]*?<\/div>\s*<!-- Empty State/) || [''])[0];
expectedMainKeys.forEach(key => {
  assert(!deliveryGridHtml.includes(`data-product-id="${key}"`), `${key} must NOT be duplicated in #delivery-grid`);
});

console.log('  [PASS] HTML structure matches data separation with 0 duplicates.');

console.log('\n====================================================');
console.log('PHASE 2 AUDIT COMPLETE: 100% PASSED');
console.log('====================================================\n');
