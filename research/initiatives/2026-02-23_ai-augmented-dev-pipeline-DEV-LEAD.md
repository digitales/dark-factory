# Dev Lead: Review of Intake + Architect Output

*Append to `2026-02-23_ai-augmented-dev-pipeline.md` after the Architect Summary table, or use standalone.*

---

## 1. Required Skill Profile

| Skill | Level | Where used |
|-------|--------|------------|
| **PHP (WordPress + Laravel)** | Strong | CI config (paths, stubs), Rector rules, reviewing bot/Rector output |
| **GitHub Actions / YAML** | Working | Workflow files, branch protection, caching |
| **Composer, PHPUnit/Pest** | Working | CI jobs, test runs, coverage |
| **PHPStan** | Basic | Reading level/errors; adding baseline; WP/Laravel extensions |
| **Rector** | Basic | Running rule sets; adding/excluding rules; not writing custom rules initially |
| **GitHub App / OAuth** | Basic | Installing Bionic or CodeRabbit; no custom app dev |
| **Cursor / Copilot** | Working | Daily use; applying suggestions; not configuring org-wide |
| **Technical writing** | Basic | One-pager, PR template, .cursorrules |

**No ML/AI engineering required.** One person who can own CI + one who can own "AI in pipeline" policy is enough; can be same person.

---

## 2. Estimated Engineering Weeks

**By phase (recommended sequencing)**

| Phase | Scope | Option A | Option B | Notes |
|-------|--------|----------|----------|--------|
| **1 — CI only** | PHPStan + Rector + tests in GitHub Actions (1 repo) | 1–1.5 w | 1–1.5 w | Same; includes baseline, paths, WP/Laravel stubs |
| **2 — PR bot** | Install Bionic or CodeRabbit; config; data policy | 0.5–1 w | 0.5–1 w | Bionic may need more config; CodeRabbit quicker to first comment |
| **3 — Policy & guardrails** | One-pager, PR template, .cursorrules draft | 0.5 w | 0.5 w | Shared |
| **4 — Baseline & metrics** | PR cycle time, regression rate, coverage % (pilot repo) | 0.5 w | 0.5 w | Shared |
| **5 — Refactor/migration use** | Use Cursor + Rector for one PHP 8.x or WP upgrade; document | 0.5–1 w | 1 w | Option B: add repo rules, more structured use |
| **6 — Test generation trial** | Generate + human-edit tests for 1–2 services | — | 1 w | Option B only; Option A = ad-hoc only |
| **7 — Docs trial** | Doc update process; optional "on merge" checklist | — | 0.5 w | Option B only; Option A = ad-hoc only |
| **8 — Coverage report (CI)** | Upload coverage artifact or codecov | — | 0.25 w | Option B only |

**Totals**

- **Option A (minimal):** **2.5–4 weeks** (CI + optional PR bot + policy + baseline + one refactor/migration run). No dedicated test-generation or docs workflow.
- **Option B (advanced):** **4–6 weeks** (same as A through phase 5; plus coverage job, test-generation trial, docs trial, repo rules).

**Assumptions:** 1 pilot repo; existing tests runnable in CI; one engineer leading, others contributing. If monorepo or multiple PHP/WordPress versions, add 0.5–1 week for matrix/paths.

---

## 3. Maintenance Burden

| Area | Option A | Option B |
|------|----------|----------|
| **CI (PHPStan, Rector, tests)** | **Medium** — PHPStan/Rector and WP/Laravel stubs need version bumps; Rector rule sets may need tuning per PHP/WP version | Same as A |
| **PR bot** | **Low** — Bionic: config and dependency updates; no per-PR tuning if kept minimal | **Medium** — CodeRabbit: config, rate limits, possible per-repo rules; Bionic: same as A |
| **Cursor / Copilot** | **Low** — Existing usage; occasional .cursorrules update | **Medium** — Repo rules for WP/Laravel/ACF; keep in sync with conventions; onboarding reminders |
| **Coverage / test-gap report** | — | **Low** — Once set up, mostly stable |
| **Doc workflow (on-merge checklist etc.)** | — | **Low** — Template/issue template; rarely changed |
| **Overall** | **Low–Medium** | **Medium** |

