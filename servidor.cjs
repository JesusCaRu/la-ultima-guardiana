const http = require('http');
const fs = require('fs');
const path = require('path');
const base = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.glb':'model/gltf-binary'};
http.createServer((req, res) => {
  const name = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.resolve(base, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(base + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, content) => {
    if (err) { res.writeHead(404); return res.end('No encontrado'); }
    res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
    res.end(content);
  });
}).listen(4173, '127.0.0.1', () => console.log('Web disponible en http://127.0.0.1:4173 — deja esta ventana abierta.'));

