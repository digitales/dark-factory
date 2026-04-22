---
title: Conventions and structure
description: Theme layout, classic vs block posture, autoloading, templates, and coding standards.
---

# 01 — Conventions & Structure

This document describes the theme's current shape: how it's organised, which conventions it follows, and where those conventions diverge from WordPress guidance. It contains no performance, security, or dependency findings — those live in [03](/reports/theme-only-audit/03-performance), [04](/reports/theme-only-audit/04-security), and [05](/reports/theme-only-audit/05-dependencies).

All file references are relative to `wordpress/wp-content/themes/theme-only/` unless noted.

## Contents

- [Theme classification](#theme-classification)
- [Directory layout](#directory-layout)
- [Autoloading](#autoloading)
- [style.css and theme.json contracts](#stylecss-and-themejson-contracts)
- [Template hierarchy](#template-hierarchy)
- [Naming and identity](#naming-and-identity)
- [Coding standards (PHP)](#coding-standards-php)
- [Coding standards (CSS/SCSS, JS)](#coding-standards-cssscss-js)
- [Internationalisation (i18n)](#internationalisation-i18n)
- [Findings](#findings)

## Theme classification

This is a **hybrid classic theme** — neither a pure classic theme nor a true block theme:

| Signal | Observation | Implication |
|---|---|---|
| `index.php`, `page.php`, `single.php`, `header.php`, `footer.php`, `404.php`, `search.php`, `searchform.php` | Present; drive rendering via `get_header()` / `the_content()` / `get_footer()` | Classic theme template hierarchy |
| `theme.json` (version 2) | Minimal — declares only palette and layout widths | Block editor reads palette, front-end does not (see below) |
| `Setup::removeGlobalStyles()` (`inc/Setup.php:320-325`) | Removes `wp_enqueue_global_styles` on `init` priority 100 | `theme.json` styling is actively suppressed on the front end; only the admin editor sees it |
| `patterns/` + `Patterns::registerTemplates/Patterns/LayoutPatterns` (`inc/Patterns.php`) | `register_block_pattern` used for homepage/blog templates, cards/CTA blocks, 100/50-50/33-33-33 layout patterns | Some block-theme scaffolding, but no FSE templates (`templates/*.html`) |
| `templates/default.php` (`wordpress/wp-content/themes/theme-only/templates/default.php`) | Single PHP page template, not an HTML block template | Confirms classic template model |
| Post body rendering | Authored almost exclusively through 27 `acf/*` ACF-Pro blocks (`inc/Blocks.php`) | Content is block-serialised in `post_content`, rendered server-side through `acf_rendered_block()` |
| `allowedBlockTypes` filter (`inc/Blocks.php:102-157`) | Returns an explicit allow-list containing 25 `acf/*` blocks + `core/block` only | Core blocks are disabled everywhere except the reusable-block wrapper |
| `register_block_pattern` with `blockTypes: ['core/post-content']` + `postTypes: ['page'/'post']` | Starter patterns for homepage/blog-post templates | Editors get pattern-based starters when creating new posts |

**Implication for the audit:** the theme is positioned somewhere on the spectrum "classic theme with a bolted-on block editor" → "block theme". It does not commit to either model cleanly. This hybrid posture is a root cause for several findings in other documents — most notably that `theme.json` tokens are authored but never applied to the front end ([03 — Performance](/reports/theme-only-audit/03-performance)), and that the `patterns/` scaffolding is undermined by the `allowedBlockTypes` allow-list ([06 — Blocks and components](/reports/theme-only-audit/06-blocks-and-components)).

## Directory layout

```
wordpress/wp-content/themes/theme-only/
├── 404.php, searchform.php, single.php, page.php, index.php, search.php
├── header.php, footer.php
├── style.css                            # Theme stylesheet header only
├── theme.json                           # Minimal v2 global settings
├── screenshot.png
├── composer.json, composer.lock         # Theme-level Composer
├── package.json, pnpm-lock.yaml         # Theme-level npm (pnpm)
├── pnpm-workspace.yaml                  # pnpm workspace config
├── webpack.config.js, webpackAlias.js   # Custom Webpack 5 build
├── phpcs.xml                            # PSR-12 ruleset
├── .eslintrc.js, .stylelintrc.js
├── assets/                              # Source assets
│   ├── fonts/  icons/  img/  js/  scss/
├── inc/                                 # PHP — EDWP\ namespace
│   ├── ACF.php  Admin.php  Ajax.php  Blocks.php  Filters.php
│   ├── GravityForms.php  Helpers.php  Media.php  Modals.php
│   ├── Patterns.php  PostTypes.php  RankMath.php  Render.php
│   ├── Setup.php  Svg.php  TinyMCE.php  WPML.php
│   ├── ACF/           # Post.php, ThemeOptions.php (ACF field definitions)
│   ├── Blocks/        # 27 block folders (one dir per block)
│   ├── Components/    # 11 component folders (same pattern as blocks)
│   ├── Globals/       # FieldGroups.php, Options.php (shared ACF helpers)
│   ├── PostTypes/     # CaseStudy, GlobalBlock, Person, Testimonial
│   └── Taxonomies/    # RelatedService
├── partials/
│   └── global/        # favicons, header, footer, mega-menu, mobile-menu,
│                      #   modal, password-form
├── patterns/
│   ├── blocks/        # block patterns
│   ├── layouts/       # layout patterns
│   └── templates/     # starter templates
└── templates/
    └── default.php    # Sole classic page template
```

Each `inc/Blocks/{Name}/` and `inc/Components/{Name}/` folder has the same internal shape:

```
inc/Blocks/Cards/
├── Cards.php          # Class with identical shell across all 27 blocks
├── block.json         # WP block metadata (category, editorScript, style, acf.blockVersion)
├── template.php       # Rendered HTML template (extract($args) supplied by Render::partial)
├── styles.scss        # Per-block SCSS (webpack discovers it)
└── scripts.js         # Per-block JS (optional; not present for every block)
```

### Observations

- The per-block folder convention is a clean boundary — it maps one block to one folder, with code, template, and styles co-located. This is the single strongest structural decision in the codebase.
- Every block + component PHP file is a **copy-paste of the same 80-line shell** (see `initialiseBlock()`, `filterBlockFields()`, `registerBlock()`, `renderBlock()`, `setupBlockACF()`). This is a `P1 Effort:M` finding covered in [06](/reports/theme-only-audit/06-blocks-and-components) and [07](/reports/theme-only-audit/07-reusability-and-plugin-extraction) — the whole shell belongs in a base class.
- `inc/Globals/` is a sensible name but conflates **two concerns**: ACF field composition (`FieldGroups.php`) and value enumerations / choice lists (`Options.php`). These are different abstractions: one is ACF-specific, the other is domain-data. They should not share a namespace.
- `partials/` vs `templates/` vs `patterns/` vs `inc/Blocks/*/template.php` — the theme has four different places templates can live. The distinction is: `partials/global/` = classic-theme template parts rendered via `Render::partial()`; `templates/` = classic WP `Template Name:` templates; `patterns/*.html` = block-editor pattern files registered by `Patterns.php`; `inc/Blocks/*/template.php` = per-block server-render templates called by `Render::partial()` from inside the block's `render_callback`. The overlap is manageable but worth documenting in the theme README.

## Autoloading

The theme declares a Composer PSR-4 autoloader (`composer.json:57-61`):

```json
"autoload": {
    "psr-4": { "EDWP\\": "inc/" }
}
```

…and then **also registers a hand-rolled SPL autoloader** in `functions.php:11-18`:

```php
spl_autoload_register(function ($classname) {
    $class   = str_replace('\\', DIRECTORY_SEPARATOR, str_replace('_', '-', $classname));
    $classes = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'inc' . DIRECTORY_SEPARATOR . $class . '.php';
    if (file_exists($classes)) {
        require_once $classes;
    }
});
```

This second autoloader is:

1. **Redundant** with Composer's PSR-4 autoloader that's already loaded on the line above (`require_once __DIR__ . '/vendor/autoload.php';`).
2. **Wrong** — the `str_replace('_', '-')` transform replaces underscores with hyphens in class names, which does not match PSR-4 or the on-disk layout (no class in the codebase has an underscore in its name; no file on disk has a hyphen). The autoloader only fires for classes Composer hasn't already resolved, and because all classes in `EDWP\` are PSR-4 under `inc/`, it never actually loads anything. It is dead code sitting at the top of `functions.php`.

**Finding `ARCH-01` (P2, S).** Delete `spl_autoload_register` block from `functions.php`. Rely on Composer's PSR-4.

### `functions.php` side effects

`functions.php:36-52` instantiates every subsystem at file-load time:

```php
new ACF();
new Admin();
new Ajax();
// ...
new RankMath();
if (is_plugin_active('sitepress-multilingual-cms/sitepress.php')) {
    new WPML();
}
```

This is the theme's **service-locator**. Each class registers its own hooks in its constructor. Implications:

1. Every class constructor runs on every request, whether or not the class's hooks will fire. Admin classes load on the front end and vice versa. This is a minor perf cost (~hundreds of microseconds per request); see [03](/reports/theme-only-audit/03-performance).
2. There is **no dependency injection**. A class cannot be replaced at construction time. If a downstream project wanted a modified `Modals` system, the only intervention points are the hooks the class itself exposes — which, for most subsystems, is zero. This is the core problem [07 — Reusability and plugin extraction](/reports/theme-only-audit/07-reusability-and-plugin-extraction) addresses.
3. `is_plugin_active()` is called here at file-load time. That function lives in `wp-admin/includes/plugin.php` and **is not loaded on front-end requests by default**. This is a latent fatal error if someone's front-end fails to include the file (e.g. from a WP-CLI command, a REST-only request, or any context where admin includes haven't been bootstrapped). Covered in detail in [02](/reports/theme-only-audit/02-non-native-apis) and [04](/reports/theme-only-audit/04-security).

**Finding `ARCH-02` (P1, S).** Replace the service-locator in `functions.php` with a single bootstrap class hooked to `after_setup_theme`. Each subsystem should declare the hook priority at which it wants to register. This gives future extraction a single seam.

**Finding `ARCH-03` (P1, S).** Replace `is_plugin_active()` with `defined('ICL_SITEPRESS_VERSION')` or `class_exists('\SitePress')`. Same fix applies to `inc/Blocks/NewsletterSignup/NewsletterSignup.php:112` which calls it at class-registration time inside `blockFields()`.

## `style.css` and `theme.json` contracts

### `style.css`

```css
/*!
 * Theme Name: EDWP Theme
 * Author: Elixirr
 * Author URI: http://elixirr.com/
 * Version: 1.0
 * Text domain: edwp
 */
```

This is missing multiple fields the [WordPress Theme Review Handbook](https://developer.wordpress.org/themes/getting-started/main-stylesheet-style-css/) requires for any theme intended for distribution:

- `Description:` — required
- `License:` — required (most commonly `GPLv2 or later`)
- `License URI:` — required
- `Tested up to:` — required (recommended WP version)
- `Requires at least:` — required (minimum WP version)
- `Requires PHP:` — required (minimum PHP version)
- `Tags:` — required for theme directory; optional for private distribution
- `Template:` — only needed for child themes

These are not strictly mandatory for a theme deployed only on internal/client sites (the theme never goes through the wordpress.org review process), but they are used by WordPress core at runtime: `Tested up to:` + `Requires at least:` + `Requires PHP:` drive the "this theme may not be compatible with your WordPress version" notices in Admin → Themes. Their absence means those notices never fire, and an incompatible install fails silently.

**Finding `STYLE-01` (P2, S).** Add the missing `style.css` headers. Choose the real values: `Requires at least: 6.5`, `Requires PHP: 8.1`, `License: GPL-2.0-or-later`, `License URI: https://www.gnu.org/licenses/gpl-2.0.html`, etc.

The comment is also opened with `/*!` (exclamation-mark variant used by minifiers to preserve a comment). WordPress reads `style.css` as plain text and doesn't require the bang. Harmless, but unusual in a theme header.

### `theme.json`

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "color": { "palette": [ …5 colours… ] },
    "layout": { "contentSize": "1374px", "wideSize": "1728px" }
  }
}
```

Three issues:

1. **`$schema` points to `trunk`**, not a pinned WP version. `trunk` is the unstable-development schema. On a production theme this should point to a specific WP version's schema, e.g. `https://schemas.wp.org/wp/6.5/theme.json`, or (since WP 6.6) `https://schemas.wp.org/trunk/theme.json` is acceptable if you explicitly want "whatever is current" — but pin it unless you have a reason not to.
2. **`version: 2`** — current latest is version 3 (since WP 6.6). Moving to 3 unlocks enhancements like `settings.blocks.defaults` and improvements to `styles.variations` scoping. Not a bug, but a staleness signal.
3. **The file is semantically dead on the front end** because `Setup::removeGlobalStyles()` strips the core `wp_enqueue_global_styles` hook at `init:100` (`inc/Setup.php:320-325`). The palette and layout declared here only affect the **block editor**. No class applies those colour tokens to front-end CSS. This is a significant conceptual breakage: editors pick a brand colour from the block palette, and it never manifests on the site. Covered under [03](/reports/theme-only-audit/03-performance) as `PERF-THEME-JSON` and cross-referenced in [06](/reports/theme-only-audit/06-blocks-and-components).

**Finding `THEMEJSON-01` (P1, S).** Decide: either commit to `theme.json` (stop suppressing `wp_enqueue_global_styles`, extend the file to carry real tokens, migrate block SCSS to the token system) or delete the file. The current middle ground gives the user the worst of both worlds — editor palette that doesn't apply visually.

**Finding `THEMEJSON-02` (P2, S).** Pin `$schema` to a WP version; migrate to `version: 3`.

## Template hierarchy

The theme provides the classic PHP template hierarchy but sparsely:

| Template | Content |
|---|---|
| `index.php` | `get_header(); while(have_posts()) the_post(); the_content(); endwhile; get_footer();` |
| `page.php` | Same as index, plus `post_password_required()` handling |
| `single.php` | Same as page, but **does not call `get_header()` / `get_footer()`** — bug; see below |
| `404.php` | `get_header(); echo '404'; get_footer();` — placeholder content |
| `search.php` | `get_header();` → `get_search_form();` → loop → `get_footer();` |
| `searchform.php` | Hand-rolled `<form role="search">` with `schema.org/WebSite` microdata |
| `templates/default.php` | Named classic template (`Template Name: Default Template`) — placeholder |

**Finding `TPL-01` (P0, S).** `single.php` omits `get_header()` and `get_footer()` calls:

```php
// single.php — current
if (post_password_required()) {
    \EDWP\Render::partial('partials/global/password-form');
} else {
    the_content();
}
```

There is no `get_header()` or `get_footer()` call anywhere in this file. Single posts render without a header or footer. This is either a bug or a very unusual intentional choice. Confirm before fixing; if unintended, wrap the existing code with `get_header();` … `get_footer();`.

**Finding `TPL-02` (P1, S).** `404.php` renders the literal string `'404'` — a placeholder. This must be replaced before the theme goes to production. Content-side 404 pages are also possible (WP supports `404` pattern / block templates).

**Finding `TPL-03` (P2, S).** `search.php` outputs `<h1><a href="…">{title}</a>` for each result — the closing `</h1>` is missing. Minor.

**Finding `TPL-04` (P2, S).** `templates/default.php` is a named classic template that renders nothing except its title. If it's not used, delete it; if it's a scaffold, move it to `patterns/templates/` as a block pattern or remove it.

### Template-part resolution

`header.php` and `footer.php` use `EDWP\Render::partial('partials/global/…')` for loading template parts rather than core's `get_template_part()` / `get_header('name')`. `Render::partial()` is a custom template-loader with added behaviour (object caching, `extract($args)`, argument passing). The function carries multiple correctness bugs, covered in [02](/reports/theme-only-audit/02-non-native-apis#renderpartial-bugs) and [04](/reports/theme-only-audit/04-security).

**Finding `TPL-05` (P1, S).** Prefer `get_template_part($slug, $name, $args)` (native, 5.5+) over `Render::partial()`. Native `get_template_part` supports a `$args` array since 5.5, passes them to the template (accessible as `$args`), fires `get_template_part` and `get_template_part_{$slug}` actions, and honours the template hierarchy (`locate_template()`). This is also a precondition for theme-part overrides by plugins.

## Naming and identity

The theme has **four distinct names** across different files:

| File | Name present |
|---|---|
| `style.css` | `EDWP Theme` |
| `composer.json` (root + theme-level) | `edx/edwp` |
| `package.json` (theme-level) | `"project-name": "mourant"` |
| `webpack.config.js` | Defaults to `'mourant'` / `'theme-only'` via `process.env.PROJECT_NAME` |
| Namespace + text domain | `EDWP\\`, `'edwp'` |
| Directory name | `theme-only` |
| Top-level README | References "EDX WordPress MAMP/Docker Starter Template" |

This looks like the residue of one starter template being cloned for a client ("Mourant") then partially rebranded. It is disorienting on its own merits and makes search/replace during project setup error-prone. The `setup/create.sh` script does not appear to fix this.

**Finding `ID-01` (P2, S).** Pick one identity (likely `edwp` for the agency starter, `{client_slug}` for per-project clones) and apply it consistently across `style.css`, `composer.json`, `package.json`, webpack defaults, namespace, text domain, and directory name. Document the rename steps in the README's "install" section and automate in `setup/create.sh` if this is genuinely a starter template.

## Coding standards (PHP)

`phpcs.xml` declares PSR-12 as the base ruleset:

```xml
<rule ref="PSR12"><exclude name="Generic.Files.LineLength" /></rule>
```

…and `composer.json:18-24` runs PHPCS with `--runtime-set testVersion 7.4`:

```json
"lint:php": ["phpcs --runtime-set testVersion 7.4 … --standard=phpcs.xml ./*"]
```

The codebase, however, uses PHP-8-only syntax in many places:

| Syntax | Example | Minimum PHP |
|---|---|---|
| Union types | `array\|string $image` in `Filters::fixWpGetAttachmentImageSvg` | 8.0 |
| `mixed` type | `mixed $value` in `ACF::filterFieldValues` | 8.0 |
| `str_contains()` | `Helpers::processVimeoURL` | 8.0 |
| Named arguments | `Render::partial(…, echo: false)` everywhere | 8.0 |
| Array spread into arrays | `[...$args, 'classes' => …]` — every block `filterBlockFields` | 8.1 (the string-key spread form) |
| Constructor `int\|string` param in `ACF::filterFieldValues` | 8.0 |

The `phpcs` config's `testVersion 7.4` will accept this code because it lints syntactically — `7.4-` would reject it; `7.4` just sets the target floor without forbidding later features. But the signal is confusing: the lint says "we support 7.4" while the code requires 8.1.

**Finding `PHP-01` (P1, S).** Update `phpcs.xml` and the `lint:php` script to `--runtime-set testVersion 8.1-` to match reality. Add `Requires PHP: 8.1` to `style.css` (see `STYLE-01`). Update `composer.json` to `"require": { "php": ">=8.1" }`.

### Lint ruleset choice

PSR-12 is a respectable choice but is **not the same as WordPress Coding Standards**. WPCS (`WordPress`, `WordPress-Core`, `WordPress-VIP-Go`) ships rules specific to WordPress: nonces, capability checks, output escaping, sanitisation, prefixed global functions/variables, hook naming conventions. By using PSR-12 the theme is opting out of all of them.

Given that the stated direction is **"standardise as much with WordPress working practices"** (see [00 — Summary](/reports/theme-only-audit/00-summary) and [02 — Non-native APIs](/reports/theme-only-audit/02-non-native-apis)), PSR-12 is the wrong ruleset.

**Finding `PHP-02` (P1, M).** Adopt [`WordPress-Extra`](https://github.com/WordPress/WordPress-Coding-Standards) rules (which includes `WordPress-Core` + best-practice rules like escaping/sanitisation checks) as the primary ruleset. Optionally layer PHPCS PHPCompatibility alongside. Keep PSR-12-specific rules (brace placement, visibility) if the team prefers — they can co-exist with WPCS. Expect a non-trivial noise-to-signal ratio on the first pass. Create a baseline to make adoption incremental (covered in [08 — Roadmap](/reports/theme-only-audit/08-roadmap)).

**Finding `PHP-03` (P2, S).** Add [PHPStan](https://phpstan.org/) with the WordPress extension (`szepeviktor/phpstan-wordpress`) at level 5+. The existing code's type-safety isn't bad (most methods are typed), so level 5 should be achievable. PHPStan will catch the `call_user_method()` dead-code issue in `Render::partial()` ([02](/reports/theme-only-audit/02-non-native-apis)) and the unused field reference in `CaseStudy::setupFields()`. See `skills/wp-phpstan` in the agent-skills bundle for configuration.

## Coding standards (CSS/SCSS, JS)

### SCSS

- `stylelint-config-standard-scss`, `stylelint-config-standard`, `stylelint-prettier`, `stylelint-scss`, `stylelint-order`, `stylelint-selector-bem-pattern`, `stylelint-webpack-plugin`.
- This is a strong, modern stack. No findings here — it's above the water-line for agency CSS.

### JS

- `.eslintrc.js` is 543 bytes; likely a very thin config.
- No ESLint rule for React/Gutenberg (no `@wordpress/eslint-plugin`). If and when any native block dev work happens, `@wordpress/eslint-plugin` is the right ruleset.
- Code uses ESM imports + Babel `@babel/preset-env` with `modules: false` for tree-shaking. Clean setup.

**Finding `JS-01` (P2, S).** When beginning native block migration ([08 — Roadmap](/reports/theme-only-audit/08-roadmap)), add `@wordpress/eslint-plugin` for React/Gutenberg rules. Until then, no change needed.

## Internationalisation (i18n)

### Translations load

`Setup::afterThemeSetup()` calls:

```php
load_theme_textdomain('edwp', get_template_directory() . '/languages');
```

This has been optional since WP 4.6 when a theme is installed under `wp-content/themes/`. It's still valid and harmless — WP automatically loads `languages/*.mo` files for themes in the WP install root, but an explicit call is a safe belt-and-braces.

The `wp-content/languages/` directory has 72 files — there are real translations in the repo for multiple locales. Good.

### Text-domain usage

Text domain `'edwp'` is used consistently. Admin.php, Setup.php, most blocks, and most helpers wrap user-facing strings in `__()` / `_x()` / `esc_html__()` / `esc_html_x()`. This is good discipline.

**Finding `I18N-01` (P2, S).** A handful of user-facing strings escape i18n: `'&hellip;'` return value from `Setup::setExcerptMore()` (acceptable — it's an HTML entity), `'404'` in `404.php` (acceptable only because it's a placeholder; see `TPL-02`), the modal content field hard-coded labels in `ACF/ThemeOptions.php` (`'Modal Content'`, `'Modal Settings'`, `'Modal ID'`, `'Modal Title'`, `'e.g., "contact"'`). These are admin-side strings — they should still be translatable for agencies working with non-English-speaking admins.

### Timezone/date formatting

`Helpers::getPostInfo()` uses `get_the_date('d F Y', …)` — hard-coded British format. `partials/global/footer.php:122` uses `date('Y')` directly — correct for year-only, but the canonical WP idiom is `wp_date('Y')` (respects site timezone) or `current_time('Y')`.

**Finding `I18N-02` (P2, S).** Replace `date()` calls with `wp_date()` / `current_time()` in templates. Replace hard-coded date formats with the site's `get_option('date_format')` where appropriate, or expose as a filter.

## Findings summary

| ID | Title | Severity | Effort |
|---|---|---|---|
| ARCH-01 | Delete redundant `spl_autoload_register` in `functions.php` | P2 | S |
| ARCH-02 | Replace service-locator with a bootstrap class hooked to `after_setup_theme` | P1 | S |
| ARCH-03 | Replace `is_plugin_active()` calls with `class_exists`/`defined` | P1 | S |
| STYLE-01 | Add required `style.css` headers (`Requires PHP`, `License`, etc.) | P2 | S |
| THEMEJSON-01 | Commit to or remove `theme.json` (currently suppressed on front end) | P1 | S |
| THEMEJSON-02 | Pin `$schema`; migrate to `theme.json` v3 | P2 | S |
| TPL-01 | `single.php` omits `get_header()` / `get_footer()` | **P0** | S |
| TPL-02 | `404.php` renders placeholder literal `'404'` | P1 | S |
| TPL-03 | Missing `</h1>` in `search.php` | P2 | S |
| TPL-04 | Review or remove `templates/default.php` | P2 | S |
| TPL-05 | Replace `Render::partial` with native `get_template_part($slug, $name, $args)` | P1 | M |
| ID-01 | Unify theme identity across `style.css`, `composer.json`, `package.json`, webpack, namespace | P2 | S |
| PHP-01 | Update `phpcs` target to PHP 8.1; fix `composer.json` PHP constraint | P1 | S |
| PHP-02 | Adopt `WordPress-Extra` PHPCS ruleset | P1 | M |
| PHP-03 | Add PHPStan with WordPress extension | P2 | S |
| JS-01 | Add `@wordpress/eslint-plugin` during native block migration | P2 | S |
| I18N-01 | Wrap remaining admin strings in `__()` | P2 | S |
| I18N-02 | Replace `date()` with `wp_date()` / `current_time()` in templates | P2 | S |

Next: [02 — Non-native APIs and native replacements](/reports/theme-only-audit/02-non-native-apis)
