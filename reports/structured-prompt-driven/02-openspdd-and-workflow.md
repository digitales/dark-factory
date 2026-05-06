---
title: Workflow & openspdd commands
description: Closed-loop delivery, golden rules for prompt vs code updates, and the openspdd command set.
---

# Workflow & openspdd commands

The SPDD workflow puts prompts under the **same discipline as code**: history, review, and quality gates. Automation is provided by **[open-spdd](https://github.com/gszhangwei/open-spdd)** (`openspdd`), which implements slash-style commands as repeatable CLI steps so artifacts stay **versioned and reviewable** instead of trapped in chat.

Source: [Structured-Prompt-Driven Development (SPDD)](https://martinfowler.com/articles/structured-prompt-driven/).

---

## Golden rules (when things diverge)

| Situation | Move first |
|-----------|------------|
| **Logic / behaviour** is wrong | **Update the structured prompt** (lock intent), then regenerate or patch code |
| **Refactoring** (same observable behaviour) | **Change code**, then **sync** back into the Canvas |

That pairing — **prompt-first for behaviour**, **code-first then sync for structure** — is how the article avoids silent drift between intent and implementation.

---

## Closed loop vs one-way pipeline

In a **one-way** pipeline, requirements become code and later edits happen in code alone; the original spec goes stale.

In SPDD the loop closes on two scales:

1. **Within an iteration:** corrections flow **requirements → prompt → code**; refactors flow **code → prompt** via sync so neither side diverges quietly.
2. **Across iterations:** accumulated prompt assets (domain model, decisions, norms) become the **baseline** for the next change instead of restarting from scratch.

---

## SPDD vs “plain” spec-driven development

The article stresses that SPDD and SDD share “write the spec clearly first,” but SPDD adds:

- **Maintained prompt artifact** — not generate-once-and-discard.
- **From requirements to engineering spec** — approach, structure, norms, safeguards, not only behaviour.
- **Sync, not handoff** — prompt and code co-evolve.
- **Repeatable team control** — consistent governance; trade-off analysis lives in analysis phases while the Canvas records **outcomes**.

---

## openspdd commands (summary)

Commands reference the article’s table (versions tied to the **open-spdd** repo). Typical roles:

| Command | Role | Purpose (high level) |
|---------|------|----------------------|
| `/spdd-story` | Optional | Split large requirements into INVEST-sized stories |
| `/spdd-analysis` | Core | Domain keywords, targeted code scan, strategic analysis |
| `/spdd-reasons-canvas` | Core | Full REASONS Canvas — executable blueprint down to operations |
| `/spdd-generate` | Core | Generate code task-by-task per Canvas |
| `/spdd-api-test` | Optional | cURL-based API test script from endpoints / ACs |
| `/spdd-prompt-update` | Core | Incremental Canvas updates when **requirements** drive change |
| `/spdd-sync` | Core | Push **code-side** changes back into the Canvas |

Optional commands may be generated locally if missing, e.g. `openspdd generate spdd-story` — see the upstream README for current behaviour.

---

## Review focus

With this workflow, review shifts toward **checking intent** against the Canvas and safeguards; reusable patterns accumulate as a **prompt library**, supporting **AI-first software delivery (AIFSD)** as described in the article.

---

**Previous:** [What SPDD is & the REASONS Canvas](/reports/structured-prompt-driven/01-spdd-and-reasons) · **Next:** [Case study: billing engine](/reports/structured-prompt-driven/03-case-study-billing-engine)
