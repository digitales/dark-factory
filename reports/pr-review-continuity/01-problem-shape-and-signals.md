---
title: Problem shape and measurable signals
description: How to identify reviewer comprehension collapse before it becomes a quality incident.
---

# Problem shape and measurable signals

## What this period looks like in practice

The risk is not just "reviews are slower." It is a combined degradation:

- The primary reviewer is unavailable, overloaded, or context-starved
- Remaining reviewers can approve syntax and style but not architectural intent
- PRs increasingly contain AI-generated or AI-expanded changes that are fast to produce but expensive to reason about

From existing project research, this aligns with the observed bottleneck pattern: review consistency and depth vary materially by reviewer availability, and missed edge cases can rise when first-pass review quality drops.

---

## Early warning indicators

Track these weekly at repo level:

1. **Time to first meaningful review** (not first emoji/comment)
2. **Median PR size** (changed lines, files touched)
3. **Review depth proxy** (comments that address design/logic vs style-only)
4. **Rework churn** (lines replaced soon after merge)
5. **Post-merge regressions** (defects/reverts per 10 merged PRs)
6. **Review concentration** (% approvals from top 1-2 reviewers)

If these trend in the wrong direction together, comprehension is already degrading.

---

## Quantitative guardrails

Use explicit, team-visible thresholds:

- **PR size target:** keep most PRs in a "single-session reviewable" range
- **Single review session cap:** timebox focused reviews; split work if exceeding cap
- **Queue SLA:** cap waiting time for first substantive review
- **Reviewer concentration limit:** avoid depending on one person for most critical approvals

The exact thresholds should be calibrated to team size and domain risk, but hard limits outperform informal norms during constrained periods.

---

## Why this matters now

When throughput pressure rises, teams default to "approve to unblock." That creates hidden debt:

- Design intent goes undocumented
- Security assumptions are not challenged
- AI suggestions are accepted on output plausibility instead of process verification

This moves risk downstream into incidents, hotfixes, and slower future change velocity.

---

**Next:** [Failure modes and risk model](/reports/pr-review-continuity/02-failure-modes-and-risk-model)

