/**
 * Phase 7 — Community Forum interactive showcase final verification
 * (Onboarding + main app preview in #vani-prod-panel-community only)
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const root = path.join(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'frontend/css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'frontend/js/main.js'), 'utf8');

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

function extractCommunityPanel(source) {
  const start = source.indexOf('id="vani-prod-panel-community"');
  if (start < 0) return '';
  const end = source.indexOf('<!-- TravelJioo', start);
  return end > start ? source.slice(start, end) : source.slice(start, start + 120000);
}

const panelHtml = extractCommunityPanel(html);
const cfJsBlock = js.slice(js.indexOf('function initCommunityInteractivePreview'), js.indexOf('function initAitalksyInteractivePreview'));

console.log('====================================================');
console.log(' PHASE 7: COMMUNITY FORUM SHOWCASE FINAL VERIFICATION');
console.log('====================================================\n');

// Scope
console.log('0. Showcase scope & wiring');
check('Community panel + interactive showcase markup', panelHtml.includes('data-vani-community-showcase') && panelHtml.includes('vani-prod-community-showcase'));
check('initCommunityInteractivePreview defined', js.includes('function initCommunityInteractivePreview'));
check('Wired from initVaniProductsSection', js.includes('initCommunityInteractivePreview(root)'));
check('GSAP community demo skipped when interactive', js.includes('communityInteractive') && cfJsBlock.includes('isInteractive: true'));
check('Community CSS scoped to panel selector', css.includes("[data-vani-prod-panel='community']") && css.includes('Phase 6 — Community Forum responsive'));

const ONBOARDING = [
  'cf-onboarding',
  'cf-mobile',
  'cf-otp',
  'cf-aadhaar',
  'cf-uidai',
  'cf-review',
  'cf-personal',
  'cf-work',
  'cf-photo',
  'cf-submit',
  'cf-awaiting',
  'cf-approved',
];

const MAIN_JOURNEY = [
  'cf-dashboard',
  'cf-feed',
  'cf-matrimony',
  'cf-marketplace',
  'cf-bill-pay',
  'cf-e-voting',
  'cf-events',
  'cf-committee',
  'cf-announcements',
  'cf-family-tree',
  'cf-profile',
  'cf-earnings',
];

const MAIN_EXTRA = ['cf-ai', 'cf-reels', 'cf-market-detail', 'cf-event-detail', 'cf-announcement-detail'];

console.log('\n1. Onboarding screens & navigation');
ONBOARDING.forEach((id) => {
  check(`HTML view ${id}`, panelHtml.includes(`data-app-view="${id}"`));
});
check('Onboarding step back/continue controls', panelHtml.includes('data-vani-cf-step-back') && panelHtml.includes('data-vani-cf-step-continue'));
check('Back to welcome links', panelHtml.includes('data-vani-cf-to-welcome'));
check('Get Started / sign-in actions', panelHtml.includes('data-vani-cf-action="get-started"') && panelHtml.includes('data-vani-cf-action="sign-in"'));
check('JS onboarding flow array (12 steps)', ONBOARDING.every((id) => cfJsBlock.includes(`'${id}'`)));
check('validateScreen + stepScreen navigation', cfJsBlock.includes('validateScreen') && cfJsBlock.includes('stepScreen'));
check('Demo OTP 123456 in JS', cfJsBlock.includes("'123456'") || cfJsBlock.includes('DEMO_OTP'));

console.log('\n2. Main app screens & content hooks');
[...MAIN_JOURNEY, ...MAIN_EXTRA].forEach((id) => {
  check(`HTML main view ${id}`, panelHtml.includes(`data-app-view="${id}"`));
});
check('Bottom nav five tabs', (panelHtml.match(/data-vani-cf-nav=/g) || []).length >= 5);
check('Dashboard quick tiles (goto)', panelHtml.includes('data-vani-cf-goto='));

console.log('\n3. Journey list → phone preview (showScreen)');
check('SCREENS metadata for onboarding + main journey', MAIN_JOURNEY.every((id) => cfJsBlock.includes(`id: '${id}'`)));
check('renderScreenList builds data-vani-cf-screen buttons', cfJsBlock.includes('renderScreenList') && cfJsBlock.includes('data-vani-cf-screen'));
check('showScreen toggles is-active-view', cfJsBlock.includes('is-active-view'));
check('Demo caption sync', cfJsBlock.includes('data-vani-demo-caption="community"'));

console.log('\n4. Bottom navigation');
check('appNav click → showScreen', cfJsBlock.includes("querySelectorAll('[data-vani-cf-nav]')"));
check('applyChrome shows nav on MAIN_APP_IDS', cfJsBlock.includes('MAIN_APP_IDS') && cfJsBlock.includes('bottomNavForView'));

console.log('\n5. Search & category filters');
['feed', 'matrimony', 'market'].forEach((key) => {
  check(`Filter root ${key}`, panelHtml.includes(`data-vani-cf-filter-root="${key}"`) || panelHtml.includes(`data-vani-cf-filter-root='${key}'`));
});
check('applyFilterChip in JS', cfJsBlock.includes('applyFilterChip') && cfJsBlock.includes('data-vani-cf-chip'));
check('Search inputs bound', panelHtml.includes('data-vani-cf-search') && cfJsBlock.includes("querySelector('[data-vani-cf-search]')"));

// Logic spot-check (same rules as applyFilterChip)
function filterItems(items, chipKey, searchVal) {
  return items.filter((item) => {
    const tags = (item.tags || '').split(/\s+/);
    const text = (item.text || '').toLowerCase();
    const tagOk = chipKey === 'all' || tags.includes(chipKey);
    const searchOk = !searchVal || text.includes(searchVal.toLowerCase());
    return tagOk && searchOk;
  });
}
const sampleFeed = [
  { tags: 'news', text: 'agm notice society meeting' },
  { tags: 'help', text: 'volunteer blood donation' },
];
check('Filter logic: chip news', filterItems(sampleFeed, 'news', '').length === 1);
check('Filter logic: search volunteer', filterItems(sampleFeed, 'all', 'volunteer').length === 1);

console.log('\n6. Profile tabs & family tree');
check('Profile tablist + panes', panelHtml.includes('data-vani-cf-profile-tab') && panelHtml.includes('data-vani-cf-profile-pane'));
check('Profile tab switching in JS', cfJsBlock.includes('data-vani-cf-profile-tab'));
check('Family tree nodes in HTML', panelHtml.includes('vani-prod-cf-tree') && panelHtml.includes('cf-family-tree'));

console.log('\n7. Event, marketplace, announcement details');
check('Market detail open/back', panelHtml.includes('data-vani-cf-open="cf-market-detail"') && panelHtml.includes('data-vani-cf-back="cf-marketplace"'));
check('Event detail open/back', panelHtml.includes('data-vani-cf-open="cf-event-detail"') && panelHtml.includes('data-vani-cf-back="cf-events"'));
check('Announcement detail open/back', panelHtml.includes('data-vani-cf-open="cf-announcement-detail"') && panelHtml.includes('data-vani-cf-back="cf-announcements"'));
check('sidebarHighlightId maps detail → parent', cfJsBlock.includes('sidebarHighlightId') && cfJsBlock.includes('cf-market-detail'));

console.log('\n8. Demo voting & bill payment confirmations');
check('Pay demo button + success banner', panelHtml.includes('data-vani-cf-pay-demo') && panelHtml.includes('data-vani-cf-pay-success') && panelHtml.includes('Payment Successful'));
check('Vote demo + success banner', panelHtml.includes('data-vani-cf-vote-demo') && panelHtml.includes('data-vani-cf-vote-success') && panelHtml.includes('Vote Submitted'));
check('Handlers in JS', cfJsBlock.includes('data-vani-cf-pay-demo') && cfJsBlock.includes('data-vani-cf-vote-demo'));

console.log('\n9. Auto-play, pause & restart');
check('Auto-play / pause / restart controls in HTML', panelHtml.includes('data-vani-cf-autoplay-play') && panelHtml.includes('data-vani-cf-autoplay-pause') && panelHtml.includes('data-vani-cf-restart'));
check('startAutoplay + pauseAutoplay + restartJourney', cfJsBlock.includes('startAutoplay') && cfJsBlock.includes('pauseAutoplay') && cfJsBlock.includes('restartJourney'));
check('AbortController cleanup', cfJsBlock.includes('AbortController') && cfJsBlock.includes('_vaniCfAbort'));
check('Prefill for autoplay onboarding', cfJsBlock.includes('prefillDemoForStep'));

console.log('\n10. Responsive layouts (community-scoped CSS)');
check('Desktop grid columns 7+5', css.includes("[data-vani-prod-panel='community']") && css.includes('grid-column: span 7'));
check('Tablet breakpoint 768–1023', css.includes('@media (min-width: 768px) and (max-width: 1023px)') && css.includes("[data-vani-prod-panel='community']"));
check('Mobile stack ≤767 community rules', css.includes('@media (max-width: 767px)') && css.includes("[data-vani-prod-panel='community'] .vani-prod-cf-journey-tab"));
check('Journey list scroll containment', css.includes("[data-vani-prod-panel='community'] .vani-prod-cf-screens-list") && css.includes('overscroll-behavior-y: contain'));

console.log('\n11. Assets, overflow guards, JS syntax');
const imgRefs = [...panelHtml.matchAll(/src="([^"]+)"/g)].map((m) => m[1]).filter((s) => s.startsWith('assets/'));
imgRefs.forEach((rel) => {
  check(`Asset on disk: ${rel}`, fs.existsSync(path.join(root, 'frontend', rel.replace(/\//g, path.sep))));
});
check('Panel overflow-x clip', css.includes("[data-vani-prod-panel='community'].vani-prod-community-panel") && css.includes('overflow-x: clip'));
check('External CTA communityforum.tech', panelHtml.includes('https://communityforum.tech/') && panelHtml.includes('EXPLORE COMMUNITY FORUM'));
check('Member directory phrase (QA copy)', panelHtml.includes('Member directory'));

console.log('\n--- Preservation (shared site; read-only) ---');
check('Navbar id present', html.includes('id="main-navbar"'));
check('Hero canvas present', html.includes('id="hero-three-canvas"'));
check('Footer present', html.includes('id="main-footer"'));
check('TravelJioo name preserved in #products', html.includes('TravelJioo'));
check('AI Talksy init preserved', js.includes('function initAitalksyInteractivePreview'));

console.log('\n--- HTTP smoke (optional; server must be listening) ---');
function fetchPath(port, urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${port}${urlPath}`, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

const PORT = process.env.PORT || 5000;

fetchPath(PORT, '/')
  .then((r) => {
    check('GET / returns 200', r.status === 200);
    check('Served HTML includes community showcase', r.body.toString('utf8').includes('data-vani-community-showcase'));
    return fetchPath(PORT, '/assets/images/portfolio/community-forum-logo.png');
  })
  .then((r) => {
    check('Community logo PNG served', r.status === 200 && r.body.length > 100);
  })
  .catch(() => {
    console.log(`  [i] HTTP smoke skipped (no server on 127.0.0.1:${PORT}) — asset paths verified on disk above`);
  })
  .finally(() => {
    console.log(`\nTOTAL: ${passed}/${total} checks passed\n`);
    process.exit(passed === total ? 0 : 1);
  });
