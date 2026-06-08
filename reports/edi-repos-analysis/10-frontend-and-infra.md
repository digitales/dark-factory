---
title: Front-end boilerplates and infrastructure
description: TypeScript CRA boilerplate, OpenAPI mock backend, and AWS/Azure/CDK snippets.
---

# Front-end boilerplates and utilities

---

#### `kb-cra-typescript-boilerplate`

| Field | Detail |
|-------|--------|
| **Purpose** | Reference React SPA — Clean Architecture + MVVM for iOLAP web teams |
| **Tech stack** | React 17, TypeScript 4, CRA + CRACO, MobX, Material-UI v4, Husky, lint-staged, commitlint |
| **Organization** | `domain/` → `data/` → `presentation/` with ViewModel suffix convention |
| **CI/testing** | Husky pre-commit; commitlint; minimal actual tests |
| **Advantages** | Strong architectural template; conventional commits + changelog |
| **Disadvantages** | Aging stack (React 17, MUI v4); no CI/CD |
| **WP/PHP transfer** | Clean Architecture layering maps to Laravel/WordPress plugin structure |

---

#### `oasisaws`

| Field | Detail |
|-------|--------|
| **Purpose** | OpenAPI-driven mock backend for iOS/mobile teams — contract-first API without waiting on backend |
| **Tech stack** | Swift 5.10, Vapor 4, Apple Swift OpenAPI Generator/Runtime, OpenAPI 3.1 YAML |
| **Organization** | SPM layout; single executable target |
| **Advantages** | Strong contract-first pattern; build-time codegen reduces drift |
| **Disadvantages** | Repo name suggests AWS but implementation is local Vapor only; no tests |
| **WP/PHP transfer** | OpenAPI-first mocks ≈ WP REST schema-driven stubs or contract testing for headless frontends |

---

### Infrastructure snippets

---

#### `aws-landing-zone`

| Field | Detail |
|-------|--------|
| **Purpose** | AWS Control Tower landing zone documentation |
| **Tech stack** | Markdown + SVG diagrams only |
| **Advantages** | Clear multi-account model (Master, Log, Audit, Prod, Non-Prod, Shared Services) |
| **Disadvantages** | No IaC, no automation |
| **WP/PHP transfer** | Account/environment separation thinking for hosting WP across dev/stage/prod AWS accounts |

---

#### `azure-devops-pipelines`

| Field | Detail |
|-------|--------|
| **Purpose** | BI infrastructure promotion — Azure Data Factory + resource group ARM templates |
| **Tech stack** | Azure DevOps YAML, PowerShell, Python, Azure CLI |
| **Organization** | `bi-adf/`; `bi-resources/` |
| **Coding style** | Parameterized pipelines; sed-based env substitution; git commit-back of modified templates |
| **Advantages** | Real promotion workflow with stop/start ADF triggers, diff comparison scripts |
| **Disadvantages** | Placeholder secrets/IDs; heavily client-specific |
| **WP/PHP transfer** | Promotion pipeline pattern for WP: export config → transform for env → deploy → smoke test |

---

#### `cdk-https-redirect`

| Field | Detail |
|-------|--------|
| **Purpose** | One-shot HTTPS redirect (S3 + ACM + CloudFront + Route53) via CDK |
| **Tech stack** | AWS CDK v1 Python, `aws_route53_patterns.HttpsRedirect` |
| **Advantages** | Solves painful manual AWS task in ~25 lines; context-driven config |
| **Disadvantages** | CDK v1; no tests; aging pattern |
| **WP/PHP transfer** | Useful for domain redirects on marketing/WP sites |

---

#### `cdk-lambda-s3`

| Field | Detail |
|-------|--------|
| **Purpose** | Scheduled Lambda pulls external API data → S3 (holidayapi example) |
| **Tech stack** | AWS CDK v1 Python, Lambda Python bundling, Secrets Manager, EventBridge cron, S3 |
| **Advantages** | Shows secrets + scheduled Lambda + S3 write pattern |
| **Disadvantages** | Python 3.8 runtime; CDK v1 |
| **WP/PHP transfer** | Scheduled sync jobs — WP cron + Action Scheduler pulling external APIs; secrets via env ARN not inline values |

---

#### `react-web-dev-exercise`

| Field | Detail |
|-------|--------|
| **Purpose** | Intended React web dev exercise |
| **Status** | Empty — git repo with zero commits |

---

#### `msdl`

| Field | Detail |
|-------|--------|
| **Purpose** | Unknown — local checkout is empty git repository |
| **Remote** | CodeCommit `msdl` (us-east-1) |
| **Status** | No working tree files; needs `git pull` before assessment |

---
