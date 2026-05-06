---
layout: doc
title: PR Review Continuity Under Capacity Loss
description: Research microsite on maintaining safe, effective pull-request review when key developers are unavailable or cannot fully understand large AI-augmented changes.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-pr-continuity-caption">
  <img src="/report/ai-pipeline-02-pr-review.png" alt="Manuscript-style PR with margin notes and a human approval hand at the merge gate" loading="lazy" class="report-section-image">
  <figcaption id="fig-pr-continuity-caption">PR continuity: AI first-pass notes with a human-controlled merge gate</figcaption>
</figure>

# PR Review Continuity Under Capacity Loss

This microsite addresses a specific operating risk: a period where one or more developers cannot fully understand PR contents or cannot perform deep review consistently.

It synthesizes:

- Existing `dark-factory` project research (review bottlenecks, AI guardrails, governance controls, and outcome-based validation)
- External guidance and evidence (Google Engineering Practices, GitHub PR practices, SmartBear review research, NIST SSDF, and emerging AI-assistance cognition studies)

---

## Core thesis

When reviewer comprehension drops, quality and security do not fail because of a single bad PR. They fail through an accumulation of:

1. Oversized changes that exceed human cognitive bandwidth  
2. Weak intent documentation (`what/why/risk/test` unclear)  
3. Implicit trust in AI output without structured verification  
4. Concentrated reviewer knowledge (single-point-of-failure maintainers)

The fix is an operating model, not a single tool: **smaller review units, explicit review contracts, deterministic checks, and mandatory human accountability at merge gates**.

---

## Audience and outcomes

- **Leadership outcome:** Reduce delivery risk during reviewer capacity shocks without freezing delivery.
- **Engineering outcome:** Preserve review depth and merge confidence through explicit risk tiers, evidence contracts, and change-sizing rules.
- **Shared outcome:** Keep AI useful as first-pass acceleration while preventing blind-trust approvals.

---

## Microsite sections

| Section | Focus |
|--------|-------|
| [1. Problem shape and measurable signals](/reports/pr-review-continuity/01-problem-shape-and-signals) | How to detect that review comprehension is degrading |
| [2. Failure modes and risk model](/reports/pr-review-continuity/02-failure-modes-and-risk-model) | Where quality/security failures emerge when reviewers are overloaded |
| [3. Operating model for constrained review capacity](/reports/pr-review-continuity/03-operating-model-for-constrained-review-capacity) | A practical process for triage, review depth, and escalation |
| [4. PR design and work slicing patterns](/reports/pr-review-continuity/04-pr-design-and-work-slicing-patterns) | How to shape PRs so they remain reviewable |
| [5. AI-assisted review without blind trust](/reports/pr-review-continuity/05-ai-assisted-review-without-blind-trust) | Safe AI usage patterns when human reviewer capacity is thin |
| [6. 30-60-90 day rollout](/reports/pr-review-continuity/06-30-60-90-rollout) | Adoption plan, KPIs, and stop conditions |
| [7. Sources and evidence map](/reports/pr-review-continuity/07-sources-and-evidence-map) | Internal and external references |

Start with [Problem shape and measurable signals](/reports/pr-review-continuity/01-problem-shape-and-signals).

---

## One-line positioning

Treat PR review continuity as an engineering reliability problem: design the review system so it remains safe when reviewer attention is the constrained resource.

