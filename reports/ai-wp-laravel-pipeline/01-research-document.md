---
title: AI in the WordPress + Laravel Development Pipeline
description: Research on structural AI integration beyond code completion — PR review, refactoring, migration, testing, documentation, tooling, security, and a 90-day pilot.
---

# AI Integration in WordPress + Laravel Development Pipelines

**Research document — structural integration beyond code completion**

*Context: Large legacy WordPress (ACF, Classic Editor), Laravel (queues, APIs, Passport), client retainer work, PHP 7.4→8.x transition, GitHub + deployment CI/CD.*

---

## 1. Key Opportunities for AI Augmentation

### 1.1 PR Review

| Opportunity | Description | Fit for stack |
|-------------|-------------|----------------|
| **Automated first-pass review** | AI summarises PR scope, suggests missing tests/docs, flags obvious bugs before human review. | High — reduces bottleneck on senior reviewers; works across PHP (WordPress/Laravel) and JS. |
| **Policy and standard checks** | Enforce naming, escaping, nonce usage, capability checks (WP) and auth/validation patterns (Laravel). | High — ACF/legacy WP and Passport APIs benefit from consistent security checks. |
| **Context-aware suggestions** | Use repo rules (e.g. Cursor/AGENTS.md) so suggestions align with Classic Editor vs Gutenberg, queue usage, API versioning. | Medium — requires curating rules per project. |
| **Reviewer routing** | Suggest assignees by file/module (WP theme vs Laravel app vs shared lib). | Medium — useful for retainer teams with mixed ownership. |

**Actionable next steps**

- Add an AI PR review step in GitHub Actions (e.g. CodeRabbit, Graphite Agent, or Greptile) on a single repo for a 4-week trial.
- Define a short “PR review policy” doc (security, sanitisation, tests) and feed it into the tool’s context where possible.
- Compare: time to first review, number of issues found in review vs post-merge, and reviewer satisfaction (survey).

---

### 1.2 Refactoring

| Opportunity | Description | Fit for stack |
|-------------|-------------|----------------|
| **Rector (deterministic)** | Rule-based PHP refactors and version upgrades; no LLM. Handles renames, type additions, deprecated API replacements. | **Primary** — use Rector for PHP 7.4→8.x and framework upgrades. |
| **AI-assisted extraction** | Suggest extracting ACF-heavy logic into service classes or moving inline SQL to Eloquent/query builders. | High — for legacy WP and Laravel; always human-verify. |
| **Smell and pattern detection** | SonarQube/Psalm/PHPStan find issues; AI suggests refactor direction (e.g. “replace global with dependency injection”). | High — combine static analysis with AI “what to do” suggestions. |
| **Incremental scope** | Refactor by file or by feature (single ACF block, single API module) to keep changes reviewable. | Critical — avoid “refactor entire theme” prompts. |

**Actionable next steps**

- Introduce Rector with a narrow rule set (e.g. `PHP74*`, `DeadCode`, one WP/Laravel rule set) in a branch; measure time saved vs manual upgrade.
- Use AI (Cursor/Copilot/PhpStorm AI) for *suggestions* only: “suggest a refactor for this function” → apply and test manually.
- Document “refactor playbook”: run Rector → run PHPStan baseline → AI-suggest refactors for top N files → PR + QA.

---

### 1.3 Migration (PHP + WordPress upgrades)

| Opportunity | Description | Fit for stack |
|-------------|-------------|----------------|
| **PHP 7.4 → 8.x** | Rector automates most syntax and BC breaks (typed properties, match, nullsafe, deprecations). PHPStan/Psalm catch remaining type issues. | **Primary** — proven; use baselines for legacy code. |
| **WordPress / ACF upgrades** | No single “AI migrator”; use Rector for PHP, then manual + AI-assisted updates for template and ACF API changes. | Medium — AI can draft upgrade notes and patch examples. |
| **Dependency upgrades** | Composer update + static analysis; AI can help resolve conflict suggestions and changelog summaries. | Medium — useful for retainer “keep dependencies current” work. |

**Actionable next steps**

- Create a migration pipeline: Rector (PHP 8.x rules) → PHPStan (level 0 or 1, baseline) → existing test suite. Run on a copy of one client codebase.
- Use AI to generate short “migration runbooks” per project (known ACF/plugin quirks, manual steps).
- Track: files changed, build/test pass rate, and rollback frequency.

