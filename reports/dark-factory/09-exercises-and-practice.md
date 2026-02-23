---
title: Exercises and Practice
description: Hands-on exercises to practise spec-driven development — spec, plan, tasks, and scenarios for PHP, WordPress and Laravel.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-exercises-caption">
  <img src="/report/report-09-exercises-and-practice.png" alt="Hands-on exercises to practise spec, plan, tasks and scenarios" loading="lazy" class="report-section-image">
  <figcaption id="fig-exercises-caption">Hands-on exercises to practise spec, plan, tasks and scenarios</figcaption>
</figure>

## 9. Exercises and Practice

This section gives the development team **concrete exercises** to practise the spec-driven workflow without touching production. Each exercise focuses on one part of the pipeline (Specify → Plan → Tasks → Implement) and uses examples that fit PHP, WordPress and Laravel work.

**How to use these:** Do them in order the first time; later, pick the phase you want to strengthen. Pair or mob sessions work well for spec and scenario exercises. Time estimates are rough.

---

### Exercise 1: Vague request → product spec (≈20–30 min)

**Goal:** Turn a short, vague ask into a structured **spec.md** (what and why, no how).

**Starter prompt (pick one):**

- *"We need better search on the site — users can’t find what they want."*
- *"Let’s add a way for editors to publish scheduled posts from the list view."*
- *"The awards API should support filtering by year and category."*

**Tasks:**

1. Write an **Overview** (one paragraph: what we’re building and why).
2. Identify **Users / Personas** (who is affected).
3. Write 2–3 **User Stories** in "As a … I want … So that …" form.
4. Write 3–5 **Acceptance Criteria** (testable conditions).
5. Add one **Out of Scope** and one **Uncertainties** (`[NEEDS CLARIFICATION: …]`).

**Check:** Could a colleague implement the *intent* without you specifying tech or APIs? If not, move "how" into a separate note for the plan phase.

**Why it helps:** Spec-before-code only works if the spec captures intent clearly. This exercise builds the habit of separating "what/why" from "how."

---

### Exercise 2: Spec → technical plan (≈25–35 min)

**Goal:** Turn your Exercise 1 spec (or the sample below) into a **plan.md** that an agent or developer could implement from.

**Sample spec (if you skipped Exercise 1):**  
*"Editors need to publish a scheduled post from the WordPress Posts list without opening the post. Success = one click from the list to publish; the post appears on the site and the list updates."*

**Tasks:**

1. Add **Principles / Constitution** — one sentence referencing your stack (e.g. WordPress 6.x, PHP 8.x, no custom JS frameworks unless justified).
2. Write **Architecture** — 2–3 sentences: which parts of the system are involved (e.g. WP admin, post meta, cron/scheduling).
3. Write **Stack** — list: PHP, WordPress, any front-end or APIs.
4. Sketch **Data / behaviour** — what’s already there (e.g. `post_status`, scheduled date); what might change (e.g. new action or endpoint).
5. Add **Test strategy** — how you’d validate (e.g. one E2E scenario: "Editor publishes scheduled post from list → post is live").

**Check:** Could someone (or an agent) implement this without asking you "which hook?" or "which endpoint?" If key decisions are missing, add them or mark `[NEEDS CLARIFICATION]`.

**Why it helps:** The plan is the bridge between business spec and code. Practising it reduces back-and-forth and keeps constitution and constraints explicit.

---

### Exercise 3: Plan → task list (≈15–25 min)

**Goal:** Break a small **plan.md** into a **tasks.md** of ordered, testable tasks (optionally mark parallelisable ones).

**Use:** The plan you wrote in Exercise 2, or this minimal plan:  
*"Add a ‘Publish now’ action to the Posts list for scheduled posts. Use WordPress REST API or admin AJAX; update list via existing patterns. One E2E scenario: list → Publish now → post live."*

**Tasks:**

1. List 5–8 **implementation tasks** in order (e.g. "Add REST route for publish-now", "Add UI control to list row", "Add capability check", "Run E2E scenario").
2. Make each task **testable** (you can say "done" when X is true).
3. Mark any that can be done in parallel with `[P]` if your workflow uses that.
4. Ensure the last task is **validation** (e.g. "Run scenario: Editor publishes scheduled post from list").

**Check:** Could an agent (or a new joiner) pick up tasks.md and implement without re-reading the full plan for every step?

**Why it helps:** Tasks are the unit of work for implementation and review. Clear, ordered tasks reduce drift and make "done" unambiguous.

---

### Exercise 4: Writing holdout scenarios (≈20–30 min)

