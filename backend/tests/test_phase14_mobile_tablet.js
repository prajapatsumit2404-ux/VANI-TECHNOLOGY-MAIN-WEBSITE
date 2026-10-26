/**
 * PHASE 14: Mobile & tablet responsiveness (current #products stack + site preservation)
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

const root = path.join(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'frontend/css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'frontend/js/main.js'), 'utf8');
const vaniExp = fs.readFileSync(path.join(root, 'frontend/js/vani-experience.js'), 'utf8');
const vaniExpCss = fs.readFileSync(path.join(root, 'frontend/css/vani-experience.css'), 'utf8');
const vaniPtrJs = fs.readFileSync(path.join(root, 'frontend/js/vani-pointer-interactions.js'), 'utf8');

console.log('====================================================');
console.log('     PHASE 14: MOBILE & TABLET AUDIT                ');
console.log('====================================================');

// 1. DESKTOP — large demo layout (lg grid + constrained children)
console.log('\n1. Desktop product presenter layout...');
check(
  'Product panels use 12-column grid at lg breakpoint in markup',
  html.includes('vani-prod-panel-grid') && html.includes('lg:grid-cols-12')
);
check(
  '#products child elements enforce min-width:0 and max-width:100%',
  css.includes('#products .vani-prod-panel-grid') &&
    css.includes('min-width: 0') &&
    css.includes('max-width: 100%')
);
check(
  'Phone mockup stage scoped under #products',
  css.includes('#products .vani-prod-phone-stage') && html.includes('vani-prod-phone-frame')
);
check(
  'Three stacked panels visible in vertical stack mode',
  (html.match(/class="vani-prod-panel/g) || []).length >= 3
);

// 2. TABLET
console.log('\n2. Tablet breakpoints...');
check(
  'Tablet range media query present (768px–1023px)',
  css.includes('@media (min-width: 768px) and (max-width: 1023px)')
);
check(
  'Stacked products tighten layout below 1024px',
  css.includes('@media (max-width: 1023px)') && css.includes('#products.vani-prod-stacked .vani-prod-stack')
);

// 3. MOBILE ordering (<1024px flex column + CSS order)
console.log('\n3. Mobile content order (copy → demo → CTA)...');
check(
  'Mobile switches #products panel grid to column flex',
  css.includes('#products .vani-prod-panel-grid') &&
    css.includes('flex-direction: column') &&
    css.includes('@media (max-width: 1023px)')
);
check(
  'Mobile orders product title and description before hero demo',
  css.includes('#products .vani-prod-copy h3') && css.includes('order: 1') &&
    css.includes('#products .vani-prod-hero') && css.includes('order: 6')
);
check(
  'Each flagship has stack header label for scanability on small screens',
  (html.match(/vani-prod-stack-header-title/g) || []).length >= 3
);
check(
  'Primary CTAs use touch-friendly btn classes in product panels',
  html.includes('vani-prod-panel') && (html.match(/btn-primary/g) || []).length >= 3
);

// 4. NO HORIZONTAL SCROLL
console.log('\n4. Overflow containment...');
check(
  '#products section uses overflow clipping in markup',
  html.includes('id="products"') && html.includes('overflow-hidden')
);
check(
  'Mobile panel grid uses overflow-x: clip',
  css.includes('#products .vani-prod-panel-grid') && css.includes('overflow-x: clip')
);
check(
  '#product-showcase scoped overflow-x clip',
  css.includes('#product-showcase { overflow-x: clip')
);
check(
  'Global box-sizing border-box preserved',
  css.includes('box-sizing: border-box')
);

// 5. POINTER / HOVER TIERS
console.log('\n5. Touch-safe interaction tiers...');
check(
  'Experience script sets pointer/motion tiers from viewport + reduced motion',
  vaniExp.includes('pointerTier') && vaniExp.includes('prefers-reduced-motion')
);
check(
  'Main product logic gates fine-pointer hover handlers',
  js.includes("(hover: hover) and (pointer: fine)")
);
check(
  'Coarse / non-fine pointers disable cursor glow (JS gate + experience CSS)',
  vaniPtrJs.includes('(pointer: fine)') &&
    vaniExpCss.includes("data-vani-pointer-tier='off'") &&
    vaniExpCss.includes('(pointer: coarse)')
);

// 6. READABLE TEXT
console.log('\n6. Mobile typography...');
check(
  'Product headings allow word-break on small screens',
  css.includes('#products .vani-prod-copy h3') || css.includes('word-break: break-word')
);
check(
  'Showcase phone screen prevents horizontal text overflow',
  css.includes('#product-showcase .showcase-phone-screen') && css.includes('overflow-x: hidden')
);

// 7. LAYERING (decor behind interactive UI)
console.log('\n7. Demo layering...');
check(
  'Decor canvases / overlays use pointer-events: none under #products',
  css.includes('#products') && css.includes('pointer-events: none')
);
check(
  'Reduced-motion rules exist for product/showcase animations',
  css.includes('@media (prefers-reduced-motion: reduce)')
);

// 8. SITE PRESERVATION
console.log('\n8. Website preservation integrity...');
check(
  'Navbar anchor targets preserved',
  html.includes('href="#home"') &&
    html.includes('href="#about"') &&
    html.includes('href="#services"') &&
    html.includes('href="#products"') &&
    html.includes('href="#contact"')
);
check(
  'Hero 3D scene preserved',
  html.includes('id="home"') &&
    (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container'))
);
check(
  'Footer preserved',
  html.includes('<footer') || html.includes('id="main-footer"')
);
check(
  'Public home nav free of login link',
  !html.includes('href="login.html"') && !html.includes('href="/login.html"')
);

const req = http.get('http://127.0.0.1:5000/api/health', (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      check('Server API health check returns HTTP 200 with success: true', res.statusCode === 200 && data.success === true);
    } catch (e) {
      check('Server API health check returns HTTP 200 with success: true', false);
    }
    summarize();
  });
});

req.on('error', () => {
  check('Server API health check returns HTTP 200 with success: true', false);
  summarize();
});

function summarize() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
  console.log('====================================================');
  process.exit(passedChecks === totalChecks ? 0 : 1);
}
