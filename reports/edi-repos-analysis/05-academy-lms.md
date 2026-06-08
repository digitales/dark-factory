---
title: Academy and LMS
description: Twelve training and course repositories — AWS, AI, data science, and tutorials.
---

# Academy and LMS

---

#### `admin-academy-aws`

| Field | Detail |
|-------|--------|
| **Purpose** | iOLAP Academy 2023 AWS course solutions: IMDb ingest → S3/Glue → API Gateway Lambda |
| **Tech stack** | Python 3, AWS Lambda, Glue, DynamoDB, S3, Athena/SQL views, CloudFormation, CodeBuild |
| **Organization** | `lambda/`, `glue/`, `sql/`, `dynamodb/`, `cicd/`, `s3/` |
| **Coding style** | Script-style Python; config dicts; module docstrings with route docs |
| **CI/testing** | `cicd/buildspec.yml` (mostly commented); no unit tests |
| **Advantages** | End-to-end data pipeline; documented AWS resource naming |
| **Disadvantages** | Hardcoded ARNs/buckets; `cdk/` empty; training-account coupling |
| **WP/PHP transfer** | Naming conventions for multi-tenant resources. Lambda proxy response shape similar to WP REST. |

---

#### `elixirr-academy-aws-academy-admin`

| Field | Detail |
|-------|--------|
| **Purpose** | Academy admin infrastructure — IMDb dataset ingestion and API Gateway for course participants |
| **Tech stack** | AWS Glue, Lambda (awswrangler), API Gateway, S3, CloudFormation/CodePipeline, Python 3 |
| **Organization** | `resources/{glue,lambda,s3}/`; `cicd/`; `scripts/`, `docs/` |
| **Coding style** | Functional Lambda handlers; env-var config with hardcoded fallbacks; module-level boto3 clients |
| **CI/testing** | CodePipeline on main push; no unit tests |
| **Advantages** | Complete admin-side data platform; partition-filtered API |
| **Disadvantages** | Hardcoded SNS ARNs/bucket names; DEBUG logging in prod paths |
| **WP/PHP transfer** | API Gateway Lambda proxy ≈ WP REST custom endpoints. CodePipeline deploy ≈ GitHub Actions → WP Engine deploy. |

---

#### `elixirr-academy-course-aws`

| Field | Detail |
|-------|--------|
| **Purpose** | Elixirr Academy AWS course — cloud ETL engine (DynamoDB config → Lambda extract → Glue transform → Redshift) |
| **Tech stack** | AWS Lambda, Glue, Step Functions, DynamoDB, S3, SNS, Athena/Redshift SQL, CloudFormation, Python |
| **Organization** | `resources/{lambda,glue,dynamodb,s3,sql,statemachine}/`; `docs/md/Day 1–8`; `cicd/` |
| **Coding style** | Script-style Lambda; global config dict; boto3 at module level |
| **CI/testing** | CodePipeline via CloudFormation; no unit tests |
| **Advantages** | End-to-end ETL narrative; day-by-day docs; event-driven architecture |
| **Disadvantages** | README/structure drift; hardcoded defaults; no automated tests |
| **WP/PHP transfer** | Event-driven ETL ≈ WP cron + Action Scheduler hooks chaining import jobs. DynamoDB config ≈ WP options table for job state. |

---

#### `elixirr-academy-course-ai`

| Field | Detail |
|-------|--------|
| **Purpose** | Academy AI course solutions — LangChain, RAG, vector stores, multi-agent, Streamlit, MCP chatbot demo |
| **Tech stack** | Python, Jupyter, LangChain/LangGraph, Streamlit, ChromaDB, Azure Search, OpenAI, MCP SDK; ~270 pinned packages |
| **Organization** | `notebooks/` (lessons 01–13); `data/` (large footprint); `MCP Example/` |
| **Coding style** | Notebook-centric; mix of `.ipynb` and `.py`; deprecated notebooks retained |
| **CI/testing** | None; manual notebook execution |
| **Advantages** | Broad AI curriculum; working MCP example with architecture diagram |
| **Disadvantages** | Huge data footprint; incomplete README; no test automation |
| **WP/PHP transfer** | MCP server/client ≈ WP Abilities API or custom REST tool endpoints for AI agents. |

---

#### `elixirr-academy-infra`

| Field | Detail |
|-------|--------|
| **Purpose** | AWS guardrails for Elixirr/iOLAP Academy accounts — scheduled resource scanning, SNS alerts, IAM provisioning, account teardown |
| **Tech stack** | AWS SAM, Python 3.11 Lambdas, Pipenv, boto3, CloudWatch alarms, SNS, DynamoDB/Glue/Lambda scanners |
| **Organization** | `template.yaml`; `lambdas/`; `scripts/`; `account_nuke/` |
| **Coding style** | Straightforward procedural Python; scanner classes with env-driven thresholds |
| **CI/testing** | Manual `sam build` / `sam deploy`; no pipeline or unit tests |
| **Advantages** | Clear operational purpose; parameterized limits; teardown scripts for academy lifecycle |
| **Disadvantages** | No automated tests; typo in SNS topic name; PowerShell nuke scripts Windows-centric |
| **WP/PHP transfer** | None directly |

