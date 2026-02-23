# AI Research Orchestration (Cursor)

This folder defines a repeatable multi-agent workflow using Cursor skills:

- /architect
- /dev-lead
- /devops
- /governance
- /strategist

Goal: produce consistent, reviewable research outputs for AI initiatives in a WordPress + Laravel team, while controlling risk, cost, and delivery disruption.

## How to use

1) Copy `01_INTAKE_TEMPLATE.md` into a new initiative file in `research/initiatives/`.
2) Run the workflow in `02_RUN_WORKFLOW.md` step-by-step in Cursor Agent chat.
3) Paste outputs into the initiative file under the correct sections.
4) Use `04_SCORECARD.md` to rate the proposal.
5) Record the final call using `05_DECISION_LOG_TEMPLATE.md`.

## Naming conventions

- Initiative doc: `research/initiatives/YYYY-MM-DD_<short-slug>.md`
- Decision log: `research/decisions/YYYY-MM-DD_<short-slug>.md`

## Rules

- Each agent only answers within its role.
- Capture outputs verbatim, then edit for clarity.
- Prefer small pilots with measurable KPIs.
