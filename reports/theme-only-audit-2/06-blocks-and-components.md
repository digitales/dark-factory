---
title: Blocks and components
description: ACF blocks, systems findings, and native-equivalent migration notes per block.
---

# 06 — Blocks and Components (exhaustive)

This document walks through every one of the 27 `acf/*` blocks and 11 components in the theme. Each gets:

- Role + user-value
- Non-native dependencies used
- Current issues specific to the block (beyond the systemic ones covered elsewhere)
- Native equivalent / migration target
- Proposed hook surface for extensibility

Systemic findings that apply to **every** block / component are covered once in the next section; individual subsections list only *additional* findings unique to that block.

## Contents

- [Systemic findings (all blocks + components)](#systemic-findings-all-blocks--components)
- [Blocks (27)](#blocks)
  - [acf/accordion](#acfaccordion) · [acf/authors](#acfauthors) · [acf/breadcrumbs](#acfbreadcrumbs) · [acf/buttons](#acfbuttons) · [acf/cards](#acfcards) · [acf/column](#acfcolumn) · [acf/contact-details](#acfcontact-details) · [acf/content](#acfcontent) · [acf/form-block](#acfform-block) · [acf/gallery](#acfgallery) · [acf/global-block](#acfglobal-block) · [acf/group](#acfgroup) · [acf/image](#acfimage) · [acf/logos](#acflogos) · [acf/map](#acfmap) · [acf/menu](#acfmenu) · [acf/newsletter-signup](#acfnewsletter-signup) · [acf/post-meta](#acfpost-meta) · [acf/separator](#acfseparator) · [acf/shortcode](#acfshortcode) · [acf/socials](#acfsocials) · [acf/stats](#acfstats) · [acf/style-config](#acfstyle-config) · [acf/tabbed-content](#acftabbed-content) · [acf/testimonials-block](#acftestimonials-block) · [acf/video](#acfvideo) · [acf/example-block](#acfexample-block)
- [Components (11)](#components)
  - [Author](#component-author) · [Button](#component-button) · [Card](#component-card) · [CardPerson](#component-cardperson) · [Heading](#component-heading) · [Paragraph](#component-paragraph) · [PasswordForm](#component-passwordform) · [Stat](#component-stat) · [Tag](#component-tag) · [Testimonial](#component-testimonial) · [Toggle](#component-toggle) · [ExampleComponent](#component-examplecomponent)
- [Block Pattern and Template registrations](#block-pattern-and-template-registrations)
- [`allowedBlockTypes` allow-list](#allowedblocktypes-allow-list)
- [Findings summary](#findings-summary)

## Systemic findings (all blocks + components)

Every `inc/Blocks/*/*.php` and `inc/Components/*/*.php` shares the same ~80-line shell:

```php
public function __construct() {
    add_action('acf/init', [$this, 'initialiseBlock']);
}

public function initialiseBlock(): void {
    $this->registerBlock();
    $this->setupBlockACF();
    wp_register_style('acf-{slug}-style', …, filemtime(…));
    wp_register_script('acf-{slug}-script', …, filemtime(…), true);
}

public function filterBlockFields($args): array {
    $args = wp_parse_args($args, [ 'base_class' => $this->baseClass, 'classes' => [...], ... ]);
    // block-specific class building
    $args = Helpers::setupBlockFields($args);
    $args = Helpers::setupComponentFields($args);
    return [...$args, 'classes' => implode(' ', $args['classes'])];
}

public function registerBlock(): void {
    register_block_type(__DIR__, ['render_callback' => [$this, 'renderBlock']]);
}

public function renderBlock($block): void {
    $fields = get_fields() ?: [];
    if (empty($fields) && !empty($block['data'])) {
        $fields = $block['data'];
    }
    if (!empty($block['data']) && !empty($block['data']['parent_block'])) {
        $fields['parent_block'] = $block['data']['parent_block'];
    } else {
        $fields['parent_block'] = [];
    }
    $args = [...$this->filterBlockFields($fields), 'block_id' => $block['id']];
    echo Render::partial('inc/Blocks/{Slug}/template', $args, [], false);
}

public function setupBlockACF(): void { … }
public static function blockFields(): FieldsBuilder { … }
public static function settingsFields(): FieldsBuilder { … } // in most blocks
```

Across 27 blocks + 11 components, this is ~2,900 lines of duplicated boilerplate. Every new block is authored by copy-pasting an existing block folder and renaming.

### Systemic findings

- **SYS-BLOCK-01 (P1, M)**: extract the shell into an `AbstractBlock` base class (`EDWP\Core\AbstractBlock`) that handles registration, ACF-field-group attachment, asset registration, render-callback default, parent-block inheritance, and partial-template loading. Each block subclass only declares its slug, fields, and any block-specific logic in `filterBlockFields()`. Expected reduction: ~70% of per-block line count.
- **SYS-BLOCK-02 (P1, S)**: Every block asset uses `filemtime()` for versioning. Cross-ref to [03 ASSET-VER-01](/reports/theme-only-audit-2/03-performance#asset-versioning-filemtime-vs-manifest).
- **SYS-BLOCK-03 (P1, S)**: Every block's `wp_register_script` uses the legacy boolean `true` (in footer) instead of the strategy array. Cross-ref to [03 ENQUEUE-01](/reports/theme-only-audit-2/03-performance#enqueue-strategies).
- **SYS-BLOCK-04 (P1, M)**: Every block template interpolates `$args[base_class]`, `$args[classes]`, other string values without `esc_attr`. Cross-ref to [04 SEC-ESCAPE-01](/reports/theme-only-audit-2/04-security#template-output-escaping).
- **SYS-BLOCK-05 (P1, L)**: Every block depends on ACF. Replaced as part of the ACF migration in [08 Phases 3–4](/reports/theme-only-audit-2/08-roadmap).
- **SYS-BLOCK-06 (P2, S)**: Every block's `filterBlockFields` returns an array where `classes` is sometimes a string (after implode) and sometimes an array (before implode). Inconsistent typing; templates receive a string. Tighten types via abstract base class.
- **SYS-BLOCK-07 (P2, S)**: `renderBlock($block)` type-hints as nothing (`$block`) — could be `array $block`. Covered when abstract-base-class introduces properly-typed method signatures.

### Proposed hook surface (every block gets this)

```
edwp/block/{slug}/args           filter: $args before render
edwp/block/{slug}/classes        filter: $classes string before implode
edwp/block/{slug}/template_path  filter: template path resolved by loader
edwp/block/{slug}/context        filter: parent_block + block context array
edwp/block/{slug}/before_render  action: right before echo
edwp/block/{slug}/after_render   action: right after echo
```

Implemented once in the `AbstractBlock::renderBlock()` method. Downstream plugins then customise per-block output without touching the theme.

## Blocks

Every block below has ACF Pro + `StoutLogic\AcfBuilder` + `Render::partial` + `Helpers` as systemic deps. Only block-specific issues are called out.

### acf/accordion

- **Role**: FAQ-style accordion with heading + WYSIWYG description per item.
- **Native replacement**: Core `core/details` block (native `<details>/<summary>` since WP 6.3). For multi-item accordions: `InnerBlocks` of `core/details`, or a custom `edwp/accordion` block that wraps `InnerBlocks` constrained to heading + paragraph pairs. Interactivity API for the open-one-at-a-time behaviour.
- **JS**: `scripts.js` (custom). Manages expand/collapse state, chevron rotation, close-all-on-open. Modest logic — ~60 lines. Replaceable with CSS-only `<details>` for simple cases, or Interactivity API directives for the close-all / accordion-icon variants.
- **Findings**: `Accordion::settingsFields()` default `accordion_icon` is `'chevron'` but the choices array uses `'chevron_down'` as the slug. The default will never match — `chevron_down` will be used as the fallback in `filterBlockFields`. Harmless but wrong.

### acf/authors

- **Role**: Display author cards for a post, either from the `Person` CPT or custom-input authors.
- **Native replacement**: `core/query` + `core/post-template` for the Person CPT variant. Custom authors: `InnerBlocks` of `edwp/author` component block.
- **JS**: None.
- **Findings**: `filterBlockFields` maps ACF repeater field names (`author_thumbnail`, `author_first_name`, etc.) to component-expected keys. After native migration, this mapping disappears — InnerBlocks carry the right attribute names natively.

### acf/breadcrumbs

- **Role**: Auto-generated breadcrumbs with optional Rank Math integration.
- **Native replacement**: Keep as custom block — there's no native breadcrumbs block. Re-implement with a pure-PHP `render.php` that takes `separator` and `type` attributes. Drop Rank Math integration.
- **Issues**:
  - `generateBreadcrumbs` switch falls through to `auto` when RM not installed — correct. But the RM check is `function_exists('rank_math_get_breadcrumbs')` — tie to plugin presence only, not a setting.
  - Good use of `apply_filters('edwp_breadcrumbs_home_text', …)` and `apply_filters('edwp_breadcrumbs', …)` — the only block that currently exposes filters. Keep this pattern, extend to `edwp/breadcrumbs/items`.
- **Findings**: None beyond systemic.

### acf/buttons

- **Role**: Group of 1–N `Button` components, with alignment.
- **Native replacement**: Core `core/buttons` block. Drop `acf/buttons` entirely.
- **Findings**: This block is a direct duplication of core functionality — `core/buttons` exists and has been stable since WP 5.0. The only reason `acf/buttons` exists is the opinionated button-styles (primary / secondary / tertiary) which can be modelled in native core/button via `block.json` style variations + `theme.json`.

### acf/cards

- **Role**: Multi-purpose card grid/slider — manually authored cards or queried from a post type.
- **Native replacement**:
  - Manual card entry → `InnerBlocks` of `core/columns` + `edwp/card` (custom) components. Alternatively use `core/cover` / `core/media-text` patterns.
  - Queried card entry → `core/query` + `core/post-template` + `edwp/card` render.
  - Slider variant → lazy-imported Swiper *or* CSS scroll-snap in-block.
- **Non-native deps**: Swiper.
- **Issues**:
  - `is_slider` check triggers Swiper enqueue on every page that has a slider-card — correct.
  - `related_content` fallback in `queryPosts()` runs a second query — see [03 PERF-QUERY-01](/reports/theme-only-audit-2/03-performance#database-queries).
  - `featured_card` field has a conditional that requires `slides_per_view_desktop = 1` OR `columns = 1`. Logic is OR but actually `conditional().or()` in ACF chains — the ACF builder syntax here is correct but easy to misread.
- **Findings**: Large block with a lot of mixed logic (manual vs query, slider vs grid, people vs post cards). Consider splitting into `edwp/cards` (manual) and `edwp/query-cards` (queried).

### acf/column

- **Role**: Layout primitive — a single column within a `Group`, with responsive widths and gaps.
- **Native replacement**: Core `core/column` (already stable). Width controls are native. `theme.json` layouts cover the container/spacing semantics.
- **Issues**:
  - `filterBlockFields` is ~150 lines of class-building logic — mostly responsive width/gap cascading. Most of this is replaced by `theme.json` layout + core `core/column` attributes.
  - Custom width as percentage → inline CSS variable `--column-span-desktop: round($custom / 100 * 12)` — assumes a 12-column grid. Native `core/column` uses `flexBasis` percentage attribute directly; the 12-column snap is an opinionated choice that can live in block-style variations.
  - `use_custom_width_{breakpoint}` boolean + separate number field — noisy UI; core `core/column` shows a single width input with optional percentage/pixel units.
- **Findings**: Highest-priority to migrate to `core/column` once ACF migration kicks off. This is the block most directly duplicating core functionality.

### acf/contact-details

- **Role**: Icon + label + description + link for contact info (email, phone, location).
- **Native replacement**: Custom block remains useful — `core/details` doesn't cover it. `InnerBlocks` of a `edwp/contact-item` component. Consider Block Bindings for pulling contact info from theme options (phone number, address) automatically.
- **Findings**: `style` conditional field — the `label` / `description` fields only show when `style = expanded`. ACF field metadata correctly uses `conditional_logic`. Clean block.

### acf/content

- **Role**: Rich content with eyebrow + heading + subheading + paragraph + buttons.
- **Native replacement**: This is just a wrapper around core blocks — literally a `core/group` containing `core/heading`, `core/heading`, `core/heading`, `core/paragraph`, `core/buttons`. Build as a **block pattern** instead of a block. Patterns are WP-native, composable with core blocks, editable inline.
- **Findings**: Same as buttons — this block exists mostly for a pre-set field structure, which patterns replicate natively without a code block at all.

### acf/form-block

- **Role**: Embeds a Gravity Form with a custom heading + description.
- **Native replacement**: Post-GF-removal, this becomes `core/heading` + `core/paragraph` + `core/form` pattern. Pre-GF-removal, keep the block but make it optional (`class_exists('\GFAPI')` guard in `initialiseBlock`).
- **Issues**:
  - `wp_enqueue_script('jquery')` in `initialiseBlock()` — see [02 JQUERY-01](/reports/theme-only-audit-2/02-non-native-apis#jquery). Move to a conditional enqueue only when the form is rendered.
  - `acf-form-block-script` registered but not observably enqueued in the block logic. Verify.
- **Findings**: None beyond systemic.

### acf/gallery

- **Role**: Image gallery with columns, slider mode, modal zoom.
- **Native replacement**: Core `core/gallery` block. For modal zoom, add a custom light-box plugin or extend core/gallery via `viewScriptModule`. Slider mode → lazy-imported Swiper.
- **Issues**:
  - `enable_modal` and `is_slider` are mutually exclusive in UI but handled with separate `if/else` in `filterBlockFields` — could use a single `display_mode` select.
  - `custom_layout` picks the first 3 images if enabled — brittle; if the gallery has fewer than 3 it degrades silently.
- **Findings**: After ACF migration, native `core/gallery` with theme-added style variations for the 1–4 column layouts covers most use cases. The "custom 3-image layout" is a visual pattern that can be a separate block pattern.

### acf/global-block

- **Role**: Reuse any single ACF block across multiple posts. Stores data in the `global_block` CPT.
- **Native replacement**: Core's `core/block` (Reusable Blocks / Synced Patterns). Native since 5.0, renamed to Synced Patterns in 6.3. Same functionality (edit once, reflect everywhere) with first-class editor UX.
- **Issues**:
  - `PostTypes\GlobalBlock::getGlobalBlock()` uses `acf_setup_meta()` / `acf_reset_meta()` to swap field context — ACF-specific.
  - `apply_filters('wpml_object_id', …)` for WPML translation — correct use of WPML filter.
- **Migration strategy**: Map every `global_block` CPT post to a core Synced Pattern on migration. WP-CLI script to convert post by post.
- **Findings**: The block's template passes `$args['block_name']` as a dynamic block to render, which is a neat trick but couples this block tightly to the Render::block() ACF pipeline. Core Synced Patterns are simpler.

### acf/group

- **Role**: Layout container with background (image / video / colour), spacing, container width, vertical alignment.
- **Native replacement**: Core `core/group` has most of this. Background video → custom block extension via `render_block_core/group` or a wrapping block. Container widths → theme.json layout config.
- **Issues**:
  - 160-line `filterBlockFields` with responsive spacing / alignment cascading. Native `core/group` handles responsive layout via the Layout API without bespoke cascading logic.
  - `fetch_priority` field on background image / video — clever, but duplicates native `core/image`'s support for fetch priority.
- **Findings**: Along with `acf/column`, this is a high-value target for native migration — replacing with `core/group` + theme.json cuts hundreds of lines of code.

### acf/image

- **Role**: Responsive image block with separate desktop/mobile sources, aspect ratio, object-fit, overlay.
- **Native replacement**: Core `core/image` + `picture` extension. The separate desktop/mobile source logic can be implemented via `core/image` with `srcset` + `sizes`, or a custom block that renders a `<picture>` with two `<source>` elements.
- **Issues**:
  - Heavy use of `image_group` / `image_mobile_group` nested ACF groups — native `core/image` doesn't have per-breakpoint source swapping. Valid reason to keep a custom block post-migration for this specific use case, but simpler architecture using `wp_get_attachment_image()` with custom `sizes`.
- **Findings**: None beyond systemic.

### acf/logos

- **Role**: Logo grid / slider with alignment, shadow, autoplay options.
- **Native replacement**: Core `core/gallery` with style variations for logo sizing, OR custom block with `InnerBlocks` of `core/image`. Slider variant → CSS scroll-snap or lazy Swiper.
- **Issues**: Many slider-mode options (autoplay speed, hide nav, pause on mouse enter, touch move) — valid feature coverage, but a lot of surface area for a logo strip. Trim.
- **Findings**: None beyond systemic.

### acf/map

- **Role**: Google Maps embed with height, zoom, marker.
- **Non-native deps**: Google Maps JS API Loader (npm), ACF's `google_map` field type.
- **Native replacement**: Custom block remains valid — no native Maps block. Post-ACF, migrate to `register_post_meta('latlng', ...)` + block attribute; render `<div>` that the view-script module hydrates via `@googlemaps/js-api-loader`. Use Block Bindings for the API key from options.
- **Issues**: `getMap()` reads `google_maps_api_key` option on every render. Cache for the request. Also: `google_map` ACF field hard-couples to ACF Pro (it's an ACF-specific field type). Post-migration, author picks lat/lng via a custom block sidebar control with MapLibre preview, or simply types coordinates.
- **Findings**: `getMissingConfig()` returns an array of missing pieces (`'API Key'`, `'Map ID'`). Template uses this to show a warning banner to admins. Good pattern — keep post-migration.

### acf/menu

- **Role**: Render a saved menu, `wp_list_pages`, or manual links.
- **Native replacement**: Core `core/navigation` covers saved menus. For `wp_list_pages` there's no direct native block — use `core/list` with page-query binding. For manual links, `core/navigation` supports custom links.
- **Issues**: Options allow `wp_list_pages_args` as a free-text string like `'depth=2&sort_column=menu_order'` — parsed as query string on the PHP side. Admin-only, so not a security issue, but a bizarre UX.
- **Findings**: Replace with native `core/navigation` block + pattern variants for the `wp_list_pages` use case.

### acf/newsletter-signup

- **Role**: Newsletter signup form — either a redirect form or a Gravity Form.
- **Non-native deps**: Gravity Forms (conditional via `is_plugin_active`).
- **Native replacement**: Build a custom block with `InnerBlocks` that contains a heading + description + form. Form → `core/form` or `core/html` for third-party embeds. If Gravity Forms stays, expose a minimal GF-form selector via Block Bindings.
- **Issues**: `is_plugin_active('gravityforms/gravityforms.php')` at `setupBlockACF()` time — see [02 PLUGIN-ACTIVE-01](/reports/theme-only-audit-2/02-non-native-apis#is_plugin_active-on-the-front-end). Use `class_exists('\GFAPI')` instead.
- **Findings**: This block duplicates much of `acf/form-block`. Consider consolidating both into one "form embed" block with a type selector.

### acf/post-meta

- **Role**: Render post metadata — author, date, read-time.
- **Native replacement**: Core `core/post-author`, `core/post-date`, `core/post-terms` cover most of this. Read-time is bespoke — replace with a custom `edwp/read-time` block that reads `post_content` and computes an estimate.
- **Issues**:
  - `getAuthorName()` switch-on-source: `post_author` / `person_relationship` / `manual_text`. The person_relationship variant calls `Person::getPersonInfo()` which itself calls `get_field()` — so a person-linked post meta block triggers ~6 option/meta reads. Minor.
  - `acf-post-meta-script` enqueued only when `read_time_text` is empty (to auto-compute). Good scoping.
- **Findings**: None beyond systemic.

### acf/separator

- **Role**: Visual horizontal separator.
- **Native replacement**: Core `core/separator`. Drop `acf/separator` entirely.
- **Findings**: Simplest block in the codebase. Exists only to apply theme styling to separators — `theme.json` styles.blocks.core/separator is the native way.

### acf/shortcode

- **Role**: Render a shortcode in a block.
- **Native replacement**: Core `core/shortcode`. Drop `acf/shortcode` entirely.
- **Findings**: Another block that duplicates a native one. Delete.

### acf/socials

- **Role**: Social links (share + "find us on…" defaults from theme options).
- **Native replacement**: Core `core/social-links` + `core/social-link`. Sharing variant requires a small custom block (or use an existing sharing plugin).
- **Issues**: Share URL construction — see [04 SEC-SOCIAL-01](/reports/theme-only-audit-2/04-security#social-sharing-url-construction). `instagram_url`, `facebook_url`, etc. read from options — move to Block Bindings on `edwp/setting` source post-migration.
- **Findings**: None beyond systemic.

### acf/stats

- **Role**: Grid of statistics (number + heading + description + optional image).
- **Native replacement**: Custom block — no direct native equivalent. `InnerBlocks` of `edwp/stat` components in a columns layout.
- **Issues**: Field-name namespacing is awkward: `stat_type` / `stat_stat_prefix` / `stat_stat` / `stat_stat_suffix` (note double `stat_`). Side effect of the component-reuse pattern where `Stat::componentFields()` prefixes everything with the parent field name.
- **Findings**: Legitimate block; keep and migrate.

### acf/style-config

- **Role**: Style config block — appears to be an admin-only preview/config surface for theme styling.
- **Issues**:
  - `setupBlockACF()` declares a field group but **doesn't call `$block->addFields(self::blockFields())`** (line 90: commented out). The block registers with an empty field group.
  - The `blockFields()` method adds a `Button::componentFields()` — so if it were re-enabled, the block would be a button preview.
  - Only allowed in admin (`inc/Blocks.php:122-127` adds `'acf/style-config'` only when `is_admin()`).
- **Findings**: Incomplete / preview block. Before migration, either finish it with a clear purpose or delete.

### acf/tabbed-content

- **Role**: Tabbed UI — click a tab, see its content.
- **Native replacement**: No native tabs block in core. The [Interactivity API](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/) is a perfect fit — custom `edwp/tabs` block with `data-wp-interactive` directives for state management. No Swiper or jQuery.
- **Issues**: Block's JS (`scripts.js`) is custom tab-switching logic. Replaceable with Interactivity API for ~50 lines total.
- **Findings**: High-value Interactivity API showcase when migrating.

### acf/testimonials-block

- **Role**: Testimonials with optional slider.
- **Non-native deps**: Swiper, `Testimonial` component.
- **Native replacement**: `InnerBlocks` of `edwp/testimonial` inside `core/columns` (grid) or a custom `edwp/testimonials-slider` block.
- **Issues**:
  - `getColumns()` static method builds `data-columns-{bp}` attributes with single-quote interpolation — see [04 SEC-ESCAPE-01](/reports/theme-only-audit-2/04-security#template-output-escaping) (no escape). Low risk (values are select-field choices) but inconsistent.
- **Findings**: None beyond systemic.

### acf/video

- **Role**: Video embed — YouTube, Vimeo, or local file.
- **Native replacement**: Core `core/video` for local, `core/embed` for YouTube/Vimeo. Preview-image + click-to-play behaviour needs a custom block or Interactivity API extension of core/embed.
- **Issues**:
  - `Helpers::processYoutubeURL()` / `processVimeoURL()` — regex URL parsing. OK, but `wp_oembed_get($url)` is the native way to get embed HTML.
  - Only enqueues `acf-video-script` when preview image is set — correct scoping.
- **Findings**: None beyond systemic.

### acf/example-block

- **Role**: Template / scaffold — not registered in `Blocks::initialiseBlocks()` but directory exists.
- **Findings**: Either use this as a "create-block" scaffold target and document, or delete. Current state creates confusion.

## Components

Components follow the same pattern as blocks but without a `block.json` `acf` key (they register via `register_block_type(__DIR__)` with a minimal `block.json`). They're meant to be composed inside blocks via `Render::block()`.

### Component: Author

- **Role**: Render a person/author card (image, name, job title, links).
- **Used by**: `Authors` block.
- **Native migration**: Becomes a block pattern or an `edwp/author` custom block.

### Component: Button

- **Role**: Link / button with style, icon, small variant.
- **Used by**: Buttons, Cards, ContactDetails, NewsletterSignup, most blocks with buttons.
- **Native migration**: Core `core/button` with style variations covers 95%. The remaining 5% (icon-before toggle, `dummy_element` div-not-link) requires a custom variant.

### Component: Card

- **Role**: Generic card primitive (image + eyebrow + title + description + button).
- **Used by**: Cards block.
- **Native migration**: Block pattern or custom block.

### Component: CardPerson

- **Role**: Person-specific card (uses `Person` CPT data).
- **Used by**: Cards block (when `content_to_pull = person`).
- **Native migration**: `core/query` with the Person post type + a custom `edwp/card-person` render.

### Component: Heading

- **Role**: Heading primitive (title, type H1-H6 / p, size class).
- **Used by**: Almost every block.
- **Native migration**: Core `core/heading` — directly replaceable.

### Component: Paragraph

- **Role**: WYSIWYG paragraph primitive.
- **Used by**: Content, Authors, Modals, more.
- **Native migration**: Core `core/paragraph` for plain text, `core/group` containing multiple inner blocks for rich content.

### Component: PasswordForm

- **Role**: Custom password-form rendering.
- **Used by**: `inc/Filters::filterPasswordForm` via `the_password_form` filter.
- **Native migration**: Keep — overrides the native password form template. Simpler implementation: just override `partials/global/password-form.php` and use `the_password_form` filter.

### Component: Stat

- **Role**: Single stat item.
- **Used by**: Stats block.
- **Native migration**: Custom block `edwp/stat`.

### Component: Tag

- **Role**: Small label/tag UI primitive.
- **Used by**: Various (needs grep to confirm).
- **Native migration**: Block pattern or small custom block.

### Component: Testimonial

- **Role**: Single testimonial block with quote + cite + company logo.
- **Used by**: TestimonialsBlock + Testimonial CPT.
- **Native migration**: Custom block `edwp/testimonial`.

### Component: Toggle

- **Role**: Unclear from usage alone. Likely a disclosure/toggle UI primitive.
- **Native migration**: Core `core/details` or Interactivity API-based toggle.

### Component: ExampleComponent

- **Role**: Scaffold — not registered in `Blocks::initialiseComponents()` list.
- **Findings**: Like `ExampleBlock` — delete or document as a `make create type=component` target.

## Block Pattern and Template registrations

`inc/Patterns.php` registers:

**Pattern categories**: `edwp-patterns`, `edwp-layout-patterns`, `edwp-templates`.

**Templates** (starter patterns via `core/post-content`):

- `theme-only/homepage-template` → `patterns/templates/homepage-template.html`, filed under `edwp-templates`, shows on `postTypes: ['page']`.
- `theme-only/blog-post-template` → `patterns/templates/blog-post-template.html`, shows on `postTypes: ['post']`.

**Block patterns**:

- `theme-only/cta-pattern` → `patterns/blocks/cta-pattern.html`
- `theme-only/cards-block` → `patterns/blocks/cards-block.html`

**Layout patterns**:

- `theme-only/100-pattern` → `patterns/layouts/100-layout.html`
- `theme-only/50-50-pattern` → `patterns/layouts/50-50-layout.html`
- `theme-only/33-33-33-pattern` → `patterns/layouts/33-33-33-layout.html`

These are all text-based HTML patterns — reasonable and native. No findings.

**Note**: Patterns containing ACF blocks won't render correctly after the ACF migration. Pattern templates must be re-authored to use native blocks.

**Finding `PATTERN-01` (P2, M)** — post-migration, rewrite all pattern HTML files to use native blocks. Directly wires to Phase 3 of [08](/reports/theme-only-audit-2/08-roadmap).

## `allowedBlockTypes` allow-list

`inc/Blocks.php:102-157` — returns a hard-coded list of `acf/*` blocks + `core/block` (synced pattern wrapper). Most `core/*` blocks (headings, paragraphs, images, etc.) are **disabled everywhere**. Admin-only addition: `acf/style-config`.

### Problems

1. **Starter patterns won't work correctly.** The homepage-template / blog-post-template patterns register `blockTypes: ['core/post-content']` as their parent context, but their actual content may reference native core blocks that the allow-list excludes.
2. **Post-migration, the allow-list becomes actively harmful.** Every native block would need to be explicitly added; forget one, it disappears from the editor.
3. **`allowed_block_types_all` runs on REST requests too**, not just the editor UI. The `is_admin()` check in the current code does not reliably distinguish "editor UI" from "REST request for block registration inspection".

### Fix

After ACF migration, the allow-list is counter-productive. Remove it entirely, or invert: **block-list** specific unwanted blocks (calendar, RSS, latest-comments) rather than **allow-list** a subset.

**Finding `ALLOWED-BLOCKS-01` (P1, S)** — once native migration begins, replace the allow-list with a narrow block-list or remove entirely.

## Findings summary

| ID | Title | Severity | Effort |
|---|---|---|---|
| SYS-BLOCK-01 | Extract block shell to `AbstractBlock` base class | P1 | M |
| SYS-BLOCK-02 | Replace `filemtime()` versioning — see [03 ASSET-VER-01](/reports/theme-only-audit-2/03-performance) | P1 | S |
| SYS-BLOCK-03 | Standardise `wp_register_script` to strategy array | P1 | S |
| SYS-BLOCK-04 | Escape template outputs — see [04 SEC-ESCAPE-01](/reports/theme-only-audit-2/04-security) | P1 | M |
| SYS-BLOCK-05 | Block-by-block native migration (Phase 3) | P1 | L |
| SYS-BLOCK-06 | Tighten `$classes` typing (string vs array) | P2 | S |
| SYS-BLOCK-07 | Type-hint `renderBlock($block): void` → `array $block` | P2 | S |
| PATTERN-01 | Rewrite pattern HTML to native blocks post-migration | P2 | M |
| ALLOWED-BLOCKS-01 | Replace allow-list with narrow block-list post-migration | P1 | S |

Per-block minor findings (accordion icon default mismatch, style-config incomplete, example-block/component cleanup, etc.) are documented inline above and rolled into Phase 3 of the roadmap.

Next: [07 — Reusability and plugin extraction](/reports/theme-only-audit-2/07-reusability-and-plugin-extraction)
