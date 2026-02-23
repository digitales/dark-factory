# AI Risk Register Template — Enterprise WordPress & Laravel Client Projects

**Purpose:** Central tracking for identifying, assessing, and managing AI-related risks in client delivery.  
**Audience:** Risk managers, governance teams, compliance officers, delivery leads.  
**Usage:** 30–45 min initial setup; ongoing updates as tools and engagements change.

---

## How to Use This Template

1. **Update regularly** as AI tools, regulations, and client engagements evolve.
2. **Implement controls** starting with the example measures, then add organisation-specific policies.
3. **Assign risk owners** to named individuals or teams for monitoring and escalation.
4. **Assess likelihood and residual risk** using your existing risk rating framework (e.g. 1–5 or low/medium/high).
5. **Tailor** risks to your industry, client mix, and regulatory context (e.g. GDPR, sector rules).
6. **Connect** this register to your main GRC processes and enterprise risk register.

---

## Risk Rating Guidance

- **Likelihood:** Probability the risk will materialise (e.g. 1 = rare, 5 = almost certain).
- **Impact:** Severity if it does (e.g. 1 = negligible, 5 = critical — financial, legal, reputational).
- **Residual risk:** After controls (re-assess periodically).
- **Risk owner:** Person accountable for monitoring and response.

---

## AI Risk Register

| Risk ID | Risk Name | Description | Potential Impact | Example Control Measures | Likelihood | Residual Risk | Risk Owner |
|---------|-----------|-------------|------------------|--------------------------|------------|---------------|------------|
| R1 | Regulatory non-compliance | Use of AI that breaches GDPR, CCPA, Privacy Act, consumer law, or sector rules (e.g. financial, health). | Fines, sanctions, loss of client trust, contract termination, forced shutdown. | Legal/DPIA review; align with DPA and client contracts; maintain audit trail of AI decisions and approvals. | | | |
| R2 | Data leakage to third-party AI | Client or proprietary data (code, PII, configs) sent to SaaS AI and retained or used for training. | Breach of contract/DPA, regulatory action, reputational damage, IP loss. | Approved tools only; PII redaction pipeline; contractual no-training clauses; zero/minimal persistence; canary/fingerprinting. | | | |
| R3 | PII exposure without lawful basis | Client personal data processed by AI without valid legal basis or client approval. | GDPR/CCPA fines, complaints, enforcement, client exit. | Data minimisation; redaction before external AI; Tier 3 client approval; document legal basis per use case. | | | |
| R4 | Bias and discrimination | AI-assisted decisions (e.g. content, recommendations, support) embed or amplify bias. | Discrimination claims, reputational harm, client complaints. | Human review for sensitive decisions; fairness testing where applicable; diverse review; clear accountability. | | | |
| R5 | Misinformation and hallucination | AI generates incorrect code, content, or advice presented as factual. | Defects, security issues, wrong client deliverables, reputational loss. | Human review of critical outputs; verification steps; clear labelling of AI-generated content; testing and QA. | | | |
| R6 | Vendor lock-in and dependency | Heavy reliance on a single AI provider without exit strategy or portability. | Cost increase, loss of flexibility, exposure if provider changes terms or discontinues. | Multi-vendor strategy; contract clauses for data portability; retain in-house capability; contingency plans. | | | |
| R7 | Operational failure | Over-automation or inadequate oversight causes delivery or security failures. | Service disruption, client dissatisfaction, security incidents. | Defined human oversight points; fallback procedures; testing before rollout; change and release controls. | | | |
| R8 | Insecure AI-generated code | AI suggests vulnerable code (e.g. SQLi, XSS, auth bypass) that is merged without review. | Security breaches, client data compromise, liability. | AI-assisted SAST/SCA in CI; human review for security-sensitive changes; approved secure-coding tools only. | | | |
| R9 | Shadow AI and policy bypass | Teams use unapproved AI tools to avoid slow or heavy approval processes. | Uncontrolled data exposure, compliance gaps, no audit trail. | Fast, risk-tiered approval; allowlist for low-risk tools; training; monitoring and exception handling. | | | |
| R10 | Reputational backlash | Public or client perception that AI use is unsafe, unethical, or non-compliant. | Brand damage, client attrition, tender disadvantage. | Transparent AI policy; client communication; alignment with responsible AI norms; independent review where appropriate. | | | |

*Add rows for client- or project-specific risks (e.g. sector regulations, contractual clauses).*

---

## Assessment Lenses

When assessing each risk, consider:

| Lens | Questions |
|------|-----------|
| **Reputation & trust** | How might clients, regulators, or the media react if this risk materialises? |
| **Governance & oversight** | Who approves, monitors, and reviews AI use? Are escalation paths clear? |
| **Technology reliability** | What are the limits of the AI (accuracy, hallucinations)? In what contexts do errors matter? |
| **Human impact** | How are staff, end users, or data subjects affected by errors, bias, or automation? |
| **Data sensitivity** | What data is processed (PII, confidential, IP)? What harm could exposure cause? |
| **Legal & regulatory** | Which laws and standards apply (GDPR, CCPA, sector rules, contracts)? |
| **Business context** | Where is AI used (client-facing, internal, which stack — WordPress/Laravel)? How critical to delivery? |

---

## Integration with GRC

- **Link to enterprise risk register:** Map AI risks to existing risk categories and owners.
- **Review cadence:** At least quarterly for high-risk items; annually for full register.
- **Reporting:** Include AI risk summary in governance/board reporting where relevant.
- **Trigger updates:** New tool adoption, new client type, incident, or regulatory change.

---

## Next Steps

- [ ] Populate likelihood, residual risk, and risk owner for your context.
- [ ] Add client- or engagement-specific rows.
- [ ] Align with [Governance Framework](/reports/ai-governance/01-governance-framework-draft) and [Tooling Stack](/reports/ai-governance/03-tooling-stack).
- [ ] Schedule first review date and assign owner for register maintenance.

*Template inspired by SafeAI-Aus AI Risk Register (CC BY 4.0). Adapt to your jurisdiction and seek legal/compliance input.*
