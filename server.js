/* KouKi's 赌场 — 极简静态服务器（零依赖）
 * 运行：node server.js   →   浏览器打开 http://localhost:8080/
 * 换端口：set PORT=3000 && node server.js  （PowerShell: $env:PORT=3000; node server.js）
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon'
};

const server = http.createServer((req, res) => {
  const raw = decodeURIComponent((req.url || '/').split('?')[0]);
  const rel = raw === '/' ? 'index.html' : path.normalize(raw).replace(/^[/\\]+/, '');
  const file = path.join(ROOT, rel);
  if(!file.startsWith(ROOT)){                        // 防目录穿越
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }
  fs.readFile(file, (err, buf) => {
    if(err){
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(buf);
  });
});

server.listen(PORT, () => {
  console.log("KouKi's 赌场 已启动 → http://localhost:" + PORT + '/');
});
