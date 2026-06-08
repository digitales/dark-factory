---
title: Client delivery and production
description: Endeavor datalake, ms-shared, ML lab, PII R&D, and internal knowledge base.
---

# Client delivery and production

---

#### `endeavor-aws-datalake`

| Field | Detail |
|-------|--------|
| **Purpose** | Serverless data lake ingestion for Endeavor (oil/gas) — S3-triggered Lambda ETL, Snowflake wrapper, Glue deployment |
| **Tech stack** | Serverless Framework, Python, AWS Wrangler, CodeBuild; Node.js 12.x in CI (EOL) |
| **Organization** | `lambda-ue2-datalake-ingestion/` with per-table fix modules; supporting Lambdas; `glue-deployment/` |
| **Coding style** | Legacy ETL — long handlers, table-specific fix modules, env config from S3 JSON |
| **CI/testing** | CodeBuild pipeline; no unit tests |
| **Advantages** | Mature cross-account deployment; modular fix library |
| **Disadvantages** | Monolithic handlers; Node 12 in buildspec is EOL; high operational complexity |
| **WP/PHP transfer** | Event-driven ingestion pattern — analogous to WP cron/webhook pipelines at architecture level |

---

#### `endeavor-infrastructure`

| Field | Detail |
|-------|--------|
| **Purpose** | CloudFormation templates and CodePipeline for Endeavor AWS multi-account deployment |
| **Tech stack** | CloudFormation YAML/JSON, CodePipeline, CodeBuild, cross-account roles |
| **Organization** | `pipeline/pipeline.yml`; `cloudformation-stacks/`; `environment.md` |
| **Advantages** | Clear multi-account model; pairs with datalake repo |
| **Disadvantages** | README is one line; legacy pipeline files retained |
| **WP/PHP transfer** | None directly |

---

#### `ms-shared`

| Field | Detail |
|-------|--------|
| **Purpose** | Shared managed-services scripts, SQL, Bash crons, CDK stacks across iOLAP clients |
| **Tech stack** | Python Lambdas, AWS CDK, Bash, SQL, Jupyter, Splunk — client folders: Associated Bank, Whataburger, Shaw, Volvo, etc. |
| **Organization** | Client-first top level; iOLAP_Internal has CDK apps; extensive Bash/SQL ops scripts per client |
| **Coding style** | Ops-script heritage — pragmatic, client-specific, mixed Windows/Linux |
| **CI/testing** | Per-project manual CDK deploy; one stack has unit tests; most scripts untested |
| **Advantages** | Real production ops knowledge; cross-client reuse of patterns |
| **Disadvantages** | Monorepo sprawl; high onboarding cost; no top-level README |
| **WP/PHP transfer** | None directly |

---

#### `ml-lab-anomaly-detection-associatedbank`

| Field | Detail |
|-------|--------|
| **Purpose** | ML Lab package — extract Associated Bank credit-card transactions from Snowflake for anomaly detection |
| **Tech stack** | Python package, Snowflake connector, pandas, SQL, Jupyter |
| **Organization** | `src/anomaly_detection_ab/`; `data/raw/`, `data/artifacts/`; `notebooks/` |
| **Advantages** | Clear domain documentation; proper packaging via `pyproject.toml` |
| **Disadvantages** | Credentials in JSON (local only); pipeline step 3 TBD; no tests |
| **WP/PHP transfer** | None directly |

---

#### `nvisnx-rnd`

| Field | Detail |
|-------|--------|
| **Purpose** | PII detection R&D using Microsoft Presidio on breach-style documents |
| **Tech stack** | Python 3, presidio_analyzer, custom utils |
| **Coding style** | Classic OOP Controller; print-based logging; research-grade, not production |
| **CI/testing** | None; committed analysis outputs |
| **Advantages** | Clear pipeline: read → Presidio analyze → postprocess → write |
| **Disadvantages** | No dependency manifest; committed PII-adjacent outputs are data-handling risk |
| **WP/PHP transfer** | PII scanning before content ingest — useful for WP media/document pipelines or GDPR workflows |

---

#### `tb-ds-dev-poc`

| Field | Detail |
|-------|--------|
| **Purpose** | POC artifacts for Tesco Bank DataStage deployment — must not contain client proprietary code |
| **Tech stack** | AWS CloudFormation — IBM WebSphere Liberty Quick Start template |
| **Advantages** | Focused POC scope; clear data boundary in README |
| **Disadvantages** | Single artifact; no automation beyond template |
| **WP/PHP transfer** | None — different enterprise stack (Java/Liberty/DataStage) |

---

#### `iolap-kb`

| Field | Detail |
|-------|--------|
| **Purpose** | Internal iOLAP knowledge base — interview banks, SA documentation; MkDocs → S3 + nginx + oauth2-proxy (Azure SSO) |
| **Tech stack** | MkDocs, custom theme, CloudFormation CI/CD, nginx, oauth2-proxy |
| **Organization** | `docs/` by SA area; `mkdocs.yml`; `ci-cd-infra/`; `src/` for nginx/oauth2-proxy configs |
| **CI/testing** | CodePipeline (CodeCommit → CodeBuild → S3) |
| **Advantages** | Mature deployment pipeline; SSO-protected internal KB |
| **Disadvantages** | Manual oauth2-proxy rebuild on EC2 is fragile |
| **WP/PHP transfer** | Content repo + CI → static hosting analogous to headless doc sites alongside WP |

---
