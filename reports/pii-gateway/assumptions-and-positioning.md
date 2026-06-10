---
title: Assumptions & Positioning
description: Open questions and decision log while the PII gateway initiative is shaped.
---

# Assumptions & Positioning

**Purpose:** Live working document. Update as assumptions are validated or rejected.  
**Status:** Shelved (June 2026) — research retained; implementation and management approval not pursued. Risk/complexity outweighs near-term value.

---

## Positioning options (pick one or hybrid)

| Option | Position as… | Pros | Cons |
|--------|--------------|------|------|
| **A. Governance control** | Mandatory compliance layer for dev AI on client repos | Clear AI Policy §7.2 story; SSDLC rule 19 fit | Harder to “sell” on productivity |
| **B. Pilot enabler** | Prerequisite for Cursor-led dev AI at scale | Tied to existing [dev pipeline](/reports/ai-augmented-dev-pipeline/) plan | May look scoped only to one team |
| **C. Platform capability** | DSO / AI Enablement shared service for all Elixirr dev AI | Reusable across clients and tools | Needs owner, SLA, and Ops approval (§7.3) |
| **D. Research only** | Document requirements; defer build | Zero delivery risk | No enforcement until built |

**Current lean:** **D (Research only)** — shelved after policy cross-check and risk assessment.

---

## Assumptions (validated / open)

### Validated (working assumptions)

| # | Assumption | Evidence |
|---|------------|----------|
| 1 | Manual redaction alone is insufficient for §7.2 assurance | AI Policy; no wire-level control today |
| 2 | Gateway is **egress** control (what the model sees), not MCP ingress | [EDI MCP security](/reports/edi-repos-analysis/03-ai-enablement-boilerplates) is complementary |
| 3 | Presidio is the right stack direction | `nvisnx-rnd` R&D; OSS; local-first |
| 4 | Headroom compresses tokens; it does **not** anonymise | [Headroom research](/reports/pii-gateway/05-headroom-and-compression) |
| 5 | dark-factory holds spec until positioning is final | This project directory |
| 6 | EDI code changes require **separate authorization** | User decision; not started |

### Open (needs decision)

| # | Question | Options | Owner | Target date |
|---|----------|---------|-------|-------------|
| O1 | **Coupling to dev pipeline pilot** | Required for pilot vs optional add-on vs post-pilot | Delivery lead | TBD |
| O2 | **Implementation repo** | `edi/dso-pii-gateway` vs dark-factory `tools/` vs other | Engineering + Ops | After management brief |
| O3 | **Phase 0 scope** | Cursor proxy day one (recommended) vs PR diff CLI only | Engineering | TBD |
| O4 | **Policy owner** | Named role for per-client YAML blocklists | Governance | Before Phase 2 |
| O5 | **Authorised AI Applications** | Cursor confirmed on list | AI Innovation & Enablement | Before go-live |
| O6 | **Operations approval** | §7.3 integration sign-off | Operations | Before go-live |
| O7 | **Client communication** | Mention in client AI transparency vs internal only | Legal / delivery | TBD |
| O8 | **Token compression** | Headroom after gateway vs not in scope | Cost / engineering | Post Phase 1 |
| O9 | **Management approval** | In principle vs Phase 0 funded vs defer | Leadership | **Shelved — deferred** |

---

## Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-10 | All research lives in **`reports/pii-gateway/`** | Isolate from dev pipeline report while positioning matures |
| 2026-06-10 | No EDI repo work without authorization | Avoid premature platform commitment |
| 2026-06-10 | Phase 0 = Cursor proxy first; PR diff CLI in Phase 1 | Cursor is in use; no PR review bot deployed today |
| 2026-06-10 | **Project shelved** | Assessed too high risk for near-term delivery (policy alignment complexity, governance overhead, implementation scope vs manual controls) |
| 2026-06-10 | Lovable management microsite **deleted** | Shelved before management circulation; prompt retained in `lovable-microsite-prompt.md` |

---

## Success criteria (when positioning is “final”)

- [ ] Management brief approved (or explicitly deferred with reason)
- [ ] Positioning option chosen (A/B/C hybrid documented)
- [ ] O1–O9 resolved or explicitly accepted as risks
- [ ] Implementation repo authorized (if building)
- [ ] Link from [dev pipeline governance](/reports/ai-augmented-dev-pipeline/08-governance-and-controls) updated to reflect final stance

---

## Anti-patterns to avoid

- Building in EDI before O2 and O6 are closed
- Treating Headroom as a PII substitute
- Folding gateway into dev pipeline report body (keep cross-links only)
- Announcing to clients before O7 is decided

---

**Related:** [Project index](/reports/pii-gateway/) · [Management brief](/reports/pii-gateway/04-management-brief)
