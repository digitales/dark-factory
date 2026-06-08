---
title: AI enablement boilerplates
description: Eleven Cursor and stack boilerplate repositories — purpose, stack, and WP transfer notes.
---

# AI enablement boilerplates

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
