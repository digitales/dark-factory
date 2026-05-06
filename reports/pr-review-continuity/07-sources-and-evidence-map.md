---
title: Sources and evidence map
description: Internal project evidence and external sources used to build this microsite.
---

# Sources and evidence map

## Internal project research (this repository)

- [AI-Augmented Development Pipelines — PR Review](/reports/ai-augmented-dev-pipeline/02-pr-review)  
  First-pass AI review framing, merge guardrails, failure modes, and KPI logic.
- [AI-Augmented Development Pipelines — Overview](/reports/ai-augmented-dev-pipeline/01-overview)  
  Human-in-control operating posture for AI in development workflows.
- [AI-Augmented Development Pipelines — Governance and Controls](/reports/ai-augmented-dev-pipeline/08-governance-and-controls)  
  Data, policy, and transparency controls.
- [Dark Factories — Adopting the Shift](/reports/dark-factory/10-adopting-the-shift)  
  Outcome-based validation in addition to diff-level review.
- [AI in the WordPress + Laravel Pipeline](/reports/ai-wp-laravel-pipeline/01-research-document)  
  Review bottleneck context, pilot structure, and risks.

---

## External guidance and evidence

### Review process standards

- Google Engineering Practices — **The Standard of Code Review**  
  [https://google.github.io/eng-practices/review/reviewer/standard.html](https://google.github.io/eng-practices/review/reviewer/standard.html)
- Google Engineering Practices — **What to look for in code review**  
  [https://google.github.io/eng-practices/review/reviewer/looking-for.html](https://google.github.io/eng-practices/review/reviewer/looking-for.html)
- GitHub Docs — **Best practices for pull requests**  
  [https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests)

### Review capacity and quality evidence

- SmartBear — **Best Practices for Code Review** (includes Cisco study guidance on LOC/timebox)  
  [https://smartbear.com/en/learn/code-review/best-practices-for-peer-code-review/](https://smartbear.com/en/learn/code-review/best-practices-for-peer-code-review/)
- Avelino et al. — **A Novel Approach for Estimating Truck Factors** (knowledge concentration risk)  
  [https://arxiv.org/abs/1604.06766](https://arxiv.org/abs/1604.06766)

### AI-assisted coding and review risk

- Catalan et al. (2026) — **"I'm Not Reading All of That"** (cognitive engagement decline with agentic assistants; formative study)  
  [https://arxiv.org/abs/2603.14225](https://arxiv.org/abs/2603.14225)
- GitClear — **Coding on Copilot** (maintainability/churn trend analysis; industry dataset)  
  [https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality](https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality)

### Secure development governance

- NIST SP 800-218 — **Secure Software Development Framework (SSDF) v1.1**  
  [https://doi.org/10.6028/NIST.SP.800-218](https://doi.org/10.6028/NIST.SP.800-218)

---

## Evidence quality notes

- Some AI-assistance findings are recent and include preprint/formative studies; treat exact percentages cautiously, but the operational risk pattern is directionally consistent.
- Industry benchmarks are most useful when normalized to your own baseline and repository mix.
- Governance recommendations should be adapted to client data sensitivity and contractual requirements.

---

**Previous:** [30-60-90 day rollout](/reports/pr-review-continuity/06-30-60-90-rollout)

