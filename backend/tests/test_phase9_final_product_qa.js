/**
 * PHASE 9 — Final #products QA (checklist + site scope vs HEAD)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'frontend/css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'frontend/js/main.js'), 'utf8');
const norm = (s) => (s || '').replace(/\r\n/g, '\n');

let pass = 0;
let fail = 0;

function check(name, ok) {
  if (ok) {
    pass++;
    console.log(`  [✓] ${name}`);
  } else {
    fail++;
    console.log(`  [✗] ${name}`);
  }
}

/** Match full section including nested `<section>` blocks (e.g. #products stack). */
function extractSection(htmlStr, sectionId) {
  const idx = htmlStr.indexOf(`id="${sectionId}"`);
  if (idx === -1) return '';
  const start = htmlStr.lastIndexOf('<section', idx);
  if (start === -1) return '';

  let depth = 0;
  let pos = start;
  while (pos < htmlStr.length) {
    const nextOpen = htmlStr.indexOf('<section', pos);
    const nextClose = htmlStr.indexOf('</section>', pos);
    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      pos = nextOpen + 8;
      continue;
    }

    depth -= 1;
    pos = nextClose + '</section>'.length;
    if (depth === 0) return htmlStr.slice(start, pos);
  }
  return '';
}

console.log('PHASE 9: FINAL PRODUCT SECTION QA\n');
console.log('--- Site scope (vs git HEAD) ---');

const headHtml = norm(execSync('git show HEAD:frontend/index.html', { encoding: 'utf8', cwd: root }));
const curHtml = norm(html);

check('Navbar unchanged', extractSection(headHtml, 'main-navbar') === extractSection(curHtml, 'main-navbar'));
check('Hero #home unchanged', extractSection(headHtml, 'home') === extractSection(curHtml, 'home'));
check('About #about unchanged', extractSection(headHtml, 'about') === extractSection(curHtml, 'about'));
check('Services #services unchanged', extractSection(headHtml, 'services') === extractSection(curHtml, 'services'));
check('Contact #contact unchanged', extractSection(headHtml, 'contact') === extractSection(curHtml, 'contact'));
check('Footer unchanged', extractSection(headHtml, 'main-footer') === extractSection(curHtml, 'main-footer'));
check('#products section updated', extractSection(headHtml, 'products') !== extractSection(curHtml, 'products'));

console.log('\n--- Product checklist ---');

const products = extractSection(curHtml, 'products');
check('Realistic phone mockup (frame, island, home indicator)', /vani-prod-phone-frame/.test(products) && /vani-prod-device-island/.test(products) && /vani-prod-phone-home/.test(products));
check('Actual product UI (in-phone app views)', /data-vani-app="aitalksy"/.test(products) && /data-vani-app="community"/.test(products) && /data-vani-app="traveljioo"/.test(products));
check('Real features (AI Talksy omnichannel, CRM, etc.)', /Omnichannel inbox/.test(products) && /Member directory/.test(products) && /Deal pipeline/.test(products));
check('Automatic demo controller', js.includes('createVaniProductsDemoController') && js.includes('repeat: -1'));
check('Feature story + live now line', /data-vani-feature-story/.test(products) && /data-vani-feature-now/.test(products));
check('Feature sync (setActiveFeature in demo)', js.includes('setActiveFeature(') && js.includes('data-vani-feature'));
check('GSAP demos + reduced motion static path', js.includes('vani-prod-demo-static') && js.includes('prefers-reduced-motion'));
check('User controls (steps, dots, prev/next, resume)', /data-vani-feature-nav/.test(products) && /data-vani-feature-dot/.test(products) && js.includes('bindFeatureExplore'));
check('Swipe zone on phone', /data-vani-swipe-zone/.test(products) && js.includes('touchstart'));
check('Responsive stack (display: contents ≤1023px)', css.includes('display: contents') && css.includes('max-width: 1023px'));
check('No horizontal overflow guards (#products)', css.includes('overflow-x: clip') && css.includes('#products .vani-prod-panel-grid'));
check('Phone max-width bounded', css.includes('#products .vani-prod-phone-stage') && css.includes('max-width: 100%'));
check('Accessible feature buttons', /button type="button" class="vani-prod-feature-step"/.test(products));
check('aria-live on demo captions / now playing', /aria-live="polite"/.test(products));
check('Legacy cinematic stories gated off', js.includes("if (!document.getElementById('story-aitalksy')) return;"));
check('initVaniProductsSection wired on DOMContentLoaded', js.includes('initVaniProductsSection();'));

console.log('\n--- Assets in #products ---');
const prodStart = curHtml.indexOf('id="products"');
const prodEnd = curHtml.indexOf('</section>', prodStart);
const prodBlock = curHtml.slice(prodStart, prodEnd);
const srcs = [...prodBlock.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
let assetsOk = true;
srcs.forEach((rel) => {
  const p = path.join(root, 'frontend', rel.replace(/^\//, ''));
  if (!fs.existsSync(p)) {
    assetsOk = false;
    console.log(`  [✗] Missing asset: ${rel}`);
  }
});
check(`All ${srcs.length} #products image refs exist`, assetsOk);

console.log('\n--- Scope notes (informational) ---');
if (curHtml.includes('id="product-showcase"') && !headHtml.includes('id="product-showcase"')) {
  console.log('  [i] #product-showcase exists above #products (not in git HEAD; outside strict #products-only scope)');
}
const headSeed = execSync('git show HEAD:backend/utils/seedProducts.js', { encoding: 'utf8', cwd: root }).trim();
const curSeed = fs.readFileSync(path.join(root, 'backend/utils/seedProducts.js'), 'utf8').trim();
if (headSeed !== curSeed) {
  console.log('  [i] backend/utils/seedProducts.js differs from HEAD (not part of #products HTML/CSS)');
}

console.log(`\nTOTAL: ${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
