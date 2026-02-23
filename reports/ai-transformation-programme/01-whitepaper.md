---
title: AI Transformation Whitepaper
description: Full strategic programme — workstreams, prioritisation, roadmap, PoCs, governance, maturity.
---

# AI Transformation Research Programme — Whitepaper

**Audience:** Engineering leads, delivery managers, DevOps, security/compliance.  
**Context:** WordPress (ACF-heavy, Classic Editor) + Laravel (queues, APIs, Passport); client retainer work; PHP 7.4→8.x; Redis, MySQL, caching; UK/GDPR.  
**Objectives:** Engineering efficiency, reduced legacy burden, observability, code quality and test coverage, client-facing AI value where appropriate, governance and data safety.

This document defines research workstreams, prioritisation, a 12-month roadmap, proof-of-concept templates, governance and policy, and a capability maturity model. It aligns with the existing [AI Governance Framework](/reports/ai-governance/01-governance-framework-draft) and [Tooling Stack](/reports/ai-governance/03-tooling-stack).

---

## STEP 1: Research Workstreams

Six major AI research pillars. Each addresses specific problems, strategic importance, disruption level, ROI horizon, and risks.

| Pillar | Problem it solves | Strategic importance | Disruption | ROI horizon | Risks |
|--------|-------------------|----------------------|------------|-------------|--------|
| **1. AI-assisted development & PR review** | Review bottleneck; inconsistent security/sanitisation checks; slow first-pass feedback. | High — directly reduces cycle time and improves consistency across WP/Laravel. | Low | Short | Over-reliance on AI review; false confidence; code/data sent to SaaS (see governance). |
| **2. Legacy modernisation & migration** | PHP 7.4→8.x and WP/ACF upgrade burden; manual, error-prone refactors. | High — unblocks security and performance; reduces long-term support cost. | Medium | Medium | Regression; incomplete migrations; baseline creep if not managed. |
| **3. Test generation & coverage** | Low coverage on legacy codebases; tedious scaffolding; regression gaps. | High — improves confidence for refactors and client changes. | Low | Short | Brittle or irrelevant tests; coverage metrics gamed; no ownership of AI-generated tests. |
| **4. Observability & incident response** | Reactive firefighting; poor visibility into queues, APIs, and WP performance. | High — faster MTTR; better client communication; data for prioritisation. | Medium | Medium | Alert fatigue; cost of tooling; PII in logs if not controlled. |
| **5. Documentation & knowledge capture** | Runbooks, ADRs, API docs out of date; onboarding slow; handover risk. | Medium — reduces bus factor and retainer handover cost. | Low | Medium | Stale or wrong AI-generated docs if not owned and reviewed. |
| **6. Client-facing AI & value** | Client demand for “AI features”; differentiation; upsell. | Medium — revenue and retention; must be scoped and governed. | High | Long | Scope creep; PII/consent; liability; over-promising. |
| **7. Governance, DLP & safe deployment** | Data leakage; unapproved tools; client and GDPR exposure. | Critical — enabler for all other pillars; non-negotiable for UK clients. | Low (if done early) | Short | Policy bypass (shadow AI); slow approval if process is heavy. |
| **8. Agentic / semi-autonomous tooling** | Repetitive tasks (releases, dependency bumps, boilerplate); scaling without linear headcount. | Medium–High — efficiency multiplier; experimental. | High | Long | Uncontrolled changes; security and quality regressions; accountability gaps. |

---

### Workstream summaries

**1. AI-assisted development & PR review**  
Standardise on an approved AI PR review step (e.g. CodeRabbit, Graphite Agent, or Semgrep + AI) in CI; define a short PR review policy (sanitisation, nonces, capabilities, validation) and feed into tool context. Measure: time to first review, issues found in review vs post-merge.

**2. Legacy modernisation & migration**  
Rector as backbone for PHP and framework upgrades; PHPStan/Psalm with baselines for legacy. AI (Cursor/Copilot) for *suggestions* and drafting only. Scope by file or feature (single ACF block, single API module).