---

### 1.4 Test Generation

| Opportunity | Description | Fit for stack |
|-------------|-------------|----------------|
| **Scaffolding** | AI generates PHPUnit/Codeception boilerplate from class/method signatures; developers fill in assertions and edge cases. | High — reduces “no tests because setup is tedious” (common in PHP surveys). |
| **From specs / tickets** | Given a scenario (e.g. “user cannot access other tenant’s data”), AI suggests test cases; team refines and implements. | High — aligns with spec-driven and client retainer work. |
| **Integration tests** | AI drafts HTTP tests for Laravel APIs (Passport auth, queues) or WP REST endpoints; team adds fixtures and assertions. | Medium — verify auth and side effects manually. |
| **Regression tests** | After a bug fix, “generate a test that would have caught this” → human edits and commits. | High — improves coverage where it matters most. |

**Actionable next steps**

- Standardise on PHPUnit (and optionally Codeception for WP). Use PhpStorm AI / Cursor / Copilot to generate test *scaffolds* from selected code; never auto-commit without review.
- Add a “test suggestion” step: when closing a bug ticket, prompt “suggest a PHPUnit test for this fix” and add to Definition of Done.
- Measure: new tests per sprint, failure catch rate (bugs found in CI vs production).

---

### 1.5 Documentation

| Opportunity | Description | Fit for stack |
|-------------|-------------|----------------|
| **PHPDoc / inline docs** | AI generates param/return/throws blocks from signatures and usage; maintainers correct and extend. | High — improves IDE support and onboarding. |
| **API docs** | From Laravel routes and controllers (or WP REST registration), generate OpenAPI/Postman-friendly docs; AI can summarise and add examples. | High — Passport and custom endpoints benefit. |
| **Runbooks and ADRs** | AI drafts runbooks (deploy, rollback, env vars) and ADRs from commit/ticket history; team approves and owns. | Medium — good for retainer handover and new joiners. |
| **Client-facing specs** | Keep specs human-written; use AI to check consistency (e.g. “does this spec match the acceptance criteria in the ticket?”). | Medium — reduces drift between spec and implementation. |

**Actionable next steps**

- Add a “documentation pass” in the pipeline: e.g. on merge to main, run a job that suggests PHPDoc for changed PHP files (via AI or Workik-style tool); output as comment or PR.
- Use AI to generate first draft of API docs from route definitions; maintain as code-first (e.g. OpenAPI from annotations).
- Define “documentation ownership”: who approves AI-generated runbooks/ADRs before they become canonical.

---

## 2. Tool Comparison (Open-Source vs SaaS)

### 2.1 PR / Code Review

| Tool | Type | Strengths | Limitations | Cost note |
|------|------|-----------|-------------|-----------|
| **SonarQube** | OSS (CE) / Commercial | Quality gates, security, multi-language, CI integration | Limited “context” review; rule tuning required | CE free; commercial for advanced rules |
| **Semgrep** | OSS / SaaS | Security-focused, autofix, custom rules | PHP support good but not WP-specific | OSS free; Team/Enterprise paid |
| **CodeRabbit** | SaaS | AI PR comments, GitHub-native | Variable catch rate (benchmarks ~44% bug catch) | Free tier; paid per repo/seat |
| **Greptile** | SaaS | High benchmark bug catch (~82%) | SaaS only; data leaves your control | Paid |
| **Graphite Agent** | SaaS | AI review, free tier (e.g. 100 PRs/month) | Feature set vs others TBD | Free tier available |
| **Cursor BugBot** | SaaS | Integrated with Cursor workflow | Cursor-centric; ~58% catch in benchmarks | Part of Cursor |

**Recommendation**

- **Hybrid**: SonarQube or Semgrep in CI for deterministic quality/security; one AI review tool (e.g. CodeRabbit or Graphite Agent) for first-pass PR review. Prefer a tool that allows custom context (policy doc, repo rules).

---

### 2.2 Refactoring & Migration

