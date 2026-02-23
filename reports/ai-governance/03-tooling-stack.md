# Recommended Tooling Stack — AI Safety in Enterprise WordPress & Laravel Client Projects

**Purpose:** Recommended tools and patterns for data leakage prevention, PII redaction, deployment models, approval workflows, compliance, and secure coding validation.  
**Audience:** Security, engineering, and delivery leads.  
**Note:** Evaluate each tool against your governance framework and client contracts; treat as a starting list, not a default approval.

---

## 1. Data Leakage Prevention (DLP)

| Category | Tool / Approach | Notes |
|----------|----------------|-------|
| **Enterprise DLP** | Microsoft Purview, Forcepoint, Symantec DLP | Policy-based discovery and blocking; integrate with email, endpoints, cloud. Use for data-in-motion and data-at-rest. |
| **DSPM for AI** | Microsoft Purview DSPM for AI | Identifies oversharing to AI services; aligns DLP policies with AI traffic. |
| **API / proxy controls** | Custom API gateway or vendor proxy (e.g. PolyRedact gateway) | Single control point before traffic reaches LLM APIs; enforce redaction and logging. |
| **Canary / fingerprinting** | Canary tokens, custom hashing of sample data | Detect if client or test data appears in external systems; support incident response. |

**Stack suggestion:** DLP product for enterprise data flows + gateway/proxy for all outbound calls to third-party AI APIs.

---

## 2. PII Redaction Pipelines

