---
title: Assumptions and Follow-Up Questions
description: Assumptions made in the report and follow-up questions for the team.
---

<div class="report-section-image-wrapper">
  <img src="/report/report-09-assumptions-follow-up.png" alt="Assumptions and follow-up — incremental adoption, questions for the team" loading="lazy" class="report-section-image">
</div>

## 9. Assumptions and Follow-Up Questions

### 9.1 Assumptions Made in This Report

- The team is interested in **incremental** adoption: more spec-driven work and scenario-based validation first, with optional progression toward less human code writing/review over time.
- "Dark Factory" is used as the **Level 5** ideal (no human code write/review); the team may operate at Level 3 or 4 (outcome-focused review, spec-driven implementation) and still benefit.
- Tooling is flexible: Spec Kit, Cursor rules, Claude Code skills, or custom runbooks can implement the same workflow.
- PHP, WordPress, and Laravel are the primary stacks; the same spec-driven and scenario-based ideas apply to both, with stack-specific principles in the "constitution."
- Some references (e.g. StrongDM's $1,000/day heuristic, Digital Twin Universe) are cited for context; they are not a requirement for adopting the workflow.

### 9.2 Follow-Up Questions for the Team

1. **Current maturity:** Where does the team sit today on the 0–5 scale? Are you already using AI for implementation, and do you review every diff or only outcomes?
2. **Holdout scenarios:** Are you willing to maintain a separate set of scenarios (e.g. in `specs/scenarios/` or another repo) that are not visible to the agent during implementation?
3. **Constitution:** Do you have (or want) a single "constitution" or principles document (stack, security, testing, WordPress/Laravel standards) that every plan must satisfy?
4. **Tooling:** Are you standardising on Cursor, Claude Code, Copilot, or a mix? This affects how to implement `/speckit`-style commands or skills.
5. **Legacy vs greenfield:** What share of work is legacy (N→N+1) vs greenfield? Spec Kit and others suggest spec-driven is especially useful for N→N+1 and legacy modernisation.
6. **Cost and tokens:** What is an acceptable monthly token/API budget per engineer for agentic workflows? This will shape how far you push non-interactive, high-token runs.
