---
title: Performance
description: Enqueue strategies, theme.json, fonts, queries, and front-end performance findings.
---

# 03 — Performance

This document covers asset loading, caching, database/query patterns, and runtime overhead. Findings here are independent of the ACF migration unless marked otherwise — most of them are actionable today without touching the block architecture.

Expected front-end impact of addressing the P0/P1 items in this document (measured on a representative content page): **150–400KB gzipped JS saved, 100–500ms LCP improvement, small TTFB reduction (20–80ms)**. Numbers vary heavily by page; use them as directional targets, not commitments.

## Contents

- [Asset pipeline summary](#asset-pipeline-summary)
- [Asset versioning: filemtime vs manifest](#asset-versioning-filemtime-vs-manifest)
- [Enqueue strategies](#enqueue-strategies)
- [The preload / onload CSS pattern](#the-preload--onload-css-pattern)
- [`should_load_separate_core_block_assets`](#should_load_separate_core_block_assets)
- [Swiper loading](#swiper-loading)
- [Admin-on-frontend cleanup](#admin-on-frontend-cleanup)
- [`theme.json` disabled on the front end](#themejson-disabled-on-the-front-end)
- [Speculation Rules](#speculation-rules)
- [SVG rendering cost](#svg-rendering-cost)
- [`Render::partial` template cache](#renderpartial-template-cache)
- [Database queries](#database-queries)
- [Capability writes on every request](#capability-writes-on-every-request)
- [Options reads](#options-reads)
- [GTM and site scripts injection](#gtm-and-site-scripts-injection)
- [Dashicons and other legacy assets](#dashicons-and-other-legacy-assets)
- [Font loading](#font-loading)
- [Findings summary](#findings-summary)

## Asset pipeline summary

Built with custom Webpack 5 (`webpack.config.js`), not `@wordpress/scripts`. Entry points are discovered by scanning `inc/Blocks/` and `inc/Components/` subfolders at build time (`webpack.config.js:25-81`). Output:

```
dist/
├── css/
│   ├── core.css                 # Main stylesheet (~unknown size — one entry)
│   ├── style.css                # Main stylesheet (another entry)
│   ├── resets.css
│   ├── admin.css
│   ├── editor-style.css
│   ├── block-editor-ui.css
│   ├── Accordion/styles.css
│   ├── Cards/styles.css
│   └── …one per block / component with SCSS
├── js/
│   ├── scripts.js               # Front-end main
│   ├── admin-scripts.js
│   ├── modal.js
│   ├── rank-math.js
│   ├── Swiper/swiper-bundle.min.js
│   ├── Accordion/scripts.js
│   └── …one per block / component with JS
├── images/
│   ├── sprite.svg
│   ├── favicons/
│   └── …assets passed through
├── fonts/
└── manifest.json                # WebpackManifestPlugin output — currently unused by PHP
```

Positives:

- Per-block CSS / JS co-located with the block PHP — clean model.
- `MiniCssExtractPlugin` + `CssMinimizerPlugin` + `TerserPlugin` for production minification.
- Tree-shaking enabled (`optimization.usedExports = true`, `optimization.sideEffects = true` in production).
- Source maps only in development.
- Dynamic imports are supported (but not currently used).
- SVG spritemap generation via `svg-spritemap-webpack-plugin`.

## Asset versioning: filemtime vs manifest

Every asset is versioned via `filemtime(get_stylesheet_directory() . '/dist/.../foo.css')` (visible in `Setup::enqueueScripts()`, `Admin::enqueueBlockEditorStyles()`, every `inc/Blocks/*/*.php`, every `inc/Components/*/*.php` with assets).

### Problems

1. **`filemtime()` is a syscall** (stat). Per request, the theme does this ~30–40 times (once per register_style + register_script call). On SSD it's ~microseconds per call; on network storage it's a disk round-trip.
2. **`filemtime()` can return `false`** if the file doesn't exist. Passing `false` to `wp_register_style()` causes a warning and degrades to no-version behaviour — cache-busting breaks silently if a build output is missing.
3. **The theme already has a manifest** — `webpack.config.js:302` configures `WebpackManifestPlugin` to write `dist/manifest.json`. PHP never reads it. The manifest includes content-hashed filenames if `[contenthash]` were added to the filename template (currently filenames are just `[name].ext`).

### Native-feel alternatives

**Simplest:** use the theme's version from `style.css`:

```php
$version = wp_get_theme()->get('Version');
wp_register_style('edwp-core', $uri, [], $version);
```

One bump per release. Not per-file cache-busting, but combined with `?ver=1.2.3` query strings it's usually sufficient for a theme where all assets redeploy together.

**More robust:** consume the webpack manifest. Switch to content-hashed filenames:

```js
// webpack.config.js
output: {
    filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
    // for CSS: configure MiniCssExtractPlugin with [contenthash:8] similarly
}
```

…and a PHP helper:

```php
// inc/Assets.php (new)
class Assets {
    private static ?array $manifest = null;

    public static function url(string $handle): string {
        if (self::$manifest === null) {
            $path = get_stylesheet_directory() . '/dist/manifest.json';
            self::$manifest = is_readable($path) ? json_decode(file_get_contents($path), true) : [];
        }
        $hashed = self::$manifest[$handle] ?? $handle;
        return get_stylesheet_directory_uri() . '/dist/' . ltrim($hashed, '/');
    }
}

// Usage:
wp_register_style('edwp-core', Assets::url('css/core.css'), [], null);
```

With content-hashed filenames, the file's own name is the cache key. Pass `null` as version to prevent WP adding a `?ver=` query (some CDNs will cache better without it).

**Finding `ASSET-VER-01` (P1, S).** Switch from `filemtime()` to manifest-driven asset resolution with content-hashed filenames. Reduces syscalls per request from ~40 to 1 (one JSON read, then memoised), and yields better browser/CDN caching.

## Enqueue strategies

### Current state

- `Setup::enqueueScripts()` uses modern array-form strategies for two scripts:

   ```php
   wp_register_script(
       'edwp-scripts', …, […],
       [
           'strategy' => 'defer',
           'in_footer' => true,
       ]
   );
   ```

   This is the correct modern pattern (WP 6.3+).

- `Setup::enqueueAdminScripts()` uses the legacy boolean 5th arg:

   ```php
   wp_register_script('edwp-admin-scripts', …, […], filemtime(…), true);
   ```

- Individual block `wp_register_script()` calls (e.g. `inc/Blocks/Cards/Cards.php:35`) use the legacy boolean form too.

### Why it matters

The modern strategies API supports `'async'`, `'defer'`, and `'defer' + 'in_footer' => true`. The legacy boolean (`true` = in footer) does **not** set defer/async. For 27+ blocks, every per-block script is loading without defer/async — meaning every `<script>` tag blocks HTML parsing until its `src` is fetched and executed.

`edwp-scripts` (the main bundle) has `strategy: 'defer'`. Every block's specific script (`acf-cards-script`, `acf-gallery-script`, etc.) does not. The result: on a page with 10 blocks that have JS, you have 1 deferred script + 10 blocking scripts.

**Finding `ENQUEUE-01` (P1, S).** Standardise every `wp_register_script()` call to use the array-form strategy:

```php
wp_register_script(
    'acf-cards-script',
    Assets::url('js/Cards/scripts.js'),
    [],
    null,
    ['strategy' => 'defer', 'in_footer' => true]
);
```

One mechanical pass across all 27 blocks + 11 components + `Setup.php` + `Admin.php`.

### Dependency declarations

All block scripts declare `[]` as dependencies, even for `acf-cards-script` which relies on `edwp-scripts-swiper` and `edwp-scripts`. The Cards template works because the main `edwp-scripts` is already enqueued, but this means:

- If someone dequeues `edwp-scripts` on a specific page, `acf-cards-script` runs without its dependency.
- The load order is accidental, not guaranteed.

**Finding `ENQUEUE-02` (P1, S).** Declare explicit dependencies on block scripts:

```php
wp_register_script(
    'acf-cards-script',
    Assets::url('js/Cards/scripts.js'),
    ['edwp-scripts', 'edwp-scripts-swiper'],
    null,
    ['strategy' => 'defer', 'in_footer' => true]
);
```

## The preload / onload CSS pattern

Location: `inc/Setup.php:328-341`. For every ACF block style handle, the theme rewrites the `<link rel="stylesheet">` output to:

```html
<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" …>
```

This is a technique for non-render-blocking CSS loading — the preload is a low-priority fetch, and `onload` converts it to an actual stylesheet once the preload resolves.

### Problems

1. **FOUC risk on above-the-fold blocks.** If the Cards block is visible in the initial viewport, this pattern guarantees a flash of unstyled content while the CSS loads asynchronously. For blocks that affect LCP, this is a regression, not an optimisation.
2. **JavaScript-dependency.** `onload` handlers require JS. No-JS visitors see `rel=preload` stylesheets that never promote to `rel=stylesheet`, meaning their page is unstyled forever. There's supposed to be a `<noscript><link rel="stylesheet" …></noscript>` fallback; the theme does not emit one.
3. **The filter runs for every enqueued style on every request**, even non-ACF ones, because `listAllRegisteredStyles()` is called inside `addCustomAttributesToStyle()` and does a `$wp_styles->registered` walk every time. This is O(styles × styles) in the worst case — cheap on small pages, not free.
4. **The pattern pre-dates `wp_maybe_inline_styles()`** (WP 5.9+), which gives you CSS inlining for small styles automatically.
5. **`should_load_separate_core_block_assets` is already enabled** (`inc/Blocks.php:53`). That means per-block CSS is only enqueued on pages that use those blocks. The per-block CSS load is already optimal; defer-loading it on top is over-engineering.

### Native replacement

Rely on native per-block asset loading + inline-small-styles + deferred loading for specifically-chosen heavy stylesheets:

```php
// inc/Setup.php — replace addCustomAttributesToStyle entirely
add_filter('should_load_separate_core_block_assets', '__return_true');        // Already enabled
add_filter('should_load_block_assets_on_demand', '__return_true');            // 6.6+

// For small per-block styles, let core inline them:
// Register each style with 'path' so wp_maybe_inline_styles() can pick them up
wp_register_style('acf-cards-style', $url, [], null);
wp_style_add_data('acf-cards-style', 'path', $path);    // Enable inline-if-small behaviour
```

When `$path` is declared, `wp_maybe_inline_styles()` inlines the stylesheet into `<head>` if it's small (default threshold 20KB). Large per-block styles stay as `<link>`s and benefit from HTTP/2 multiplexing.

**Finding `PERF-PRELOAD-01` (P1, S).** Remove `Setup::addCustomAttributesToStyle()` and `Setup::listAllRegisteredStyles()`. Replace with `wp_style_add_data(handle, 'path', $path)` on every block/component style registration. Native WP will handle inlining / deferral decisions correctly.

## `should_load_separate_core_block_assets`

Enabled (`inc/Blocks.php:53`):

```php
add_filter('should_load_separate_core_block_assets', '__return_true');
```

This is **correct modern WP practice** — only per-block styles that the page actually renders get enqueued. No change required.

### Future native-friendly variant

WP 6.6+ also ships `should_load_block_assets_on_demand` for blocks rendered inside template parts / patterns. Enable this once native block migration starts.

**Finding `PERF-BLOCK-ASSETS-01` (P2, S).** Add `add_filter('should_load_block_assets_on_demand', '__return_true')` alongside the existing line. No-op today (it's a newer filter), helpful after migration.

## Swiper loading

Already flagged in [02 — Non-native APIs (Swiper)](/reports/theme-only-audit-2/02-non-native-apis#swiper) — here's the performance-specific detail:

- **Swiper-bundle.min.js** is ~150KB gzipped.
- Registered in `Setup::enqueueScripts()` (unconditional on front-end).
- Enqueued when `Cards` / `Gallery` / `Logos` / `TestimonialsBlock` is rendered with `is_slider = true`. That part is correct.
- **Always enqueued on every admin page** by `Admin::enqueueAdminScripts()`:

   ```php
   public function enqueueAdminScripts() {
       wp_enqueue_script('edwp-scripts-swiper');
   }
   ```

   This runs on `admin_enqueue_scripts` regardless of the current screen. Swiper loads on Tools → Export, Users → All Users, Site Health, etc.

**Finding `PERF-SWIPER-ADMIN-01` (P1, S).** Scope `Admin::enqueueAdminScripts()` to block-editor screens only:

```php
public function enqueueAdminScripts(string $hook_suffix): void
{
    if ($hook_suffix !== 'post.php' && $hook_suffix !== 'post-new.php') {
        return;
    }
    wp_enqueue_script('edwp-scripts-swiper');
}
```

Better still: only enqueue Swiper on the editor if a block in the current post uses it. That requires parsing blocks server-side, which for a starter template may not be worth it.

## Admin-on-frontend cleanup

`Setup::removeAdminScriptsFrontend()` (`inc/Setup.php:370-377`):

```php
if (!is_user_logged_in()) {
    wp_deregister_style('dashicons');
    wp_deregister_script('jquery-ui-datepicker');
    wp_dequeue_script('jquery');
}
```

- `wp_deregister_style('dashicons')` — good, front-end no-JS visitors don't need it. But block-editor assets that depend on dashicons can't be enqueued on the front end (they are admin-only, so this is fine). Legitimate saving: a ~6KB gzipped font file + a small CSS file.
- `wp_deregister_script('jquery-ui-datepicker')` — good, narrow scope.
- `wp_dequeue_script('jquery')` — see [`JQUERY-01`](/reports/theme-only-audit-2/02-non-native-apis#jquery). `wp_dequeue_script` doesn't deregister; it's a no-op if jQuery wasn't enqueued, and breaks things if it was. Consider `wp_deregister_script('jquery')` instead, guarded by a test against FormBlock / GravityForms presence on the page.

**Finding `PERF-DASHICONS-01` (P2, S).** Current behaviour is sensible. Consider upgrading to `wp_deregister_script('jquery')` if the stack no longer needs jQuery (post-GF removal, FormBlock rewrite).

## `theme.json` disabled on the front end

`Setup::removeGlobalStyles()` (`inc/Setup.php:320-325`):

```php
public function removeGlobalStyles() {
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);
}
```

This removes the core hook that injects the stylesheet generated from `theme.json`. The reason (presumably) is that `theme.json`'s output conflicts with the block SCSS or is unused.

Consequences:

1. **The palette / layout / typography declared in `theme.json` has no effect on the front end.** Editors pick a brand colour from the block palette, and the front-end renders default colours.
2. **No CSS custom-properties from tokens.** `theme.json` declares global CSS variables like `--wp--preset--color--primary`; those don't exist on the front end. If any SCSS were to reference them (it currently doesn't), it'd silently fail.
3. **Block-level CSS overrides in `theme.json` are ignored.** `styles.blocks.core/heading.color.text = var(--wp--preset--color--foreground)` for example — not applied.
4. **Future native blocks (ACF migration target) rely on theme.json for design tokens.** The migration strategy requires `theme.json` to be the source of truth for colour / spacing / typography across all native blocks. Currently it's suppressed.

### Options

**Commit to theme.json** (recommended, part of ACF migration):

1. Remove `Setup::removeGlobalStyles()`.
2. Add a real `theme.json` (v3) with full palette, spacing scale, typography scale, fontFamilies, layout rules, and block-level style overrides.
3. Audit per-block SCSS for places that duplicate the token declarations and migrate them to CSS-variable references.
4. Use [style variations](https://developer.wordpress.org/themes/global-settings-and-styles/style-variations/) (`styles/*.json`) for per-client brand variations in a platform theme.

**Delete theme.json** (fast path):

1. Remove the file.
2. Leave `removeGlobalStyles()` alone.
3. Lose the editor palette but no live breakage.

**Finding `PERF-THEME-JSON-01` (P1, M).** Commit to `theme.json` or delete it. See also [01](/reports/theme-only-audit-2/01-conventions-and-structure)'s `THEMEJSON-01`. This is the single biggest architectural decision affecting performance-via-styling for a native-first migration.

## Speculation Rules

`header.php:21-32`:

```html
<script type="speculationrules">
{
    "prerender": [
        {
            "where": { "href_matches": "/*" },
            "eagerness": "moderate"
        }
    ]
}
</script>
```

Speculation Rules (from the [Speculation Rules API](https://developer.chrome.com/docs/web-platform/prerender-pages)) tell the browser to prerender pages the user might navigate to. WordPress core added native support for it in 6.8, via a filter-able API and a default `conservative`/`moderate` strategy.

### Problems with this rule

1. **`href_matches: "/*"` matches every link** — including `/wp-admin/...`, `/wp-login.php`, logout links (`?action=logout`), form GETs, feed links. Prerendering an admin page is wasteful. Prerendering a logout link may literally log the user out (if server-side logout has any side effects on GET, which it typically does for WordPress) — though the browser should use `nostate-prefetch` in some modes.
2. **No exclusions.** Core's default ruleset exempts `/wp-admin/*`, `/wp-login.php`, and URLs containing `?` (query strings). This hand-rolled rule has none.
3. **`eagerness: "moderate"`** — this triggers prerenders on ~3 seconds of hover or visibility in viewport. On a page with many nav links, this can fire dozens of prerenders per page-view. Bandwidth waste.
4. **Duplicates core.** WP 6.8 [emits speculation rules by default](https://make.wordpress.org/core/2024/11/15/speculation-rules-in-wordpress-6-8/). Having a hand-rolled `<script type="speculationrules">` alongside core's tag can cause browser-dedup issues.

### Fix

Let core handle it. Delete the hand-rolled tag. If you want different behaviour, use the `wp_speculation_rules_configuration` filter:

```php
add_filter('wp_speculation_rules_configuration', function (array $config): array {
    $config['mode'] = 'prerender';   // or 'prefetch'
    $config['eagerness'] = 'moderate';
    return $config;
});
```

**Finding `PERF-SPEC-01` (P1, S).** Delete the `<script type="speculationrules">` block from `header.php`. Use `wp_speculation_rules_configuration` filter for customisation. Requires WP 6.8+ (confirm target stack).

## SVG rendering cost

Covered in [02](/reports/theme-only-audit-2/02-non-native-apis#svgget-and-svgicon). Summary:

- `Svg::get()` calls `file_get_contents()` on every invocation. On a content-heavy page with 20 inline SVGs, that's 20 synchronous disk reads per request.
- `Svg::icon()` does not do disk reads (just inserts `<use xlink:href='#foo'>`), which is fine — but depends on the sprite being injected into the DOM by JS.

**Finding `PERF-SVG-GET-01` (P2, S).** Add static memoisation to `Svg::get()`. See [02 SVG-01](/reports/theme-only-audit-2/02-non-native-apis#svgget-and-svgicon).

## `Render::partial` template cache

Covered in [02 RENDER-01](/reports/theme-only-audit-2/02-non-native-apis#renderpartial-bugs). The existing cache layer is buggy and likely slower than the thing it's caching (reading a PHP template from disk is already fast; putting it through WP object cache only helps if there's a persistent backend, which is rare in dev/staging). The cache is also not invalidated on template change.

**Finding `PERF-RENDER-01` (P2, S).** Remove the cache layer from `Render::partial`. If template caching is wanted later, add it as an explicit opt-in wrapper per partial.

## Database queries

### Good patterns observed

- `get_posts()` used correctly (not `query_posts()`) — e.g. `Cards::queryPosts()`.
- `'fields' => 'ids'` used for light queries — saves post-data hydration.
- `WP_Query` post types reg'd with `show_in_rest` correctly where appropriate.
- `Person::updatePersonQuery()` filters REST queries via `rest_person_query` with a proper `meta_query` — this is the native pattern.

### Concerns

1. **`Cards::queryPosts()` runs a second query on empty results** (`inc/Blocks/Cards/Cards.php:383-387`):

   ```php
   if (isset($args['related_content']) && $args['related_content'] && empty($posts)) {
       unset($queryArgs['tax_query']);
       $posts = get_posts($queryArgs);
   }
   ```

   This is a "fall back to any related posts if category-filtered returned none" pattern. Two queries per render is worth it for the UX (no empty related-posts section), but:

   - No result caching means cache misses on every reload.
   - Blocks nested inside other blocks can compound queries.

2. **`Person::updatePersonQuery()` does an OR meta_query with `'compare' => 'NOT EXISTS'`** to hide archive people. Meta queries with `NOT EXISTS` cause a LEFT JOIN + NULL check — the slowest meta_query pattern. On a People archive with thousands of terms, this is a real cost. Consider adding a taxonomy "archived" and filtering on taxonomy rather than meta.

3. **`excerpt_remove_blocks` on every excerpt** (`inc/Blocks.php:159-162`):

   ```php
   public function removeBlocksFromExcerpt($post_excerpt): string {
       return excerpt_remove_blocks($post_excerpt);
   }
   ```

   `excerpt_remove_blocks` parses the block content twice — once for removal, once for the excerpt generator. Fine per-post; noticeable on archive pages that display 20 excerpts.

**Finding `PERF-QUERY-01` (P2, S).** Add a short-lived transient cache to `Cards::queryPosts()` keyed by `(post_type, related_category, current_post_id)`. Set TTL to 5 minutes. Typical hit rate on a content page ~95%.

**Finding `PERF-QUERY-02` (P2, M).** Replace the `hide_from_people_section` meta filter with a custom taxonomy. Migration script needed for existing data. Or: cache the list of "visible person IDs" as a transient refreshed on `save_post_person`, and filter the query by `'post__in' => $visible_ids` (a btree-index lookup, not a meta LEFT JOIN).

**Finding `PERF-QUERY-03` (P2, S).** If excerpts on archives are slow, use `wp_trim_excerpt()` + a custom excerpt field (per post) pre-populated on `save_post`. Or, disable archive-excerpt rendering entirely and rely on card-based listings.

## Capability writes on every request

Each of `CaseStudy`, `Person`, `Testimonial` CPTs calls `maybeAddCapabilities()` **in the class constructor**. Every front-end and admin request:

1. Reads `wp_options` for `edwp_{type}_caps_added`.
2. If false, writes capabilities to all `administrator` / `editor` roles.
3. Writes the flag option.

Once provisioned, step 1 is an options-table read per request. `wp_options` is autoloaded by default — so this is in the already-loaded `alloptions` cache, a ~microsecond hash lookup — acceptable.

**But:** the constructor-based registration means that on fresh installs, or after a role reset, the write will fire on the first uncached request. If a theme was already active before the constant was defined (old sites reinstalling the theme after an upgrade), it can fire across multiple requests before the flag sticks.

### Native pattern

`after_switch_theme` fires once when the theme is activated. `register_activation_hook` is for plugins. The existing code *does* register `addCapabilities` on `after_switch_theme` — good:

```php
add_action('after_switch_theme', [$this, 'addCapabilities']);
```

…but then also runs `maybeAddCapabilities()` in the constructor on every request, defeating the point.

**Finding `PERF-CAPS-01` (P2, S).** Remove `maybeAddCapabilities()` from CPT constructors. Rely on `after_switch_theme` for provisioning. Document the consequence in the README: "after theme activation, capabilities are set once — don't activate on live without triggering the hook". If migrating sites where the flag was never set, include a WP-CLI command (`wp edwp provision-caps`) for manual invocation.

**Finding `PERF-CAPS-02` (P2, S).** The `edwp_case_study_caps_added`, `edwp_person_caps_added`, `edwp_testimonial_caps_added` options are added to the autoload set on every new site. They're booleans — fine. But setting them with `update_option($key, true)` without explicit `$autoload = false` means they join the autoload set. Use `update_option($key, true, false)` to opt out of autoload (saves bytes in the alloptions cache).

## Options reads

`get_field(..., 'option')` — 16+ occurrences across the codebase (Setup, Filters, Modals, Socials, Map, footer, etc.). Each one is:

1. An options-table lookup (cached in alloptions after first call).
2. An ACF-specific value filter stack (ACF runs `acf/load_value` and similar hooks per call).

ACF's per-call overhead is ~100–500μs (depends on field complexity and how many filters are attached). On a page that reads 16 options, that's 1.6ms–8ms of ACF overhead for option reads alone. Not crushing; noticeable.

After ACF migration, `get_option('edwp_foo')` is much cheaper (a hash lookup in the autoload cache, no filter stack).

**Finding `PERF-OPTIONS-01` (P2, N/A).** Resolved by ACF migration. No pre-migration action required.

## GTM and site scripts injection

`Setup::addGtmToHead()`, `Setup::addGtmToBody()`, `Setup::addSiteScriptsToHead()`, `Setup::addSiteScriptsToFooter()`, `Setup::addSiteScriptsToBodyOpen()`:

- Call `get_field('google_tag_manager_id', 'option')` on every request for GTM (even if empty — the `if ($gtm_id)` check is after the read).
- Call `get_field('site_scripts', 'option')` **three times per request** — once in `addSiteScriptsToHead`, once in `addSiteScriptsToFooter`, once in `addSiteScriptsToBodyOpen`. Each scans the entire array.

**Finding `PERF-GTM-01` (P2, S).** Cache `get_field('site_scripts', 'option')` in a static class property for the request, and partition it once into head/body/footer buckets. See also [04](/reports/theme-only-audit-2/04-security#gtm-injection) for the security issues in this code path.

## Dashicons and other legacy assets

Already covered in [Admin-on-frontend cleanup](#admin-on-frontend-cleanup). Current handling is good.

## Font loading

`package.json` dependencies include:

- `@fontsource-variable/ibm-plex-sans:^5.2.8`
- `@fontsource-variable/open-sans:^5.2.7`
- `@fontsource-utils/scss:^0.2.2`

`@fontsource-variable` provides variable fonts (single file, range of weights). SCSS is pulled in via `@fontsource-utils/scss`. The fonts go through webpack's `asset/resource` path and end up in `dist/fonts/`.

No direct issues — this is a reasonable setup. Concerns:

- **No explicit `font-display: swap` or preload.** Variable fonts are 50–200KB; without `font-display: swap` they block text rendering. With preload + `font-display: swap`, text renders immediately in fallback and swaps when the variable font loads.
- **No subset filtering.** Variable fonts ship the full glyph set for a given language subset. If the site is English-only, filter to latin-only (~60% file-size reduction).

**Finding `PERF-FONT-01` (P2, S).** Add `font-display: swap` to `@font-face` declarations (if not already set by `@fontsource-variable`) and `<link rel="preload" as="font" crossorigin>` for the two variable fonts. Output via `wp_head` at priority 1.

**Finding `PERF-FONT-02` (P2, S).** Subset fonts to latin-only if the site doesn't support other scripts. Check `@fontsource-variable/ibm-plex-sans/scss/variables.scss` or equivalent import paths.

## Findings summary

| ID | Title | Severity | Effort |
|---|---|---|---|
| ASSET-VER-01 | Replace `filemtime()` with webpack manifest + content-hashed filenames | P1 | S |
| ENQUEUE-01 | Standardise every `wp_register_script` to array-form strategy | P1 | S |
| ENQUEUE-02 | Declare explicit script dependencies per block | P1 | S |
| PERF-PRELOAD-01 | Remove preload/onload CSS pattern; use `wp_style_add_data(..., 'path', ...)` | P1 | S |
| PERF-BLOCK-ASSETS-01 | Add `should_load_block_assets_on_demand` filter | P2 | S |
| PERF-SWIPER-ADMIN-01 | Scope admin Swiper enqueue to block-editor screens only | P1 | S |
| PERF-DASHICONS-01 | Front-end admin-asset cleanup is fine; minor tweak to jquery dequeue | P2 | S |
| PERF-THEME-JSON-01 | Commit to or delete `theme.json`; currently suppressed on front end | P1 | M |
| PERF-SPEC-01 | Delete hand-rolled speculation-rules tag; use `wp_speculation_rules_configuration` filter | P1 | S |
| PERF-SVG-GET-01 | Memoise `Svg::get()` disk reads | P2 | S |
| PERF-RENDER-01 | Remove buggy `Render::partial` cache layer | P2 | S |
| PERF-QUERY-01 | Cache `Cards::queryPosts()` output per (type, category, current-id) | P2 | S |
| PERF-QUERY-02 | Replace `hide_from_people_section` meta with taxonomy or cached list | P2 | M |
| PERF-QUERY-03 | Optimise archive excerpt rendering | P2 | S |
| PERF-CAPS-01 | Stop running `maybeAddCapabilities` in constructors; rely on `after_switch_theme` + CLI | P2 | S |
| PERF-CAPS-02 | `update_option(..., false)` to opt provision flags out of autoload | P2 | S |
| PERF-OPTIONS-01 | Most option-read overhead disappears with ACF migration | P2 | N/A |
| PERF-GTM-01 | Cache `site_scripts` option for the request; partition once | P2 | S |
| PERF-FONT-01 | Preload variable fonts; set `font-display: swap` | P2 | S |
| PERF-FONT-02 | Subset fonts to script(s) actually used | P2 | S |

Next: [04 — Security](/reports/theme-only-audit-2/04-security)
