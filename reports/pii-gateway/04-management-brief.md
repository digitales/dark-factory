# PII Gateway for AI-Assisted Development

**Prepared for:** Elixirr Group management  
**Date:** 10 June 2026  
**Status:** Shelved — not submitted for approval  
**Contact:** [ross.tweedie@elixirr.com](mailto:ross.tweedie@elixirr.com)  
**Related policy:** [Elixirr AI Policy (30 March 2026)](https://elixirrpartners.sharepoint.com/:b:/s/Internal/IQDtHoCFVP9IT4gO6KjoEFjjAfy__oCz0uLd9VrrkrIlFI8?e=ZMHpJS)  
**Working memory:** dark-factory (this document). Builds on EDI standards and R&D; EDI code **not started** — requires separate authorization.

---

## Executive summary

Engineering teams are adopting AI tools (principally **Cursor** for coding) under the **authorised use case** of developing and testing code. The Elixirr AI Policy permits this activity but **prohibits sending Personal Data or confidential client information to AI systems** unless the tool is approved and **appropriate data protection measures** are in place.

Today we rely on checklists, training, and developer discipline. That is necessary but **not sufficient** to assure compliance on client codebases where personal data, credentials, and client identifiers can appear in code, diffs, and prompts.

We propose a **PII Gateway**: a local, self-hosted control that automatically blocks or redacts sensitive data **before** it reaches third-party AI APIs. This operationalises Policy §7.2 and completes work the **EDI Secure SDLC Agent Pack** already defines as mandatory — an AI invocation checkpoint for PII redaction — using Presidio expertise already explored in EDI (`nvisnx-rnd`).

**Decision requested:** Approve the PII Gateway **in principle** and Phase 0 rollout (Cursor path first). Approve **where** code is built only after this decision (proposed: `edi/dso-pii-gateway`, owned by DSO / AI Enablement).

*This completes mandatory controls already defined in the EDI Secure SDLC Agent Pack — platform alignment with in-flight EDI work, not a new EDX-only initiative.*

---

## Relationship to EDI work already in flight

This proposal **builds on and aligns with** EDI initiatives already underway. It does not replace them or fork a parallel EDX-only approach.

| EDI work in flight | What it covers | How the gateway relates |
|------------------|----------------|-------------------------|
| **Secure SDLC Agent Pack** | Rule 19: mandatory AI invocation checkpoint for PII redaction | Gateway **implements** this requirement for dev tools |
| **`nvisnx-rnd`** | Presidio R&D on document PII detection | Reuses stack direction and recognizer learnings |
| **`apps-cursor-ai-enablement`** | MCP ingress security (credentials stay in the server) | **Complementary** — gateway covers egress (what the model sees) |
| **`dso-cursor-ai-enablement`** | DSO Cursor onboarding and pipeline patterns | Gateway install added to enablement checklist when built |
| **`qa-cursor-ai-enablement`** | QA team Cursor enablement | Same gateway requirement for client repos |

**Practice alignment (EDX and EDI):** One shared policy engine and CLI. EDX (GitHub/GitLab) and EDI (CodeCommit/CodePipeline) differ only in **how CI hooks are wired** — not in policy, detectors, or audit format. No practice is asked to change source control.

**What we are not doing:** Duplicating MCP security, batch document scanning, or Cursor rules/hooks already in EDI enablement repos. No EDI repository commits until management and Operations sign off (item 7 below) — this respects the EDI authorization gate while the spec is finalised in dark-factory.

---

## Decision required

Please confirm approval for:

| # | Decision | Recommended |
|---|----------|-------------|
| 1 | Adopt PII Gateway as the **standard control** for dev-team AI tooling on client code | **Approve** |
| 2 | Authorise **Phase 0** (Cursor local proxy + secret/client blocklists) within **14 days** | **Approve** |
| 3 | Authorise **Phase 1** (full Presidio detector suite + golden tests) following Phase 0 validation | **Approve in principle** |
| 4 | Assign a **policy owner** for per-client blocklists and golden-test governance | **Assign owner** |
| 5 | Confirm Cursor is on the **Authorised AI Applications** list (AI Hub) for code development | **Confirm with AI Innovation & Enablement** |
| 6 | Grant **Operations written approval** for gateway integration per Policy §7.3 | **Route to Operations** |
| 7 | Authorise **implementation repository** (e.g. EDI) after items 1–6 | **Defer until governance sign-off** |

---

## Why this matters now

### Policy alignment

| AI Policy requirement | Current gap | How the gateway helps |
|----------------------|-------------|------------------------|
| **§7.2** — No upload/disclosure of Personal Data unless tool approved, protected, and lawful basis exists | Manual redaction only; one mistake sends data to a vendor | Automatic block/mask at trust boundary |
| **§5.1(b)** — Confidential/proprietary info not in *unauthorised* AI systems | Client identifiers can still leak via authorised tools (Cursor) without egress control | Per-client blocklists; hard block on secrets (with §7.2 for Personal Data) |
| **§4.2** — Reasonable security for Personal Data (UK GDPR) | No technical enforcement | Preventive control + audit trail |
| **§8.5** — Users must maintain records and evidence responsible use | Hard to prove compliance after the fact | Gateway audit assists; **users remain responsible** for records |
| **§8.4** — Monitoring may include reviewing prompts or outputs | Not cited in current controls | Metadata audit complements monitoring; does not restrict Elixirr's monitoring rights |
| **§7.5** — Users must verify AI outputs before business use | Unchanged by any tooling | Gateway does not replace human review or Partner notification duties |
| **§6.2(e)** — Code development is an authorised use case | Activity allowed; unprotected data crossing the boundary is not | Enables safer use of authorised tools |

### Business risk without this control

- **Regulatory:** Accidental Personal Data in an LLM prompt may trigger UK GDPR breach notification and client contract issues.
- **Reputational:** Client trust depends on demonstrable controls, not checklist compliance alone.
- **Operational:** A reportable incident triggers Policy §9 — mandatory reporting, investigation (including Elixirr access to AI applications, accounts, and relevant materials), and likely suspension of affected tooling pending remediation. Scope may widen if root cause is unclear.
- **Commercial:** We cannot confidently scale AI-assisted delivery to more clients without assurable data boundaries.

---

## What we are proposing

### In plain terms

A **local gate** sits between our developers’ tools and external AI services:

1. **Before Cursor sends context to an AI provider** — prompts and file context pass through a local proxy on the developer machine; secrets are blocked, personal data masked.
2. **Before any future PR review bot sees a code change** — the same policy engine can sanitise diffs via a CI hook (ready when a bot is adopted; not required today).
3. **Everything is logged** — we record *that* redaction happened and *what type* of data was caught, not the full prompt (privacy-preserving audit). This does not limit investigation: the policy still allows Elixirr to require access to AI applications, accounts, and relevant materials as part of any investigation.

No client data is sent to a third-party redaction SaaS in the pilot. The gateway runs **locally**, using open-source components (Microsoft Presidio).

### What it is not

- Not an **Authorised AI Application** (§6.1) — it is a **control layer**; Cursor must still be on the AI Hub list
- Not a replacement for §7.5 human verification of AI outputs
- Not permission to send Personal Data to models (“redact first, send clean code only”)
- Not a token-cost tool (compression is out of scope)
- Not optional training — it **enforces** policy at the wire
- **Not EDI repo changes today** — spec and approval live in dark-factory until authorized

### Architecture (simplified)

```
Developer / PR  →  PII Gateway (local)  →  Authorised AI tool  →  LLM provider
                         ↓
                   Audit log (metadata)
```

Two paths, one policy:

| Path | Control | Strictness | Status |
|------|---------|------------|--------|
| Developer IDE (Cursor) | Local proxy on developer machine | **Block** secrets; **mask** personal data | **In use — Phase 0 priority** |
| Automated PR review (when adopted) | Diff sanitiser before bot API | **Block** on any client identifier | Forward-compatible; not in use today |

---

## Phased rollout

| Phase | Timeline | Deliverable | Effort | Policy win |
|-------|----------|-------------|--------|------------|
| **0** | Days 0–14 | Cursor local proxy + regex/secret/client blocklists | ~1 week engineering | §7.2 control on highest-volume path (IDE) |
| **1** | Days 14–30 | Presidio detector suite + golden tests + PR diff CLI (ready for future bot) | ~2 weeks | Full detection; forward-compatible PR path |
| **2** | Days 30–60 | Per-client policy files; EDI enablement checklist update | Ongoing governance | Direct client mapping; DSO onboarding aligned |
| **3** | 60+ | Optional token compression *after* redaction | If justified separately | Cost optimisation only |

**Phase 0 alone** is a defensible minimum viable control on the path teams use today (Cursor), while broader approvals complete.

---

## Cost and resources

| Item | Estimate |
|------|----------|
| Engineering (Phase 0 + 1) | ~2–3 weeks one engineer (internal) |
| Software licence | **£0** — Presidio and stack are open source |
| Infrastructure | **£0** — runs locally on dev machines and CI |
| Ongoing | Policy owner (~2 hrs/month client blocklist maintenance) |
| Third-party sub-processors | **None added** by the gateway itself |

Existing pilot costs (Cursor team subscription) unchanged.

---

## Benefits

**For compliance and governance**

- Operationalises AI Policy §7.2 with testable controls
- Audit metadata supports §8.5 evidence requests
- Reduces likelihood of reportable breaches and investigation scope
- Completes SSDLC Agent Pack rule 19 — a requirement EDI already documents (when built)

**For delivery leadership**

- Unblocks confident scaling of AI-assisted dev to more client repos
- Clear story for client conversations: “automated enforcement, not just policy PDFs”
- Does not require pausing Cursor or other authorised dev AI tooling

**For engineering**

- Fail-fast feedback (“blocked: client URL detected”) vs silent policy violation
- Per-client rules without memorising every client name
- Golden tests prevent policy regressions

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| False positives block legitimate work | Allowlists; governance sign-off for per-repo exceptions |
| Developers bypass proxy | Onboarding mandatory; incident runbook treats bypass as policy breach |
| Not on Authorised AI list | Confirm Cursor (and any PR review bot, when adopted) with AI Innovation & Enablement before rollout |
| Integration needs Ops approval (§7.3) | Include Operations in approval chain |
| Gateway misses novel PII | Layered detectors + ongoing client blocklists + golden tests |
| Premature EDI commits | Keep spec in dark-factory until item 7 approved; coordinate with DSO on enablement repo updates |
| Divergence from EDI standards | Single policy engine; gateway implements SSDLC rule 19; enablement checklist updated in Phase 2 |

---

## Approvals checklist (before Phase 0 go-live)

- [ ] Management approval of PII Gateway as standard control
- [ ] AI Innovation & Enablement: Cursor confirmed on Authorised AI Applications list
- [ ] Operations: written approval for gateway integration (§7.3)
- [ ] Legal (if required): confirm “no Personal Data to model” basis for client dev work
- [ ] Named policy owner for per-client YAML and audit review
- [ ] Incident runbook and kill switch documented
- [ ] Pilot repo list agreed
- [ ] **Implementation repo authorized** (e.g. EDI) before any code lands outside dark-factory

---

## Recommendation

**Approve Phase 0 in principle** and **approve the PII Gateway** as the standard data protection measure for engineering AI tooling on client codebases.

This initiative should be read as **completing EDI-defined AI governance for dev tools**, not as a separate EDX experiment. Keep planning materials in **dark-factory** until governance sign-off. **Do not** start EDI repository work until item 7 above is explicitly approved — then implement as a DSO platform capability (`edi/dso-pii-gateway`) with enablement updates in existing EDI repos.

---

## Appendix A — Policy cross-reference

| Policy section | Text (summary) | Gateway response |
|----------------|----------------|------------------|
| §1.4(b) | Protect confidential and proprietary information | Block/mask confidential data in outbound AI traffic |
| §4.2 | Reasonable security for Personal Data | Preventive technical control |
| §5.1(b) | Confidentiality — sensitive/proprietary info not in *unauthorised* AI | Block/mask confidential data in outbound traffic to authorised tools too |
| §6.1 | Authorised AI Applications list (AI Hub) | Cursor must be on list; gateway is not an AI application |
| §6.2(e) | Developing and testing code — authorised use case | Enable safe exercise of this use case |
| §7.2 | No Personal Data upload/disclosure unless approved + measures + lawful basis | Defines the “appropriate measures” |
| §7.3 | No AI tool integration with internal Elixirr systems/networks without Ops approval | Ops sign-off for CI hooks and any enterprise integration |
| §7.5 | Users verify AI outputs; accountable for quality | Unchanged — gateway does not remove this |
| §8.4 | Monitoring may include reviewing prompts or outputs | Metadata audit complements; monitoring rights preserved |
| §8.5 | Users maintain records; evidence responsible use | Gateway audit assists; user record-keeping still required |
| §9.1 | Report breaches to line manager or Operations | Incident runbook |
| §9.2 | Non-compliance may result in disciplinary action | Bypass or deliberate circumvention is a policy breach |
| §9.3 | Investigation may require access to AI apps, accounts, and materials | Gateway audit complements; does not block investigation access |

*Source: [Elixirr Group Artificial Intelligence (AI) Policy, 30 March 2026](https://elixirrpartners.sharepoint.com/:b:/s/Internal/IQDtHoCFVP9IT4gO6KjoEFjjAfy__oCz0uLd9VrrkrIlFI8?e=ZMHpJS) (last reviewed 1 April 2026).*

---

## Appendix B — Technical reference (dark-factory)

| Resource | Report page |
|----------|-------------|
| Architecture & implementation spec | [01. Architecture spec](/reports/pii-gateway/01-architecture-spec) |
| Policy, SSDLC & EDI alignment | [02. Policy & EDI alignment](/reports/pii-gateway/02-policy-and-edi-alignment) |
| Developer day-to-day impact | [03. Developer impact](/reports/pii-gateway/03-developer-impact) |
| Assumptions & positioning | [Assumptions & positioning](/reports/pii-gateway/assumptions-and-positioning) |
| Pipeline governance | [8. Governance](/reports/ai-augmented-dev-pipeline/08-governance-and-controls) |
| IdeaTub research | `research:headroom-pii-gateway-2026-06` — AI Tooling Research |

---

## Sign-off

| Role | Name | Decision | Date |
|------|------|----------|------|
| Engineering lead | | ☐ Approve ☐ Decline ☐ Defer | |
| DSO / AI Enablement (platform owner) | | ☐ Approve ☐ Decline ☐ Defer | |
| Operations | | ☐ Approve ☐ Decline ☐ Defer | |
| Legal (if consulted) | | ☐ Approve ☐ Decline ☐ N/A | |
| Delivery / practice lead (EDX + EDI) | | ☐ Approve ☐ Decline ☐ Defer | |

**Comments:**

---

*End of document*
