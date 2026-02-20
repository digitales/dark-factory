---
title: Adopting the Shift — Workflow, Tools, Skills, and Constitution
description: Workflow changes, Jira and GitHub, skills by level, constitutions, and agent rules.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-adopting-caption">
  <img src="/report/report-08-adopting-the-shift.png" alt="Spec-before-code gate, constitution, and skills by level" loading="lazy" class="report-section-image">
  <figcaption id="fig-adopting-caption">Spec-before-code gate, constitution, and skills by level</figcaption>
</figure>

## 8. Adopting the Shift: Workflow, Tools, Skills, and Constitution

This section outlines concrete workflow changes to support the shift, where Atlassian Cloud (Jira) and GitHub fit, skills expected at each level from junior to lead, and example constitutions plus a draft for the team and company.

### 8.1 Workflow Changes to Aid the Shift

Adopt these process changes incrementally so the shift is sustainable:

- **Spec-before-code gate.** No implementation work (human or agent) starts without an approved or draft `spec.md` (or equivalent) for the feature. Epics or stories in Jira link to a spec branch or doc; "Ready for dev" means "spec and acceptance criteria agreed."
- **Plan-before-tasks.** For any non-trivial feature, a technical plan (`plan.md`) exists and is briefly reviewed before tasks are created or handed to an agent. This keeps architecture and constraints explicit.
- **Single source of truth for intent.** Keep one place for "what we're building and why" (product spec) and one for "how we're building it" (technical plan). Avoid duplicating intent in Jira descriptions, Confluence, and code comments; link from Jira to the spec repo or `specs/` in the codebase.
- **Scenarios as acceptance.** Define at least a small set of end-to-end scenarios per feature (or epic) and run them before marking "Done." Prefer scenarios in a shared format (e.g. `scenarios.md` or a scenario repo) so they can double as holdout validation for agent-generated work.
- **Outcome review, not only diff review.** For agent-generated changes, add a checkpoint: "Do scenarios pass? Does the outcome match the spec?" in addition to (or instead of) line-by-line code review for low-risk, well-specified work.
- **Constitution in the loop.** Every technical plan references the team constitution (stack, security, testing, naming). New engineers and agents read the constitution before generating plans or code. Review plans for constitution compliance.
- **Short retrospectives on spec quality.** Periodically ask: "Did the spec/plan reduce rework or cause it?" Use that to refine templates and the constitution.

### 8.2 Where Jira (Atlassian Cloud) and GitHub Sit

**Jira (Atlassian Cloud)** — Backlog, prioritisation, and traceability:

- **Epics / initiatives** map to a business goal; link to a high-level product spec or Confluence doc if the full spec lives there, or to a GitHub branch/repo that holds `specs/<feature>/`.
- **Stories / tasks** should reference the spec: e.g. "Spec: `specs/003-search-filters/spec.md`" or a link to the branch. "Definition of Ready" can include "Spec exists and is agreed; plan exists for non-trivial work."
- **Status and acceptance** — "Done" is gated by scenario pass (or explicit sign-off) and optionally by a PR that implements the spec. Jira stays the place for prioritisation, assignment, and reporting; it does not replace the spec as the source of truth for *what* is being built.
- **Integration** — Use Jira–GitHub integration (or equivalent) so commits/PRs can link to Jira issues. Branches can follow a convention (e.g. `spec/DEZ-123-search-filters`) so Jira and GitHub stay in sync.

**GitHub** — Code, specs, and agent workflow:

- **Specs** can live in the same repo as code (e.g. `specs/` at repo root) or in a dedicated "specs" repo. Either way, version specs with the code (same branch or linked branch) so "what we built" and "what we said we'd build" are traceable.
- **Branches** — Feature work happens on branches. Specs, plan, and tasks live in that branch (e.g. `specs/<feature-id>/`). The agent (Cursor, Claude Code, or CI job) reads from that branch and writes code on the same branch.
- **Pull requests** — PRs reference the spec (link or path) and optionally the Jira ticket. Description can include "Implements `specs/003-search-filters/spec.md`; scenarios: see `specs/003-search-filters/scenarios.md`." Review focuses on outcome and constitution compliance for agent-generated PRs where appropriate.
- **CI/CD** — Run scenario checks (or a subset) in CI. Block merge if holdout scenarios fail. GitHub Actions (or similar) can run spec-derived tests and mark status on the PR.
- **Constitution and agent context** — Store `constitution.md` (or equivalent) in the repo. Cursor rules, Claude Code skills, or Copilot instructions can reference it. A small script or docs can sync key principles into agent-specific files (e.g. `.cursor/rules`, `.claude/skills`) so every agent run sees the same constraints.

In short: **Jira** = what we're doing and when (backlog, status, commercials); **GitHub** = what we're building and how (specs, code, PRs, CI). They complement each other; neither replaces the other.

### 8.3 Skills Required by Level (Junior to Lead)

In a spec-driven, agent-assisted world, the mix of skills shifts by level. Below is a concise view of what each level should be able to do.

