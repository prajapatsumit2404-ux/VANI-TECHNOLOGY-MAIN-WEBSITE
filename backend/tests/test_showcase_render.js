/**
 * Showcase render smoke test (desktop + mobile viewports)
 * Requires: npm install playwright (dev) from repo root
 * Run: node backend/tests/test_showcase_render.js
 */
const path = require('path');
const http = require('http');
const fs = require('fs');

const root = path.join(__dirname, '../..');
const frontendDir = path.join(root, 'frontend');

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0];
      if (urlPath === '/') urlPath = '/index.html';
      const filePath = path.join(frontendDir, urlPath.replace(/^\//, ''));
      if (!filePath.startsWith(frontendDir) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg' };
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

async function assertShowcase(page, label, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(`${process.env.BASE_URL}/index.html`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForFunction(
    () => document.getElementById('product-showcase')?.classList.contains('showcase-js-ready'),
    null,
    { timeout: 45000 }
  );
  await page.locator('#product-showcase').scrollIntoViewIfNeeded();
  await page.locator('#product-showcase .showcase-phone-3d').first().waitFor({ state: 'visible' });
  const floats = await page.locator('#product-showcase .showcase-float').count();
  if (floats < 3) throw new Error(`${label}: expected ≥3 floats, got ${floats}`);
  await page.locator('#product-showcase .showcase-tab[data-showcase-tab="community"]').click();
  await page.waitForTimeout(500);
  const comm = await page.locator('#product-showcase .showcase-panel[data-showcase-product="community"].is-active').count();
  if (comm !== 1) throw new Error(`${label}: community panel not active`);
  await page.locator('#product-showcase .showcase-tab[data-showcase-tab="ratehonk"]').click();
  const tj = await page.locator('#product-showcase .showcase-tab[data-showcase-tab="ratehonk"] span').textContent();
  if (!tj || !tj.includes('TravelJioo')) throw new Error(`${label}: TravelJioo tab label missing`);
  console.log(`  [OK] ${label}`);
}

async function main() {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch {
    console.error('Install playwright from repo root: npm install playwright --no-save');
    process.exit(1);
  }

  const { server, baseUrl } = await startStaticServer();
  process.env.BASE_URL = baseUrl;
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await assertShowcase(page, 'Desktop', 1280, 900);
    await assertShowcase(page, 'Mobile', 390, 844);
    console.log('Showcase render test: ALL PASSED');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('Showcase render test FAILED:', err.message);
  process.exit(1);
});
