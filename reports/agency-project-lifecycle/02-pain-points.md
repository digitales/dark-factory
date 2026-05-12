---
title: Pain Points and Waste Map
description: Where time, quality, and margin are lost in a standard agency project flow — phase by phase.
---

# 2. Pain Points and Waste Map

Before looking at solutions, it is worth mapping where agencies typically lose time, quality, or margin. These are the structural problems that exist regardless of team skill — they are process failures, not people failures.

## Summary Heat Map

| Phase | Time Waste | Quality Risk | Margin Erosion | Notes |
|-------|:---------:|:------------:|:--------------:|-------|
| 1. Estimation | High | Medium | **Critical** | Under-scoping, hidden hours, new-client uncertainty |
| 2. Discovery | Medium | Medium | Low | Skipped or compressed; intent not captured precisely |
| 3. IA & Content Plan | Medium | High | Medium | Done too late or too loosely; content gaps surface in build |
| 4. UX/UI Design | Medium | Medium | High | Revision loops; subjective feedback without anchoring |
| 5. Technical Spec | Low–Medium | **Critical** | Medium | Often informal or skipped; leads to rework in build |
| 6. Build | Medium | High | High | Rework from upstream gaps; scope creep; integration surprises |
| 7. Content Population | **Critical** | High | **Critical** | Client dependency; manual repetitive work; launch blocker |
| 8. QA & Testing | Medium | High | Medium | Compressed; bugs found late; accessibility/performance bolted on |
| 9. Training | Low | Medium | Low | Rushed or generic; client cannot self-serve after launch |
| 10. Launch | Low | Medium | Low | Checklist gaps; missed redirects; analytics not validated |
| 11. Post-Launch | Low | Medium | Medium | No governance plan; site quality degrades over time |

---

## Phase-by-Phase Breakdown

### 1. Estimation and Scoping

**Core problems:**
- **Under-scoping hidden hours.** PM, communication, meetings, and QA typically add 25–40% to raw delivery time but are routinely under-estimated or omitted from proposals.
- **Optimism bias.** Estimates are based on best-case scenarios. Industry guidance suggests adding 20% for new clients, 15% for new project types, 10% for tight deadlines — but few agencies apply these multipliers systematically.
- **No historical data.** Most agencies estimate from gut feel rather than from time-tracking data on comparable past projects. Estimates are inconsistent across estimators.
- **Binary pricing under uncertainty.** Fixed-price proposals lock in a number before the real scope is understood. T&M avoids this but shifts risk to the client.
- **Speed pressure.** Proposals are often produced in hours, not days. There is no time for proper technical review.

**Downstream effect:** Margin erosion is the single largest commercial risk. An under-scoped project loses money from day one.

### 2. Briefing and Discovery

**Core problems:**
- **Discovery treated as overhead.** Clients (and some agencies) see discovery as time before "real work" starts and compress it.
- **Intent not captured precisely.** Goals and success criteria are described in vague, qualitative terms ("make it modern", "improve engagement") rather than measurable outcomes.
- **Stakeholder misalignment surfaces late.** Approval authority and decision-making are not mapped until conflict arises during design review.
- **Technical constraints not surfaced.** Hosting, integrations, third-party dependencies, and data constraints are not investigated until the build phase.

**Downstream effect:** Vague discovery produces vague specs, which produces subjective feedback loops in design and rework in build.

### 3. IA and Content Planning

**Core problems:**
- **Content planning happens too late.** Many agencies design layouts before content direction exists, then retrofit content into fixed containers.
- **Content responsibility is unclear.** "Client provides content" is a common assumption, but the client often does not have content ready, does not know what format is needed, or does not understand the volume required.
- **Page intent is not defined.** Pages are listed in a sitemap but their purpose, primary message, and expected user action are not specified.
- **SEO is bolted on.** Keyword mapping, URL structure, and redirect planning happen after IA is finalised, leading to retrofits.

**Downstream effect:** Content gaps are the number one cause of launch delays. Late or missing content forces design compromises and QA rework.

### 4. UX/UI Design

**Core problems:**
- **Subjective feedback loops.** Without anchored goals and content direction, design review becomes opinion-based. Revisions multiply.
- **States and edge cases missed.** Error states, empty states, loading states, long-title handling, and mobile behaviour are not specified until development discovers them.
- **Design-to-dev handoff is lossy.** Spacing, responsive breakpoints, interaction behaviour, and component variants are under-specified in design files. Developers interpret or guess.
- **Accessibility as afterthought.** Contrast, focus management, and semantic structure are not checked in design QA; they surface as bugs in testing.

**Downstream effect:** Each extra revision round costs 5–10% of design budget. Lossy handoff causes rework in build.

### 5. Technical Specification

**Core problems:**
- **Often informal or skipped entirely.** Many agencies go straight from design sign-off to "start building." The technical plan exists only in the developer's head.
- **No shared format.** Where specs do exist, they vary by author and are not structured consistently — making them hard to review and easy to miss.
- **Integration complexity is underestimated.** Third-party APIs, CRM integrations, and search are scoped as single line items but consume disproportionate build time.
- **Content model not documented.** CMS architecture (content types, fields, relationships) is defined on the fly during build rather than planned.