| Level | Spec & intent | Technical plan & validation | Implementation & tools | Collaboration & ownership |
|-------|----------------|-----------------------------|------------------------|----------------------------|
| **Junior** | Read and follow existing specs; add acceptance criteria with guidance; use `[NEEDS CLARIFICATION]` when stuck. | Execute small, well-defined tasks from a plan; run scenarios and report pass/fail; follow constitution. | Use Cursor/Copilot with team rules; write small patches; run tests and fix simple failures. | Work from tickets and spec links; ask for spec/plan review before coding. |
| **Mid** | Draft spec.md for a feature with oversight; refine user stories and acceptance criteria; align with product/consultancy on "what." | Own plan.md for a feature; define data models and contracts; design scenarios for a feature; respect constitution. | Implement from tasks (human or agent); review agent output for correctness and constitution; improve Cursor rules for the project. | Hand off clean specs to agents or juniors; collaborate with PM/consultant on business spec. |
| **Senior** | Own spec quality for a stream of work; challenge vague requirements; design scenarios that catch real failure modes. | Define architecture and constraints across features; own holdout scenario set and CI integration; evolve constitution. | Design agent workflows (which tasks run non-interactively); tune tools and rules; fix complex failures and technical debt from agent output. | Own the spec→plan→task pipeline for a product area; mentor on spec-writing and validation. |
| **Lead** | Set standards for spec and scenario quality; align with consultancy/product on pipeline and handoffs; ensure intent is traceable from Jira to code. | Own constitution and technical principles; decide what is in/out of scope for agents; balance speed vs quality. | Own tooling and agent strategy (Cursor vs Claude Code, CI for scenarios); accountable for delivery and quality. | Own the adoption of the new workflow; align Jira, GitHub, and spec process; represent the dev team in the broader organisation. |

**Summary by level:**

- **Junior:** Consume specs, execute tasks, run scenarios, use AI with guardrails.
- **Mid:** Write specs and plans for features, design scenarios, implement and review agent output, improve rules.
- **Senior:** Own pipeline quality for an area, design validation and holdout strategy, evolve constitution, mentor.
- **Lead:** Own constitution and workflow, align with product/consultancy, own tooling and agent strategy.

### 8.4 Example Constitutions and a Draft for This Team

**What a constitution is.** A constitution is a short, stable document that states the team's (or company's) technical principles: stack, quality bar, security, testing, naming, and what "good" looks like. Every technical plan and agent run should respect it. It is the contract between humans and agents so that generated code fits the organisation.

**Where to find examples.**

