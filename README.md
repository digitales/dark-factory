# Dark Factory Research Report — VitePress site

A separate VitePress site for the **Dark Factories and AI-Generated Code** research report, with [Elixirr Digital](https://www.elixirrdigital.com) branding.

The canonical report source remains **`docs/DARK_FACTORY_AI_CODE_RESEARCH_REPORT.md`**. This site is a conversion for web (and optionally PDF) with a logical structure and sidebar navigation.

## Setup

```bash
cd dark-factory-docs
npm install
```

## Commands

- **`npm run dev`** — Start dev server (uses relative base `./` for assets).
- **`npm run build`** — Build static site to `.vitepress/dist`.
- **`npm run preview`** — Preview the production build.

## Deploy to GitHub Pages

1. In the repo: **Settings → Pages → Build and deployment**: set **Source** to **GitHub Actions**.
2. Push to `main` (or run the workflow manually: **Actions → Deploy to GitHub Pages → Run workflow**).

The workflow (`.github/workflows/deploy-pages.yml`) builds the site with `base: /<repo-name>/` so assets and links work at `https://<user>.github.io/<repo>/`.

## Structure

- **`index.md`** — Home with hero and links to reports.
- **`reports/index.md`** — Reports landing page (lists all reports).
- **`reports/dark-factory/`** — Dark Factories & AI-Generated Code report (self-contained; own sidebar and sections).
- **`reports/<other>/`** — Add further self-contained reports under `reports/<slug>/` with their own sidebars in config.
- **`public/report/`** — Shared report images (e.g. Dark Factory section images); image paths in markdown stay `/report/report-*.png`.
- **`.vitepress/theme/`** — Elixirr Digital colours and footer (same branding for all pages).
- **`.vitepress/config.mts`** — Nav (Home, Reports, Elixirr Digital), sidebars per report path, local search, Mermaid.

## Branding

Theme uses Elixirr Digital–inspired palette (e.g. `#0d6b4c`) and footer line: *Your digital partner — Experience digital solutions that challenge the ordinary.*
