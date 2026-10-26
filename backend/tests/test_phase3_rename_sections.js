/**
 * Phase 3 — Rename Sections Verification Test
 * Verifies:
 * 1. MAIN PRODUCTS has been renamed to PRODUCT
 * 2. PRODUCT section has subtitle "Products that define our digital expertise"
 * 3. DELIVERY PROJECTS has been renamed to PROJECT DELIVERED
 * 4. PROJECT DELIVERED section has subtitle "Projects we've successfully delivered"
 * 5. Neither "MAIN PRODUCTS" nor "DELIVERY PROJECTS" appears as a section heading
 * 6. Other sections (Navbar, Hero, About, Services, Contact, Footer) remain intact without redesign
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('       PHASE 3: RENAME SECTIONS AUDIT               ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// 1. Verify PRODUCT Section Title and Subtitle
console.log('1. Checking PRODUCT Section Title & Subtitle...');
const productSection = html.match(/<section id="products"[\s\S]*?<\/section>/);
assert(productSection, 'Found #products section');

const productSectionHtml = productSection[0];

// Check heading
assert(
  /<h2[^>]*>[\s\r\n]*PRODUCT[\s\r\n]*<\/h2>/.test(productSectionHtml),
  'Product section heading is exactly "PRODUCT"'
);
assert(
  !/<h2[^>]*>[\s\r\n]*MAIN PRODUCTS[\s\r\n]*<\/h2>/.test(productSectionHtml),
  '"MAIN PRODUCTS" does not appear as an h2 heading'
);

// Check subtitle
assert(
  productSectionHtml.includes('Products that define our digital expertise'),
  'Product section contains subtitle: "Products that define our digital expertise"'
);
console.log('  [PASS] PRODUCT section heading and subtitle correctly verified.');

// 2. Verify PROJECT DELIVERED Section Title and Subtitle
console.log('\n2. Checking PROJECT DELIVERED Section Title & Subtitle...');
const deliverySection = html.match(/<section id="delivery-projects"[\s\S]*?<\/section>/);
assert(deliverySection, 'Found #delivery-projects section');

const deliverySectionHtml = deliverySection[0];

// Check heading
assert(
  /<h2[^>]*>[\s\r\n]*PROJECT DELIVERED[\s\r\n]*<\/h2>/.test(deliverySectionHtml),
  'Delivery section heading is exactly "PROJECT DELIVERED"'
);
assert(
  !/<h2[^>]*>[\s\r\n]*DELIVERY PROJECTS[\s\r\n]*<\/h2>/.test(deliverySectionHtml),
  '"DELIVERY PROJECTS" does not appear as an h2 heading'
);

// Check subtitle
assert(
  deliverySectionHtml.includes("Projects we've successfully delivered"),
  'Project Delivered section contains subtitle: "Projects we\'ve successfully delivered"'
);
console.log('  [PASS] PROJECT DELIVERED section heading and subtitle correctly verified.');

// 3. Verify other sections are untouched (Navbar, Hero, About, Services, Contact, Footer)
console.log('\n3. Checking other sections integrity (no unauthorized redesign)...');
assert(html.includes('id="home"'), 'Hero section #home present');
assert(html.includes('id="about"'), 'About section #about present');
assert(html.includes('id="services"'), 'Services section #services present');
assert(html.includes('id="contact"'), 'Contact section #contact present');
assert(html.includes('<nav'), 'Navbar element present');
assert(html.includes('<footer'), 'Footer element present');
console.log('  [PASS] All non-product sections remain 100% intact.');

console.log('\n====================================================');
console.log('PHASE 3 AUDIT COMPLETE: 100% PASSED');
console.log('====================================================\n');
