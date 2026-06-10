---
title: PII Gateway for Dev AI
description: Working research — local enforcement layer blocking Personal Data before third-party LLM APIs. Assumptions and positioning in progress.
---

# PII Gateway for Dev AI

**Status:** Shelved — June 2026 (research retained, no implementation)  
**Started:** June 2026  
**Related pilot:** [AI-Augmented Development Pipelines](/reports/ai-augmented-dev-pipeline/) (Cursor-led dev AI)  
**IdeaTub:** [pii-gateway](https://ideatub.com) project under AI Tooling Research — working memory, `decision:pii-gateway-2026-06`, `research:pii-gateway-2026-06`

---

## What this project is

A **standalone research workspace** in dark-factory for designing a local PII gateway: automated block/redact of Personal Data and client confidential information **before** it reaches third-party LLM APIs (Cursor, PR review bots, etc.).

This is **not** implementation code. It is working memory while we finalise:

- How to **position** the initiative (governance control vs platform product vs pilot-only)
- **Assumptions** (scope, ownership, repo home, rollout coupling to the dev pipeline pilot)
- **Relationship** to in-flight EDI work (`nvisnx-rnd`, SSDLC agent pack, enablement repos) — implements and complements; **no EDI code without authorization**

---

## Core thesis

Elixirr AI Policy §7.2 requires appropriate data protection before Personal Data reaches AI tools. Manual redaction (PR templates, `.cursorrules`, training) is necessary but not assurable. A local gateway at the trust boundary **implements EDI Secure SDLC rule 19** (AI invocation checkpoint) and supports UK GDPR reasonable-security expectations — shared across EDX and EDI practices.

---

## Research sections

| Section | Focus |
|---------|--------|
| [Assumptions & positioning](/reports/pii-gateway/assumptions-and-positioning) | **Start here** — open questions, decisions pending, positioning options |
| [1. Architecture spec](/reports/pii-gateway/01-architecture-spec) | Technical design, Presidio stack, rollout phases |
| [2. Policy & EDI alignment](/reports/pii-gateway/02-policy-and-edi-alignment) | AI Policy, SSDLC, EDI portfolio overlap |
| [3. Developer impact](/reports/pii-gateway/03-developer-impact) | Day-to-day dev work when deployed |
| [4. Management brief](/reports/pii-gateway/04-management-brief) | Approval pack for Elixirr Group management |
| [Lovable microsite prompt](/reports/pii-gateway/lovable-microsite-prompt) | Prompt pack for management approval microsite |
| [5. Headroom & compression](/reports/pii-gateway/05-headroom-and-compression) | Context compression research — complementary, not PII |

---

## Relationship to other reports

| Report | Link |
|--------|------|
| AI-Augmented Dev Pipeline | [Governance §8](/reports/ai-augmented-dev-pipeline/08-governance-and-controls) references this project for automated redaction |
| EDI repos analysis | [`nvisnx-rnd`](/reports/edi-repos-analysis/) — Presidio R&D lineage |
| PR Review Continuity | [AI without blind trust](/reports/pr-review-continuity/05-ai-assisted-review-without-blind-trust) — complementary guardrails |

---

## Explicit non-goals (for now)

- No EDI repository commits without governance sign-off
- No coupling to Headroom/token compression until redaction path is settled
- No production rollout until management brief approved

---

## One-line positioning (draft)

**Automated enforcement of “no Personal Data to the model” for engineering AI tools — assurable, local, auditable.**

*Subject to change — see [assumptions & positioning](/reports/pii-gateway/assumptions-and-positioning).*
