---
title: AI-assisted review without blind trust
description: How to use AI as first-pass review support while preserving human accountability and security posture.
---

# AI-assisted review without blind trust

## Recommended AI role in constrained periods

Use AI for:

- Diff summarization
- Obvious risk flagging (security smells, deprecated APIs, missing tests/docs)
- Reviewer attention routing ("focus here first")

Do **not** use AI for:

- Autonomous approval
- Autonomous merge
- Final security sign-off

This matches existing project guardrails: AI can accelerate first pass, but merge remains human-gated.

---

## Human-review protocol for AI-generated or AI-heavy PRs

Require explicit checks on:

1. **Correctness beyond happy path** (edge cases, error handling)
2. **Security boundaries** (auth, input validation, output encoding, secret handling)
3. **Operational behavior** (timeouts, retries, logging, observability impact)
4. **Maintainability** (duplication, naming clarity, change locality)

If reviewer cannot explain a critical section, request decomposition or rewrite before approval.

---

## Cognitive risk controls

Recent research on agentic coding assistants indicates cognitive engagement can decline as sessions progress, with developers over-focusing on output success. Operationally, this implies:

- Add deliberate "pause-and-verify" checkpoints before approval
- Require reviewer notes for high-risk decisions (not just LGTM)
- Prefer staged reviews over one long review session
- Use prompts/checklists that force edge-case and failure-mode thinking

---

## Security and governance minimums

Adopt baseline controls aligned with secure SDLC guidance:

- Secure coding standards + code review policy
- Automated static/security checks in CI
- Explicit risk-based review depth by change type
- Documented lessons learned and recurring defect classes

These controls remain mandatory even when staffing is constrained.

---

## Practical policy statement

`AI comments are advisory evidence, not approval evidence.`

Approval evidence must be human-understandable reasoning plus deterministic test/security results.

---

**Next:** [30-60-90 day rollout](/reports/pr-review-continuity/06-30-60-90-rollout)

