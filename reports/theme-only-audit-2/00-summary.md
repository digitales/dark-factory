---
title: Theme-only theme audit — Summary
description: Executive summary, platform strategy, top priorities, and index to a nine-part technical audit of the theme-only WordPress theme.
---

# 00 — Summary

Audit of `wordpress/wp-content/themes/theme-only/` commissioned Wednesday 22 April 2026. Commit under review: `d3359e2` (`develop` branch).

This document is the entry point. It gives the executive summary, the platform strategy, the top-10 priorities, and a map to the rest of the audit.

## Contents

- [Audit at a glance](#audit-at-a-glance)
- [Platform strategy](#platform-strategy)
- [What you'd gain and lose](#what-youd-gain-and-lose)
- [Top 10 priorities (P0 / P1)](#top-10-priorities-p0--p1)
- [Severity legend](#severity-legend)
- [How to read this audit](#how-to-read-this-audit)
- [Findings count by document](#findings-count-by-document)
- [What's out of scope](#whats-out-of-scope)

## Audit at a glance

**Theme classification**: Hybrid classic theme — classic templates (`header.php`, `footer.php`, `index.php`, `single.php`, `page.php`) paired with a minimal `theme.json` (which is suppressed on the front end) and 27 ACF-Pro custom blocks + 11 components. It commits to neither the classic nor the block-theme model cleanly.

**Maturity**: High code quality in structure (namespaced classes, per-block folder convention, modern webpack, linting, TypeScript tests with Playwright). Heavy third-party coupling (ACF Pro, Gravity Forms, Rank Math, WPML, WPMDB Pro) with no clean extraction boundary. Security: one P0 issue (SVG uploads without sanitisation) and one other P0 (arbitrary-HTML injection via theme options).

**Readiness for multi-project reuse**: Present as a clone-per-project starter. Not currently structured for true plugin extraction — most subsystems have no stable hook surface. With ~5–6 engineer-weeks of hookability + extraction work, major subsystems (modals, admin hardening, site options, people CPT) can be pulled out into independent GitHub-hosted plugins consumed via Composer.

## Platform strategy

The stated direction, agreed during the audit scoping:

1. **Standardise with modern WordPress working practices.**
2. **Remove third-party plugin dependencies — specifically ACF Pro.**
3. **Introduce actions and filters for extensibility, compatible with `theme.json` and modern WP.**
4. **Allow theme subsystems to be extracted into standalone, cross-project plugins and libraries.**

The audit is written to serve this direction. Every finding in [02 — Non-native APIs](/reports/theme-only-audit-2/02-non-native-apis) is paired with its native WordPress replacement. Every block in [06 — Blocks and Components](/reports/theme-only-audit-2/06-blocks-and-components) gets a "native equivalent" migration target. [07 — Reusability and plugin extraction](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction) catalogues the plugins to extract, and [08 — Roadmap](/reports/theme-only-audit-2/08-roadmap) sequences the work into executable phases.

## Context: prior Bedrock / Composer friction

The team previously struggled with [Roots Bedrock](https://roots.io/bedrock/) — the root cause was not specifically identified, and lives as a general "this isn't working" memory. This context matters because **Phase 7 (plugin extraction) uses Composer VCS repositories as the distribution mechanism**, which is the same territory Bedrock occupies. Without addressing the earlier friction, the team risks repeating whichever failure mode caused it.

### How this affects the audit

- **Phases 0–6 are Composer-neutral or Composer-reducing.** The native-first migration removes ~4 paid plugins and at least 2 Composer libraries. Post-migration, the Composer surface is *smaller* than today. This is a selling point.
- **Phase 7 introduces new Composer complexity.** The Composer VCS extraction model (~10 repos) is more sophisticated than what the team has run before.
- **A Bedrock retrospective is a precondition for Phase 7.** The team should identify what specifically went wrong — was it webroot restructuring (`web/wp` / `web/app`), env-var-driven config (`.env` + `phpdotenv`), or Composer-as-dependency-manager for WP core + plugins? Each failure mode has a different mitigation. Without this retrospective, Phase 7 inherits the unresolved risk.
- **DX investment is a first-class Phase 7 deliverable**, not an afterthought. Setup scripts, onboarding documentation, Makefile shortcuts, CI templates, and paired-onboarding for the first consuming project are sized explicitly in [07](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#dx-investment-for-composer-vcs) and the [roadmap](/reports/theme-only-audit-2/08-roadmap#phase-7--plugin-extraction).

### Note on the current Composer setup

The existing theme already uses Composer at two levels (root `composer.json` for plugins, theme-level `composer.json` for PHP libraries) with custom repositories for ACF Pro, Gravity Forms, and WPMDB Pro; `auth.json` for paid-plugin licences; and `ffraenz/private-composer-installer`-style env-var interpolation (`{%WP_PLUGIN_GF_KEY}`). The team has already solved the "Composer-for-WordPress-consumption" problem — what they did **not** adopt was Bedrock's webroot restructure or env-driven `wp-config` replacement. So whatever failed with Bedrock was probably not "Composer itself".

### Target architecture

A client project after migration would look like:

```
├── Theme (slim, presentation-only)
│   ├── style.css, theme.json, screenshot.png
│   ├── header.php, footer.php, templates/
│   ├── patterns/ — patterns using native core blocks + edwp/* custom blocks
│   ├── inc/Blocks/ — 20+ native blocks subclassing edwp/wp-block-kit
│   ├── assets/scss/ — per-block styles using theme.json tokens
│   └── assets/js/ — block viewScriptModules using Interactivity API
│
├── Composer plugins (pulled via VCS)
│   ├── edwp/edwp-core (MU) — admin + media hardening, SVG sanitizer
│   ├── edwp/edwp-admin — login branding, dashboard trim
│   ├── edwp/edwp-site-options — GTM, site-scripts, integrations
│   ├── edwp/edwp-modals — global modal system
│   ├── edwp/edwp-people (optional)
│   ├── edwp/edwp-testimonials (optional)
│   └── ...
│
├── Composer libraries (pulled via VCS)
│   ├── edwp/wp-block-kit — AbstractBlock + hook surface
│   ├── edwp/wp-theme-render — get_template_part wrapper
│   ├── edwp/wp-svg-sprite — SVG icons, sanitised
│   └── edwp/wp-theme-utils — generic helpers
│
├── Third-party (per project, not per starter)
│   ├── Gravity Forms (if needed)
│   ├── WPML (if needed)
│   └── Redirection
│
└── Native WP core (handles what core can)
    ├── Block types via register_block_type + render.php
    ├── Post meta via register_post_meta (shows in Gutenberg sidebar automatically)
    ├── Options via Settings API
    ├── SEO via core sitemap + in-theme schema + Redirection plugin
    └── Block Bindings for data-driven blocks
```

## What you'd gain and lose

### Gain

- **Fewer vendor-dependent breaking-change risks.** Core's backwards-compat promise is extremely strong. ACF / Rank Math / WPML each have a history of breaking custom integrations across majors. Eliminating them removes 4–8 engineer-days per year of compatibility work per project (~2–3 engineer-weeks across 5–10 projects).
- **Lower licensing overhead.** Removing ACF Pro saves ~$49/year per site. Dropping WPMDB Pro from the starter saves similar. Over 10 sites, ~$1,500/year direct cost + uncounted time saved.
- **Better developer onboarding.** "Just use WordPress" is a lower cognitive lift than "use WordPress + ACF + ACF Builder + our bespoke Render class + WPML compat".
- **Real performance wins.** Removing ACF's `acf_rendered_block()` overhead saves ~20–80ms TTFB per content page. Removing Rank Math front-end cost saves more. Native per-block asset loading (already enabled) becomes substantially more useful with native blocks. Replacing the homebrew preload/onload CSS pattern with native `wp_maybe_inline_styles()` saves 100–500ms LCP on content-heavy pages.
- **Cross-project reuse** via extracted plugins. A new client project starts with a thin theme + `composer require edwp/…` for the shared subsystems.
- **First-class Gutenberg authoring**. InnerBlocks with real drag-and-drop, block patterns, Synced Patterns, Block Bindings — better authoring UX than ACF Flexible Content / Repeater.
- **`theme.json` becomes meaningful.** Style variations for per-client branding, design tokens accessible via CSS custom properties, dynamic theme.json via `wp_theme_json_data_theme` filter.

### Lose

- **ACF's authoring velocity.** Defining a new "custom fields" group in ACF is point-and-click; defining equivalent meta + block attributes in native WP is typing PHP + JSX. Authors who loved ACF's editor-UI customisations (conditional logic, specific field types like Google Map, colour picker) will need to adapt.
- **Gravity Forms for form-heavy sites stays**. There is no native equivalent with entry management, payment integration, and conditional logic. Kept but made per-project-optional.
- **WPML for multi-language sites stays**. Core has no multi-language content model. Kept but made per-project-optional.
- **Rank Math's SEO-analyser UI.** The meta-description + schema output can be replicated in a ~300-line in-theme module; the analyser feedback in post editors cannot (not without building it from scratch).
- **Initial migration cost.** ~8 months of single-developer calendar time to land the full migration for one representative site, including data migration and QA. See [08 — Roadmap](/reports/theme-only-audit-2/08-roadmap).

### Realistic expectation

- **Front-end performance**: 150–400KB gzipped JS saved, 100–500ms LCP improvement on representative content pages, minor TTFB reduction.
- **Admin performance**: faster load (less plugin overhead), slower authoring velocity for design changes until team adapts to Gutenberg-native workflows.
- **Update maintenance**: ~50–75% reduction in "plugin broke our theme" incidents annually.

## Top 10 priorities (P0 / P1)

Ordered by severity × quick-win potential. Work through these in Phases 0–2 of the roadmap; they're independently deployable.

| # | ID | Title | Severity | Effort | Doc |
|---|---|---|---|---|---|
| 1 | SEC-SVG-01 | SVG uploads allow arbitrary JS injection (no sanitisation) | **P0** | S | [04](/reports/theme-only-audit-2/04-security#svg-uploads) |
| 2 | SEC-SITESCRIPTS-01 | Site-scripts option injects arbitrary HTML/JS without escape | **P0** | M | [04](/reports/theme-only-audit-2/04-security#site-scripts-injection-from-theme-options) |
| 3 | TPL-01 | `single.php` omits `get_header()` / `get_footer()` | **P0** | S | [01](/reports/theme-only-audit-2/01-conventions-and-structure#template-hierarchy) |
| 4 | RENDER-01 | `Render::partial` has 4 correctness bugs (call_user_method, cache args, extract scope bleed, dead hooks) | P1 | M | [02](/reports/theme-only-audit-2/02-non-native-apis#renderpartial-bugs) |
| 5 | SEC-ESCAPE-01 | Block templates don't escape interpolated values | P1 | M | [04](/reports/theme-only-audit-2/04-security#template-output-escaping) |
| 6 | PERF-THEME-JSON-01 | `theme.json` is suppressed on the front end via `remove_global_styles` | P1 | M | [03](/reports/theme-only-audit-2/03-performance#themejson-disabled-on-the-front-end) |
| 7 | PLUGIN-ACTIVE-01 | `is_plugin_active()` called from front-end contexts — latent fatal | P1 | S | [02](/reports/theme-only-audit-2/02-non-native-apis#is_plugin_active-on-the-front-end) |
| 8 | PERF-PRELOAD-01 | Homebrew preload/onload CSS pattern — FOUC risk, replaceable with native `wp_style_add_data(..., 'path', ...)` | P1 | S | [03](/reports/theme-only-audit-2/03-performance#the-preload--onload-css-pattern) |
| 9 | PERF-SPEC-01 | Hand-rolled speculation-rules tag prerenders every link including admin | P1 | S | [03](/reports/theme-only-audit-2/03-performance#speculation-rules) |
| 10 | ASSET-VER-01 | `filemtime()` called per enqueue — should consume the webpack manifest | P1 | S | [03](/reports/theme-only-audit-2/03-performance#asset-versioning-filemtime-vs-manifest) |

The first three (SEC-SVG-01, SEC-SITESCRIPTS-01, TPL-01) should ship to all live sites **before** any architectural work begins. They are the total scope of Phase 0 in [08 — Roadmap](/reports/theme-only-audit-2/08-roadmap).

## Severity legend

- **P0 — Critical.** Security exposure, functional bug, or production-blocking. Address before other work.
- **P1 — Important.** Performance, correctness, accessibility, or maintainability issues with clear evidence. Address in the next planned cycle.
- **P2 — Worth fixing.** Code quality, consistency, minor performance. Address opportunistically or as part of a broader refactor.

- **Effort — S.** ≤ 0.5 engineer-days.
- **Effort — M.** 0.5–3 engineer-days.
- **Effort — L.** 3+ engineer-days, often a multi-week engagement.

## How to read this audit

Start here (00) for context. Then, depending on role:

- **Principal / tech lead / architect** — read in order: 01 → 07 → 08. Understand the target architecture, the extraction strategy, and the phased migration. Skip the per-block detail in 06 unless budget-sizing a specific block.
- **Senior engineer owning implementation** — read in order: 08 → 06 → 02 → 03 → 04. Start with the roadmap, then go deep into blocks (06) and then the API/performance/security details that each phase depends on.
- **Security-reviewer / compliance** — read 04 cover-to-cover. Cross-reference with 01 (templates) and 02 (`Render::partial` extract() issue).
- **Budget-holder / client-comms** — read 00 + the top of 08 (total effort + phases). Then [What you'd gain and lose](#what-youd-gain-and-lose) above for narrative.
- **Frontend developer / designer** — read 03 (performance), 06 (blocks specifically), and [07 §the hook-first contract](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#the-hook-first-contract).
- **Plugin author / integrator** — read 07 in full for the hook surface and extraction model.

Every finding has a short ID (`TPL-01`, `SEC-SVG-01`, etc.). Use these as ticket titles — they're stable and searchable.

## Findings count by document

| Document | Count |
|---|---:|
| [01 — Conventions and structure](/reports/theme-only-audit-2/01-conventions-and-structure) | 18 |
| [02 — Non-native APIs](/reports/theme-only-audit-2/02-non-native-apis) | 19 |
| [03 — Performance](/reports/theme-only-audit-2/03-performance) | 20 |
| [04 — Security](/reports/theme-only-audit-2/04-security) | 14 |
| [05 — Dependencies](/reports/theme-only-audit-2/05-dependencies) | 9 |
| [06 — Blocks and components](/reports/theme-only-audit-2/06-blocks-and-components) | 9 + per-block minors |
| [07 — Reusability and extraction](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction) | 16 |
| **Total** | **~105 findings** |

Of which:

- **P0**: 3
- **P1**: ~35
- **P2**: ~65
- **Strategic (large)**: ACF removal, Rank Math removal, native block migration — all covered in multiple docs, sized in the roadmap.

## What's out of scope

Not audited (by mutual agreement):

- **Repo-level Docker / Make / setup scripts** (`Dockerfile.*`, `Makefile`, `setup/`, `docker-compose.yml`, `wordpress.ini`). Only flagged where they directly affect the theme (e.g. `phpcs.xml`'s PHP-version mismatch).
- **Playwright / sitespeed test harness** (`test/`, `sitespeed/`). No findings written. Structure looked reasonable at a glance.
- **`icon-library/` directory** (3,637 files — design assets, not code).
- **WPML internals** — only the integration code inside `inc/WPML.php` was reviewed, not WPML itself.
- **Gravity Forms internals** — same. Only the integration.
- **Content migration script writing** — covered as a roadmap line-item in Phase 5, but no script is authored here.
- **Design/UX review of the editor authoring experience** — the audit flags that authors will notice changes moving off ACF, but doesn't prescribe the new editor UX.

Not included in this audit round (could be added later if useful):

- **Accessibility (WCAG 2.1) audit.** Some accessibility implications are noted inline (mega-menu structure, skip-link, role="dialog" on modals). A dedicated a11y audit pass on every template would be a follow-on engagement.
- **Multisite / network-admin behaviour.** Assumed single-site.
- **Cron / scheduled jobs.** No custom cron hooks were observed in the theme code.
- **WordPress REST-API authorisation review.** `Person::updatePersonQuery()` filter was reviewed; full REST-auth review would need to trace all CPTs + meta.

---

End of summary. The document set starts at [01 — Conventions and structure](/reports/theme-only-audit-2/01-conventions-and-structure).
