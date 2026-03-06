---
title: Medium-Impact Gaps
description: Prompt maturity advancement, evaluation loops, self-improvement mechanisms, and skill description improvements.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-medium-gaps-caption">
  <img src="/report/agentic-techniques-05-medium-impact-gaps.png" alt="A gardener tending to a terraced hillside, each level slightly more cultivated than the one below" loading="lazy" class="report-section-image">
  <figcaption id="fig-medium-gaps-caption">Cultivating incremental improvements across the maturity levels</figcaption>
</figure>

## 5. Medium-Impact Gaps

These gaps don't block the workflow but limit its long-term effectiveness and scalability. Each represents an opportunity to move the system from functional to robust.

### Gap G: Missing prompt-model contract

Skills assume Claude understands WordPress/Laravel tooling, ACF patterns, GDPR requirements, and PHP ecosystem conventions. When these assumptions fail (wrong model, knowledge cutoff, hallucinated tool), there's no explicit contract to diagnose the problem.

**Recommendation:** Add a `## Model Assumptions` section to domain-dependent skills:

```markdown
## Model Assumptions
- Model has knowledge of WordPress core APIs, ACF, and common Laravel patterns
- Model can reason about system integration but NOT perform real-time cost lookups
- If a tool or framework is unfamiliar, the model should say so rather than guess
- Model understands UK GDPR requirements at a general level
```

**Effort:** Low (30 minutes across affected skills)

### Gap H: Skill description enrichment

The book identifies three elements for reliable model-invoked matching: **trigger terms**, **scope boundaries**, and **differentiation**. Current descriptions are functional but terse.

**Current architect description:**
> Design technically coherent AI systems for WordPress and Laravel environments.

**Improved version:**
> Design technically coherent AI systems for WordPress and Laravel environments. Use when evaluating system architecture, tool selection, integration feasibility, data flow, or scalability for AI initiatives. NOT for cost analysis (use cost-governor), governance policy (use governance), or business prioritisation (use strategist).

This pattern — positive triggers + negative scope boundaries + routing to alternatives — should be applied across all eight skills.

**Effort:** Low (2 hours total)

### Gap I: No self-improvement loop

The book's Self-Improving Experts pattern describes agents that update their own instructions based on outcomes. The workflow currently has no feedback mechanism — when a skill produces subpar output, improvement is ad-hoc.

**The book's approach:**
1. **Execute** — run the skill
2. **Analyse** — review output quality after the run
3. **Improve** — extract learnings and update the skill

The separation between execution and learning is deliberate — it prevents race conditions in multi-agent systems and keeps agents focused during execution.

**Recommendation:** Add a lightweight post-run improvement step. After reconciliation, review each agent's contribution and capture learnings in a structured log:

```markdown
## Post-Run Improvement Log — [Date]

### architect
- Output quality: Good
- Missing: Did not address CI/CD integration points for this initiative type
- Action: Add CI/CD to the Required Output Structure checklist

### critic
- Output quality: Fair
- Issue: Over-focused on cost, under-focused on operational risk
- Action: Rebalance focus weights in the "You Focus ONLY On" section

### governance
- Output quality: Strong
- No changes needed
```

Over time, these logs become the evidence base for skill improvements — replacing intuition with observation.

**Effort:** Low (add template, discipline to fill it)

### Gap J: No progressive disclosure for reference material

The book describes a three-layer architecture for skills: discovery (short metadata), activation (full instructions), and resource (detailed references loaded on demand). The workflow has layers 1 and 2 but no resource layer.

When a skill needs domain reference material — approved tooling lists, GDPR checklists, WordPress API patterns, client-specific constraints — there's no mechanism to load these on demand. Either the information is baked into the skill (inflating context) or it's missing entirely.

**Recommendation:** Create a `resources/` directory alongside skills:

```
.cursor/skills/
├── architect/
│   ├── SKILL.md
│   └── resources/
│       ├── approved-tooling.md
│       └── wp-laravel-integration-patterns.md
├── governance/
│   ├── SKILL.md
│   └── resources/
│       ├── gdpr-checklist.md
│       └── client-approval-template.md
```

Add a `## Resources` section to skills with guidance on when to load:

```markdown
## Resources
Load on demand (do not read unless relevant to this initiative):
- `resources/approved-tooling.md` — when evaluating tool choices
- `resources/wp-laravel-integration-patterns.md` — when designing integrations
```

**Effort:** Medium (create initial resource files and update skills)

### Gap K: No agent debugging methodology

When skill output quality degrades, there's no documented process for diagnosing the cause. The book describes a systematic approach:

1. **Classify** — Is this a prompt problem, model problem, context problem, or tool problem?
2. **Isolate** — Test the prompt with minimal context
3. **Verbose** — Ask the model to explain its interpretation
4. **Simplify** — Remove sections until behaviour changes
5. **Contrast** — Compare working vs failing cases

Signs of prompt problems vs model limitations:
- Inconsistent behaviour across runs → prompt ambiguity
- Following instructions literally but missing intent → prompt clarity issue
- Correct reasoning, wrong output format → missing examples
- Explaining why it can't do something it actually can → prompt-model contract violation

**Recommendation:** Document this methodology in the orchestration folder as a reference for when output quality issues arise.

**Effort:** Low (1 hour to document)

### Gap L: Distributed prompt architecture — no composition map

The prompt in agentic systems spans multiple files: skills, rules, injected context, orchestration templates. When output quality degrades, there's no map showing which files contribute to the agent's context at each step — making it impossible to isolate which layer is causing the problem.

**Recommendation:** Create a `PROMPT_ARCHITECTURE.md` in the orchestration folder:

```markdown
## Context Composition by Phase

### Phase 1: Individual Agent Analysis
Context sources:
1. Cursor system instructions (implicit)
2. .cursor/rules/research-output.md (output conventions)
3. .cursor/skills/{agent}/SKILL.md (role + constraints + output structure)
4. Initiative intake document (user-provided)

### Phase 2: Reconciliation
Context sources:
1–4 above, plus:
5. All Phase 1 agent outputs (accumulated)
```

This map enables the book's "Isolate" debugging step — you can remove context layers to find which one is causing the problem.

**Effort:** Low (1 hour)

### Prompt maturity advancement path

Where skills sit now and where they could go:

| Current | Improvement | Target | Effort |
|---------|-------------|--------|--------|
| L4: Contextual | Add orchestration between skills (one-shot runner as Higher-Order) | L5: Higher-Order | Medium |
| L4: Contextual | Add post-run improvement logging | L6: Self-Modifying | Medium |
| L4: Contextual | Build a meta-skill that audits other skills against the rubric | L7: Meta-Cognitive | High |

The book recommends keeping individual skills at Level 4 and elevating the orchestration layer to Level 5. Levels 6–7 are rare and should only be pursued once the evaluation infrastructure is in place to validate that self-modification is actually improving quality.