| Tool | Type | Strengths | Limitations | Cost note |
|------|------|-----------|-------------|-----------|
| **Rector** | OSS | PHP 7.4→8.x, framework rules, no LLM dependency | Rule sets need choosing; some edge cases manual | Free (OSS); paid support available |
| **PHPStan** | OSS | Static analysis, baselines, WordPress/Laravel extensions | No auto-fix; suggests only | Free |
| **Psalm** | OSS | Types, security, auto-fix for some issues | Different ecosystem from PHPStan | Free |
| **CodePorting (PHP)** | SaaS | AI-driven syntax modernisation | Less proven than Rector for PHP upgrades | Commercial |
| **PhpStorm + AI** | Commercial | Refactor + AI in IDE | Per-seat cost; tied to JetBrains | Subscription |

**Recommendation**

- **Rector** as the backbone for PHP and framework upgrades. **PHPStan** (or Psalm) for continuous static analysis with baseline for legacy. Use **AI (Cursor/Copilot/PhpStorm)** for *suggestions* and drafting, not as the single source of truth for migrations.

---

### 2.3 Test Generation

| Tool | Type | Strengths | Limitations | Cost note |
|------|------|-----------|-------------|-----------|
| **PhpStorm AI Assistant** | Commercial | PHPUnit scaffolding, TDD flow | IDE-bound; subscription | JetBrains subscription |
| **Cursor / Copilot** | SaaS | In-editor test generation from selection | Quality variable; must review | Per-seat |
| **Codeception** | OSS | Acceptance/API tests, WP integration | No AI; you write tests | Free |

**Recommendation**

- Use **AI for scaffolding and suggestions** (PhpStorm AI or Cursor/Copilot); **PHPUnit + Codeception** as the actual test stack. Never auto-commit AI-generated tests without running them and a quick review.

---

### 2.4 Documentation

| Tool | Type | Strengths | Limitations | Cost note |
|------|------|-----------|-------------|-----------|
| **Workik (PHP)** | SaaS | PHPDoc, API docs, multi-framework | Upload/code access model | Free tier cited |
| **WP LLM / MCP for WP** | OSS / Integrations | WordPress-aware, REST tooling | More for generation than doc pipeline | Varies |
| **Generic LLM (Claude/ChatGPT)** | SaaS | Flexible drafts for runbooks, ADRs | No direct codebase link without RAG | Per use |

**Recommendation**

- Use **AI to draft** PHPDoc and API descriptions; keep **source of truth in repo** (e.g. OpenAPI from code). For runbooks/ADRs, use AI as draft generator with human ownership.

---

## 3. Security and Governance Considerations

### 3.1 Data and code exposure

- **SaaS AI (Copilot, CodeRabbit, Greptile, etc.)**: Code and comments may be sent to third-party APIs. Check terms for training use and retention.
- **Mitigation**: Prefer “no training on my data” options; use private repos and minimal necessary context; for high-sensitivity clients, prefer on-prem or OSS-first (SonarQube, Semgrep, Rector, PHPStan) where possible.

### 3.2 Supply chain and hallucination

- **Hallucinations**: AI can suggest non-existent APIs, packages, or WP/Laravel APIs. Can lead to “slopsquatting” if developers install packages that match hallucinated names.
- **Mitigation**: (1) Always run tests and static analysis (PHPStan/Rector) after applying AI suggestions. (2) Prefer deterministic tools (Rector, PHPStan) for migrations and structural changes. (3) Short checklist: “Did we run the test suite? Did we verify this function/package exists?”

### 3.3 Policy and compliance

- **AI usage policy**: Define what is allowed (e.g. PR review, test scaffolding, doc drafts) and what is not (e.g. auto-merge, production config generation without review). Document in a short “AI use” page and link from repo.
- **Attribution and liability**: Clarify that AI output is not legal/contractual advice; client-facing deliverables remain human-approved. For retainer work, ensure contracts or SOWs allow use of approved AI tools.

### 3.4 Access and audit

- **Who can enable what**: Decide which AI tools are allowed per repo/environment (e.g. GitHub integration only for certain orgs). Use GitHub (or IdP) permissions so only authorised users trigger AI steps.
- **Audit**: Log where AI was used (e.g. “PR comments by CodeRabbit”) so you can trace back if an issue is attributed to an AI suggestion.

**Actionable next steps**

