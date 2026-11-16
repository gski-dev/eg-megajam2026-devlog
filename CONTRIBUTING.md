# Contributing to the devlog

Write for someone who has not seen the working project. Explain the problem, the decision, the result, and the next question.

## Add an entry

1. Copy `templates/post.md` to `content/posts/YYYY-MM-DD-short-title.md`.
2. Give it a clear title, a short description, a topic in `category`, and an ISO 8601 date with a time-zone offset.
3. Explain what changed and why. Include evidence and any review still pending.
4. Put selected images in `public/assets/images/`. Use web-sized files, meaningful alt text, and captions that identify diagrams, editor captures, or gameplay.
5. Run `npm run build` and `npm run check`. Open `npm run dev` and review the changed page at desktop and mobile widths.

Use `{{base}}/assets/images/your-image.webp` for image paths and `{{base}}/process/` for internal links. Use `{{githubUrl}}` for the repository URL. The build resolves these tokens for GitHub Pages and local previews. A `## Current state` heading automatically receives the `current-state` anchor.

`draft: true` hides unfinished posts. Future dates stay hidden until a build runs after the date. Omit `draft` or set it to `false` to publish.

## Keep the public account accurate

- Distinguish plans, source implementations, compiled builds, saved assets, visual review, and gameplay review.
- Attribute technical results to the development record when they were not rerun for the entry.
- Present working names and planned features as such. Avoid invented dates, release commitments, playtest results, or team identities.
- Summarize selected evidence. Keep private logs, credentials, local machine paths, unreleased downloads, and unapproved third-party material out of the public repository.
- Keep the game repository separate. This site does not automatically import project files or development logs.

## Change the website

Use HTML, CSS, and JavaScript. Keep the generated site static and preserve its operation without browser JavaScript. Make links and images work beneath `/eg-megajam2026-devlog/`. New dependencies should solve a concrete need.

The source is under `src/`, `content/`, `public/`, and `scripts/`. `dist/` is generated and must not be committed. The checked-in npm lockfile keeps local and CI dependencies consistent.
