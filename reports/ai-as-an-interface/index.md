---
title: AI as an Interface Layer
description: Hows My Commute AI Integration Case Study
pageClass: hmc-slide-deck
---

<section class="slide">

# AI as an Interface Layer: A Hows My Commute Case Study

- Production integration case study, not a chatbot demo
- Laravel backend with OpenAPI and OAuth2 (Passport) as the integration boundary
- Reuse of existing domain logic and APIs; AI sits in front of them
- Mixed audience: product, engineering, and leadership
- Focus on reusable patterns for bringing AI safely into product systems

<details class="notes">
  <summary>Speaker Notes</summary>
  Frame this as an architecture and integration story. The value is in reusing what we already have—APIs, auth, domain logic—and letting AI act as an interface layer. Avoid positioning it as "AI magic"; emphasise contracts, security, and operational reality.
</details>

</section>

---

<section class="slide">

# Product Context: What Is Hows My Commute?

- Web-first product designed as a calm reassurance layer over daily travel
- Advisory and decision-support, not an analytics-heavy or control-room experience
- Existing API already powers the current UI (routes, times, status)
- The AI layer reuses those same endpoints and services
- Surface extension, not rewrite: we add a conversational entry point without replacing backend logic

<details class="notes">
  <summary>Speaker Notes</summary>
  Explain that Hows My Commute is already a working product with a clear API. The AI integration is an additional way to access the same capabilities. This reduces risk and cost compared to building AI-specific backends.
</details>

</section>

---

<section class="slide">

# The Interface Shift

- Shift from UI-driven flows to intent-driven interaction
- Users ask outcome-first questions instead of navigating screens
- Natural language becomes an entry point alongside buttons and forms
- AI acts as an orchestration layer between the user and existing systems
- AI changes the entry point, not the system logic; domain rules stay in the API

<details class="notes">
  <summary>Speaker Notes</summary>
  The behavioural shift is from "click through these steps" to "ask what you need." The system still does the same work; the way the user reaches it changes. This is why contract-based integration matters—we are not reimplementing logic in the model.
</details>

</section>

---

<section class="slide">

# Why Naive AI Integrations Fail

- Secrets or credentials embedded in prompts or tool definitions
- Unrestricted endpoints with no auth or scoping
- No schemas: the model invents parameters and payloads
- Hallucinated parameters lead to wrong or dangerous calls
- No clear auth boundary between the user and backend
- No audit trail or observability when things go wrong
- Risks: data leakage, over-permission, untraceable failures, and compliance exposure

<details class="notes">
  <summary>Speaker Notes</summary>
  Many early AI integrations treat the backend as an open system. Production requires the opposite: strict contracts, user-scoped auth, and full observability. This slide sets up why we chose OpenAPI and OAuth2.
</details>

</section>

---

<section class="slide">

# Architecture Overview

```
User
  ↓
AI Assistant Runtime
  ↓
Tool Selection Layer
  ↓
OpenAPI Contract
  ↓
OAuth (Laravel Passport)
  ↓
HMC API
  ↓
Domain Logic
  ↓
Structured JSON
  ↓
Assistant Response
```

- AI selects the tool and formats the response for the user
- API authenticates and authorises; domain layer computes commute outcomes
- AI does not compute commute times or hold business logic

<details class="notes">
  <summary>Speaker Notes</summary>
  Emphasise separation of responsibilities: the model chooses when to call which tool and how to explain the result. The API and domain layer own auth, authorisation, and all business rules. This keeps the system predictable and auditable.
</details>

</section>

---

<section class="slide">

# OpenAPI as the Integration Contract

- Typed parameters with required vs optional clearly defined
- Enum constraints and validation rules in the schema
- Predictable response schemas so the assistant can interpret results reliably
- Version control of the contract as a product artefact
- Governance boundary between AI and backend systems
- Platform-agnostic reuse: same contract can drive GPT, Claude, or other runtimes

<details class="notes">
  <summary>Speaker Notes</summary>
  OpenAPI is not just documentation; it is the contract that prevents the model from inventing parameters or calling endpoints incorrectly. Treat it like an API product—maintained, versioned, and reviewed.
</details>

</section>

---

<section class="slide">

# OAuth2 & Identity Model

