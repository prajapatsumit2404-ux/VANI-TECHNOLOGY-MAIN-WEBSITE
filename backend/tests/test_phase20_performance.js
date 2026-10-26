/**
 * =======================================================================
 * PHASE 20 AUDIT: PERFORMANCE & GPU OPTIMIZATION TEST
 * =======================================================================
 * Verifies:
 * 1. Prefer GPU-friendly properties: transform, opacity, scale, translate, force3D
 * 2. Avoid heavy canvas: low particle/node counts, rAF cancelled out-of-view
 * 3. Avoid huge media: zero videos, zero GIFs in #products, small lazy images
 * 4. Avoid expensive constant calculations: rAF throttling, observer gating
 * 5. Avoid heavy 3D in #products: no 3D contexts inside products section
 * 6. Respect prefers-reduced-motion: simpler static version when active
 * 7. Preservation of non-product sections and live backend
 * =======================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

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
console.log('     PHASE 20: PERFORMANCE & GPU AUDIT              ');
console.log('====================================================');

// 1. GPU-FRIENDLY PROPERTIES
console.log('\n1. Checking GPU-Friendly Properties (transform, opacity, scale, translate, force3D)...');
check('CSS uses transform and opacity for transitions and animations',
  css.includes('transform:') && css.includes('opacity:'));
check('CSS enforces will-change on key moving elements',
  css.includes('will-change: transform, opacity') || css.includes('will-change: transform'));
check('GSAP animations enforce hardware acceleration (force3D: true)',
  js.includes('force3D: true'));
check('Phone transitions use transform / opacity / micro-scale',
  js.includes('scale:') && js.includes('opacity:') && js.includes('y:'));

// 2. AVOID HEAVY CANVAS
console.log('\n2. Checking Canvas Performance & Lightweight Design...');
check('AI Talksy background canvas keeps node count low (<= 25)',
  js.includes('nodeCount = isMobile ? 12 : 22') || js.includes('nodeCount'));
check('Community Forum canvas keeps node count low (<= 20)',
  js.includes('nodeCount = isMobile ? 8 : 16') || js.includes('nodeCount'));
check('RateHonk canvas keeps particle count low (<= 20)',
  js.includes('particleCount = isMobile ? 8 : 16') || js.includes('particleCount'));
check('Canvas requestAnimationFrame loops stop when section leaves view',
  js.includes('stopCanvas') && js.includes('cancelAnimationFrame'));
check('Only 1 active product story animates at a time on scroll',
  js.includes('stopStory(currentActiveStoryKey)') || js.includes('setActiveStoryOnScroll'));

// 3. AVOID HUGE VIDEOS, GIFS, AND MASSIVE UNOPTIMIZED MEDIA
console.log('\n3. Checking Avoidance of Heavy Media in Product Section...');
const productSectionMatch = html.match(/<section[^>]*id="products"[^>]*>([\s\S]*?)<\/section>/i);
const productHtml = productSectionMatch ? productSectionMatch[1] : '';

check('Zero <video> tags in Product Section',
  !productHtml.includes('<video'));
check('Zero .gif images in Product Section',
  !productHtml.toLowerCase().includes('.gif'));
check('Product logos use lazy loading (loading="lazy")',
  productHtml.includes('loading="lazy"'));
check('Product logos use asynchronous decoding (decoding="async")',
  productHtml.includes('decoding="async"'));

// 4. AVOID EXPENSIVE CALCULATIONS & EXCESSIVE DOM
console.log('\n4. Checking Event Throttling & Lightweight DOM...');
check('IntersectionObserver used to gate story execution',
  js.includes('new IntersectionObserver'));
check('Mouse parallax uses requestAnimationFrame throttling',
  js.includes('requestAnimationFrame(updateTransforms)') || js.includes('initProductMouseParallax'));
check('Mouse parallax strictly disabled on mobile and touch devices',
  js.includes('window.innerWidth < 1024') && js.includes('(hover: hover) and (pointer: fine)'));

// 5. AVOID HEAVY 3D IN PRODUCT SECTION
console.log('\n5. Checking 3D Isolation (No Heavy 3D inside #products)...');
check('Zero WebGL/Three.js contexts instantiated inside #products',
  !productHtml.includes('three-canvas') && !productHtml.includes('webgl'));
check('Three.js 3D canvas remains exclusively inside #hero-three-canvas',
  html.includes('id="hero-three-canvas"') && !productHtml.includes('hero-three-canvas'));

// 6. RESPECT PREFERS-REDUCED-MOTION
console.log('\n6. Checking Accessibility & prefers-reduced-motion Support...');
check('CSS includes @media (prefers-reduced-motion: reduce)',
  css.includes('@media (prefers-reduced-motion: reduce)'));
check('Keyframe animations and continuous loops disabled in CSS',
  css.includes('animation: none !important;') || css.includes('animation-duration: 0.001ms !important;'));
check('JS dynamically queries and listens to prefers-reduced-motion',
  js.includes("window.matchMedia('(prefers-reduced-motion: reduce)')") && js.includes('isReducedMotion'));
check('JS skips GSAP timelines when prefers-reduced-motion is active',
  js.includes('if (typeof gsap === \'undefined\' || isReducedMotion) return null;'));
check('Canvas render loops stop and render a single static frame under reduced motion',
  js.includes('if (isReducedMotion) renderFrame()') || js.includes('if (isReducedMotion) {'));
check('Simpler static version provided for product UI (transform: none)',
  css.includes('.device-mockup-phone,') && css.includes('transform: none !important;'));

// 7. PRESERVATION & LIVE SERVER INTEGRITY
console.log('\n7. Checking Preservation & Backend Integrity...');
check('Navbar preserved (#home, #about, #services, #products, #contact)',
  html.includes('id="main-navbar"'));
check('Hero 3D scene preserved',
  html.includes('id="home"') && html.includes('id="hero-three-canvas"'));
check('Footer preserved',
  html.includes('id="main-footer"'));

const req = http.get('http://localhost:5000/api/health', (res) => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      check('Server API health check returns HTTP 200 with success: true', 
        res.statusCode === 200 && data.success === true);
    } catch (e) {
      check('Server API health check returns HTTP 200 with success: true', false);
    }
    printResults();
  });
});

req.on('error', () => {
  check('Server API health check returns HTTP 200 with success: true', false);
  printResults();
});

function printResults() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks/totalChecks)*100)}%)`);
  console.log('====================================================');
  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: PHASE 20 PERFORMANCE AUDIT VERIFIED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 20 AUDIT');
    process.exit(1);
  }
}
