---
layout: doc
title: nWave vs Superpowers
description: Comparative technical research on two agentic development methodologies.
---

# nWave vs Superpowers: Comparative Research

| | |
|---|--|
| **Leadership one-pager** | [Executive summary & decision matrix](/reports/agentic-framework-comparison/00-executive-summary) |

## Research objective

This document compares two prominent agentic development approaches:

- `nWave` ([GitHub](https://github.com/nWave-ai/nWave/tree/main), [website](https://nwave.ai))
- `Superpowers` ([GitHub](https://github.com/obra/superpowers), [launch article](https://blog.fsck.com/2025/10/09/superpowers/))

The focus is practical engineering behavior: workflow shape, control mechanisms, quality enforcement, operational overhead, and where each approach fits best.

## Method and scope

- Primary sources reviewed: both repositories' READMEs and the Superpowers launch write-up.
- Analysis lens: process architecture, governance model, human control points, quality controls, portability, and team adoption risk.
- This is an external comparative reading, not a benchmark from controlled execution tests.

## Approach snapshots

### nWave (pipeline-first agentic framework)

nWave defines a **seven-wave delivery pipeline** (`DISCOVER`, `DIVERGE`, `DISCUSS`, `DESIGN`, `DEVOPS`, `DISTILL`, `DELIVER`) where each wave produces artifacts, then requires human review/approval before moving forward.

Key structural characteristics:

- Explicit stage routing by context (greenfield, brownfield, bugfix, refactor).
- Large role taxonomy (wave agents, specialists, reviewers, business agents).
- Strong process enforcement through `DES` hook controls, including TDD phase checks and write restrictions during deliver sessions.
- Adjustable rigor profiles (`lean` to `exhaustive`) to balance quality depth vs token cost.
- Installation preference is CLI-based due to hook constraints in plugin-only mode.

### Superpowers (skill-first orchestration methodology)

Superpowers centers on a **skills system** that auto-injects behavioral constraints into coding agents: brainstorm, plan, implement via TDD, review, and finish branch lifecycle.

Key structural characteristics:

- Composable, reusable `SKILL.md` playbooks as the core control surface.
- Broad cross-agent portability (Claude, Codex, Cursor, Gemini, OpenCode, Copilot flows documented).
- Strong emphasis on process discipline via mandatory skill usage when relevant.
- Subagent-driven execution with review loops, but generally less hard runtime gating than dedicated hook-enforced systems.
- Evolution strategy includes writing/testing new skills and continuously improving agent behavior via reusable guidance.

## Similarities

Both frameworks converge on several core principles:

- **Human-in-the-loop delivery**: both avoid blind autonomous end-to-end coding.
- **Plan-before-code behavior**: both push requirements/design clarification before implementation.
- **TDD as a norm**: both explicitly favor RED/GREEN cycles and evidence-oriented validation.
- **Subagent specialization**: both split work across specialized agents/roles.
- **Workflow codification**: both treat agent behavior as a system to be engineered, not ad-hoc prompting.
- **Quality gates**: both insert review checkpoints before declaring completion.

## Key differences

## 1) Control model: hard gating vs normative discipline

- **nWave**: operationally enforces process through DES hooks (phase enforcement, source-write blocking, TDD completeness checks).
- **Superpowers**: enforces through instruction architecture and mandatory skill invocation semantics.

Implication: nWave favors stronger guardrails and consistency; Superpowers favors flexibility and portability.

## 2) Process topology: fixed pipeline vs composable lifecycle

- **nWave**: explicit seven-wave pipeline with prescribed artifact flow and routing logic.
- **Superpowers**: canonical workflow exists, but composition is centered on skills that can adapt to context and platform.

Implication: nWave is easier to standardize as an SDLC; Superpowers is easier to extend/reshape.

## 3) Installation and platform posture

- **nWave**: optimized for Claude Code with CLI install to preserve hook-based enforcement; plugin path is documented as degraded.
- **Superpowers**: intentionally multi-platform with marketplace/plugin pathways across multiple agent ecosystems.

Implication: nWave can be stronger where deeply integrated; Superpowers can spread faster across heterogeneous teams.

## 4) Governance mechanics

- **nWave**: governance is process-embedded via explicit stage controls and enforcement messages.
- **Superpowers**: governance is behavior-embedded through skill content and review practices.

Implication: nWave governance is more system-enforced; Superpowers governance is more culture/instruction-enforced.

## 5) Cost-quality tuning

- **nWave**: explicit rigor profiles map model/reviewer depth and mutation testing to risk/cost.
- **Superpowers**: quality/cost trade-offs are present but less centrally productized as a single runtime control surface.

Implication: nWave gives clearer operational knobs for budgeted rigor at runtime.

## Advantages and disadvantages

### nWave advantages

- Strong execution reliability from hook-based phase enforcement.
- Clear SDLC decomposition useful for teams needing predictable handoffs.
- Explicit quality/cost profile controls support risk-tiered delivery.
- Rich artifact trail improves auditability and governance.

### nWave disadvantages

- Higher process overhead for small changes or rapid spikes.
- Greater onboarding complexity (commands, waves, DES behavior, install method nuances).
- Dependency on environment-specific enforcement features can reduce portability.
- Potential rigidity if team context needs non-standard sequencing.

### Superpowers advantages

- High portability across coding-agent ecosystems.
- Modular skill architecture enables rapid methodology evolution.
- Strong emphasis on planning, TDD, and review without requiring a single fixed pipeline.
- Easier incremental adoption (teams can adopt selected skills first).

### Superpowers disadvantages

- Consistency can vary more by model/toolchain and prompt-compliance quality.
- Weaker hard-runtime gating compared with hook-enforced frameworks.
- Skill sprawl and instruction interactions can introduce governance drift over time.
- Requires disciplined maintenance of skill quality to avoid stale or conflicting guidance.

## Best-fit scenarios

### Choose nWave when

- You need strict process control and auditable stage gates.
- You are operating in higher-risk domains where quality enforcement must be difficult to bypass.
- Your team can accept higher ceremony for predictability and compliance.

### Choose Superpowers when

- You need a portable methodology across multiple agent platforms.
- You value adaptable playbooks and gradual adoption over fixed pipeline standardization.
- Your teams are mature enough to follow norms without relying on hard hook-level constraints.

## Research conclusion

Both approaches share a mature view of agentic development: structured workflows, explicit quality practices, and human approval points. The major divergence is **how control is implemented**:

- `nWave` is **pipeline-and-enforcement heavy** (operational rigor first).
- `Superpowers` is **skill-and-portability heavy** (methodological adaptability first).

For technical leadership, the decision is less "which is better" and more "which governance posture matches your org":

- If you optimize for compliance-grade repeatability, nWave is stronger.
- If you optimize for cross-platform velocity and evolving practice, Superpowers is stronger.

## References

- nWave repository: [https://github.com/nWave-ai/nWave/tree/main](https://github.com/nWave-ai/nWave/tree/main)
- nWave project site: [https://nwave.ai](https://nwave.ai)
- Superpowers repository: [https://github.com/obra/superpowers](https://github.com/obra/superpowers)
- Superpowers launch article: [https://blog.fsck.com/2025/10/09/superpowers/](https://blog.fsck.com/2025/10/09/superpowers/)