**Ongoing time:** ~2–4 hours/month Option A (CI + bot bumps, policy tweaks); ~4–8 hours/month Option B (+ repo rules, cost/usage check, test/doc workflow tweaks).

---

## 4. Risk of Future Technical Debt

- **Low** if: (1) All AI output is treated as suggestion — human always edits and commits; (2) Rector runs are reviewed like any other PR; (3) No "AI-generated" PRs merged without full human review; (4) Baseline and rule sets are versioned and documented.
- **Medium** if: Generated tests or doc snippets are merged with minimal review and drift from real behaviour; or Rector rules are expanded without test coverage and introduce subtle breaks.
- **Mitigation:** Explicit rule: "AI suggests, human decides"; Rector and PHPStan changes go through normal PR review; assign an owner for "generated test quality" and "doc freshness" so they don't become orphaned.

---

## 5. Impact on Legacy Support

- **Positive:** PHPStan + Rector in CI give consistent signals on PHP 8.x and deprecations across legacy WP/Laravel code; PR bot can flag deprecated usage in changed files; Cursor can suggest small, file-scoped modernisation without big-bang refactors.
- **Neutral/risk:** Legacy codebases often have large baselines (PHPStan level 0, many Rector exclusions). Adding CI can mean "many failures" until baseline is set. **Recommendation:** Start with baseline that passes (level 0, exclude legacy paths if needed); tighten gradually in dedicated PRs so client work isn't blocked.
- **Safe sequencing:** Enable CI on new or recently touched code first; expand to legacy paths in a separate "static analysis cleanup" initiative so retainer work isn't mixed with tooling.

---

## 6. Hidden Complexity Risks

| Risk | Why it's hidden | Mitigation |
|------|------------------|------------|
| **PR bot noise** | Bot may comment on style or minor nits; team starts ignoring all comments | Start with "summary + security/breaking only"; tune or disable categories; 2-week feedback loop to reduce noise before widening |
| **Rector vs. WP/Laravel versions** | Rector rule sets and WP core/plugin versions can conflict; "fix deprecation" can break behaviour | Run Rector on a branch; require full test pass; version Rector and rule set in composer; document "Rector PRs need extra review" |
| **Monorepo / mixed stacks** | Single workflow may not fit "WP plugin + Laravel app" in one repo; paths and stubs differ | Separate jobs or matrix for WP vs Laravel; clear path lists so PHPStan/Rector only see relevant code |
| **Baseline creep** | PHPStan baseline grows and never shrinks; Rector exclude list grows | Quarterly "reduce baseline" task; track baseline size in metrics |
| **Ownership of "doc" and "test" KPIs** | Everyone assumes someone else will do doc updates or review generated tests | Assign named owner in pilot; add to team checklist or retro until habit forms |
| **Cursor/Copilot context leakage** | Developer pastes code that accidentally includes client URL or token | .cursorrules + PR template: "no client names, URLs, credentials"; short training; no logging of prompt content without policy |

---

## 7. Skill Gaps

| Gap | Severity | How to close |
|-----|----------|--------------|
| **Rector rule authoring** | Low | Use preset/community rules only; don't write custom rules in pilot |
| **GitHub App / bot config** | Low | Bionic/CodeRabbit docs + "install and restrict to 1 repo"; no custom app |
| **PHPStan level/extension tuning** | Medium | Start at level 0; use WP/Laravel community configs; raise level in dedicated PRs |
| **Defining "doc update frequency"** | Low | Decide once: e.g. "≥1 doc PR per month" or "README/runbook updated within 2 sprints of code change"; document in pilot |
| **Cost/usage monitoring** | Low | Simple spreadsheet or doc: spend per tool per month; calendar reminder for weekly check |

No hire required; existing PHP + GitHub + Cursor experience is enough. If no one has run PHPStan/Rector before, budget 1–2 days for reading and first green run.

---

## 8. Safe Sequencing

**Order of rollout (recommended)**

