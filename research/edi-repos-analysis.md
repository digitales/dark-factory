# EDI Repository Portfolio Analysis

**Prepared for:** Dark Factory formatting and summarisation  
**Date:** 2026-06-08  
**Scope:** 57 git repositories under `/Users/rosstweedie/Sites/edi`  
**Author perspective:** Senior engineer review

---

## Executive summary

This directory contains **57 git repositories** forming an **Elixirr/iOLAP internal portfolio**: AI enablement boilerplates, academy training material, DSO tooling, MSDP data platform infrastructure, client delivery artifacts, and QA patterns.

**Key findings:**

- No substantive PHP or WordPress application code exists in this portfolio
- The only WordPress touchpoint is Cypress selectors against a demo page in `qa-cypress`
- Several clones are empty or stub-only (README on `main`, real code on unfetched branches)
- Highest-value repos for engineering standards adoption are the AI enablement boilerplates and secure SDLC agent pack
- Cross-cutting weakness: tests and CI lag behind documentation across most repos

**Recommended priority for PHP/WordPress teams:**

1. `apps-cursor-ai-enablement` — AI-assisted delivery workflow reference
2. `elixirr-secure-sdlc-agent-pack` — security governance (includes PHP globs)
3. `apps-ai-enablement-fastapi` — module architecture pattern
4. `apps-ai-enablement-netAPI` — boundary testing and CI enforcement
5. `qa-cursor-ai-enablement` — modern testing standards
6. `pull-request-validation` — PR gate pattern

---

## Portfolio overview

| Category | Count | Maturity | Primary value |
|----------|-------|----------|---------------|
| AI enablement boilerplates | 11 | High (where populated) | Cursor rules, agent workflows, stack templates |
| Academy / LMS | 12 | Medium | Training material, capstone projects |
| DSO internal tooling | 8 | Medium | Docker builds, security scans, Cursor configs |
| Data platform (MSDP) | 4 | Stub locally | CloudFormation topology |
| Client / production | 6 | Medium–High | Real delivery patterns |
| QA / testing | 2 | Mixed | Modern vs legacy E2E |
| Infra / DevOps | 6 | Medium | Pipelines, landing zones, CDK |
| Tutorials / POCs / empty | 8 | Low | Reference or placeholder |

### Cross-cutting patterns

- **CodeCommit-first** — few GitHub Actions; CI often in CodePipeline/CloudFormation
- **Cursor-as-engineering-standard** — `.cursor/rules/`, skills, hooks, `AGENTS.md`
- **Thin transport, thick service** — FastAPI routes / .NET endpoints delegate to services
- **Tests lag behind docs** — many repos describe testing; fewer enforce it in CI
- **Shallow clones** — MSDP and several DSO repos need branch fetches before review

### Common weaknesses

- Hardcoded ARNs, bucket names, SNS topics in training/client repos
- Tests described but not enforced in CI
- Empty or stub local clones masking real code on other branches
- Committed artifacts (`node_modules/`, build outputs, analysis files)

---

## Repos requiring attention before use

| Repository | Issue |
|------------|-------|
| `apps-ai-enablement-node` | Empty repo |
| `apps-ai-enablement-shared` | Empty repo |
| `dso-common-code` | Empty locally |
| `dso-ai-enablement-tf-azure` | Empty locally |
| `msdl` | Empty locally |
| `data-enigneering-ai-enablement` | README scaffold only |
| `dso-ai-enablement-tf-aws` | Stubs only, no `.tf` files |
| `msdp-dbt` | Code on unfetched `dev`/`prod` branches |
| `msdp-redshift` | Code on unfetched `DEV`/`PROD` branches |
| `msdp-serveless-data-pipeline` | Code on unfetched branches |
| `react-web-dev-exercise` | Zero commits |
| `apps-ai-enablement-cdk` | No deployable stacks in clone |
| `apps-ai-enablement-react` | Cursor config only, no app source |

