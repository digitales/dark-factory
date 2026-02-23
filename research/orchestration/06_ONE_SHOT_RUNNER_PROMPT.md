# One-shot Runner (paste into Cursor Agent chat)

Paste the research prompt below (verbatim), then run the following steps without further clarification.

RESEARCH PROMPT:
<<<
[PASTE RESEARCH PROMPT HERE]
>>>

INITIATIVE INTAKE:
- Title: AI-Augmented Development Pipelines (WP + Laravel)
- Constraints: client delivery, GDPR, legacy WP + Laravel, budget £200/mo
- Target outcomes: reduce PR cycle time, improve test coverage, reduce regressions, faster upgrades, better docs

NOW EXECUTE THIS CHAIN (do not skip steps):

1) /architect
- produce Option A (minimal) and Option B (full) architectures
- include tooling comparison (OSS vs SaaS)
- include failure modes and integration points

2) /dev-lead
- evaluate practicality and sequencing
- estimate engineering weeks
- propose “Phase 1” tasks achievable in 30 days

3) /devops
- evaluate CI runtime cost, reliability risk, monitoring
- provide kill switch plan

4) /governance
- assess data leakage / GDPR risk
- propose controls + client approval guidance

5) /critic
- stress test assumptions, cost creep, weak KPIs

6) /cost-governor
- force plan under £200/month
- propose concrete rate limits and caps

7) /strategist
- decide Pilot/Proceed/Defer/Reject
- provide 90-day roadmap + KPIs + stop conditions

8) /reconciliation
- output final structured research document matching the 6 required sections:
  a) opportunities
  b) tool comparison
  c) governance
  d) 90-day roadmap
  e) KPIs
  f) risks/failure modes

OUTPUT ONLY THE FINAL RECONCILED DOCUMENT.
