---
title: Roadmap
description: Phased plan from P0 security fixes through native migration and optional plugin extraction.
---

# 08 — Roadmap

This document sequences every finding from documents [01–07](/reports/theme-only-audit-2/00-summary) into an executable plan. Each phase declares its goal, scope, dependencies on earlier phases, effort estimate, and exit criteria.

Numbers are engineer-days on a mid-senior WordPress developer familiar with the codebase. **Multiply by 1.5–2× for calendar time** to account for review cycles, QA, scheduling, and context switching.

## Contents

- [Phase 0 — Security quick wins (P0)](#phase-0--security-quick-wins-p0)
- [Phase 1 — Correctness and hygiene quick wins (P1)](#phase-1--correctness-and-hygiene-quick-wins-p1)
- [Phase 2 — Performance wins independent of migration](#phase-2--performance-wins-independent-of-migration)
- [Phase 2.5 — Hookability pass](#phase-25--hookability-pass)
- [Phase 3 — Block-kit and representative native block](#phase-3--block-kit-and-representative-native-block)
- [Phase 4 — Block-by-block migration](#phase-4--block-by-block-migration)
- [Phase 5 — ACF removal + data migration](#phase-5--acf-removal--data-migration)
- [Phase 6 — Dependency removals](#phase-6--dependency-removals)
- [Phase 7 — Plugin extraction](#phase-7--plugin-extraction)
- [Phase 8 — Parent-theme evaluation (optional)](#phase-8--parent-theme-evaluation-optional)
- [Total effort](#total-effort)
- [Dependencies graph](#dependencies-graph)
- [Recommended order of client rollout](#recommended-order-of-client-rollout)

## Phase 0 — Security quick wins (P0)

**Goal**: Eliminate the two P0 security findings before anything else happens.

| Task | Ref | Effort |
|---|---|---|
| Fix SVG upload — add sanitizer or remove mime whitelist | [04 SEC-SVG-01](/reports/theme-only-audit-2/04-security#svg-uploads) | 0.5d |
| Fix site-scripts injection — replace free-form paste or gate + escape everything | [04 SEC-SITESCRIPTS-01](/reports/theme-only-audit-2/04-security#site-scripts-injection-from-theme-options) | 1.5d |
| Fix `single.php` missing `get_header/get_footer` | [01 TPL-01](/reports/theme-only-audit-2/01-conventions-and-structure#template-hierarchy) | 0.25d |

**Total**: 2.25 days.

**Exit criteria**: Security findings marked P0 are closed. No behavioural regressions.

**Can ship independently**: Yes. Deploy to all live sites immediately.

## Phase 1 — Correctness and hygiene quick wins (P1)

**Goal**: Fix functional bugs and structural issues that don't require migration.

| Task | Ref | Effort |
|---|---|---|
| Remove redundant `spl_autoload_register` | [01 ARCH-01](/reports/theme-only-audit-2/01-conventions-and-structure#autoloading) | 0.1d |
| Replace `is_plugin_active()` with `class_exists` / `defined` | [01 ARCH-03](/reports/theme-only-audit-2/01-conventions-and-structure) | 0.1d |
| Fix `404.php` placeholder content | [01 TPL-02](/reports/theme-only-audit-2/01-conventions-and-structure#template-hierarchy) | 0.5d |
| Fix `<h1>` missing `</h1>` in search.php | [01 TPL-03](/reports/theme-only-audit-2/01-conventions-and-structure#template-hierarchy) | 0.1d |
| Decide: keep or delete `templates/default.php` | [01 TPL-04](/reports/theme-only-audit-2/01-conventions-and-structure#template-hierarchy) | 0.25d |
| `style.css` — add required header fields | [01 STYLE-01](/reports/theme-only-audit-2/01-conventions-and-structure#stylecss-and-themejson-contracts) | 0.25d |
| Unify identity across `style.css`, `composer.json`, `package.json`, webpack defaults | [01 ID-01](/reports/theme-only-audit-2/01-conventions-and-structure#naming-and-identity) | 0.5d |
| Fix PHPCS target to 8.1 | [01 PHP-01](/reports/theme-only-audit-2/01-conventions-and-structure#coding-standards-php) | 0.25d |
| Adopt WordPress-Extra PHPCS ruleset + baseline | [01 PHP-02](/reports/theme-only-audit-2/01-conventions-and-structure#coding-standards-php) | 2d (initial baseline creation + trivial-fix pass) |
| Rewrite `Render::partial()` — fix `wp_cache_set` args + `call_user_method` + `extract` | [02 RENDER-01](/reports/theme-only-audit-2/02-non-native-apis#renderpartial-bugs) | 1.5d |
| Rewrite `Helpers::generateLink()` with structured attribute building | [04 SEC-GENERATELINK-01](/reports/theme-only-audit-2/04-security#helpersgeneratelink-string-concatenation) | 0.5d |
| Fix `SVG::get()` — memoise, sanitise, validate path, use `href` | [02 SVG-01](/reports/theme-only-audit-2/02-non-native-apis#svgget-and-svgicon) | 0.5d |
| Template escaping pass over every `template.php` | [04 SEC-ESCAPE-01](/reports/theme-only-audit-2/04-security#template-output-escaping) | 5d (40 templates) |
| Add nonce verification to Ajax handler | [04 SEC-AJAX-01](/reports/theme-only-audit-2/04-security#ajax-without-nonce-verification) | 0.25d |
| Fix GTM ID validation + escaping | [04 SEC-GTM-01](/reports/theme-only-audit-2/04-security#gtm-injection) | 0.25d |
| Move CPT registration from constructors to `init` hook | [02 CPT-01](/reports/theme-only-audit-2/02-non-native-apis#jjgraingerposttypes) | 0.5d |
| Replace `jjgrainger/posttypes` with native `register_post_type` | [02 POSTTYPES-01](/reports/theme-only-audit-2/02-non-native-apis#jjgraingerposttypes) | 0.5d |
| Fix menu walker — use `nav_menu_link_attributes` instead of `str_replace` | [04 SEC-MENU-01](/reports/theme-only-audit-2/04-security#menu-walker-and-mega-menu-html-injection) | 0.5d |
| Fix share URL construction — `add_query_arg` + HTTPS | [04 SEC-SOCIAL-01](/reports/theme-only-audit-2/04-security#social-sharing-url-construction) | 0.25d |
| Remove dead `start_operation` / `end_operation` hooks | [02 OPS-01](/reports/theme-only-audit-2/02-non-native-apis#custom-ops-hooks) | 0.1d |
| Remove unused `jeroendesloovere/vcard` | [05 DEPS-VCARD-01](/reports/theme-only-audit-2/05-dependencies#composer-dependencies-theme) | 0.1d |
| Replace service-locator in `functions.php` with hooked bootstrap | [01 ARCH-02](/reports/theme-only-audit-2/01-conventions-and-structure#autoloading) | 1d |

**Total**: ~14.5 days.

**Exit criteria**: All P1 non-migration findings closed. `phpcs` baseline committed. Theme boots cleanly on PHP 8.1 with WordPress-Extra ruleset.

**Can ship independently**: Yes, in weekly small batches. Each task is independently reviewable.

## Phase 2 — Performance wins independent of migration

**Goal**: Drop obvious perf issues without changing the content model.

| Task | Ref | Effort |
|---|---|---|
| Replace `filemtime()` with webpack-manifest-driven versioning | [03 ASSET-VER-01](/reports/theme-only-audit-2/03-performance#asset-versioning-filemtime-vs-manifest) | 1d |
| Standardise `wp_register_script` strategies | [03 ENQUEUE-01](/reports/theme-only-audit-2/03-performance#enqueue-strategies) | 0.5d |
| Declare explicit script dependencies per block | [03 ENQUEUE-02](/reports/theme-only-audit-2/03-performance#enqueue-strategies) | 0.5d |
| Remove preload/onload CSS pattern; replace with `wp_style_add_data(..., 'path', ...)` | [03 PERF-PRELOAD-01](/reports/theme-only-audit-2/03-performance#the-preload--onload-css-pattern) | 0.5d |
| Scope admin Swiper enqueue to block-editor screens | [03 PERF-SWIPER-ADMIN-01](/reports/theme-only-audit-2/03-performance#swiper-loading) | 0.1d |
| Delete hand-rolled speculation-rules tag | [03 PERF-SPEC-01](/reports/theme-only-audit-2/03-performance#speculation-rules) | 0.1d |
| `theme.json` decision — commit or delete | [03 PERF-THEME-JSON-01](/reports/theme-only-audit-2/03-performance#themejson-disabled-on-the-front-end) | 2d |
| Add `composer audit` + `pnpm audit` to CI | [05 DEPS-AUDIT-01](/reports/theme-only-audit-2/05-dependencies#upgrade-hygiene) | 0.25d |
| Cache `Cards::queryPosts` + clean up Person meta_query | [03 PERF-QUERY-01, 02](/reports/theme-only-audit-2/03-performance#database-queries) | 1d |
| Caps-added options — remove from autoload | [03 PERF-CAPS-02](/reports/theme-only-audit-2/03-performance#capability-writes-on-every-request) | 0.25d |
| Preload variable fonts + font-display: swap | [03 PERF-FONT-01](/reports/theme-only-audit-2/03-performance#font-loading) | 0.5d |
| Subset fonts to script(s) used | [03 PERF-FONT-02](/reports/theme-only-audit-2/03-performance#font-loading) | 0.25d |

**Total**: ~7 days.

**Exit criteria**: Measurable improvement in Lighthouse / CrUX / RUM data. Target: 100–300ms LCP improvement on representative content pages.

**Can ship independently**: Yes. Small-scope changes, easy to test.

## Phase 2.5 — Hookability pass

**Goal**: Add the [proposed hook surface](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#proposed-hook-surface) to the current codebase. No behaviour changes — purely additive. Preconditions for Phase 7 (plugin extraction).

| Task | Effort |
|---|---|
| Add `edwp/setup/*` hooks to `Setup.php` | 0.5d |
| Add `edwp/enqueue/*` hooks to `Setup.php` / `Admin.php` | 0.5d |
| Add `edwp/setting/{key}` wrapper around every `get_field(..., 'option')` call | 1d |
| Add `edwp/modal/*` hooks to `Modals.php` (rename existing `edwp_*` to `edwp/*`) | 0.5d |
| Add `edwp/nav/*` hooks to `Filters.php` | 0.5d |
| Add `edwp/media/*` hooks to `Media.php` | 0.25d |
| Add `edwp/scripts/*` hooks to site-scripts pipeline | 0.5d |
| Add `edwp/template/*` hooks to `Render::partial` or new loader | 0.5d |
| Register `edwp/setting` Block Bindings source | 0.5d |
| Write hook-reference documentation (`docs/hooks.md`) | 1d |

**Total**: ~5.75 days.

**Exit criteria**: Every custom hook documented with `@since`, `@param`, usage example. Block Bindings source registered and tested from a pattern. No behaviour regressions.

**Can ship independently**: Yes. Purely additive.

## Phase 3 — Block-kit and representative native block

**Goal**: Build the `edwp/wp-block-kit` Composer library and prove the native-block pattern with **one representative migration**.

| Task | Effort |
|---|---|
| Build `edwp/wp-block-kit` package (class + hooks + tests) | 3d |
| Publish to internal GitHub + tag v1.0.0 | 0.5d |
| Set up `@wordpress/scripts` alongside existing webpack | 1d |
| Migrate one block end-to-end as a reference | 3d |
| Write migration runbook (step-by-step for each future block) | 1d |

**Recommended reference block**: `acf/accordion`. It has:
- Non-trivial interactivity (close-all, open-first, chevron icon).
- Repeater field (heading + WYSIWYG).
- Moderate JS (replaceable with `core/details` + Interactivity API).
- Low template complexity.

If migration works smoothly for Accordion, the pattern generalises. If it doesn't, uncover the gaps before committing to migrating 26 more.

**Total**: ~8.5 days.

**Exit criteria**: One native block shipped. Migration runbook documented. `@wordpress/scripts` build running in CI.

## Phase 4 — Block-by-block migration

**Goal**: Migrate the remaining 26 blocks and 11 components to native.

Order by **user value × complexity**, roughly:

**Batch 1: Simplest blocks with direct native equivalents (2d each)**
- `acf/separator` → `core/separator` (delete block, theme styling only)
- `acf/shortcode` → `core/shortcode` (delete block)
- `acf/buttons` → `core/buttons` (delete block; keep `Button` component style variation)
- `acf/content` → block pattern + core blocks (delete block)

Sub-total: ~8d for 4 blocks.

**Batch 2: Layout primitives (3d each — heavy stylistic work)**
- `acf/column` → `core/column`
- `acf/group` → `core/group`

Sub-total: ~6d. Highest code savings (these are the largest blocks).

**Batch 3: Interactive blocks (3–5d each)**
- `acf/accordion` → already done in Phase 3.
- `acf/tabbed-content` → custom block + Interactivity API.
- `acf/gallery` → `core/gallery` + custom modal-zoom extension.
- `acf/video` → `core/video` / `core/embed` with custom preview.

Sub-total: ~12d.

**Batch 4: Content / query blocks (3d each)**
- `acf/cards` → split into `edwp/cards` + `edwp/query-cards`.
- `acf/authors` → `core/query` + custom `edwp/author` component.
- `acf/post-meta` → core `core/post-*` blocks + custom `edwp/read-time`.
- `acf/testimonials-block` → `edwp/testimonial` + patterns.
- `acf/stats` → `edwp/stat` component + columns.

Sub-total: ~15d.

**Batch 5: Domain-specific blocks (2–3d each)**
- `acf/breadcrumbs` → custom native block (keeps existing logic, drops RM).
- `acf/contact-details` → custom native block.
- `acf/form-block` / `acf/newsletter-signup` → consolidated into one form-embed block.
- `acf/map` → custom native block with Google Maps.
- `acf/menu` → `core/navigation` + patterns.
- `acf/socials` → `core/social-links` + custom sharing block.
- `acf/logos` → custom block with CSS scroll-snap.
- `acf/image` → custom block (for multi-breakpoint sources).
- `acf/global-block` → replaced by core synced patterns.
- `acf/style-config` → finish or delete.

Sub-total: ~22d.

**Components** (done as needed alongside blocks that use them):
- Button, Card, CardPerson, Heading, Paragraph, Author, Stat, Tag, Testimonial, Toggle — most are replaced by core blocks or small `edwp/*` components.

**Total Phase 4**: ~65 days + QA. This is the single largest item in the roadmap.

**Exit criteria**: All blocks and components running on native WordPress. Tests updated. Visual regression suite green against a reference site snapshot.

## Phase 5 — ACF removal + data migration

**Goal**: Remove ACF Pro. Cannot happen before Phase 4 completes.

| Task | Effort |
|---|---|
| Write WP-CLI migration command: parse `post_content`, convert `acf/*` block markers to native block markers | 5d |
| Write WP-CLI migration command for theme options → `register_setting` values | 2d |
| Write WP-CLI migration command for CPT meta → `register_post_meta` values | 2d |
| Per-site data migration execution + QA | 2d × number of live sites |
| Remove ACF Pro from composer.json | 0.1d |
| Remove `stoutlogic/acf-builder` | (included above) |
| Delete `inc/ACF.php`, `inc/ACF/Post.php`, `inc/ACF/ThemeOptions.php`, `inc/Globals/FieldGroups.php` | 0.5d |
| Delete `inc/WPML.php` (becomes obsolete) | 0.1d |
| Delete `inc/RankMath.php` excerpt-fix (becomes obsolete) | 0.1d |
| Scrub all `get_field()` / `get_fields()` calls — replace with native equivalents | 2d |
| Scrub all `acf_*` function calls | 1d |

**Total (one site)**: ~12.5 days + 2d per live site for the migration itself.

**Exit criteria**: ACF Pro uninstalled from at least one live site without data loss. Site renders identically to pre-migration.

## Phase 6 — Dependency removals

**Goal**: Remove Rank Math, WPMDB Pro, and make Gravity Forms / WPML optional.

| Task | Ref | Effort |
|---|---|---|
| Write in-theme SEO module (meta tags, JSON-LD schema, robots, sitemap) | [02 RANKMATH-01](/reports/theme-only-audit-2/02-non-native-apis#rank-math-dependencies) | 3d |
| Per-site Rank Math → native SEO migration + QA | 2d × live sites |
| Remove Rank Math from composer.json | 0.1d |
| Install Redirection plugin (replaces Rank Math redirects) | 0.1d |
| Migrate Rank Math redirects → Redirection plugin DB | 0.5d |
| Remove WPMDB Pro from starter composer.json | 0.1d |
| Document WP-CLI DB workflow in README | 0.5d |
| Guard all Gravity Forms usages behind `class_exists('\GFAPI')` | 1d |
| Remove Gravity Forms as hard dep in starter composer.json | 0.1d |
| Guard all WPML usages behind `defined('ICL_SITEPRESS_VERSION')` | 0.5d |
| Remove WPML `is_plugin_active` hard-wire from `functions.php` | 0.1d |
| Consider Swiper → CSS scroll-snap or lazy-import per block | [02 SWIPER-02](/reports/theme-only-audit-2/02-non-native-apis#swiper) | 2d |
| Consider removing jQuery from FormBlock | [02 JQUERY-01](/reports/theme-only-audit-2/02-non-native-apis#jquery) | 0.25d |

**Total**: ~10 days + 2d per live site for Rank Math migration.

**Exit criteria**: Rank Math uninstalled. WPMDB Pro optional. Gravity Forms / WPML optional per project.

## Phase 7 — Plugin extraction

**Goal**: Extract the reusable subsystems into standalone GitHub repos + Composer packages per [07](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction).

### Preconditions

Phase 7 uses Composer VCS as the distribution mechanism — the same general territory as [Roots Bedrock](https://roots.io/bedrock/), which the team had prior difficulty with. Before Phase 7 begins, complete the DX investment tasks below. **These are not optional.** Without them, Phase 7 risks replaying whatever failure caused the Bedrock friction.

| Precondition task | Ref | Effort |
|---|---|---|
| Run a Bedrock / Composer retrospective, capture findings in a 1-page doc | [07 DX-01](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#dx-01--bedrock--composer-retrospective-precondition) | 1d |
| Extend `setup/create.sh` to write Composer VCS entries + auth scaffolding | [07 DX-02](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#dx-02--starter-setup-script-writes-composer-vcs-entries) | 1d |
| Write `docs/COMPOSER-ONBOARDING.md` (first-time setup + top-10 errors) | [07 DX-03](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#dx-03--composer-onboarding-documentation) | 1d |
| Add Makefile shortcuts (`make edwp-add`, `edwp-update`, `edwp-status`) | [07 DX-04](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#dx-04--makefile-shortcuts) | 0.5d |
| Commit `.github/workflows/composer.yml` template | [07 DX-05](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#dx-05--client-repo-ci-workflow-template) | 1d |
| Budget for paired onboarding of the first developer per consuming project | [07 DX-06](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#dx-06--paired-onboarding-for-the-first-consuming-project) | 0.5d × per developer |

**Precondition total**: ~4.5 engineer-days of DX investment before any extraction work begins.

### Extraction tasks

| Plugin / library | Effort | Ref |
|---|---|---|
| `edwp/wp-block-kit` library | 3d | Already done in Phase 3 |
| `edwp/wp-theme-render` library | 2d | [07 REUSE-LIB-RENDER](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-library-catalogue) |
| `edwp/wp-svg-sprite` library | 2d | [07 REUSE-LIB-SVG](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-library-catalogue) |
| `edwp/wp-theme-utils` library | 1d | [07 REUSE-LIB-UTILS](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-library-catalogue) |
| `edwp-core` MU plugin (media hardening + SVG) | 3d | [07 REUSE-EXTRACT-CORE](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-plugin-catalogue) |
| `edwp-admin` plugin (login branding + widgets) | 2d | [07 REUSE-EXTRACT-ADMIN](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-plugin-catalogue) |
| `edwp-site-options` plugin | 5d | [07 REUSE-EXTRACT-SITE-OPTIONS](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-plugin-catalogue) |
| `edwp-modals` plugin | 5d | [07 REUSE-EXTRACT-MODALS](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-plugin-catalogue) |
| `edwp-people` plugin | 2d | [07 REUSE-EXTRACT-PEOPLE](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-plugin-catalogue) |
| `edwp-testimonials` plugin | 2d | [07 REUSE-EXTRACT-TESTIMONIALS](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-plugin-catalogue) |
| `edwp-gravityforms-styling` plugin | 1d | [07 REUSE-EXTRACT-GF](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-plugin-catalogue) |
| `edwp-classic-editor` plugin | 1.5d | [07 REUSE-EXTRACT-CLASSIC](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#candidate-plugin-catalogue) |
| Set up GitHub repos + Composer VCS config in starter | 1d | [07 DIST-01](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#distribution-strategy) |
| CI release automation per repo (version-from-tag) | 1d per repo × ~10 repos | [07 DIST-02](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction#distribution-strategy) |
| Update theme to consume the extracted plugins | 2d |

**Total**: ~40 days (extraction work) + ~4.5 days (DX preconditions) = **~44.5 days**.

### Decision gate before entering Phase 7

Given the prior Bedrock friction, the team should have a **go/no-go decision point** after Phase 6 completes and the DX preconditions land. At that point:

- 2–3 client sites are running the native-first architecture (Phases 3–5 complete).
- The Composer surface has been shrunk by Phase 6 (Rank Math, WPMDB, ACF, acf-builder, jjgrainger/posttypes all gone).
- The team's confidence with the leaner Composer setup is re-established.

If after that the team is uncertain about adding ~10 Composer VCS packages, the correct posture is to **defer Phase 7 indefinitely** and continue running the starter as a clone-per-project template. The value of Phases 0–6 stands on its own. Phase 7 is an optimisation, not a requirement.

**Exit criteria**: Starter template's `inc/` directory slimmed by ~50%. Each plugin independently taggable + consumable via Composer VCS. Hook-reference docs updated for each extracted surface.

## Phase 8 — Parent-theme evaluation (optional)

**Goal**: Evaluate whether the starter should become a parent theme (child themes per client) vs remaining a clone-per-project starter.

| Task | Effort |
|---|---|
| Review outcomes from Phases 3–7 across 3+ client projects | 2d |
| Prototype child-theme approach on one project | 5d |
| Compare: maintenance burden vs fork-delta burden | 1d |
| Decide and document | 1d |

**Total**: ~9 days.

**Recommendation**: Defer until Phase 7 has landed across 3–5 live projects. Don't commit to parent-theme architecture until you have real evidence the upstream-change cadence would benefit from it.

## Total effort

| Phase | Engineer-days | Calendar (1.5× buffer) |
|---|---:|---:|
| 0 — Security quick wins | 2.25 | ~4 days |
| 1 — Correctness + hygiene | 14.5 | ~3 weeks |
| 2 — Performance | 7 | ~1.5 weeks |
| 2.5 — Hookability | 5.75 | ~1.5 weeks |
| 3 — Block-kit + reference block | 8.5 | ~2 weeks |
| 4 — Block-by-block migration | 65 | ~3 months |
| 5 — ACF removal + data migration (per site) | 12.5 + 2/site | +1 week per site |
| 6 — Dependency removals | 10 + 2/site | +~1 week per site |
| 7 — Plugin extraction (incl. ~4.5d DX preconditions) | 44.5 | ~2 months |
| 8 — Parent-theme evaluation (optional) | 9 | ~2 weeks |

**Grand total (one representative site, excluding Phase 8)**: ~170 engineer-days ≈ **8 months of one-developer calendar time**, or roughly **4 months with two developers**.

**Phases 0–6 alone** (security + correctness + performance + hookability + native migration + dependency removals) cover ~125 engineer-days / ~6 months single-developer calendar time. This is the **minimum viable native-first migration** and can land without any Phase 7 commitment. If the team never does Phase 7, Phases 0–6 still deliver the vast majority of the audit's value.

**For a starter template + 5 client sites**: add ~20 days (4/site × 5) for Phases 5 and 6 data/config migration per site. Total ~185 engineer-days.

## Dependencies graph

```
 Phase 0 ──────────────────────────────┐
                                       │
 Phase 1 ──────┬── Phase 2.5 ── Phase 3 ── Phase 4 ── Phase 5 ── Phase 6
              │                                                │
              └── Phase 2 ───────────────────────────────────────┘
                                                                │
                                                          Phase 7 ── Phase 8
```

- Phase 0 is a hard blocker nobody should start Phase 1 without finishing.
- Phase 1 and Phase 2 are parallel-compatible. Can be assigned to different developers.
- Phase 2.5 requires Phase 1 (service-locator refactor creates the bootstrap seam for hook registration).
- Phase 3 requires Phase 2.5 (block-kit consumes the hook surface).
- Phase 4 requires Phase 3 (block-kit must exist before block migration).
- Phase 5 (ACF removal) requires Phase 4 complete (can't remove ACF until all blocks are off it).
- Phase 6 can run partially in parallel with Phase 5 but is cleanest after.
- Phase 7 requires Phase 6 (extracted plugins shouldn't carry ACF / Rank Math dependencies).

## Recommended order of client rollout

Rolling changes to live client sites:

1. **Phase 0 + Phase 1 + Phase 2**: roll out to all live sites immediately. Low-risk security and perf wins.
2. **Phase 2.5**: roll to the starter template only. No live-site impact.
3. **Phase 3 + Phase 4 + Phase 5**: roll to **one pilot site**. Use this site to validate the migration runbook. Keep for 4–8 weeks post-launch to catch any edge cases missed in QA.
4. **After pilot validates**: schedule Phases 3–5 for each additional site, one at a time, on its own maintenance window. Budget ~1 week of calendar time per site.
5. **Phase 6**: can happen alongside Phases 3–5, site-by-site, because it's independent.
6. **Phase 7**: refactoring for internal engineering. No client-visible impact. Do it once the starter template has been through Phases 3–6 at least once.

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| ACF data migration loses content | Medium | High | Dry-run against a staging snapshot per site. Keep ACF installed as fallback during rollback window. |
| Third-party plugin incompatibility with native blocks | Medium | Medium | Smoke-test core + popular plugins against the migrated theme before cutover. |
| Gutenberg updates change APIs mid-migration | Low | Low | WP core BC promise is strong. Pin to a known WP version in composer for the duration. |
| Authoring UX regression (editors don't like native blocks vs ACF) | High | Medium | Run editor training sessions before cutover. Document the authoring changes. Expect short-term complaints. |
| Rank Math removal loses SEO data | Low | High | Export all meta tags / redirects before uninstall. Verify in SERP / crawl-report comparisons post-launch. |
| Swiper → CSS scroll-snap change degrades UX on some carousels | Low | Low | Fall back to Swiper lazy-import for edge cases. |
| Block-kit abstraction leaks: some blocks need escape hatches | Medium | Low | Design the base class with an `override_render()` hook for edge cases. |

Next: [00 — Summary](/reports/theme-only-audit-2/00-summary)