| Category | Tool / Approach | Notes |
|----------|----------------|-------|
| **Multimodal redaction (API-first)** | [PolyRedact](https://polyredact.com/) | Detects and redacts PII across text, screenshots, documents, audio, video before data reaches LLMs; policy-driven; audit trail. Suited to copilots and support workflows. |
| **De-identification (multi-language)** | [Private AI](https://private-ai.com/) | 50+ PII types, 50+ languages; text, audio, images, documents; on-prem or cloud. Good for GDPR/HIPAA/PCI-heavy contexts. |
| **Unstructured text / training data** | [Tonic Textual](https://tonic.ai/) (e.g. redact & synthesize) | Redact or synthesize free-text for LLM training or testing; custom entities; pipeline-friendly. |
| **DIY / lightweight** | Regex + NER (e.g. spaCy, Presidio) in own pipeline | Lower cost; more engineering; use for internal-only, low-scale flows after risk assessment. |

**Stack suggestion:** For client work involving PII to SaaS AI: dedicated redaction layer (PolyRedact or Private AI) in front of all external AI calls. For training/data prep: Tonic or Private AI depending on data type and language.

---

## 3. On-Prem vs SaaS Deployment

| Model | When to Use | Example Options |
|-------|-------------|------------------|
| **On-prem / air-gapped** | Strict data residency; no third-party processing; regulated sectors. | Self-hosted LLMs (e.g. Llama, Mistral); local coding assistants; on-prem SAST/SCA. |
| **VPC / private cloud** | Need cloud scale and updates but data must stay in your tenant. | Azure OpenAI in customer tenant; AWS Bedrock in VPC; private deployment of GitHub Copilot Enterprise. |
| **SaaS (approved)** | Low-sensitivity or redacted data; client and DPA allow; need speed and features. | OpenAI/Anthropic/Google APIs via gateway; GitHub Copilot; Cursor with policy (no PII). |
| **Hybrid** | Different clients/sensitivity levels. | High-sensitivity → on-prem/VPC; low-sensitivity → SaaS with redaction and DPA. |

**Stack suggestion:** Classify clients by sensitivity; maintain a shortlist of approved SaaS tools with DPAs; prefer VPC/on-prem for any Tier 3 (high-sensitivity) AI use unless explicitly approved otherwise.

---

## 4. Client Approval Workflows

| Category | Tool / Approach | Notes |
|----------|----------------|-------|
| **Request intake & workflow** | OneTrust AI Governance, ServiceNow, Jira + custom workflow | Central intake, risk tiering, approval steps, audit trail. |
| **Lightweight** | Shared spreadsheet + form (e.g. Google Forms, Microsoft Forms) | Request form → risk tier → approver; link to risk register and tool list. |
| **Vendor evaluation** | OneTrust AI Vendor Evaluation; SafeAI-Aus Vendor Evaluation Checklist | Standardised criteria (data handling, training policy, certifications) before adding to allowlist. |
| **Register of approvals** | Confluence, SharePoint, or GRC platform | Per-client, per-tool, per-use-case; store approval evidence and expiry. |

**Stack suggestion:** At minimum: intake form + risk tier (1/2/3) + documented approval for Tier 3 + register linked to risk register. Scale to OneTrust or similar if volume and audit requirements grow.

---

## 5. Compliance (GDPR-Oriented)

| Category | Tool / Approach | Notes |
|----------|----------------|-------|
| **DPIA and records** | OneTrust, TrustArc, or structured templates | DPIAs for high-risk AI use; RoPA; retention and legal basis. |
| **Consent / preference** | Cookie/consent platform (e.g. OneTrust, Cookiebot) + internal consent register | Where consent is basis; withdrawal and audit. |
| **Privacy notices** | Legal + template updates | Disclose AI processing; lawful basis; rights; third parties. |
| **Vendor/DPA management** | Contract lifecycle + DPA repository | Subprocessor lists; no-training and data residency clauses. |
| **Regulatory monitoring** | EDPB, ICO, CNIL alerts; legal counsel | Track opinions (e.g. EDPB 28/2024), guidance, and enforcement. |

**Stack suggestion:** Use existing privacy/GRC tools for DPIAs and RoPA; add an “AI use” section to records and notices; keep DPAs and AI clauses in one place.

---

## 6. Secure Coding Validation via AI

| Category | Tool / Approach | Notes |
|----------|----------------|-------|
| **SAST / code review (AI-assisted)** | Semgrep (Semgrep Assistant), Snyk (Snyk Assist, DeepCode), SonarQube (AI Code Assurance) | In-IDE and in-CI; reduce false positives; fix suggestions. Prefer self-hosted or VPC for client code. |
| **Agentic / IDE security** | Checkmarx Developer Assist | Real-time analysis in IDE; pre-commit; verified fixes. |
| **SCA / secrets** | Snyk, Semgrep (secrets rules), GitGuardian | Dependencies and secrets; integrate with same pipeline. |
| **PHP/WordPress/Laravel** | PHPStan, Laravel Pint, WordPress coding standards + Semgrep/Snyk for security | Language-specific quality and security; add AI-assisted SAST on top. |

**Stack suggestion:** Semgrep or Snyk in CI (and optionally IDE) for SAST + SCA + secrets; run in your or client’s environment so code does not leave unless explicitly approved. Use AI features only with tools that commit to no training on your code and meet your DPA requirements.

---

## 7. Stack Summary by Use Case

| Use case | Recommended direction |
|----------|------------------------|
| **Prevent data leakage** | Enterprise DLP + API gateway/proxy in front of all third-party AI; canary/fingerprinting where feasible. |
| **Redact PII before SaaS AI** | PolyRedact or Private AI as gateway/layer before LLM APIs and copilots. |
| **Deployment choice** | Tier clients; on-prem/VPC for high sensitivity; SaaS only with redaction + DPA for lower sensitivity. |
| **Client approval** | Risk-tiered workflow (1/2/3); Tier 3 = explicit client approval; register + evidence. |
| **GDPR compliance** | DPIAs, RoPA, notices, DPAs; align with EDPB Opinion 28/2024 and local guidance. |
| **Secure coding** | Semgrep or Snyk (SAST + SCA + secrets) in CI/IDE; prefer no code sent to vendor or with strict no-training terms. |

---

## 8. Evaluation Checklist for New Tools

Before adding any AI tool to the approved list:

- [ ] Data handling: Where is data processed (region, on-prem vs cloud)? Is persistence minimal and contractually bounded?
- [ ] Training: Contractual prohibition on using our/client data for model training?
- [ ] Certifications: SOC 2 Type II, ISO 27001, or equivalent?
- [ ] DPA and subprocessors: Signed DPA; subprocessor list and governance?
- [ ] Redaction: Can we send only redacted data, or does the tool provide redaction?
- [ ] Audit: Logging and audit trail for compliance and incidents?
- [ ] Exit: Data portability and deletion on termination?

*Use with the [Governance Framework](/reports/ai-governance/01-governance-framework-draft) and [Risk Register](/reports/ai-governance/02-risk-register-template).*
