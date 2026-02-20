---
title: How the Dark Factory Forms a New Development Workflow
description: Shift in bottleneck, role of specs and validation, interactive vs non-interactive modes.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-workflow-caption">
  <img src="/report/report-03-new-development-workflow.png" alt="Bottleneck shifting from code speed to spec precision" loading="lazy" class="report-section-image">
  <figcaption id="fig-workflow-caption">Bottleneck shifting from code speed to spec precision</figcaption>
</figure>

## 3. How the Dark Factory Forms a New Development Workflow

### 3.1 Shift in Bottleneck

In a Dark Factory the bottleneck moves:

- **From:** How fast humans can write and review code.  
- **To:** How precisely humans can describe what should exist and how reliably behaviour can be validated.

So the "job" of the engineer changes: from implementing and reviewing code to **specifying intent**, **designing validation** (e.g. scenarios), and **approving outcomes**.

### 3.2 Role of Specifications

- Specifications become the **primary artifact** and **source of truth**.
- Code is **generated** from specs (and plans/tasks derived from specs).
- Maintaining the product means **evolving specifications**; implementation is regenerated or updated from them.

This aligns with **Spec-Driven Development (SDD)**: "Intent is the source of truth"; the spec drives what gets built.

### 3.3 Role of Validation (Scenarios and Satisfaction)

Because no one reads the code:

- **Tests alone are insufficient:** agents can "reward-hack" (e.g. `return true`) if tests live next to the code.
- **Scenarios** are used as end-to-end, user-story-style checks, often **stored outside the codebase** (like a holdout set), so the agent cannot tailor code to pass them by cheating.
- **Satisfaction** can be probabilistic: of all trajectories through scenarios, what fraction likely satisfies the user? This fits agentic or LLM-in-the-loop products where boolean pass/fail is too rigid.

### 3.4 Interactive vs Non-Interactive Modes (Shift Work)

StrongDM distinguishes:

- **Interactive:** Human and agent iterate together (e.g. Cursor, Claude Code). Good for exploration and clarification.
- **Non-interactive:** Intent is fully specified (specs + scenarios); the agent runs end-to-end without back-and-forth. Good for "spec in → artifact out."

A Dark Factory leans on **non-interactive** execution once specs and scenarios are stable.

### 3.5 Practical Constraints (StrongDM)

StrongDM states rules of thumb:

- "Code must not be reviewed by humans."
- "Code must not be written by humans."
- "If you haven't spent at least $1,000 on tokens today per human engineer, your software factory has room for improvement."

The last point is a heuristic for "enough" agent usage; many teams will operate at lower spend while still adopting the workflow ideas (specs, scenarios, outcome approval).
