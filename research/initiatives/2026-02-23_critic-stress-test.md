---

# Critic: Stress Test of Intake + All Outputs

*Review of intake, Research Output, Architect, Dev Lead, DevOps, and Governance. No redesign; critique of what exists.*

---

## 1. Unrealistic Assumptions

| Assumption | Why it may not hold |
|------------|---------------------|
| **"PR cycle time" will fall because of the bot** | Cycle time is driven by reviewer availability, scope of change, and iteration count. The bot does not approve or merge; if humans still do two rounds of review, cycle time may not drop. The 15% target is only testable if you compare like-for-like PRs (size, area) with vs without bot and control for reviewer. |
| **"Documentation freshness" improves with AI** | Doc freshness improves only if someone applies AI-suggested changes. The doc KPI (≥1 doc PR/month) does not say who does it. Without a named owner and time allocation, "optional checklist on merge" often yields zero doc PRs. |
| **"Test coverage +5%" is achievable in 90 days** | Coverage delta depends on adding tests to untested code. If the pilot repo is large and tests are sparse, one engineer editing AI-suggested tests for "1–2 services" may not move the needle on repo-wide %. The KPI is measurable but the target may be optimistic for the scope described. |
| **"Upgrade planning time" drops 20%** | Planning time is one-off per upgrade. You get one data point per upgrade; comparing "this upgrade" to "last upgrade" is confounded by different scope, WP/PHP versions, and team familiarity. Causal attribution to AI/runbook is weak. |
| **"No client data in AI path" is enforceable by policy alone** | Relies on developers never pasting a URL, client name, or env snippet. One paste into Cursor or one PR description with a client reference is enough to violate. Policy reduces but does not eliminate risk; detection is reactive (after the fact). |
| **Baseline (PR cycle time, regression rate) is quick to capture** | Requires a period of "normal" PR volume. If the pilot repo has few PRs in weeks 1–4, baseline is noisy or unrepresentative. Dev Lead's 0.5 w for baseline may be tight. |
| **Bionic is "optional" and low-friction** | If Bionic is OSS and self-hosted, "optional" hides setup and maintenance. If Bionic is used as a hosted service, it may have its own pricing and DPA requirements — same sub-processor concerns as CodeRabbit. |

---

## 2. Hidden Complexity

- **PR bot tuning:** The doc says "tune or disable categories" and "2-week feedback loop" but does not specify who tunes, how (config file, vendor UI, or code), or how "noise" is measured. Teams often discover that turning off noise also turns off useful comments; tuning is iterative and can consume more than 0.5–1 w over the pilot.
- **Rector + WP/Laravel version matrix:** In a monorepo or multi-version estate, "Rector with WP rules" may conflict with specific WP or plugin versions. Dev Lead adds 0.5–1 w for matrix/paths; the risk of "Rector breaks build" is acknowledged but the ongoing cost of keeping rule sets aligned with each WP/Laravel version is underplayed.
- **Client communication:** Governance says "inform clients" and "formal sign-off if contract requires." The initiative does not define who drafts the one-pager, who sends it, or how objections are handled. For multiple clients, this can become a non-trivial coordination and tracking task.
- **"Named owner" for doc and test KPIs:** Reconciliation and Dev Lead assign ownership to fix vague KPIs. In a small team, the same person may already own delivery; adding "doc freshness" and "test quality" without explicit time allocation can mean the owner has no bandwidth and the KPI is still unmet.
- **Cost tracking in practice:** Cost Governor and DevOps assume "weekly 10-minute check" and "spreadsheet or doc." If no one owns it, the first time spend is noticed may be when the bill arrives. Alert at "projected > £450" requires something to project from (actuals per tool), which implies at least lightweight tracking from day one.

---

## 3. Over-Engineering Risk

