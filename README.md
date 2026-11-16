# EG / MegaJam 2026 — Development journal

A public overview of the process behind our high fantasy RTS in Unreal Engine: design decisions, asset preparation, animation, squad combat, building states, and the battlefield taking shape.

**[Read the devlog](https://gski-dev.github.io/eg-megajam2026-devlog/)** · [Journal entries](content/posts) · [How to contribute](CONTRIBUTING.md)

This repository contains the website and curated development notes. The Unreal project is maintained separately.

## Stack

HTML, CSS, and JavaScript. A small Node.js script generates static HTML from HTML templates and Markdown content. Its only build dependencies are `marked` and `yaml`. The browser uses plain JavaScript for journal search; all pages and links work with JavaScript disabled.

GitHub Pages hosts the output. Pushes to `main` build, check, and deploy automatically through GitHub Actions. Pull requests build and check without deploying. GitHub Pages is [free for public repositories on GitHub Free](https://docs.github.com/en/pages/quickstart); the default `github.io` address needs no paid domain or hosting plan.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:4173/eg-megajam2026-devlog/**. The preview builds the site when it starts; restart after changing source files.

```sh
npm run build
npm run check
```

The build writes `dist/`. Checks verify generated pages, internal links, anchors, image descriptions, page metadata, and required publishing artifacts. To test root hosting, use the same base setting for both commands:

```sh
BASE_PATH= npm run build
BASE_PATH= npm run check
```

## Update the site

- **Add a journal entry:** copy [the post template](templates/post.md) into `content/posts/YYYY-MM-DD-short-title.md`. Fill in the metadata and content.
- **Update the overview:** edit [src/index.html](src/index.html).
- **Update the process or project page:** edit [content/pages](content/pages).
- **Update project status and navigation:** edit [site.config.js](site.config.js).
- **Add reviewed images:** place web-sized files under `public/assets/images/` and include a descriptive caption.
- **Change the layout or styles:** edit [src/layout.html](src/layout.html) and [public/assets/css/site.css](public/assets/css/site.css).

Post dates must include a time-zone offset. Drafts (`draft: true`) and future-dated entries are omitted from the build. A future entry appears on the next build after its date; publishing is not scheduled automatically. GitHub Actions can also be run manually.

## Deployment

In the repository's **Settings → Pages**, the publishing source is **GitHub Actions**. The workflow uploads only `dist/`, then deploys it to the `github-pages` environment. No API keys, paid plugins, backend, or external hosting account are required.

The project path is configured in `site.config.js`. Change `url` and `basePath` together if the repository or domain changes. Asset URLs, navigation, canonical links, the Atom feed, and the sitemap use that configuration.

## Initial editorial sources

The initial summaries were written from the development project's existing handoffs dated 14–15 November 2026: unit animation production, RTS squad combat sandbox, faction building state sandbox, and Pinewatch Vale implementation. Reported checks describe those records, rather than new gameplay validation performed for this website. The Pinewatch diagram is the authored layout reference from that project and is labeled accordingly.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the journal's writing format and publishing scope. Public availability does not grant a license to redistribute game art or third-party assets; their original terms still apply.
