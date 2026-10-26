/**
 * Phase 7 — AI Talksy final verification (read-only)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'frontend/js/main.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'frontend/css/style.css'), 'utf8');
const headHtml = execSync('git show HEAD:frontend/index.html', { encoding: 'utf8', cwd: root });

let pass = 0;
let fail = 0;
const check = (name, ok, detail = '') => {
  if (ok) {
    pass++;
    console.log(`  [✓] ${name}`);
  } else {
    fail++;
    console.log(`  [✗] ${name}${detail ? ' — ' + detail : ''}`);
  }
};

function extractArticle(htmlStr, articleId) {
  const needle = `id="${articleId}"`;
  const idx = htmlStr.indexOf(needle);
  if (idx === -1) return null;
  const start = htmlStr.lastIndexOf('<article', idx);
  const end = htmlStr.indexOf('</article>', idx);
  if (start === -1 || end === -1) return null;
  return htmlStr.slice(start, end + '</article>'.length);
}

const VERIFIED_INTEGRATIONS = [
  'WhatsApp',
  'Slack',
  'Web chat',
  'OpenAI',
  'Google Gemini',
  'Webhooks',
  'REST API',
];

console.log('PHASE 7 FINAL: AI TALKSY + PRESERVATION\n');

const aitalksy = extractArticle(html, 'vani-prod-panel-aitalksy');
check('AI Talksy panel present', !!aitalksy);

if (aitalksy) {
  check('Six feature cards', (aitalksy.match(/data-vani-aitalksy-feature=/g) || []).length === 6);
  check('Four HIW steps', (aitalksy.match(/data-vani-hiw-step="/g) || []).length === 4);
  check('HIW simulated disclaimer', /Simulated demo|simulated/i.test(aitalksy));
  check('Phone HIW views (4)', (aitalksy.match(/data-vani-phone-hiw="/g) || []).length === 4);
  check('Web preview badge (not native app)', /Responsive web preview/i.test(aitalksy));
  check('Replay control', aitalksy.includes('data-vani-hiw-replay') && aitalksy.includes('data-vani-aitalksy-replay-phone'));
  check('Feature explore nav', aitalksy.includes('data-vani-feature-nav="aitalksy"'));
  VERIFIED_INTEGRATIONS.forEach((name) => {
    check(`Integration listed: ${name}`, aitalksy.includes(name));
  });
  check('No unverified Shopify integration in panel', !/Shopify/i.test(aitalksy));
}

check('initAitalksyInteractivePreview wired', js.includes('initAitalksyInteractivePreview'));
check('appendHiwStep demo timeline', js.includes('appendHiwStep'));
check('Keyboard nav for AI Talksy', js.includes('initAitalksyKeyboardNav'));
check('Reduced motion HIW static class', js.includes('vani-prod-hiw-static'));

const headCommunity = extractArticle(headHtml, 'vani-prod-panel-community');
const curCommunity = extractArticle(html, 'vani-prod-panel-community');
const headTravel = extractArticle(headHtml, 'vani-prod-panel-traveljioo');
const curTravel = extractArticle(html, 'vani-prod-panel-traveljioo');

if (headCommunity && curCommunity) {
  check('Community Forum panel unchanged vs HEAD', headCommunity === curCommunity);
} else if (!headCommunity && curCommunity) {
  check('Community Forum panel present in #products (no HEAD vani-prod baseline)', true);
} else {
  check('Community Forum panel present', !!curCommunity);
}

if (headTravel && curTravel) {
  check('TravelJioo panel unchanged vs HEAD', headTravel === curTravel);
} else if (!headTravel && curTravel) {
  check('TravelJioo panel present in #products (no HEAD vani-prod baseline)', true);
} else {
  check('TravelJioo panel present', !!curTravel);
}

check('Community tab unchanged markup slice', curCommunity && curCommunity.includes('communityforum.tech'));
check('TravelJioo tab uses TravelJioo naming', curTravel && /TravelJioo|traveljioo/i.test(curTravel));

check('TravelJioo name in #products', html.includes('TravelJioo') || html.includes('traveljioo'));
check('aitalksy.com explore link', html.includes('https://aitalksy.com/'));

const imgRefs = [
  'assets/images/portfolio/aitalksy-logo.png',
  'assets/images/portfolio/community-forum-logo.png',
  'assets/images/portfolio/ratehonk-logo.png',
];
imgRefs.forEach((ref) => {
  check(`Asset exists: ${path.basename(ref)}`, fs.existsSync(path.join(root, 'frontend', ref)));
});

check('AI Talksy CSS scoped', css.includes("[data-vani-prod-panel='aitalksy']"));
check('No global body override from aitalksy block', !/\nbody\s*\{[^}]*aitalksy/.test(css));

console.log(`\nTOTAL: ${pass}/${pass + fail} checks passed`);
process.exit(fail ? 1 : 0);
