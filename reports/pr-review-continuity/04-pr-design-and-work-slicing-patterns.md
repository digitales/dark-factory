---
title: PR design and work slicing patterns
description: Change-shaping patterns that preserve reviewability when deep reviewer capacity is scarce.
---

# PR design and work slicing patterns

## Target: single-purpose, single-session reviewable changes

Large mixed-purpose PRs are the fastest route to shallow approval. Use stackable, narrow PRs that each answer one question.

---

## Recommended slicing sequence

For medium/high-complexity work, split in this order:

1. **Preparation PR** (renames, extraction, no behavior change)
2. **Behavior PR** (minimal functional delta)
3. **Validation PR** (tests, fixtures, monitoring hooks)
4. **Cleanup PR** (debt removal, docs updates)

This pattern lowers cognitive load and improves defect localization.

---

## Anti-patterns to ban during constrained periods

- "Refactor + feature + test + docs" in one PR
- Cross-cutting mechanical changes mixed with behavior changes
- Massive AI-generated rewrites without rationale and checkpoints
- "Will explain in Slack" instead of explicit PR narrative

---

## Reviewability checklist (author-side)

Before requesting review:

- Can a reviewer explain the intent in one sentence?
- Is there a clear map of touched subsystems?
- Are high-risk paths isolated and highlighted?
- Are test additions proving behavior, not just increasing line count?
- Is rollback safe and documented?

If not, split again.

---

## Practical templates

Use short templates to reduce ambiguity:

- **PR title format:** `<type>: <scope> — <intent>`
- **Top-of-PR summary:** `Context / Change / Risk / Evidence / Rollback`
- **File review order:** "Read these files first, then these"

These reduce reviewer startup overhead and improve consistency across reviewers.

---

**Next:** [AI-assisted review without blind trust](/reports/pr-review-continuity/05-ai-assisted-review-without-blind-trust)