---

## Repository analysis

### AI enablement boilerplates

---

#### `apps-cursor-ai-enablement`

| Field | Detail |
|-------|--------|
| **Purpose** | Full-stack workshop demo (FastAPI + Angular) for Cursor AI enablement — task/project management with multi-agent orchestration |
| **Tech stack** | Python 3.12, FastAPI, SQLAlchemy async, Angular 19, Tailwind 4, FastMCP, pytest, ruff, bandit, mypy |
| **Organization** | `backend/app/` (models, routes, schemas, services) + `frontend/src/app/`; extensive `.cursor/agents/`, hooks, skills |
| **Coding style** | Multi-agent orchestration; pre-write lint hook blocks bad Python; service layer shared by REST + MCP |
| **CI/testing** | pytest suite; pre-commit (ruff, mypy, bandit); no GitHub Actions |
| **Advantages** | End-to-end reference for AI-assisted feature delivery; MCP security docs; richest `.cursor/` setup |
| **Disadvantages** | Workshop-specific; SQLite dev DB; frontend on Karma/Jasmine while Angular boilerplate uses Jest |
| **WP/PHP transfer** | Primary template to copy: rules + hooks + agent roles + thin REST layer. MCP over WP REST for AI tool integration. Orchestrator pattern for complex plugin features. |

---

#### `apps-ai-enablement-angular`

| Field | Detail |
|-------|--------|
| **Purpose** | Angular 21 production boilerplate with Cursor AI init workflow |
| **Tech stack** | Angular 21, Material, Jest, ESLint, Prettier, SCSS, standalone components, zoneless |
| **Organization** | `core/` (singletons, interceptors), `shared/`, `components/`, `services/`, `models/`, `layouts/`; path aliases |
| **Coding style** | OnPush + signals; functional interceptors; co-located `*.spec.ts`; 15+ `.cursor/rules/*.mdc` |
| **CI/testing** | Local scripts only (`lint`, `test`, `build`); no GitHub Actions |
| **Advantages** | Mature conventions; hybrid baseline vs optional workflows; internal rollout docs |
| **Disadvantages** | Heavy `.cursor/` surface; no CI; CodeCommit-first onboarding |
| **WP/PHP transfer** | Layer constraints → plugin namespaces. Path aliases → PSR-4. Definition of done: lint → test → build → PHPCS → PHPUnit → asset build. |

---

#### `apps-ai-enablement-fastapi`

| Field | Detail |
|-------|--------|
| **Purpose** | FastAPI foundation for async APIs with PostgreSQL |
| **Tech stack** | FastAPI, Uvicorn, SQLAlchemy 2 async, Alembic, Pydantic v2, uv, Ruff, Docker Compose |
| **Organization** | `app/core/` (config, DB, auth providers, middleware) vs `app/modules/{feature}/` (router, service, repository, models, schemas) |
| **Coding style** | Dependency injection via `Depends()`; pluggable auth (local JWT / Cognito); generic `BaseRepository` |
| **CI/testing** | Ruff only; tests documented in AGENTS.md but thin in practice |
| **Advantages** | Closest backend analogue to clean WP plugin structure; ADR references; auth provider pattern |
| **Disadvantages** | Tests gap; minimal feature set (items CRUD only) |
| **WP/PHP transfer** | Highest-value PHP pattern: `core/` + `modules/` mirrors WP plugin with `includes/core/` + feature submodules. Auth provider factory → swappable auth backends. Alembic → dbDelta migrations with version tracking. |

---

#### `apps-ai-enablement-netAPI`

