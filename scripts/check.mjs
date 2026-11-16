import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../site.config.js';

const output = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const base = process.env.BASE_PATH ?? config.basePath;
const origin = new URL(config.url).origin;
async function walk(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(item => item.isDirectory() ? walk(path.join(directory, item.name)) : path.join(directory, item.name)))).flat();
}
const files = await walk(output);
const documents = new Map();
for (const filename of files.filter(file => file.endsWith('.html'))) {
  const html = await readFile(filename, 'utf8');
  const label = path.relative(output, filename);
  assert(!/\{\{|{%/.test(html), `${label}: unresolved template`);
  assert.match(html, /<html lang="en">/, `${label}: document language`);
  assert.match(html, /<title>[^<]+<\/title>/, `${label}: document title`);
  assert.match(html, /<meta name="description" content="[^"]+">/, `${label}: description`);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${label}: expected one main heading`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${label}: duplicate IDs`);
  documents.set(filename, { html, ids: new Set(ids) });
}
let links = 0;
for (const [filename, { html }] of documents) {
  const relative = path.relative(output, filename).split(path.sep).join('/');
  const pageUrl = new URL(`${base}/${relative.replace(/index\.html$/, '')}`, config.url);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), pageUrl);
    if (url.origin !== origin) continue;
    assert(url.pathname.startsWith(`${base}/`), `${relative}: link escapes project path: ${url.pathname}`);
    const pathname = decodeURIComponent(url.pathname.slice(base.length));
    let target = path.resolve(output, `.${pathname}`);
    assert(target.startsWith(`${output}${path.sep}`) || target === output, `${relative}: path escapes output`);
    let info;
    try { info = await stat(target); } catch { assert.fail(`${relative}: missing target ${pathname}`); }
    if (info.isDirectory()) target = path.join(target, 'index.html');
    assert((await stat(target)).isFile(), `${relative}: target is not a file: ${pathname}`);
    if (url.hash && documents.has(target)) {
      assert(documents.get(target).ids.has(decodeURIComponent(url.hash.slice(1))), `${relative}: missing anchor ${pathname}${url.hash}`);
    }
    links++;
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) assert.match(match[0], /\balt="[^"]*"/, `${relative}: image needs alt text`);
}
assert((await stat(path.join(output, 'assets/images/social-card.png'))).size > 0, 'Social image must exist');
assert.match(await readFile(path.join(output, 'feed.xml'), 'utf8'), /<feed xmlns="http:\/\/www.w3.org\/2005\/Atom">/, 'Atom feed');
assert.match(await readFile(path.join(output, 'sitemap.xml'), 'utf8'), /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/, 'Sitemap');
for (const name of ['package.json', 'site.config.js', 'README.md', 'content', 'scripts', '.git', 'node_modules']) {
  assert(!files.some(file => path.relative(output, file).split(path.sep)[0] === name), `Source should not be deployed: ${name}`);
}
console.log(`Checked ${documents.size} HTML pages and ${links} internal links/assets; metadata, anchors, feed, and sitemap passed.`);
