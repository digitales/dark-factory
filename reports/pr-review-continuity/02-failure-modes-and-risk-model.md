---
title: Failure modes and risk model
description: The main ways quality and security degrade when PR review understanding is incomplete.
---

# Failure modes and risk model

## Primary failure modes

### 1) Cognitive overload in large diffs

As change size and cross-file complexity increase, reviewers shift from reasoning to scanning. Defect detection quality falls before teams notice.

### 2) "Happy-path approval"

Review validates obvious behavior and tests the golden path, but fails to evaluate edge cases, rollback behavior, data integrity, and security boundaries.

### 3) AI-output trust drift

AI-generated code that "looks plausible" is accepted without robust process-level verification. This is especially dangerous when reviewers are time-constrained.

### 4) Knowledge concentration

Too much codebase understanding sits with one person. Their temporary absence turns routine review into high-risk review-by-proxy.

### 5) Governance bypass under pressure

Teams skip risk labels, downgrade review rigor, or merge with weak rationale to hit delivery dates.

---

## Risk taxonomy for constrained review periods

| Risk class | Typical trigger | Impact | Control type |
|-----------|------------------|--------|--------------|
| **Design drift** | Large scope PR with weak rationale | Long-term maintainability loss | PR intent contract + architecture checklist |
| **Logic regressions** | Limited reviewer bandwidth | Production defects, reverts | Deterministic tests + scenario checks |
| **Security miss** | Superficial review of auth/input/output paths | Vulnerabilities, client exposure | Security-focused review template + SAST gates |
| **Operational fragility** | No owner-level review of observability/deploy impact | Incident MTTR increase | Runtime readiness checklist |
| **Knowledge bottleneck** | Single reviewer dependency | Queue collapse, blocked delivery | Rotation + ownership expansion plan |

---

## Internal alignment with existing project guidance

This report extends existing project principles:

- Keep AI as **first-pass assistant**, not merge authority
- Maintain **human gate ownership** for approval/merge
- Complement diff review with **outcome validation** (scenarios/tests)
- Use explicit governance controls for data, security, and auditability

---

## Decision rule

When reviewer comprehension is uncertain, **merge confidence must come from stronger evidence, not from speed pressure**.

That means increasing objective checks and reducing unit-of-change size until confidence is restored.

---

**Next:** [Operating model for constrained review capacity](/reports/pr-review-continuity/03-operating-model-for-constrained-review-capacity)

