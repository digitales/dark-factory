---
title: Recommended Approach for Creating Specifications
description: Spec-driven development, checkpoints, Spec Kit pattern, and Cursor rules.
---

## 6. Recommended Approach for Creating Specifications

![Specify → Plan → Tasks → Implement with checkpoints](/report/report-06-creating-specifications.png)

### 6.1 Spec-Driven Development (SDD) as the Overarching Approach

Treat **specifications as the source of truth** and code as generated output:

1. **Specify** — What and why: users, problems, success criteria, acceptance criteria. Avoid "how" (tech stack, APIs) in the initial spec.
2. **Plan** — How: stack, architecture, constraints, data models, API contracts. Align with organisational principles (constitution).
3. **Tasks** — Break the plan into small, implementable and testable tasks (optionally marked for parallelisation).
4. **Implement** — Agent (or human) implements from tasks; validation is against scenarios and tests derived from the spec.

At each phase, **verify and refine** before moving on: does the spec capture intent? Does the plan respect constraints? Are tasks clear and complete?

### 6.2 Checkpoints and Iteration

- **No single big dump:** Avoid one huge prompt that produces both spec and code. Use phases (Spec → Plan → Tasks → Implement) with explicit checkpoints.
- **Constitution / principles:** Maintain a short document of principles (quality, security, stack, patterns). The plan phase should reference it so generated code stays on-brand.
- **Ambiguity markers:** In specs, use something like `[NEEDS CLARIFICATION: …]` so that assumptions are not hidden; the team (or agent in the next phase) resolves them before implementation.

### 6.3 Tools and Commands (Spec Kit Pattern)

GitHub's Spec Kit illustrates a **command-based** workflow that fits SDD:

- **`/speckit.constitution`** — Create or update project principles and guidelines.
- **`/speckit.specify`** — Turn a short feature description into a full spec (with branch/template/structure).
- **`/speckit.plan`** — Generate a technical plan from the spec and constitution.
- **`/speckit.tasks`** — Generate a task list from the plan (and related docs).
- **`/speckit.implement`** — Run implementation (e.g. agent executes tasks).

Similar flows can be implemented with Cursor rules, Claude Code skills, or internal runbooks. The important part is the **sequence and checkpoints**, not the exact tool.

### 6.4 Cursor Rules and Skills

Cursor rules (and skills in Claude Code) act as **persistent context**: project conventions, stack, and patterns. For a PHP/WordPress/Laravel team:

- Define rules/skills for: PHP version, WordPress coding standards, Laravel conventions, and any in-house patterns.
- Attach rules by folder or file type so that generated code is consistent and future-proof.
