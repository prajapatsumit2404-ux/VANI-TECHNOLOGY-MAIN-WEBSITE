const http = require('http');

const routes = [
  '/',
  '/contact.html',
  '/login.html',
  '/register.html',
  '/forgot-password.html',
  '/verify-email.html',
  '/verify-phone.html',
  '/profile.html',
  '/admin.html',
];

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      { hostname: '127.0.0.1', port: 5000, path, timeout: 8000 },
      (res) => {
        let body = '';
        res.on('data', (c) => {
          body += c;
        });
        res.on('end', () => resolve({ status: res.statusCode, len: body.length, html: body.slice(0, 200) }));
      }
    );
    req.on('error', reject);
  });
}

(async () => {
  for (const r of routes) {
    const res = await get(r);
    console.log(`${r} ${res.status} len=${res.len}`);
  }
})();