| Field | Detail |
|-------|--------|
| **Purpose** | Clean Architecture template (Todos + Users) |
| **Tech stack** | .NET 10, EF Core, PostgreSQL, CQRS, FluentValidation, Serilog, Seq, JWT auth, Docker |
| **Organization** | `Domain/` → `Application/` → `Infrastructure/` → `Web.Api/`; `SharedKernel/`; minimal API endpoints per use case |
| **Coding style** | Primary constructors; explicit types; `Result` type; domain events; permission-based authorization |
| **CI/testing** | GitHub Actions (restore, build, test, publish); NetArchTest layer dependency tests; Dependabot |
| **Advantages** | Enforced architecture; only repo with automated CI + architecture tests; mature cross-cutting concerns |
| **Disadvantages** | Heavier than WP teams typically need; .NET-specific |
| **WP/PHP transfer** | NetArchTest → Deptrac for layer boundaries. Result/error types → `WP_Error` or custom result objects. Endpoint-per-use-case → one REST route class per action. CI as minimum bar. |

---

#### `apps-ai-enablement-cdk`

| Field | Detail |
|-------|--------|
| **Purpose** | AWS CDK (Python) monorepo template for AI Enablement team |
| **Tech stack** | Python 3.14, AWS CDK v2, pipenv, Black/isort/flake8/mypy, pytest, syrupy, cdk-nag |
| **Organization** | Documented module layout (`handlers/`, `stacks/component.py`, constructs); no deployable modules in clone |
| **Coding style** | L2-first, `grant_*` IAM, Powertools on Lambdas, snapshot tests, logical ID pinning |
| **CI/testing** | Documented per-module pytest; no pipeline in repo |
| **Advantages** | Strongest IaC conventions doc in the set; security/observability rules baked into Cursor |
| **Disadvantages** | Empty of actual stacks in clone; Python 3.14 is bleeding-edge |
| **WP/PHP transfer** | Construct vs stack separation → Terraform modules. Snapshot/IaC tests → hosting infra. Env-aware removal policies → staging vs prod DB migrations. |

---

#### `apps-ai-enablement-react`

| Field | Detail |
|-------|--------|
| **Purpose** | Cursor AI configuration boilerplate only — no application source |
| **Tech stack (documented)** | Next.js 15 or React/Vite + TanStack Router, Tailwind v4, shadcn, Vitest, Playwright |
| **Organization** | `.cursor/` with init wizard (`init.sh`), rules variants, agents, hooks, 40+ skills |
| **Coding style** | Two-phase init (bash scaffold + AI wiring); placeholder `{{CLIENT_NAME}}` tokens |
| **CI/testing** | Hooks run `tsc` + vitest on stop; no app to test in clone |
| **Advantages** | Most comprehensive front-end AI enablement pack; OWASP-focused security reviewer agent |
| **Disadvantages** | Not runnable until copied and initialized |
| **WP/PHP transfer** | Init wizard pattern for new WP block themes. Scoped rules by glob → PHPCS rules per `includes/`, `blocks/`, `theme.json`. Blocking shell hooks → prevent destructive WP-CLI in agent sessions. |

---

#### `apps-ai-enablement-node`

| Field | Detail |
|-------|--------|
| **Purpose** | Placeholder — empty repo (`.git` only) |
| **Tech stack** | N/A |
| **Advantages** | Reserved namespace |
| **Disadvantages** | No code, README, or manifest |
| **WP/PHP transfer** | Intended slot for Node boilerplate (likely Express/Nest mirror of FastAPI family) |

---

#### `apps-ai-enablement-shared`

| Field | Detail |
|-------|--------|
| **Purpose** | Placeholder — empty repo |
| **Tech stack** | N/A |
| **WP/PHP transfer** | Likely intended for shared OpenAPI specs, design tokens, or cross-stack contracts — same idea as shared Composer package |

---

#### `ai-coding-fundamentals-lms-course`

