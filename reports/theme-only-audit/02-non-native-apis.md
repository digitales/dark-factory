---
title: Non-native APIs and native replacements
description: ACF, Rank Math, custom helpers, and migration targets toward core WordPress APIs.
---

# 02 — Non-native APIs and native replacements

This document inventories every non-native WordPress API the theme depends on, explains the cost of that dependency, and gives the native WordPress replacement. It is the primary reference document for the ACF-free / native-first migration.

"Native" here means shipped with WordPress core, documented in the Theme Developer Handbook / Block Editor Handbook / Plugin Developer Handbook, or published under the `@wordpress/*` package scope.

## Contents

- [Guiding principle: prefer core hooks over custom](#guiding-principle-prefer-core-hooks-over-custom)
- [ACF Pro (Advanced Custom Fields)](#acf-pro-advanced-custom-fields)
- [StoutLogic\AcfBuilder](#stoutlogicacfbuilder)
- [jjgrainger\PostTypes](#jjgraingerposttypes)
- [`Render::partial()` bugs and native replacement](#renderpartial-bugs)
- [`Render::block()` and ACF's `acf_rendered_block()`](#renderblock)
- [`Svg::get()` and `Svg::icon()`](#svgget-and-svgicon)
- [SVG spritemap](#svg-spritemap)
- [`is_plugin_active()` on the front end](#is_plugin_active-on-the-front-end)
- [Custom Ops hooks (`start_operation` / `end_operation`)](#custom-ops-hooks)
- [Rank Math dependencies](#rank-math-dependencies)
- [WPMDB Pro](#wpmdb-pro)
- [Gravity Forms](#gravity-forms)
- [WPML](#wpml)
- [Swiper](#swiper)
- [jQuery](#jquery)
- [Findings summary](#findings-summary)

## Guiding principle: prefer core hooks over custom

The single most important native-WP pattern the theme is not following is: **use core hooks for core concepts**. Before inventing a theme-prefixed hook, check whether WP already ships one:

| Task | Custom approach in theme | Native hook |
|---|---|---|
| Modify a block's rendered HTML | Would have been baked into `renderBlock()` | [`render_block`](https://developer.wordpress.org/reference/hooks/render_block/) / [`render_block_{$block_type}`](https://developer.wordpress.org/reference/hooks/render_block_block_name/) |
| Modify block registration metadata | N/A currently | [`block_type_metadata`](https://developer.wordpress.org/reference/hooks/block_type_metadata/) / `block_type_metadata_settings` |
| Shape REST output for a CPT | Partial (`Person::updatePersonQuery`) | [`rest_{$post_type}_query`](https://developer.wordpress.org/reference/hooks/rest_post_type_query/), `rest_prepare_{$post_type}` |
| Register a data source for block attributes | N/A | [`register_block_bindings_source`](https://developer.wordpress.org/reference/functions/register_block_bindings_source/) (6.5+) |
| Modify script/style tag output | `Setup::addCustomAttributesToStyle()` (over-complicated) | [`script_loader_tag`](https://developer.wordpress.org/reference/hooks/script_loader_tag/), [`style_loader_tag`](https://developer.wordpress.org/reference/hooks/style_loader_tag/), `wp_script_add_data()` (for `defer`/`async`/`strategy`) |
| Programmatically modify `theme.json` | N/A | [`wp_theme_json_data_theme`](https://developer.wordpress.org/reference/hooks/wp_theme_json_data_theme/) (6.1+), `wp_theme_json_data_user`, `wp_theme_json_data_blocks`, `wp_theme_json_data_default` |
| Template part loading | `Render::partial()` | [`get_template_part($slug, $name, $args)`](https://developer.wordpress.org/reference/functions/get_template_part/) (args since 5.5) |
| Enqueue with dependencies that plugins can extend | Static dep arrays | Filterable handles + `wp_script_add_data()` for strategies |

**Finding `NATIVE-HOOKS-01` (P1, M).** Audit every custom code path that performs an action core already has a hook for, and migrate. Each one simultaneously reduces custom code and increases extensibility to downstream plugins.

## ACF Pro (Advanced Custom Fields)

### Footprint

Every one of the 27 blocks, 11 components, both ACF groups (`ACF\Post`, `ACF\ThemeOptions`), four CPTs, and the `RelatedService` taxonomy depend on ACF Pro. The dependency shape:

```
functions.php
  → new ACF() (inc/ACF.php)            # acf/init, acf/load_value, acf/load_field, acf/settings/show_admin
  → new Blocks() (inc/Blocks.php)      # wp_enqueue_style/script + allowed_block_types_all filter
  → new Modals() (inc/Modals.php)      # get_field('modals', 'option')
  → new Setup() (inc/Setup.php)        # get_field('google_tag_manager_id', 'option')
                                       # get_field('site_scripts', 'option')
  → new Filters() (inc/Filters.php)    # get_field('mega_menus', 'option')
  → new GravityForms, etc.             # GFAPI-dep, which is scoped into ACF field choices

Every inc/Blocks/*/*.php and inc/Components/*/*.php:
  - uses acf_add_local_field_group()
  - uses StoutLogic\AcfBuilder\FieldsBuilder
  - uses acf/init hook for registration
  - uses register_block_type() but with ACF's render pipeline

inc/Render.php::block()
  - uses acf_get_block_type()
  - uses acf_rendered_block()
  - uses acf_get_block_id()
  - uses acf_setup_meta() / acf_reset_meta() (inc/PostTypes/GlobalBlock.php)

inc/WPML.php
  - hooks wpml_found_strings_in_block + uses acf_get_field()
```

ACF Pro is essentially the theme's content model and rendering engine.

### What ACF gives you

1. **Custom blocks with PHP server-render and ACF's field-editor sidebar UI** (`acf_register_block_type` / `register_block_type` + `acf` key in `block.json`).
2. **Repeater + Flexible Content**: arbitrary-length ordered field lists, with conditional logic per row.
3. **Options pages**: a top-level admin screen with arbitrary fields stored as a single aggregated option row.
4. **Field-builder in PHP**: via the third-party `acf-builder` library.
5. **A data-access layer**: `get_field('foo')` / `get_field('foo', 'option')` — retrieves meta/options and normalises them.

### What native WordPress gives you

| ACF feature | Native equivalent | Notes |
|---|---|---|
| Custom server-rendered block | `register_block_type(__DIR__)` + `block.json` + `render.php` | `render.php` receives `$attributes`, `$content`, `$block`. Dynamic blocks have been stable since WP 5.8, `render.php` convention since 6.1. |
| Block editor sidebar fields | `InspectorControls` + core UI components in `edit.js` | React-based, not point-and-click, but is how Gutenberg is designed. |
| Block attributes | `attributes` in `block.json` | [Block attributes reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/). |
| Repeater | `InnerBlocks` with `allowedBlocks` | Works better than ACF Repeaters — real drag-and-drop, copy/paste between posts. |
| Flexible Content | `InnerBlocks` + `allowedBlocks` + a block pattern for the "add" UX | Same underlying mechanism as Repeater. |
| Options pages | [Settings API](https://developer.wordpress.org/plugins/settings/) + `add_menu_page()` + `register_setting()` | More code, more flexibility. Register settings with `'show_in_rest' => true` to make them editable from the block editor sidebar via Block Bindings. |
| Post meta (per-post ACF fields) | `register_post_meta()` with `'show_in_rest' => true` | Automatic Gutenberg sidebar panel. Works with Block Bindings. |
| Term meta | `register_term_meta()` | Same pattern. |
| User meta | `register_user_meta()` | Same pattern. |
| Conditional logic | React conditionals in `edit.js`, or `useEntityProp` selectors | More code, more flexibility. |
| `get_field('foo')` | `get_post_meta($post_id, 'foo', true)` / `get_option('foo')` / `get_term_meta()` | Native — no "normalisation" layer, which means the data shapes you get back are different. |
| Google Map field (`ACF\Map`) | Custom block with the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) or the [Interactivity API](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/) | Build a native `acf/map` replacement. |
| Gallery field | Core `core/gallery` block or custom block with `InnerBlocks` of `core/image` | |
| Relationship field | Custom block with a `usePostsSearch` selector + `InnerBlocks` of `core/post-template` | |
| WYSIWYG field | `core/paragraph` + `InnerBlocks`, or `RichText` component | |

**Finding `ACF-01` (P0 strategic, L).** Migrate away from ACF Pro. This is a multi-phase engagement laid out in [08 — Roadmap](/reports/theme-only-audit/08-roadmap). Once complete, ACF Pro, `stoutlogic/acf-builder`, the `wpml_found_strings_in_block` compat layer in `WPML.php`, the excerpt compat layer in `RankMath.php`, and significant amounts of copy-paste code in every block disappear.

### Data-migration cost

The biggest single cost of removing ACF Pro is **content migration**. ACF stores block field values as serialised post meta (and as JSON inside block HTML comments for block attributes). Native blocks store values as JSON in block HTML comments directly, and custom meta goes into standard post meta rows. Migrating from ACF's format to native requires:

1. A one-time WP-CLI command that parses each post's `post_content`, identifies ACF blocks, and rewrites them as their native equivalents.
2. A data-shape conversion (ACF's `image` field returns an array; `core/image` stores a numeric attachment ID).
3. A backup/rollback plan.

Rough estimate on a content-heavy site with 500+ posts using ACF blocks: 3–10 engineer-days for the migration script + 1–3 engineer-days per representative content type for QA. Add it to your planning before scheduling the main block-rewrite work.

### Block Bindings as the native "option field" replacement

WP 6.5 shipped the [Block Bindings API](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/) which replaces most of what ACF options fields did. Register a source:

```php
// Put this in inc/Bindings.php (new) or inc/Setup.php
add_action('init', function () {
    register_block_bindings_source('edwp/setting', [
        'label'              => __('EDWP Setting', 'edwp'),
        'get_value_callback' => function (array $source_args, $block_instance, string $attribute_name) {
            $key = $source_args['key'] ?? '';
            if (!$key) {
                return '';
            }
            $value = get_option("edwp_{$key}");
            return apply_filters("edwp/setting/{$key}", $value, $block_instance, $attribute_name);
        },
    ]);
});
```

Now any core block can bind its content/URL attribute to a site setting from a pattern or in the editor:

```html
<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"edwp/setting","args":{"key":"tagline"}}}}} -->
<p></p>
<!-- /wp:paragraph -->
```

This is how **every** `get_field('foo', 'option')` call in this theme should eventually be refactored. The current code has 10+ option reads across `Setup.php`, `Filters.php`, `Modals.php`, `Blocks/Socials/Socials.php`, `Blocks/Map/Map.php`, `ACF/ThemeOptions.php`, `partials/global/footer.php`, `inc/ACF.php`, etc. After migration, options live in `register_setting()` storage, plugins filter values through `edwp/setting/{key}`, and templates bind to them via Block Bindings.

## StoutLogic\AcfBuilder

Composer dep `stoutlogic/acf-builder:^1.12` (`composer.json:34`). Used in every block/component PHP file + `ACF/Post.php`, `ACF/ThemeOptions.php`, `Taxonomies/RelatedService.php`, `PostTypes/*.php`, `Globals/FieldGroups.php`.

The library provides a fluent PHP builder for ACF field-group array config. Instead of writing:

```php
acf_add_local_field_group([
    'key' => 'group_foo',
    'title' => 'Foo',
    'fields' => [
        ['key' => 'field_bar', 'name' => 'bar', 'label' => 'Bar', 'type' => 'text'],
    ],
    'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'post']]],
]);
```

You write:

```php
$fields = new FieldsBuilder('foo');
$fields->addText('bar')->setLocation('post_type', '==', 'post');
acf_add_local_field_group($fields->build());
```

Once ACF is gone, this library is gone too. There is no native-WP analogue because the concept (PHP-defined field groups) doesn't exist in native WP — native post meta is registered with `register_post_meta()` per-key, and block attributes are declared in `block.json`.

**Finding `ACFBUILDER-01` (P0 strategic, N/A).** Removed as part of ACF migration. No action required until then. The library itself is small and well-maintained — it's not a risk, just a symptom.

## jjgrainger\PostTypes

Composer dep `jjgrainger/posttypes:^2.2` (`composer.json:36`). Used in every `inc/PostTypes/*.php` and `inc/Taxonomies/RelatedService.php`.

The library wraps `register_post_type()` and `register_taxonomy()` with a builder-style API:

```php
// With the library:
$article = new PostType([
    'name'     => 'case_study',
    'singular' => 'Case Study',
    'plural'   => 'Case Studies',
], [
    'show_in_rest' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'author'],
    'rewrite' => ['slug' => 'case-studies', 'with_front' => false],
    'has_archive' => true,
    'capabilities' => self::CAPABILITIES,
    'map_meta_cap' => true,
]);
$article->icon('dashicons-format-status');
$article->register();
```

Native WP equivalent (no library):

```php
add_action('init', function () {
    register_post_type('case_study', [
        'labels' => [
            'name'          => __('Case Studies', 'edwp'),
            'singular_name' => __('Case Study', 'edwp'),
            // …
        ],
        'public'       => true,
        'show_in_rest' => true,
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'author'],
        'rewrite'      => ['slug' => 'case-studies', 'with_front' => false],
        'has_archive'  => true,
        'menu_icon'    => 'dashicons-format-status',
        'capabilities' => self::CAPABILITIES,
        'map_meta_cap' => true,
    ]);
});
```

Slightly more verbose (you hand-write all the `labels` strings instead of them being auto-generated), but one fewer dependency, zero magic, and the output is reviewable at a glance.

**Finding `POSTTYPES-01` (P1, S).** Replace all `jjgrainger\PostTypes\PostType` and `Taxonomy` usage with direct `register_post_type()` and `register_taxonomy()` calls. This is 4 CPTs + 1 taxonomy, each conversion is ~30 minutes, total effort is ~0.5 days. Drop `jjgrainger/posttypes` from `composer.json`.

**Bonus:** `CaseStudy`, `Person`, `Testimonial`, `GlobalBlock` all currently call `registerPostType()` **in the class constructor** (i.e. on file load, not on the `init` hook). This is a functional bug — `register_post_type()` is expected to be called on `init`. It "works" only because `functions.php`'s `new CaseStudy()` runs on a PHP `require_once` from `functions.php`, which is loaded by WP after core is booted but before `init` fires. WP documents this as "don't register post types before `init`". Fix as part of the same refactor.

**Finding `CPT-01` (P1, S).** Move all `register_post_type()` / `register_taxonomy()` calls from constructors into `init`-hooked methods.

## `Render::partial()` bugs

Location: `inc/Render.php:80-139`.

This is the theme's template-loader. It has multiple correctness issues that together make it a P1 finding:

### Bug 1: wrong wp_cache_set argument shape

```php
wp_cache_set($file, $data, serialize($cacheArgs), 3600);
```

The signature of [`wp_cache_set`](https://developer.wordpress.org/reference/functions/wp_cache_set/) is `wp_cache_set($key, $data, $group = '', $expire = 0)`. So this is calling: `key=$file`, `data=$data`, `group=serialize($cacheArgs)`, `expire=3600`.

Passing a **serialised array as the cache group** is wrong in two ways:

1. Cache groups in WordPress are expected to be short, stable, human-readable strings (e.g. `'options'`, `'posts'`, `'users'`). Object cache drivers frequently hash or prefix group names for namespace isolation; passing a 500-byte serialised blob causes cache-key explosion on drivers like Redis where it becomes a distinct namespace per call.
2. The cache **key** (first argument) is a file path, meaning different `$args` to the same partial all resolve to the same cache key. Calls with different args will either clobber each other or produce unpredictable hits depending on driver behaviour. The intent was clearly "cache this partial with these args"; the implementation inverts key and group.

### Bug 2: `call_user_method()` is removed

```php
} elseif (is_object($value) && method_exists($value, 'get_id')) {
    $cacheArgs[$key] = call_user_method('get_id', $value);
}
```

`call_user_method()` [was removed in PHP 7.0](https://www.php.net/manual/en/function.call-user-method.php). The replacement is `call_user_func([$value, 'get_id'])` or simply `$value->get_id()`. This branch will fatal on any PHP 7+ install the moment an object with a `get_id` method gets passed to a cached partial. Dead code, but dangerous dead code.

### Bug 3: `extract($args)` into template scope

```php
extract($args);
```

`extract()` into the template scope is a classic WordPress anti-pattern:

- Variable names in the template depend on caller-provided array keys; renaming an argument in `Render::partial(…, ['title' => $t])` silently breaks every template that uses `$title`.
- Values overwrite other local variables in template scope if keys collide (including `$file`, `$file_handle`, `$cache`, `$data`, `$return` — all of which are set above `extract()` and are vulnerable to collision).
- PHPStan / static analysers cannot reason about variables introduced by `extract()`.
- Native `get_template_part($slug, $name, $args)` since WP 5.5 exposes args as an explicit `$args` array inside the template — no `extract`, fully analysable.

### Bug 4: `call_user_method` triggers on any argument's `get_id` method

The branch quoted above was likely intended for something Human Made-specific (a pattern called "`HM\Base` get_id"). It's not generic — it assumes objects have a `get_id()` method. `WP_Post` has `ID`, not `get_id()`. `WP_Term` has `term_id`. No WP core object has `get_id()`. This branch is not only broken on PHP 7+, it was already broken on PHP 5.x in that it would never fire for standard WP objects.

### Bug 5: `do_action('start_operation'…)` / `do_action('end_operation'…)`

These hooks originated from Human Made's old `HM\Ops` library. They don't resolve to anything in this codebase or in WP core. Harmless (no listeners), but pointlessly increase each partial-render's hook-fire count.

### Native replacement

```php
// get_template_part($slug, $name = null, $args = [])  — since WP 5.5
get_template_part('partials/global/header', null, ['title' => 'Welcome']);
```

Inside `partials/global/header.php`:

```php
<?php
/** @var array $args */
$title = $args['title'] ?? '';
echo esc_html($title);
```

`get_template_part` also fires `get_template_part` and `get_template_part_{$slug}` actions, honours child-theme overrides via `locate_template()`, and is a well-understood surface for downstream plugins to override.

**Finding `RENDER-01` (P1, M).** Rewrite `Render::partial()` to a thin wrapper around `get_template_part()`, or delete and replace all call sites directly. Remove the caching layer — it is buggy and likely a net performance loss (most WP installs don't have persistent object cache, and transient caching for template parts is rarely a win). Remove the `extract()`. Remove the `call_user_method()` dead code. Remove the `start_operation` / `end_operation` actions.

**Finding `RENDER-02` (P2, S).** If persistent object caching *is* used, a small template-cache layer can be bolted on top of `get_template_part` via a wrapper — but `wp_cache_set` should take the signature `wp_cache_set($key_hash, $html, 'edwp_template', 3600)`, where `$key_hash = md5($slug . ':' . serialize($args))`.

## `Render::block()`

Location: `inc/Render.php:21-68`.

This is the "render an ACF block outside the block editor" helper. Templates call it to compose blocks (e.g. Cards-template calls `\EDWP\Render::block('card', $cardData)`). It uses:

- `acf_get_block_type()` — ACF Pro API
- `acf_rendered_block()` — ACF Pro API
- `acf_get_block_id()` — ACF Pro API
- `new \WP_Block()` — core
- `wp_script_is()`, `wp_enqueue_script()`, `wp_enqueue_style()` — core

After the ACF migration, this function either disappears (if block composition is done through `InnerBlocks` / patterns) or becomes a thin wrapper around core's `do_blocks($html)` / `parse_blocks($html)` / render_block calls. The migration target is:

```php
// Native equivalent: render a block programmatically
echo do_blocks('<!-- wp:edwp/card ' . wp_json_encode($attrs) . ' /-->');
```

or for better performance when rendering many blocks:

```php
$block = new WP_Block(
    ['blockName' => 'edwp/card', 'attrs' => $attrs],
    [],
    WP_Block_Type_Registry::get_instance()->get_registered('edwp/card')
);
echo $block->render();
```

**Finding `RENDER-BLOCK-01` (P0 strategic, N/A).** Gone with ACF migration.

## `Svg::get()` and `Svg::icon()`

Location: `inc/Svg.php:29-44`.

```php
public static function get(string $svg, string $modifier = ''): string
{
    return sprintf(
        "<span class='edwp-svg {$modifier}'>%s</span>",
        file_get_contents(get_stylesheet_directory() . '/dist/images/' . $svg . '.svg')
    );
}
```

### Native issues

1. **`file_get_contents()` is called on every render**, synchronous. For a heavy page with many icons, this is dozens of disk reads per request. No caching.
2. **No `WP_Filesystem`**. Standard WP practice for any disk access that might occur in the admin is through the `WP_Filesystem` abstraction, which respects FTP/SSH-mounted setups. For `dist/images/` on the front end, direct `file_get_contents` is usually acceptable, but it's still not the idiomatic approach.
3. **No path validation / sanitisation** on `$svg`. A caller can pass `'../../../etc/passwd'` as `$svg` and read arbitrary filesystem content. The function is called in many places across the codebase, all with trusted static strings today — but no enforcement. Exploitable only if a caller accepts user input; currently none do. Still: basic hygiene says validate against an allow-list.
4. **Output is not escaped**. SVG content is interpolated directly into HTML. If the SVG file on disk were ever malicious (via arbitrary file upload; see [04](/reports/theme-only-audit/04-security#svg-uploads)), the JavaScript inside it executes with page privileges.

### Native replacement

For icons, build a sprite at build time (the existing `svg-spritemap-webpack-plugin` setup does this — see [03](/reports/theme-only-audit/03-performance)) and reference by `<use>`:

```php
public static function icon(string $icon, string $class = 'sml'): string
{
    $icon_id = preg_replace('/[^a-z0-9_-]/i', '', $icon);
    return sprintf(
        '<svg class="edwp-icon edwp-icon--%1$s" aria-hidden="true" focusable="false"><use href="#%2$s"></use></svg>',
        esc_attr($class),
        esc_attr($icon_id)
    );
}
```

For occasional inline SVGs (larger illustrative graphics), use `wp_cache_get()` / static memoisation + `wp_kses` to sanitise:

```php
public static function get(string $svg, string $modifier = ''): string
{
    static $cache = [];
    $slug = preg_replace('/[^a-z0-9_-]/i', '', $svg);
    if (!isset($cache[$slug])) {
        $path = get_stylesheet_directory() . '/dist/images/' . $slug . '.svg';
        $cache[$slug] = is_readable($path) ? file_get_contents($path) : '';
    }
    return sprintf(
        '<span class="edwp-svg %s">%s</span>',
        esc_attr($modifier),
        wp_kses($cache[$slug], self::ALLOWED_SVG_TAGS)
    );
}
```

`self::ALLOWED_SVG_TAGS` is a whitelist of SVG elements + attributes (there's a [commonly-used list](https://developer.wordpress.org/reference/functions/wp_kses/) documented in WP plugin security guides).

### `xlink:href` is deprecated

`Svg::icon()` uses `<use xlink:href='#{icon}'>`. `xlink:href` was deprecated in SVG2 in favour of plain `href`. All modern browsers support `href`; old Safari (iOS < 12, macOS < 10.13) only supported `xlink:href`. Current browsers accept both, but `href` is the forward-compatible choice.

**Finding `SVG-01` (P1, S).** Fix path validation, add memoisation, sanitise output with `wp_kses`, switch from `xlink:href` to `href`. Most of the fixes can live in a `EDWP\Svg` class that stays — the refactor is small.

## SVG spritemap

Build-time dependency: `svg-spritemap-webpack-plugin:^4.7.0`. Generates `dist/images/sprite.svg` from `assets/icons/**/*.svg` during `pnpm run production`.

This is a legitimate build-time choice. SVG sprites are a proven optimisation pattern — one HTTP request, one parse, many icon references. The webpack plugin produces a proper sprite with `<symbol>` + `<use>`.

**No native WP equivalent** for this — SVG sprite assembly is not WP's problem, it's a bundler concern. Keep the plugin.

The only concern is integration: `Svg::icon()` renders `<use xlink:href='#foo'>` assuming the sprite has been injected into the page. That injection is done by `assets/js/sprite.js` (fetches `dist/images/sprite.svg` and inserts into `<body>`). For SSR / no-JS environments, icons would be blank. Consider inlining the sprite server-side at wp_body_open, or using `<symbol>` IDs that reference the sprite file directly (browsers support `href="/path/to/sprite.svg#foo"` cross-document).

**Finding `SVG-02` (P2, S).** Use `<use href="{sprite_url}#{icon}"></use>` (absolute reference) rather than requiring JS injection of the sprite into DOM. Modern browsers (all evergreen + Safari 12+) resolve cross-document `<use>` references. Saves the JS hydration step.

## `is_plugin_active()` on the front end

Two call sites:

- `functions.php:51` — `if (is_plugin_active('sitepress-multilingual-cms/sitepress.php'))`
- `inc/Blocks/NewsletterSignup/NewsletterSignup.php:112` — `$gfActive = is_plugin_active('gravityforms/gravityforms.php')`

[`is_plugin_active()`](https://developer.wordpress.org/reference/functions/is_plugin_active/) is defined in `wp-admin/includes/plugin.php`. WordPress does not automatically load that file on the front end. It works here because:

- On `functions.php:51` execution, several earlier `wp_register_script/style` calls have triggered WP admin-bar / other subsystems to pre-load `plugin.php`. This is coincidental.
- On block registration (`NewsletterSignup::blockFields()` is called from `setupBlockACF()` → `acf/init` hook, which is during WP's init cycle by which point admin includes may or may not be loaded depending on request context).

If any request path doesn't pre-load `wp-admin/includes/plugin.php` — e.g. a REST request for a post that contains the NewsletterSignup block, a WP-CLI run that triggers block registration, a cron run, some XML-RPC paths — these calls will **fatal** with "Call to undefined function is_plugin_active()".

### Native replacement

```php
// For WPML:
defined('ICL_SITEPRESS_VERSION') && new WPML();

// For Gravity Forms (GFAPI class is loaded by GF itself when active):
$gfActive = class_exists('\GFAPI');
```

Both `ICL_SITEPRESS_VERSION` (a WPML constant) and `\GFAPI` (a GF class) are loaded by those plugins unconditionally when they're active, on every request. They're the correct idioms.

**Finding `PLUGIN-ACTIVE-01` (P1, S).** Replace both `is_plugin_active()` calls as above.

## Custom Ops hooks

`Render::partial()` fires `do_action('start_operation', 'hm_template_part::' . $file_handle)` and a matching `end_operation`. These are remnants of [Human Made's `HM\Ops` package](https://github.com/humanmade/ops) — a lightweight performance-instrumentation library that hooks `start_operation` / `end_operation` to time operations.

`HM\Ops` is not installed in this theme. The hooks fire into the void. Harmless, but:

- They're listed in `skills/wordpress-router/SKILL.md` (hence the hooks are documented somewhere but not actually in use) — confusing.
- Each `apply_filters` / `do_action` call has non-zero overhead.

**Finding `OPS-01` (P2, S).** Remove `start_operation` / `end_operation` actions from `Render::partial()`, or (if instrumentation is wanted) add the [Query Monitor](https://github.com/WordPress/query-monitor) integration hooks QM uses (which are well-documented and widely supported).

## Rank Math dependencies

Three coupling points:

1. **`inc/RankMath.php`** registers a `rank_math/replacements` filter to regenerate an `%excerpt%` replacement for ACF-block posts (`rank_math_get_breadcrumbs()` is called in `Blocks/Breadcrumbs/Breadcrumbs.php:68`).
2. **`inc/Admin.php:171`** removes the Yoast and Rank Math dashboard widgets.
3. **`inc/Blocks/Breadcrumbs/Breadcrumbs.php:68, 249`** — optionally uses `rank_math_get_breadcrumbs()` / `rank_math_the_breadcrumbs()` if RM is present.

`composer.json:54` pins `wpackagist-plugin/seo-by-rank-math:1.0.268`. This is a hard dependency.

### Native equivalents

- Sitemaps: WP core ships a [basic XML sitemap](https://developer.wordpress.org/reference/functions/wp_sitemaps_get_server/) since 5.5. Filterable via `wp_sitemaps_*` hooks.
- Breadcrumbs: not native. Write a ~100-line breadcrumb generator (the theme already has one in `Blocks\Breadcrumbs\Breadcrumbs::generateAutoBreadcrumbs()` — it's independent of Rank Math).
- Meta description / robots / canonical: not native. Write a ~200-line schema+meta module.
- JSON-LD schema.org: not native. Write a module that outputs `<script type="application/ld+json">` blocks based on post type + theme options.
- Redirect manager: not native. WP-CLI + `.htaccess` / nginx config, or [Redirection](https://wordpress.org/plugins/redirection/) plugin (free, lightweight, maintained).

**Finding `RANKMATH-01` (P1, L).** Replace Rank Math with a thin in-theme SEO module + core sitemap + Redirection plugin. See [05 — Dependencies](/reports/theme-only-audit/05-dependencies) for the catalogue and [08 — Roadmap](/reports/theme-only-audit/08-roadmap) for phasing.

## WPMDB Pro

`composer.json:53` pins `deliciousbrains-plugin/wp-migrate-db-pro:2.7.7`.

WP-Migrate-DB-Pro's value is its GUI for pulling/pushing DB state between environments. Native equivalents:

- `wp db export`, `wp db import` (WP-CLI).
- `wp search-replace` (WP-CLI, handles serialised PHP data).

These cover 95% of what WPMDB does, in a scriptable form. The remaining 5% (GUI, partial-table pulls, media syncing) is worth ~£200/year per licence.

**Finding `WPMDB-01` (P2, S).** Move to WP-CLI for DB operations. Keep WPMDB as an optional plugin on projects where the team heavily uses the GUI workflow. Remove the composer dep from the starter template.

## Gravity Forms

Pinned at `gravityforms/gravityforms:2.9.31` (`composer.json:48`). Used in:

- `inc/GravityForms.php` — button classes, disable CSS, `GFForms::getGFForms()` helper.
- `inc/Blocks/FormBlock/FormBlock.php` — block that embeds a GF form by ID.
- `inc/Blocks/NewsletterSignup/NewsletterSignup.php` — optionally uses GF.
- `inc/Modals.php` — modal can embed a GF form.
- `inc/ACF/ThemeOptions.php:193-197` — modal options use `GravityForms::getGFForms()` for choices.

### Native equivalent

Core ships `core/form` as a basic block. It has **no entry management, no conditional logic, no payment, no notifications**. It is not comparable to Gravity Forms for any site that needs to manage form submissions.

Reasonable strategies:

- **Keep Gravity Forms as a per-project licensed plugin**, not bundled into every starter clone. For projects without form-entry requirements, strip all GF code paths behind `class_exists('\GFAPI')` guards.
- **Evaluate [Formidable Forms](https://formidableforms.com/) / [WS Form](https://wsform.com/) / [Contact Form 7](https://wordpress.org/plugins/contact-form-7/)** as lighter alternatives for simpler forms.
- The block-rewrite for `FormBlock` / `NewsletterSignup` should also reduce GF coupling — they currently expose all registered GF forms as a dropdown, meaning every site with the block registered pays for GF being active. Consider a "render nothing if GF absent" pattern.

**Finding `GF-01` (P1, S).** Make Gravity Forms optional: guard all `class_exists('\GFAPI')` / `\GFAPI::…` usage, remove the hard composer dep from the starter template (keep it per-project), and provide a native fallback for the FormBlock/NewsletterSignup cases where GF is absent.

## WPML

`inc/WPML.php` hooks `wpml_found_strings_in_block` to replace the ACFML plugin's per-block string extraction logic. Two dependencies:

1. **On WPML**: only loads when `is_plugin_active('sitepress-multilingual-cms/sitepress.php')` — see `PLUGIN-ACTIVE-01`.
2. **On ACFML** (an add-on plugin to WPML + ACF): the filter `wpml_found_strings_in_block` is added by ACFML, not WPML. This theme's file replaces ACFML's logic because ACFML resolves fields by name, which fails when field groups contain duplicate names (which happens pervasively in this theme because every block reuses `title` / `content` / `heading` field names). The replacement uses field keys instead — a correct fix, but deeply coupled to ACF internals (`acf_get_field()`).

### Native equivalent

There is no native multi-language support in WordPress. Options:

- **WPML**: full-featured, paid, heavy.
- **Polylang**: free + pro; lighter; simpler data model (stores translations as separate posts with relationships).
- **Multilingual via subdirectories**: manually maintain separate post types per language, with a language-switch UI. Works for small sites, unworkable for content-heavy ones.

**Finding `WPML-01` (P1, S).** Make WPML optional per-project. Guard all WPML-related code with `defined('ICL_SITEPRESS_VERSION')`. Remove the hard-coded entry in the starter's `functions.php`. The `WPML.php` module can stay as an optional compat layer that only loads when both WPML and ACF are present — and disappears entirely as part of the ACF migration (the filter it replaces is ACFML-specific and becomes moot when ACF itself is gone).

## Swiper

npm dep `swiper:^12.0.3`. Copied by webpack `CopyWebpackPlugin` from `node_modules/swiper/swiper-bundle.min.js` to `dist/js/Swiper/swiper-bundle.min.js`. Registered (`Setup::enqueueScripts()`, `Setup::enqueueAdminScripts()`) and enqueued (Admin.php, Cards.php, Gallery.php, Logos.php, TestimonialsBlock.php, `block.json` editorScript entries).

### Native equivalents for most cases

1. **CSS `scroll-snap`** — native (all browsers since 2020). Gives you a swipeable row of cards with one line of CSS:

   ```css
   .cards { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; }
   .cards > * { flex: 0 0 auto; scroll-snap-align: start; }
   ```

   Covers ~80% of "horizontal carousel" use cases. No JS.

2. **The [Interactivity API](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/)** (WP 6.5+) — WordPress-native, ~15KB gzipped, reactive-style bindings. Build a custom carousel component with it; costs similar to Swiper for a minimal slider; integrates directly with block rendering and blocks' `viewScriptModule`.

3. **Swiper, but lazy-imported** — for the cases where neither CSS scroll-snap nor Interactivity is enough (complex touch gestures, effects, nested swipers). Dynamic `import('./swiper-bundle.min.js')` inside a block's view script so the 150KB payload is only paid on pages that actually use Swiper.

### What the theme does today

- Swiper is registered by `Setup::enqueueScripts()` unconditionally (every front-end page registers the handle). It's enqueued (actually loaded) only by blocks that need it — Cards, Gallery, Logos, TestimonialsBlock. That part is OK.
- Swiper is **always enqueued on every admin page** by `Admin::enqueueAdminScripts()`. This is unnecessary — the admin editor only needs Swiper previews for a handful of block types. Covered in [03](/reports/theme-only-audit/03-performance).

**Finding `SWIPER-01` (P1, S).** Scope Swiper admin-enqueue to block editor screens only, not all admin pages. Use `$hook === 'post.php' || $hook === 'post-new.php'` in the `admin_enqueue_scripts` callback.

**Finding `SWIPER-02` (P2, M).** For simple horizontal scrollers (logos, testimonials, certain card configurations), replace Swiper with CSS scroll-snap. For complex carousels, lazy-import Swiper inside the block's view script module. Target ~150KB gzipped saved on pages that currently load Swiper unnecessarily.

## jQuery

`inc/Blocks/FormBlock/FormBlock.php:43` — `wp_enqueue_script('jquery');`. This is the only explicit jQuery enqueue; Gravity Forms will also pull jQuery in (it's a hard dependency of GF for AJAX submission in older versions; 2.9 still requires it).

`Setup::removeAdminScriptsFrontend()` (`inc/Setup.php:370-377`) does:

```php
if (!is_user_logged_in()) {
    wp_deregister_style('dashicons');
    wp_deregister_script('jquery-ui-datepicker');
    wp_dequeue_script('jquery');
}
```

`wp_dequeue_script('jquery')` is a no-op unless `jquery` was enqueued (not just registered); it doesn't deregister. For FormBlock pages where jQuery is actively enqueued, this dequeue will succeed and likely break the form.

**Finding `JQUERY-01` (P2, S).** Remove `wp_enqueue_script('jquery')` from FormBlock (GF loads its own jQuery dep); leave the dequeue in `removeAdminScriptsFrontend` but verify it doesn't break GF on pages that need it. Ideal end state: no jQuery on logged-out front-end pages.

## Findings summary

| ID | Title | Severity | Effort |
|---|---|---|---|
| NATIVE-HOOKS-01 | Audit custom paths where core hooks already exist | P1 | M |
| ACF-01 | Migrate away from ACF Pro to native blocks + register_post_meta + Block Bindings | **P0 strategic** | L |
| ACFBUILDER-01 | Remove `stoutlogic/acf-builder` (with ACF migration) | P0 strategic | N/A |
| POSTTYPES-01 | Replace `jjgrainger/posttypes` with direct `register_post_type()` | P1 | S |
| CPT-01 | Move CPT registration from constructors to `init` hook | P1 | S |
| RENDER-01 | Rewrite `Render::partial()` as wrapper around `get_template_part`; fix bugs | P1 | M |
| RENDER-02 | If cache layer needed, fix `wp_cache_set` arg order | P2 | S |
| RENDER-BLOCK-01 | `Render::block()` deprecated by ACF migration | P0 strategic | N/A |
| SVG-01 | `Svg::get()` — memoise, sanitise with `wp_kses`, validate path, use `href` not `xlink:href` | P1 | S |
| SVG-02 | Use cross-document `<use href="sprite.svg#icon">` instead of JS sprite injection | P2 | S |
| PLUGIN-ACTIVE-01 | Replace `is_plugin_active()` with `class_exists` / `defined` | P1 | S |
| OPS-01 | Remove `start_operation` / `end_operation` dead hooks | P2 | S |
| RANKMATH-01 | Replace Rank Math with in-theme SEO module + core sitemap + Redirection | P1 | L |
| WPMDB-01 | Move to WP-CLI for DB ops; drop WPMDB from starter | P2 | S |
| GF-01 | Make Gravity Forms optional per-project | P1 | S |
| WPML-01 | Make WPML optional per-project | P1 | S |
| SWIPER-01 | Scope admin Swiper enqueue to block editor screens only | P1 | S |
| SWIPER-02 | Replace Swiper with CSS scroll-snap for simple carousels; lazy-import elsewhere | P2 | M |
| JQUERY-01 | Remove front-end jQuery enqueues | P2 | S |

Next: [03 — Performance](/reports/theme-only-audit/03-performance)
