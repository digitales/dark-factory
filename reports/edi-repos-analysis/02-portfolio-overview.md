---
title: Portfolio overview
description: Category breakdown, cross-cutting patterns, weaknesses, and repos requiring attention.
---

# Portfolio overview

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
