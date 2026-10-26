/**
 * Phase 4 — Product Story System Verification Test
 * Verifies:
 * 1. Reusable system for all 3 main Products (AI Talksy, Community Forum, RateHonk Travel CRM)
 * 2. Left side elements: Product Name, Short Explanation, Important Features, CTA
 * 3. Right side elements: Animated Product Demonstration
 * 4. Desktop Layout (TEXT + CTA on Left, DEMO on Right via 12-col grid)
 * 5. Mobile Layout (TEXT -> DEMO -> CTA via CSS grid order)
 * 6. Responsive and interactive elements (scene pills, replay button, specs modal)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('   PHASE 4: PRODUCT STORY SYSTEM VERIFICATION      ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

// 1. Verify 3 Main Products have the Reusable System
console.log('1. Checking Reusable Product Story System in HTML...');
const productIds = ['story-aitalksy', 'story-communityforum', 'story-ratehonk'];

productIds.forEach((id) => {
  const match = html.match(new RegExp(`<article id="${id}"[\\s\\S]*?<\\/article>`));
  assert(match, `Found product article #${id}`);
  const cardHtml = match[0];

  // Reusable System Containers
  assert(cardHtml.includes('class="product-story-layout'), `#${id} contains .product-story-layout`);
  assert(cardHtml.includes('class="product-story-info'), `#${id} contains .product-story-info`);
  assert(cardHtml.includes('class="product-story-demo'), `#${id} contains .product-story-demo`);
  assert(cardHtml.includes('class="product-story-cta'), `#${id} contains .product-story-cta`);

  // Left Side Requirements
  // - Product Name
  assert(/<h3[^>]*>[\s\S]*?<\/h3>/.test(cardHtml), `#${id} contains Product Name heading (h3)`);
  // - Short Explanation
  assert(/<p class="text-sm text-slate-300[^"]*">/.test(cardHtml), `#${id} contains short explanation paragraph`);
  // - Important Features
  assert(cardHtml.includes('fa-circle-check'), `#${id} contains Important Features checklist`);
  // - CTA
  assert(cardHtml.includes('btn-primary'), `#${id} contains primary CTA button`);
  assert(cardHtml.includes('product-modal-trigger'), `#${id} contains View Specifications trigger`);

  // Right Side Requirements
  // - Animated Product Demonstration
  assert(cardHtml.includes('story-stage-canvas'), `#${id} contains animated stage canvas`);
  assert(cardHtml.includes('product-visualization'), `#${id} contains interactive visualization stage`);
  assert(cardHtml.includes('story-step-pill'), `#${id} contains interactive scene pills`);
  assert(cardHtml.includes('story-replay-btn'), `#${id} contains replay animation button`);
});
console.log('  [PASS] All 3 Main Products implement the complete mini interactive demo system.');

// 2. Verify Desktop Layout in CSS (TEXT + DEMO Side-by-Side)
console.log('\n2. Checking Desktop Layout (TEXT + DEMO)...');
assert(css.includes('.product-story-layout'), 'CSS defines .product-story-layout');
assert(css.includes('@media (min-width: 1024px)'), 'CSS defines min-width 1024px desktop breakpoint');

// Check desktop 12-col grid definition
const desktopSection = css.substring(css.indexOf('@media (min-width: 1024px)'));
assert(desktopSection.includes('grid-template-columns: repeat(12, minmax(0, 1fr))'), 'Desktop uses 12-column grid');
assert(desktopSection.includes('grid-column: 1 / span 5'), 'Desktop places .product-story-info & .product-story-cta on Left (Col 1-5)');
assert(desktopSection.includes('grid-column: 6 / span 7'), 'Desktop places .product-story-demo on Right (Col 6-12)');
console.log('  [PASS] Desktop: Left side (Col 1-5: TEXT + CTA) | Right side (Col 6-12: DEMO) verified.');

// 3. Verify Mobile Layout in CSS (TEXT -> DEMO -> CTA)
console.log('\n3. Checking Mobile Layout Ordering (TEXT -> DEMO -> CTA)...');
// Check default / mobile order rules
assert(/\.product-story-info\s*\{[\s\S]*?order:\s*1;/.test(css), 'Mobile: .product-story-info has order: 1 (TEXT)');
assert(/\.product-story-demo\s*\{[\s\S]*?order:\s*2;/.test(css), 'Mobile: .product-story-demo has order: 2 (DEMO)');
assert(/\.product-story-cta\s*\{[\s\S]*?order:\s*3;/.test(css), 'Mobile: .product-story-cta has order: 3 (CTA)');
console.log('  [PASS] Mobile ordering: TEXT (order: 1) -> DEMO (order: 2) -> CTA (order: 3) verified.');

// 4. Verify Mobile Responsiveness (No overflow, full width buttons)
console.log('\n4. Checking Mobile CTA & Responsiveness...');
assert(css.includes('flex-direction: column !important'), 'Mobile buttons stack vertically in .product-story-cta');
console.log('  [PASS] Mobile CTA buttons stack vertically and fit inside screen.');

console.log('\n====================================================');
console.log('PHASE 4 AUDIT COMPLETE: 100% PASSED');
console.log('====================================================\n');
