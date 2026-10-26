/**
 * Phase 7 — Section integrity vs git HEAD (read-only)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const headHtml = execSync('git show HEAD:frontend/index.html', { encoding: 'utf8', cwd: root });
const curHtml = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
const headJs = execSync('git show HEAD:frontend/js/main.js', { encoding: 'utf8', cwd: root });
const curJs = fs.readFileSync(path.join(root, 'frontend/js/main.js'), 'utf8');
const headCss = execSync('git show HEAD:frontend/css/style.css', { encoding: 'utf8', cwd: root });
const curCss = fs.readFileSync(path.join(root, 'frontend/css/style.css'), 'utf8');

const norm = (s) => (s || '').replace(/\r\n/g, '\n');

function extractSection(html, sectionId) {
  const idx = html.indexOf(`id="${sectionId}"`);
  if (idx === -1) return null;
  const start = html.lastIndexOf('<section', idx);
  if (start === -1) return null;

  let depth = 0;
  let pos = start;
  while (pos < html.length) {
    const nextOpen = html.indexOf('<section', pos);
    const nextClose = html.indexOf('</section>', pos);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      pos = nextOpen + 8;
      continue;
    }
    depth -= 1;
    pos = nextClose + '</section>'.length;
    if (depth === 0) return html.slice(start, pos);
  }
  return null;
}

function stripProductScopedCss(cssText) {
  const marker = '#products — SaaS product presenter';
  const idx = cssText.indexOf(marker);
  if (idx === -1) return cssText.trim();
  const blockStart = cssText.lastIndexOf('/* ========================================================', idx);
  if (blockStart === -1) return cssText.trim();
  return cssText.slice(0, blockStart).trimEnd();
}

const collapseWs = (s) => (s || '').replace(/\s+/g, ' ').trim();

function extractNav(html) {
  const start = html.indexOf('id="main-navbar"');
  if (start === -1) return null;
  const navStart = html.lastIndexOf('<nav', start);
  const end = html.indexOf('</nav>', start);
  return html.slice(navStart, end + 6);
}

function extractFooter(html) {
  return extractSection(html, 'main-footer') || extractSection(html, 'contact');
}

let pass = 0;
let fail = 0;

function check(name, ok, detail) {
  if (ok) {
    pass++;
    console.log(`  [✓] ${name}`);
  } else {
    fail++;
    console.log(`  [✗] ${name}${detail ? ' — ' + detail : ''}`);
  }
}

console.log('PHASE 7: SECTION INTEGRITY (vs git HEAD)\n');

const headN = norm(headHtml);
const curN = norm(curHtml);

check('Navbar unchanged', norm(extractNav(headHtml)) === norm(extractNav(curHtml)));
check('Hero #home unchanged', extractSection(headN, 'home') === extractSection(curN, 'home'));
check('About #about unchanged', extractSection(headN, 'about') === extractSection(curN, 'about'));
check('Services #services unchanged', extractSection(headN, 'services') === extractSection(curN, 'services'));
check('Contact #contact unchanged', extractSection(headN, 'contact') === extractSection(curN, 'contact'));

const headDelivery = extractSection(headN, 'delivery-projects');
const curDelivery = extractSection(curN, 'delivery-projects');
const qaBlockRe =
  /src="assets\/images\/portfolio\/(?:3\.png|software-testing-qa\.jpg)"\s*\n\s*alt="Software Testing Mockup"\s*\n\s*onerror="[^"]+"/;
const deliveryOnlyQaCard =
  headDelivery !== curDelivery &&
  headDelivery.replace(qaBlockRe, 'QA_IMAGE_BLOCK') === curDelivery.replace(qaBlockRe, 'QA_IMAGE_BLOCK');
check(
  'Delivery #delivery-projects unchanged (except Software Testing card image)',
  headDelivery === curDelivery || deliveryOnlyQaCard
);

const headFooter = extractSection(headHtml, 'main-footer');
const curFooter = extractSection(curHtml, 'main-footer');
check('Footer #main-footer unchanged', headFooter === curFooter);

check('#products section changed (expected)', extractSection(headHtml, 'products') !== extractSection(curHtml, 'products'));
check('#product-showcase added (note: separate from #products)', !headHtml.includes('product-showcase') && curHtml.includes('product-showcase'));

const headCssN = norm(headCss);
const curCssN = norm(curCss);
const cssRootDiff =
  headCssN.match(/^:root[\s\S]*?^}/m)?.[0] === curCssN.match(/^:root[\s\S]*?^}/m)?.[0];
check(':root CSS unchanged', cssRootDiff);

check(
  'CSS outside #products/#product-showcase blocks unchanged (whitespace-normalized)',
  collapseWs(stripProductScopedCss(headCssN)) === collapseWs(stripProductScopedCss(curCssN))
);

const cinematicGuard = curJs.includes("if (!document.getElementById('story-aitalksy')) return;");
check('Legacy cinematic stories gated (no #story DOM)', cinematicGuard);

const assets = [
  'frontend/assets/images/portfolio/aitalksy-logo.png',
  'frontend/assets/images/portfolio/community-forum-logo.png',
  'frontend/assets/images/portfolio/ratehonk-logo.png',
  'frontend/assets/images/portfolio/software-testing-qa.jpg',
  'frontend/assets/images/portfolio/3.png',
];
assets.forEach((rel) => {
  check(`Asset ${path.basename(rel)}`, fs.existsSync(path.join(root, rel)));
});

console.log(`\nTOTAL: ${pass}/${pass + fail} checks passed`);
process.exit(fail ? 1 : 0);
