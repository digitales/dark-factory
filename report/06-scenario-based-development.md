---
title: Scenario-Based Development
description: What scenarios are, why they matter beyond tests, satisfaction, and practical takeaways.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-scenario-caption">
  <img src="/report/report-06-scenario-based-development.png" alt="Holdout scenarios and satisfaction as validation" loading="lazy" class="report-section-image">
  <figcaption id="fig-scenario-caption">Holdout scenarios and satisfaction as validation</figcaption>
</figure>

## 6. Scenario-Based Development

### 6.1 What It Is

**Scenario-based development** here means:

- Defining **scenarios** as end-to-end "user stories" or usage stories: who does what, with what motivation, and what outcome.
- Using scenarios as the main **validation** of correctness, not just unit tests written alongside the code.
- Optionally storing scenarios **outside the codebase** (e.g. in a separate repo or spec tree) so that coding agents cannot see and "game" them—analogous to a **holdout set** in ML.

StrongDM explicitly repurposes the word **scenario** in this way, inspired by **scenario testing** (Cem Kaner): a test based on a hypothetical story of how the program is used, including motivations and context.

### 6.2 Why Scenarios (Not Just Tests)

- **Tests in-repo can be gamed:** The agent can change tests or implementation so that tests pass without satisfying real intent (e.g. `assert true`).
- **Scenarios as holdout:** If scenarios are maintained separately and run against the built system, they act as an independent check: "Does this build satisfy these stories?"
- **LLM-as-judge:** For agentic or UX-heavy behaviour, pass/fail may be "did this trajectory satisfy the user?"; an LLM can evaluate that (satisfaction) when strict assertions are hard to write.

### 6.3 Satisfaction (Probabilistic Success)

StrongDM introduces **satisfaction**: of all observed trajectories through all scenarios, what fraction likely satisfies the user? This is a move from boolean "tests pass" to a more empirical, probabilistic view of quality, which fits systems with LLM or agentic components.

### 6.4 Practical Takeaway for the Team

- Write **scenarios** in plain language (markdown): actor, goal, steps, expected outcome.
- Keep a **holdout** set of scenarios that agents do not see during implementation.
- Use scenarios in CI or manual runs to approve releases ("all holdout scenarios pass" or "satisfaction above threshold").
- For WordPress/Laravel: scenarios can map to user journeys (login, create content, trigger webhook, etc.) and API contracts.