1. **CI only (no PR bot, no new AI workflows)** — PHPStan + Rector + existing tests on 1 repo; baseline so main is green. **Gate:** Merge only when CI green. No AI in pipeline yet.
2. **Policy and guardrails** — One-pager ("no client data in AI; no autonomous merge; reversible"); PR template "AI-assisted" line; .cursorrules draft. **Gate:** Team has seen and acknowledged.
3. **PR bot (optional for Option A)** — Install Bionic (or CodeRabbit) on same repo; comments only; no merge rights. **Gate:** 2-week trial; if useful, keep; if noisy, tune or disable.
4. **Baseline metrics** — Record PR cycle time, regression rate, coverage % for pilot repo. **Gate:** Numbers recorded so later KPIs are comparable.
5. **Refactor/migration use** — One real PHP 8.x or WP upgrade using Cursor + Rector; document time and issues. **Gate:** Upgrade done and runbook updated; no new tooling in CI.
6. **Test generation (Option B only)** — Generate tests for 1–2 services with Cursor; human edits and merges; measure coverage delta. **Gate:** Tests merged and green; owner for "review generated tests" named.
7. **Docs trial (Option B only)** — Define "doc update frequency"; optional "on merge to main" checklist or issue. **Gate:** At least one doc PR merged; owner named.
8. **Review and widen** — 12-week review; decide rollout to more repos or revert.

**Do not:** Add PR bot and Rector and test-generation and doc workflow in the same week. **Do:** Land CI first, then bot, then policy, then optional workflows.

---

## 9. What to Simplify First

| If short on time or people | Simplify to |
|----------------------------|------------|
| **Full Option B** | Option A: CI + optional Bionic only; no CodeRabbit, no coverage report, no formal test/doc workflows. Refactor/test/docs stay ad-hoc in Cursor. |
| **CI scope** | Single job: PHPStan only (no Rector in week 1). Add Rector in a follow-up PR once PHPStan is stable. |
| **PR bot** | Defer PR bot to phase 2; run pilot with "human review + CI only" and measure baseline; add bot only if capacity allows. |
| **Multiple repos** | Pilot one repo only; don't enable bot or new CI on all repos until pilot is reviewed. |
| **Rector rule set** | Use one preset (e.g. PHP 8.x set) only; no WP-specific Rector rules until PHP 8.x set is green and reviewed. |
| **Docs and test KPIs** | Drop "documentation update frequency" and "test coverage %" from pilot KPIs; keep "PR cycle time" and "regression rate" only. Add doc/test later. |

**First simplification to adopt:** Start with **CI (PHPStan first, then Rector) + policy** and **no PR bot**. Add PR bot only after 2–4 weeks of stable CI and baseline metrics. That keeps engineering weeks to ~1.5–2 for "first value" and avoids PR bot tuning eating time early.

---

## 10. Practical Workflow Maps

### 10.1 PR review

```text
Developer pushes branch → Opens PR
       ↓
GitHub Actions: PHPStan, Rector, PHPUnit run (required to pass)
       ↓
PR bot (Bionic or CodeRabbit): receives diff (+ optional small context)
       ↓
Bot posts comment: summary, security/breaking hints, optional deprecation flags
       ↓
Human reviewer: reads bot comment + diff, approves or requests changes
       ↓
Developer: addresses feedback; no merge until CI green + human approval
       ↓
Human merges (bot has no merge rights)
```

**Local:** Developer uses Cursor for code completion and ad-hoc "explain this" on selection only; no "review entire PR" in IDE in pipeline — that's the bot's job.

**Guardrails:** Bot gets diff only (no client URLs, no .env); PR template includes "AI-assisted review: yes/no"; human always has final say.

---

### 10.2 Refactoring

```text
Target: modernise for PHP 8.x / reduce tech debt in a file or module
       ↓
Option A: Developer selects code in Cursor → "Suggest PHP 8.x refactor" → applies/edit locally → runs Rector in CI on PR
Option B: Same + repo rules (WP/Laravel/ACF) so Cursor suggestions align with project
       ↓
CI: Rector runs on PR (same rule set as project); PHPStan passes
       ↓
Human review: confirm behaviour unchanged; tests green
       ↓
Merge
```

