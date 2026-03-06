---
title: High-Impact Gaps
description: Detailed analysis of the six most significant gaps between the Dark Factory workflow and agentic engineering best practices.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-gaps-caption">
  <img src="/report/agentic-techniques-04-high-impact-gaps.png" alt="A suspension bridge with several missing planks, showing the clear path where repairs are needed" loading="lazy" class="report-section-image">
  <figcaption id="fig-gaps-caption">Identifying the structural gaps that limit workflow effectiveness</figcaption>
</figure>

## 4. High-Impact Gaps

Six gaps have the highest impact on workflow quality and efficiency. Each is analysed with the book's rationale, the current state, and a concrete recommendation.

### Gap A: No parallel execution in the orchestration chain

**The book's position:** The Orchestrator Pattern's "critical insight" is that parallelism is achieved at the message level. All independent agents must be invoked in a single message for true concurrency. Sequential messages serialise execution.

> "10 agents in parallel complete in roughly the same wall-clock time as 1 agent; 10 agents serialised take 10× longer."

**Current state:** The workflow runs all eight agents sequentially: architect → dev-lead → devops → governance → critic → cost-governor → strategist → reconciliation.

**Analysis:** The first four agents are independent — they all read the same initiative intake and produce independent analysis. They don't need each other's output. The critic and cost-governor depend on prior output, so they must wait.

**Recommended structure:**

```
Phase 1 (parallel):  architect + dev-lead + devops + governance
Phase 2 (parallel):  critic + cost-governor
Phase 3 (sequential): strategist
Phase 4 (sequential): reconciliation
```

In Cursor, Phase 1 means spawning four Task calls in a single message. This would cut wall-clock time roughly in half with zero quality risk — agents produce identical output regardless of execution order.

**Effort:** Low (update orchestration docs)
**Impact:** High (50% time reduction)

---

### Gap B: No context isolation or orchestrator hygiene

**The book's position:** In multi-agent systems, each subagent should maintain its own context window. The orchestrator receives summaries and conclusions, not raw data. "Context fill equals capability drain."

**Current state:** When running the one-shot workflow, all agent outputs accumulate in a single context window. By the time the reconciliation agent runs, the context contains the full output of seven prior agents — potentially 10,000+ tokens of accumulated analysis.

**Why this matters:** The reconciliation agent does the most complex work (synthesising, resolving conflicts, choosing trade-offs) but operates in the worst context conditions. The book's research shows token usage explains 80% of performance variance.

**Recommendation:** Run each agent as a Cursor subagent (via the Task tool) with its own context window. Each subagent returns a structured summary — not the full analysis. The reconciliation agent then works with clean, compressed inputs from all prior agents.

Example subagent return format:
```markdown
## Architect Summary
- Architecture: Option A (CI + Bionic + Cursor)
- Key trade-off: OSS flexibility vs SaaS convenience
- Risk: Vendor deprecation for Bionic
- Complexity: Medium
- Integration points: GitHub Actions, WordPress hooks, Laravel queues
```

**Effort:** Medium (restructure one-shot runner to use Task tool)
**Impact:** High (improved reconciliation quality)

---

### Gap C: No few-shot examples in skills

**The book's position:** "When possible, show don't tell. Few-shot examples establish expected input/output format, tone and style, and edge case handling."

**Current state:** No skill includes examples. The architect skill says "produce a Text Diagram" but never shows what one looks like. The critic says "describe one realistic failure scenario" but doesn't demonstrate expected depth.

**Why this matters:** Without examples, the model infers output format from the structural description alone. This produces inconsistent results across runs — sometimes a text diagram is ASCII art, sometimes it's a Mermaid block, sometimes it's prose. The book warns that examples anchor format without constraining content creativity.

**Recommendation:** Add a `## Example Output` section to each skill with one truncated input/output pair showing structure and tone. Prioritise architect (text diagram format), critic (depth of failure scenario), and reconciliation (conflict resolution format).

Example for the architect skill:
```markdown
## Example Output (truncated)

### 1. Problem Definition
WordPress sites require automated accessibility audits on content save.

### 2. Proposed Architecture
```
WordPress (post_save hook)
  → Laravel queue job (accessibility-check)
    → axe-core headless scan
      → results stored in wp_postmeta
        → admin notice on next load
