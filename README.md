# EG / MegaJam 2026 — Development process

[Visit the devlog](https://gski-dev.github.io/eg-megajam2026-devlog/).

The site documents our AI-assisted workflow: idea → research → production plans → imagegen sprite sheets → four-view references → Tripo models → action sheets and HTML flipbooks → Unreal skeletal animation.

The leading examples are the Elf assassin, Elf female mage, and Human male mage. The Tripo section includes our supplied workflow recording. The original editorial content has been replaced; the existing HTML/CSS template and GitHub Pages deployment remain.

## Run and check

Use Node.js 22 or newer:

```sh
npm ci
npm run dev
npm run build
npm run check
```

Local preview: http://127.0.0.1:4173/eg-megajam2026-devlog/

`content/` contains the notes and curated image catalog. `src/` contains the HTML templates. `scripts/galleries.mjs` assembles the galleries and case studies; `public/` contains browser code and media. The HTML galleries, artwork, and navigation work without JavaScript. JavaScript adds search and flipbook playback.

## Media

`content/media-provenance.json` records project-relative source filenames and hashes. Four-view references are resized web copies. Action sheets are full-resolution lossless WebP copies with transparency retained. The published timing JSON contains only the fields needed for playback. Local paths, prompts, logs, source models, and engine assets are not deployed.

Normal builds use committed media and require no Unreal project or Python installation. To explicitly refresh the selected media library, use Python with Pillow:

```sh
python scripts/export-process-assets.py /path/to/assets/drafts/high-fantasy
```

The exporter selects complete four-view sets from the active character, building, and equipment directories, the 12 faction concept sheets, and available sheets in the attack-flipbook catalog. It excludes archived revisions and engine data. Review the resulting diff before publishing.

The supplied Tripo recording is distributed as a web MP4 with a poster. The animation previews show generated visual references; they do not claim to be final Unreal renders. Research and production descriptions are curated from the project’s faction roster, generation plans, Tripo workflow, retargeting pilot, and animation production records.

## Deployment

Pushes to `main` build, check, and deploy `dist/` through GitHub Actions. Pull requests build and check without deploying. `site.config.js` controls the project URL and base path. For root hosting, use `BASE_PATH=` consistently for both build and check.

The site uses HTML, CSS, JavaScript, `marked`, and `yaml`. Public availability does not assign a license to game artwork or third-party assets.
