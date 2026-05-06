---
title: Skills, fitness & trade-offs
description: Three SPDD skills, scenario fitness ratings, ROI vs upfront investment — from the Fowler-hosted SPDD article.
---

# Skills, fitness & trade-offs

Thoughtworks identifies **three core skills** for SPDD. Separately, the article rates **where SPDD fits** and spells out **benefits vs upfront investment**. Below is a condensed mirror of those sections; see the [full article](https://martinfowler.com/articles/structured-prompt-driven/) for narrative detail.

---

## Three core skills

| Skill | Essence |
|-------|---------|
| **Abstraction first** | **Design before generate** — objects, collaboration, boundaries. Without this, the model optimises locally while structure decays. |
| **Alignment** | **Lock intent** — what we will/won’t do, standards, hard constraints **before** implementation. Otherwise: fast output, slow rework. |
| **Iterative review** | **Controlled loop** — review and iterate so assistance behaves like engineering, not one-shot drafts (avoids endless patching or expensive restarts). |

---

## Fitness assessment (star ratings from the article)

Higher stars = stronger fit for SPDD.

| Rating | Scenario | Notes |
|--------|----------|--------|
| ★★★★★ | Scaled, standardised delivery | Repeat business logic, long-term maintainability |
| ★★★★★ | High compliance / hard constraints | Regulated, security-heavy, strict architecture |
| ★★★★☆ | Collaboration / auditability | Traceable, reviewable end-to-end |
| ★★★★☆ | Cross-cutting consistency | Refactors across services or languages |
| ★★☆☆☆ | Firefighting hotfixes | Speed over discipline |
| ★★☆☆☆ | Exploratory spikes | Learning vs production quality |
| ★★☆☆☆ | One-off scripts | Disposable work |
| ★☆☆☆☆ | Context black holes | Domain/rules unclear |
| ★☆☆☆☆ | Pure creative / visual work | Taste-led rather than logic-led |

---

## Return on investment (summary table)

| Benefit | Impact | Horizon |
|---------|--------|---------|
| Determinism | High | Immediate |
| Traceability | High | Immediate |
| Faster reviews | High | Short-term |
| Explainability | Medium–high | Gradual |
| Safer evolution | High | Long-term |

---

## Upfront investment (summary)

| Area | Nature |
|------|--------|
| **Mindset shift** | “Design first” vs “code first” — ongoing |
| **Senior expertise** | Translating business rules into clean abstractions — per feature |
| **Automation tooling** | Without tooling, throughput and consistency plateau; **open-spdd** is the article’s reference CLI |

The article notes SPDD can look **“expert-only”** today; longer-term direction is more **organisation-level reuse** of assets and machine-readable rules so the barrier lowers.

---

## Closing angle

SPDD is framed as strong in **logic-heavy** domains; **aesthetic** front-end work is called out as an area where stable patterns are still emerging.

Closing quote in the article (**Richard Hamming**):

> In science, if you know what you are doing, you shouldn’t be doing it. In engineering, if you don’t know what you are doing, you shouldn’t be doing it.

---

**Previous:** [Case study](/reports/structured-prompt-driven/03-case-study-billing-engine) · **Next:** [Sources & next steps](/reports/structured-prompt-driven/05-sources-and-next-steps)
