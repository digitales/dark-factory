---
title: What Is a Dark Factory?
description: Definition, core characteristics, and the five levels of automation.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-dark-factory-caption">
  <img src="/report/report-02-what-is-a-dark-factory.png" alt="Dark factory: specs in, software out; no humans on the floor" loading="lazy" class="report-section-image">
  <figcaption id="fig-dark-factory-caption">Dark factory: specs in, software out; no humans on the floor</figcaption>
</figure>

## 2. What Is a Dark Factory?

### 2.1 Definition

A **Dark Factory** in software development is a model where:

- **No human writes code** for the product.
- **No human reviews code** line by line.
- **Humans** define what should exist (specifications), approve outcomes, and evaluate whether what was built serves users.

The term is borrowed from manufacturing: a "dark" factory is one that runs without human workers on the floor (e.g. the Fanuc robot factory where robots build robots). In software, the "floor" is implementation: code is produced by AI agents from specifications; humans focus on intent, validation criteria, and go/no-go decisions.

### 2.2 Core Characteristics

| Characteristic | Description |
|---------------|-------------|
| **Spec-driven** | Inputs are specifications (often markdown): what to build, not how to type it. |
| **Agent-implemented** | Coding agents read specs, edit code, run tools, and iterate without human-in-the-loop on each edit. |
| **Validation over behaviour** | Correctness is judged by observable behaviour (scenarios, tests, satisfaction metrics), not by code review. |
| **Outcome approval** | Humans approve "did we get what we wanted?" not "is this diff correct?" |

### 2.3 The Five Levels (Context)

Dan Shapiro's "five levels" (inspired by NHTSA driving automation) give a useful ladder:

- **Level 0:** Fully manual; no AI in the loop.
- **Level 1:** AI does discrete tasks (e.g. "write a test", "add a docstring"); you still write the important code.
- **Level 2:** AI as pair programmer; you feel faster but are still in the loop on every change (where many "AI-native" developers sit).
- **Level 3:** You mainly review code; the agent writes most of it. Life is "diffs".
- **Level 4:** You write specs and plans; the agent implements; you check outcomes (e.g. tests pass) rather than every line.
- **Level 5 (Dark Factory):** Specs go in; software comes out; no one writes or reviews code. Validation is automated (e.g. scenarios); humans approve outcomes.

Dark Factory is Level 5: the process is a "black box that turns specs into software."
