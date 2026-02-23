# Run Workflow (Cursor Agent Chat) — Extended

This runbook executes a repeatable multi-agent workflow for AI initiatives in a WordPress + Laravel team.

Agents (skills):
- /architect
- /dev-lead
- /devops
- /governance
- /critic
- /cost-governor
- /strategist
- /reconciliation

Goal:
- Produce a realistic plan, with explicit trade-offs, measurable KPIs, cost controls, and stop conditions.

---

## Step 0 — Provide Intake Context to the Agents

1) Create an initiative doc from `research/orchestration/01_INTAKE_TEMPLATE.md`
2) Paste the completed Initiative Intake into Cursor Agent chat.
3) Add this line:

"All agents: assume this is a WordPress + Laravel team with legacy support, active client delivery commitments, and UK GDPR constraints. Keep outputs structured and role-contained."

Copy/paste outputs into the initiative doc under the matching headings.

---

## Step 1 — ARCHITECT (design + tooling)

1) Invoke: `/architect`
2) Prompt:

"Using the intake above, produce the required ARCHITECT output structure.
Provide 2 options:
- Option A: low-risk minimal architecture
- Option B: more powerful architecture
Include a text diagram for each and a tooling stack with real tools only.
List failure modes and integration points (WP/Laravel/CI/Infra)."

Paste under: `## ARCHITECT OUTPUT`

---

## Step 2 — DEV LEAD (implementation practicality)

1) Invoke: `/dev-lead`
2) Prompt:

"Review the intake and ARCHITECT output.
Evaluate implementation practicality and maintenance.
Call out hidden complexity, skill gaps, and what to simplify first.
Use the DEV_LEAD required output structure.
Be explicit about estimated engineering weeks and long-term support burden."

Paste under: `## DEV_LEAD OUTPUT`

---

## Step 3 — DEVOPS (operability + reliability)

1) Invoke: `/devops`
2) Prompt:

"Review the intake + ARCHITECT output.
Evaluate infra footprint, runtime cost, latency risks, monitoring needs, failure recovery, and operational risk.
Use the DEVOPS required output structure.
Also provide a minimal monitoring checklist and a kill-switch/rollback approach."

Paste under: `## DEVOPS OUTPUT`

---

## Step 4 — GOVERNANCE (security + compliance + client impact)

1) Invoke: `/governance`
2) Prompt:

"Review the intake + ARCHITECT output.
Identify security/compliance/client risks.
Specify required controls (redaction, access control, audit logging, retention).
Use the GOVERNANCE required output structure.
Be explicit about whether client approval is required and why."

Paste under: `## GOVERNANCE OUTPUT`

---

## Step 5 — CRITIC (stress test)

1) Invoke: `/critic`
2) Prompt:

"Review the intake plus outputs so far (ARCHITECT/DEV_LEAD/DEVOPS/GOVERNANCE).
Stress test the proposal.
Identify unrealistic assumptions, overengineering, cost blind spots, operational fragility, weak metrics, and governance gaps.
Use the CRITIC required output structure.
Do not redesign from scratch—critique what exists."

Paste under: `## CRITIC OUTPUT`

---

## Step 6 — COST GOVERNOR (fit to budget)

1) Invoke: `/cost-governor`
2) Prompt:

"Review the intake + ARCHITECT output + CRITIC output.
Assume a monthly AI budget ceiling of £200 unless stated otherwise.
Estimate low/expected/worst-case monthly cost drivers and propose concrete controls (rate limiting, caching, chunk caps, indexing schedule).
Use the COST GOVERNOR required output structure.
If it doesn't fit, propose the minimum changes needed to fit."

Paste under: `## COST GOVERNOR OUTPUT`

---

## Step 7 — STRATEGIST (decision + prioritisation)

1) Invoke: `/strategist`
2) Prompt:

"Using the intake and outputs from ARCHITECT/DEV_LEAD/DEVOPS/GOVERNANCE/CRITIC/COST GOVERNOR:
Decide Proceed/Pilot/Defer/Reject.
If Pilot: propose a 2–6 week pilot plan with KPIs and stop conditions.
Use the STRATEGIST required output structure.
Be conservative and prioritise measurable impact within 90 days."

Paste under: `## STRATEGIST OUTPUT`

---

## Step 8 — RECONCILIATION (final unified plan)

1) Invoke: `/reconciliation`
2) Prompt:

"Reconcile the intake and all agent outputs into one implementable plan.
Resolve conflicts explicitly (what we choose and why).
Choose Option A or B (or a constrained hybrid if required by cost/governance).
Include final architecture diagram, 2–6 week pilot plan, controls/guardrails, KPIs, stop conditions, assumptions, and next actions suitable for Jira tickets.
Use the RECONCILIATION required output structure."

Paste under: `## FINAL RECONCILED PLAN`

---

## Step 9 — Synthesis (optional final edit pass)

(Optional, no skill required)

Use `research/orchestration/03_SYNTHESIS_PROMPT.md` only if you want an additional editorial pass for readability.
Otherwise, RECONCILIATION output is the final document.

---

## Step 10 — Score + Decision Record

1) Fill `research/orchestration/04_SCORECARD.md`
2) Create a decision record using `research/orchestration/05_DECISION_LOG_TEMPLATE.md`

---

## Operational Notes

### Rate limit defaults (internal tools)
- 10 queries/user/day
- max 8 retrieved chunks
- max answer tokens capped
- daily spend alert at 70% of budget
- feature flag kill-switch

### Review cadence
- Weekly during pilot:
  - adoption
  - usefulness score
  - cost
  - incident/help-desk impact

---

## Output Hygiene

- Paste agent outputs verbatim first.
- Then edit for clarity in a separate pass.
- Keep assumptions explicit.
- Record changes in the decision log.
