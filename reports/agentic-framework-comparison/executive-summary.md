---
layout: doc
title: nWave vs Superpowers — Executive summary
description: One-page leadership brief and decision matrix for nWave and Superpowers.
---

# nWave vs Superpowers: Executive summary

**Purpose:** A one-page view for product and engineering leaders choosing an agentic development posture. For depth, see the [full research](/reports/agentic-framework-comparison/).

## The decision in one sentence

**nWave** standardises a gated, auditable **seven-wave pipeline** with **runtime enforcement** (hooks, TDD and edit discipline). **Superpowers** standardises **reusable skills** and a **plan–implement–review** lifecycle with **broad tool portability** and **instruction-based** discipline.

## Decision matrix (leadership)

| Criterion | nWave | Superpowers |
|-----------|--------|-------------|
| **Primary control** | Process gates + hook enforcement (DES) | Skills (`SKILL.md`) + mandatory workflows when applicable |
| **Shape of work** | Fixed waves (discover → … → deliver) | Composable skills (brainstorm, worktrees, plans, TDD, review, finish) |
| **Human approval** | Explicit per-wave review before continuing | Design sign-off, checkpoints, subagent review loops |
| **Portability** | Best with Claude Code + CLI; plugin-only path is degraded for enforcement | Documented for Claude, Codex, Cursor, Gemini, OpenCode, Copilot, etc. |
| **Quality vs cost** | **Rigor profiles** (lean → exhaustive) trade depth for tokens | Tuned by which skills you adopt and how strictly teams follow them |
| **Governance / audit** | Strong artifact trail + enforcement messages | Strong when skills are versioned and reviewed; less “hard” blocking by default |
| **Team overhead** | Higher ceremony; best when predictability & compliance offset cost | Lower friction to start; best when you can govern skills as internal product |

*Sources: [nWave README](https://github.com/nWave-ai/nWave), [Superpowers README](https://github.com/obra/superpowers), [Superpowers launch](https://blog.fsck.com/2025/10/09/superpowers/).*

## When to shortlist each

**Favour nWave** if you need: repeatable SDLC handoffs, hard-to-bypass TDD/phase rules, clear audit narrative, and are willing to invest in the pipeline and Claude Code + CLI setup.

**Favour Superpowers** if you need: the same *ideas* (plan, TDD, review) across many agent products, fast rollout, and incremental adoption—accepting that consistency depends on discipline and skill maintenance more than on hooks.

## Risks to flag in steering committees

- **nWave:** Process drag on small changes; enforcement tied to install path; team training on waves and DES behaviour.
- **Superpowers:** Compliance variance across teams/models; skill debt and conflicting guidance if not owned like internal docs.

## Suggested next step (1–2 weeks)

1. **Pilot one real feature** in each model (or nWave in one squad, Superpowers in another) with the same success criteria: defects escaped, time-to-merge, and engineer satisfaction.
2. **Name an owner** for method maintenance (nWave: pipeline/rigor; Superpowers: skill library and reviews).
3. Revisit the [full comparison](/reports/agentic-framework-comparison/) if you need negotiation-level detail (differences, pros/cons, references).

---

[← Full research: nWave vs Superpowers](/reports/agentic-framework-comparison/)
