# AI Governance Framework Draft — Enterprise WordPress & Laravel Client Projects

**Purpose:** Governance framework for safely using AI tools in enterprise WordPress and Laravel client engagements.  
**Audience:** Delivery leads, security/compliance, client-facing teams.  
**Status:** Draft for internal review and client approval workflows.

---

## 1. Scope and Principles

### 1.1 Scope

- **In scope:** Use of AI coding assistants (e.g. Cursor, GitHub Copilot, Windsurf), AI-powered code review/SAST, AI content/copy tools, and any third-party LLM or model API used in the delivery of WordPress or Laravel client work.
- **Out of scope (for this draft):** Client-owned AI products we build; general enterprise AI strategy.

### 1.2 Core Principles

| Principle | Description |
|-----------|-------------|
| **Data minimisation** | Only send to AI systems data strictly necessary for the task. |
| **Assume breach** | Design detection and response assuming preventative controls may fail. |
| **Defence in depth** | Combine technical, contractual, and procedural controls. |
| **Client-first** | Client data and IP stay under client control; no use of client data for model training without explicit consent. |
| **Transparency** | Document where and how AI is used; support client approval and audit. |

---

## 2. Data Leakage Prevention

### 2.1 What We Protect

- **Session data:** Prompts, code snippets, file contents, and responses exchanged with AI tools.
- **Training data:** Any client or proprietary datasets used for fine-tuning or RAG (if applicable).
- **Model/IP:** Custom models, configs, or prompts that constitute client or house IP.

### 2.2 Preventative Controls

- **Approved tools only:** Maintain an approved AI tools list; block or discourage unapproved tools on client work.
- **Network/architecture:** Prefer private endpoints, VPCs, or on-prem/air-gapped options for high-sensitivity clients.
- **Contractual:** DPAs and contracts must prohibit use of client data for model training; require minimal or zero persistence of session data; define retention and secure disposal.
- **Guardrails:** Input/output filtering where applicable to block extraction attempts (e.g. prompt injection) and sensitive patterns.
- **Access control:** RBAC and least privilege for who can use which AI tools on which client engagements.

### 2.3 Detective Controls

- **Canary tokens / fingerprinting:** Where feasible, use canary tokens or hashes in test/sample data sent to external AI to detect leakage.
- **Monitoring:** Log and review access to AI APIs; alert on anomalies or bulk exports.
- **Incident response:** Defined process for suspected or confirmed data leakage (containment, notification, remediation).

---

## 3. PII Redaction Pipelines

### 3.1 When Redaction Is Required

- Before sending client PII to any **SaaS or third-party** AI (coding assistants, LLM APIs, cloud SAST, etc.).
- Before using client data in **training, fine-tuning, or RAG** unless under a specific lawful basis and client approval.
- For **support tickets, CRM text, UGC, or logs** that may be used in AI-assisted workflows.

### 3.2 Pipeline Design

1. **Classify:** Identify datasets and flows that contain PII (including in code comments, configs, fixtures).
2. **Detect:** Use consistent PII detection (e.g. 50+ entity types, multi-language if needed) across text, and where relevant images/documents.
3. **Redact or synthesise:** Apply redaction (masking, hashing) or synthetic replacement according to policy; prefer redaction for external AI.
4. **Audit:** Log what was redacted and where; retain evidence for compliance and client assurance.
5. **Centralise:** Prefer a single control point (e.g. proxy/gateway or pre-processing step) so all traffic to external AI passes through one policy.

### 3.3 Policy Rules

- Default: **no raw PII** to SaaS AI unless client has explicitly approved and legal basis is documented.
- For on-prem or VPC-only AI, document why PII may be processed and under which lawful basis (e.g. legitimate interest, consent, contract).

---

## 4. On-Prem vs SaaS Models

### 4.1 Decision Framework

| Factor | Prefer on-prem / VPC / air-gapped | Prefer SaaS |
|--------|------------------------------------|-------------|
| Data sensitivity | High (PII, PHI, financial, confidential) | Low or anonymised |
| Client contract | Requires data in-region / no third-party processing | Allows approved SaaS with DPA |
| Compliance | GDPR/CCPA strict residency; sector rules (e.g. HIPAA) | Standard DPA and subprocessor list acceptable |
| Cost / ops | Willing to run and patch infrastructure | Prefer OpEx and no infra ownership |
| Feature need | Need latest models but cannot use public cloud | Need latest models and OK with approved cloud |

### 4.2 Hybrid Approach

- **Tier by sensitivity:** Use on-prem or private cloud for high-sensitivity client work; SaaS only for low-sensitivity or pre-redacted data.
- **Workload placement:** Document which client/project uses which deployment (SaaS vs VPC vs on-prem) and review periodically.
- **Shared responsibility:** Align with provider’s shared responsibility model (e.g. Azure AI); document our controls vs provider’s.

---

## 5. Client Approval Workflows

### 5.1 Risk-Based Tiers