**3. Test generation & coverage**  
AI for PHPUnit/Codeception scaffolding and “test that would have caught this bug”; human writes/edits assertions and owns tests. Tie to Definition of Done (e.g. test suggestion on bug closure).

**4. Observability & incident response**  
Structured logging, correlation IDs, queue/API metrics; optional AI-assisted log summarisation and runbook suggestion (with redaction). Server-Timing, WP-CLI profile, Query Monitor patterns for WP.

**5. Documentation & knowledge capture**  
PHPDoc and API docs from code (OpenAPI from routes); AI to draft runbooks/ADRs from history; clear ownership and review before docs become canonical.

**6. Client-facing AI**  
Scoped use cases only (e.g. internal search, content suggestions) with explicit client approval, legal basis, and no PII to third-party models unless contracted. Tier 3 in governance.

**7. Governance, DLP & safe deployment**  
Implement risk tiers (1/2/3), approved tool list, PII redaction before SaaS AI, and safe deployment checklist. See [Governance Framework](/reports/ai-governance/01-governance-framework-draft) and [Risk Register](/reports/ai-governance/02-risk-register-template).

**8. Agentic / semi-autonomous**  
Pilots only: e.g. automated dependency bumps with PR + CI, or release packaging with human gate. Clear boundaries and rollback.

---

## STEP 2: Prioritisation Matrix

Ranking by impact, implementation difficulty, risk, resource requirement, and time to measurable value. Scores are indicative (1–5, 5 = highest impact / hardest / riskiest / most resource / slowest value).

| Workstream | Impact | Impl. difficulty | Risk | Resource | Time to value | Notes |
|------------|--------|------------------|------|----------|---------------|--------|
| Governance, DLP & safe deployment | 5 | 2 | 2 | 2 | 1 (fast) | Foundation; unblocks other work. |
| AI-assisted dev & PR review | 5 | 2 | 3 | 2 | 1 | Well-understood tools; policy doc required. |
| Test generation & coverage | 5 | 2 | 2 | 2 | 1 | Scaffolding + human ownership. |
| Legacy modernisation & migration | 5 | 4 | 3 | 4 | 2 | Rector + PHPStan proven; scope and baselines matter. |
| Observability & incident response | 4 | 3 | 2 | 3 | 2 | Instrumentation first; AI summarisation optional. |
| Documentation & knowledge capture | 3 | 2 | 2 | 2 | 2 | Low risk; clear ownership. |
| Client-facing AI | 4 | 4 | 5 | 4 | 3 | High risk and scope; Tier 3 approval. |
| Agentic / semi-autonomous | 4 | 5 | 4 | 3 | 3 | Experimental; bounded pilots only. |

---

### Top 3 Quick Wins

| # | Initiative | Rationale |
|---|------------|----------|
| 1 | **Governance baseline** | Publish internal AI usage policy, Tier 1/2/3 model, approved tool list, and “no PII in prompts” rule. Enables safe adoption of all other initiatives. |
| 2 | **AI PR review pilot** | Add one AI review tool (e.g. CodeRabbit or Graphite Agent) to a single repo with a 4-week trial; define PR review policy; measure time to first review and catch rate. |
| 3 | **Test scaffolding from AI** | Standardise “suggest PHPUnit test for this fix” in DoD; use Cursor/Copilot/PhpStorm for scaffolds only; track new tests per sprint and failure catch rate. |

---

### Top 3 Strategic Investments

| # | Initiative | Rationale |
|---|------------|----------|
| 1 | **Legacy modernisation pipeline** | Rector (PHP 8.x rules) + PHPStan (baseline) + test suite on a copy of one client codebase; document migration runbooks; reduces long-term support and unblocks PHP 8.x. |
| 2 | **Observability foundation** | Structured logs, correlation IDs, queue/API metrics, and optional AI-assisted summarisation (redacted); improves MTTR and client communication. |
| 3 | **Client-facing AI playbook** | Define scoped use cases, approval flow (Tier 3), legal basis, and tooling (e.g. on-prem or redacted SaaS); one pilot client before broader rollout. |

