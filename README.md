# Dark Factory Research Report — VitePress site

A separate VitePress site for the **Dark Factories and AI-Generated Code** research report, with [Elixirr Digital](https://www.elixirrdigital.com) branding.

The canonical report source remains **`docs/DARK_FACTORY_AI_CODE_RESEARCH_REPORT.md`**. This site is a conversion for web (and optionally PDF) with a logical structure and sidebar navigation.

## Setup

```bash
cd dark-factory-docs
npm install
```

## Commands

- **`npm run dev`** — Start dev server. If you deploy at site root, set `base: '/'` in `.vitepress/config.mts`.
- **`npm run build`** — Build static site to `.vitepress/dist`.
- **`npm run preview`** — Preview the production build.

## Structure

- **`index.md`** — Home with hero and links to the report.
- **`report/index.md`** — Full report (all sections); sidebar and outline provide in-page navigation.
- **`.vitepress/theme/`** — Elixirr Digital colours and footer (brand green/teal, footer link to elixirrdigital.com).
- **`.vitepress/config.mts`** — Nav (Home, Report, Elixirr Digital), sidebar (report sections), local search, Mermaid for diagrams.

## Branding

Theme uses Elixirr Digital–inspired palette (e.g. `#0d6b4c`) and footer line: *Your digital partner — Experience digital solutions that challenge the ordinary.*
