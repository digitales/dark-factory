---
title: Headroom & Context Compression
description: Research summary — Headroom as token compression; complementary to PII gateway, not a substitute.
---

# Headroom & Context Compression

**Source:** [github.com/chopratejas/headroom](https://github.com/chopratejas/headroom) · IdeaTub `research:headroom-pii-gateway-2026-06`

---

## What Headroom is

Local-first **context compression** for AI agents: tool outputs, logs, RAG chunks, conversation history — typically **60–95% token reduction** before the LLM sees them. Reversible via **CCR** (Compress-Cache-Retrieve): originals stored locally; model can retrieve by hash.

**Four modes:** library (`compress()`), HTTP **proxy**, agent **wrap**, **MCP** tools — same pipeline underneath.

---

## What it is not

- Not PII redaction or anonymisation
- Not a substitute for Policy §7.2 controls
- Not primarily an MCP-only tool (proxy/wrap = automatic; MCP = on-demand)

---

## Relationship to PII gateway

```
Correct order:  Dev content  →  PII Gateway (redact/block)  →  [optional Headroom compress]  →  LLM
Wrong order:    Dev content  →  Headroom only  →  LLM   (compressed PII is still PII)
```

| Concern | PII gateway | Headroom |
|---------|-------------|----------|
| Personal Data to vendor | Block/mask | No |
| Token cost | No | Yes |
| Reversible full context | No (by design) | Yes (CCR) |
| User messages | Must inspect | Explicitly not compressed |

**Phase 3 (optional):** Headroom **after** gateway, if token cost justifies it.

---

## Gotchas (if adopted later)

- CCR TTL: proxy store **5 min** default — long agent jobs can 404 on retrieve (`HEADROOM_CCR_TTL_SECONDS`)
- MCP-only mode requires model to call compress/retrieve
- Default JSON crush aggressive (`max_items_after_crush=15`)
- Telemetry on by default (`HEADROOM_TELEMETRY=off`)

---

## EDI overlap

None implemented. No Headroom integration in EDI portfolio today.

---

**Related:** [Architecture spec](/reports/pii-gateway/01-architecture-spec) · [Assumptions](/reports/pii-gateway/assumptions-and-positioning) (O8: compression scope)
