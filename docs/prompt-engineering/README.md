# Prompt Engineering as a Development Discipline

This folder contains research and deliverables for **formalising prompt engineering** as a development discipline. It covers version-controlled prompt libraries, benchmarking, cost/token ROI, standard prompt formats, and governance.

## Contents

| Document | Description |
|----------|-------------|
| [01-internal-policy-template.md](./01-internal-policy-template.md) | **Internal policy template** — Version control, benchmarking, cost tracking, standard formats (code audits, plugin reviews, refactoring, documentation), governance model. |
| [02-repository-structure-proposal.md](./02-repository-structure-proposal.md) | **Repository structure proposal** — Layout for `prompt-library/` with `prompts/`, `evaluations/`, `benchmarks/`, `schemas/`, and workflows. |
| [03-evaluation-rubric.md](./03-evaluation-rubric.md) | **Evaluation rubric** — 15-criteria scoring (1–5 each, total 75), interpretation, thresholds, and use-case-specific emphasis. |

## Research basis

- **Version-controlled prompts:** PromptG, Langfuse, ell, PromptOps — prompts as code with git, labels, rollback.
- **Benchmarking:** PromptBench, PromptEval, LiveBench — multi-prompt evaluation, robustness across templates.
- **Cost/token ROI:** Langfuse, LangSmith, Datadog LLM Observability — automatic token/cost tracking, budgets, ROI correlation.
- **Standard format:** MoritzLaurer/prompt_templates — YAML/JSON with `prompt.template`, `{{variables}}`, metadata, client_parameters.
- **Governance:** PromptOpsGuide.org (Reliability, Governance, Evaluation, Lifecycle, Human–AI Interfaces); Prompt Commons; policy-as-prompt considerations.

## Quick links

- [PromptOps Guide](https://www.promptopsguide.org/)
- [Standard Prompt Format](https://moritzlaurer.com/prompt_templates/standard_prompt_format/)
- [Langfuse Prompt Management](https://langfuse.com/docs/prompt-management)