---

#### `elixirr-ai-academy-final-tasks-2025`

| Field | Detail |
|-------|--------|
| **Purpose** | Monorepo of three capstone AI projects from 2025 academy cohort |
| **Sub-projects** | Content curator (Streamlit, LangGraph, Bedrock); tech interviews assistant (Streamlit, DynamoDB, Textract); outreach system (partial) |
| **Coding style** | Streamlit-first, script-style Python; mixed maturity |
| **CI/testing** | None; committed build artifacts in outreach project |
| **Advantages** | Realistic AI use cases |
| **Disadvantages** | Inconsistent docs; invalid `requirements.txt` entries; no shared standards |
| **WP/PHP transfer** | None directly |

---

#### `elixirr-ai-academy-final-tasks-2026-azure`

| Field | Detail |
|-------|--------|
| **Purpose** | Four team capstone projects on Azure — AI agents, RAG, operational dashboards |
| **Sub-projects** | AirAware (FastAPI, Cosmos DB, LangGraph); FoodLens (Streamlit, Azure AI Search); NewsRisk (Azure Functions, LangGraph); RetailWeather (FastAPI, React, Cosmos DB) |
| **Coding style** | 2026 cohort more structured — Pydantic models, repository pattern, router modules |
| **CI/testing** | RetailWeather has tests; others minimal |
| **Advantages** | RetailWeather is production-shaped (graceful degradation, API docs, env reference) — best academy architecture reference |
| **Disadvantages** | Placeholder READMEs on some teams; no shared CI pipeline |
| **WP/PHP transfer** | RetailWeather's separation of deterministic rules from LLM explanation — good pattern for WP AI features. |

---

#### `ds-intro-code`

| Field | Detail |
|-------|--------|
| **Purpose** | LMS companion for iOLAP Data Science Introduction — Jupyter notebooks aligned to Müller/Guido ML textbooks |
| **Tech stack** | Python 3, Jupyter, scikit-learn 0.24, pandas 1.3, matplotlib 3.3, numpy 1.19 |
| **Organization** | Flat — 24 notebooks by chapter |
| **CI/testing** | None |
| **Advantages** | Clear pedagogical progression |
| **Disadvantages** | Stale dependency pins; no automated validation |
| **WP/PHP transfer** | Shared helper modules ≈ theme `inc/` utilities. Environment setup docs ≈ Local WP + Composer onboarding. |

---

#### `lms-react-course`

| Field | Detail |
|-------|--------|
| **Purpose** | React training course content (markdown lessons), not a runnable app |
| **Tech stack** | Markdown only |
| **CI/testing** | None |
| **Advantages** | Clear pedagogical intent for SPA concepts |
| **Disadvantages** | Essentially a stub; single lesson file |
| **WP/PHP transfer** | SPA vs server-rendered pages — directly relevant for headless WP vs traditional PHP theme rendering. |

---

#### `lms-devops-kubernetes`

| Field | Detail |
|-------|--------|
| **Purpose** | LMS course material for provisioning Kubernetes cluster on EC2 via Ansible |
| **Tech stack** | Ansible, Ubuntu 22.04, kubeadm, EC2 |
| **CI/testing** | None; manual ansible-playbook execution |
| **Advantages** | Practical hands-on K8s bootstrap path |
| **Disadvantages** | Incomplete (TODO sections); stale EC2 hostnames in README |
| **WP/PHP transfer** | None directly |

---

#### `hasura-web-api-tutorial`

| Field | Detail |
|-------|--------|
| **Purpose** | Hands-on Hasura GraphQL tutorial with Express backend, Docker Compose, JWT (RS256) |
| **Tech stack** | Hasura GraphQL Engine v2.39, Postgres 15, Express/Node.js 20, Docker Compose |
| **Organization** | `docker-compose.yml`; `hasura-tutorial-backend/`; `hasura-tutorial-completed/`; `queries/` |
| **CI/testing** | `npm test` stub; manual docker-compose |
| **Advantages** | Self-contained local stack; JWT auth pattern documented |
| **Disadvantages** | Committed keys/secrets (intentional for learning); no automated tests |
| **WP/PHP transfer** | JWT role-based access and GraphQL BFF patterns vs WP REST API — auth boundary design is transferable. |

---

#### `ARKit-Tutorial`

| Field | Detail |
|-------|--------|
| **Purpose** | Finished iOS ARKit tutorial — image tracking on Pokémon cards, overlay 3D models |
| **Tech stack** | Swift, UIKit, ARKit, SceneKit, Xcode |
| **CI/testing** | None |
| **Advantages** | Small, complete demo |
| **Disadvantages** | No tests, no modularization, storyboard-based |
| **WP/PHP transfer** | Minimal direct relevance |

---