| Field | Detail |
|-------|--------|
| **Purpose** | Hands-on demo for "AI Coding Assistant Fundamentals" LMS course |
| **Tech stack** | TypeScript, Express, ts-node, Jest |
| **Organization** | Classic layered: `routes/` → `services/` → `models/` + `utils/`; in-memory store |
| **Coding style** | Named exports; explicit validation in routes; `{ error: string }` responses; minimal deps |
| **CI/testing** | Jest; no CI workflow |
| **Advantages** | Deliberately small; README maps exercises to modules; `.cursorignore` included |
| **Disadvantages** | No auth/DB; intentionally incomplete for exercises |
| **WP/PHP transfer** | Best starter template for teaching Cursor on PHP teams — replicate as tiny WP REST plugin with parallel module exercises. |

---

#### `dso-cursor-ai-enablement`

| Field | Detail |
|-------|--------|
| **Purpose** | DSO Cursor AI enablement demo — task/project management app (FastAPI + Angular 19) plus curated `.cursor/` rules, commands, and skills for IaC, CI/CD, and architecture diagram generation |
| **Tech stack** | Python 3.12, FastAPI, SQLAlchemy async, SQLite, Pydantic v2, uv, Ruff, mypy, bandit, pytest; Angular 19 standalone, Tailwind CSS 4 |
| **Organization** | `backend/app/`; `frontend/src/`; `.cursor/` with rules, commands, skills; `docs/architecture.md` |
| **Coding style** | Modern Python (strict mypy, Ruff with security rules); rules enforce OIDC-only CI, least-privilege IAM |
| **CI/testing** | Backend pytest; no committed pipeline YAML — skills generate it |
| **Advantages** | Best DSO enablement reference; provider-specific example guides reduce AI hallucination |
| **Disadvantages** | Demo app only; no committed CI; SQLite not production-representative |
| **WP/PHP transfer** | Glob-scoped `.mdc` rules ≈ PHPCS paths + PHPStan level per directory. Always-on security rules ≈ capability checks. Handover command ≈ site audit checklist before launch. |

---

#### `mbl-cursor-ai-enablement`

| Field | Detail |
|-------|--------|
| **Purpose** | Demo React Native todo app + curated Cursor AI configuration for Dev/QA enablement workshops |
| **Tech stack** | React Native 0.84, React 19, TypeScript 5.8, Jest, AsyncStorage |
| **Organization** | App root + `.cursor/rules/`, skills, commands, agents including `security-reviewer.md` |
| **Coding style** | Intentionally simple app; rules enforce named exports, StyleSheet.create, testID selectors, conventional commits |
| **CI/testing** | Jest smoke tests; no CI pipeline |
| **Advantages** | Excellent enablement artifact mapping Cursor artifact types to use cases |
| **Disadvantages** | Demo app is trivial by design; no E2E despite QA skills mentioning them |
| **WP/PHP transfer** | Codifying team standards in `.cursor/rules` directly reusable for WP block/theme repos. |

---

#### `edi-mbl-react-native-expo-cursor-poc`

| Field | Detail |
|-------|--------|
| **Purpose** | Generic Cursor AI configuration POC for React Native/Expo mobile — no app source; copy `.cursor/` into real Expo project |
| **Tech stack (documented)** | Expo SDK 54/55, Expo Router, Firebase Auth, NativeWind v5, React Query 5, Zustand, Maestro E2E, EAS Build/Update |
| **Organization** | 20 shared + 5 variant rules; blocking hooks; agents; skills; `docs/adr/` (7 ADRs) |
| **Coding style** | Placeholder-driven; exhaustive rule coverage; MASVS-anchored security reviewer; symlink variant system |
| **CI/testing** | Documented EAS CI gates in rules; hook scripts enforce local quality |
| **Advantages** | Most mature mobile Cursor setup; blocking hooks; ADR discipline |
| **Disadvantages** | POC only; SDK version inconsistency (54 vs 55); requires MCP setup |
| **WP/PHP transfer** | Variant symlink system ≈ child theme vs block theme rule sets. ADRs ≈ `docs/adr/` in WP agencies. Blocking hooks ≈ Husky preventing destructive git ops. |

---

### Secure SDLC and agent governance

---

#### `elixirr-secure-sdlc-agent-pack`

