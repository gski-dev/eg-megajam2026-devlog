import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Marked } from 'marked';
import { parse } from 'yaml';
import config from '../site.config.js';
import { galleryTools } from './galleries.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const output = path.join(root, 'dist');
export const base = process.env.BASE_PATH ?? config.basePath;
if (base && (!base.startsWith('/') || base.endsWith('/') || base.includes('..'))) {
  throw new Error('BASE_PATH must be empty or a leading-slash path without a trailing slash.');
}
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const link = route => `${base}${route}`;
const absolute = route => `${config.url}${link(route)}`;
const date = (value, month = 'long') => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month, year: 'numeric', timeZone: config.timeZone }).format(new Date(value));
const slug = value => value.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function interpolate(source, values) {
  return source.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Unknown template value: ${key}`);
    return values[key];
  });
}

function markdown(source) {
  const ids = new Map();
  const marked = new Marked({ renderer: {
    heading({ tokens, depth, text }) {
      const id = slug(text);
      const count = ids.get(id) ?? 0;
      ids.set(id, count + 1);
      return `<h${depth} id="${id}${count ? `-${count}` : ''}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
    },
  } });
  return marked.parse(source);
}

async function contentFile(filename) {
  const source = await readFile(filename, 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing front matter: ${filename}`);
  const meta = parse(match[1]);
  for (const field of ['title', 'description']) {
    if (typeof meta[field] !== 'string' || !meta[field].trim()) throw new Error(`Missing ${field}: ${filename}`);
  }
  return { ...meta, source: match[2], filename: path.relative(root, filename) };
}

function entryRow(post) {
  return `<article class="entry-row" data-entry data-topic="${escape(post.category)}">
    <div class="entry-date"><time datetime="${post.date}">${escape(date(post.date, 'short').replace(/ \d{4}$/, ''))}</time><span>${new Date(post.date).getUTCFullYear()}</span></div>
    <div class="entry-summary"><p class="eyebrow">${escape(post.category)}</p><h3><a href="${link(post.path)}">${escape(post.title)}</a></h3><p>${escape(post.description)}</p></div>
    <a class="entry-arrow" href="${link(post.path)}" aria-label="Read ${escape(post.title)}">↗</a>
  </article>`;
}

export async function build() {
  const layout = await readFile(path.join(root, 'src/layout.html'), 'utf8');
  const filenames = (await readdir(path.join(root, 'content/posts'))).filter(file => file.endsWith('.md'));
  const posts = (await Promise.all(filenames.map(async filename => {
    const post = await contentFile(path.join(root, 'content/posts', filename));
    if (post.draft === true) return null;
    const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-([a-z0-9-]+)\.md$/);
    if (!match || Number.isNaN(Date.parse(post.date)) || typeof post.category !== 'string') throw new Error(`Invalid post metadata: ${filename}`);
    if (new Date(post.date).getTime() > Date.now()) return null;
    return { ...post, date: new Date(post.date).toISOString(), path: `/journal/${match[1]}/${match[2]}/${match[3]}/${match[4]}/` };
  }))).filter(Boolean).sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path));
  if (!posts.length) throw new Error('The journal must contain at least one published entry.');

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(path.join(root, 'public'), output, { recursive: true });

  const common = { base, githubUrl: config.githubUrl, siteUrl: config.url };
  const pages = [];
  async function page(route, title, description, body, post = null) {
    const html = interpolate(layout, {
      ...common, title: escape(title ? `${title} · ${config.title}` : config.title), description: escape(description), canonical: escape(absolute(route)),
      ogType: post ? 'article' : 'website', articleMeta: post ? `<meta property="article:published_time" content="${post.date}">` : '',
      navigation: config.navigation.map(item => `<a href="${link(item.path)}"${route === item.path || (item.path === '/journal/' && post) ? ' aria-current="page"' : ''}>${escape(item.title)}</a>`).join(''),
      content: body,
    });
    const destination = path.join(output, route.endsWith('.html') ? route.slice(1) : `${route.slice(1)}index.html`);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, html);
    if (route !== '/404.html') pages.push({ route, modified: post?.date ?? config.project.updated });
  }

  const galleries = galleryTools(base);
  await mkdir(path.join(output, 'assets/flipbooks'), { recursive: true });
  for (const animation of galleries.media.animations) {
    await writeFile(path.join(output, `assets/flipbooks/${animation.id}.json`), JSON.stringify(animation));
  }

  const home = interpolate(await readFile(path.join(root, 'src/index.html'), 'utf8'), {
    ...common, focus: escape(config.project.focus), stage: escape(config.project.stage), updated: date(config.project.updated, 'short'),
    metrics: config.project.metrics.map(metric => `<div class="metric"><strong>${escape(metric.value)}</strong><span>${escape(metric.label)}</span><small>${escape(metric.detail)}</small></div>`).join(''),
    featuredExamples: galleries.featured,
    latestEntries: posts.slice(0, 3).map(entryRow).join(''),
  });
  await page('/', '', config.description, home);

  await page('/journal/', 'The journal', 'Dated notes on the decisions, tools, and experiments shaping the game.', `<div class="shell page-shell">
    <header class="page-heading"><p class="eyebrow">The working record</p><h1>The journal<span class="accent">.</span></h1><p class="page-intro">The decisions, the experiments, and what we learned along the way. Newest notes first.</p></header>
    <div class="journal-filter" data-filter hidden><label for="journal-search">Find a note</label><input id="journal-search" type="search" placeholder="Search the journal…" autocomplete="off" aria-controls="journal-entries"><p class="filter-count" role="status" aria-live="polite"></p></div>
    <div id="journal-entries" class="journal-archive">${posts.map(entryRow).join('')}</div><p data-empty hidden>No entries match. Try another search.</p>
    <p class="archive-note">Follow new entries with the <a href="${link('/feed.xml')}">RSS feed</a>, or explore the <a href="${config.githubUrl}/tree/main/content/posts">Markdown source on GitHub ↗</a>.</p>
  </div>`);

  for (const name of ['process', 'project']) {
    const item = await contentFile(path.join(root, `content/pages/${name}.md`));
    const body = markdown(interpolate(item.source, {
      ...common,
      workstreams: config.project.workstreams.map(stream => `### ${stream.name}\n\n**${stream.state}.** ${stream.description}\n`).join('\n'),
    }));
    await page(`/${name}/`, item.title, item.description, `<div class="shell page-shell"><header class="page-heading"><p class="eyebrow">${escape(item.eyebrow)}</p><h1>${escape(item.title)}</h1><p class="page-intro">${escape(item.description)}</p></header><div class="prose">${body}</div></div>`);
  }

  for (const post of posts) {
    const body = markdown(interpolate(post.source, common));
    const readingTime = Math.max(1, Math.ceil(post.source.trim().split(/\s+/).length / 200));
    await page(post.path, post.title, post.description, `<article class="shell article-shell">
      <header class="article-heading"><a class="back-link" href="${link('/journal/')}">← All journal entries</a><div class="entry-meta"><span>${escape(post.category)}</span><span aria-hidden="true">/</span><time datetime="${post.date}">${date(post.date)}</time><span aria-hidden="true">/</span><span>${readingTime} min read</span></div><h1>${escape(post.title)}</h1><p class="page-intro">${escape(post.description)}</p></header>
      <div class="prose article-body">${body}</div><footer class="article-footer"><p>Part of the EG / MegaJam 2026 development journal.</p><a href="${config.githubUrl}/blob/main/${post.filename}">Read this entry on GitHub ↗</a></footer>
    </article><section class="shell related-entries" aria-labelledby="more-heading"><div class="section-heading"><h2 id="more-heading">More from the notebook</h2><a href="${link('/journal/')}">All entries ↗</a></div>${posts.filter(item => item.path !== post.path).slice(0, 2).map(entryRow).join('')}</section>`, post);
  }

  for (const item of galleries.pages) await page(item.route, item.title, item.description, item.body);

  await page('/404.html', 'Page not found', 'Find your way back to the development journal.', `<div class="shell page-shell"><div class="page-heading"><p class="eyebrow">A missing page / 404</p><h1>Back to the notebook<span class="accent">.</span></h1><p class="page-intro">That page could not be found. There is more to explore in the journal.</p><a class="button" href="${link('/journal/')}">Open the journal ↗</a></div></div>`);

  await writeFile(path.join(output, 'feed.xml'), `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"><title>${escape(config.title)}</title><subtitle>${escape(config.description)}</subtitle><id>${absolute('/')}</id><link href="${absolute('/feed.xml')}" rel="self"/><link href="${absolute('/')}"/><updated>${posts[0].date}</updated><author><name>EG / MegaJam 2026</name></author>${posts.map(post => `<entry><title>${escape(post.title)}</title><id>${absolute(post.path)}</id><link href="${absolute(post.path)}"/><published>${post.date}</published><updated>${post.date}</updated><summary>${escape(post.description)}</summary></entry>`).join('')}</feed>\n`);
  await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(item => `<url><loc>${absolute(item.route)}</loc><lastmod>${new Date(item.modified).toISOString().slice(0, 10)}</lastmod></url>`).join('')}</urlset>\n`);
  await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${absolute('/sitemap.xml')}\n`);
  await writeFile(path.join(output, '.nojekyll'), '');
  console.log(`Built ${pages.length + 1} HTML pages, ${posts.length} entries, feed, and sitemap → dist/ (base: ${base || '/'})`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
