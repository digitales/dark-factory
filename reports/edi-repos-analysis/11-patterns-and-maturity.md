---
title: Coding patterns and maturity matrix
description: Cross-portfolio style patterns and comparative maturity ratings.
---

# Coding style summary

| Pattern | Where dominant | Quality |
|---------|----------------|---------|
| Layered architecture (`core/` + `modules/`) | FastAPI boilerplates, RetailWeather | High |
| Clean Architecture + CQRS | .NET boilerplate, kb-cra-typescript | High |
| Cursor rules as code standards | All enablement repos | High (where maintained) |
| Script-style procedural Python | Academy AWS, Endeavor ETL, ms-shared | Medium (ops heritage) |
| Notebook-centric | ds-intro-code, elixirr-academy-course-ai | Low (educational) |
| Policy-as-markdown | elixirr-secure-sdlc-agent-pack | High |
| Legacy / dated tooling | qa-cypress, Endeavor buildspec, kb-cra | Needs refresh |

---

## Comparative maturity matrix

| Repository | Doc quality | Architecture | CI | Tests | Production readiness |
|------------|-------------|--------------|-----|-------|---------------------|
| elixirr-secure-sdlc-agent-pack | ★★★★★ | N/A (guidance) | — | — | High (as agent pack) |
| apps-cursor-ai-enablement | ★★★★★ | ★★★★ | ☆ | ★★★ | ★★★★ (enablement) |
| qa-cursor-ai-enablement | ★★★★★ | ★★★★ | ☆ | ★★★★ | ★★★★ (enablement) |
| apps-ai-enablement-netAPI | ★★★★ | ★★★★★ | ★★★★ | ★★★★ | ★★★★ |
| team4-RetailWeather (2026) | ★★★★★ | ★★★★★ | ☆ | ★★☆ | ★★★★ |
| pull-request-validation | ★★★ | ★★★★ | ★★★★ | ☆ | ★★★★ |
| iolap-kb | ★★★★ | ★★★☆ | ★★★★ | ☆ | ★★★★ |
| msdp-infrastructure-templates | ★★☆ | ★★★★ | ☆ | ☆ | ★★★ |
| endeavor-aws-datalake | ★★☆ | ★★★ | ★★★★ | ☆ | ★★★★ (ops) |
| kb-cra-typescript-boilerplate | ★★☆ | ★★★★ | ☆ | ★☆ | ★★★ (template) |
| danske-bank-wp2-cloud-buddy | ★★☆ | ★★★★ | ★★★★ | ★★★ | ★★★★ (client) |
| 2025 academy finals | ★★☆ | ★★ | ☆ | ☆ | ★★ |
| qa-cypress | ★ | ★★ | ☆ | ★ | ★ (dated) |
| Empty/stub repos | — | — | — | — | — |

---