| Field | Detail |
|-------|--------|
| **Purpose** | Codifies Elixirr Secure SDLC into Cursor rules, skills, and shared markdown guidance for agent-assisted delivery |
| **Tech stack** | Markdown (`.md`, `.mdc`), Cursor agent configuration — no application runtime |
| **Organization** | `shared/` (16 SSDLC principle docs); `.cursor/rules/` (22 scoped rules); `.cursor/skills/` (20 review workflows) |
| **Coding style** | Policy-as-markdown; rules use globs for file-type scoping; traceability to SSDLC source enforced |
| **CI/testing** | N/A — content repo |
| **Advantages** | Comprehensive coverage (mobile, AI, data pipelines, IaC); explicit "do not add policy without SSDLC backing" |
| **Disadvantages** | No standalone commands yet; effectiveness depends on team adoption |
| **WP/PHP transfer** | `03-secure-coding.mdc` explicitly includes `**/*.php` in globs — secure coding guidance applies directly. Import into WP plugin/theme repos. |

---

#### `danske-bank-wp2-cloud-buddy-ai-agent`

| Field | Detail |
|-------|--------|
| **Purpose** | Danske Bank "Cloud Buddy" — enterprise AI agent platform for incident management, public cloud services, App2Cloud onboarding. Teams bot, RAG ingestion, Bedrock AgentCore |
| **Tech stack** | Python 3.11–3.12, LangGraph/Strands, AWS Bedrock AgentCore, MCP, boto3, Terraform, Microsoft Teams SDK, GitHub Actions, Docker/ECR |
| **Organization** | `ai-agents/` (runtimes, workflows, MCP tools, ingestion, Terraform); `teams-integration/`; domain split by workstream |
| **Coding style** | Pydantic settings, structured logging, pytest with live AWS integration tests |
| **CI/testing** | Per-workflow GitHub Actions (Ruff, pytest, Docker build/push, deploy) |
| **Advantages** | Production-grade agent architecture; MCP tools vs workflows separation; extensive operational runbooks |
| **Disadvantages** | High complexity; fragmented CI; outdated Terraform; client-specific credentials. Note: "wp2" is project name, not WordPress |
| **WP/PHP transfer** | MCP tools ≈ REST endpoints with permission callbacks. SSM parameter registry ≈ WP options/transients. Agent orchestration ≈ plugin hook lifecycle. |

---

#### `data-engineering-ai-plan`

| Field | Detail |
|-------|--------|
| **Purpose** | AI–human pipeline: meeting transcript → BRD → data model + tech spec → architecture. Deterministic Python ingest; LLM via Cursor Agent Skills |
| **Tech stack** | Python, Click CLI, Pydantic v2, PyYAML, python-docx, pytest (19 modules, fully offline) |
| **Organization** | `src/` (CLI, normalizers); `.cursor/skills/` (5 generation skills); `outputs/` (versioned artefacts); `tests/` |
| **Coding style** | Excellent docstrings; explicit maturity/version contracts; collision-safe batch naming; auditable artefact graph |
| **CI/testing** | No CI; pytest runs fully offline; refresh scripts for audit trails |
| **Advantages** | Best-in-set documentation; human-in-the-loop by design; deterministic ingest separated from non-deterministic generation |
| **Disadvantages** | Cursor-dependent for full value; Windows-centric setup docs |
| **WP/PHP transfer** | Tiered artefact graph ≈ content hierarchy. Version/maturity gates ≈ post status workflow. Normalizer CLI ≈ WP-CLI import commands. |

---

#### `data-enigneering-ai-enablement`

| Field | Detail |
|-------|--------|
| **Purpose** | Planned shared AI enablement library for data engineering — rules, skills, templates, platform overlays |
| **Tech stack** | Markdown/YAML documentation scaffold only |
| **Organization** | README describes intended `core/`, `platforms/`, `tools/`, `governance/` — none present locally |
| **Advantages** | Sound core-first, platform-overlay architecture |
| **Disadvantages** | Local clone is README-only; name typo reduces discoverability |
| **WP/PHP transfer** | Same pattern as shared mu-plugin or Composer package of coding standards with per-client overlays. |