- **Spec Kit** — The `/speckit.constitution` command generates a project constitution (code quality, testing, UX consistency, performance). The resulting file is often named `constitution.md` and is synced into agent context. See [GitHub Spec Kit](https://github.com/github/spec-kit) and the repo's docs/templates.
- **StrongDM Factory principles** — High-level beliefs (seed → validation → feedback; tokens as fuel; validation must be end-to-end). See [factory.strongdm.ai/principles](https://factory.strongdm.ai/principles). These are organisational rather than code-level but show how to state "what we believe."
- **Internal standards** — Many teams already have a "tech stack" or "coding standards" doc; that can be turned into the first version of a constitution by adding a few clauses on specs, scenarios, and AI use.

**Draft constitution for this team and company.** Below is a starter constitution that can live in the repo as `constitution.md` (or `docs/constitution.md`) and be refined by the team. It is written so that both humans and agents can follow it.

```markdown
# [Product/Team Name] Development Constitution

## 1. Stack and Versions
- PHP 8.x (minimum version TBD); WordPress 6.x; Laravel 11.x (or as per project).
- Prefer framework defaults and documented APIs; avoid one-off abstractions unless justified in the plan.
- Front-end: [e.g. Laravel Mix, Vite, theme stack] as per project standards.

## 2. Specifications and Plans
- No feature implementation (human or agent) without a spec (what and why) and, for non-trivial work, a technical plan (how).
- Specs and plans live in version control (e.g. `specs/` or linked repo); they are the source of truth. Jira/tickets link to them.
- Use `[NEEDS CLARIFICATION]` in specs when something is ambiguous; resolve before implementation.

## 3. Quality and Testing
- All changes must be covered by automated tests where practical; at minimum, affected scenarios must pass.
- Scenarios (end-to-end user stories) are defined per feature and run before "Done." Holdout scenarios are used to validate agent-generated work.
- No disabling or weakening tests to make a build pass; fix the implementation or the spec.

## 4. Security and Data
- Follow [company] security guidelines (e.g. no secrets in repo, sanitisation, capability checks).
- Personal data and access control: [reference internal policy or "as per client agreement"].

## 5. Naming and Structure
- Follow WordPress and Laravel naming conventions; match existing patterns in the codebase.
- New code must be discoverable: clear file/class/function names; minimal indirection.

## 6. AI and Agent Use
- Generated code must comply with this constitution. Review agent output for constitution compliance and correctness.
- Cursor/Claude/Copilot rules (or equivalent) must reference this constitution. Do not prompt agents in a way that contradicts it.
- When in doubt, prefer clarity and consistency over cleverness.
```

**How to use this draft.** Copy it into the repo, replace placeholders (e.g. product name, PHP/WordPress/Laravel versions, security policy references), and add or remove sections to match the team (e.g. performance, accessibility, deployment). Then:

- Reference it from every `plan.md` (e.g. "This plan respects the project constitution.").
- Add it to Cursor rules or Claude Code skills so agents load it.
- Review it in retros and update it when the team agrees a principle has changed.

A constitution for the **company** (e.g. Elixirr-wide) might be a shorter, higher-level document (e.g. "We use spec-driven development; all technical plans reference the relevant product constitution; we do not commit secrets"). Individual products or teams can then have a more detailed constitution that inherits or references the company one.

### 8.5 Agent Rules, Roles, and Context (Markdown)

**Do we need specific agent rules?** Yes. Agent rules (Cursor rules, Claude Code skills, or Copilot instructions) are what make the workflow repeatable and safe: they load the right context (constitution, stack, templates) and constrain output so generated code and specs stay aligned with the team. Without rules, each run is ad hoc and quality drifts.

**What kind of agents and roles?** You can think in two ways: (1) **roles as phases** — the same tool (e.g. Cursor) is used with different context per phase; or (2) **roles as specialised agents** — separate prompts or subagents for spec, plan, implement, validate. For most teams, (1) is enough: one coding agent that receives different markdown context depending on the phase.

A practical set of roles that can be implemented as **rules + which .md files are in context**:

| Role / phase   | Purpose | Context (what the agent sees) | Output |
|----------------|--------|-------------------------------|--------|
| **Spec**       | Turn a short brief into a full product spec. | Constitution, spec template, (optional) existing spec. | `spec.md` (and branch/folder). |
| **Plan**       | Turn spec into technical plan. | Constitution, spec.md, plan template, (optional) architecture docs. | `plan.md`, optionally `data-model.md`, `contracts/`. |
| **Tasks**      | Break plan into implementable tasks. | Constitution, spec.md, plan.md, tasks template. | `tasks.md`. |
| **Implement**  | Implement from tasks; write or edit code. | Constitution, spec.md, plan.md, tasks.md, (optional) scenarios for "do not break." | Code changes, tests; PR. |
| **Validate**   | Check outcome vs spec and scenarios. | spec.md, scenarios.md, (optional) plan.md; access to run tests or scenario runner. | Pass/fail, or list of gaps. |

These can all be **one agent** (e.g. Cursor or Claude Code) with different rules or slash-commands that inject the right files. For example: "When doing /speckit.specify, always load constitution.md and the spec template; when doing /speckit.implement, always load constitution.md, spec.md, plan.md, tasks.md."

**Can this be coordinated between roles and passed context from .md files?** Yes. The whole pipeline can be coordinated by **which markdown files are passed as context** at each step. No separate orchestration engine is required:

- **Constitution** (`constitution.md`) — Loaded for every role so stack, quality, and AI-use rules apply everywhere.
- **Spec** (`specs/<feature>/spec.md`) — Loaded for Plan, Tasks, Implement, and Validate so intent is never lost.
- **Plan** (`specs/<feature>/plan.md`) — Loaded for Tasks, Implement, and optionally Validate so "how" is explicit.
- **Tasks** (`specs/<feature>/tasks.md`) — Loaded for Implement so the agent knows exactly what to do next.
- **Scenarios** (`specs/<feature>/scenarios.md` or a central `scenarios/`) — Loaded for Validate; for Implement you may pass only "do not break these" or hide holdout scenarios so the agent cannot game them.

**How to implement:**

- **Cursor:** Use project or folder-level rules (e.g. `.cursor/rules/*.mdc` or a single rule file) that reference the constitution and, per phase, which paths to include. A rule might say: "For implementation tasks, always read `specs/<feature>/spec.md`, `plan.md`, and `tasks.md` from the current feature branch, and adhere to `constitution.md`."
- **Claude Code / skills:** Put the constitution and phase-specific instructions in a skill (e.g. `spec-driven/SKILL.md`) that says "when the user asks for a plan, read the spec from … and output a plan that respects the constitution." Skills can point to file paths or paste key sections.
- **Spec Kit–style commands:** If you use Spec Kit or a similar CLI, the commands already encode "load this template + constitution, run the agent, write output here." The agent is invoked with the right context by the script.

**Summary:** You do need explicit agent rules so that the same constraints and context apply every time. The "agents" can be a single coding agent (Cursor, Claude Code, etc.) with phase-specific rules. Roles are effectively "which phase am I in?" and "which .md files do I load?" Coordination is achieved by passing context from markdown files—constitution always; spec and plan for plan/task/implement; tasks for implement; scenarios for validate (and optionally hidden for implement). All of this can live in the repo as .md; no separate agent-orchestration platform is required, though you can add one later (e.g. CI that runs "implement" agent with the right context and then "validate" agent) if you want full automation.
