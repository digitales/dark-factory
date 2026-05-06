---
layout: doc
title: Structured-Prompt-Driven Development (SPDD)
description: Research microsite — synthesis of Thoughtworks’ SPDD method (Wei Zhang & Jessie Jie Xia), hosted by Martin Fowler. Governable, reviewable LLM-assisted delivery via versioned structured prompts and the REASONS Canvas.
---

# Structured-Prompt-Driven Development (SPDD)

**Research synthesis.** This microsite summarises [Structured-Prompt-Driven Development (SPDD)](https://martinfowler.com/articles/structured-prompt-driven/) — a Thoughtworks Global IT Services practice for turning LLM coding assistance from individual speed into **governable, reviewable, reusable** team delivery. The primary article is by **Wei Zhang** and **Jessie Jie Xia**, published on **Martin Fowler’s site** (28 April 2026).

**Core claim:** Treat **structured prompts as first-class artifacts** in version control — aligned with code through a defined workflow — so intent, boundaries, and implementation stay traceably linked.

---

## At a glance

| | |
|--|--|
| **Primary source** | [martinfowler.com/articles/structured-prompt-driven/](https://martinfowler.com/articles/structured-prompt-driven/) |
| **CLI workflow** | [open-spdd](https://github.com/gszhangwei/open-spdd) (`openspdd`) |
| **Example codebase** | Billing-engine walkthrough linked from the article |
| **Named skills** | Abstraction first, Alignment, Iterative review |

---

## Microsite sections

| Section | Contents |
|--------|----------|
| [What SPDD is & the REASONS Canvas](/reports/structured-prompt-driven/01-spdd-and-reasons) | Problem framing, canvas dimensions, prompt-as-spec |
| [Workflow & openspdd commands](/reports/structured-prompt-driven/02-openspdd-and-workflow) | Closed loop vs one-way pipeline, command cheat sheet, SPDD vs spec-driven development |
| [Case study: billing engine](/reports/structured-prompt-driven/03-case-study-billing-engine) | Condensed walkthrough — analysis → Canvas → code → tests |
| [Skills, fitness & trade-offs](/reports/structured-prompt-driven/04-skills-fitness-and-trade-offs) | When SPDD pays off, ROI vs upfront cost |
| [Sources & tooling](/reports/structured-prompt-driven/05-sources-and-next-steps) | Quotes, acknowledgements, links |

Start with [What SPDD is & the REASONS Canvas](/reports/structured-prompt-driven/01-spdd-and-reasons) if you are new to the method.

---

## One-line positioning

SPDD is closest to **spec-anchored** AI delivery: the structured prompt is the maintained record of intent; **openspdd** automates repeatable steps so prompts are not trapped in chat threads.

---

*Synthesis for Elixirr Digital research navigation. For diagrams, footnotes, and full narrative, use the [original article](https://martinfowler.com/articles/structured-prompt-driven/).*
