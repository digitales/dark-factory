---
title: Current State Assessment
description: Assessment of the Dark Factory multi-agent workflow against the Agentic Engineering Book's four pillars and maturity models.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-current-state-caption">
  <img src="/report/agentic-techniques-03-current-state.png" alt="An architect's blueprint table with some sections filled in and others blank" loading="lazy" class="report-section-image">
  <figcaption id="fig-current-state-caption">Mapping the current workflow against the four-pillar framework</figcaption>
</figure>

## 3. Current State Assessment

### The four pillars

The book frames agentic engineering around four interdependent pillars. Here is how the Dark Factory workflow performs against each.

#### Prompt — strong foundations, missing depth

The workflow's skills follow a consistent, well-structured pattern that aligns with three of the book's four core prompt principles:

| Principle | Status | Evidence |
|-----------|--------|----------|
| Clarity over cleverness | **Strong** | Explicit role definitions, unambiguous scope |
| Structure reduces variance | **Strong** | Consistent Role → Focus → Do Not → Output Structure |
| Constraints enable creativity | **Strong** | "You Focus ONLY On" and "You DO NOT" in every skill |
| Examples beat explanations | **Not present** | No skill includes input/output examples |

The missing fourth principle — few-shot examples — is the single most impactful prompt-level gap. The book argues that examples establish format, tone, and edge-case handling more reliably than instructions alone.

#### Model — single model, no explicit contract

The workflow runs on whichever model Cursor provides. There is no explicit prompt-model contract stating what the model is expected to know (WordPress APIs, ACF patterns, GDPR requirements) or how it should handle unknown domains. The only guard is the line "Avoid speculative tools" in the architect skill.

The book argues that every prompt makes implicit assumptions about the model. Making these explicit improves debugging — when output quality degrades, you can check whether the contract was violated rather than guessing at the cause.

#### Context — the largest gap

Context management is the area where the workflow diverges most from the book's recommendations.

| Principle | Status | Impact |
|-----------|--------|--------|
| One agent, one task | **Strong** | Each skill has a single focused responsibility |
| Context as working memory | Not considered | No awareness of context window constraints |
| Multi-agent context isolation | **Not present** | All agent outputs accumulate in one window |
| Orchestrator context hygiene | **Not present** | Reconciliation agent works with the most polluted context |
| Progressive disclosure | **Not present** | No mechanism to load reference material on demand |

The book's central finding on context: "Token usage explains 80% of performance variance in multi-agent systems." The reconciliation agent, which does the most complex synthesis work, runs in the worst context conditions.

#### Tool Use — skills pattern is solid, missing layers

The workflow's use of Cursor skills (SKILL.md files with description frontmatter) directly implements the book's "Skills as Meta-Tools" pattern. Skills are temporary behavioural modifications that change how the agent reasons — exactly what the book describes.

However, the book's three-layer progressive disclosure model is only partially implemented:

| Layer | Description | Status |
|-------|-------------|--------|
| Discovery | Short metadata about available capabilities | Present (description field) |
| Activation | Full instructions loaded on-demand | Present (SKILL.md body) |
| Resource | Detailed references and examples | **Not present** |

Adding a resource layer (approved tooling lists, GDPR checklists, example outputs) would give skills access to domain material without front-loading it into every prompt.

### Prompt maturity assessment

The book defines a 7-level Prompt Maturity Model. Here is where the workflow's components sit:

| Component | Current level | Description |
|-----------|--------------|-------------|
| Individual skills | **Level 4: Contextual** | Read project context, produce structured output |
| One-shot runner | **Level 5: Higher-Order** (partial) | Invokes other skills as subroutines, but not self-contained |
| Orchestration workflow | **Level 4: Contextual** | References external context but doesn't compose dynamically |
| Evaluation rubric | **Level 1: Static** | Same rubric every time, no parameterisation |

The book recommends a pyramid distribution: many Level 1–2 commands, some Level 3–4, few Level 5, rare Level 6–7. The research workflow justifies targeting Level 5 for orchestration while keeping individual skills at Level 4.

### Orchestration pattern match

The workflow most closely resembles the book's **Council Pattern** — multiple read-only domain experts providing independent analysis, with a synthesis agent aggregating findings. This is a strong pattern match.

However, the Council Pattern is designed for **parallel** execution (all experts analyse simultaneously, synthesis happens after). The current workflow runs sequentially, negating the pattern's primary advantage: speed through parallelism.

### Evaluation maturity

The book describes a 4-stage evaluation maturity curve:

| Stage | Practices | Current status |
|-------|-----------|----------------|
| Manual | Run agent, inspect output by hand | **This is where the workflow sits** |
| Scripted | Automated test runner, pass/fail checks | Not implemented |
| Automated | CI/CD integration, LLM-as-judge | Not applicable |
| Production-integrated | Continuous eval on live traffic | Not applicable |

The 15-criteria evaluation rubric is strong infrastructure — it just isn't being used. The gap is procedural, not conceptual.

### Skill description quality

The book emphasises that model-invoked skill descriptions need three elements for reliable semantic matching:

| Element | Description | Current status |
|---------|-------------|----------------|
| Trigger terms | Synonyms and domain terms for semantic matching | Minimal |
| Scope boundaries | "NOT for" clauses preventing wrong activation | **Not present** |
| Differentiation | How this skill differs from similar ones | **Not present** |

Example comparison:

**Current architect description:**
> Design technically coherent AI systems for WordPress and Laravel environments.

**Improved description (following the book's pattern):**
> Design technically coherent AI systems for WordPress and Laravel environments. Use when evaluating system architecture, tool selection, integration feasibility, data flow, or scalability for AI initiatives. NOT for cost analysis (use cost-governor), governance policy (use governance), or business prioritisation (use strategist).

### The empty strategist

The strategist skill is referenced throughout the orchestration chain but contains no content. On the book's framework, this creates a cascade of problems:

- No description means it will never be semantically matched (model-invoked failure)
- No behavioural constraints means unpredictable output when manually invoked
- No output structure means the reconciliation agent can't rely on consistent strategist input
- No "You DO NOT" section means the strategist may duplicate work from other agents

This should be populated before any other improvements, as it's a foundational gap that affects every run of the workflow.