**Downstream effect:** Lack of spec is the root cause of most build-phase rework. The [Dark Factory](/reports/dark-factory/) and [SPDD](/reports/structured-prompt-driven/) reports address this directly.

### 6. Build (Development)

**Core problems:**
- **Rework from upstream gaps.** Missing specs, changing designs, late content requirements, and undocumented integrations cause rebuilds.
- **Scope creep.** "While you're at it…" requests accumulate. Without a clear spec to reference, it is hard to distinguish in-scope from out-of-scope.
- **Component duplication.** Without a documented design system, developers build slight variations of the same component.
- **Performance and accessibility not checked during build.** Problems accumulate and are expensive to fix in QA.
- **PR review bottleneck.** On small teams, a single reviewer can become a throughput constraint (addressed in [PR Review Continuity](/reports/pr-review-continuity/)).

**Downstream effect:** Build is the largest cost centre. Upstream failures compound here.

### 7. Content Population and Migration

**Core problems:**
- **Manual, repetitive, low-value work.** Entering content into a CMS page-by-page is time-consuming and error-prone. For large sites (hundreds or thousands of pages), this is the biggest single time sink.
- **Client dependency.** The agency cannot populate content the client has not provided. Chasing content is a PM overhead.
- **Migration complexity.** Redesigns require mapping old content to new structures. Legacy content (shortcodes, custom fields, non-standard markup) causes edge cases.
- **SEO metadata as afterthought.** Titles, descriptions, alt text, and structured data are entered last or forgotten.
- **No quality gate.** Content accuracy, tone, and completeness are reviewed informally if at all.

**Downstream effect:** Content population is the most common cause of launch delays. It is also the phase with the worst ratio of time spent to value delivered.

### 8. QA and Testing

**Core problems:**
- **Compressed timeline.** QA is the first phase to be squeezed when earlier phases overrun.
- **Late bug discovery.** Issues that should have been caught in design QA or during build surface here at higher fix cost.
- **Inconsistent coverage.** Without a test plan, QA coverage depends on the tester's experience and time pressure.
- **Accessibility bolted on.** WCAG compliance is tested for the first time in QA rather than validated during design and build.
- **Performance tested too late.** Core Web Vitals failures discovered in QA require architectural changes, not quick fixes.

**Downstream effect:** Bugs found in QA cost 5–10x more to fix than bugs caught during build. Compressed QA means bugs ship.

### 9. Client Training

**Core problems:**
- **Generic, not project-specific.** Training covers CMS basics rather than the specific content model, components, and workflows built for the client.
- **No reusable documentation.** Training is live only; when the attendee forgets or leaves, knowledge is lost.
- **Component misuse.** Clients do not understand which components to use where, leading to layout breakage and design drift post-launch.
- **Compressed or skipped.** Training is scheduled in the final week and often shortened when the project is running late.

**Downstream effect:** Poor training creates a support burden and accelerates site quality degradation.

### 10. Delivery and Launch

**Core problems:**
- **Checklist gaps.** Redirects, analytics validation, caching, CDN, and security headers are sometimes missed.
- **No smoke test protocol.** Post-launch verification is ad-hoc rather than scripted.
- **Communication gaps.** Client stakeholders are not always briefed on what "live" means and what is their responsibility afterwards.

**Downstream effect:** Launch issues are visible and high-pressure. A missed redirect or broken form erodes client trust disproportionately.

### 11. Post-Launch Support and Governance

**Core problems:**
- **No governance plan.** Content publishing standards, component usage rules, and performance monitoring are not documented.
- **Site quality degrades.** Without governance, new content breaks layouts, images are uploaded unoptimised, and third-party scripts are added without performance review.
- **Reactive support.** The agency fixes things when they break rather than monitoring proactively.
- **No feedback loop.** Lessons from post-launch are not systematically captured and fed back into estimation and discovery for the next project.

**Downstream effect:** The site the agency launches is not the site the client has six months later. Governance is the missing link between delivery and long-term value.

---

## Where the Money Goes

If a typical mid-sized build is 600 hours:

| Phase | % of hours | Hours | Waste risk |
|-------|-----------|-------|------------|
| Estimation | 2% | ~12 | Margin set here; errors are permanent |
| Discovery | 5% | ~30 | Compressed = rework later |
| IA / Content plan | 5% | ~30 | Skipped = content delays |
| Design | 20% | ~120 | Revision loops |
| Technical spec | 5% | ~30 | Skipped = rework in build |
| Build | 35% | ~210 | Upstream failures compound |
| Content population | 10% | ~60 | Manual, client-dependent |
| QA | 10% | ~60 | Compressed, late bugs |
| Training | 2% | ~12 | Rushed |
| Launch | 2% | ~12 | Checklist execution |
| Post-launch | 4% | ~24 | Often unbilled |

The phases with the highest waste risk relative to their size: **estimation** (sets the margin), **content population** (blocks launch), and **technical spec** (determines build efficiency).