---

## STEP 3: Phased Roadmap (12 Months)

### Phase 1 — 0–3 months: Low-risk pilots

| Deliverable | Tooling | Ownership | Success metrics |
|-------------|---------|-----------|-----------------|
| Internal AI usage policy and Tier 1/2/3 approval model | Policy doc; optional intake form (Forms/Notion) | Security/Compliance + Delivery | Policy published; no Tier 3 use without approval. |
| Approved AI tools list (IDE, PR review, SAST) | Governance doc; [Tooling Stack](/reports/ai-governance/03-tooling-stack) | Security/Compliance | List agreed; devs trained on “approved only”. |
| AI PR review on one repo (4–6 weeks) | CodeRabbit, Graphite Agent, or Semgrep + config | Backend / WP (repo owner) | Time to first review ↓; issues found in review vs post-merge. |
| Test scaffolding workflow | Cursor/Copilot/PhpStorm; PHPUnit/Codeception | Backend / WP | New tests per sprint; tests tied to bug fixes. |
| PII redaction / “no raw PII to SaaS” enforcement | Policy + training; optional gateway later | Security/Compliance | No incidents; spot checks on prompts. |

**Phase 1 tooling:** Existing CI (e.g. GitHub Actions); one AI PR review tool (see [Pipeline research](/reports/ai-wp-laravel-pipeline/01-research-document)); IDE AI (Cursor/Copilot) under policy.

---

### Phase 2 — 3–6 months: Structural improvements

| Deliverable | Tooling | Ownership | Success metrics |
|-------------|---------|-----------|-----------------|
| Rector + PHPStan migration pipeline (one codebase) | Rector, PHPStan, Composer; baseline | Backend / WP | Files upgraded; test pass rate; rollback count. |
| Observability: structured logging + correlation IDs | Laravel logging; WP logging plugin or custom | DevOps + Backend | Logs queryable; MTTR baseline. |
| Queue and API metrics (throughput, failure rate) | Laravel Horizon / Telescope; Prometheus/Grafana or vendor | DevOps | Dashboards live; alerts defined. |
| Documentation pass: PHPDoc and API docs from code | IDE or CI job; OpenAPI from routes | Backend / WP | Coverage of changed code; API docs up to date. |
| Client approval register (Tier 3) and re-approval cadence | Register (Confluence/SharePoint); annual re-confirm | Delivery + Compliance | All Tier 3 uses documented; no unapproved PII. |

**Phase 2 tooling:** Rector, PHPStan, Laravel Horizon/Telescope, existing APM or Prometheus; OpenAPI tooling (e.g. L5-Swagger, or manual from routes).

---

### Phase 3 — 6–12 months: Advanced / agentic

| Deliverable | Tooling | Ownership | Success metrics |
|-------------|---------|-----------|-----------------|
| AI-assisted log/incident summarisation (redacted) | Log aggregation + LLM API behind gateway; redaction | DevOps + Security | Faster runbook suggestion; no PII in prompts. |
| Client-facing AI pilot (one use case, one client) | Scoped feature; on-prem or redacted SaaS | Cross-team | Client sign-off; legal basis documented; no leakage. |
| Bounded agentic pilot (e.g. dependency bump PRs) | Scripts + CI; optional agent framework | Backend / DevOps | PRs created; human merge rate; no production incidents. |
| Maturity assessment and roadmap refresh | Internal assessment against maturity model (Step 6) | Lead / PM | Level achieved; next-phase priorities. |

**Phase 3 tooling:** Log aggregation (e.g. Datadog, ELK, or cloud-native); LLM API with gateway/redaction; dependency-update bots (Dependabot, Renovate) or custom.

