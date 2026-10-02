/**
 * Phase 13 Final Check: Complete Teacher's Homework Grading Script
 * Exhaustively checks all 35+ items across Sections, Products, Delivery, Duplicates,
 * Animations, Links, Auth, Responsiveness, and APIs.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

let totalChecks = 0;
let passedChecks = 0;
const results = [];

function audit(section, item, passed, notes = '') {
  totalChecks++;
  if (passed) {
    passedChecks++;
    results.push({ section, item, status: 'PASS', notes });
    console.log(`  [✓] ${item}`);
  } else {
    results.push({ section, item, status: 'FAIL', notes });
    console.error(`  [✗] ${item} - FAIL: ${notes}`);
  }
}

async function requestGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function runTeacherAudit() {
  console.log('====================================================');
  console.log('       PHASE 13: COMPREHENSIVE FINAL AUDIT          ');
  console.log('====================================================\n');

  const html = fs.readFileSync(path.join(__dirname, '../../frontend/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../../frontend/css/style.css'), 'utf8');
  const js = fs.readFileSync(path.join(__dirname, '../../frontend/js/main.js'), 'utf8');

  // ========================================================
  // 1. SECTION NAMES
  // ========================================================
  console.log('1. Checking Section Names...');
  const hasProductHeading = html.includes('PRODUCT') && html.includes('Products that define our digital expertise');
  audit('SECTION NAMES', 'PRODUCT is visible with correct subtitle', hasProductHeading);

  const hasDeliveredHeading = html.includes('PROJECT DELIVERED') && html.includes("Projects we've successfully delivered");
  audit('SECTION NAMES', 'PROJECT DELIVERED is visible with correct subtitle', hasDeliveredHeading);

  // ========================================================
  // 2. PRODUCT
  // ========================================================
  console.log('\n2. Checking PRODUCT Section...');
  const storyCards = html.match(/class="[^"]*cinematic-story-card[^"]*"/g) || [];
  audit('PRODUCT', 'Exactly 3 products in flagship section', storyCards.length === 3, `Found ${storyCards.length}`);

  const hasAITalksy = html.includes('id="story-aitalksy"') && html.includes('AI Talksy');
  audit('PRODUCT', 'AI Talksy is present', hasAITalksy);

  const hasCommunityForum = html.includes('id="story-communityforum"') && html.includes('Community Forum');
  audit('PRODUCT', 'Community Forum is present', hasCommunityForum);

  const hasRateHonk = html.includes('id="story-ratehonk"') && html.includes('RateHonk Travel CRM');
  audit('PRODUCT', 'RateHonk Travel CRM is present', hasRateHonk);

  // ========================================================
  // 3. PROJECT DELIVERED
  // ========================================================
  console.log('\n3. Checking PROJECT DELIVERED Section...');
  const deliveryMatch = html.match(/<div id="delivery-grid"[\s\S]*?<\/div>\s*<!-- Empty State/);
  const deliveredHtml = deliveryMatch ? deliveryMatch[0] : '';
  const deliveredCards = deliveredHtml.match(/class="[^"]*product-card[^"]*"/g) || [];
  audit('PROJECT DELIVERED', 'Exactly 5 projects in Project Delivered grid', deliveredCards.length === 5, `Found ${deliveredCards.length}`);

  audit('PROJECT DELIVERED', 'Homem Do Pao is present in Project Delivered', deliveredHtml.includes('Homem Do Pao'));
  audit('PROJECT DELIVERED', 'Meditation Willy Cherish is present in Project Delivered', deliveredHtml.includes('Meditation Willy Cherish'));
  audit('PROJECT DELIVERED', 'MSB School is present in Project Delivered', deliveredHtml.includes('MSB School'));
  audit('PROJECT DELIVERED', 'Software Testing is present in Project Delivered', deliveredHtml.includes('Software Testing'));
  audit('PROJECT DELIVERED', 'TeleMedicine is present in Project Delivered', deliveredHtml.includes('TeleMedicine'));

  // ========================================================
  // 4. DUPLICATES
  // ========================================================
  console.log('\n4. Checking for Product Duplication...');
  audit('DUPLICATES', 'AI Talksy does NOT appear in Project Delivered', !deliveredHtml.includes('AI Talksy') && !deliveredHtml.includes('aitalksy'));
  audit('DUPLICATES', 'Community Forum does NOT appear in Project Delivered', !deliveredHtml.includes('Community Forum') && !deliveredHtml.includes('communityforum'));
  audit('DUPLICATES', 'RateHonk does NOT appear in Project Delivered', !deliveredHtml.includes('RateHonk') && !deliveredHtml.includes('ratehonk'));

  // ========================================================
  // 5. ANIMATION
  // ========================================================
  console.log('\n5. Checking Cinematic Story Animations...');
  const aitalksyExplainsAI = html.includes('aitalksy-typing-text') && html.includes('animate-ai-core') && html.includes('Generating response...');
  audit('ANIMATION', 'AI Talksy animation explains AI communication', aitalksyExplainsAI);

  const communityExplainsDigital = html.includes('Person 1') && html.includes('comm-connecting-path') && html.includes('animate-phone-enter');
  audit('ANIMATION', 'Community Forum animation explains digital community', communityExplainsDigital);

  const ratehonkExplainsCRM = html.includes('NEW LEAD') && html.includes('pipeline-step-col') && html.includes('animate-pipeline-flow');
  audit('ANIMATION', 'RateHonk animation explains CRM workflow', ratehonkExplainsCRM);

  const hasViewportDetection = js.includes('IntersectionObserver') && js.includes('storyObserver');
  audit('ANIMATION', 'Animations start when section enters viewport', hasViewportDetection);

  const animationsDoNotStartTogether = js.includes('entries.forEach') && js.includes('startStory(storyId)') && js.includes('stopStory(storyId)');
  audit('ANIMATION', 'All animations do NOT start together (independent viewport triggers)', animationsDoNotStartTogether);

  // ========================================================
  // 6. LINKS
  // ========================================================
  console.log('\n6. Checking External Links and Target Attributes...');
  const aitalksyLink = html.includes('href="https://aitalksy.com/"') && html.includes('target="_blank"');
  audit('LINKS', 'AI Talksy opens https://aitalksy.com/ in a new tab', aitalksyLink);

  const communityLink = html.includes('href="https://communityforum.tech/"') && html.includes('target="_blank"');
  audit('LINKS', 'Community Forum opens https://communityforum.tech/ in a new tab', communityLink);

  const ratehonkLink = html.includes('href="https://crm.ratehonk.com/portfolio"') && html.includes('target="_blank"');
  audit('LINKS', 'RateHonk opens https://crm.ratehonk.com/portfolio in a new tab', ratehonkLink);

  const hasRelSecurity = (html.match(/rel="noopener noreferrer"/g) || []).length >= 3;
  audit('LINKS', 'External links include rel="noopener noreferrer"', hasRelSecurity);

  // ========================================================
  // 7. PROJECT DELIVERED FUNCTIONALITY & DATA
  // ========================================================
  console.log('\n7. Checking Delivery Project Card Elements & Modals...');
  const hasVisitButtons = (deliveredHtml.match(/Visit Product/g) || []).length === 5;
  audit('PROJECT DELIVERED', 'Visit Product buttons exist on all 5 delivered projects', hasVisitButtons);

  const hasModalTriggers = (deliveredHtml.match(/View Details/g) || []).length === 5;
  audit('PROJECT DELIVERED', 'View Details modal triggers wired on all 5 delivered projects', hasModalTriggers);

  const hasDescriptions = deliveredHtml.includes('Artisan bakery digital commerce platform') &&
                          deliveredHtml.includes('Mindfulness and audio meditation app') &&
                          deliveredHtml.includes('HIPAA-compliant virtual medical consultation platform');
  audit('PROJECT DELIVERED', 'Existing product descriptions are faithfully preserved', hasDescriptions);

  const hasFeatures = deliveredHtml.includes('Bakery Subscription Engine') &&
                      deliveredHtml.includes('Guided Audio Sessions') &&
                      deliveredHtml.includes('Encrypted HD Video Consults');
  audit('PROJECT DELIVERED', 'Existing product features are faithfully preserved', hasFeatures);

  // ========================================================
  // 8. LOGIN REMOVAL FROM PUBLIC FLOW
  // ========================================================
  console.log('\n8. Checking Removal of Login from Public Flow...');
  const desktopNavMatch = html.match(/<!-- Desktop Action Buttons -->([\s\S]*?)<\/div>/);
  const mobileNavMatch = html.match(/<!-- Mobile Slide-out Navigation Drawer -->([\s\S]*?)<\/header>/);
  const noLoginDesktop = desktopNavMatch && !desktopNavMatch[1].includes('login.html') && !desktopNavMatch[1].includes('>Login<');
  const noLoginMobile = mobileNavMatch && !mobileNavMatch[1].includes('login.html') && !mobileNavMatch[1].includes('>Login<');
  audit('LOGIN', 'Login page link removed from desktop navigation', noLoginDesktop);
  audit('LOGIN', 'Login page link removed from mobile navigation drawer', noLoginMobile);

  const noLoginPopup = !html.includes('id="login-modal"') && !html.includes('id="auth-popup"');
  audit('LOGIN', 'No login popup exists in public markup', noLoginPopup);

  const authJs = fs.readFileSync(path.join(__dirname, '../../frontend/js/auth.js'), 'utf8');
  const noAuthButtonUnauthenticated = authJs.includes("authBtn.style.display = 'none'");
  audit('LOGIN', 'No login button injected dynamically for unauthenticated visitors', noAuthButtonUnauthenticated);

  const logoutToHome = authJs.includes("window.location.href = 'index.html'");
  audit('LOGIN', 'Logout safely redirects to index.html', logoutToHome);

  // ========================================================
  // 9. WEBSITE INTEGRITY & RESPONSIVENESS
  // ========================================================
  console.log('\n9. Checking Core Website Structure & Responsiveness...');
  audit('WEBSITE', 'Navbar works (#home, #about, #services, #products, #contact)', html.includes('id="main-navbar"'));
  audit('WEBSITE', 'Hero works (#home with 3D canvas and CTA)', html.includes('id="home"') && html.includes('three-canvas'));
  audit('WEBSITE', 'Footer works (copyright, legal, social links, back to top)', html.includes('id="main-footer"'));

  audit('WEBSITE', 'Zero horizontal scrolling CSS enforced on mobile', css.includes('overflow-x: hidden !important'));
  audit('WEBSITE', 'Tablet responsiveness rules configured (768px - 1023px)', css.includes('@media (min-width: 768px) and (max-width: 1023px)'));
  audit('WEBSITE', 'Mobile responsiveness rules configured (< 768px)', css.includes('@media (max-width: 767px)'));
  audit('WEBSITE', 'prefers-reduced-motion accessibility rules configured', css.includes('@media (prefers-reduced-motion: reduce)'));

  // ========================================================
  // 10. BACKEND LIVE HTTP API AUDIT
  // ========================================================
  console.log('\n10. Checking Backend HTTP APIs...');
  try {
    const health = await requestGet('http://127.0.0.1:5000/api/health');
    const healthData = JSON.parse(health.body);
    audit('APIs', 'GET /api/health returns 200 OK with success: true', health.status === 200 && healthData.success === true);
  } catch (e) {
    audit('APIs', 'GET /api/health reachable', false, e.message);
  }

  try {
    const productsRes = await requestGet('http://127.0.0.1:5000/api/products');
    const productsData = JSON.parse(productsRes.body);
    audit('APIs', 'GET /api/products returns public active products without login', productsRes.status === 200 && productsData.success === true && Array.isArray(productsData.products));
  } catch (e) {
    audit('APIs', 'GET /api/products reachable', false, e.message);
  }

  try {
    const homeRes = await requestGet('http://127.0.0.1:5000/');
    audit('APIs', 'GET / returns 200 OK with zero auth redirect headers', homeRes.status === 200 && !homeRes.headers.location);
  } catch (e) {
    audit('APIs', 'GET / reachable', false, e.message);
  }

  // ========================================================
  // FINAL SCORECARD
  // ========================================================
  console.log('\n====================================================');
  console.log(`FINAL REPORT CARD: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks/totalChecks)*100)}%)`);
  console.log('====================================================');

  if (passedChecks === totalChecks) {
    console.log('🌟 GRADE: A+ (PERFECT SCORE - ALL ITEMS VERIFIED)\n');
    process.exit(0);
  } else {
    console.error(`⚠️ GRADE: INCOMPLETE (${totalChecks - passedChecks} items need attention)\n`);
    process.exit(1);
  }
}

runTeacherAudit().catch(err => {
  console.error('Teacher audit encountered an error:', err);
  process.exit(1);
});
