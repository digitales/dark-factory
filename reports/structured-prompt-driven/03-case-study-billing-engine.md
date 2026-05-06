---
title: Case study — billing engine enhancement
description: Condensed walkthrough of the Fowler article’s SPDD example — multi-plan billing, model-aware pricing, prompt updates vs refactor sync.
---

# Case study — billing engine enhancement

The article walks through an **end-to-end** SPDD example: enhancing a **token billing engine** for an LLM API — small enough to read, complete enough to show analysis → Canvas → code → tests. Artifacts and commands are illustrated with **open-spdd**; the **initial system** and **enhancement diff** are published on GitHub (links in the [primary article](https://martinfowler.com/articles/structured-prompt-driven/)).

This page **does not** reproduce full prompts or code — it extracts the **process pattern** for teams evaluating SPDD.

---

## Business thrust

The enhancement moves from a **static** pricing model to:

- **API:** `POST /api/usage` gains required **`modelId`** (e.g. `fast-model`, `reasoning-model`).
- **Pricing:** **Model-aware** rates instead of one global rate.
- **Plans:** e.g. **Standard** (quota + model-specific overage) vs **Premium** (no quota; **split** prompt/completion billing per model).
- **Architecture:** Extensible pattern (e.g. Strategy / Factory) for future plans.

---

## Step pattern (mapped to commands)

| Step | Activity | SPDD idea |
|------|----------|-----------|
| 1 | User story / requirements | Optional `/spdd-story`; consolidate ACs (Given/When/Then) |
| 2 | Clarify analysis | Human alignment — core logic, scope boundaries, DoD scenarios |
| 3 | Analysis context | `/spdd-analysis` — targeted codebase scan, risks, direction |
| 4 | Structured prompt | `/spdd-reasons-canvas` — full REASONS blueprint |
| 5 | Code + API tests | `/spdd-generate`; optional `/spdd-api-test`; run script (e.g. `sh scripts/test-api.sh`) |
| 6 | Unit tests | Template-driven test prompts where dedicated commands are still evolving |

---

## Prompt maintenance (article behaviour)

- **Preferred:** avoid manually hacking the Canvas in isolation — use **dialogue** with the AI so only affected sections change.
- **Behaviour change:** `/spdd-prompt-update` then `/spdd-generate` for **targeted** updates (example: `modelId` mandatory with default `fast-model` after business confirmation).
- **Refactor only:** e.g. extract **magic numbers** to constants in code, then **`/spdd-sync`** so the Canvas stays an accurate design document.

The article explicitly cites **Martin Fowler’s** definition of refactoring: internal structure change **without** observable behaviour change — hence **sync**, not prompt-first regeneration.

---

## Outcomes claimed in the article

Strong **intent alignment**, transparent engineering decisions, a **Canvas synchronized** with the codebase, and **compounding** domain knowledge across iterations — with the caveat that SPDD aims at **reliable** delivery, not always the shortest path to raw generation speed.

---

**Previous:** [Workflow & openspdd](/reports/structured-prompt-driven/02-openspdd-and-workflow) · **Next:** [Skills, fitness & trade-offs](/reports/structured-prompt-driven/04-skills-fitness-and-trade-offs)
