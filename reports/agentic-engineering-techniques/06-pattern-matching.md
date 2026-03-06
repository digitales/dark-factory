---
title: Pattern Matching
description: How the Dark Factory workflow maps to the Agentic Engineering Book's pattern catalogue — alignment, gaps, and composition opportunities.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-patterns-caption">
  <img src="/report/agentic-techniques-06-pattern-matching.png" alt="A weaver's loom with some threads completed and others waiting to be woven in" loading="lazy" class="report-section-image">
  <figcaption id="fig-patterns-caption">Weaving established patterns into the existing workflow fabric</figcaption>
</figure>

## 6. Pattern Matching

The book catalogues ten distinct agentic patterns, each with specific trade-offs and use cases. This section maps the existing workflow to the pattern catalogue and identifies composition opportunities.

### Current workflow vs book patterns

| Book Pattern | Workflow Equivalent | Alignment | Key Gap |
|-------------|---------------------|-----------|---------|
| **Council Pattern** | Sequential skill chain | **Strong** | Not parallel |
| **Orchestrator Pattern** | One-shot runner / manual workflow | Moderate | No context isolation, no parallelism |
| **Plan-Build-Review** | No equivalent | None | No Plan or Review phase |
| **Human-in-the-Loop** | Implicit (user reviews output) | Weak | No formal approval gates |
| **Expert Swarm** | No equivalent | None | Could apply to multiple initiatives |
| **Self-Improving Experts** | No equivalent | None | No feedback or learning loop |
| **Progressive Disclosure** | No equivalent | None | No on-demand context loading |
| **Autonomous Loops** | No equivalent | N/A | Not applicable to research workflow |
| **ReAct** | No equivalent | N/A | Not applicable to research workflow |
| **Production Multi-Agent Systems** | No equivalent | N/A | Not applicable at current scale |

### The Council Pattern — strongest match

The workflow's architecture closely matches the book's Council Pattern:

```
Lead (orchestrator, aggregates findings)
├── Security Analyst: Read, Grep only
├── Performance Auditor: Read, Grep only
├── Code Quality Reviewer: Read, Grep only
└── ... (each analyst provides independent perspective)
```

In the Dark Factory context:

```
Reconciliation Agent (aggregates findings)
├── Architect: system design analysis
├── Dev-Lead: implementation feasibility
├── DevOps: infrastructure and reliability
├── Governance: security and compliance
├── Critic: stress testing
├── Cost-Governor: budget enforcement
└── Strategist: business prioritisation
```

The Council Pattern's key characteristics — independent analysis, parallel execution, read-only experts, and lead synthesis — map directly to the workflow. The critical missing element is **parallel execution**: the book explicitly states that council members should analyse simultaneously, with synthesis happening after all perspectives are gathered.

### Missing pattern: Plan-Build-Review

The book recommends Plan-Build-Review as the default pattern when uncertain. It separates thinking from doing and catches errors before implementation:

```
Plan Phase → Build Phase → Review Phase
```

The current workflow is all "Build" — agents produce analysis without an explicit planning or review step. Adding these phases would look like:

**Plan Phase (before agents run):**
The orchestrator reviews the initiative intake and creates a research plan:
- Which agents are needed for this initiative?
- What context should each agent receive?
- Are there any ambiguities to resolve before agents run?
- What does success look like for this analysis?

**Build Phase (the existing workflow):**
Agents run their analysis, now guided by the research plan.

**Review Phase (after reconciliation):**
Systematic evaluation of the reconciled output:
- Does the plan address the original initiative?
- Are all sections of the Required Output Structure present?
- Are recommendations internally consistent?
- Run the evaluation rubric against the output

### Missing pattern: Human-in-the-Loop

The workflow has implicit human review (the user reads and evaluates the reconciliation output), but no formal approval gates. The book identifies specific points where human judgment is most valuable:

**High-value approval gates for the research workflow:**

1. **After Plan Phase** — does the research plan cover the right concerns?
2. **After Phase 1 agents** — are individual analyses on track before synthesis?
3. **After reconciliation** — is the final plan coherent and implementable?

The book warns against gating every step (too much friction) and against gating nothing (too much risk). For a research workflow, gate 1 and 3 provide the best balance.

### Composition opportunity: Council + Plan-Build-Review

The book describes a common composition pattern: each domain expert uses Plan-Build-Review internally while an orchestrator coordinates parallel execution.

Applied to the Dark Factory workflow:

```
Plan Phase:
  Orchestrator reviews intake, creates research plan
  [Human approval gate]

Build Phase:
  Phase 1 (parallel): architect + dev-lead + devops + governance
  Phase 2 (parallel): critic + cost-governor
  Phase 3 (sequential): strategist
  Phase 4 (sequential): reconciliation

Review Phase:
  Run evaluation rubric against reconciled output
  Compare against golden examples (eval cases)
  [Human approval gate]
```

This composition adds structure without fundamentally changing the workflow. The agents themselves don't need modification — only the orchestration layer changes.

### Pattern selection decision tree

The book provides a decision tree for choosing patterns. Applied to the research workflow:

```
What kind of task? → Architectural/Creative Decision
  └── Does it need multiple expert perspectives? → Yes
      └── Orchestrator (parallel domain experts) ✓

Are completion criteria machine-verifiable? → No
  └── Plan-Build-Review (human judges completion) ✓

Must a human approve certain steps? → Yes (research output)
  └── Human-in-the-Loop (explicit approval gates) ✓
```

All three branches converge on the same recommendation: **Orchestrator + Plan-Build-Review + Human-in-the-Loop**. This is the pattern composition the book considers most robust for complex multi-perspective analysis tasks.

### Expert Swarm — future opportunity

The Expert Swarm pattern becomes relevant when running **multiple initiatives in parallel** (the portfolio workflow). Key characteristics:

- Expert lead maintains domain expertise in `expertise.yaml` (analogous to the skill SKILL.md)
- Workers are spawned for each initiative, inheriting expertise via path-passing
- Workers execute in parallel, each with its own context
- Learning happens after execution (improve agent updates expertise)

This pattern would apply if the workflow scales to evaluating 5+ initiatives simultaneously. At current scale (1–2 initiatives at a time), the overhead exceeds the benefit.

### Anti-patterns to avoid

The book identifies patterns that look promising but cause problems:

| Anti-Pattern | Description | Relevance |
|-------------|-------------|-----------|
| Emergency Context Rewriting | Full context rewrites when hitting token limits | Avoid — use context isolation instead |
| Mixing one-shot and conversational | One-shot prompts that ask clarifying questions | The one-shot runner should be self-contained |
| Over-constraining process | Constraining how the agent works, not what it produces | Skills correctly constrain output, not process |
| Evaluation Theatre | Elaborate eval suite, nobody acts on findings | Risk if rubric is applied without action on results |