---

#### `multi-agent-systems`

| Field | Detail |
|-------|--------|
| **Purpose** | Internal Elixirr Digital course on production multi-agent LLM systems (Modules 0–10) |
| **Tech stack** | Markdown/Obsidian vault; LangGraph, Google ADK, Microsoft Agent Framework (documented) |
| **Organization** | `Module N - Title/` folders; Obsidian wiki-links + Mermaid; Acme Corp worked example |
| **Coding style** | Documentation-first; no runnable sample apps |
| **CI/testing** | None; Module 8 covers agent testing patterns conceptually |
| **Advantages** | Comprehensive curriculum (observability, security, eval, deployment) |
| **Disadvantages** | No executable labs; LLM version references will age |
| **WP/PHP transfer** | Evaluation beyond pass/fail, guardrails, observability — applicable for WP AI plugins or content agents. |

---

### Academy and LMS

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

### DSO internal tooling

---

#### `dso-docker-build-python`

| Field | Detail |
|-------|--------|
| **Purpose** | Cross-platform Docker-based Python build pipeline — dependency detection, bandit, pip-audit, pytest, artifact zip |
| **Tech stack** | Docker (Python 3.13 slim), bash + PowerShell wrappers, pipx |
| **Organization** | `python_build.sh` / `.ps1`; `Dockerfile`; `codebase_examples/` |
| **Coding style** | Shell with `set -e`; security scans report-only (non-blocking) |
| **CI/testing** | Self-contained; example projects demonstrate pass/fail scenarios |
| **Advantages** | Multi-package-manager support; cross-platform; good example matrix |
| **Disadvantages** | Security findings don't fail builds; no SBOM |
| **WP/PHP transfer** | Same pattern as Composer-based build scripts for plugin ZIP packaging. Bandit/pip-audit ≈ PHPCS security sniffs + Composer audit. |

---

#### `dso-docker-security-scanning`

| Field | Detail |
|-------|--------|
| **Purpose** | Local security scanning wrapper — Trivy (images, Dockerfiles) + Kubescape (K8s manifests/Helm) |
| **Tech stack** | Python 3.6+, Docker, Trivy/Kubescape container images, Makefile |
| **Organization** | Single `docker_scans.py`; `examples/`; `scan_results/` |
| **CI/testing** | Makefile targets for local use only |
| **Advantages** | Covers images, tarballs, Dockerfiles, K8s manifests |
| **Disadvantages** | Mac untested; no CI integration |
| **WP/PHP transfer** | Container scan step ≈ WPScan or plugin vulnerability checks in release pipeline. |

---

#### `dso-interview-questions`

| Field | Detail |
|-------|--------|
| **Purpose** | Static "Interview Vault" — hierarchical DevSecOps/SRE topic browser |
| **Tech stack** | React 18, Vite 5, nginx (Docker), JSON content store |
| **Organization** | `public/vault.json`; `src/components/`; `create_vault.sh` |
| **CI/testing** | None; build via `vite build` |
| **Advantages** | Simple deploy; content-driven JSON; zero backend |
| **Disadvantages** | No search/filter UX; no auth; no tests |
| **WP/PHP transfer** | JSON content tree ≈ WP custom post type hierarchy or ACF repeater fields. |

---

#### `dso-ai-enablement-tf-aws`

| Field | Detail |
|-------|--------|
| **Purpose** | Scaffold for AWS Terraform AI agent — rules, hooks, skills under `.cursor/` |
| **Tech stack** | Cursor Agent config only; no `.tf` files in local clone |
| **Advantages** | Clear intended structure |
| **Disadvantages** | Empty implementation; shallow clone |
| **WP/PHP transfer** | `.cursor/rules/` with globs ≈ PHPCS/PHPStan rule sets scoped by directory |

