# Said's Notes — Technical Articles .

Standalone GitHub Pages site (`https://saidibnerradi603.github.io`) for publishing long-form technical articles, architectures, and notes on Generative AI, Agentic Systems, Backend Engineering, and Computer Science.

Built with **Astro 5**, **Tailwind CSS v4**, **Expressive Code**, **Mermaid.js**, **Pagefind**, and a **D3-Force Interactive Knowledge Graph**.

## Features


- **Interactive Knowledge Graph (`/graph` + Article Sidebar)** — Automatically connects articles, categories, tags, and internal cross-links (`related` frontmatter, `/articles/<slug>` links, or `[[slug]]` wiki-links) into a live force-directed constellation.
- **Native Markdown + Mermaid.js** — Standard ```` ```mermaid ```` blocks render as theme-aware SVGs with dark-mode contrast safeguards and a click-to-zoom lightbox.
- **Syntax Highlighting & Math** — VS Code-grade Shiki highlighting with Copy button (`astro-expressive-code`) plus KaTeX LaTeX support (`$...$` and `$$...$$`).
- **Instant Static Search (`⌘K`)** — Zero-backend full-text search indexed at build time with Pagefind.
- **Automated GitHub Pages Deployment** — Push to `main` and GitHub Actions builds and publishes automatically.

## Local Development

```bash
npm install
npm run dev      # Start dev server at http://localhost:4321
npm run build    # Build static site + Pagefind search index into dist/
npm run preview  # Preview the production build locally (including ⌘K search)
```

## Publishing a New Article

1. Create a new `.md` file in `src/content/articles/my-article-slug.md`:

```markdown
---
title: "My Article Title"
description: "A crisp 1-2 sentence summary shown on cards and social previews."
publishedAt: 2026-11-20
category: "Generative AI" # Generative AI | Computer Science | Backend | Data Engineering | Notes
tags: ["Agentic RAG", "LangGraph"]
related: ["agentic-rag-deep-dive"] # Optional: creates direct edges in the Knowledge Graph
featured: false
---

Your Markdown content here — including ```mermaid diagrams, code blocks, tables, and $LaTeX$ math.
```

2. Commit and push to `main`:

```bash
git add .
git commit -m "publish: my article title"
git push
```

## Deploying to GitHub Pages

1. Create a GitHub repository named `saidibnerradi603.github.io` (or update `site` / `base` in `astro.config.mjs` if using a project repo).
2. Push this project to the `main` branch.
3. In GitHub: **Settings → Pages → Build and deployment → Source** → select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will build and deploy your site automatically.