- **Tier 1 (low):** No client PII; generic tooling (e.g. approved IDE AI on non-client code). Standard internal approval.
- **Tier 2 (medium):** Client code/config but no PII; or redacted/synthetic data only. Client notification + opt-out.
- **Tier 3 (high):** Any client PII or confidential data to AI; or client-facing AI features. **Explicit client approval** and documented legal basis.

### 5.2 Approval Workflow Components

1. **Request intake:** Captures tool, use case, data types, and client/project.
2. **Risk classification:** Tier 1/2/3; sensitivity and jurisdiction.
3. **Review:** Security/compliance review for Tier 2–3; legal where needed.
4. **Client approval (Tier 3):** Written approval (e.g. email or signed addendum) specifying scope and data.
5. **Documentation:** Register of approved tools per client/project; retention of approval evidence.
6. **Monitoring handoff:** Operational monitoring and periodic re-approval (e.g. annual).

### 5.3 Avoiding Shadow AI

- Keep approval cycle time reasonable so teams don’t bypass process.
- Provide clear, fast paths for low-risk tools (allowlist + training).
- Define exceptions (e.g. urgent security fixes) with post-hoc review.

---

## 6. Compliance Considerations (GDPR Context)

### 6.1 Legal Basis

- **Contract:** AI use necessary to deliver the contracted service.
- **Legitimate interest:** Document purpose, necessity, and balancing of interests; respect objection rights.
- **Consent:** Where required (e.g. marketing AI, profiling), obtain and record consent; allow withdrawal.

No hierarchy between bases; choose and document the appropriate one per processing activity.

### 6.2 Key Obligations

- **Lawfulness, fairness, transparency:** Privacy notices and internal docs must reflect AI processing.
- **Purpose limitation:** Use client data only for agreed purposes; no model training unless agreed.
- **Data minimisation:** Only send necessary data to AI; prefer redaction/anonymisation.
- **Accuracy:** Where AI output affects individuals, have processes to correct errors.
- **Storage limitation:** Align retention of prompts/logs with retention policy and vendor commitments.
- **Security:** Technical and organisational measures (encryption, access control, vendor assessment).
- **Accountability:** Records of processing; DPIAs where high risk; cooperation with supervisory authorities.

### 6.3 Anonymity and AI Models

- EDPB Opinion 28/2024: models trained on personal data are not automatically “anonymous”. Assess case-by-case whether re-identification is reasonably likely.
- If processing remains personal data, full GDPR applies (basis, rights, DPA, etc.).

### 6.4 Data Protection Impact Assessment (DPIA)

- Conduct DPIA for AI use that is likely high risk (e.g. systematic profiling, sensitive data, large-scale use).
- Include: nature of data, purposes, retention, third parties, rights, and mitigations (e.g. redaction, on-prem).

---

## 7. Secure Coding Validation via AI

### 7.1 Permitted Use

- AI-assisted SAST, SCA, secrets detection, and code review are **encouraged** as part of secure SDLC, subject to approved tooling and data policy.
- Prefer tools that run **locally or in our CI** so source code does not leave our environment unless configured and approved.

### 7.2 Safeguards

- **Approved tools only:** Only tools on the approved list that meet our data and compliance requirements.
- **No raw client PII in prompts:** When using AI coding assistants on client code, ensure no PII in comments, configs, or sample data sent to the model.
- **Human in the loop:** Critical security findings (e.g. critical/high CVEs, auth bypass) require human review before closure.
- **Audit trail:** Retain results and remediation evidence for client and audit.

### 7.3 Tool Selection

- Prefer vendors with clear **no-training-on-our-data** commitments and SOC 2 or equivalent.
- Prefer **on-prem or VPC** options for high-sensitivity client repos when available.

---

## 8. Roles and Responsibilities

| Role | Responsibility |
|------|----------------|
| **Delivery / PM** | Ensure client approval for Tier 3 AI use; keep project register up to date. |
| **Security / Compliance** | Maintain approved tool list; run approval workflow; DPIAs; incident response. |
| **Legal** | DPAs; contract clauses; legal basis and consent wording. |
| **Developers** | Use only approved tools; no PII in prompts; report suspected incidents. |
| **Risk owner** | Per risk in risk register; monitor and escalate. |

---

## 9. Review and Maintenance

- **Framework review:** Annually or when material change (new tool category, new regulation, incident).
- **Tool list:** Review quarterly; add/remove based on risk and client requirements.
- **Client approvals:** Re-confirm Tier 3 approvals at least annually or at contract renewal.

---

## 10. References

- FINOS AI Governance Framework — Data Leakage Prevention and Detection  
- EDPB Opinion 28/2024 on AI models and personal data  
- NIST AI Risk Management Framework  
- ISO/IEC 42001 (AI management system)  
- SafeAI-Aus governance templates  

*This draft is for internal and client discussion only and does not constitute legal advice. Adapt to your jurisdiction and seek legal/compliance sign-off before adoption.*
