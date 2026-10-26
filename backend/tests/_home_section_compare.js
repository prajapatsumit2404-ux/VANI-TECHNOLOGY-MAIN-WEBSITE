const { execSync } = require('child_process');
const fs = require('fs');

function extractSection(html, sectionId) {
  const idx = html.indexOf(`id="${sectionId}"`);
  if (idx === -1) return null;
  const start = html.lastIndexOf('<section', idx);
  if (start === -1) return null;
  let depth = 0;
  let pos = start;
  while (pos < html.length) {
    const nextOpen = html.indexOf('<section', pos);
    const nextClose = html.indexOf('</section>', pos);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      pos = nextOpen + 8;
      continue;
    }
    depth -= 1;
    pos = nextClose + '</section>'.length;
    if (depth === 0) return html.slice(start, pos);
  }
  return null;
}

const path = require('path');
const root = path.join(__dirname, '../..');
const head = execSync('git show HEAD:frontend/index.html', { encoding: 'utf8', cwd: root });
const cur = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
const h = extractSection(head, 'home');
const c = extractSection(cur, 'home');
console.log(JSON.stringify({ match: h === c, headLen: h?.length, curLen: c?.length }));
