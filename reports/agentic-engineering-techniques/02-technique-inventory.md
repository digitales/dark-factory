---
title: Technique Inventory
description: Full catalogue of agentic engineering techniques from all nine chapters, assessed against the Dark Factory workflow.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-inventory-caption">
  <img src="/report/agentic-techniques-02-technique-inventory.png" alt="A naturalist's specimen drawer with labelled compartments, each containing a different mechanical part" loading="lazy" class="report-section-image">
  <figcaption id="fig-inventory-caption">Cataloguing the full spectrum of agentic engineering techniques</figcaption>
</figure>

## 2. Technique Inventory

Every distinct technique from the [Agentic Engineering Book](https://jayminwest.com/agentic-engineering-book) is catalogued below, organised by chapter. Each is assessed for relevance to the Dark Factory workflow and current adoption status.

### Chapter 1: Foundations

| Technique | Description | Relevance | Status |
|-----------|-------------|-----------|--------|
| Four-pillar decomposition | Prompt + Model + Context + Tool Use as independent concerns | High | Implicit, not explicit |
| "More is not better" principle | Focused agents outperform overloaded ones | High | Partially applied |
| Pit of Success mindset | Design so the easiest path is the correct path | High | Not applied |
| Common mistakes checklist | 8 anti-patterns for new practitioners | Medium | Not documented |

**Key insight:** "A focused agent is a productive agent." The book warns against flooding agents with tools, context, and steering prompts — each addition degrades performance. The workflow's single-purpose skills align with this, but the one-shot runner (which loads everything into one context) works against it.

### Chapter 2: Prompt

| Technique | Description | Relevance | Status |
|-----------|-------------|-----------|--------|
| Distributed prompt architecture | Prompt spans skills, rules, injected context | High | Partial — no composition map |
| Static-to-composed prompt spectrum | 5-level maturity for prompt dynamism | Medium | Skills are Level 4 (Contextual) |
| Prompt-model contract | Explicit model capability assumptions | High | **Not present** |
| Clarity over cleverness | Explicit instructions outperform clever shortcuts | High | **Strong** |
| Structure reduces variance | Consistent formatting helps models parse intent | High | **Strong** |
| Constraints enable creativity | Scope boundaries improve output quality | High | **Strong** |
| Examples beat explanations | Few-shot examples establish format and tone | High | **Not present** |
| Tool docs with negative constraints | "Do NOT use for" prevents skill misuse | High | **Not present** |
| Stopping conditions | Explicit criteria for when agents halt | High | Partial |
| Uncertainty handling | When to ask the user vs proceed with best judgment | High | **Not present** |
| Model-invoked vs user-invoked design | Rich descriptions with trigger terms and scope boundaries | High | Partial |
| Prompt quality measurement | Multi-dimensional scoring of prompt effectiveness | Medium | Rubric exists, not applied |
| One-shot vs conversational design | Don't mix paradigms | Medium | Partial |

### Chapter 3: Model

| Technique | Description | Relevance | Status |
|-----------|-------------|-----------|--------|
| Model selection by task type | Match model capability to task requirements | Medium | Not considered (single model) |
| Multi-model architectures | Use cheaper models for simple tasks, expensive for complex | Low | Not applicable in Cursor |
| Model evaluation for agents | Benchmarks and LLM-as-judge calibration | Low | Not needed yet |

### Chapter 4: Context

| Technique | Description | Relevance | Status |
|-----------|-------------|-----------|--------|
| Context as working memory | Quality over quantity in context window | High | Not considered |
| One agent, one task | Each agent does one focused job | High | **Strong** |
| Capability-capacity model | Context fill = capability drain | High | Not monitored |
| Frequent intentional compaction | Proactive cleanup at 40–60% capacity | Medium | Not applicable (manual workflow) |
| Progressive disclosure | Metadata → content → resources (3-layer) | High | **Not present** |
| Multi-agent context isolation | Subagents return summaries, not raw data | High | **Not present** |
| Orchestrator context hygiene | Keep coordinator context clean | High | **Not present** |

**Key insight:** The book demonstrates that context fill explains 80% of performance variance in multi-agent systems. The reconciliation agent, which runs last in the chain, is working with the most polluted context — the exact opposite of what the book recommends.

### Chapter 5: Tool Use

| Technique | Description | Relevance | Status |
|-----------|-------------|-----------|--------|
| Skills as meta-tools | Temporary behavioural modifications, not actions | High | Already using |
| Progressive disclosure for skills | Discovery → activation → resource layers | High | Partial |
| Context contracts | Declarative input/output schemas for agents | Medium | **Not present** |
| Shared communications database | CRUD on shared state for coordination | Low | Not needed yet |

### Chapter 6: Patterns

| Technique | Description | Relevance | Status |
|-----------|-------------|-----------|--------|
| Plan-Build-Review | Separate thinking from doing, review catches errors | High | **Not used** |
| Orchestrator pattern | Hub-and-spoke with parallel execution | High | Partial (sequential) |
| Expert Swarm | Domain expert + parallel workers + expertise inheritance | Medium | Not applicable yet |
| Human-in-the-Loop | Explicit approval gates between phases | High | Implicit only |
| Progressive Disclosure pattern | Load context on demand for large knowledge bases | Medium | **Not present** |
| Self-Improving Experts | Commands that learn from production experience | Medium | **Not present** |
| Dependency-aware batching | Parallelise independent steps, serialise dependent | High | Not used |
| Single-message parallelism | Invoke all independent agents in one message | High | **Not used** |
| Spec file as shared context | Single artifact flows through all phases | High | Partial (intake template) |
| Council pattern | Read-only parallel experts for analysis | High | **Matches workflow** |

**Key insight:** The book's Pattern Selection Decision Tree recommends starting with Plan-Build-Review as the default. The existing workflow skips the Plan and Review phases entirely, running all agents in "Build" mode.

### Chapter 7: Practices

| Technique | Description | Relevance | Status |
|-----------|-------------|-----------|--------|
| High-leverage review | Review research and plans, not code line-by-line | High | Implicit |
| Eval-driven development | Write eval cases before writing prompts | High | **Not applied** |
| Evaluation spectrum | Vibes → scripted → automated → production | High | Currently at "vibes" |
| Building eval sets from failures | Capture production failures as test cases | Medium | **Not present** |
| Three-tier evaluation | Smoke (3–10) / Core (20–50) / Full (100+) | Medium | Not implemented |
| Agent debugging methodology | Classify → Isolate → Verbose → Simplify → Contrast | High | Not documented |
| Cost-per-success metric | Token usage / successful completions | Medium | Not tracked |

**Key insight:** "Without measurement, development becomes guesswork. Evaluation separates engineering from tinkering." The book argues that even 3–5 well-chosen eval cases beat 50 random examples.

### Chapter 8: Mental Models

| Technique | Description | Relevance | Status |
|-----------|-------------|-----------|--------|
| Prompt Maturity Model (7 levels) | Static → Parameterised → Conditional → Contextual → Higher-Order → Self-Modifying → Meta-Cognitive | High | Skills at Level 4 |
| Specs as Source Code | Specs are the primary programming surface; generated output is secondary | High | Partial |
| Context as Code | Treat agent knowledge like software, not documents | Medium | Not applied |
| Design as Bottleneck | When implementation is automated, design is the constraint | High | Aligns with research focus |

### Chapter 9: Practitioner Toolkit

| Technique | Description | Relevance | Status |
|-----------|-------------|-----------|--------|
| Claude Code skills system | Progressive disclosure with SKILL.md files | High | Already using (Cursor variant) |
| IDE integration patterns | Cursor-specific skill and rule patterns | High | Already using |

### Summary statistics

| Status | Count |
|--------|-------|
| **Strong / Already using** | 8 |
| **Partial** | 10 |
| **Not present / Not applied** | 20 |
| **Not applicable / Low relevance** | 7 |
