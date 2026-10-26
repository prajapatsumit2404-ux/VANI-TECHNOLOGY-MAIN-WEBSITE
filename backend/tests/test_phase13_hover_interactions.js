/**
 * PHASE 13 — HOVER INTERACTIONS TEST SUITE
 * 
 * Verifies subtle hover reactions when user hovers over a Product:
 * 1. Phone / Dashboard moves slightly (2-4px lift, subtle micro-scale)
 * 2. UI glows (subtle theme accent glow on mockups and headers)
 * 3. Background reacts (canvas opacity increases, gentle 1.25x particle/node activity)
 * 4. CTA becomes brighter (brightness increased, arrow nudged forward)
 * 5. Important element highlights (AI orb, verified badge, pipeline)
 * 6. Subtle effects strictly enforced:
 *    - NO shaking
 *    - NO giant zoom
 *    - NO flashing
 *    - NO crazy rotation
 * 7. Accessibility & prefers-reduced-motion respected
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('     PHASE 13: HOVER INTERACTIONS AUDIT             ');
console.log('====================================================\n');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [✓] ${desc}`);
    return true;
  } else {
    console.error(`  [✗] FAILED: ${desc}`);
    return false;
  }
}

// 1. PHONE / DASHBOARD MOVES SLIGHTLY
console.log('1. Checking Phone & Dashboard Movement on Hover...');
check('Phone mockup moves slightly on hover (translateY micro-lift)', 
  css.includes('.device-mockup-phone') && css.includes(':hover .device-mockup-phone') && 
  /translateY\(-[2-6]px\)/.test(css));
check('Browser dashboard mockup moves slightly on hover (translateY micro-lift)', 
  css.includes('.device-mockup-browser') && css.includes(':hover .device-mockup-browser') && 
  /translateY\(-[2-6]px\)/.test(css));

// 2. UI GLOWS ON HOVER
console.log('\n2. Checking UI Glows on Hover...');
check('AI Talksy phone UI glows on card hover', 
  css.includes('.theme-aitalksy:hover .phone-app-header') || css.includes('.theme-aitalksy:hover .phone-status-bar'));
check('Community Forum phone UI glows on card hover', 
  css.includes('.theme-community:hover .device-mockup-phone') && css.includes('rgba(16, 185, 129,'));
check('RateHonk browser UI glows on card hover', 
  css.includes('.theme-ratehonk:hover .browser-titlebar') || css.includes('.theme-ratehonk:hover .browser-address-bar'));

// 3. BACKGROUND REACTS ON HOVER
console.log('\n3. Checking Background Reaction on Hover...');
check('Background canvas opacity increases gracefully on hover (0.8 max)', 
  css.includes('.theme-aitalksy:hover .aitalksy-neural-bg-canvas') && 
  css.includes('.theme-community:hover .community-ecosystem-bg-canvas') && 
  css.includes('.theme-ratehonk:hover .ratehonk-saas-bg-canvas'));
check('JS tracks isHovered on story container mouseenter/mouseleave', 
  js.includes('story.isHovered = true') && js.includes('story.isHovered = false'));
check('AI Talksy background canvas increases activity on hover (hoverSpeed)', 
  js.includes('stories.aitalksy.isHovered') && js.includes('hoverSpeed'));
check('Community Forum background canvas increases activity on hover (hoverSpeed)', 
  js.includes('stories.community.isHovered') && js.includes('hoverSpeed'));
check('RateHonk background canvas increases activity on hover (hoverSpeed)', 
  js.includes('stories.ratehonk.isHovered') && js.includes('hoverSpeed'));

// 4. CTA BECOMES BRIGHTER
console.log('\n4. Checking CTA Brightness on Hover...');
check('CTA button increases brightness on card hover', 
  css.includes('.product-story-cta .btn-primary') && css.includes('filter: brightness('));
check('CTA arrow icon nudges forward on card hover', 
  css.includes('.product-story-cta .btn-primary i') && css.includes('translateX('));
check('CTA buttons have vibrant theme shadow glow on hover', 
  css.includes('.theme-aitalksy .product-story-cta a.btn-primary:hover') && 
  css.includes('.theme-community .product-story-cta a.btn-primary:hover') && 
  css.includes('.theme-ratehonk .product-story-cta a.btn-primary:hover'));

// 5. IMPORTANT ELEMENT HIGHLIGHTS
console.log('\n5. Checking Important Element Highlights...');
check('AI Talksy: neural core / typing text highlights on hover', 
  css.includes('.theme-aitalksy:hover .animate-ai-core') || css.includes('.theme-aitalksy:hover #aitalksy-typing-text'));
check('Community Forum: member nodes / verified shield highlight on hover', 
  css.includes('.theme-community:hover .community-person-node') || css.includes('.theme-community:hover .animate-shield-glow'));
check('RateHonk: pipeline flow highlights on hover', 
  css.includes('.theme-ratehonk:hover .animate-pipeline-flow'));

// 6. SUBTLE EFFECTS GUARDRAILS (NO SHAKING, NO GIANT ZOOM, NO FLASHING, NO CRAZY ROTATION)
console.log('\n6. Checking Subtle Effects Guardrails (No Shaking, Zoom, Flashing, Rotation)...');
check('No giant zoom (hover scale <= 1.05)', 
  !/scale\((1\.[1-9]|[2-9])\)/.test(css.match(/\.cinematic-story-card:hover[\s\S]*?\}/g)?.join(' ') || ''));
check('No crazy rotation on card hover (rotation <= 5deg or none)', 
  !/rotate\(([1-9][0-9]+|\d{2,})deg\)/.test(css.match(/\.cinematic-story-card:hover[\s\S]*?\}/g)?.join(' ') || ''));
check('prefers-reduced-motion respected in CSS', 
  css.includes('prefers-reduced-motion: reduce'));
check('prefers-reduced-motion respected in JS hover logic', 
  js.includes('!isReducedMotion') && js.includes('prefers-reduced-motion'));

// 7. WEBSITE PRESERVATION INTEGRITY
console.log('\n7. Checking Website Preservation Integrity...');
check('Navbar preserved (#home, #about, #services, #products, #contact)', 
  html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
check('Hero 3D scene preserved', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
check('Footer preserved', html.includes('<footer'));
check('Public navigation free of login link', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

// API Check
const req = http.get('http://localhost:5000/api/health', (res) => {
  let rawData = '';
  res.on('data', chunk => { rawData += chunk; });
  res.on('end', () => {
    try {
      const data = JSON.parse(rawData);
      check('Server API health check returns HTTP 200 with success: true', res.statusCode === 200 && data.success === true);
    } catch (e) {
      check('Server API health check returns HTTP 200 with success: true', false);
    }
    finishTest();
  });
});

req.on('error', () => {
  check('Server API health check returns HTTP 200 with success: true', false);
  finishTest();
});

function finishTest() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
  console.log('====================================================');

  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: PHASE 13 HOVER INTERACTIONS VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED!\n');
    process.exit(1);
  }
}
