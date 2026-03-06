---
title: Executive Summary
description: Key findings from analysing the Agentic Engineering Book against the Dark Factory workflow — what works, what's missing, and the four highest-leverage improvements.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-exec-summary-caption">
  <img src="/report/agentic-techniques-01-executive-summary.png" alt="A compass resting on a hand-drawn map of interconnected nodes" loading="lazy" class="report-section-image">
  <figcaption id="fig-exec-summary-caption">Navigating the landscape of agentic engineering techniques</figcaption>
</figure>

## 1. Executive Summary

The [Agentic Engineering Book](https://jayminwest.com/agentic-engineering-book) describes a comprehensive framework for building agentic systems organised around four pillars — **Prompt**, **Model**, **Context**, and **Tool Use** — with supporting chapters on Patterns, Practices, and Mental Models.

### What the workflow already does well

The Dark Factory multi-agent research workflow demonstrates strong fundamentals across three of the book's four core prompt principles:

- **Clarity over cleverness** — skills use explicit role definitions, scoped focus areas, and unambiguous constraints
- **Structure reduces variance** — every skill follows a consistent pattern (Role, Focus, Do Not, Required Output Structure)
- **Constraints enable creativity** — "You Focus ONLY On" and "You DO NOT" sections provide tight scope boundaries

The evaluation rubric (15-criteria, 75-point scoring model) is ahead of many practitioners described in the book.

### Where the significant gaps are

| Gap | Severity | Core issue |
|-----|----------|------------|
| No parallel agent execution | High | Independent agents run sequentially, doubling wall-clock time |
| No context isolation | High | All agent outputs accumulate in one context window, degrading reconciliation quality |
| No few-shot examples in skills | High | Models infer output format from descriptions alone; inconsistent results across runs |
| No uncertainty handling | High | Skills don't specify when to ask vs proceed, leading to arbitrary decisions on ambiguous inputs |
| No evaluation practice | High | Rubric exists but is not applied; no eval cases, no systematic measurement |
| No self-improvement loop | Medium | When a skill produces subpar output, improvement is ad-hoc |

### The four highest-leverage improvements

1. **Parallelise independent agents** — architect, dev-lead, devops, and governance can run simultaneously. Estimated 50% wall-clock time reduction with zero quality risk.

2. **Add few-shot examples to skills** — one concrete input/output pair per skill establishes format, tone, and depth more reliably than instructions alone. Highest impact on output consistency.

3. **Start evaluating with golden examples** — even 3–5 known-good input/output pairs per skill transforms the workflow from "tinkering" to "engineering" (the book's framing).

4. **Implement context isolation** — running each agent as a subagent with its own context window prevents quality degradation in the reconciliation phase, which currently operates on the most polluted context.

### Prompt maturity assessment

The workflow's skills sit at **Level 4 (Contextual)** on the book's 7-level Prompt Maturity Model. They read project context and produce structured output, but don't invoke other skills (Level 5), modify themselves based on outcomes (Level 6), or improve other skills (Level 7). The one-shot runner approaches Level 5 (Higher-Order) but isn't self-contained enough to qualify.

### What was excluded

Several techniques in the book are not recommended for this workflow at this stage: A/B testing for prompts (research-oriented, not user-facing), Agent Teams / TeammateTool (experimental), automated CI/CD eval integration (overkill for a research site), and token-level cost tracking (requires API-level access not available in Cursor).
