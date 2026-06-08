---
title: WordPress and PHP recommendations
description: Adoption priorities, definition of done, leadership tiers, and bottom line.
---

# Recommendations for PHP and WordPress teams

### Adopt immediately

1. **`apps-cursor-ai-enablement` + `dso-cursor-ai-enablement` model**
   - `AGENTS.md` at repo root
   - Glob-scoped `.cursor/rules/` (e.g. `includes/**`, `blocks/**`, `theme.json`)
   - Pre-write hooks: PHPCS + PHPStan before agent completes edits
   - Specialist agents: implement / test / review / security

2. **`elixirr-secure-sdlc-agent-pack`**
   - Already includes `**/*.php` in secure-coding rule globs
   - Import into plugin/theme repos for agent-assisted secure delivery

3. **FastAPI `core/` + `modules/` layout for WP plugins**

   ```
   my-plugin/
   ├── includes/core/          # bootstrap, auth, DB abstraction
   └── includes/modules/
       └── feature-name/
           ├── class-rest-controller.php
           ├── class-service.php
           ├── class-repository.php
           └── class-schema.php
   ```

4. **NetArchTest → Deptrac boundary enforcement**
   - Domain/services must not import `wp-admin` UI or direct `$wpdb` from presentation layer

5. **`pull-request-validation` pattern for WP PR gates**
   - Webhook → CI buildspec running PHPCS, PHPStan, PHPUnit, optional WPScan

### Adopt with adaptation

6. **`qa-cursor-ai-enablement` testing standards** — role-based selectors, API contract tests, no arbitrary waits

7. **`ai-coding-fundamentals-lms-course`** as internal Cursor onboarding — replicate as 50-line WP REST plugin

8. **`data-engineering-ai-plan` artefact versioning** — maturity gates and audit trails for content migrations or client handover

9. **`edi-mbl-react-native-expo-cursor-poc` ADR discipline** — `docs/adr/` for architectural decisions

10. **`dso-docker-build-python` release pipeline** — Composer audit + PHPCS security sniffs + PHPUnit before plugin ZIP

### Definition of done (from Angular boilerplate)

```
composer phpcs → composer phpstan → composer test → npm run build
```

---

## Portfolio leadership summary

| Tier | Repos |
|------|-------|
| **Org standards seeds** | `elixirr-secure-sdlc-agent-pack`, `apps-cursor-ai-enablement`, `dso-cursor-ai-enablement`, `mbl-cursor-ai-enablement` |
| **Architecture references** | `apps-ai-enablement-fastapi`, `apps-ai-enablement-netAPI`, RetailWeather (2026 academy) |
| **CI/governance patterns** | `pull-request-validation`, `qa-cursor-ai-enablement` |
| **Production ops (needs test investment)** | `endeavor-aws-datalake`, `elixirr-academy-infra`, `ms-shared` |
| **Training / low priority for WP** | Academy repos, ds-intro-code, ARKit-Tutorial, lms-* |
| **Fetch before use** | MSDP repos, dso-common-code, msdl, empty enablement placeholders |

---

## Bottom line

This portfolio is an **AI enablement and cloud training ecosystem**, not a WordPress codebase. The gap between these repos and typical WP delivery is not technical capability — it is **standardization**: Cursor rules as coding standards, architecture boundary enforcement, and CI as a non-negotiable merge gate. Those three practices transfer directly without requiring a stack change.

**No substantive PHP or WordPress development exists in this portfolio.** For WP work, import the SSDLC agent pack PHP globs, adopt the cursor enablement workflow model, and use the FastAPI module layout and NetArchTest/Deptrac thinking as architectural guides.
