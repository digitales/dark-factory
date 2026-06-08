---
title: MSDP data platform
description: CloudFormation templates, dbt, Redshift, and serverless pipeline repos.
---

# MSDP data platform

---

#### `msdp-infrastructure-templates`

| Field | Detail |
|-------|--------|
| **Purpose** | CloudFormation templates for MSDP AWS infrastructure: networking, data lake, Glue, Redshift, dbt pipeline, Power BI gateway |
| **Tech stack** | AWS CloudFormation YAML, shell, CodePipeline/CodeBuild, S3, Lake Formation, Glue, Redshift, DynamoDB, ECS |
| **Organization** | Numbered domains: `00_networking` through `99_Additions`; `templates_with_hardcoded_values.txt`; `TODO.md` |
| **Coding style** | Parameterized CFN with validation; some hardcoded client names |
| **CI/testing** | No in-repo CI; drift detection expected operationally |
| **Advantages** | Modular, environment-aware; cross-account patterns |
| **Disadvantages** | Incomplete docs; hardcoded values; `work-in-progress` default branch |
| **WP/PHP transfer** | Infrastructure-as-templates with drift as first-class concern — analogous discipline for WP hosting/IaC |

---

#### `msdp-dbt`

| Field | Detail |
|-------|--------|
| **Purpose** | dbt transformation layer for MSDP serverless pipeline |
| **Tech stack** | dbt (implied), AWS Glue/Lambda upstream, CodeCommit, CodePipeline |
| **Status** | Stub on `main` — real code on `dev`/`prod` branches per README |
| **WP/PHP transfer** | None |

---

#### `msdp-redshift`

| Field | Detail |
|-------|--------|
| **Purpose** | Redshift DDL/DML and warehouse setup for MSDP |
| **Status** | Stub on `main` — real code on `DEV`/`PROD` branches |
| **WP/PHP transfer** | None |

---

#### `msdp-serveless-data-pipeline`

| Field | Detail |
|-------|--------|
| **Purpose** | Serverless ingestion/transformation using AWS Glue and Lambda |
| **Status** | Stub on `main` — real code on `dev`/`prod` branches. Typo in repo name ("serveless") |
| **WP/PHP transfer** | None |

---
