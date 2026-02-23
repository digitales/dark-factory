# Dark Factory Research Report — Handover Document

This document captures the context and decisions from the conversation that built this VitePress site, so the project can be moved to its **own repository** and the research report can live there as the primary asset.

---

## 1. What This Project Is

- **A VitePress documentation site** for the research report **"Dark Factories and AI-Generated Code"** (spec-driven development, consultancy dynamics, PHP/WordPress/Laravel adoption).
- **Branded for [Elixirr Digital](https://www.elixirrdigital.com)** — "Your digital partner".
- **Intentionally separate** from any other docs/VitePress in the original repo; it is a self-contained site with its own `package.json`, config, theme, and content.

When you move to a new repo, this folder **is** the new project. The only external dependency is the **canonical report Markdown**, which should either be copied into this repo or kept in sync (see below).

---

## 2. Source of Truth for the Report

- **Canonical report (original location):**  
  `docs/DARK_FACTORY_AI_CODE_RESEARCH_REPORT.md` (in the original Dezeen/workspace repo).
- **In this project:** the report content is duplicated in **`report/index.md`** (with VitePress frontmatter). The body is the full report (all 12 sections).
- **For the new repo:** either:
  - **Option A:** Copy `DARK_FACTORY_AI_CODE_RESEARCH_REPORT.md` into the new repo (e.g. `docs/` or project root) and treat it as the single source of truth; update `report/index.md` by copying from it when the report changes, **or**
  - **Option B:** Keep only `report/index.md` as the source and remove references to an external path.

One **fix was applied** to the report structure during this work: the heading **`## 6. Scenario-Based Development`** was added before `### 6.1 What It Is` so that section 6 is not nested under 5.8. If you use a copy of the original MD file, ensure that fix is present (or re-apply it).

---

## 3. Project Structure (What to Move)

```
dark-factory-docs/
├── .vitepress/
│   ├── config.mts          # Site config, nav, sidebar, footer, search
│   └── theme/
│       ├── index.ts        # Extends default theme, injects custom CSS
│       └── custom.css      # Elixirr Digital colours and component overrides
├── public/
│   └── .gitkeep            # Optional: add logo etc. here
├── report/
│   └── index.md            # Full report content (from canonical MD)
├── index.md                # Home: hero, CTAs, feature cards into report
├── package.json            # name, scripts, vitepress ^1.0.0
├── README.md               # Setup and commands (update paths for new repo)
├── HANDOVER.md             # This file
└── node_modules/           # Regenerate with npm install (do not commit)
```

**Do not move** `.vitepress/dist/` — it is build output; regenerate with `npm run build`.

---

## 4. Key Configuration (`.vitepress/config.mts`)

- **`base: '/dark-factory-docs/'`** — Set for deployment under a subpath (e.g. GitHub Pages under `/<repo>/`). **For a repo that is the only site:** set `base: '/'`.
- **`ignoreDeadLinks: true`** — Avoids build failure on dead links (e.g. in README).
- **Nav:** Home, Reports, Elixirr Digital (external link to https://www.elixirrdigital.com).
- **Sidebar:** Reports index at `/reports/`; Dark Factory at `/reports/dark-factory/` with sections (e.g. `/reports/dark-factory/01-executive-summary`). Other reports under `reports/<slug>/`.
- **Footer:** “Part of Elixirr Digital” and “Your digital partner — Experience digital solutions that challenge the ordinary.” with link to elixirrdigital.com.
- **Search:** `provider: 'local'` (built-in local search).
- **`siteTitle`:** “Elixirr Digital”.

---

## 5. Branding (Elixirr Digital)

- **Reference:** https://www.elixirrdigital.com  
- **Theme:** `.vitepress/theme/custom.css`  
  - Brand colour: **`#0d6b4c`** (and light/dark variants).  
  - Applied to: nav title, links, active sidebar item, outline, primary buttons, footer link.  
- **Footer copy:** “Your digital partner — Experience digital solutions that challenge the ordinary.”  
- **No logo** was added; you can place one in `public/` and reference it in the theme or config if desired.

---

## 6. Build and Scripts

- **VitePress version:** `^1.0.0` (1.x). A 2.x version was not available at the time; if you upgrade later, check for config/theme API changes.
- **Commands:**
  - `npm install` — Install dependencies.
  - `npm run dev` — Dev server.
  - `npm run build` — Output to `.vitepress/dist`.
  - `npm run preview` — Preview production build.

Build has been verified (client + server bundles and page render).

---

## 7. Content Pages

- **`index.md`** — Landing: title “Dark Factories & AI-Generated Code”, tagline, “Read the report” (primary) and “Elixirr Digital” (secondary) buttons, feature cards linking into report sections.
- **`report/index.md`** — Full report with frontmatter; heading hierarchy matches sidebar. The flowchart in section 5.3 is in a `mermaid` code block; **Mermaid is not currently enabled**, so it renders as a code block. A VitePress 1–compatible Mermaid plugin can be added later if you want it as a diagram.

---

## 8. Checklist for Moving to a New Repo

1. Copy the entire `dark-factory-docs/` tree (excluding `node_modules/` and `.vitepress/dist/`) into the new repo (e.g. as the repo root).
2. Decide where the **canonical report** lives:
   - Copy `DARK_FACTORY_AI_CODE_RESEARCH_REPORT.md` into the new repo and document it in README, **or**
   - Rely only on `report/index.md` and remove references to the old path.
3. In **`.vitepress/config.mts`**:
   - If the site is served at repo root: set **`base: '/'`**.
   - If using GitHub Pages with project site: keep `base: '/<repo-name>/'` or set per your deployment.
4. In **`README.md`**: replace any paths that referred to the original repo (e.g. “canonical report at `docs/...`”) with the new repo structure.
5. Run **`npm install`** and **`npm run build`** in the new repo to confirm everything works.
6. Add a **`.gitignore`** if missing (e.g. `node_modules/`, `.vitepress/dist/`).
7. Optionally remove or repurpose **`socialLinks`** (e.g. point to the new repo’s GitHub URL).

---

## 9. Optional Enhancements (Not Done in This Conversation)

- **Mermaid:** Enable a VitePress 1–compatible Mermaid plugin so the flowchart in 5.3 renders as a diagram.
- **Logo:** Add an image under `public/` and use it in the theme or `themeConfig.logo`.
- **PDF export:** Add a workflow (e.g. Puppeteer/Playwright or a VitePress plugin) to export the report as PDF from the built site.

---

## 10. Summary

| Item | Detail |
|------|--------|
| **Purpose** | VitePress site for “Dark Factories & AI-Generated Code” research report |
| **Branding** | Elixirr Digital (https://www.elixirrdigital.com), colour `#0d6b4c` |
| **Source of truth** | Original: `docs/DARK_FACTORY_AI_CODE_RESEARCH_REPORT.md`; in-site: `report/index.md` |
| **Fix applied** | Added `## 6. Scenario-Based Development` before ### 6.1 |
| **VitePress** | 1.x; build verified |
| **Deployment** | Set `base` in config to match deployment path (e.g. `'/'` for repo root) |

This document is intended to give a new maintainer or a different project full context so the research document can live in its own repo without losing the structure, branding, or configuration decisions made here.
