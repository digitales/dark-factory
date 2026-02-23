# Prompt Evaluation Rubric

**Document type:** Evaluation rubric  
**Version:** 1.0  
**Status:** Draft for adoption  
**Use:** Assess prompts before promotion to production; gate PRs; periodic audits.

---

## 1. Purpose

This rubric provides a **standardised way to score and improve prompts** used in the prompt library. Use it to:

- Review new or changed prompts before production
- Run automated or human evaluations in CI or periodic audits
- Compare prompt versions and prioritise refinements

Scores and thresholds can be set in policy (e.g. “minimum total score 50/75 for production”).

---

## 2. Scoring model

- **15 criteria**, each scored **1 (Poor) to 5 (Excellent)**.
- **Total score: out of 75.**
- For each criterion: record **strength**, **improvement**, and **rationale** (for feedback and audits).

---

## 3. The 15 criteria

### 1. Clarity & specificity

- **1:** Vague, ambiguous, or overloaded with unrelated instructions.
- **5:** Clear, specific, and focused; no unnecessary wording.

*Strength / Improvement / Rationale:*

---

### 2. Context / background provided

- **1:** No context; model must guess domain, constraints, or audience.
- **5:** Sufficient context (domain, constraints, audience) so the model can respond appropriately.

*Strength / Improvement / Rationale:*

---

### 3. Explicit task definition

- **1:** Task is implied or unclear.
- **5:** Task is explicitly stated (e.g. “Audit this code for security issues and list findings”).  

*Strength / Improvement / Rationale:*

---

### 4. Desired output format / style

- **1:** No guidance on format or style; output may be inconsistent.
- **5:** Output format and style are specified (e.g. “Structured list: severity, location, recommendation”; “Markdown with headers”).  

*Strength / Improvement / Rationale:*

---

### 5. Instruction placement & structure

- **1:** Critical instructions buried or scattered; hard to parse.
- **5:** Important instructions are placed where they are seen first; logical order (e.g. role → task → format → input).  

*Strength / Improvement / Rationale:*

---

### 6. Use of role or persona

- **1:** No role; generic “assistant” behaviour.
- **5:** Clear role/persona (e.g. “senior security-focused developer”) that steers tone and depth.  

*Strength / Improvement / Rationale:*

---

### 7. Examples or demonstrations

- **1:** No examples; model infers from description only.
- **5:** One or more concrete examples (input/output or format) that illustrate the desired behaviour.  

*Strength / Improvement / Rationale:*

---

### 8. Step-by-step reasoning encouraged

- **1:** No guidance on reasoning; short or opaque answers.
- **5:** Explicitly asks for step-by-step reasoning where useful (e.g. “Explain your reasoning for each finding”).  

*Strength / Improvement / Rationale:*

---

### 9. Avoiding ambiguity & contradictions

- **1:** Contradictory or ambiguous instructions; model may pick one interpretation arbitrarily.
- **5:** Consistent instructions; ambiguities resolved or explicitly scoped.  

*Strength / Improvement / Rationale:*

---

### 10. Iteration / refinement potential

- **1:** Single-shot only; hard to refine without full rewrite.
- **5:** Variables and structure allow reuse and iteration (e.g. `{{focus}}`, `{{language}}`) and minor edits.  

*Strength / Improvement / Rationale:*

---

### 11. Model fit / scenario appropriateness

- **1:** Asks for capabilities the model lacks (e.g. real-time data, heavy computation) or mismatched to typical use.
- **5:** Task and constraints are appropriate for the target model and scenario (e.g. code audit, doc generation).  

*Strength / Improvement / Rationale:*

---

### 12. Brevity vs. detail balance

- **1:** Either overly long (noise) or too terse (missing critical detail).
- **5:** Right level of detail for the task; no redundant or missing instructions.  

*Strength / Improvement / Rationale:*

---

### 13. Audience specification

- **1:** Audience unknown; output may be too technical or too simple.
- **5:** Audience is specified (e.g. “for developers familiar with WordPress”) so tone and depth are appropriate.  

*Strength / Improvement / Rationale:*

---

### 14. Structured / numbered instructions

- **1:** Wall of text; hard to follow and to update.
- **5:** Numbered or bulleted sections; easy to scan and modify.  

*Strength / Improvement / Rationale:*

---

### 15. Feasibility within model constraints

- **1:** Asks for output that exceeds context length, or for strict formats the model often breaks.
- **5:** Output length and format are feasible; fallbacks or constraints are stated if needed.  

*Strength / Improvement / Rationale:*

---

## 4. Output format for evaluations

When running an evaluation (human or tool-assisted), record results in this structure:

```markdown
1. Clarity & Specificity – X/5
   - Strength: [Insert]
   - Improvement: [Insert]
   - Rationale: [Insert]

2. Context / Background Provided – X/5
   ...

(repeat for all 15 criteria)

Total Score: X/75

Refinement summary:
- [Suggestion 1]
- [Suggestion 2]
- [Suggestion 3]
```

---

## 5. Interpretation and thresholds

| Total score | Interpretation | Suggested action |
|-------------|-----------------|------------------|
| 7–25       | Poor            | Do not promote to production; rewrite with rubric in mind. |
| 26–45      | Fair            | Significant edits required; re-evaluate after changes. |
| 46–60      | Good            | Minor improvements; acceptable for production with review. |
| 61–75      | Excellent       | Production-ready; use as reference for other prompts. |

**Policy recommendation:** Set a minimum total score (e.g. 50/75) and/or minimum per-criterion (e.g. no criterion below 3) for production promotion. Document in Internal Policy.

---

## 6. Use-case-specific emphasis

For **code audits** and **plugin reviews**, weight these criteria higher when scoring:

- Explicit task definition (3)
- Desired output format / style (4)
- Use of role or persona (6)
- Avoiding ambiguity & contradictions (9)
- Feasibility within model constraints (15)

For **refactoring** and **documentation**, also emphasise:

- Context / background provided (2)
- Examples or demonstrations (7)
- Audience specification (13)

---

## 7. References

- 15-criteria model adapted from prompt evaluation practice (e.g. Docsbot Prompt Evaluation Rubric).
- Policy: [Internal Policy Template](./01-internal-policy-template.md).
- Repo: [Repository Structure Proposal](./02-repository-structure-proposal.md) (`evaluations/`, `benchmarks/`).