---

#### `dso-ai-enablement-tf-azure`

| Field | Detail |
|-------|--------|
| **Purpose** | Intended Azure Terraform counterpart to `dso-ai-enablement-tf-aws` |
| **Status** | Empty — `.git` only in local clone |

---

#### `dso-common-code`

| Field | Detail |
|-------|--------|
| **Purpose** | Intended shared DSO utilities |
| **Status** | Empty — `.git` only in local clone |
| **WP/PHP transfer** | Would map to shared Composer package or mu-plugins |

---

### MSDP data platform

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

### Client delivery and production

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

### QA and testing

---

#### `qa-cursor-ai-enablement`

| Field | Detail |
|-------|--------|
| **Purpose** | QA workshop demo — AI-assisted testing with Cursor (test generation, review, self-healing, Jira gap analysis) |
| **Tech stack** | FastAPI + SQLAlchemy async + SQLite; Angular 19 + Tailwind 4; Playwright; uv/ruff/mypy/bandit; pre-commit |
| **Organization** | `backend/app/`; `frontend/src/app/`; `frontend/tests/` (api + e2e); `.cursor/` (agents, rules, skills) |
| **Coding style** | Modern Python; intentional test anti-patterns in demo material; good patterns in API tests |
| **CI/testing** | pytest async fixtures; Playwright; pre-commit; no remote CI |
| **Advantages** | Best-in-set engineering hygiene; pedagogy built into code; rich Cursor setup |
| **Disadvantages** | Workshop scope; SQLite not production-representative |
| **WP/PHP transfer** | `getByRole` > `getByTestId` > structural selectors. No `waitForTimeout`. API contract tests alongside E2E — apply to Playwright/Cypress against WP admin or headless sites. |

---

#### `qa-cypress`

| Field | Detail |
|-------|--------|
| **Purpose** | Cypress + Cucumber BDD examples/training scaffold |
| **Tech stack** | Cypress 4.11.0 (legacy), cypress-cucumber-preprocessor, Mochawesome |
| **Organization** | Page Object Model; Gherkin features + step definitions; committed `node_modules/` and reports |
| **Coding style** | Classic POM + Cucumber tags; some selectors target WordPress demo UI (`.wp-categories-link`, `.wp-heading`) |
| **CI/testing** | `npm test` only; no pipeline |
| **Advantages** | Full BDD stack with HTML reporting |
| **Disadvantages** | Severely outdated Cypress; committed `node_modules`; brittle selectors |
| **WP/PHP transfer** | **Negative example** — do not use `.wp-*` DOM classes as stable selectors. Prefer roles, labels, or `data-testid`. |

---

#### `pull-request-validation`

| Field | Detail |
|-------|--------|
| **Purpose** | Serverless PR gate for GitLab/Bitbucket — webhook → Lambda → CodeBuild runs project buildspec |
| **Tech stack** | Python 3.9, AWS SAM, API Gateway, Lambda, CodeBuild, Secrets Manager, SES, Snyk hook |
| **Organization** | `authorizer_lambda/`; `pull_req_event_processing/`; `events/` sample payloads; `template.yaml` |
| **Coding style** | Procedural Python; env-driven config; IP-range auth; dynamic buildspec assembly |
| **CI/testing** | README documents pytest but `tests/` folder missing from clone |
| **Advantages** | Multi-VCS support; composable validation; Bitbucket status integration; Snyk hook |
| **Disadvantages** | Missing tests; Python 3.9 aging; security relies on IP allowlists |
| **WP/PHP transfer** | **Highly transferable** — same webhook→CI pattern for WP plugin/theme PRs (PHPCS, PHPUnit, PHPStan via buildspec) |

---

### Front-end boilerplates and utilities

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

## Coding style summary

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

## Recommendations for PHP and WordPress teams

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
