/**
 * =======================================================================
 * PHASE 16 AUDIT: PROJECT DELIVERED SECTION TEST
 * =======================================================================
 * Requirements:
 * 1. Placement: Positioned immediately after Product section
 * 2. Section Name: "PROJECT DELIVERED"
 * 3. Shows exactly the 5 delivered projects:
 *    - Homem Do Pao
 *    - Meditation Willy Cherish
 *    - MSB School
 *    - Software Testing
 *    - TeleMedicine
 * 4. Preserves existing card design (.product-card)
 * 5. Not converted into cinematic product demos (no device mockups / movie scenes)
 * 6. Keeps required elements on all 5 cards:
 *    - Image
 *    - Category
 *    - Name
 *    - Description
 *    - Features
 *    - Visit Product
 *    - View Details
 * 7. Uses existing data (PRODUCTS_DATA, modals, search, filters)
 * 8. Regression check: Flagship products (AI Talksy, Community Forum, RateHonk) do not duplicate in Project Delivered
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
console.log('     PHASE 16: PROJECT DELIVERED AUDIT              ');
console.log('====================================================');

// 1. PLACEMENT & SECTION HEADER
console.log('\n1. Checking Placement & Header...');
const productSectionIdx = html.indexOf('id="products"');
const deliverySectionIdx = html.indexOf('id="delivery-projects"');
check('PROJECT DELIVERED section is located after PRODUCT section', 
  productSectionIdx !== -1 && deliverySectionIdx !== -1 && deliverySectionIdx > productSectionIdx);
check('Section heading displays exactly "PROJECT DELIVERED"', 
  html.includes('PROJECT DELIVERED'));
check('Subtitle conveys delivered case studies', 
  html.includes("Projects we've successfully delivered"));

// Extract PROJECT DELIVERED HTML slice
const deliveryStart = html.indexOf('<section id="delivery-projects"');
const deliveryEnd = html.indexOf('</section>', deliveryStart);
const deliveryHtml = html.substring(deliveryStart, deliveryEnd + 10);

// 2. EXACT 5 PROJECTS
console.log('\n2. Checking Exactly 5 Projects Present...');
check('Homem Do Pao is present in Project Delivered', 
  deliveryHtml.includes('Homem Do Pao'));
check('Meditation Willy Cherish is present in Project Delivered', 
  deliveryHtml.includes('Meditation Willy Cherish'));
check('MSB School is present in Project Delivered', 
  deliveryHtml.includes('MSB School'));
check('Software Testing is present in Project Delivered', 
  deliveryHtml.includes('Software Testing'));
check('TeleMedicine is present in Project Delivered', 
  deliveryHtml.includes('TeleMedicine'));

const cardMatches = deliveryHtml.match(/class="product-card/g) || [];
check('Exactly 5 product cards exist in Project Delivered grid', 
  cardMatches.length === 5);

// 3. NO PRODUCT DUPLICATION
console.log('\n3. Checking No Product Duplication...');
check('AI Talksy is NOT duplicated in Project Delivered', 
  !deliveryHtml.includes('data-product-id="ai-talksy"') && !deliveryHtml.includes('AI Talksy'));
check('Community Forum is NOT duplicated in Project Delivered', 
  !deliveryHtml.includes('data-product-id="community-forum"') && !deliveryHtml.includes('Community Forum Logo'));
check('RateHonk Travel CRM is NOT duplicated in Project Delivered', 
  !deliveryHtml.includes('data-product-id="ratehonk-travel-crm"') && !deliveryHtml.includes('RateHonk Logo'));

// 4. KEEP EXISTING CARD DESIGN (NOT CINEMATIC DEMOS)
console.log('\n4. Checking Card Design Integrity...');
check('Cards use existing .product-card styling', 
  deliveryHtml.includes('class="product-card group"'));
check('Cards do NOT contain cinematic phone mockups (.device-mockup-phone)', 
  !deliveryHtml.includes('device-mockup-phone'));
check('Cards do NOT contain cinematic browser mockups (.device-mockup-browser)', 
  !deliveryHtml.includes('device-mockup-browser'));
check('Cards do NOT contain cinematic movie timelines (.story-step-pill)', 
  !deliveryHtml.includes('story-step-pill'));

// 5. REQUIRED CARD ELEMENTS
console.log('\n5. Checking Required Card Elements (Image, Category, Name, Description, Features, Visit Product, View Details)...');
const projects = [
  { id: 'homem-do-pao', name: 'Homem Do Pao', cat: 'E-commerce', feat: 'Bakery Subscription Engine' },
  { id: 'meditation-willy-cherish', name: 'Meditation Willy Cherish', cat: 'Meditation', feat: 'Guided Audio Sessions' },
  { id: 'msb-school', name: 'MSB School', cat: 'Education', feat: 'Student Information System' },
  { id: 'software-testing-suite', name: 'Software Testing', cat: 'Services', feat: 'Automated Continuous CI Tests' },
  { id: 'telemedicine', name: 'TeleMedicine', cat: 'Healthcare', feat: 'Encrypted HD Video Consults' }
];

projects.forEach(p => {
  const cardStart = deliveryHtml.indexOf(`data-product-id="${p.id}"`);
  const cardEnd = deliveryHtml.indexOf('</div>\n          </div>', cardStart);
  const cardContent = deliveryHtml.substring(cardStart, cardEnd + 400);

  check(`${p.name}: has image element with fallback handling`, 
    cardContent.includes('<img') && cardContent.includes('onerror='));
  check(`${p.name}: displays Category (${p.cat})`, 
    cardContent.includes(p.cat));
  check(`${p.name}: displays Name (${p.name})`, 
    cardContent.includes(p.name));
  check(`${p.name}: displays Description paragraph`, 
    cardContent.includes('<p class="text-xs text-slate-300 leading-relaxed mb-4">'));
  check(`${p.name}: displays Features checklist (${p.feat})`, 
    cardContent.includes(p.feat));
  check(`${p.name}: includes "Visit Product" button`, 
    cardContent.includes('<span>Visit Product</span>'));
  check(`${p.name}: includes "View Details" button`, 
    cardContent.includes('<span>View Details</span>'));
});

// 6. EXISTING DATA & MODAL WIRED
console.log('\n6. Checking Existing Data & Modal Integration...');
check('JS exposes DELIVERY_PROJECTS_KEYS with 5 project keys', 
  js.includes('DELIVERY_PROJECTS_KEYS = [') && 
  js.includes('homem-do-pao') && 
  js.includes('meditation-willy-cherish') && 
  js.includes('msb-school') && 
  js.includes('software-testing-suite') && 
  js.includes('telemedicine'));
check('JS exposes window.deliveryProjects / window.deliveredProjects', 
  js.includes('window.deliveryProjects = deliveryProjects') || js.includes('window.deliveredProjects = deliveredProjects'));
check('Category filters bar works for Delivered Projects (all, ecommerce, meditation, education, services, healthcare)', 
  deliveryHtml.includes('data-filter="all"') && 
  deliveryHtml.includes('data-filter="ecommerce"') && 
  deliveryHtml.includes('data-filter="meditation"') && 
  deliveryHtml.includes('data-filter="education"') && 
  deliveryHtml.includes('data-filter="services"') && 
  deliveryHtml.includes('data-filter="healthcare"'));
check('Search bar wired for delivered projects', 
  deliveryHtml.includes('id="delivery-search-input"'));

// 7. WEBSITE PRESERVATION INTEGRITY
console.log('\n7. Checking Website Preservation Integrity...');
check('Navbar preserved (#home, #about, #services, #products, #contact)', 
  html.includes('href="#home"') && html.includes('href="#about"') && html.includes('href="#services"') && html.includes('href="#products"') && html.includes('href="#contact"'));
check('Hero 3D scene preserved', html.includes('id="home"') && (html.includes('hero-three-canvas') || html.includes('hero-3d-scene-container')));
check('Footer preserved', html.includes('<footer'));
check('Public navigation free of login link', !html.includes('href="login.html"') && !html.includes('href="/login.html"'));

// Server API check
const req = http.get('http://localhost:5000/api/health', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
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

req.on('error', (err) => {
  check('Server API health check returns HTTP 200 with success: true', false);
  summarize();
});

function summarize() {
  console.log('\n====================================================');
  console.log(`TOTAL CHECKS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks/totalChecks)*100)}%)`);
  console.log('====================================================');
  if (passedChecks === totalChecks) {
    console.log('🌟 STATUS: PHASE 16 PROJECT DELIVERED VERIFIED WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    console.error('❌ STATUS: SOME CHECKS FAILED IN PHASE 16\n');
    process.exit(1);
  }
}
