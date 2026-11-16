import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { base, build, output } from './build.mjs';

await build();
const port = Number(process.env.PORT ?? 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/' && base) {
      response.writeHead(302, { Location: `${base}/` }).end();
      return;
    }
    if (base && pathname !== base && !pathname.startsWith(`${base}/`)) throw new Error('Outside base path');
    let filename = path.resolve(output, `.${pathname.slice(base.length) || '/'}`);
    if (!filename.startsWith(`${output}${path.sep}`) && filename !== output) throw new Error('Outside output');
    if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)] ?? 'application/octet-stream' });
    response.end(await readFile(filename));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(await readFile(path.join(output, '404.html')));
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}${base}/\nRun again after source changes to rebuild.`));