---

## STEP 4: Proof-of-Concept Templates (Top 5 Initiatives)

### PoC 1: AI PR review (first-pass)

**Example architecture (text):**

```
[Developer] --> [Git Push] --> [GitHub]
                                |
                                v
                    [GitHub Actions workflow]
                                |
                    +-----------+-----------+
                    v                       v
            [Semgrep / SonarQube]    [AI PR review tool]
            (deterministic rules)    (CodeRabbit / Graphite Agent)
                    |                       |
                    +-----------+-----------+
                                v
                    [PR comment / status check]
                                |
                                v
                    [Human reviewer] --> [Merge / Request changes]
```

**Tool stack:** Semgrep or SonarQube (CI); one of CodeRabbit, Graphite Agent, Greptile (trial). Policy doc in repo (e.g. `.github/PR_REVIEW_POLICY.md`) or in tool context.

**Rough cost:**  
- Infrastructure: existing CI (no extra).  
- API: CodeRabbit/Graphite free tier or ~$10–30/developer/month; Semgrep OSS free, paid for advanced rules.

**Governance:** Tier 2 (client code, no PII). Ensure no client PII in repo/comments; approved tool only; code may leave environment — confirm DPA and no-training clause.

**Failure modes:**  
- False sense of security (AI misses issues) → keep human review and deterministic SAST.  
- Noise → tune policy and tool config; cap comment volume.  
- Data sent to vendor → document in register; use only with DPA.

---

### PoC 2: Legacy migration (PHP 7.4 → 8.x)

**Example architecture (text):**

```
[Client codebase copy] --> [Rector (PHP 8.x rule set)]
                                    |
                                    v
                          [Composer update / autoload]
                                    |
                                    v
                          [PHPStan level 0/1 + baseline]
                                    |
                                    v
                          [PHPUnit / existing test suite]
                                    |
                                    v
                          [PR per module / feature]
                                    |
                                    v
                          [Human review] --> [Merge to main]
```

**Tool stack:** Rector (OSS), PHPStan (OSS), Composer; optional Cursor/Copilot for manual refactor suggestions on remaining issues.

**Rough cost:**  
- Infrastructure: none (runs in CI or local).  
- API: Rector/PHPStan free; developer time dominant.

**Governance:** Tier 1 or 2 (no PII in codebase). If AI used for suggestions, same “no PII in prompts” rule.

**Failure modes:**  
- Large unreviewable PRs → scope to file or feature.  
- Baseline never reduced → schedule baseline reduction sprints.  
- Regressions → gate on test suite and manual smoke test for critical paths.

---

### PoC 3: Test generation (scaffolding + regression)

**Example architecture (text):**

```
[Bug fix / feature] --> [Developer requests "test for this"]
                                |
                                v
                    [IDE AI or Cursor/Copilot]
                    (scaffold: class, method, basic assertions)
                                |
                                v
                    [Developer adds/edits assertions and edge cases]
                                |
                                v
                    [PHPUnit/Codeception run in CI]
                                |
                                v
                    [PR] --> [Review] --> [Merge]
```

**Tool stack:** PHPUnit, Codeception (if WP); Cursor, GitHub Copilot, or PhpStorm AI for scaffolds.

**Rough cost:**  
- Infrastructure: existing CI.  
- API: IDE AI subscription (existing); no extra infra.

**Governance:** Tier 2 (client code). No PII in test data or fixtures sent to AI.

**Failure modes:**  
- Tests that don’t fail when they should → human must add meaningful assertions.  
- Coverage gaming → focus on “tests per bug” and failure catch rate, not coverage % alone.

---

### PoC 4: Observability + optional AI summarisation

**Example architecture (text):**

