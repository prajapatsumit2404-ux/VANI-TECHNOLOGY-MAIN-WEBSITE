/**
 * Phase 6 — Showcase scope validation (read-only checks)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'frontend/js/main.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'frontend/css/style.css'), 'utf8');

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

console.log('PHASE 6: SHOWCASE SCOPE VALIDATION\n');

const iServ = html.indexOf('id="services"');
const iShow = html.indexOf('id="product-showcase"');
const iProd = html.indexOf('id="products"');
const iDel = html.indexOf('id="delivery-projects"');

check('Showcase exists (#product-showcase)', iShow > -1);
check('Showcase is after Services and before Product', iServ < iShow && iShow < iProd);
check('Product section still follows showcase', iProd < iDel);
check('Navbar still links to #products (not replaced)', html.includes('href="#products"') && !html.includes('href="#product-showcase"'));
check('Hero #home preserved', html.includes('id="home"') && html.includes('hero-three-canvas'));
check('About #about preserved', html.includes('id="about"'));
check('Delivered #delivery-projects preserved', html.includes('id="delivery-projects"'));
check('Footer #main-footer preserved', html.includes('id="main-footer"'));

check('initProductShowcase defined', js.includes('function initProductShowcase()'));
check('Showcase init on DOMContentLoaded', js.includes('initProductShowcase();'));
check('Showcase JS uses existing gsap only', !js.slice(js.indexOf('function initProductShowcase')).includes('import ') && js.includes('typeof gsap'));

const showcaseCssStart = css.indexOf('Premium product showcase');
check('Showcase CSS block present', showcaseCssStart > -1);
const cssOutsideShowcase = css.slice(0, showcaseCssStart);
check('No showcase selectors before dedicated CSS block', !cssOutsideShowcase.includes('#product-showcase'));

['aitalksy-logo.png', 'community-forum-logo.png', 'ratehonk-logo.png'].forEach((f) => {
  check(`Asset ${f}`, fs.existsSync(path.join(root, 'frontend/assets/images/portfolio', f)));
});

check('Three showcase tab panels', (html.match(/data-showcase-product=/g) || []).length >= 3);
check('Float deck + phone in each panel', (html.match(/showcase-float-deck/g) || []).length === 3);

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
check('No new npm dependency for showcase', !pkg.dependencies.gsap && !pkg.dependencies['gsap']);

console.log(`\nTOTAL: ${pass}/${pass + fail} passed`);
process.exit(fail > 0 ? 1 : 0);