- Auth code flow: user authorises once; tokens are exchanged server-side
- User-scoped tokens so every call is tied to an identity
- Scopes and permissions limit what the assistant can do on the user’s behalf
- Expiry and refresh keep tokens short-lived and revocable
- Revocation and auditability support compliance and incident response
- AI acts on behalf of a user, not as an admin; no credentials in prompts

<details class="notes">
  <summary>Speaker Notes</summary>
  The key message: the user’s identity and consent flow through OAuth. The assistant never sees passwords or long-lived secrets. When a token is revoked, the AI can no longer act for that user. This is the same security posture as the rest of the product.
</details>

</section>

---

<section class="slide">

# Tool Invocation Mechanics: End-to-End

- Flow: user query → tool decision → structured arguments from schema → API call with OAuth token → JSON response → formatted answer to user
- Guardrails: schema validation before the call, explicit errors back to the assistant, no silent or hallucinated fallbacks
- Determinism: domain data drives the answer first; language generation explains it second
- Each tool call is a discrete, logged, and traceable step

<details class="notes">
  <summary>Speaker Notes</summary>
  Walk through one concrete example: "How long to get to work?" The assistant picks the commute tool, fills in parameters from the schema, calls the API with the user’s token, and then turns the JSON into a calm, readable response. No guessing; the source of truth is the API.
</details>

</section>

---

<section class="slide">

# Operational Considerations

- Rate limiting on both the AI runtime and the API to avoid overload
- Timeouts and retries with clear policies so users are not left hanging
- Cost control: monitor LLM usage and API call volume
- Structured errors so the assistant can surface helpful, calm messages instead of raw stack traces
- Logging of tool calls, parameters, and outcomes for debugging and audit
- Monitoring auth failures, latency, and error rates
- Supportability and incident response: know which calls failed and why

<details class="notes">
  <summary>Speaker Notes</summary>
  Production AI integrations are operations-heavy. Teams need to treat tool calls like any other backend dependency: instrumented, limited, and recoverable. Calm UX depends on calm failure modes and clear observability.
</details>

</section>

---

<section class="slide">

# Latency & UX Coupling

- Latency comes from: LLM reasoning, tool selection, OAuth token use, and the API call itself
- Conversational pacing: users expect a reply within a few seconds; long waits feel broken
- Calm failure modes: reassuring messaging when the system is slow or unavailable
- Backend reliability is user experience; if the API is slow or down, the assistant cannot hide it
- Design for partial success and clear feedback rather than pretending latency does not exist

<details class="notes">
  <summary>Speaker Notes</summary>
  The product’s calm, reassuring tone must extend to errors and delays. "Checking your commute…" and "Something’s taking longer than usual" are better than silence or technical errors. Align product and engineering on these messages.
</details>

</section>

---

<section class="slide">

# Lessons Learned

- Auth complexity outweighs prompt complexity; get identity and scoping right first
- Loose schemas create unpredictable tool calls; strict OpenAPI pays off
- Keep business logic out of the model; the API owns rules and computations
- Observability is mandatory: log tool calls, outcomes, and failures
- Treat OpenAPI as a product artefact: version it, review it, and govern changes
- Reliability and calm UX go together; users need to trust that the system will respond predictably

<details class="notes">
  <summary>Speaker Notes</summary>
  These are engineering and product takeaways. The most common mistake is underinvesting in auth and schemas while overinvesting in prompt tuning. Emphasise that the pattern is reusable and that the same lessons apply to other AI–backend integrations.
</details>

</section>

---

<section class="slide">

# Strategic Implications & Reuse

- AI becomes an interface layer over existing APIs rather than a replacement for them
- Faster feature layering: new entry points (voice, chat, assistants) can reuse the same backend
- Reduced rebuild cost by extending surfaces instead of rewriting systems
- Identify candidate systems that already expose structured, well-defined APIs
- Reuse the pattern across internal products: editorial insights, analytics, support, reporting
- Which of our systems already expose structured APIs that could become AI-accessible?

<details class="notes">
  <summary>Speaker Notes</summary>
  End with a call to reflection: where else could this pattern unlock value? Encourage the room to think about existing APIs, not greenfield AI projects. The goal is to make AI a standard way to access capabilities that already exist.
</details>

</section>
