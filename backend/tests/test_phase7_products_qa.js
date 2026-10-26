/**
 * Phase 7 — Product section static QA
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
  if (ok) { pass++; console.log(`  [✓] ${name}`); }
  else { fail++; console.log(`  [✗] ${name}`); }
}

console.log('PHASE 7: PRODUCT SECTION QA\n');

check('#products exists', html.includes('id="products"'));
check('Tabbed flagship products', html.includes('data-vani-prod-tab="aitalksy"') && html.includes('TravelJioo'));
check('Split layout grid', html.includes('vani-prod-panel-grid'));
check('Hero canvas present', html.includes('vani-prod-hero-canvas'));
check('INPUT→RESULT flow rails', html.includes('vani-prod-flow-rail') && html.includes('vani-prod-story-rail'));
check('GSAP demo controller', js.includes('createVaniProductsDemoController'));
check('Scroll reveal (once)', js.includes('initVaniProductsScrollReveal'));
check('Reduced motion path', js.includes('vani-prod-demo-static'));
check('Scoped CSS #products', (css.match(/#products/g) || []).length > 40);
check('Mobile stack rules', css.includes('max-width: 1023px') && css.includes('display: contents'));
const newProductCss = css.slice(css.indexOf('#products — SaaS'));
const newShowcaseCss = css.includes('Premium product showcase')
  ? css.slice(css.indexOf('Premium product showcase'))
  : '';
const scopedOnly =
  !/\n(?:body|html)\s*\{/.test(newProductCss + newShowcaseCss) &&
  !/#product-showcase\s+body|#products\s+body/.test(newProductCss + newShowcaseCss);
check('No global body/html overrides in new blocks', scopedOnly);
check('PRODUCTS_DATA TravelJioo', js.includes("title: 'TravelJioo'"));
check('Software testing QA image in delivery', html.includes('software-testing-qa.jpg'));
check('Telemedicine still 3.png', html.includes('data-product-id="telemedicine"') && html.includes('assets/images/portfolio/3.png'));

const globalSelectors = ['.btn-primary', '.product-story', '.cinematic-story-card'];
globalSelectors.forEach((sel) => {
  const re = new RegExp(`\\n${sel.replace('.', '\\.')}\\s*\\{`, 'g');
  const head = css.slice(0, css.indexOf('#products — SaaS'));
  check(`Global ${sel} not modified in #products block`, !css.slice(css.indexOf('#products — SaaS')).match(re));
});

console.log(`\nTOTAL: ${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
