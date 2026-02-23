---
title: Executive Summary
description: Key findings on Dark Factories and AI-generated code for PHP, WordPress and Laravel teams.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-exec-summary-caption">
  <img src="/report/report-01-executive-summary.png" alt="Key findings and pipeline overview" loading="lazy" class="report-section-image">
  <figcaption id="fig-exec-summary-caption">Key findings and pipeline overview</figcaption>
</figure>

## 1. Executive Summary

This report summarises research into **Dark Factories** and **AI-generated code** workflows. A Dark Factory in software is a development model where **humans do not write or review code**; they write specifications and approve outcomes. AI agents implement from specs, run validation (often scenario-based), and produce shippable artifacts. The research addresses how this can apply to a PHP-based team (WordPress and Laravel) for efficiency and future-proofing, defines **scenario-based development**, and outlines a **recommended approach and structure for specifications**, with pointers to examples and tooling. It also covers **consultancy dynamics**: how these workflows apply when the dev team sits inside a consultancy (e.g. Elixirr), whether developers are at odds with consultants, whether consultants could replace the dev team, and what competitive advantage the development team retains.

**Key findings:**

- **Dark Factory** = spec-in, artifact-out; no human code writing or line-by-line review; validation by behaviour (scenarios), not by inspecting code.
- **New workflow** centres on: precise specification, scenario/holdout validation, and approval of outcomes rather than diffs.
- **Consultancy environment:** Consultants own business specs (what and why); developers own technical plans, scenarios, and operations. The structure does not give consultants power to replace the dev team—both are needed. Developers’ advantages include technical spec precision, validation design, system knowledge, operational ownership, quality judgement, tool/agent mastery, and a faster path to structured spec writing (they get good at implementable specs quicker than other teams). Product/PM roles remain distinct (business spec vs technical plan); account managers sit upstream and around the pipeline (client relationship, scope, commercials), not inside the spec→code chain.
- **Scenario-based development** uses end-to-end user stories (scenarios), often held outside the codebase like a holdout set, validated by behaviour (including LLM-as-judge where appropriate).
- **Specifications** should be the source of truth: living, executable artifacts that drive implementation. Recommended approach: Specify → Plan → Tasks → Implement, with checkpoints and constitution/principles.
- **Spec structure** benefits from templates (e.g. Spec Kit, StrongDM-style specs), clear separation of what/why vs how, and versioning alongside code.
- **Adoption** (Section 10): workflow changes; where Jira and GitHub sit; skills by level (junior to lead); example constitutions and a draft; agent rules and roles (Spec, Plan, Tasks, Implement, Validate) and coordination via markdown context.

The report is structured so it can be converted to an HTML microsite or PDF (sections, table of contents, and clear headings).
