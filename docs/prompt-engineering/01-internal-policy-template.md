# Internal Policy: Prompt Engineering as a Development Discipline

**Document type:** Internal policy template  
**Version:** 1.0  
**Status:** Draft for adoption  
**Governance:** [Owner / committee name]

---

## 1. Purpose and scope

This policy formalises prompt engineering as a development discipline. It applies to:

- All prompts used in production or shared across teams
- Prompts used for code audits, plugin reviews, refactoring, documentation, and similar workflows
- Any use of LLM APIs or AI-assisted tooling that relies on textual instructions (prompts)

**Out of scope:** One-off ad-hoc prompts used only by a single person for exploratory work, provided they are not committed to shared libraries or production code paths.

---

## 2. Version-controlled prompt libraries

### 2.1 Requirement

- **All production and shared prompts** MUST be stored in a version-controlled prompt library (see accompanying [Repository Structure Proposal](./02-repository-structure-proposal.md)).
- Prompts MUST be stored as **files** (YAML or JSON following the [Standard Prompt Format](#standard-prompt-format)), not as inline strings in application code, except where a thin wrapper loads from the library.
- Every change to a prompt MUST be tracked via **git** (or equivalent): commit messages SHOULD reference the prompt name and describe the change.

### 2.2 Standard prompt format

Prompts MUST follow a standardised structure to support parsing, validation, and reuse:

- **Top-level key:** `prompt`
- **Required:** `template` — string or list of message objects (e.g. OpenAI-style `role`/`content`)
- **Variables:** Placeholders use double curly brackets: `{{variable_name}}`
- **Optional:** `template_variables` (list), `metadata` (name, version, author, tags), `client_parameters` (e.g. temperature, model_id)

Example (YAML):

```yaml
prompt:
  template:
    - role: "system"
      content: "You are a senior developer performing a code audit..."
    - role: "user"
      content: "Audit the following {{language}} code for {{focus}}.\n\n{{code}}"
  template_variables: [language, focus, code]
  metadata:
    name: "Code Audit"
    version: "0.1.0"
    tags: [audit, code-review]
  client_parameters:
    temperature: 0
```

### 2.3 Labels and environments

- Use **labels** (e.g. `staging`, `production`, `experiment-*`) to denote which version is active in which environment.
- Promotion to production SHOULD require review (see Governance).

---

## 3. Prompt performance benchmarking

### 3.1 Requirement

- Prompts in the shared library SHOULD have an associated **evaluation suite** (test inputs and expected-behaviour criteria).
- **Benchmarking** MUST be run on prompt changes where feasible (e.g. in CI or a scheduled job), and results recorded (see Repository Structure: `evaluations/`, `benchmarks/`).
- Metrics SHOULD include: task completion, accuracy/relevance (as defined per prompt type), consistency across runs, and latency/token usage (see Cost tracking).

### 3.2 Evaluation rubric

All prompts MUST be assessed against the [Evaluation Rubric](./03-evaluation-rubric.md) before promotion to production. Minimum scores and criteria are defined in that document.

---

## 4. Cost tracking and token ROI

### 4.1 Requirement

- **Token usage** (input and output) and **cost** (where applicable) MUST be tracked per prompt, per run or per batch.
- Tracking MAY be implemented via:
  - Provider/SDK instrumentation (e.g. Langfuse, LangSmith, Datadog LLM Observability), or
  - Internal logging that records model, token counts, and cost (using provider pricing tables).
- **ROI** SHOULD be reviewed periodically: cost per task (e.g. per audit, per doc page) and value (e.g. time saved, error rate) to justify prompt and model choices.

### 4.2 Governance

- Budgets or alerts for prompt-driven usage MAY be set by [owner/team].
- Significant cost increases due to prompt or model changes SHOULD be documented and approved.

---

## 5. Standard prompt formats (by use case)

The following standard prompt types are defined. Each MUST have a corresponding template in the prompt library and SHOULD follow the common structure above.

| Use case           | Purpose | Key variables (typical) | Output format |
|--------------------|--------|--------------------------|---------------|
| **Code audits**    | Review code for security, style, correctness | `language`, `focus`, `code`, `context` | Structured findings (e.g. list of issues with severity and location) |
| **Plugin reviews** | Assess plugin quality, compatibility, risk | `plugin_name`, `manifest/source`, `criteria` | Checklist or report (compliance, risks, recommendations) |
| **Refactoring**    | Propose or apply refactors with constraints | `language`, `code`, `constraints`, `scope` | Patched code + short rationale |
| **Documentation**  | Generate or improve docs from code/specs | `artifact`, `audience`, `format` | Docs (e.g. Markdown, inline comments) |

Detailed templates for each use case are maintained in the prompt library (see Repository Structure: `prompts/` by category).

---

## 6. Governance model

### 6.1 Roles

| Role | Responsibility |
|------|----------------|
| **Prompt owner** | Maintains one or more prompts; ensures they meet policy (versioning, format, evaluation). |
| **Reviewer** | Reviews prompt changes and evaluation results before production. |
| **Governance lead** | Owns this policy; resolves disputes; approves exceptions. |

### 6.2 Lifecycle

1. **Design** — Draft prompt in the library (branch/PR).
2. **Evaluate** — Run evaluation suite and rubric; record results.
3. **Review** — Peer or reviewer approval.
4. **Deploy** — Assign production label / merge to main; deploy via existing release process.
5. **Monitor** — Track usage, cost, and quality; iterate or retire.

### 6.3 Approvals and auditability

- Changes to prompts used in production SHOULD require at least one **reviewer** approval.
- An **audit log** of prompt versions, who changed what, and when MUST be available (e.g. via git history and/or observability platform).

### 6.4 Exceptions

- Exceptions to this policy (e.g. temporary inline prompt, no evaluation) MUST be documented and approved by the Governance lead, with an expiry or review date.

---

## 7. References

- [Repository Structure Proposal](./02-repository-structure-proposal.md)
- [Evaluation Rubric](./03-evaluation-rubric.md)
- PromptOps Guide: [promptopsguide.org](https://www.promptopsguide.org/) (Reliability, Governance, Evaluation, Lifecycle)
- Standard Prompt Format: [MoritzLaurer/prompt_templates](https://moritzlaurer.com/prompt_templates/standard_prompt_format/)

---

*This template is intended to be customised with your organisation’s owner names, tool choices (e.g. Langfuse vs LangSmith), and any stricter/relaxed requirements.*