**Rector:** Run in CI on every PR (or on paths under refactor). No "Rector-only" mass PR without prior agreement; refactor in small PRs.

**Guardrails:** Rector runs on branch; full test run required; no autonomous refactor PRs.

---

### 10.3 Migration planning (PHP / WP / plugins)

```text
Goal: plan upgrade (e.g. PHP 7.4 → 8.1, WP 5.x → 6.x)
       ↓
CI (already in place): PHPStan + Rector on current codebase surface deprecations and fixable issues
       ↓
Developer/lead: runs Rector with "dry run" or "diff" locally (or on branch) to list suggested changes
       ↓
Cursor (optional): "Generate migration runbook for PHP 7.4 → 8.1 for this repo" using codebase context; human edits runbook
       ↓
Runbook: steps for PHP version, extensions, WP core, plugins, tests; order of operations
       ↓
Execute in small PRs; each PR goes through CI + human review
```

**No AI in CI for migration.** Migration "plan" is human-owned; Cursor can draft runbook or checklist; Rector and PHPStan provide the raw list of code-level changes.

**Guardrails:** Runbook is internal; no client data in prompts; execution is human-driven with CI gates.

---

### 10.4 Test generation

```text
Target: add or extend tests for a service/controller/plugin
       ↓
Developer: selects class/method in Cursor → "Generate PHPUnit/Pest tests for this"
       ↓
Cursor: suggests test file (or methods); developer edits (assertions, data providers, mocks)
       ↓
Developer: runs tests locally; pushes branch
       ↓
CI: PHPUnit/Pest run; coverage report (Option B: uploaded for visibility)
       ↓
Human review: tests are meaningful and maintained by team
       ↓
Merge
```

**No automated "AI creates test PR" in pipeline.** Human always writes or heavily edits the test code; CI runs it. Option B can add "test gap" report (e.g. list of files with no tests) as an artefact or issue — human decides what to test.

**Guardrails:** Generated tests are reviewed like any other code; owner for "test quality" in pilot.

---

### 10.5 Documentation

```text
Trigger: code/config change that should be reflected in README, runbook, or ADRs
       ↓
Option A: Ad-hoc — developer or lead asks Cursor "Update README for this change" and applies edit manually
       ↓
Option B: Optional "on merge to main" — checklist or issue template: "If deployment/env changed, update runbook"; or scheduled "doc freshness" reminder
       ↓
Doc update: human creates PR to /docs or README; no autonomous AI doc PR
       ↓
Merge; "doc update frequency" KPI = count of doc PRs merged per month
```

**No AI in CI that pushes doc changes.** Cursor can draft README/runbook snippets; human approves and commits. Option B: lightweight process (checklist or monthly reminder) so someone is prompted to update docs.

**Guardrails:** "Documentation update frequency" has a named owner; no client-specific details in public docs; doc PRs are reviewed.

---

## 11. Practicality Score and Recommendation

| Criterion | Option A | Option B |
|-----------|----------|----------|
| Engineering weeks | 2.5–4 | 4–6 |
| Maintenance | Low–Medium | Medium |
| Skill fit | Yes (existing team) | Yes |
| Legacy impact | Positive if baseline handled | Same |
| Hidden complexity | Manageable (CI + optional bot) | Higher (bot tuning, repo rules, doc/test process) |
| Reversibility | High | High |

**Practicality score:** **Option A: 4/5.** **Option B: 3.5/5** (more moving parts and ownership needs).

**Recommendation**

- **Safe to pilot:** **Option A** — CI (PHPStan, then Rector) + optional Bionic + policy + baseline metrics. Add refactor/migration use when CI is stable. Keep test and doc as ad-hoc Cursor use.
- **Option B:** **Safe to pilot with simplification** — Same as A for phases 1–4; add coverage report and "structured" Cursor use (repo rules) before adding test-generation and docs workflows. Introduce test and doc workflows only after PR bot and CI have been stable for 4+ weeks and ownership for doc/test KPIs is assigned.
- **Simplify first:** Start with **CI + policy only** (no PR bot in week 1). Get CI green and baseline metrics; then add PR bot. That minimises risk and engineering weeks for first value.
