---
title: Operating model for constrained review capacity
description: A practical review process when reviewer attention is limited but risk tolerance is unchanged.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-pr-operating-model-caption">
  <img src="/report/ai-pipeline-01-overview.png" alt="A structured pipeline with checks converging to a human gate" loading="lazy" class="report-section-image">
  <figcaption id="fig-pr-operating-model-caption">Operating model: risk-tiered flow with deterministic checks before human approval</figcaption>
</figure>

# Operating model for constrained review capacity

## Principles

1. **Risk-scaled review depth**: not every PR needs the same depth, but high-risk PRs always get deep review.
2. **Deterministic checks first**: automate what can be automated; reserve human cognition for design and risk judgment.
3. **Explicit accountability**: every merge has a named accountable reviewer/owner.
4. **No autonomous merge path**: AI commentary informs review, never replaces it.

---

## Triage matrix

Classify each PR at creation time:

| Tier | Example change | Required review depth | Merge gate |
|------|----------------|-----------------------|------------|
| **T1 Low risk** | Refactor with no behavior change, docs, internal tooling | Single reviewer + checks | CI green + 1 human approval |
| **T2 Medium risk** | Business logic update, API contract evolution | Dual perspective review (feature + reliability/security) | CI green + 2 human approvals |
| **T3 High risk** | Auth/payments/data migration/security-critical path | Senior reviewer + domain owner + evidence pack | CI green + mandatory scenario proof + explicit sign-off |

If reviewer capacity is low, queue T1/T2 optimizations first. Do not weaken T3 controls.

---

## Required PR evidence contract

Every PR must carry a short, structured payload:

- **Intent:** what changed and why now
- **Risk notes:** what could break
- **Test evidence:** what validates correctness
- **Rollback plan:** how to recover if wrong
- **Review guidance:** where reviewers should focus first

This reduces reviewer discovery cost and avoids "read whole diff to infer intent."

---

## Review roles during capacity stress

- **Author:** owns clarity, test evidence, and first-pass self-review
- **Reviewer:** challenges logic/risk assumptions and verifies evidence quality
- **Domain owner (as needed):** validates business/security/operational implications
- **Release owner:** can pause merges when queue health or regression rate crosses stop conditions

---

## Escalation and stop conditions

Pause non-urgent merges and switch to incident-mode review when any of the following persists beyond a short window:

- First meaningful review latency exceeds SLA
- Post-merge defect rate rises above baseline threshold
- High-risk PRs are merged without full required evidence
- Reviewer concentration exceeds agreed limit

---

**Next:** [PR design and work slicing patterns](/reports/pr-review-continuity/04-pr-design-and-work-slicing-patterns)

