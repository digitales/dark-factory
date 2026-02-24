---
title: AI as an Interface Layer
description: Hows My Commute AI Integration Case Study
pageClass: hmc-slide-deck
---

<section class="slide">

# AI as an Interface Layer: A Hows My Commute Case Study

- Moving beyond AI experimentation
- Integrating AI with production systems
- OpenAPI + OAuth as a reusable architectural pattern

<details class="notes">
  <summary>Speaker Notes</summary>
  This is not a chatbot demo. It is a production integration case study showing how AI can safely interface with existing systems.
</details>

</section>

---

<section class="slide">

# The User Shift

- Users increasingly expect natural language interaction
- "How long will it take to get to work?"
- Traditional UI flows create friction
- Conversation is becoming a primary interface layer

<details class="notes">
  <summary>Speaker Notes</summary>
  Explain behavioural shift and how product expectations are changing toward conversational access.
</details>

</section>

---

<section class="slide">

# The Core Challenge

- AI cannot access private commute data by default
- APIs require authentication
- LLMs do not inherently understand system contracts
- Security must match production standards

<details class="notes">
  <summary>Speaker Notes</summary>
  Reinforce that this is a systems engineering challenge, not a prompt-writing exercise.
</details>

</section>

---

<section class="slide">

# Architecture Overview

```
User
  ↓
AI Assistant
  ↓
OpenAPI Tool Definition
  ↓
OAuth (Laravel Passport)
  ↓
Hows My Commute API
  ↓
Structured JSON Response
  ↓
Assistant Answer
```

- Contract-driven integration
- Secure token exchange
- Deterministic tool invocation

<details class="notes">
  <summary>Speaker Notes</summary>
  Explain separation of concerns and how AI becomes an interface layer rather than replacing backend logic.
</details>

</section>

---

<section class="slide">

# Why OpenAPI Matters

- Defines callable endpoints
- Enforces strict schema validation
- Prevents hallucinated parameters
- Creates reusable integration boundary
- Platform-agnostic (GPT, Claude, others)

<details class="notes">
  <summary>Speaker Notes</summary>
  Position OpenAPI as the architectural contract between AI and product systems.
</details>

</section>

---

<section class="slide">

# Security & Trust

- OAuth2 via Laravel Passport
- User-specific token flow
- No credentials embedded in prompts
- Revocable and auditable access
- Aligns with existing security posture

<details class="notes">
  <summary>Speaker Notes</summary>
  Highlight governance and production-readiness.
</details>

</section>

---

<section class="slide">

# Lessons Learned

- Auth complexity > prompt complexity
- Schema precision is critical
- Latency impacts conversational UX
- Observability is required
- AI must not contain business logic

<details class="notes">
  <summary>Speaker Notes</summary>
  Reinforce engineering depth and maturity of approach.
</details>

</section>

---

<section class="slide">

# Strategic Implications

- AI becomes an interface layer over systems
- Existing APIs gain AI access
- Faster feature layering
- Reduced rebuild cost
- Reusable across internal products

Where else could this pattern unlock value?

<details class="notes">
  <summary>Speaker Notes</summary>
  Encourage cross-team discussion and strategic thinking.
</details>

</section>
