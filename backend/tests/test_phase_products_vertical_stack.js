/**
 * Phase 4 — Vertical #products stack QA (DOM order, visibility, scoped CSS)
 */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../../frontend/index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../../frontend/css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '../../frontend/js/main.js'), 'utf8');

let total = 0;
let passed = 0;

function check(desc, ok) {
  total += 1;
  if (ok) {
    passed += 1;
    console.log(`  [✓] ${desc}`);
  } else {
    console.error(`  [✗] FAIL: ${desc}`);
  }
}

console.log('PHASE 4: VERTICAL #products STACK QA\n');

const productsBlock = html.match(/<section id="products"[\s\S]*?<\/section>\s*\n\s*<!-- =+\s*\n\s*DELIVERY PROJECTS/s);
const block = productsBlock ? productsBlock[0] : '';

check('Section uses vani-prod-stacked', /id="products" class="[^"]*vani-prod-stacked/.test(html));
check('Stack wrapper present', block.includes('class="vani-prod-stack"'));
check('Legacy tablist hidden', /vani-prod-tablist-legacy[^>]*hidden/.test(block));

const stackInner = block.match(/<div class="vani-prod-stack">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/)?.[1] || '';
const panelOrder = [...stackInner.matchAll(/id="(vani-prod-panel-[^"]+)"/g)].map((m) => m[1]);
check('AI Talksy first in stack', panelOrder[0] === 'vani-prod-panel-aitalksy');
check('Community Forum second', panelOrder[1] === 'vani-prod-panel-community');
check('TravelJioo third', panelOrder[2] === 'vani-prod-panel-traveljioo');

check('Community panel not hidden in markup', !/<article id="vani-prod-panel-community"[^>]*\shidden/.test(block));
check('TravelJioo panel not hidden in markup', !/<article id="vani-prod-panel-traveljioo"[^>]*\shidden/.test(block));

check('CSS shows all stacked panels', css.includes('#products.vani-prod-stacked .vani-prod-panel') && css.includes('display: block'));
check('CSS hides legacy tablist when stacked', css.includes('#products.vani-prod-stacked .vani-prod-tablist-legacy'));
check('Stack overflow guard', css.includes('#products.vani-prod-stacked .vani-prod-stack') && css.includes('overflow-x: clip'));
check('ensureVaniProdStackPanelsVisible in JS', js.includes('function ensureVaniProdStackPanelsVisible'));
check('Stacked init skips tab hide on panels', js.includes("root.classList.contains('vani-prod-stacked')"));

console.log(`\nTOTAL: ${passed}/${total} checks passed\n`);
process.exit(passed === total ? 0 : 1);