- Draft a one-page “AI in our pipeline” policy (data, tools, review requirements) and get sign-off from leadership/client where needed.
- Prefer tools with clear “no training on your data” and retention policies; document chosen tools and data flows.
- Add a lightweight audit: e.g. label or comment in PRs when an AI tool was used for review or suggestions.

---

## 4. 90-Day Pilot Implementation Roadmap

### Phase 1: Foundation (Days 1–30)

| Week | Focus | Actions | Owner |
|------|--------|---------|--------|
| 1 | Scope and policy | Choose one WordPress and one Laravel repo for pilot. Draft AI usage policy and get approval. | Tech lead / PM |
| 2 | CI and static analysis | Ensure PHPStan (or Psalm) and Rector run in CI; add or update baseline for legacy code. | Dev |
| 3 | PR review tool | Enable one AI PR review tool (e.g. CodeRabbit or Graphite Agent) on pilot repos; add link to “PR review expectations” doc. | Dev |
| 4 | Baseline metrics | Measure: PR cycle time, time to first review, test coverage, and one “developer satisfaction” pulse. | PM / Tech lead |

**Exit criteria**: CI green with PHPStan + Rector; AI PR review active; baseline metrics recorded.

---

### Phase 2: Refactor and migration (Days 31–60)

| Week | Focus | Actions | Owner |
|------|--------|---------|--------|
| 5 | Rector migration branch | Create branch on one pilot repo; run Rector with PHP 8.x rule set; fix remaining issues with PHPStan; document manual steps. | Dev |
| 6 | Test scaffolding | Run a “test gen” experiment: use AI to generate PHPUnit scaffolds for 5–10 high-value classes; run and fix; measure time vs writing from scratch. | Dev |
| 7 | Documentation pass | Use AI to generate PHPDoc for one module (e.g. one Laravel API or one WP plugin); review and merge; document process. | Dev |
| 8 | Mid-pilot review | Compare metrics to baseline; gather developer feedback; decide whether to expand or adjust tools. | Tech lead / PM |

**Exit criteria**: One Rector upgrade path documented; test and doc experiments completed; mid-pilot report.

---

### Phase 3: Scale and embed (Days 61–90)

| Week | Focus | Actions | Owner |
|------|--------|---------|--------|
| 9 | Expand PR review | Roll out AI PR review to remaining pilot repos (or all retainer repos if small). Tune rules/policy context. | Dev |
| 10 | Migration rollout | Apply Rector-driven PHP 8.x upgrade on one non-pilot client (or staging) using playbook from Phase 2. | Dev |
| 11 | Playbooks and training | Finalise “AI in our pipeline” playbook (when to use Rector, when to use AI for tests/docs, review requirements). Short internal training or doc share. | Tech lead |
| 12 | Report and KPIs | Publish pilot report: metrics, lessons, risks, and recommendations. Define ongoing KPIs and who owns them. | PM / Tech lead |

**Exit criteria**: Playbook published; at least one full migration using Rector; final report with KPIs and next steps.

---

## 5. KPIs to Measure Productivity Gain

### 5.1 Delivery and quality

| KPI | Definition | Target (example) | How to measure |
|-----|-------------|------------------|----------------|
| **PR cycle time** | Time from PR open to merge | −15–20% vs baseline | GitHub API or project management tool |
| **Time to first review** | Time from open to first review comment | −25% | GitHub events |
| **Escaped defects** | Bugs found in production post-release | No increase (or decrease) | Issue tracker, severity tagging |
| **Test coverage (critical paths)** | % coverage for chosen modules | +5–10% where targeted | PHPUnit/Codeception report |

### 5.2 Migration and refactor

| KPI | Definition | Target (example) | How to measure |
|-----|-------------|------------------|----------------|
| **Migration duration** | Calendar time for PHP 7.4→8.x per project | −50% vs prior estimate | Project timeline |
| **Rector auto-fix rate** | % of changes applied by Rector vs manual | Track and improve | Rector diff stats |
| **Post-migration rollbacks** | Rollbacks due to upgrade issues | Zero or minimal | Deploy/incident log |

### 5.3 Adoption and trust

