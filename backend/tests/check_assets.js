const fs = require('fs');
const path = require('path');

const frontendDir = path.resolve(__dirname, '../../frontend');
const htmlFiles = fs.readdirSync(frontendDir).filter((f) => f.endsWith('.html'));

console.log('====================================================');
console.log('       CHECKING FRONTEND ASSETS & LINKS INTEGRITY    ');
console.log('====================================================');

let brokenImages = [];
let brokenScripts = [];
let brokenStyles = [];
let brokenLinks = [];
let checkedCount = 0;

htmlFiles.forEach((file) => {
  const content = fs.readFileSync(path.join(frontendDir, file), 'utf8');

  // 1. Check img src
  const imgMatches = content.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
  imgMatches.forEach((tag) => {
    const srcMatch = tag.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) return;
    const src = srcMatch[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') || src.startsWith('data:') || src === '') {
      return;
    }
    checkedCount++;
    const cleanSrc = src.split('?')[0].split('#')[0];
    const resolvedPath = path.join(frontendDir, cleanSrc);
    if (!fs.existsSync(resolvedPath)) {
      brokenImages.push({ file, src, resolvedPath });
    }
  });

  // 2. Check script src
  const scriptMatches = content.match(/<script[^>]+src=["']([^"']+)["']/gi) || [];
  scriptMatches.forEach((tag) => {
    const srcMatch = tag.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) return;
    const src = srcMatch[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) return;
    checkedCount++;
    const cleanSrc = src.split('?')[0].split('#')[0];
    const resolvedPath = path.join(frontendDir, cleanSrc);
    if (!fs.existsSync(resolvedPath)) {
      brokenScripts.push({ file, src, resolvedPath });
    }
  });

  // 3. Check link href (stylesheets)
  const linkMatches = content.match(/<link[^>]+href=["']([^"']+)["']/gi) || [];
  linkMatches.forEach((tag) => {
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) return;
    const href = hrefMatch[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) return;
    checkedCount++;
    const cleanHref = href.split('?')[0].split('#')[0];
    const resolvedPath = path.join(frontendDir, cleanHref);
    if (!fs.existsSync(resolvedPath)) {
      brokenStyles.push({ file, href, resolvedPath });
    }
  });

  // 4. Check internal page anchors / links
  const aMatches = content.match(/<a[^>]+href=["']([^"']+)["']/gi) || [];
  aMatches.forEach((tag) => {
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) return;
    const href = hrefMatch[1];
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#') ||
      href === '' ||
      href === 'javascript:void(0)'
    ) {
      return;
    }
    checkedCount++;
    const pageTarget = href.split('?')[0].split('#')[0];
    const resolvedPath = path.join(frontendDir, pageTarget);
    if (!fs.existsSync(resolvedPath)) {
      brokenLinks.push({ file, href, resolvedPath });
    }
  });
});

console.log(`Scanned ${htmlFiles.length} HTML files, verified ${checkedCount} references.`);

if (brokenImages.length === 0) {
  console.log('[PASS] No broken local image references found.');
} else {
  console.error('[FAIL] Broken Images Found:', brokenImages);
}

if (brokenScripts.length === 0) {
  console.log('[PASS] No broken local script references found.');
} else {
  console.error('[FAIL] Broken Scripts Found:', brokenScripts);
}

if (brokenStyles.length === 0) {
  console.log('[PASS] No broken stylesheet references found.');
} else {
  console.error('[FAIL] Broken Styles Found:', brokenStyles);
}

if (brokenLinks.length === 0) {
  console.log('[PASS] No broken internal page links found.');
} else {
  console.error('[FAIL] Broken Internal Links Found:', brokenLinks);
}