- **Option B vs Option A:** Option B adds coverage report, structured Cursor use (repo rules), test-generation trial, and docs trial. For a team with "limited engineering capacity" and "active client retainers," Option B's 4–6 weeks and four extra workflow touchpoints may be solving "we want better PRs and safer upgrades" with more moving parts than necessary. Option A (CI + optional Bionic + policy + baseline) already addresses the core intake; test and doc could stay ad-hoc until Option A is proven.
- **Five KPIs for a 90-day pilot:** PR cycle time, regression rate, test coverage, upgrade planning time, documentation frequency. That is a lot to measure and attribute in one pilot. Dropping "upgrade planning" and "documentation frequency" for the pilot (as Dev Lead's simplification table suggests) would reduce measurement load and focus on PR quality and regression.
- **Policy surface:** Governance defines four workflow-specific policy tables (PR review, test gen, docs, migration). For a single-repo pilot, a single "no client data; human merges; AI-assisted where used" rule plus PR template and .cursorrules may be enough. The full matrix is defensible for rollout; for pilot it may be more than necessary.
- **Verdict:** The overall design is not over-engineered (no AI in CI, reversible, one PR bot). The risk is **scope** (Option B and all five KPIs in 90 days) rather than the architecture. Phasing (CI first, then bot, then test/doc) and "simplify first" already mitigate; sticking to Option A and 2–3 KPIs for the pilot would reduce over-engineering further.

---

## 4. Cost Blind Spots

| Blind spot | Why it matters |
|------------|----------------|
| **Cursor/Copilot already in use** | Cost Governor treats Cursor as "existing." If the £500 cap is meant to cover *all* AI pipeline spend, and Cursor is already £X/month, the headroom for CodeRabbit + any extra usage is £500 − X. That is not explicit; teams may assume £500 is for *new* tools only. |
| **Per-repo or per-seat PR bot** | CodeRabbit (and similar) may price per repo or per seat. Adding a second pilot repo or more engineers can push monthly cost up in steps. The "£200 scope" uses Bionic-only; if the team later wants CodeRabbit on a second repo, the cost step is not quantified. |
| **API usage outside Cursor subscription** | If Cursor or Copilot usage exceeds subscription quotas, overage can appear on the bill. "Light doc generation" and "50 doc-generation requests per month" are not automatically enforced; without caps or monitoring, overage is a blind spot. |
| **No budget for DPA or legal review** | Governance requires DPAs and possibly client communication. Legal or contract review (even internal) takes time; if external, it can cost. The initiative does not allocate budget or time for that. |
| **Engineering weeks are opportunity cost** | 2.5–6 weeks of engineering time has a cost (delayed features, or overtime). It is not "free" because it is in-house; it competes with client work. The intake's "without destabilising client delivery" assumes that this fits; if the team is already stretched, the pilot may slip or quality may suffer. |

---

## 5. Operational Fragility

- **PR bot as a single point of dependency:** Merge does not depend on the bot, so production is not fragile. But if the team comes to rely on bot comments and the vendor is down, rate-limited, or deprecated, the *habit* of "wait for bot then review" can create perceived fragility (delays, frustration). The doc correctly says "human review continues"; the risk is behavioural (team stops reviewing until bot posts) rather than technical.
- **CI baseline and legacy paths:** If PHPStan/Rector are applied to a legacy repo with no prior static analysis, the first green baseline may require broad exclusions or level 0. "Main stays green" can mask a large baseline that never shrinks; then any new code in excluded paths is unchecked. Operationally, that is fragile for long-term quality — the doc mentions "baseline creep" but the pilot may ship with a big baseline and no scheduled time to reduce it.
- **No automated check that "no client data" is respected:** Redaction is policy and training. There is no technical control (e.g. pre-commit hook or bot that scans PR title/description for client URLs or keys). A single mistake can trigger the Governance stop condition (disable tool, review); operationally, the pipeline is fragile to human error in a way that is acknowledged but not technically mitigated.
- **Verdict:** Production deploy path is not fragile. Fragility is in (1) reliance on PR bot availability for workflow habit, (2) baseline debt if not actively managed, (3) dependence on humans not pasting sensitive data.

---

## 6. Governance Gaps

- **Enforcement of redaction:** Governance defines what must not be sent (client names, URLs, credentials, PII) and recommends PR template checklist and .cursorrules. It does not say what happens when someone breaches (e.g. incident process, who is informed, whether the repo is excluded from the bot). A single breach triggers "immediate disable and review" but the "review" outcome (re-enable with more controls? permanent disable for that repo?) is not defined.
- **Vendor DPAs in practice:** Governance and Cost Governor assume DPAs with Cursor, Copilot, CodeRabbit. Whether these are already in place or need to be negotiated is not stated. If they are not in place, pilot start may be delayed or the pilot may run with unmitigated sub-processor risk until DPA is signed.
- **Client "informed" vs "approved":** Governance says inform clients and get formal sign-off if required by contract. It does not address what to do if a client objects (e.g. "we do not want our code in any AI tool"). Excluding that client's repo is implied; the process (who decides, how repo is scoped per client) is not spelled out.
- **Audit "which PRs received AI review":** The doc suggests PR template "AI-assisted: yes" or a lightweight log. If the template is optional or rarely filled, the audit trail is incomplete. There is no requirement to make the field mandatory or to automate logging (e.g. "PR has bot comment ⇒ count as AI-assisted"). So governance depends on consistent manual disclosure.

---

## 7. Weak Metrics

| KPI | Issue |
|-----|--------|
| **PR cycle time reduction ≥15%** | Confounded by PR size, area, and reviewer. To attribute to the bot, you need a comparison (same repo, similar PRs, with vs without bot). The doc says "compare median open→merge for PRs with vs without bot comments" — that is correct. But if the pilot has low PR volume, the comparison may be underpowered (few data points). Median is also sensitive to outliers (one very long PR skews the result). |
| **Regression rate** | "No increase (or reduce)" and "post-merge defect/revert rate" are measurable. Attribution to AI pipeline is hard: regressions can be caused by many factors. The stop condition (>50% increase) is clear; the positive "we improved because of AI" is not causally strong. |
| **Test coverage +5%** | Measurable (coverage report). The link to "AI-suggested tests merged" is qualitative (count of tests from AI) unless you tag commits or PRs. So you can measure coverage delta but not strictly "coverage gain from AI." |
| **Upgrade planning time ≥20% reduction** | One data point per upgrade. "Time from start planning to runbook ready" is definable but comparison to "previous upgrade" is noisy (different scope, different people). Weak for a 90-day pilot unless an upgrade is already planned. |
| **Documentation update frequency ≥1 doc PR/month** | Clear and measurable. Does not prove "AI improved docs" — only that someone merged a doc PR. Causal link to AI is "we used AI to draft"; that is not measured. |

**Summary:** The KPIs are mostly measurable; attribution to the AI pipeline is weak for regression, upgrade planning, and doc freshness. PR cycle time is the most attributable if measured as "with vs without bot." Reducing to 2–3 KPIs (e.g. PR cycle time, regression rate, and optionally coverage) and defining them tightly would strengthen the pilot.

---

## 8. What Would Break This?

**Scenario: One engineer pastes a client URL into a Cursor prompt while drafting a runbook.**

- The content is sent to the AI vendor. Under Governance, that is a data exposure incident.
- Stop condition: "Any confirmed leakage of client or PII data into AI tools → immediate disable of affected tool and review."
- **What happens:** Cursor (or Copilot) is disabled for that repo or org; incident is logged; review determines cause and remediation. But:
  - **Detection:** How is it "confirmed"? Only if the engineer reports it or someone audits prompts (which the doc says not to log). So detection is by self-report or chance.
  - **Scope of disable:** Doc says "affected tool" and "for a repo or org." If the policy is "disable Cursor for the whole org," the entire team loses Cursor until the review is done. If "disable for that repo only," other repos continue; but the offending paste may have been in a runbook that touches multiple clients.
  - **Recovery:** Re-enable criteria are not defined. "Review" could be "remind everyone of policy" or "mandatory training" or "no Cursor on client repos." The initiative does not specify.
- **Realistic outcome:** The initiative survives (kill switch works, no production impact), but trust in "no client data" is damaged; one client may demand exclusion or assurance. The gap is **detection** (no technical control) and **recovery criteria** (undefined).

---

## 9. Confidence Adjustment

- **Increased confidence:** The design is reversible, has no AI in CI, and keeps merge and deploy in human hands. Architect, DevOps, and Governance outputs are aligned and detailed. Option A is lean and the "simplify first" (CI + policy, then bot) is sensible. Cost controls and stop conditions are stated. These are solid.
- **Reduced confidence:** Assumptions about doc freshness and test coverage improving without explicit ownership and time; weak causal link for several KPIs; cost and DPA/client-approval details not fully specified; detection of data leakage is reactive; recovery after an incident is undefined. Option B and five KPIs in 90 days add scope and measurement load.
- **Verdict:** **Slightly reduced confidence** overall, but **no major rethink**. The initiative is pilotable and the risks are acknowledged. Recommendations:
  - **Pilot with Option A and 2–3 KPIs** (e.g. PR cycle time, regression rate, and optionally coverage). Defer "upgrade planning time" and "documentation update frequency" to a later phase or drop from pilot.
  - **Define incident recovery:** Before go-live, document "if we disable Cursor/bot due to data concern, re-enable when: [e.g. incident review done, remediation applied, and optionally client informed]."
  - **Clarify cost scope:** State explicitly whether £500 includes or excludes existing Cursor/Copilot spend, and who owns the weekly cost check.
  - **Tighten baseline:** Plan baseline capture over a defined window (e.g. 4 weeks) and minimum PR count (e.g. 10) so KPIs are interpretable; if the pilot repo has too few PRs, extend baseline or choose a busier repo.
