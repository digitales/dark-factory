---
layout: doc
title: EDI Repository Portfolio Analysis
description: Senior-engineer review of 57 Elixirr/iOLAP git repositories — AI enablement, academy, DSO, MSDP, client delivery, and WordPress transfer guidance.
---

# EDI Repository Portfolio Analysis

Senior-engineer review of **57 git repositories** under the Elixirr/iOLAP internal portfolio: AI enablement boilerplates, academy training material, DSO tooling, MSDP data platform infrastructure, client delivery artifacts, and QA patterns.

**Prepared:** 2026-06-08 · **Scope:** `/Users/rosstweedie/Sites/edi`

---

## Key findings

- No substantive PHP or WordPress application code exists in this portfolio
- The only WordPress touchpoint is Cypress selectors against a demo page in `qa-cypress`
- Several clones are empty or stub-only (README on `main`, real code on unfetched branches)
- Highest-value repos for engineering standards adoption are the AI enablement boilerplates and secure SDLC agent pack
- Cross-cutting weakness: tests and CI lag behind documentation across most repos

**Recommended priority for PHP/WordPress teams:**

1. [`apps-cursor-ai-enablement`](/reports/edi-repos-analysis/03-ai-enablement-boilerplates#apps-cursor-ai-enablement) — AI-assisted delivery workflow reference
2. [`elixirr-secure-sdlc-agent-pack`](/reports/edi-repos-analysis/04-secure-sdlc-governance#elixirr-secure-sdlc-agent-pack) — security governance (includes PHP globs)
3. [`apps-ai-enablement-fastapi`](/reports/edi-repos-analysis/03-ai-enablement-boilerplates#apps-ai-enablement-fastapi) — module architecture pattern
4. [`apps-ai-enablement-netAPI`](/reports/edi-repos-analysis/03-ai-enablement-boilerplates#apps-ai-enablement-netapi) — boundary testing and CI enforcement
5. [`qa-cursor-ai-enablement`](/reports/edi-repos-analysis/09-qa-testing#qa-cursor-ai-enablement) — modern testing standards
6. [`pull-request-validation`](/reports/edi-repos-analysis/09-qa-testing#pull-request-validation) — PR gate pattern

---

## Report sections

| Section | Description |
|--------|-------------|
| [1. Executive summary](/reports/edi-repos-analysis/01-executive-summary) | Key findings and priority repos |
| [2. Portfolio overview](/reports/edi-repos-analysis/02-portfolio-overview) | Category counts, patterns, weaknesses, attention list |
| [3. AI enablement boilerplates](/reports/edi-repos-analysis/03-ai-enablement-boilerplates) | 11 Cursor and stack template repos |
| [4. Secure SDLC and governance](/reports/edi-repos-analysis/04-secure-sdlc-governance) | SSDLC agent pack, Cloud Buddy, AI plan repos |
| [5. Academy and LMS](/reports/edi-repos-analysis/05-academy-lms) | 12 training and course repositories |
| [6. DSO internal tooling](/reports/edi-repos-analysis/06-dso-internal-tooling) | Docker builds, scans, interview vault |
| [7. MSDP data platform](/reports/edi-repos-analysis/07-msdp-data-platform) | CloudFormation, dbt, Redshift, pipelines |
| [8. Client delivery and production](/reports/edi-repos-analysis/08-client-delivery-production) | Endeavor, ms-shared, ML lab, iolap-kb |
| [9. QA and testing](/reports/edi-repos-analysis/09-qa-testing) | QA enablement, Cypress, PR validation |
| [10. Front-end and infrastructure](/reports/edi-repos-analysis/10-frontend-and-infra) | CRA boilerplate, OpenAPI mock, CDK snippets |
| [11. Patterns and maturity](/reports/edi-repos-analysis/11-patterns-and-maturity) | Style summary and maturity matrix |
| [12. WordPress recommendations](/reports/edi-repos-analysis/12-wp-recommendations) | Adoption plan, leadership tiers, bottom line |

Start with the [executive summary](/reports/edi-repos-analysis/01-executive-summary).

---

## Bottom line

This portfolio is an **AI enablement and cloud training ecosystem**, not a WordPress codebase. The gap between these repos and typical WP delivery is **standardization**: Cursor rules as coding standards, architecture boundary enforcement, and CI as a non-negotiable merge gate. Those three practices transfer directly without requiring a stack change.

Source: [`research/edi-repos-analysis.md`](/research/edi-repos-analysis) (Dark Factory formatting pass, 2026-06-08).