**Goal:** Write 2–3 **scenarios** for a feature that could live in a holdout set (not visible to the agent during implementation).

**Context:** Scenarios are end-to-end user stories used for validation: actor, goal, steps, expected outcome. See [Section 6](/reports/dark-factory/06-scenario-based-development) and the scenario format in [Section 8.4](/reports/dark-factory/08-spec-structure-examples#_8-4-scenario-documentation).

**Pick one feature:**

- **WordPress:** "Editor publishes a scheduled post from the list view."
- **Laravel:** "User filters the awards list by year and category and sees correct results."
- **API:** "Client calls GET /awards?year=2024&category=Design and receives only 2024 Design awards."

**Tasks:**

1. For each scenario, write **Actor**, **Goal**, **Steps** (concrete, repeatable), **Expected outcome**.
2. Make steps **observable** (no "system should optimise" — use "user sees X" or "response contains Y").
3. Optionally add one scenario that describes **failure or edge case** (e.g. invalid year → 400 or empty list).

**Check:** Could you run these against a built system (manual or automated) and say pass/fail? If not, tighten the steps or expected outcome.

**Why it helps:** Holdout scenarios are your safety net for agent-generated code. Practising them makes validation design a first-class skill.

---

### Exercise 5: Reviewing a spec delta (≈15–20 min)

**Goal:** Practise **reviewing intent** instead of code — as in a Dark Factory, where approval is "did we get what we wanted?"

**Starter:** Below is a minimal "spec delta" (a change to a spec). Your job is to review it: is the change clear? Implementable? Any ambiguities or missing acceptance criteria?

**Spec delta (before → after):**

```markdown
### Requirement: Session expiration
- The system SHALL expire sessions after a configured duration.
+ The system SHALL support configurable session expiration periods.

#### Scenario: Default session timeout
- GIVEN a user has authenticated
- - WHEN 24 hours pass without activity
+ - WHEN 24 hours pass without "Remember me"
- THEN invalidate the session token
+ #### Scenario: Extended session with remember me
+ - GIVEN user checks "Remember me" at login
+ - WHEN 30 days have passed
+ - THEN invalidate the session token
+ - AND clear the persistent cookie
```

**Tasks:**

1. List what **changed** in one sentence (business intent).
2. Note any **ambiguity** (e.g. "configurable" — by whom? where?).
3. Suggest one **acceptance criterion or scenario** you’d add so an implementer (or agent) has no doubt.
4. Decide: **approve as-is**, or **request clarification** (and say what).

**Why it helps:** In a spec-driven workflow, review often focuses on spec deltas and scenario pass/fail. This exercise builds the habit of reviewing intent and completeness rather than only code.

---

### Exercise 6: Full mini-cycle (optional, ≈60–90 min)

**Goal:** Run the full pipeline once on a small feature: **Spec → Plan → Tasks → Scenarios**, then (if you have time) implement or hand to an agent.

**Suggested feature:** "Scheduled post publish from list" (WordPress) or "Awards API filter by year and category" (Laravel).

**Steps:**

1. **Spec** (15 min) — Overview, users, 2 user stories, 3+ acceptance criteria, out of scope, uncertainties.
2. **Plan** (20 min) — Stack, architecture, data/API, test strategy; reference constitution.
3. **Tasks** (15 min) — 6–10 ordered, testable tasks.
4. **Scenarios** (15 min) — 2–3 holdout-style scenarios.
5. **Review** (10 min) — Would an agent or new developer have enough to implement? Refine one thing.
6. **Implement** (optional) — Use Cursor/Claude/Copilot with your spec, plan and tasks as context; or implement yourself and validate with scenarios.

**Why it helps:** One full cycle makes the checkpoint rhythm (spec → plan → tasks → implement) concrete and shows where your team’s gaps are (e.g. specs too vague, tasks too big, scenarios too loose).

---

### Using these in team practice

- **Onboarding:** New joiners do Exercises 1–4 in order; then shadow or pair on Exercise 6.
- **Retros:** After a feature, run Exercise 5 on a real spec delta from the sprint.
- **Adoption:** In "Adopting the Shift" terms (Section 10), Juniors focus on 1, 4 and 5; Mid/Senior on 2, 3 and 6.
- **Tooling:** Use your actual tools (Spec Kit, OpenSpec, Cursor rules, or markdown in `specs/`) so the exercises mirror real workflow.

These exercises are designed so the development team can reuse them (e.g. in Confluence or a team wiki) and adapt the examples to real product features over time.
