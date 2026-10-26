/**
 * PHASE 14 — 💡 READABILITY VERIFICATION SUITE
 * 
 * Verifies all requirements of Phase 14:
 * 1. Visual Formula for EVERY Product:
 *    PRODUCT NAME
 *    ↓
 *    WHAT IT DOES
 *    ↓
 *    FEATURES
 *    ↓
 *    VISUAL DEMO
 *    ↓
 *    RESULT
 *    ↓
 *    CTA
 * 2. Do not hide important text behind animation (Static DOM availability).
 * 3. Do not make text too small (Elimination of 8px, 9px, 10px tiny text).
 * 4. Do not use low-contrast gray text (High contrast slate-700/800/900).
 * 5. Do not put text over busy backgrounds (Subtle 0.18 opacity canvas, clean solid card backdrops).
 * 6. Website Preservation & Public Access.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('       PHASE 14: READABILITY AUDIT SUITE            ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

let total = 0;
let passed = 0;

function test(description, condition) {
  total++;
  if (condition) {
    passed++;
    console.log(`  [✓] ${description}`);
    return true;
  } else {
    console.error(`  [✗] FAILED: ${description}`);
    return false;
  }
}

// 1. VISUAL FORMULA & SEQUENCE FOR AI TALKSY
console.log('1. Checking AI Talksy Formula: NAME -> WHAT IT DOES -> FEATURES -> DEMO -> RESULT -> CTA...');
const aiStart = html.indexOf('id="story-aitalksy"');
const aiEnd = html.indexOf('</article>', aiStart);
const aiSnippet = html.substring(aiStart, aiEnd);

const aiNamePos = aiSnippet.indexOf('product-identity-block');
const aiWhatPos = aiSnippet.indexOf('product-what-it-does-block');
const aiFeatPos = aiSnippet.indexOf('product-features-block');
const aiDemoPos = aiSnippet.indexOf('product-story-demo');
const aiResultPos = aiSnippet.indexOf('product-story-result');
const aiCtaPos = aiSnippet.indexOf('product-story-cta');

test('AI Talksy contains PRODUCT NAME block', aiNamePos !== -1);
test('AI Talksy contains WHAT IT DOES block', aiWhatPos !== -1);
test('AI Talksy contains FEATURES block', aiFeatPos !== -1);
test('AI Talksy contains VISUAL DEMO block', aiDemoPos !== -1);
test('AI Talksy contains RESULT block', aiResultPos !== -1);
test('AI Talksy contains CTA block', aiCtaPos !== -1);
test('AI Talksy follows exact sequential order: NAME -> WHAT IT DOES -> FEATURES -> DEMO -> RESULT -> CTA',
  aiNamePos < aiWhatPos && aiWhatPos < aiFeatPos && aiFeatPos < aiDemoPos && aiDemoPos < aiResultPos && aiResultPos < aiCtaPos);

// 2. VISUAL FORMULA & SEQUENCE FOR COMMUNITY FORUM
console.log('\n2. Checking Community Forum Formula: NAME -> WHAT IT DOES -> FEATURES -> DEMO -> RESULT -> CTA...');
const commStart = html.indexOf('id="story-communityforum"');
const commEnd = html.indexOf('</article>', commStart);
const commSnippet = html.substring(commStart, commEnd);

const commNamePos = commSnippet.indexOf('product-identity-block');
const commWhatPos = commSnippet.indexOf('product-what-it-does-block');
const commFeatPos = commSnippet.indexOf('product-features-block');
const commDemoPos = commSnippet.indexOf('product-story-demo');
const commResultPos = commSnippet.indexOf('product-story-result');
const commCtaPos = commSnippet.indexOf('product-story-cta');

test('Community Forum contains PRODUCT NAME block', commNamePos !== -1);
test('Community Forum contains WHAT IT DOES block', commWhatPos !== -1);
test('Community Forum contains FEATURES block', commFeatPos !== -1);
test('Community Forum contains VISUAL DEMO block', commDemoPos !== -1);
test('Community Forum contains RESULT block', commResultPos !== -1);
test('Community Forum contains CTA block', commCtaPos !== -1);
test('Community Forum follows exact sequential order: NAME -> WHAT IT DOES -> FEATURES -> DEMO -> RESULT -> CTA',
  commNamePos < commWhatPos && commWhatPos < commFeatPos && commFeatPos < commDemoPos && commDemoPos < commResultPos && commResultPos < commCtaPos);

// 3. VISUAL FORMULA & SEQUENCE FOR RATEHONK TRAVEL CRM
console.log('\n3. Checking RateHonk CRM Formula: NAME -> WHAT IT DOES -> FEATURES -> DEMO -> RESULT -> CTA...');
const rhStart = html.indexOf('id="story-ratehonk"');
const rhEnd = html.indexOf('</article>', rhStart);
const rhSnippet = html.substring(rhStart, rhEnd);

const rhNamePos = rhSnippet.indexOf('product-identity-block');
const rhWhatPos = rhSnippet.indexOf('product-what-it-does-block');
const rhFeatPos = rhSnippet.indexOf('product-features-block');
const rhDemoPos = rhSnippet.indexOf('product-story-demo');
const rhResultPos = rhSnippet.indexOf('product-story-result');
const rhCtaPos = rhSnippet.indexOf('product-story-cta');

test('RateHonk CRM contains PRODUCT NAME block', rhNamePos !== -1);
test('RateHonk CRM contains WHAT IT DOES block', rhWhatPos !== -1);
test('RateHonk CRM contains FEATURES block', rhFeatPos !== -1);
test('RateHonk CRM contains VISUAL DEMO block', rhDemoPos !== -1);
test('RateHonk CRM contains RESULT block', rhResultPos !== -1);
test('RateHonk CRM contains CTA block', rhCtaPos !== -1);
test('RateHonk CRM follows exact sequential order: NAME -> WHAT IT DOES -> FEATURES -> DEMO -> RESULT -> CTA',
  rhNamePos < rhWhatPos && rhWhatPos < rhFeatPos && rhFeatPos < rhDemoPos && rhDemoPos < rhResultPos && rhResultPos < rhCtaPos);

// 4. DO NOT HIDE IMPORTANT TEXT BEHIND ANIMATION
console.log('\n4. Checking Static Text Accessibility (Not Hidden Behind Animation)...');
test('Product short description visible in static DOM (not hidden)', 
  aiSnippet.includes('product-short-desc') && !aiSnippet.includes('product-short-desc hidden'));
test('Key feature walkthrough visible in static DOM (not hidden)',
  aiSnippet.includes('feature-step-content-box') && !aiSnippet.includes('feature-step-content-box hidden'));
test('Result impact banner visible in static DOM (not hidden)',
  aiSnippet.includes('product-result-banner') && !aiSnippet.includes('product-result-banner hidden'));

// 5. DO NOT MAKE TEXT TOO SMALL
console.log('\n5. Checking Typography Sizing (No Tiny Text 8px, 9px, 10px)...');
const allProductsSection = html.substring(aiStart, rhEnd);
const tinyMatches = allProductsSection.match(/text-\[(8|9|10)px\]/g) || [];
test('Zero instances of text-[8px], text-[9px], or text-[10px] in product showcase', tinyMatches.length === 0);
test('Result metric numbers use prominent font (result-metric-num / text-lg / font-black)', 
  allProductsSection.includes('result-metric-num') && allProductsSection.includes('font-black'));

// 6. DO NOT USE LOW-CONTRAST GRAY TEXT
console.log('\n6. Checking High Contrast Standards (No Low-Contrast Faint Grays)...');
const faintGrayMatches = allProductsSection.match(/text-slate-(400|500)\b/g) || [];
test('Zero instances of text-slate-400 or text-slate-500 in product showcase', faintGrayMatches.length === 0);
test('CSS specifies high-contrast slate-800 (#1e293b) for product short descriptions', 
  css.includes('#products .product-short-desc') && css.includes('#1e293b'));
test('CSS specifies high-contrast slate-900 (#0f172a) for product headings', 
  css.includes('#products h3') && css.includes('#0f172a'));

// 7. DO NOT PUT TEXT OVER BUSY BACKGROUNDS
console.log('\n7. Checking Canvas Background Subtlety & Solid Card Backdrops...');
test('Canvas backgrounds styled with subtle 0.18 opacity in CSS', 
  css.includes('.aitalksy-neural-bg-canvas') && css.includes('opacity: 0.18 !important'));
test('Canvas backgrounds have pointer-events: none to avoid trapping clicks', 
  css.includes('pointer-events: none !important'));
test('What It Does containers have solid background panels with clear border', 
  css.includes('.product-what-it-does-block') && css.includes('background: #ffffff !important'));
test('Result banner containers have solid background panels with clear border', 
  css.includes('.product-result-banner') && css.includes('background: #ffffff !important'));

// 8. WEBSITE PRESERVATION
console.log('\n8. Checking Website Preservation & Public Access...');
test('Navbar intact with navigation links', html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
test('Hero section with Three.js 3D canvas preserved', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
test('Footer section preserved', html.includes('<footer'));
test('Public experience free of login wall', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

// API check
const req = http.get('http://localhost:5000/api/health', (res) => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      test('Backend health API returns status: ok', data.status === 'ok' || data.success === true);
    } catch (e) {
      test('Backend health API response valid', false);
    }

    console.log('\n----------------------------------------------------');
    console.log(`TOTAL TESTS: ${total}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${total - passed}`);
    console.log(`SUCCESS RATE: ${Math.round((passed / total) * 100)}%`);
    console.log('----------------------------------------------------');

    if (passed === total) {
      console.log('\n>>> ALL PHASE 14 READABILITY VERIFICATIONS PASSED! <<<\n');
      process.exit(0);
    } else {
      console.error('\n>>> SOME TESTS FAILED! <<<\n');
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  test('Backend server is accessible', false);
  console.log('\n----------------------------------------------------');
  console.log(`TOTAL TESTS: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${total - passed}`);
  console.log(`SUCCESS RATE: ${Math.round((passed / total) * 100)}%`);
  console.log('----------------------------------------------------');
  process.exit(1);
});
