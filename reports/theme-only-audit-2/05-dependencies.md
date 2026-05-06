---
title: Dependencies
description: Composer, npm, paid plugins, and cost to remove or replace dependencies.
---

# 05 — Dependencies

This document inventories every Composer + npm dependency and gives each a verdict: **Keep required / Keep optional / Replace with native / Remove**. It is the contract-level view of the native-first platform strategy.

All costs here reflect the work to remove or swap the dependency. Costs to migrate *away from* the functionality the dependency provides are covered in the target-document: ACF in [02](/reports/theme-only-audit-2/02-non-native-apis), Rank Math replacement in [02](/reports/theme-only-audit-2/02-non-native-apis#rank-math-dependencies), etc.

## Contents

- [Verdicts at a glance](#verdicts-at-a-glance)
- [Composer dependencies (root)](#composer-dependencies-root)
- [Composer dependencies (theme)](#composer-dependencies-theme)
- [npm dependencies (production)](#npm-dependencies-production)
- [npm dependencies (build-only)](#npm-dependencies-build-only)
- [Upgrade hygiene](#upgrade-hygiene)
- [Supply-chain observations](#supply-chain-observations)
- [Findings summary](#findings-summary)

## Verdicts at a glance

| Dependency | Kind | Verdict | Replacement path |
|---|---|---|---|
| `wpengine/advanced-custom-fields-pro` | Composer plugin | **Remove** (migration) | Native blocks + `register_post_meta` + Block Bindings |
| `stoutlogic/acf-builder` | Composer library | **Remove** (with ACF) | N/A |
| `jjgrainger/posttypes` | Composer library | **Remove** | Direct `register_post_type()` |
| `jeroendesloovere/vcard` | Composer library | **Remove** (unused) | N/A — no usage found |
| `gravityforms/gravityforms` | Composer plugin | **Keep optional** | Per-project — not bundled in starter |
| `deliciousbrains-plugin/wp-migrate-db-pro` | Composer plugin | **Remove from starter** | WP-CLI (`wp db export/import`, `wp search-replace`) |
| `wpackagist-plugin/seo-by-rank-math` | Composer plugin | **Remove** (migration) | In-theme SEO module + core sitemap + Redirection plugin |
| `squizlabs/php_codesniffer` | Composer dev | **Keep required** | — |
| WPML (not in composer) | Runtime plugin | **Keep optional** | Per-project — guard with `defined('ICL_SITEPRESS_VERSION')` |
| `swiper` | npm runtime | **Keep optional** | CSS scroll-snap for simple cases; lazy-import for complex |
| `@googlemaps/js-api-loader` | npm runtime | **Keep required** | — (Google Maps block) |
| `@fontsource-variable/*` | npm runtime | **Keep required** | — |
| Custom webpack stack (40+ packages) | npm build-only | **Keep optional** | Consider `@wordpress/scripts` per-project |

## Composer dependencies (root)

Root `composer.json` declares five production requirements plus `dev` autoloader config.

### `wpengine/advanced-custom-fields-pro` `6.8.0.1`

- **Role**: Content model + block rendering + options pages.
- **Used by**: Every block + component + CPT + option lookup — see [02 ACF-01](/reports/theme-only-audit-2/02-non-native-apis#acf-pro-advanced-custom-fields) for the full coupling map.
- **Licence**: Paid annual licence via WP Engine (formerly Delicious Brains → Elliot Condon → WP Engine).
- **Maintenance**: Active; major version cadence ~annual. Breaking changes are common across majors.
- **Verdict**: **Remove**. Strategic direction per user direction is ACF-free native-first.
- **Cost to remove**: Multi-week engagement. See [08 Phase 3–4](/reports/theme-only-audit-2/08-roadmap).

### `gravityforms/gravityforms` `2.9.31`

- **Role**: Form builder, entry management, payment integrations.
- **Used by**: `inc/GravityForms.php`, `inc/Blocks/FormBlock/`, `inc/Blocks/NewsletterSignup/`, `inc/Modals.php`, `inc/ACF/ThemeOptions.php`.
- **Licence**: Paid annual licence.
- **Maintenance**: Active; stable release cadence. Fewer breaking changes than ACF.
- **Verdict**: **Keep optional**. No native equivalent with matching feature depth. Decouple from starter template.
- **Cost to decouple**: ~0.5 days — guard all usages with `class_exists('\GFAPI')`, remove hard composer dep, document as per-project opt-in.

### `deliciousbrains-plugin/wp-migrate-db-pro` `2.7.7`

- **Role**: DB pull/push between environments via GUI.
- **Used by**: Not used in theme code — only installed as a plugin dependency.
- **Licence**: Paid annual licence.
- **Maintenance**: Active.
- **Verdict**: **Remove from starter**. WP-CLI (`wp db export`, `wp db import`, `wp search-replace`) covers 95% of the functionality.
- **Cost to remove**: 0 — just drop from `composer.json`.
- **Team workflow impact**: Document WP-CLI equivalents in the starter README. For projects where the team values the GUI, reinstate per-project.

### `wpackagist-plugin/seo-by-rank-math` `1.0.268`

- **Role**: SEO (schema.org, meta tags, sitemaps, redirects, breadcrumbs, analytics).
- **Used by**: `inc/RankMath.php` (excerpt compat filter), `inc/Blocks/Breadcrumbs/Breadcrumbs.php` (optional integration), `inc/Admin.php` (dashboard widget removal).
- **Licence**: Free (with paid Pro upgrade for advanced features).
- **Maintenance**: Active but rough — major releases frequently break template integrations and custom variables.
- **Verdict**: **Remove (migration)**. Replace with ~300 lines of in-theme SEO module + core's native sitemap + [Redirection](https://wordpress.org/plugins/redirection/) plugin for URL redirects.
- **Cost to replace**: 2–3 engineer-days for the SEO module + per-project tuning.

## Composer dependencies (theme)

Theme-level `composer.json`:

```json
"require": {
    "stoutlogic/acf-builder": "^1.12",
    "jeroendesloovere/vcard": "1.7.4",
    "jjgrainger/posttypes": "^2.2"
}
```

### `stoutlogic/acf-builder` `^1.12`

- **Role**: Fluent PHP builder for ACF field group arrays.
- **Used by**: Every block, every component, every ACF group, every CPT/taxonomy field.
- **Licence**: MIT.
- **Maintenance**: Moderate. Last release 2024. ~1k GitHub stars.
- **Verdict**: **Remove** (with ACF).
- **Cost**: Removed as a side effect of ACF migration.

### `jeroendesloovere/vcard` `1.7.4`

- **Role**: vCard file generation (RFC 2426 / RFC 6350).
- **Used by**: **None**. No `jeroendesloovere\VCard\VCard` import found anywhere in the codebase. This is an unused dependency.
- **Licence**: MIT.
- **Maintenance**: Stable, infrequent updates.
- **Verdict**: **Remove (unused)**.
- **Cost**: 5 minutes — `composer remove jeroendesloovere/vcard`.

**Finding `DEPS-VCARD-01` (P2, S).** Remove unused `jeroendesloovere/vcard` dependency.

### `jjgrainger/posttypes` `^2.2`

- **Role**: Fluent builder for `register_post_type()` / `register_taxonomy()`.
- **Used by**: `inc/PostTypes/*.php`, `inc/Taxonomies/*.php`.
- **Licence**: MIT.
- **Maintenance**: Minimal, sparse. Last release ~2 years old.
- **Verdict**: **Remove**. Direct calls to `register_post_type()` are not significantly more verbose and are the native pattern.
- **Cost**: ~0.5 days — mechanical rewrite of 4 CPTs + 1 taxonomy.

Covered in detail in [02 POSTTYPES-01](/reports/theme-only-audit-2/02-non-native-apis#jjgraingerposttypes).

### `squizlabs/php_codesniffer` `3.*`

- **Role**: PHP_CodeSniffer — linter.
- **Used by**: `composer run lint:php`.
- **Licence**: BSD-3.
- **Maintenance**: Active.
- **Verdict**: **Keep required**.
- **Note**: Pin a minor version — `3.*` is too broad. Current major is 3.10; 3.11/3.12 may contain rule changes. Pin to `^3.10.0` or specific-minor.

**Finding `DEPS-PHPCS-01` (P2, S).** Pin `squizlabs/php_codesniffer` to a specific minor version.

## npm dependencies (production)

From theme-level `package.json` → `dependencies`:

### `swiper` `^12.0.3`

- **Role**: Touch-enabled carousel / slider JS library.
- **Bundle size**: ~150KB gzipped (min).
- **Licence**: MIT.
- **Maintenance**: Active, well-maintained.
- **Verdict**: **Keep optional**. See [02 SWIPER-02](/reports/theme-only-audit-2/02-non-native-apis#swiper) for lazy-import / CSS scroll-snap replacement strategies.

### `@googlemaps/js-api-loader` `^2.0.2`

- **Role**: Loader for the Google Maps JavaScript API.
- **Used by**: `inc/Blocks/Map/` — the Map block JS.
- **Licence**: Apache 2.0.
- **Maintenance**: Google-maintained.
- **Verdict**: **Keep required** for projects that use the Map block. Consider making the Map block itself optional per-project (not every site needs Google Maps).

### `@fontsource-variable/ibm-plex-sans` + `@fontsource-variable/open-sans`

- **Role**: Self-hosted variable fonts (IBM Plex Sans, Open Sans).
- **Used by**: Font stack, webpack asset pipeline.
- **Licence**: OFL (Open Font Licence).
- **Maintenance**: Active community.
- **Verdict**: **Keep required**. Self-hosting is the right choice (GDPR-friendly, no Google Fonts call).
- **Note**: See [03 PERF-FONT-02](/reports/theme-only-audit-2/03-performance#font-loading) — subset to latin-only if applicable.

## npm dependencies (build-only)

The `devDependencies` block is ~40 packages — a typical modern webpack theme setup. Highlights:

| Package | Role | Verdict |
|---|---|---|
| `webpack`, `webpack-cli`, `webpack-dev-server` | Bundler | Keep |
| `@babel/core`, `@babel/preset-env`, `babel-loader` | JS transpilation | Keep |
| `sass`, `sass-loader`, `postcss-scss`, `postcss-loader` | SCSS pipeline | Keep |
| `css-loader`, `mini-css-extract-plugin` | CSS extraction | Keep |
| `css-minimizer-webpack-plugin`, `terser-webpack-plugin` | Minification | Keep |
| `image-minimizer-webpack-plugin`, `sharp` | Image optimisation | Keep |
| `svg-spritemap-webpack-plugin` | SVG sprite gen | Keep |
| `webpack-favicons`, `favicons` | Favicon generation | Keep |
| `html-webpack-plugin` | HTML output | Check — theme doesn't obviously use this |
| `clean-webpack-plugin` | Output cleanup | Keep |
| `copy-webpack-plugin` | Static asset copy | Keep |
| `webpack-manifest-plugin` | Manifest generation | Keep (see [03 ASSET-VER-01](/reports/theme-only-audit-2/03-performance#asset-versioning-filemtime-vs-manifest)) |
| `stylelint-*` (7 packages) | SCSS linting | Keep |
| `stylelint-webpack-plugin` | In-build linting | Keep |
| `prettier` | Formatting | Keep |
| `husky` | Git hooks | Keep |
| `cross-env` | Env-var setting | Keep |

### `html-webpack-plugin`

Configured but not obviously used. Theme doesn't emit HTML files. Candidate for removal.

**Finding `DEPS-HTMLWP-01` (P2, S).** Verify `html-webpack-plugin` is actually needed; remove if not.

### `@wordpress/scripts` alternative

Every modern native-block WP theme uses `@wordpress/scripts` for its build. It bundles webpack, Babel (with JSX + WordPress's React), ESLint config, scripts config, etc. — in a single `npm i @wordpress/scripts` + `wp-scripts build`.

The custom webpack stack here is ~40 packages vs `@wordpress/scripts`' single dep. Trade-offs:

- **Current stack** — familiar, flexible. Works for non-block JS (like the front-end `scripts.js` entry). The block + SCSS discovery pattern in `buildEntryPoints()` is a genuine asset.
- **`@wordpress/scripts`** — standard WordPress tooling. Built-in JSX/Gutenberg support. Less configuration. Handles block.json auto-discovery. Opinionated output structure matches other WP dev.

For the native block migration (Phase 3 in [08](/reports/theme-only-audit-2/08-roadmap)), `@wordpress/scripts` is the canonical choice. For the existing non-block JS (`scripts.js`, `modal.js`, `lazyload.js`, `mobile-menu.js`, etc.), the current webpack works fine.

**Finding `DEPS-WP-SCRIPTS-01` (P2, M).** When beginning native block migration, evaluate whether to run `@wordpress/scripts` alongside the existing webpack (dual-build — `wp-scripts` for blocks, custom webpack for everything else), or migrate everything to `@wordpress/scripts`. I'd suggest dual-build: per-block JS under `@wordpress/scripts`, main bundles continuing through current webpack.

## Upgrade hygiene

### `composer.json` (root and theme): `minimum-stability: dev`

Both `composer.json` files declare:

```json
"minimum-stability": "dev",
"prefer-stable": true
```

`minimum-stability: dev` + `prefer-stable: true` means "allow dev-tagged packages but prefer stable ones when available". In practice, this is fine — WP-specific packages sometimes only have dev-* tagged versions. But:

- Newly added packages without stable releases will silently install `dev-master` / `dev-main`.
- Dependency resolution gets more expensive (Composer has to consider more version combinations).

**Finding `DEPS-STABILITY-01` (P2, S).** Consider `minimum-stability: stable` for the theme-level `composer.json` (which has no dev-only deps), and keep `dev` for the root (which has WPMDB Pro and similar that sometimes use dev-master).

### No lock files in CI audit

`composer.lock` and `pnpm-lock.yaml` are committed — good. But there's no CI step that runs `composer audit` or `npm audit` / `pnpm audit` for known-vulnerability scanning.

**Finding `DEPS-AUDIT-01` (P2, S).** Add `composer audit` + `pnpm audit` to CI. Fail the build on HIGH/CRITICAL vulnerabilities; warn on moderate.

### Renovate / Dependabot

No `.github/dependabot.yml` or `renovate.json`. Dependency updates are manual.

**Finding `DEPS-RENOVATE-01` (P2, S).** Add Dependabot or Renovate config. Auto-PRs for patch/minor updates. Pinned major updates.

## Supply-chain observations

### Private Composer repos

Both `composer.json` files declare custom VCS / Composer repos:

```json
"repositories": [
    {"type": "composer", "url": "https://wpackagist.org"},
    {"type": "composer", "url": "https://connect.advancedcustomfields.com"},
    {"type": "composer", "url": "https://premium.wpmudev.org/"},
    {"type": "composer", "url": "https://composer.deliciousbrains.com"},
    {"type": "composer", "url": "https://my.yoast.com/packages/"}
]
```

- `wpackagist.org` — public.
- `connect.advancedcustomfields.com` — ACF Pro paid. Requires `.env` var for auth.
- `premium.wpmudev.org` — WPMU DEV; not obviously used in this theme's deps. Consider removing.
- `composer.deliciousbrains.com` — WPMDB Pro.
- `my.yoast.com/packages/` — Yoast; not used.

**Finding `DEPS-REPOS-01` (P2, S).** Prune unused custom Composer repos. Each adds network calls to `composer update` and is a supply-chain surface. Keep only the repos actually used.

### Gravity Forms via `{%WP_PLUGIN_GF_KEY}` env interpolation

Root `composer.json:39-48`:

```json
"dist": {
    "type": "zip",
    "url": "https://www.gravityhelp.com/wp-content/plugins/gravitymanager/api.php?op=get_plugin&slug=gravityforms&key={%WP_PLUGIN_GF_KEY}"
}
```

The `{%VAR}` syntax is from `ffraenz/private-composer-installer`. Requires `WP_PLUGIN_GF_KEY` in env at install time. Good pattern — keeps the licence key out of `composer.json`. Document prominently in the README.

### Auth.json handling

The starter README says "Add auth.json file to the root directory. This can be found in 1password." This is the standard approach, but:

- `auth.json` is in `.gitignore` — correct.
- There's no documentation on where specifically 1Password — in a larger team this causes friction at onboarding.

**Finding `DEPS-AUTH-01` (P2, S).** Document `auth.json` structure + expected keys + 1Password vault / item path in the README.

## Findings summary

| ID | Title | Severity | Effort |
|---|---|---|---|
| DEPS-VCARD-01 | Remove unused `jeroendesloovere/vcard` | P2 | S |
| DEPS-PHPCS-01 | Pin `squizlabs/php_codesniffer` to minor version | P2 | S |
| DEPS-HTMLWP-01 | Remove `html-webpack-plugin` if unused | P2 | S |
| DEPS-WP-SCRIPTS-01 | Evaluate `@wordpress/scripts` for native-block migration | P2 | M |
| DEPS-STABILITY-01 | Tighten `minimum-stability` at theme level | P2 | S |
| DEPS-AUDIT-01 | Add `composer audit` / `pnpm audit` to CI | P2 | S |
| DEPS-RENOVATE-01 | Enable Dependabot or Renovate | P2 | S |
| DEPS-REPOS-01 | Prune unused custom Composer repos | P2 | S |
| DEPS-AUTH-01 | Document `auth.json` setup + vault location | P2 | S |

Next: [06 — Blocks and Components (exhaustive)](/reports/theme-only-audit-2/06-blocks-and-components)