| KPI | Definition | Target (example) | How to measure |
|-----|-------------|------------------|----------------|
| **AI suggestion acceptance** | % of AI PR suggestions accepted (or “addressed”) | Track; aim for steady or improving | Review tool analytics if available |
| **Developer satisfaction** | Short survey: “AI tools help me deliver” / “I trust AI suggestions after review” | Improve over pilot | Quarterly pulse (e.g. 1–5 scale) |
| **Documentation freshness** | % of touched modules with up-to-date PHPDoc/API docs | +20% over pilot | Sampling or automated checks |

**Actionable next steps**

- Define baseline for “PR cycle time” and “time to first review” in Week 4 of Phase 1.
- Add one “productivity” question to existing retros or surveys (e.g. “How much did AI tooling help this sprint?”).
- Review KPIs at end of Phase 2 and Phase 3; drop or add metrics based on what drives decisions.

---

## 6. Risks and Failure Modes

### 6.1 Over-reliance on AI

- **Risk**: Developers accept AI suggestions without verification; wrong or insecure code is merged.
- **Mitigation**: Mandate “all AI-suggested code must be run (tests + manual check) and reviewed”; keep Rector/PHPStan as gates. Include “verify AI suggestion” in PR checklist.

### 6.2 Hallucination and wrong APIs

- **Risk**: AI invents WordPress/Laravel APIs or package names; builds break or security is compromised.
- **Mitigation**: Always run test suite and static analysis; prefer Rector for structural changes; short “AI checklist” (function exists? package official?).

### 6.3 Slows down review

- **Risk**: Too many low-value AI comments; reviewers ignore them or spend more time filtering than before.
- **Mitigation**: Tune AI review tool (e.g. severity, rule set); cap or categorise comments; regularly trim noisy rules.

### 6.4 Client and compliance risk

- **Risk**: Client or contract forbids sending code to third-party AI; or data residency requires on-prem only.
- **Mitigation**: Confirm contract/SOW and client expectations before enabling SaaS AI; prefer OSS/on-prem (SonarQube, Semgrep, Rector, PHPStan) for sensitive clients.

### 6.5 Burnout and “valuable work”

- **Risk**: DORA-style finding: developers feel more “productive” but spend less time on work they find meaningful (e.g. design, deep problem-solving).
- **Mitigation**: Use AI for repetitive tasks (boilerplate, first-pass review, doc drafts); keep design and architecture decisions human-led. Survey “meaningful work” as well as “productivity.”

### 6.6 Pilot fatigue

- **Risk**: Too many tools or steps added at once; team disengages and reverts to old workflow.
- **Mitigation**: Pilot with 1–2 repos and 2–3 tools max (e.g. PHPStan + Rector + one AI PR tool). Add test/doc AI only after PR review is stable. Celebrate small wins.

**Actionable next steps**

- Add “Risks and mitigations” to the pilot charter; review in Week 4 and Week 8.
- Maintain a “failure log”: when an AI suggestion caused a bug or rework, note it (anonymised) and adjust process or tool config.

---

## Summary and Next Steps

1. **Prioritise**: PR review (AI + SonarQube/Semgrep), PHP migration (Rector + PHPStan), test scaffolding (AI-assisted PHPUnit). Documentation and runbooks can follow.
2. **Tool mix**: Rector and PHPStan as core; one SaaS AI PR review tool; AI in IDE for tests and docs as *drafts*.
3. **Governance**: One-page AI policy; “no training on our data” where possible; audit trail for AI-assisted PRs.
4. **Pilot**: 90-day plan with baseline metrics, one Rector migration, one test-scaffolding experiment, and a final report with KPIs and risks.
5. **Risks**: Mitigate over-reliance and hallucination with tests, static analysis, and human review; align with client and contract on data use.

**Immediate next steps**

- [ ] Choose two pilot repos (one WP, one Laravel) and get stakeholder sign-off.
- [ ] Draft and approve “AI in our pipeline” policy (data, tools, review rules).
- [ ] Enable PHPStan + Rector in CI and add baseline; enable one AI PR review tool.
- [ ] Record baseline KPIs (PR cycle time, time to first review, coverage sample).
- [ ] Schedule Week 4 and Week 8 pilot reviews and the 90-day report.

---

*Document generated for structural integration of AI into WordPress + Laravel development pipelines. Update as tools and organisational context change.*
