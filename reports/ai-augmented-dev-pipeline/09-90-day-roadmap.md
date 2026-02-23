---
title: 90-Day Roadmap
description: Pilot phases 0–30, 30–60, 60–90 — CI, policy, Bionic, baseline, refactor, test, review.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-roadmap-caption">
  <img src="/report/ai-pipeline-09-90-day-roadmap.png" alt="Path in three segments with milestones and figure at first segment" loading="lazy" class="report-section-image">
  <figcaption id="fig-roadmap-caption">Path in three segments with milestones and figure at first segment</figcaption>
</figure>

# 90-Day Roadmap

## 1. Problem Context

Pilot must validate CI + PR bot + policy in one repo without destabilising client delivery. Strategist: Pilot decision; Option A; 2–3 KPIs; budget £200 or £500 for Bionic/other; team Cursor subscription. Dev Lead: CI first, then policy, then bot; optional test/doc in second half.

## 2. AI Opportunity

Structured 90-day run with clear phases, owners, and success criteria so the initiative is measurable and reversible.

## 3. Proposed Architecture

```mermaid
gantt
  title 90-day pilot
  dateFormat YYYY-MM-DD
  section 0-30
  CI + baseline     :a1, 0, 14d
  Policy + guardrails :a2, 7, 14d
  PR bot Bionic     :a3, 14, 7d
  Baseline metrics  :a4, 21, 10d
  section 30-60
  Refactor/migration run :b1, 30, 14d
  Optional test trial :b2, 44, 14d
  section 60-90
  Optional docs     :c1, 60, 14d
  Review and decide :c2, 74, 16d
```

## 4. Tooling Options (OSS vs SaaS)

Same as reconciled: Bionic (OSS or free tier), team Cursor subscription only; optional CodeRabbit/Copilot at £500 budget. No new tools mid-pilot without Cost Governor and Architect alignment.

## 5. Guardrails & Controls

- **Budget:** £200/month (or £500) hard ceiling for Bionic and other AI tools; Cursor via team subscription (plan limits). Weekly cost check for Bionic/other; alert at £180 (or £450). Monitor Cursor usage vs plan limits.
- **Scope:** One pilot repo for PR bot; no AI in CI; human merge only.
- **Stop conditions:** Spend, data leakage, regression spike, team vote, CI blocked — as in page 10.

## 6. Failure Modes

- **Pilot slips:** If team is stretched, defer optional (test/doc) phases; keep weeks 1–4 mandatory (Dev Lead, Critic).
- **Baseline noisy:** Min. 4 weeks or 10 PRs for baseline (Strategist/Critic); extend or choose busier repo if needed.

## 7. KPIs

- **0–30 days:** CI green; Bionic live; baseline recorded; no stop condition; Bionic cost within ceiling; Cursor within team plan limits.
- **30–60 days:** At least one refactor/migration run documented; optional test trial if capacity.
- **60–90 days:** KPI review (PR cycle time, regression rate, optional coverage); go/no-go decision.

## 8. Actionable Next Steps

**0–30 days**

| Week | Milestone | Owner | Deliverables | Success criteria |
|------|-----------|--------|--------------|-------------------|
| 1 | CI + static analysis | WP/Laravel lead | Pilot repo chosen; PHPStan in GitHub Actions; baseline config so main green | Main branch green; PHPStan runs on PR |
| 1 | Rector | WP/Laravel lead | Rector in same workflow (PHP 8.x preset); branch protection requires both | Rector runs on PR; merge blocked if fail |
| 2 | Policy and guardrails | Lead + governance | One-pager; PR template "AI-assisted" + redaction checklist; .cursorrules draft | Team has seen and acknowledged |
| 3 | PR bot | DevOps / Lead | Bionic on pilot repo (OSS or free tier); no merge rights; diff-only, 30k tokens/PR | Bot posts comments; merge still human+CI |
| 3 | Data policy | Lead | "No client data" and data policy in repo (README or CONTRIBUTING) | Documented in repo |
| 4 | Baseline and cost | Lead; Cost owner | Baseline: PR cycle time, regression rate, coverage %; first weekly cost check for Bionic; Cursor plan limits documented; alert £180 or £450 | Numbers recorded; spend and plan usage logged |
| 4 | 30-day review | Lead | CI stable? Bot useful? Any stop condition? | Gate for month 2 passed |

**30–60 days**

| Week | Milestone | Owner | Deliverables | Success criteria |
|------|-----------|--------|--------------|-------------------|
| 4–6 | Refactor/migration | WP/Laravel | One PHP 8.x or WP upgrade run using Cursor + Rector; document time and issues | Runbook or checklist; upgrade or refactor done |
| 6–8 | Optional: test generation | Laravel/WP | Generate + human-edit tests for 1–2 services; measure coverage delta; name owner for test quality | Tests merged; coverage delta recorded (if run) |

**60–90 days**

| Week | Milestone | Owner | Deliverables | Success criteria |
|------|-----------|--------|--------------|-------------------|
| 8–10 | Optional: docs | Lead | Define "doc update frequency"; optional checklist on merge; name owner for doc KPI | At least one doc PR merged if run; owner named |
| 10–12 | Review and decide | All | KPI review; cost vs ceiling; team feedback; go/no-go for wider rollout or revert | Decision documented; next steps clear |
