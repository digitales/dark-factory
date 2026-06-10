---
title: Lovable Microsite Prompt
description: Prompt pack for building a management approval microsite in Lovable for the PII Gateway proposal.
---

# Lovable Microsite Prompt — PII Gateway Proposal

**Status:** Lovable site deleted (June 2026). Prompt retained for reference only.

Use this document to build a management-facing approval microsite in [Lovable](https://lovable.dev). Paste the **initial build** prompt first; use **follow-up prompts** to refine.

**Source content:** [Management brief](/reports/pii-gateway/04-management-brief)

---

## Initial build prompt

Copy everything inside the block below into Lovable:

```
Build a single-page management approval microsite for an internal Elixirr Group proposal: "PII Gateway for AI-Assisted Development".

## Audience
Elixirr Group management, DSO / AI Enablement, Operations, and delivery practice leads (EDX + EDI). Non-technical but governance-aware. They need to understand the problem, how this aligns with existing EDI work, what we are asking them to approve, cost, and risk — in under 10 minutes.

## Tone and visual design
- Professional consulting / enterprise governance aesthetic — calm, credible, not startup-hype
- Clean typography, generous whitespace, scannable sections
- Colour palette: deep navy or charcoal primary, muted teal or slate accent, white/off-white background
- No stock photos of robots or glowing brains
- Use subtle icons for policy, shield, gateway, audit — not playful
- Mobile-responsive; desktop-first for leadership review
- Status badge at top: "Awaiting consideration — June 2026"
- Include a sticky nav with anchor links to each section

## Hero section
Headline: PII Gateway for AI-Assisted Development
Subheadline: Automated enforcement of "no Personal Data to the model" — local, assurable, auditable.
Supporting line: Completes mandatory controls already defined in the EDI Secure SDLC Agent Pack. Platform alignment with in-flight EDI work — not a new EDX-only initiative.
Primary CTA button: "Decisions required" (scrolls to decisions section)
Secondary CTA: "How it works" (scrolls to architecture)

## Section 1 — The problem (id: problem)
Title: Why this matters now

Three short paragraphs:
1. Engineering teams use Cursor for coding under an authorised AI use case, but Elixirr AI Policy prohibits sending Personal Data or confidential client information to AI systems without appropriate data protection measures.
2. Today we rely on checklists, training, and developer discipline. That is necessary but not sufficient — one mistake in a prompt or diff can send client data to a third-party LLM.
3. Business risk: UK GDPR breach exposure, client contract issues, reputational damage. A reportable incident triggers Policy §9 — mandatory reporting, investigation (Elixirr may require access to AI applications, accounts, and relevant materials), and likely suspension of affected tooling pending remediation.

Add a compact 2-column table "Policy gap → Gateway response" with rows:
- §7.2 No Personal Data without protection → Automatic block/mask at trust boundary
- §5.1(b) Confidential info in AI → Per-client blocklists; hard block on secrets
- §4.2 Reasonable security (UK GDPR) → Preventive control + audit trail
- §8.5 Users maintain records → Gateway audit assists; users remain responsible
- §8.4 Monitoring may review prompts/outputs → Metadata audit complements; does not restrict monitoring rights

## Section 2 — The proposal (id: proposal)
Title: What we are proposing

Plain-language explanation:
A local gate sits between developer tools and external AI services:
1. Before Cursor sends context to an AI provider — prompts pass through a local proxy; secrets blocked, personal data masked.
2. Before any future PR review bot sees a code change — same policy engine can sanitise diffs via CI (forward-compatible; not required today).
3. Everything is logged — we record that redaction happened and what type of data was caught, not the full prompt.

Visual: simple horizontal flow diagram (use CSS/SVG, not an image):
Developer tool → PII Gateway (local) → Authorised AI tool → LLM provider
with a branch down to "Audit log (metadata only)"

Subsection "What it is NOT" — bullet list with muted/warning styling:
- Not a replacement for Authorised AI Applications process
- Not permission to send Personal Data to models
- Not a token-cost tool
- Not optional training — it enforces policy at the wire
- Not EDI repo changes today — spec awaits governance sign-off

Cost callout card (highlight box):
- Engineering: 2–3 weeks one engineer (internal)
- Software licence: £0 (open source Presidio)
- Infrastructure: £0 (runs locally)
- Ongoing: ~2 hrs/month policy owner
- No new third-party sub-processors

## Section 3 — EDI alignment (id: edi) — MAKE THIS PROMINENT
Title: Building on EDI work already in flight
Intro: This proposal implements and complements EDI initiatives already underway. It does not replace them or fork a parallel EDX-only approach.

Table with 3 columns: EDI work | What it covers | How the gateway relates
Rows:
- Secure SDLC Agent Pack | Rule 19: AI invocation checkpoint for PII redaction | Gateway implements this for dev tools
- nvisnx-rnd | Presidio R&D on document PII | Reuses stack direction and learnings
- apps-cursor-ai-enablement | MCP ingress security | Complementary — gateway covers egress (what the model sees)
- dso-cursor-ai-enablement | DSO Cursor onboarding | Gateway added to enablement checklist when built
- qa-cursor-ai-enablement | QA Cursor enablement | Same gateway requirement for client repos

Below table, two callout boxes side by side:
Box A — "EDX + EDI aligned": One shared policy engine and CLI. GitHub/GitLab and CodeCommit/CodePipeline differ only in how CI hooks are wired — not policy, detectors, or audit format.
Box B — "What we are not duplicating": MCP security, batch document scanning, or existing Cursor rules/hooks in EDI enablement repos.

## Section 4 — Architecture (id: architecture)
Title: Two paths, one policy

Table:
| Path | Control | Strictness | Status |
| Cursor (IDE) | Local proxy on dev machine | Block secrets; mask PII | In use — Phase 0 priority |
| PR review bot (when adopted) | Diff sanitiser before bot API | Block on client identifiers | Forward-compatible; not in use today |

## Section 5 — Phased rollout (id: phases)
Title: Phased rollout

Horizontal timeline or stepped cards for 4 phases:
- Phase 0 (Days 0–14): Cursor local proxy + secret/client blocklists — ~1 week — §7.2 control on IDE path
- Phase 1 (Days 14–30): Presidio detector suite + golden tests + PR diff CLI — ~2 weeks — full detection
- Phase 2 (Days 30–60): Per-client policy files; EDI enablement checklist update — ongoing governance
- Phase 3 (60+ days): Optional token compression after redaction — cost optimisation only

Emphasise: "Phase 0 alone is a defensible minimum viable control on the path teams use today."

## Section 6 — Benefits (id: benefits)
Three columns of benefit cards:
Compliance: Operationalises §7.2; audit for §8.5; reduces reportable breach and investigation scope; completes SSDLC rule 19
Delivery: Scale AI-assisted dev confidently; clear client story; does not pause Cursor
Engineering: Fail-fast policy feedback; per-client rules; golden tests prevent regressions

## Section 7 — Risks (id: risks)
Collapsible or compact table: Risk | Mitigation
Include: false positives, developer bypass, not on authorised list, Ops approval needed, missed PII, premature EDI commits, divergence from EDI standards

## Section 8 — Decisions required (id: decisions) — KEY SECTION
Title: Decisions required
Subtitle: Please confirm approval for the following

Numbered decision cards (7 items), each with recommended action badge:
1. Adopt PII Gateway as standard control for dev AI on client code — Approve
2. Authorise Phase 0 (Cursor proxy + blocklists) within 14 days — Approve
3. Authorise Phase 1 (Presidio + golden tests) — Approve in principle
4. Assign policy owner for per-client blocklists — Assign owner
5. Confirm Cursor on Authorised AI Applications list — Confirm with AI Innovation & Enablement
6. Operations written approval per Policy §7.3 — Route to Operations
7. Authorise implementation repo (EDI) after items 1–6 — Defer until governance sign-off

## Section 9 — Approvals checklist (id: checklist)
Title: Before Phase 0 go-live
Visual checklist (unchecked items):
- Management approval
- Cursor on Authorised AI Applications list
- Operations §7.3 approval
- Legal confirmation (if required)
- Named policy owner
- Incident runbook and kill switch
- Pilot repo list agreed
- Implementation repo authorized

## Section 10 — Recommendation and sign-off (id: recommendation)
Title: Recommendation
Bold statement: Approve Phase 0 in principle and approve the PII Gateway as the standard data protection measure for engineering AI tooling on client codebases.

Closing paragraph: This completes EDI-defined AI governance for dev tools. Implementation proceeds only after governance sign-off; EDI code lands in edi/dso-pii-gateway once item 7 is approved.

Sign-off table (static, for printing/meeting use):
Roles: Engineering lead | DSO / AI Enablement | Operations | Legal | Delivery practice lead (EDX + EDI)
Columns: Name | Approve / Decline / Defer | Date

## Footer
- Prepared for: Elixirr Group management
- Date: 10 June 2026
- Related policy: Elixirr AI Policy (30 March 2026) — link: https://elixirrpartners.sharepoint.com/:b:/s/Internal/IQDtHoCFVP9IT4gO6KjoEFjjAfy__oCz0uLd9VrrkrIlFI8?e=ZMHpJS (render as a clickable footer link; opens in new tab)
- Contact: ross.tweedie@elixirr.com (render as mailto link)

## Technical notes for Lovable
- Single page with smooth scroll anchor navigation
- No authentication, no backend, no forms that submit data
- Use semantic HTML, accessible contrast
- No lorem ipsum — use the copy above verbatim where possible
- Do not mention Bionic or any specific PR review bot product
- Do not mention dark-factory, internal research repos, or IdeaTub anywhere on the site
- Do not use emojis
```

---

## Follow-up prompts

Use in sequence after the first build.

### 1. EDI section emphasis

```
Make the "Building on EDI work already in flight" section more visually prominent — move it directly below the hero, before "The problem". Add a subtle banner: "Platform alignment with in-flight EDI work".
```

### 2. Architecture diagram

```
Replace the text flow diagram with a cleaner SVG: left box "Cursor IDE", centre box "PII Gateway (local)", right box "LLM provider", with a dashed box below gateway labelled "Audit log (metadata only)". Use navy/teal colours matching the site.
```

### 3. Decision cards

```
Redesign the 7 decisions as large numbered cards in a 2-column grid on desktop. Each card: decision number, title, one-line description, and a green "Recommended: Approve" pill (or amber for "Defer" on item 7).
```

### 4. Print-friendly

```
Add a "Print summary" button that opens a one-page printable view with: executive summary, 7 decisions, cost table, and recommendation only.
```

### 5. Internal-only banner (optional)

```
Add a simple "Internal — Elixirr Group only" banner in the header. No authentication required.
```

### 6. Remove internal repo references (if already built)

```
Remove all references to dark-factory, IdeaTub, and internal research repositories from the site. The microsite should read as a standalone Elixirr Group management proposal — no links or mentions of internal tooling repos.
```

---

## Lovable tips

- Paste the **full initial prompt** first; Lovable works better with complete copy than incremental adds.
- If it hallucinates tools or costs, reply: *"Use only the content in my prompt. Do not add Bionic, CodeRabbit, or SaaS redaction vendors."*
- If the site still shows a placeholder contact, reply: *"Set footer contact to ross.tweedie@elixirr.com as a mailto link."*
- If the site mentions dark-factory or internal repo names, reply: *"Remove all references to dark-factory, IdeaTub, and internal research repositories from the site."*

---

**Related:** [Project index](/reports/pii-gateway/) · [Management brief](/reports/pii-gateway/04-management-brief)
