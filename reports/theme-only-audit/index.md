---
title: Theme-only theme audit
description: Nine-part technical audit of a hybrid ACF block theme, updated for WordPress 7.0 (PHP-only `autoRegister` blocks), native migration, extraction, and phased roadmap. Supersedes audit 2.
---

**Current edition** (replaces the historic [audit 2 →](/reports/theme-only-audit-2/)). Commissioned 22 April 2026, against commit `d3359e2` on `develop`. The audit covers `wordpress/wp-content/themes/theme-only/`: a hybrid classic theme with ACF blocks, a native-first migration strategy, and a path toward Composer-distributed `edwp/*` packages. **Context:** [WordPress 7.0](https://make.wordpress.org/core/2026/03/03/php-only-block-registration/) (April 2026) is factored in — including `autoRegister` block registration, InnerBlocks limitations, and revised phase effort in the [roadmap](/reports/theme-only-audit/08-roadmap).

## Report sections

| Section | Description |
|--------|-------------|
| [0. Summary](/reports/theme-only-audit/00-summary) | Executive summary, platform strategy, top-10 P0/P1 items, and reading guide |
| [1. Conventions and structure](/reports/theme-only-audit/01-conventions-and-structure) | Directories, templates, autoloading, WPCS, `theme.json` vs front end |
| [2. Non-native APIs](/reports/theme-only-audit/02-non-native-apis) | ACF, SEO, WPMDB, and native WordPress replacement paths |
| [3. Performance](/reports/theme-only-audit/03-performance) | Enqueue, asset versioning, queries, Swiper, fonts |
| [4. Security](/reports/theme-only-audit/04-security) | P0 items (SVG, site scripts), escaping, nonces, injection surfaces |
| [5. Dependencies](/reports/theme-only-audit/05-dependencies) | Composer and JS dependency inventory, removal cost |
| [6. Blocks and components](/reports/theme-only-audit/06-blocks-and-components) | Per-block and systemic findings, migration targets |
| [7. Reusability and plugin extraction](/reports/theme-only-audit/07-reusability-and-plugin-extraction) | Hook surface, candidate plugins, Composer VCS, Bedrock/Composer DX |
| [8. Roadmap](/reports/theme-only-audit/08-roadmap) | Phased execution (security through optional parent-theme work) |

Start with [0. Summary](/reports/theme-only-audit/00-summary) for scope, severity legend, and cross-links into the other documents.

## Related reports

- [Theme-only theme audit (2) — historic](/reports/theme-only-audit-2/) — prior snapshot before the WordPress 7.0 revision, for side-by-side comparison.
- [Dark Factories and AI-Generated Code](/reports/dark-factory/) — spec-driven and AI-assisted development context for the same team.
- [AI in the WordPress + Laravel Pipeline](/reports/ai-wp-laravel-pipeline/) — AI integration patterns that complement theme modernisation work.
