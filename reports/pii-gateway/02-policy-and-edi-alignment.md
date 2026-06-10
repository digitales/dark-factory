---
title: PII Gateway — Policy & EDI Alignment
description: Elixirr AI Policy, SSDLC agent pack, and EDI portfolio overlap. Working memory in dark-factory.
---

# PII Gateway — Policy & EDI Alignment

> **Working memory:** this report lives in [`reports/pii-gateway/`](/reports/pii-gateway/). No EDI repository changes without separate authorization. If approved later, a proposed implementation home is `edi/dso-pii-gateway` — see [architecture spec](/reports/pii-gateway/01-architecture-spec).

---

## Elixirr AI Policy (30 March 2026)

[View policy (SharePoint)](https://elixirrpartners.sharepoint.com/:b:/s/Internal/IQDtHoCFVP9IT4gO6KjoEFjjAfy__oCz0uLd9VrrkrIlFI8?e=ZMHpJS)

| Section | Requirement | Gateway response |
|---------|-------------|------------------|
| §7.2 | No upload/disclosure of Personal Data unless tool approved + **appropriate data protection measures** + lawful basis | Block/mask at trust boundary |
| §5.1(b) | Sensitive/proprietary info not in *unauthorised* AI systems | Per-client blocklists; block secrets (authorised-tool egress covered by §7.2) |
| §4.2 | Reasonable security (UK GDPR) | Preventive control + audit metadata |
| §6.1 | Authorised AI Applications (AI Hub) | Cursor on list; gateway is control infrastructure, not an AI app |
| §6.2(e) | Code development — authorised use case | Enables safe use; does not permit raw Personal Data to model |
| §7.3 | AI tool integration with internal Elixirr systems/networks requires Ops approval | Ops sign-off for CI hooks and enterprise integration |
| §7.5 | Users verify outputs; remain accountable | Unchanged obligation |
| §8.4 | Monitoring may include prompts/outputs | Metadata audit complements monitoring |
| §8.5 | Users maintain records; evidence responsible use | Gateway audit assists user record-keeping |
| §9.1 | Report breaches to line manager or Operations | Incident runbook |
| §9.3 | Investigation access to AI apps, accounts, materials | Complements gateway audit |

Full policy analysis: [management brief](/reports/pii-gateway/04-management-brief).

---

## Secure SDLC Agent Pack (EDI)

The gateway **implements** controls already defined as architecture requirements in `elixirr-secure-sdlc-agent-pack`:

**Rule 19 — Architecture / threat modelling**

> AI invocation layer as mandatory governance checkpoint handling **PII redaction, policy enforcement, and output validation**.

**Rule 13 — AI / prompt / agent controls**

> PII, secrets, and regulated identifiers **redacted, tokenized, or protected** before model contact.

**`shared/06-data-classification-protection.md`** — DLP on transfer paths.

**`shared/07-ai-governance-guardrails.md`** — PII redaction, input minimisation, exfiltration controls.

---

## EDI portfolio — overlap (no duplication)

| EDI repo | Relationship | Action in dark-factory |
|----------|--------------|------------------------|
| **`elixirr-secure-sdlc-agent-pack`** | Requirements source | Cite in management brief and ADRs |
| **`nvisnx-rnd`** | Presidio R&D (batch documents) | Reuse recognizer learnings when building gateway |
| **`dso-cursor-ai-enablement`** | Cursor onboarding pattern | Gateway install goes in enablement checklist (when built) |
| **`apps-cursor-ai-enablement`** | MCP security (complementary) | Egress (gateway) vs ingress (MCP) — different boundary |
| **`qa-cursor-ai-enablement`** | Same enablement pattern | Same gateway requirement for client repos |

**Not duplicated:**

- MCP server security — tool/credential boundary
- Batch PII scanning at scale — `nvisnx-rnd`
- Cursor rules / hooks — secret-in-repo checks in enablement boilerplates
- Token compression (Headroom) — after redaction only, if adopted

**No existing EDI code** implements a dev-AI PII gateway today.

---

## Future implementation (requires authorization)

| Status | Location |
|--------|----------|
| **Now** | Spec, policy alignment, management brief — **this repo (dark-factory)** |
| **After approval** | Code may land in `edi/dso-pii-gateway` or another authorised repo |

Do not scaffold or commit implementation in EDI until management and Operations sign off.

---

## ADR prompt (for Phase 0 kickoff)

**Decision:** Adopt a PII gateway as the standard AI invocation checkpoint for engineering teams using authorised LLM tools on client repositories.

**Context:** AI Policy §7.2; SSDLC rule 19; client WP/Laravel repos contain Personal Data in diffs and tool output.

**Options considered:**

1. Manual redaction only — insufficient assurance
2. Hosted DLP SaaS — additional sub-processor
3. **Local Presidio gateway** — self-hosted, auditable; aligns with `nvisnx-rnd` expertise

**Consequences:** Ops approval for integration (§7.3); onboarding change for Cursor users; policy owner for client YAML; **choose implementation repo after authorization**.

---

**Related:** [Project index](/reports/pii-gateway/) · [Architecture spec](/reports/pii-gateway/01-architecture-spec) · [Developer impact](/reports/pii-gateway/03-developer-impact) · [Management brief](/reports/pii-gateway/04-management-brief)