```
[Laravel / WP app] --> [Structured logs + correlation_id]
                                |
                                v
                    [Log aggregation (e.g. Datadog, ELK, CloudWatch)]
                                |
                    +-----------+-----------+
                    v                       v
            [Alerts / dashboards]    [Optional: AI summarisation]
            (human response)        (redacted log chunk --> LLM --> runbook suggestion)
                    |                       |
                    v                       v
            [Incident response]      [Human uses suggestion or ignores]
```

**Tool stack:** Laravel logging; WP logging (plugin or custom); Datadog/ELK/CloudWatch; optional gateway + redaction (e.g. PolyRedact, Private AI) before LLM.

**Rough cost:**  
- Infrastructure: log aggregation ~$50–200/month depending on volume.  
- API: LLM for summarisation ~$20–100/month if used; redaction tool extra if used.

**Governance:** Redact PII before any log chunk sent to SaaS LLM; Tier 2 or 3 depending on log content. Document in register.

**Failure modes:**  
- PII in logs → redaction mandatory before AI; classify log sources.  
- Alert fatigue → tune thresholds; prioritise by impact.

---

### PoC 5: Client-facing AI (e.g. internal search or suggestions)

**Example architecture (text):**

```
[Client site / app] --> [User query]
                                |
                                v
                    [Backend: auth + rate limit]
                                |
                                v
                    [Query + allowed context] --> [Redaction if needed]
                                |
                                v
                    [On-prem LLM or approved SaaS with DPA]
                                |
                                v
                    [Response] --> [Human-in-loop or auto]
                                |
                                v
                    [Audit log] --> [Client]
```

**Tool stack:** Self-hosted (Ollama, vLLM, etc.) or approved SaaS (Azure OpenAI, AWS Bedrock in VPC); redaction layer if SaaS; audit logging.

**Rough cost:**  
- Infrastructure: on-prem GPU or VPC API; variable (£100–500+/month or usage-based).  
- API: SaaS usage-based; redaction and audit add cost.

**Governance:** Tier 3. Explicit client approval; legal basis; DPIA if high risk; no raw PII unless contracted and redaction where required.

**Failure modes:**  
- Scope creep → fix use case and success criteria in contract.  
- Hallucinations affecting users → human-in-loop or clear “AI-generated” labelling; fallback to non-AI path.

---

## STEP 5: Governance & AI Policy Framework

### 5.1 Internal AI usage policy (summary)

- **Approved tools only** — Use only tools on the approved list for client work.  
- **Data minimisation** — Send to AI only what is strictly necessary; no client PII in prompts unless Tier 3 approved and redaction where required.  
- **No training on our/client data** — Contractual no-training commitment from vendors; assume breach for detection.  
- **Tier 1/2/3** — Tier 1: no client data. Tier 2: client code/config, redacted/synthetic only; client notification + opt-out. Tier 3: client PII or confidential data or client-facing AI; explicit client approval and legal basis.  
- **Transparency** — Document where and how AI is used; support client approval and audit.  
- **Secure coding** — AI-assisted SAST/SCA encouraged with approved tools; human review for critical findings.

Full detail: [Governance Framework](/reports/ai-governance/01-governance-framework-draft).

---

### 5.2 Client approval model

| Tier | Criteria | Approval |
|------|----------|----------|
| 1 | No client PII; generic tooling on non-client code | Internal only |
| 2 | Client code/config; no PII; or redacted/synthetic only | Client notification + opt-out |
| 3 | Client PII or confidential data; or client-facing AI | Explicit client approval (written); documented legal basis |

**Workflow:** Request → Risk classification (1/2/3) → Security/compliance review (Tier 2–3) → Client approval (Tier 3) → Register entry → Periodic re-approval (e.g. annual).

---

### 5.3 Data handling controls

- **Classification:** Identify datasets and flows that contain PII (code comments, configs, fixtures, logs).  
- **Redaction before SaaS:** Default no raw PII to SaaS AI; use redaction pipeline (e.g. PolyRedact, Private AI, or Presidio) before external calls.  
- **Single control point:** Prefer gateway or proxy so all traffic to third-party AI passes through one policy and audit.  
- **Retention:** Align prompt/log retention with vendor commitments and retention policy; secure disposal.