```

### 3. Tooling Stack
- axe-core 4.x (OSS, headless via Puppeteer)
- Laravel Horizon for queue monitoring
- WordPress REST API for result retrieval
```

**Effort:** Medium (2 hours across top 3 skills)
**Impact:** High (output consistency)

---

### Gap D: No uncertainty handling

**The book's position:** "Agents need guidance on when to act vs when to ask." Without explicit uncertainty handling, agents make arbitrary decisions on ambiguous inputs — sometimes guessing, sometimes asking, with no consistency.

**Current state:** Only the reconciliation skill addresses missing information: "If an input is missing, proceed with explicit assumptions and call out what's missing." No other skill has this guidance.

**Why this matters:** When an initiative intake is ambiguous (unclear budget, vague success criteria, missing technical constraints), each skill handles the ambiguity differently. The architect might assume a constraint; the dev-lead might ignore it; the critic might flag it. This inconsistency compounds in reconciliation.

**Recommendation:** Add a standardised `## Handling Uncertainty` section to every skill:

```markdown
## Handling Uncertainty

ASK the user when:
- The initiative description is ambiguous and multiple interpretations are valid
- A critical input (e.g., budget, compliance requirement) is missing
- The change has significant consequences that depend on unstated assumptions

PROCEED with best judgment when:
- The choice is between equivalent options (e.g., two similar tools)
- The assumption can be explicitly stated and verified later
- The information gap does not change the core recommendation
```

**Effort:** Low (1 hour across all skills)
**Impact:** High (consistent handling of ambiguous inputs)

---

### Gap E: No evaluation practice

**The book's position:** "Without measurement, development becomes guesswork. Evaluation separates engineering from tinkering." The book lays out a concrete workflow: write eval cases before modifying prompts, start with 3–5 cases, build eval sets from production failures.

**Current state:** The 15-criteria evaluation rubric exists as infrastructure but has never been applied to skill outputs. No eval cases exist. No systematic measurement of skill quality occurs. The workflow operates at the "vibes" level of the book's evaluation spectrum.

**Why this matters:** Without eval cases, there's no way to know whether a skill modification improved or degraded output. Changes to skills are based on intuition, and regressions go undetected until someone notices poor reconciliation output.

**Recommendation:** Start minimal. For each of the three most critical skills (architect, critic, reconciliation), create one "golden example":

1. A known-good initiative intake (input)
2. What good output looks like for that input (expected output)
3. 3–5 constraint checks (must-have elements)

Store these in `research/eval-cases/`. When modifying a skill, run it against the golden example and compare. This is the book's "Scripted" evaluation tier — simple enough to maintain, rigorous enough to catch regressions.

**Effort:** Medium (6 hours to create initial eval cases)
**Impact:** High (transforms ad-hoc improvement into systematic engineering)

---

### Gap F: Specs as source code — not fully realised

**The book's position:** "Throwing away prompts after generating code is like checking in compiled binaries while discarding source." Initiative documents, research outputs, and plans should be treated as version-controlled first-class artifacts — the "source code" that agents execute.

**Current state:** Initiative docs in `research/initiatives/` are partially this pattern. However:

- They're not structured as executable specs that agents can directly consume without manual copy-paste
- The one-shot runner uses a placeholder (`[PASTE RESEARCH PROMPT HERE]`) rather than referencing a spec file path
- There's no standardised spec format with frontmatter metadata

**Recommendation:** Standardise initiative intake as a structured spec file (with YAML frontmatter for metadata like title, budget, constraints, and target outcomes) that all agents can reference by file path. The one-shot runner should accept a spec file path, not require paste-in.

```yaml
---
title: AI-Augmented Development Pipelines
budget: £200/month
constraints: [client delivery, GDPR, legacy WP + Laravel]
target_outcomes:
  - reduce PR cycle time
  - improve test coverage
  - reduce regressions
---
```

**Effort:** Medium (3 hours to standardise format and update runner)
**Impact:** Medium-High (makes the workflow reproducible and version-controlled)
