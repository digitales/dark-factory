# Repository Structure Proposal: Prompt Library and Evaluation

**Document type:** Proposal  
**Version:** 1.0  
**Status:** Draft for adoption  

---

## 1. Overview

This proposal defines a **version-controlled prompt library** and supporting structure so that prompts are treated as first-class, reviewable assets. The layout supports:

- Version control (git) for every prompt and evaluation
- Standard prompt formats (YAML/JSON) with variables and metadata
- Benchmarking and evaluation suites with recorded results
- Cost and token tracking metadata/artefacts
- Governance (ownership, labels, approval workflow)

---

## 2. Root layout

```
prompt-library/                    # Dedicated repo or monorepo subtree
├── README.md                      # Purpose, how to add/run prompts, link to policy
├── .github/
│   └── workflows/
│       ├── validate-prompts.yml   # Lint/validate YAML structure, required vars
│       ├── run-evaluations.yml    # Run evaluation suite on changed prompts
│       └── cost-report.yml        # Optional: aggregate token/cost from observability
├── prompts/                       # Versioned prompt templates
│   ├── code-audit/
│   ├── plugin-review/
│   ├── refactoring/
│   └── documentation/
├── evaluations/                   # Evaluation configs and expected behaviour
├── benchmarks/                    # Benchmark datasets and run results
├── schemas/                       # JSON Schema (or equivalent) for prompt format
└── docs/                          # In-repo docs (or link to policy/report)
    └── GOVERNANCE.md
```

---

## 3. `prompts/` — Prompt templates by use case

Each subdirectory corresponds to a **standard use case** (see Internal Policy). One prompt = one file (or a small set of variants). Naming: `kebab-case.yaml` or `.json`.

### 3.1 Structure per file

- Follow the [Standard Prompt Format](https://moritzlaurer.com/prompt_templates/standard_prompt_format/): `prompt.template`, `prompt.template_variables`, `prompt.metadata`, `prompt.client_parameters`.
- `metadata` MUST include: `name`, `version` (semver), `tags` (e.g. `code-audit`, `security`).
- Optional: `metadata.owner`, `metadata.labels` (e.g. `production`, `staging`).

### 3.2 Suggested layout

```
prompts/
├── code-audit/
│   ├── security-audit.yaml
│   ├── style-audit.yaml
│   └── accessibility-audit.yaml
├── plugin-review/
│   ├── wp-plugin-review.yaml
│   └── plugin-security-checklist.yaml
├── refactoring/
│   ├── extract-function.yaml
│   ├── rename-and-clean.yaml
│   └── modernise-php.yaml
└── documentation/
    ├── api-docs-from-code.yaml
    ├── readme-from-spec.yaml
    └── inline-comments.yaml
```

### 3.3 Example: `prompts/code-audit/security-audit.yaml`

```yaml
prompt:
  template:
    - role: "system"
      content: |
        You are a senior developer performing a security-focused code audit.
        Output a structured list of findings: severity, location, issue, recommendation.
    - role: "user"
      content: |
        Language: {{language}}
        Focus: {{focus}}
        Context: {{context}}

        Code:
        ```{{language}}
        {{code}}
        ```
  template_variables: [language, focus, context, code]
  metadata:
    name: "Security Code Audit"
    version: "0.1.0"
    tags: [code-audit, security]
    owner: "platform-team"
  client_parameters:
    temperature: 0
```

---

## 4. `evaluations/` — Evaluation configs and criteria

- **Purpose:** Define test inputs and pass/fail (or scoring) criteria for prompts.
- **Per-prompt:** One evaluation config per prompt (or per variant). Naming: `{prompt-name}.yaml` or under `{use-case}/{prompt-name}.yaml`.

Suggested structure:

```
evaluations/
├── code-audit/
│   ├── security-audit.yaml       # Inputs + expected output criteria
│   └── style-audit.yaml
├── plugin-review/
│   └── wp-plugin-review.yaml
├── refactoring/
│   └── modernise-php.yaml
└── _shared/
    └── rubric-criteria.yaml      # Reference to evaluation rubric (e.g. 15-point)
```

Evaluation file contents (conceptual):

- **inputs:** List of `{variable: value}` cases (e.g. sample code, focus area).
- **expected:** Criteria (e.g. “must mention X”, “must not suggest Y”, “output must be valid JSON”).
- **metrics:** Optional: latency budget, max tokens, cost ceiling.

Tools that fit: custom scripts, [promptfoo](https://www.promptfoo.dev/), or CI that calls your LLM and checks outputs against criteria.

---

## 5. `benchmarks/` — Benchmark data and results

- **Purpose:** Store benchmark datasets and historical run results for regression and comparison.
- **Datasets:** E.g. `benchmarks/datasets/code-audit/samples.jsonl` (one JSON object per line: inputs + optional reference output).
- **Results:** E.g. `benchmarks/results/code-audit/security-audit/YYYY-MM-DD.json` (run timestamp, model, token counts, scores, pass/fail).

Suggested structure:

```
benchmarks/
├── datasets/
│   ├── code-audit/
│   ├── plugin-review/
│   └── documentation/
├── results/
│   ├── code-audit/
│   │   └── security-audit/
│   └── ...
└── README.md                     # How to run benchmarks, interpret results
```

---

## 6. `schemas/` — Validation

- **prompt-schema.json:** JSON Schema for the standard prompt format (top-level `prompt`, `template`, `template_variables`, `metadata`, `client_parameters`).
- CI can validate every file under `prompts/` against this schema.

---

## 7. Governance and workflows

- **GOVERNANCE.md:** Short summary of roles (owner, reviewer, governance lead), lifecycle (design → evaluate → review → deploy → monitor), and how labels (e.g. `production`) are assigned. Link to Internal Policy.
- **Branching:** Prompts changed on a branch; PR triggers validation and (where possible) evaluation run; merge to main = eligible for production after approval.
- **Labels/environments:** Can be tracked in metadata or in an external system (e.g. Langfuse labels); document in README how “production” is set (e.g. “prompts on main with label production in Langfuse”).

---

## 8. Cost and token ROI

- **In-repo:** `benchmarks/results/` can store token counts and cost per run (if exported from your observability stack).
- **External:** Prefer an observability platform (Langfuse, LangSmith, Datadog, etc.) for live cost tracking; link from README and policy.
- **ROI:** Document in README or docs how to pull cost per prompt/task and compare to value (e.g. time saved, error rate) for governance reviews.

---

## 9. Summary

| Area | Location | Purpose |
|------|----------|--------|
| Versioned prompts | `prompts/{use-case}/*.yaml` | Single source of truth, standard format |
| Evaluation criteria | `evaluations/{use-case}/*.yaml` | Test inputs and pass/fail or scoring |
| Benchmark data & results | `benchmarks/datasets/`, `benchmarks/results/` | Regression, comparison, token/cost history |
| Validation | `schemas/prompt-schema.json` + CI | Enforce structure and required fields |
| Governance | `docs/GOVERNANCE.md`, PR + approval | Lifecycle, roles, production promotion |

This structure keeps prompts as code, evaluable and auditable, and aligns with the Internal Policy and Evaluation Rubric.