---

### 5.4 Redaction workflows

1. **Classify** — Which repos, tickets, logs contain PII?  
2. **Detect** — Use consistent PII detection (e.g. 50+ types, multi-language if needed).  
3. **Redact or synthesise** — Mask/hash or synthetic replacement; prefer redaction for external AI.  
4. **Audit** — Log what was redacted and where.  
5. **Centralise** — One control point (proxy/gateway or pre-processing) for all outbound AI traffic.

---

### 5.5 Safe AI deployment checklist

Before deploying or expanding any AI use:

- [ ] Tool on approved list and DPA / no-training in place.  
- [ ] Tier assigned (1/2/3); Tier 3 has written client approval and legal basis.  
- [ ] No raw PII in prompts or payloads unless Tier 3 and redaction policy followed.  
- [ ] Human in the loop for critical security decisions and client-facing outputs.  
- [ ] Audit trail and register updated.  
- [ ] Runbook for “what if AI is wrong or data leaks” (containment, notification, remediation).

---

## STEP 6: Capability Maturity Model

Four levels: from ad hoc AI usage to agentic/semi-autonomous systems. What must be true at each level.

| Level | Name | What must be true |
|-------|------|-------------------|
| **1** | **Ad hoc AI usage** | Some developers use AI (e.g. IDE completion, ad hoc prompts); no standard policy; no central approval or register; risk of shadow AI and inconsistent data handling. |
| **2** | **Assisted development** | Internal AI policy and Tier 1/2/3 in place; approved tool list; PR review or test scaffolding using AI in at least one repo; “no PII in prompts” enforced; client approval for Tier 3. |
| **3** | **AI-augmented workflows** | Structural use across pipeline: AI PR review, test scaffolding, Rector/PHPStan migration, docs from code; observability with optional AI summarisation (redacted); client-facing AI only under Tier 3 and scoped pilots; governance register and re-approval cadence live. |
| **4** | **Agentic / semi-autonomous** | Bounded agentic use (e.g. dependency bump PRs, release packaging) with human gate; clear ownership and rollback; no unconstrained agent access to production or client data; maturity reviewed and roadmap updated. |

---

### Progression criteria (concise)

- **1 → 2:** Publish policy, approved list, one pilot (PR review or tests), Tier 3 process.  
- **2 → 3:** Roll out PR review and test workflow; migration pipeline on at least one codebase; observability baseline; documentation pass; client-facing pilot if applicable.  
- **3 → 4:** At least one bounded agentic pilot with success criteria and incident process; no expansion of agent scope without explicit approval.

---

## References and related documents

| Document | Purpose |
|----------|---------|
| [AI Governance Framework](/reports/ai-governance/01-governance-framework-draft) | Principles, DLP, redaction, deployment model, client approval, GDPR, roles. |
| [AI Risk Register Template](/reports/ai-governance/02-risk-register-template) | Risk register with example risks, controls, assessment lenses. |
| [Recommended Tooling Stack](/reports/ai-governance/03-tooling-stack) | DLP, redaction, on-prem/SaaS, approval workflows, secure-coding tools. |
| [AI in the WordPress + Laravel Pipeline](/reports/ai-wp-laravel-pipeline/01-research-document) | PR review, refactoring, migration, testing, documentation, 90-day pilot, tool comparison. |

**Tools cited in this whitepaper:** Rector, PHPStan, Psalm, Semgrep, SonarQube, CodeRabbit, Graphite Agent, Greptile, PHPUnit, Codeception, Laravel Horizon/Telescope, PolyRedact, Private AI, Presidio, Ollama, vLLM, Dependabot, Renovate.

*This programme is for internal planning and client discussion. Adapt to your jurisdiction and contracts; seek legal and compliance sign-off before adoption.*
