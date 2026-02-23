# Orchestration Checklist (Fast Run)

Use this when you want consistent multi-agent outputs with minimal friction.

Prereqs:
- Cursor skills exist:
  - /architect
  - /dev-lead
  - /devops
  - /governance
  - /critic
  - /cost-governor
  - /strategist
  - /reconciliation
- Budget default: £200/month unless specified
- Keep outputs structured and role-contained

---

## 0) Create the initiative doc

Path:
- `research/initiatives/YYYY-MM-DD_<slug>.md`

Start with:
- `research/orchestration/01_INTAKE_TEMPLATE.md`

Paste the user research prompt under a section called:
- `## Original Research Prompt`

---

## 1) Paste intake + prompt into Cursor Agent chat

Paste:
- Entire Initiative Intake
- Original Research Prompt

Then add:

"All agents: WordPress + Laravel team, legacy support, client delivery constraints, UK GDPR constraints. Keep outputs structured and role-contained."

---

## 2) Run the agent chain (copy/paste prompts)

### A) ARCHITECT
Command: `/architect`

Prompt:
- "Use the intake + original prompt. Produce Option A (minimal) and Option B (full) architectures.
Include tooling comparison (OSS vs SaaS), data flows, integration points (GitHub Actions, PR review, local dev, WP/Laravel), and failure modes.
Output using ARCHITECT structure."

Save under: `## ARCHITECT OUTPUT`

---

### B) DEV LEAD
Command: `/dev-lead`

Prompt:
- "Review intake + ARCHITECT. Evaluate practicality, sequencing, engineering weeks, and maintenance burden.
Map each required area (PR review, refactoring, migrations, test generation, docs) to a concrete workflow.
Output using DEV_LEAD structure."

Save under: `## DEV_LEAD OUTPUT`

---

### C) DEVOPS
Command: `/devops`

Prompt:
- "Review intake + ARCHITECT. Evaluate CI runtime impact, reliability risk, monitoring, kill switch.
Provide minimal observability checklist.
Output using DEVOPS structure."

Save under: `## DEVOPS OUTPUT`

---

### D) GOVERNANCE
Command: `/governance`

Prompt:
- "Review intake + ARCHITECT. Assess data leakage/GDPR/client risk.
Specify required controls: redaction, access control, audit logging, retention.
Call out whether client approval is required.
Output using GOVERNANCE structure."

Save under: `## GOVERNANCE OUTPUT`

---

### E) CRITIC
Command: `/critic`

Prompt:
- "Review all outputs so far. Stress test assumptions, overengineering, cost blind spots, operational fragility, weak KPIs.
Output using CRITIC structure. Do not redesign from scratch."

Save under: `## CRITIC OUTPUT`

---

### F) COST GOVERNOR
Command: `/cost-governor`

Prompt:
- "Assume hard ceiling £200/month. Estimate low/expected/worst-case costs and drivers for each pipeline area.
Propose concrete controls: rate limits, caching, context caps, indexing schedule, model selection.
Output using COST GOVERNOR structure."

Save under: `## COST GOVERNOR OUTPUT`

---

### G) STRATEGIST
Command: `/strategist`

Prompt:
- "Using intake + all outputs, decide Proceed/Pilot/Defer/Reject.
If Pilot: provide 90-day roadmap, KPIs, stop conditions.
Output using STRATEGIST structure."

Save under: `## STRATEGIST OUTPUT`

---

### H) RECONCILIATION
Command: `/reconciliation`

Prompt:
- "Reconcile intake + all outputs into one final research doc that satisfies the original prompt.
Resolve conflicts explicitly. Choose Option A/B or constrained hybrid based on cost/governance.
Final doc must include:
1) Opportunities
2) Tool comparison
3) Governance
4) 90-day roadmap
5) KPIs
6) Risks/failure modes"

Save under: `## FINAL RECONCILED PLAN`

---

## 3) Finalise: Score + Decision Log

- Fill: `research/orchestration/04_SCORECARD.md`
- Create: `research/decisions/YYYY-MM-DD_<slug>.md` from `05_DECISION_LOG_TEMPLATE.md`

---

## 4) Optional: Create Jira tickets

Paste into Agent chat (no skill required):

"Generate Jira-ready tickets for Phase 1 (first 30 days) of the 90-day roadmap.
Each ticket must include: summary, description, acceptance criteria, dependencies, owner (WP/Laravel/DevOps).
Keep tickets to 1–3 days each."

---

## Defaults (recommended)

- Internal tooling only for pilot
- Rate limits: 10 queries/user/day
- Context cap: 8 chunks
- Spend alert: 70% of monthly budget
- Kill switch: feature flag in CI and app config

---
