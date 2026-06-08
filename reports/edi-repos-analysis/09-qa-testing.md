---
title: QA and testing
description: QA enablement demo, legacy Cypress scaffold, and PR validation gate.
---

# QA and testing

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
