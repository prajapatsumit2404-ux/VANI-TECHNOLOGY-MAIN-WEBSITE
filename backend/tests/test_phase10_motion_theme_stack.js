/**
 * Phase 10 — Motion, theme, experience stack (static + HTTP wiring audit).
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

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

const root = path.join(__dirname, '../..');
const frontend = path.join(root, 'frontend');

const htmlPages = [
  'index.html',
  'contact.html',
  'login.html',
  'register.html',
  'forgot-password.html',
  'verify-email.html',
  'verify-phone.html',
  'profile.html',
  'admin.html',
];

const requiredScripts = [
  'js/vani-preservation.js',
  'js/vani-experience.js',
  'js/vani-ambient-bg.js',
  'js/vani-pointer-interactions.js',
  'js/vani-scroll-motion.js',
  'js/vani-theme.js',
];

const requiredCss = [
  'css/vani-preservation.css',
  'css/vani-theme.css',
  'css/vani-experience.css',
  'css/vani-ambient-bg.css',
  'css/vani-pointer-interactions.css',
  'css/vani-scroll-motion.css',
];

console.log('====================================================');
console.log('  PHASE 10: MOTION / THEME / EXPERIENCE STACK TEST   ');
console.log('====================================================\n');

console.log('1. Page wiring (all public HTML)...');
htmlPages.forEach((page) => {
  const filePath = path.join(frontend, page);
  const html = fs.readFileSync(filePath, 'utf8');
  check(`${page} exists`, html.length > 100);
  requiredScripts.forEach((src) => {
    check(`${page} includes ${src}`, html.includes(src));
  });
  check(`${page} includes GSAP core CDN`, html.includes('gsap.min.js'));
  check(`${page} includes GSAP ScrollTrigger CDN`, html.includes('ScrollTrigger.min.js'));
  requiredCss.forEach((href) => {
    check(`${page} links ${href}`, html.includes(href));
  });
});

console.log('\n2. Module integrity...');
const preservation = fs.readFileSync(path.join(frontend, 'js/vani-preservation.js'), 'utf8');
check('Theme preference key vani_theme_pref', preservation.includes('vani_theme_pref'));
check('System theme fallback resolveTheme', preservation.includes('getSystemTheme') && preservation.includes('resolveTheme'));
check('data-vani-theme applied (not stripped on home)', !preservation.includes("removeAttribute('data-vani-theme')"));

const scrollJs = fs.readFileSync(path.join(frontend, 'js/vani-scroll-motion.js'), 'utf8');
check('Scroll decor uses translate3d (not marginTop)', scrollJs.includes('translate3d') && !scrollJs.includes('marginTop'));
check('Single scroll motion init guard', scrollJs.includes('__vaniScrollMotionInit'));
check('GSAP ScrollTrigger batch / toggle scroll path', scrollJs.includes('ScrollTrigger.batch') || scrollJs.includes('toggleActions'));
check('Scroll effect types (fade / slide / scale / image)', scrollJs.includes('image-reveal') && scrollJs.includes('slide-left'));
check('Home section excluded from scroll hosts', scrollJs.includes("HOME_ID") && scrollJs.includes('products'));
check('Fail-safe reveal + refresh API', scrollJs.includes('forceRevealAll') && scrollJs.includes('VaniScrollMotion'));
check('Skip AOS nodes to avoid duplicate libs', scrollJs.includes('[data-aos]'));
check('Parallax disabled on mobile/tablet viewport bands', scrollJs.includes("vp === 'mobile'") && scrollJs.includes("vp === 'tablet'"));
check('Experience tier change re-syncs scroll motion', scrollJs.includes('vani:experience-tier') && scrollJs.includes('onExperienceTierChange'));

const pointerJs = fs.readFileSync(path.join(frontend, 'js/vani-pointer-interactions.js'), 'utf8');
check('Pointer init guard', pointerJs.includes('__vaniPointerInteractionsInit'));
check('Pointer pagehide cleanup', pointerJs.includes('pagehide'));
check('Custom cursor + home exclusion', pointerJs.includes('vani-cursor-root') && pointerJs.includes('isPointOverHome'));
check('Click ripple handler', pointerJs.includes('vani-click-ripple'));
check('Magnetic buttons skip forms', pointerJs.includes("btn.type === 'submit'"));

const ambientJs = fs.readFileSync(path.join(frontend, 'js/vani-ambient-bg.js'), 'utf8');
check('Ambient init guard', ambientJs.includes('__vaniAmbientBgInit'));

const experienceJs = fs.readFileSync(path.join(frontend, 'js/vani-experience.js'), 'utf8');
const themeJs = fs.readFileSync(path.join(frontend, 'js/vani-theme.js'), 'utf8');
check('Experience tier datasets', experienceJs.includes('vaniPointerTier') && experienceJs.includes('vaniMotionTier'));
check('Theme toggle mounts on simple auth headers', themeJs.includes('header.navbar-initial > div.max-w-7xl'));

const scrollCss = fs.readFileSync(path.join(frontend, 'css/vani-scroll-motion.css'), 'utf8');
check('Scroll reveal uses opacity + transform', scrollCss.includes('opacity') && scrollCss.includes('transform'));

console.log('\n3. Home preservation markers...');
const indexHtml = fs.readFileSync(path.join(frontend, 'index.html'), 'utf8');
check('Home section id="home" intact', indexHtml.includes('id="home"'));
check('Hero canvas intact', indexHtml.includes('id="hero-three-canvas"'));
check('Hero headline intact', indexHtml.includes('Building Digital Solutions That Move Businesses Forward'));
check('data-vani-home-preserve via preservation script', indexHtml.includes('vani-preservation.js'));

const preservationCss = fs.readFileSync(path.join(frontend, 'css/vani-preservation.css'), 'utf8');
check('#home color-scheme guard', preservationCss.includes('#home') && preservationCss.includes('color-scheme'));

console.log('\n4. HTTP asset availability (local server)...');

function get(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = '';
        res.on('data', (c) => {
          body += c;
        });
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', reject);
  });
}

(async () => {
  const base = process.env.VANI_TEST_BASE || 'http://127.0.0.1:5000';
  try {
    const home = await get(`${base}/`);
    check('GET / returns 200', home.status === 200);
    check('Served index contains #home', home.body.includes('id="home"'));

    for (const asset of [
      '/js/vani-theme.js',
      '/js/vani-experience.js',
      '/css/vani-theme.css',
      '/css/vani-experience.css',
    ]) {
      const res = await get(`${base}${asset}`);
      check(`GET ${asset} returns 200`, res.status === 200);
    }

    const contact = await get(`${base}/contact.html`);
    check('GET /contact.html returns 200', contact.status === 200);
    check('contact.html served with theme script', contact.body.includes('vani-theme.js'));
  } catch (e) {
    check(`HTTP checks (server at ${base})`, false);
    console.error(`  HTTP error: ${e.message}`);
  }

  console.log('\n====================================================');
  console.log(`TOTAL: ${passed}/${total} passed (${total ? Math.round((passed / total) * 100) : 0}%)`);
  console.log('====================================================');
  process.exit(passed === total ? 0 : 1);
})();
