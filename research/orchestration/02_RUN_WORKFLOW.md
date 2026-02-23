# Run Workflow (Cursor Agent Chat)

Use this as the step-by-step runbook. Execute each step in order.

---

## Step 0 — Provide intake context to the agents

Paste the completed Initiative Intake into the chat, then add:

"All agents: assume this is for a WordPress + Laravel team with legacy support and client delivery constraints. Keep outputs structured."

---

## Step 1 — ARCHITECT (design + tooling)

In Cursor Agent chat:
1) Invoke: `/architect`
2) Prompt:

"Using the intake above, produce the required ARCHITECT output structure. Provide 2 options:
- Option A: low-risk minimal architecture
- Option B: more powerful architecture
Include a text diagram for each, and a tooling stack with real tools."

Copy output into initiative doc under: `## ARCHITECT OUTPUT`.

---

## Step 2 — DEV LEAD (practicality)

1) Invoke: `/dev-lead`
2) Prompt:

"Review the ARCHITECT output and intake. Evaluate implementation practicality.
Call out hidden complexity, estimated engineering weeks, and what to simplify first.
Use the DEV_LEAD required output structure."

Copy output under: `## DEV_LEAD OUTPUT`.

---

## Step 3 — DEVOPS (operability)

1) Invoke: `/devops`
2) Prompt:

"Review intake + ARCHITECT output. Evaluate infra footprint, runtime cost, monitoring needs, failure recovery, and operational risk.
Use the DEVOPS required output structure.
Provide a minimal monitoring checklist."

Copy output under: `## DEVOPS OUTPUT`.

---

## Step 4 — GOVERNANCE (security + compliance)

1) Invoke: `/governance`
2) Prompt:

"Review intake + ARCHITECT output. Identify security/compliance/client risks.
Specify required controls (redaction, access control, audit logging, data retention).
Use the GOVERNANCE output structure."

Copy output under: `## GOVERNANCE OUTPUT`.

---

## Step 5 — STRATEGIST (prioritise + decide)

1) Invoke: `/strategist`
2) Prompt:

"Using the intake and outputs from ARCHITECT/DEV_LEAD/DEVOPS/GOVERNANCE, decide whether to Proceed/Pilot/Defer/Reject.
If Pilot: propose a 2–6 week pilot plan with clear KPIs and a stop condition.
Use the STRATEGIST output structure."

Copy output under: `## STRATEGIST OUTPUT`.

---

## Step 6 — Synthesis (single final proposal)

Use `03_SYNTHESIS_PROMPT.md` (no skill required) to produce the final consolidated write-up.
Paste into initiative doc under: `## FINAL SYNTHESIS`.

---

## Step 7 — Score + Decision

- Fill in `04_SCORECARD.md`
- Create a decision record using `05_DECISION_LOG_TEMPLATE.md`
