---
title: Reusability and plugin extraction
description: Hook surface, candidate plugins and libraries, distribution via Composer VCS, and DX guardrails.
---

# 07 — Reusability and plugin extraction

This document covers the question: **how does this theme become a platform that can be applied across multiple client projects, and which parts should live in standalone plugins or libraries?**

The recommendations here assume the direction agreed in [00 — Summary](/reports/theme-only-audit-2/00-summary): native-first, ACF-free, with an explicit hook surface for extensibility. If you keep ACF, most of the extraction analysis still applies but some plugins gain ACF dependencies.

The distribution model is **individual GitHub repositories referenced via Composer VCS repositories** in each client's `composer.json` — not a hosted Packagist.

## Contents

- [Coupling audit: what's presentation vs what's behaviour](#coupling-audit)
- [The hook-first contract](#the-hook-first-contract)
- [Proposed hook surface](#proposed-hook-surface)
- [Block Bindings + `theme.json` filtering](#block-bindings--themejson-filtering)
- [Candidate plugin catalogue](#candidate-plugin-catalogue)
- [Candidate library catalogue](#candidate-library-catalogue)
- [What stays in the theme](#what-stays-in-the-theme)
- [Distribution strategy](#distribution-strategy)
- [Starter-template vs parent-theme evolution](#starter-template-vs-parent-theme-evolution)
- [Guardrails](#guardrails)
- [Findings summary](#findings-summary)

## Coupling audit

For each subsystem, we answer: **which presentation choices does it make, which behaviour does it encode, and how could it be decoupled?**

| Subsystem | File(s) | Presentation coupling | Behaviour coupling | Verdict |
|---|---|---|---|---|
| Theme setup | `inc/Setup.php` `afterThemeSetup()`, `registerNavMenus()`, `addImageSizes()` | Nav menu slugs + image sizes | `add_theme_support`, `load_theme_textdomain`, disable emoji/xmlrpc | **Stay in theme** — these are intrinsically theme-scoped |
| Enqueue pipeline | `inc/Setup.php::enqueueScripts/enqueueAdminScripts`, `Admin::enqueueAdminScripts/enqueueBlockEditorStyles` | Asset paths + handles | Strategy choices, dashicons removal | **Stay in theme** but hookable; see hook-surface below |
| GTM + site scripts | `inc/Setup.php::addGtmTo…`, `addSiteScriptsTo…` | None | ACF option read → inline `<script>` output | **Extract → `edwp-site-options`** (see catalogue) |
| Login branding | `inc/Admin.php::changeLogo/loginTitle/loginMessage/loginLinkUrl/loginLinkTitle` | Logo path assumes theme dist | Admin login customisation | **Extract → `edwp-admin`** (theme overrides logo path) |
| Dashboard widget removal | `inc/Admin.php::removeDashboardWidgets` | None | Removes specific widget IDs | **Extract → `edwp-admin`** |
| Comments removal | `inc/Admin.php::removeCommentsAdminMenu/removeCommentsMenuBar` | None | Removes comments UI | **Extract → `edwp-admin`** |
| Core update notice gating | `inc/Admin.php::hideUpdateNoticeToAllButAdmin` | None | Capability-gated admin notice removal | **Extract → `edwp-admin`** |
| Block library CSS removal | `inc/Admin.php::removeBlockStyles` | None (but opinionated) | Dequeues `wp-block-library` | **Stay in theme** — too style-coupled |
| Modals | `inc/Modals.php` + `partials/global/modal.php` + `assets/js/modal.js` + `assets/scss/modal…` | Modal markup template, SCSS | Data-driven from ACF options; already has filters | **Extract → `edwp-modals`** (theme overrides template) |
| Ajax handler | `inc/Ajax.php` | None | Empty newsletter handler | **Stay in theme** currently — too scaffolding |
| Block shell | Every `inc/Blocks/*.php`, every `inc/Components/*.php` | Heavy — SCSS / templates / icon classes | Identical ~80-line shell everywhere | **Extract → `edwp/wp-block-kit`** (library) |
| `Render::partial` + `Render::block` | `inc/Render.php` | None | Template loader + block renderer | **Extract → `edwp/wp-theme-render`** (library, after bug fixes) or **drop** in favour of `get_template_part` |
| SVG helpers | `inc/Svg.php` | `dist/images/…/*.svg` path | Icon registration + sprite injection | **Extract → `edwp/wp-svg-sprite`** (library) |
| Helpers | `inc/Helpers.php` | Some (link / image wrappers assume theme conventions) | Generic utilities (trim, phone, email, YouTube/Vimeo URL parsing) | **Split**: generic → `edwp/wp-theme-utils` (library); theme-specific → stay in theme |
| TinyMCE | `inc/TinyMCE.php` | Style dropdown choices / button classes | TinyMCE integration | **Extract → `edwp-classic-editor`** (optional plugin) — only relevant to sites using classic editor |
| Gravity Forms glue | `inc/GravityForms.php` | Button classes | GF filter hooks | **Extract → `edwp-gravityforms-styling`** (optional plugin) |
| Rank Math glue | `inc/RankMath.php` | None | RM-specific block-JSON parsing | **Extract → `edwp-rankmath-acf-compat`** (optional plugin) — becomes obsolete post-migration |
| WPML glue | `inc/WPML.php` | None | ACFML replacement filter | **Extract → `edwp-wpml-acf-compat`** (optional plugin) — becomes obsolete post-migration |
| Media hardening | `inc/Media.php::set404/redirectCanonical/changeAttachmentLink/uniqueSlug` | None | Attachment → 404 redirect; UUIDv4 slug gen | **Extract → `edwp-core`** (MU plugin) |
| SVG upload mime | `inc/Svg.php::uploadsMimes/fixThumbs` | None | Enable SVG upload (dangerous — see [04](/reports/theme-only-audit-2/04-security)) | **Extract → `edwp-core`** with sanitizer — optional, gated by env config |
| Filters (mega-menu, password form, etc.) | `inc/Filters.php` | Heavy — mega-menu HTML structure, password form classes | Menu walker, password-form override | **Stay in theme** — all presentation-coupled |
| Patterns | `inc/Patterns.php` + `patterns/**/*.html` | Heavy — pattern HTML | `register_block_pattern` | **Stay in theme** |
| Post types — `GlobalBlock` | `inc/PostTypes/GlobalBlock.php` + `inc/Blocks/GlobalBlock/` | Block markup | Custom post type + reusable block system | **Replace with native `core/block`** (Synced Patterns) — drop extraction candidate entirely |
| Post types — `Person` | `inc/PostTypes/Person.php` | Archive template (not in this dir) | Person CPT, capabilities, REST query filter | **Extract → `edwp-people`** (optional plugin) — cross-project use |
| Post types — `Testimonial` | `inc/PostTypes/Testimonial.php` | Template (not in this dir) | Testimonial CPT | **Extract → `edwp-testimonials`** (optional plugin) — cross-project use |
| Post types — `CaseStudy` | `inc/PostTypes/CaseStudy.php` | Archive + single template | Project-specific CPT | **Stay in project** — not a starter-template item |
| Taxonomies — `RelatedService` | `inc/Taxonomies/RelatedService.php` | None | Project-specific taxonomy | **Stay in project** |

### Summary

- **5 MU-plugin / standard plugin extractions**: `edwp-core`, `edwp-admin`, `edwp-site-options`, `edwp-modals`, and per-CPT plugins for reusable CPTs (`edwp-people`, `edwp-testimonials`).
- **4 Composer library extractions**: `edwp/wp-block-kit`, `edwp/wp-theme-render`, `edwp/wp-svg-sprite`, `edwp/wp-theme-utils`.
- **4 optional compat plugins**: `edwp-gravityforms-styling`, `edwp-rankmath-acf-compat` (goes away post-migration), `edwp-wpml-acf-compat` (goes away post-migration), `edwp-classic-editor`.

After extraction the theme drops from ~40 PHP files in `inc/` to a leaner ~20: the block/component wrappers (using `edwp/wp-block-kit`), the Patterns registrar, the Filters (mega-menu / password form), project-specific CPTs, and the template layer. The presentation-specific code stays; the reusable scaffolding moves out.

## The hook-first contract

Three principles:

### 1. Expose filters for data, actions for side effects

- `apply_filters('edwp/block/cards/args', $args, $block)` before rendering — consumers adjust data.
- `do_action('edwp/modal/before_render', $modal, $args)` at rendering boundaries — consumers attach logging / telemetry / markup injection.

### 2. Hook at module boundaries, not every line

Rule: a hook exists where a downstream plugin could reasonably want to change behaviour. A hook does **not** exist just because "it might be useful".

### 3. Use core hooks first

Where WP core already has a hook for a thing, use it:

- `render_block_{$block_type}` — per-block output modification.
- `block_type_metadata` / `block_type_metadata_settings` — block registration metadata.
- `wp_theme_json_data_theme` / `_user` / `_blocks` / `_default` — theme.json modification.
- `register_block_bindings_source` — data sources for block attributes.
- `script_loader_tag` / `style_loader_tag` — asset tag output.
- `get_template_part` / `get_template_part_{$slug}` — template part lifecycle.
- `rest_prepare_{$post_type}` / `rest_{$post_type}_query` — REST output shaping.

Custom hooks only wrap **theme-specific concepts** — a cards block's classes, a modal's cookie config, a site-options key. Cross-ref [02 NATIVE-HOOKS-01](/reports/theme-only-audit-2/02-non-native-apis#guiding-principle-prefer-core-hooks-over-custom).

## Proposed hook surface

Full inventory. Signatures and docblocks would be added as part of implementation.

### Theme setup

```php
edwp/setup/image_sizes              filter: array $sizes
edwp/setup/nav_menus                filter: array $menus
edwp/setup/theme_features           filter: array $features
edwp/setup/after_theme_setup        action:
```

### Enqueue

```php
edwp/enqueue/front_deps             filter: array $deps, string $handle
edwp/enqueue/front_localize         filter: array $data, string $handle
edwp/enqueue/admin_deps             filter: array $deps, string $handle
edwp/enqueue/before_front           action:
edwp/enqueue/after_front            action:
```

### Settings (replaces `get_field('foo', 'option')`)

```php
edwp/setting/{key}                  filter: mixed $value, string $key, mixed $default
edwp/settings/all                   filter: array $settings
```

### theme.json tokens

```php
edwp/theme_json/palette             filter: array $palette
edwp/theme_json/spacing             filter: array $spacing_scale
edwp/theme_json/typography          filter: array $typography_config
edwp/theme_json/style_variations    filter: array $variations
```

These wrap core's `wp_theme_json_data_theme` filter with per-token granularity.

### Block rendering (per native block)

```php
edwp/block/{slug}/args              filter: array $args, WP_Block $block
edwp/block/{slug}/classes           filter: string $classes, array $args
edwp/block/{slug}/template_path     filter: string $path, array $args
edwp/block/{slug}/context           filter: array $context, WP_Block $block
edwp/block/{slug}/before_render     action: array $args, WP_Block $block
edwp/block/{slug}/after_render      action: array $args, WP_Block $block
```

All six are implemented once in `AbstractBlock::renderBlock()` — every block inherits them.

### Block Bindings

```php
edwp/bindings/source_{name}         filter: callback for the source's get_value
edwp/bindings/registered_sources    filter: array of registered sources
```

### Modals

```php
edwp/modal/items                    filter: array $modals (before display-condition filtering)
edwp/modal/should_display           filter: bool $should_display, array $modal, string $display_on
edwp/modal/classes                  filter: array $classes, array $modal, string $modal_id
edwp/modal/args                     filter: array $template_args, array $modal, int $index
edwp/modal/cookie_config            filter: array $cookie_config
edwp/modal/before_render            action: array $modal, array $args
edwp/modal/after_render             action: array $modal, array $args
```

### Navigation

```php
edwp/nav/header_menu_args           filter: array $args
edwp/nav/mega_menu_data             filter: array $mega_menu, object $menu_item
edwp/nav/menu_item_classes          filter: array $classes, object $item, object $args
```

### Media

```php
edwp/media/svg_allowed              filter: bool $allowed
edwp/media/svg_sanitizer_config     filter: array $config
edwp/media/attachment_404_enabled   filter: bool $enabled
```

### Site scripts

```php
edwp/scripts/items                  filter: array $scripts
edwp/scripts/allowed_locations      filter: array $locations ['head', 'body', 'footer']
edwp/scripts/render                 filter: string $rendered_tag, array $script
edwp/scripts/before_output          action: string $location
edwp/scripts/after_output           action: string $location
```

### SEO (post-Rank-Math migration)

```php
edwp/seo/schema                     filter: array $schema_data
edwp/seo/meta_description           filter: string $description
edwp/seo/canonical                  filter: string $canonical_url
edwp/seo/robots                     filter: string $robots_directive
edwp/seo/before_head                action:
edwp/seo/after_head                 action:
```

### Template parts

```php
edwp/template/part_path             filter: string $path, string $slug, string $name
edwp/template/part_args             filter: array $args, string $slug, string $name
edwp/template/before_part           action: string $slug, string $name, array $args
edwp/template/after_part            action: string $slug, string $name, array $args
```

### Effort

Adding this surface to the current code is a **Phase 2.5** pass in [08](/reports/theme-only-audit-2/08-roadmap): purely additive (no existing behaviour changes), runs in parallel with the native-block migration prep work. Expected effort: 3–5 engineer-days to add the filters with proper docblocks, plus 1–2 days to write the "hook reference" doc for downstream plugin authors.

## Block Bindings + theme.json filtering

The killer combination for data-driven block themes without ACF:

### Register a theme-level binding source

```php
// inc/Bindings.php (new)
namespace EDWP;

class Bindings {
    public function __construct() {
        add_action('init', [$this, 'register']);
    }

    public function register(): void {
        register_block_bindings_source('edwp/setting', [
            'label'              => __('Theme Setting', 'edwp'),
            'get_value_callback' => [$this, 'get_value'],
        ]);
    }

    public function get_value(array $args, $block, string $attribute): string {
        $key = $args['key'] ?? '';
        if (!$key) {
            return '';
        }
        $default = $args['default'] ?? '';
        $value = get_option("edwp_{$key}", $default);
        return (string) apply_filters("edwp/setting/{$key}", $value, $block, $attribute);
    }
}
```

### Use from a pattern

```html
<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"edwp/setting","args":{"key":"tagline"}}}}} -->
<p></p>
<!-- /wp:paragraph -->
```

### Plugin that swaps the source

```php
// Any plugin can override the value for a specific key:
add_filter('edwp/setting/tagline', function ($value) {
    return get_user_meta(get_current_user_id(), 'custom_tagline', true) ?: $value;
});
```

### theme.json dynamic palette

```php
add_filter('wp_theme_json_data_theme', function (WP_Theme_JSON_Data $data) {
    $palette = apply_filters('edwp/theme_json/palette', $data->get_data()['settings']['color']['palette'] ?? []);
    return $data->update_with([
        'version'  => 3,
        'settings' => ['color' => ['palette' => $palette]],
    ]);
});
```

Any plugin can inject palette entries by filtering `edwp/theme_json/palette` — no edits to `theme.json` needed. This is how per-client brand palettes can live in their own plugin.

## Candidate plugin catalogue

For each candidate, the essential specification:

### `edwp-core` (MU plugin)

- **Purpose**: Admin/media hardening + SVG safe-upload + 404/UUID attachment handling.
- **Public hooks**: `edwp/media/svg_allowed`, `edwp/media/svg_sanitizer_config`, `edwp/media/attachment_404_enabled`.
- **Data**: None.
- **Dependencies**: `enshrined/svg-sanitizer` (Composer).
- **Extracted from**: `inc/Media.php` + `inc/Svg.php::uploadsMimes/fixThumbs` + portions of `inc/Admin.php` not login-branded.
- **Effort**: ~3 days (ports existing code, fixes SEC-SVG-01, wires hooks).
- **Distribution**: GitHub repo `edwp/edwp-core-mu`. Consumed as MU plugin dropped into `wp-content/mu-plugins/edwp-core/`.

### `edwp-admin`

- **Purpose**: Login-page branding, dashboard widget trimming, comments removal, core-update notice gating.
- **Public hooks**: `edwp/admin/login_logo_url`, `edwp/admin/dashboard_widgets_to_remove`, `edwp/admin/comments_enabled`.
- **Data**: A small options table for the logo URL (or binding to a core image ID).
- **Dependencies**: None beyond WP.
- **Extracted from**: `inc/Admin.php` login + dashboard + comments + update-notice methods.
- **Effort**: ~2 days.
- **Distribution**: GitHub repo `edwp/edwp-admin`. Composer-VCS required.

### `edwp-site-options`

- **Purpose**: GTM injection + arbitrary site-scripts injection + central site-options page.
- **Public hooks**: `edwp/scripts/items`, `edwp/scripts/allowed_locations`, `edwp/scripts/render`, `edwp/gtm/id`, `edwp/setting/{key}`.
- **Data**: Core options via Settings API. Integrations (GTM, GA4, FB Pixel) stored as discrete options, not a blob.
- **Dependencies**: None.
- **Extracted from**: `inc/Setup.php::addGtmTo…`, `addSiteScriptsTo…`, `inc/ACF/ThemeOptions.php` Advanced tab + Site Scripts tab.
- **Security**: Structured integrations instead of arbitrary-HTML paste; see [04 SEC-SITESCRIPTS-01](/reports/theme-only-audit-2/04-security#site-scripts-injection-from-theme-options).
- **Effort**: ~5 days (includes the security rewrite).
- **Distribution**: GitHub repo `edwp/edwp-site-options`.

### `edwp-modals`

- **Purpose**: Global modal system — data-driven modals rendered in footer.
- **Public hooks**: Already has `edwp_all_modals`, `edwp_should_modal_display`, `edwp_modal_classes`, `edwp_modal_args`. Rename to `edwp/modal/*` convention.
- **Data**: Custom post type `edwp_modal` with `register_post_meta` for display conditions, cookie settings, etc.
- **Dependencies**: None. Provides a filter `edwp/modal/template_path` so the theme can override the modal partial.
- **Extracted from**: `inc/Modals.php` + `partials/global/modal.php` + `assets/js/modal.js` + modal SCSS.
- **Template override**: Plugin ships a default `templates/modal.php`; theme can override by placing `templates/edwp-modal.php` in theme root, checked via `locate_template()`.
- **Effort**: ~5 days (includes ACF → post-meta migration for modal data).
- **Distribution**: GitHub repo `edwp/edwp-modals`.

### `edwp-people` (optional)

- **Purpose**: `person` CPT, capabilities, REST hooks.
- **Public hooks**: `edwp/people/supports`, `edwp/people/capabilities`, `edwp/people/rest_query_args`.
- **Data**: `register_post_meta` for `job_title`, `company`, `email_address`, `twitter_url`, `linkedin_url`, `disable_single`, `hide_from_people_section`.
- **Dependencies**: None.
- **Extracted from**: `inc/PostTypes/Person.php`.
- **Native migration impact**: After ACF removal, meta is registered natively and surfaces in Gutenberg sidebar automatically.
- **Effort**: ~2 days.
- **Distribution**: GitHub repo `edwp/edwp-people`.

### `edwp-testimonials` (optional)

- **Purpose**: `testimonial` CPT + testimonial REST exposure.
- **Public hooks**: `edwp/testimonials/supports`, `edwp/testimonials/capabilities`.
- **Data**: Post meta for `quote`, `cite`, `cite_job_title`, `cite_company`, `quote_company_logo`, `cite_image`.
- **Dependencies**: None.
- **Extracted from**: `inc/PostTypes/Testimonial.php`.
- **Effort**: ~2 days.
- **Distribution**: GitHub repo `edwp/edwp-testimonials`.

### `edwp-gravityforms-styling` (optional)

- **Purpose**: Apply EDWP button classes to Gravity Forms.
- **Public hooks**: `edwp/gf/button_classes_primary`, `edwp/gf/button_classes_secondary`, `edwp/gf/disable_css`.
- **Dependencies**: Gravity Forms (runtime; guarded).
- **Extracted from**: `inc/GravityForms.php`.
- **Effort**: ~1 day.

### `edwp-classic-editor` (optional)

- **Purpose**: Classic editor (TinyMCE) customisations.
- **Public hooks**: `edwp/tinymce/style_formats`, `edwp/tinymce/block_formats`.
- **Dependencies**: None (filters no-op if classic editor not used).
- **Extracted from**: `inc/TinyMCE.php`.
- **Effort**: ~1.5 days.

### `edwp-rankmath-acf-compat` (short-lived)

- **Purpose**: Rank Math excerpt fix for ACF blocks.
- **Lifetime**: Until ACF migration completes; deleted thereafter.
- **Extracted from**: `inc/RankMath.php`.

### `edwp-wpml-acf-compat` (short-lived)

- **Purpose**: WPML's `wpml_found_strings_in_block` filter replacement for ACF blocks.
- **Lifetime**: Until ACF migration completes; deleted thereafter.
- **Extracted from**: `inc/WPML.php`.

## Candidate library catalogue

Libraries are Composer packages with autoloader-only distribution — no plugin file, just PHP classes. Used by themes or plugins via `composer require`.

### `edwp/wp-block-kit`

- **Purpose**: Abstract base class for native WordPress custom blocks. Handles registration, asset registration, render callback dispatch, parent-block context inheritance, template loading.
- **Class**: `EDWP\BlockKit\AbstractBlock` (namespace).
- **Key methods**:
  - `abstract public function get_slug(): string;`
  - `abstract public function get_default_args(): array;`
  - `public function render_callback(array $attributes, string $content, WP_Block $block): string;`
  - `protected function filter_args(array $args, WP_Block $block): array;`
  - `protected function load_template(array $args): string;`
- **Hooks**: implements the six `edwp/block/{slug}/*` hooks for every subclass.
- **Effort**: ~3 days (core class + tests).
- **Distribution**: GitHub repo `edwp/wp-block-kit`. Composer package `edwp/wp-block-kit`.

### `edwp/wp-theme-render`

- **Purpose**: Thin, well-tested replacement for `inc/Render.php::partial` + `::block`, *without* the bugs. Basically a small wrapper around `get_template_part` with an explicit-args contract.
- **Classes**: `EDWP\ThemeRender\Partial`.
- **Hooks**: `edwp/template/part_path`, `edwp/template/part_args`, `edwp/template/before_part`, `edwp/template/after_part`.
- **Effort**: ~2 days.
- **Distribution**: GitHub repo `edwp/wp-theme-render`.

### `edwp/wp-svg-sprite`

- **Purpose**: SVG sprite + icon helpers, safe-by-default. Memoised disk reads, `wp_kses` sanitisation, `<use href>` (non-deprecated) rendering.
- **Classes**: `EDWP\SvgSprite\Icon`, `EDWP\SvgSprite\Inline`.
- **Hooks**: `edwp/svg/allowed_tags`, `edwp/svg/sprite_url`, `edwp/svg/inline_cache_ttl`.
- **Effort**: ~2 days.
- **Distribution**: GitHub repo `edwp/wp-svg-sprite`.

### `edwp/wp-theme-utils`

- **Purpose**: Generic helper utilities: YouTube/Vimeo URL parsing, phone/email formatters, content trimming, UUID v4 generator. Nothing WordPress-specific beyond being a WP-adjacent library.
- **Classes**: `EDWP\ThemeUtils\Helpers`.
- **Hooks**: Minimal — these are static helpers, not hook-points.
- **Effort**: ~1 day (port existing functions; add tests).
- **Distribution**: GitHub repo `edwp/wp-theme-utils`.

## What stays in the theme

Non-extractable (presentation-coupled):

- Template files: `header.php`, `footer.php`, `index.php`, `page.php`, `single.php`, `404.php`, `search.php`, `searchform.php`.
- `partials/global/*` — header, footer, mega-menu, mobile-menu, password-form. (Modal partial extracted.)
- `inc/Setup.php::registerNavMenus`, `addImageSizes`, `enqueueScripts`, `enqueueAdminScripts`, `afterThemeSetup` — theme-scoped.
- `inc/Admin.php::removeBlockStyles`, `enqueueBlockEditorStyles` — theme-coupled.
- `inc/Filters.php` — mega-menu markup, password-form classes — theme-visual.
- `inc/Patterns.php` + `patterns/` — theme's block patterns.
- `inc/Blocks/*` + `inc/Components/*` — theme's block implementations (using `edwp/wp-block-kit`).
- `style.css`, `theme.json`, SCSS, per-block `styles.scss`.
- Project-specific CPTs (`CaseStudy`) + taxonomies (`RelatedService`). Stay in the project repo, not the starter.

## Distribution strategy

### Context: prior Bedrock friction

Before reading this section, note the team's prior difficulty with [Roots Bedrock](https://roots.io/bedrock/) — the specific failure mode was not captured. The Composer VCS extraction model described below operates in the same general territory as Bedrock (Composer as the primary dependency manager for WordPress artefacts). This is the chosen model, but it **must be preceded by a retrospective and paired with first-class DX investment**. Without that, the extraction work risks repeating whatever caused the original friction. The DX investment is sized explicitly below and reflected in [Phase 7 of the roadmap](/reports/theme-only-audit-2/08-roadmap#phase-7--plugin-extraction).

### GitHub + Composer VCS (chosen model)

Each plugin and library is its own GitHub repo. Client projects consume via:

```json
{
    "repositories": [
        { "type": "vcs", "url": "git@github.com:edwp/edwp-modals.git" },
        { "type": "vcs", "url": "git@github.com:edwp/edwp-site-options.git" },
        { "type": "vcs", "url": "git@github.com:edwp/wp-block-kit.git" },
        …
    ],
    "require": {
        "edwp/edwp-modals": "^1.0",
        "edwp/edwp-site-options": "^1.0",
        "edwp/wp-block-kit": "^1.0"
    }
}
```

### Trade-offs of this model vs Satis / private Packagist

Pros:
- No server infrastructure to maintain.
- Free (as long as repos are free / team has GitHub paid).
- Dependency resolution works fine for 10–20 internal packages.

Cons:
- `composer update` is slower: Composer has to fetch git tags from each VCS repo individually.
- No web UI for browsing versions / descriptions.
- Credential setup on each developer machine + each CI (SSH key access or GitHub tokens).
- No automatic security alerts — rely on GitHub Dependabot in each repo individually.

For an agency with ~10 client projects, the pros outweigh. If the count grows past 30, reconsider Satis.

### Release discipline

Without automated tooling, release rigor matters:

- Every repo uses **semantic versioning** with git tags (`v1.0.0`, `v1.1.0`, `v1.1.1`).
- Breaking changes require major-version bump. Document in a `CHANGELOG.md` at the repo root.
- Each repo has a `composer.json` with `"version": "1.0.0"` — not strictly required for VCS repos, but clearer.
- Releases are **tagged commits on `main`** — no separate release branches unless the team chooses.

### Recommended workflow

1. Developer works on `feature/…` branch.
2. Merge to `main` via PR.
3. Version bump + CHANGELOG entry as part of the PR.
4. After merge, tag the commit: `git tag v1.2.3 && git push --tags`.
5. Client project picks up with `composer update edwp/edwp-modals`.

**Finding `DIST-01` (P2, S)** — document this release workflow in each extracted-plugin repo's `CONTRIBUTING.md`.

**Finding `DIST-02` (P2, M)** — add a CI step in each repo to publish `composer.json` version from git tag (so humans don't forget to bump it inline). Tools: [composer-version-from-tag](https://github.com/Roave/ComposerPackageVersionFromTag) or similar.

## DX investment for Composer VCS

Given the prior Bedrock friction, DX is a **first-class deliverable** of Phase 7, not something bolted on afterwards. A Composer VCS model works for teams that have fluent tooling around it, and produces friction for teams that don't. The mitigations below are designed to remove the rough edges before they become a recurring complaint.

### DX-01 — Bedrock / Composer retrospective (precondition)

**Effort**: 0.5–1 engineer-day (facilitated discussion + writeup).
**Before Phase 7 starts.** A one-hour retrospective with the engineers who worked on the Bedrock attempt. Goals:

1. Write down **what specifically broke**: deployment? Host compatibility? `.env` confusion? Directory restructure? Onboarding a new developer? Auth config? DNS of a failing Composer update?
2. Identify which of those failure modes apply to the Composer VCS model and which don't.
3. Write a "what we're doing differently this time" document (1 page).

Without this, the team repeats whichever failure caused the original friction. The specific cause matters less than capturing *something* concrete to avoid.

### DX-02 — Starter setup script writes Composer VCS entries

**Effort**: 1 day.
The current `setup/create.sh` renames the theme for a new project. Extend it to:

1. Write a `repositories` block into the new project's `composer.json` with all EDWP GitHub VCS URLs pre-populated.
2. Drop in a starter `auth.json` with placeholder credentials and a `README` note about where the real values live in 1Password.
3. Write a `.env.example` entry for each paid-plugin licence key.

The goal: a developer cloning the starter runs one command (`make setup`) and has a working `composer install` on first try, with every plugin repo accessible.

### DX-03 — Composer onboarding documentation

**Effort**: 1 day.
A single `docs/COMPOSER-ONBOARDING.md` document at the repo root, structured as:

1. **First-time setup** — SSH key on GitHub, `auth.json` location, 1Password vault, Composer version requirements.
2. **Day-to-day operations** — how to install, update, add a new EDWP package, update WP core, update paid plugins.
3. **Top-10 errors and fixes** — the errors developers *will* hit, with the one-line fix for each:
   - "Failed to download" on private repo → check SSH agent
   - "Your requirements could not be resolved" → explain how to read Composer's error output
   - `auth.json` missing → point to 1Password
   - ACF API key invalid → walk through renewal
   - Etc.
4. **Troubleshooting checklist** — "if Composer is doing something weird, run these 3 commands and paste the output".

This should be written iteratively — when the first developer hits an unfamiliar error, the fix goes into this doc immediately. By month 3 it should cover 90% of incoming support requests.

### DX-04 — Makefile shortcuts

**Effort**: 0.5 day.
The repo already has good `make setup` / `make composer-install` / `make composer-require REQUIRE=foo` commands. Extend with:

- `make edwp-add PLUGIN=edwp-modals` — adds the plugin to `repositories` + runs `composer require`.
- `make edwp-update` — updates all EDWP packages in one command.
- `make edwp-status` — lists installed EDWP versions vs latest published tags.

Wrap unfamiliar Composer commands in familiar `make` targets. Lowers the cognitive load of "what's the Composer syntax again?" to "I know I type `make`".

### DX-05 — Client-repo CI workflow template

**Effort**: 1 day.
A `.github/workflows/composer.yml` template committed to the starter:

- Runs `composer validate --strict` on PRs.
- Runs `composer install --no-dev --optimize-autoloader` to check the install succeeds.
- Runs `composer audit` and fails on HIGH / CRITICAL.
- Caches `vendor/` for speed.

One template, copied into every client repo, works out of the box.

### DX-06 — Paired onboarding for the first consuming project

**Effort**: 0.5 day per new developer, first usage only.
The first developer in each client project to add an EDWP Composer package does so **paired with someone who already has it working**. Pair for 30–60 minutes. Observe which step caused confusion. Update `COMPOSER-ONBOARDING.md` with the fix.

After 2–3 pair sessions, the doc should be good enough for unassisted onboarding.

### Total DX investment

| Task | Effort |
|---|---|
| DX-01 Bedrock retrospective | 0.5–1d |
| DX-02 Setup script | 1d |
| DX-03 Onboarding doc | 1d (initial) + ongoing |
| DX-04 Makefile shortcuts | 0.5d |
| DX-05 CI template | 1d |
| DX-06 Paired onboarding | 0.5d × per new dev (first time) |

**Total (excluding ongoing onboarding)**: ~4–5 engineer-days, spent **before** the first extraction ships.

This is the investment required to avoid replaying the Bedrock experience. It's a small percentage of the Phase 7 total (~40 days), but it's the make-or-break piece.

### Findings

| ID | Title | Severity | Effort |
|---|---|---|---|
| DX-01 | Run a Bedrock / Composer retrospective before Phase 7 | P1 | S |
| DX-02 | Extend `setup/create.sh` to write Composer VCS entries + auth scaffolding | P2 | S |
| DX-03 | Write `docs/COMPOSER-ONBOARDING.md` covering first-time setup + top-10 errors | P1 | S |
| DX-04 | Add Makefile shortcuts for EDWP Composer operations | P2 | S |
| DX-05 | Commit a `.github/workflows/composer.yml` template to the starter | P2 | S |
| DX-06 | Pair on the first extraction consumer per client project | P2 | S |

## Starter-template vs parent-theme evolution

Two models for continuing the starter-template:

### Option A: Clone-per-project starter (current approach)

- Developer runs `setup/create.sh` which clones the starter and renames everything.
- Each client gets a fully-custom theme.
- Extracted plugins are pulled in via Composer VCS.

Pros: Maximum per-client customisation freedom.
Cons: Starter improvements don't back-port to client projects automatically. Upstream changes in the starter need to be manually cherry-picked.

### Option B: Parent-theme with child-theme-per-project

- The starter becomes a packaged parent theme (`edwp/theme-parent`) consumed via Composer.
- Each client gets a thin child theme with only: custom `style.css` header + `Template:` pointing at parent + overrides for specific templates/partials + project-specific blocks.
- Starter improvements auto-propagate via `composer update`.

Pros: Starter improvements flow automatically. Consistent architecture across projects.
Cons: Parent-theme updates can break child themes unexpectedly. Slower iteration velocity (more backward-compatibility pressure on the parent theme). Some design freedom lost.

### My recommendation

**Start with Option A** (current approach) but extract the plugins as above. Once you have 3–5 live projects using the plugins, re-evaluate whether Option B is worth the investment.

Option B requires mature release discipline (semver compliance, deprecation policy, compat layer for old child themes) that agencies commonly don't have bandwidth to maintain. Extracting plugins gets you 70% of the benefit without the governance overhead.

## Guardrails

Rules for extraction to be safe and reversible:

1. **No cross-dep circular calls.** Plugin A calls Theme API → bad. Theme calls Plugin A API → fine.
2. **All plugin-to-theme communication goes through hooks.** No `EDWP\\ModalSystem::doStuff()` across the boundary. Only `apply_filters()` / `do_action()`.
3. **Namespace every plugin.** No `global $foo` vars escaping plugin boundaries.
4. **Every plugin declares its WP + PHP minimums in the plugin header.** Don't rely on the theme having them.
5. **Capability provisioning on activation only.** Plugins that add user capabilities (Person CPT) MUST do so in `register_activation_hook`, never per-request.
6. **Default option autoloading is off** for plugin-added options. Opt in to autoload only for hot-path options (`update_option($key, $value, false)` as the default).
7. **Block and pattern namespacing.** Plugin-registered blocks use plugin-prefixed names (`edwp-modals/modal`, not `acf/modal`). Patterns likewise.
8. **Text domain = plugin slug.** `'edwp-modals'` for the modals plugin — no domain sharing with the theme.
9. **Versioned hook names.** If you need to break a hook signature, add a v2 name (`edwp/v2/modal/args`) and deprecate the v1 with a notice.
10. **Plugins don't enqueue theme assets.** If a plugin needs CSS, ship its own. No `wp_enqueue_style('edwp-core')` from inside a plugin.

## Findings summary

| ID | Title | Severity | Effort |
|---|---|---|---|
| REUSE-HOOK-01 | Add the proposed hook surface (Phase 2.5) | P1 | M |
| REUSE-BINDINGS-01 | Register `edwp/setting` Block Bindings source + `theme_json` filters | P1 | S |
| REUSE-EXTRACT-CORE | Extract `edwp-core` MU plugin | P2 | M |
| REUSE-EXTRACT-ADMIN | Extract `edwp-admin` plugin | P2 | S |
| REUSE-EXTRACT-SITE-OPTIONS | Extract `edwp-site-options` plugin (fixes SEC-SITESCRIPTS-01) | P1 | M |
| REUSE-EXTRACT-MODALS | Extract `edwp-modals` plugin | P2 | M |
| REUSE-EXTRACT-PEOPLE | Extract `edwp-people` plugin | P2 | S |
| REUSE-EXTRACT-TESTIMONIALS | Extract `edwp-testimonials` plugin | P2 | S |
| REUSE-EXTRACT-GF | Extract `edwp-gravityforms-styling` plugin | P2 | S |
| REUSE-EXTRACT-CLASSIC | Extract `edwp-classic-editor` plugin | P2 | S |
| REUSE-LIB-BLOCKKIT | Create `edwp/wp-block-kit` library | P1 | M |
| REUSE-LIB-RENDER | Create `edwp/wp-theme-render` library (replaces `inc/Render.php`) | P1 | S |
| REUSE-LIB-SVG | Create `edwp/wp-svg-sprite` library | P2 | S |
| REUSE-LIB-UTILS | Create `edwp/wp-theme-utils` library | P2 | S |
| DIST-01 | Document release workflow per extracted repo | P2 | S |
| DIST-02 | Automate version bumping from git tag in CI | P2 | M |
| DX-01 | Bedrock / Composer retrospective (precondition) | **P1** | S |
| DX-02 | Starter setup script writes Composer VCS entries + auth scaffolding | P2 | S |
| DX-03 | `docs/COMPOSER-ONBOARDING.md` covering first-time setup + top-10 errors | **P1** | S |
| DX-04 | Makefile shortcuts for EDWP Composer operations | P2 | S |
| DX-05 | `.github/workflows/composer.yml` template in the starter | P2 | S |
| DX-06 | Paired onboarding for first extraction consumer per client project | P2 | S |

Next: [08 — Roadmap](/reports/theme-only-audit-2/08-roadmap)
