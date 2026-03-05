---
title: AI Second Brain — Research Document
description: How AI can create, consume, and govern a shared second brain for multi-agent workflows across meeting notes, coding agents, and prompt management.
---

<figure class="report-section-image-wrapper" aria-labelledby="fig-second-brain-caption">
  <img src="/report/ai-second-brain-hero.png" alt="Pencil-drawn brain cross-section with knowledge graph interior, streams flowing in from meetings, code, documents, prompts, and version control on the left, and conduits extending to four agent workstations on the right" loading="lazy" class="report-section-image">
  <figcaption id="fig-second-brain-caption">A shared knowledge brain receiving varied data sources and feeding context to multiple AI agents</figcaption>
</figure>

# AI Second Brain — Research Document

**Purpose:** Evaluate how AI can both populate and consume a structured "second brain" — a persistent, searchable knowledge layer that feeds context to multiple AI agents (Claude, ChatGPT, Cursor, Gemini) and human operators.

**Audience:** Engineering leads, AI tooling owners, governance and compliance stakeholders.

**Status:** Research document for internal review and pilot scoping.

---

## 1. What Is an AI Second Brain

A second brain is a personal or team knowledge management system designed to capture, organise, and resurface information on demand. The original concept (Tiago Forte, PARA method) assumes manual curation. The AI second brain extends this:

- **Capture** is automated or semi-automated (transcription, commit history, chat logs, document parsing).
- **Organisation** is semantic rather than folder-based — embeddings, knowledge graphs, and metadata replace manual tagging.
- **Retrieval** is agent-driven — AI systems query the brain for context before acting, rather than relying solely on what is in the prompt window.
- **Synthesis** is continuous — the system consolidates scattered facts into higher-level summaries and relationship maps over time.

The core value proposition: reduce the "cold start" problem for AI agents. Every conversation with Claude, ChatGPT, Cursor, or Gemini currently starts with zero memory unless the user manually provides context. A second brain gives agents persistent, structured, searchable memory.

---

## 2. Data Lifecycle: Ingestion, Categorisation, Storage, Search

### 2.1 Data Ingestion

| Source | Capture method | Format | Automation level |
|--------|---------------|--------|------------------|
| **Meeting notes** | Transcription (Whisper, Nova-2, Azure Speech); speaker diarisation | Audio to text, then structured JSON (speakers, timestamps, action items) | High — auto-join or recording upload |
| **Coding agent sessions** | Agent transcript logs (Cursor JSONL, ChatGPT export, Claude conversation export) | JSONL, Markdown, or structured chat format | Medium — requires export pipeline or MCP integration |
| **Agent prompts and rules** | Version-controlled files (.cursorrules, SKILL.md, system prompts, AGENTS.md) | Markdown, YAML | Low — already structured, needs indexing |
| **Documents and wikis** | Parsers for Markdown, Confluence, Notion, Google Docs | Markdown, HTML, JSON | Medium — API or export |
| **Code and commits** | Git history, PR descriptions, code comments | Diff, AST, Markdown | Medium — webhook or scheduled ingest |
| **Emails and messages** | API integrations (Gmail, Slack) | Text with metadata | Medium-High — requires auth and filtering |

### 2.2 Categorisation

Manual tagging does not scale. The system should apply:

- **Semantic embeddings** — Encode each chunk with a dense vector (e5-base, BGE-base, nomic-embed-text) so retrieval works by meaning, not keyword.
- **Entity extraction** — Identify people, projects, technologies, decisions, and action items automatically (NER models or LLM extraction).
- **Relationship mapping** — Build a knowledge graph linking entities (e.g. "Project X depends on Library Y"; "Decision D was made in Meeting M"). Graph-RAG achieves 94% accuracy on multi-hop queries versus 61% for vector-only RAG.
- **Temporal tagging** — Every chunk carries a timestamp and optional validity window. Context graphs add temporal validity so stale information is deprioritised.
- **Source typing** — Tag `source_type` (meeting, code, prompt, document, decision), `project`, `author`, and `access_roles` as structured metadata.

### 2.3 Storage Architecture

Two complementary stores:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Vector store** | Qdrant, Weaviate, or Chroma | Semantic similarity search; fast retrieval of relevant chunks |
| **Knowledge graph** | Neo4j, or MemLayer (managed) | Explicit entity relationships, multi-hop reasoning, decision provenance, temporal validity |
| **Document store** | Filesystem (Markdown/JSON) or object storage (S3) | Raw source of truth; full documents for citation and audit |

The vector store handles "find me things related to X". The knowledge graph handles "how does X relate to Y, and when was that decided". Both are queried together (Graph-RAG pattern) for best results.

### 2.4 Search and Context Delivery

When an AI agent needs context:

1. **Query embedding** — The agent's question or task description is embedded.
2. **Hybrid retrieval** — Vector similarity search plus keyword search (BM25) plus graph traversal for related entities.
3. **Metadata filtering** — Filter by project, recency, source type, access roles (RBAC).
4. **Reranking** — A cross-encoder or LLM reranker scores the top candidates for relevance.
5. **Context injection** — The top-k chunks are injected into the agent's prompt as grounding context, with citations.

Delivery mechanisms:
- **MCP (Model Context Protocol)** — Standardised protocol (Anthropic, now Linux Foundation). Cursor, Claude Desktop, and others support MCP servers that expose the second brain as a tool the agent can query. 97 million monthly SDK downloads as of February 2026.
- **RAG API** — REST or GraphQL endpoint that any agent or UI can call.
- **Agent rules/memory** — Cursor rules, Claude projects, ChatGPT custom instructions — these are lightweight "read-only" second brain layers.

---

## 3. Key Opportunities

### 3.1 Meeting Notes

**Problem:** Meeting context evaporates. Decisions, action items, and rationale are lost or scattered across Slack, email, and personal notes. When an AI agent is later asked "why did we choose approach X?", it has no access to the conversation where that decision was made.

**Opportunity:**
- Auto-transcribe all meetings (Zoom, Teams, Google Meet) with speaker diarisation.
- Extract structured output: decisions, action items (with owners and deadlines), open questions, risks.
- Feed extracted entities and relationships into the knowledge graph (e.g. "Decision: use Qdrant for vector store — made 2026-03-05 — participants: Ross, Sarah").
- When a coding agent or planning agent runs, it can query: "What decisions have been made about the search architecture?" and get grounded, cited answers.

**Current tools:** Otter.ai, Fireflies.ai, Read AI (with knowledge graph), Avoma, Vomo.ai. Self-hosted: Whisper + custom extraction pipeline.

**Measurable impact:** 3-5 hours/week saved on follow-up per person (industry benchmarks). Reduction in "re-deciding" settled questions.

### 3.2 Coding Agents

**Problem:** Cursor, Copilot, and other coding agents start each session with limited context — the open files, git status, and any rules files. They lack knowledge of past decisions, architectural rationale, deployment history, or what was discussed in the last sprint planning. Context window limits compound this.

**Opportunity:**
- Index all agent transcripts (Cursor JSONL logs already exist in this repo at `.cursor/projects/`).
- Build a project knowledge graph: architecture decisions, dependency choices, known issues, deployment runbooks.
- Expose the second brain via MCP server so Cursor can query it as a tool: "What was the rationale for choosing Qdrant over Pinecone?" or "What deployment steps are needed for the search service?"
- Feed PR review history and CI failure patterns as learning data — the agent avoids repeating past mistakes.

**Current tools:** Cursor rules/skills (already in use in this repo), Claude Projects, Engram (open-source agent memory), LangMem (LangChain long-term memory). MCP servers for knowledge retrieval.

**Measurable impact:** Fewer repeated questions; faster onboarding for new agents and team members; reduced "context re-loading" time per session.

### 3.3 Agent Prompts

**Problem:** Prompt engineering IP is scattered across chat histories, Notion pages, personal notes, and undocumented tribal knowledge. When a team member leaves or a new agent is onboarded, prompt patterns are lost. Inconsistent prompting leads to inconsistent output quality.

**Opportunity:**
- Build a structured prompt library with versioning, tagging, and usage tracking.
- Follow naming convention: `[Team]_[Task]_[ContentType]_[V#]` (e.g. `Engineering_CodeReview_PHPStan_V2`).
- Store prompts as Markdown files in version control (already partially done via `.cursor/skills/` and `.cursor/rules/` in this repo).
- Index the prompt library in the second brain so agents can retrieve relevant prompts or fragments when needed.
- Track which prompts produce the best results per model (Claude vs GPT-4 vs Gemini) — prompt-model compatibility matrix.

**Measurable impact:** 60-80% reduction in prompt creation time; 40-60% improvement in output consistency; 80-90% retention of prompt IP during staff transitions.

---

## 4. Tool Comparison: Open Source vs SaaS

### 4.1 Knowledge Management / Second Brain Layer

| Tool | Type | Self-hosted | Multi-agent support | Key strength | Key weakness | Cost |
|------|------|-------------|---------------------|--------------|--------------|------|
| **Obsidian + AI plugins** | OSS (app) | Yes (local files) | Via plugins or MCP | Full local control; Markdown; huge plugin ecosystem | Requires manual setup; no built-in AI | Free (core); Sync $4/mo |
| **Refly.AI** | OSS | Yes (Docker/K8s) | 13+ LLM models | Multi-threaded dialogue; RAG built in; rich editor | Early-stage; smaller community | Free (self-hosted) |
| **Engram** | OSS (Apache 2.0) | Yes | Agent-focused memory | Dream cycle consolidation; PII detection; ensemble search (124ms) | Newer project; limited integrations | Free (self-hosted) |
| **Mem** | SaaS | No | Limited (API) | Self-organising notes; team features | Vendor lock-in; data leaves your infra | Free tier; Pro $15/mo |
| **Notion AI** | SaaS | No | No (single-user AI) | Existing Notion users; broad workspace | AI is add-on; no agent protocol support | $10/mo add-on |
| **Atlas** | SaaS | No | Limited | Visual knowledge graphs; auto-connections | Newer; limited enterprise features | Free tier; Pro $12/mo |
| **NotebookLM** | SaaS (Google) | No | No | Source-grounded research; citations; audio summaries | Google ecosystem only; no API | Free |

### 4.2 RAG / Retrieval Layer

| Tool | Type | Self-hosted | MCP support | Key strength | Cost |
|------|------|-------------|-------------|--------------|------|
| **Qdrant** | OSS (Apache 2.0) | Yes | Via custom MCP server | Fast (22-38ms P95); filtering; Rust | Free (self-hosted) |
| **Weaviate** | OSS (BSD-3) | Yes | Via custom MCP server | Hybrid search (vector + keyword); multi-tenant | Free (self-hosted) |
| **Chroma** | OSS (Apache 2.0) | Yes | Community MCP servers exist | Simplest setup; good for POC | Free (self-hosted) |
| **LanceDB** | OSS | Yes | Cursor plugin exists (RAGnarok) | Embedded; no server needed; good for local dev | Free |
| **Ragtime** | OSS | Yes | Built-in MCP server | OpenAI-compatible API; dual vector stores; tool calling | Free (self-hosted) |

### 4.3 Knowledge Graph Layer

| Tool | Type | Self-hosted | Key strength | Cost |
|------|------|-------------|--------------|------|
| **Neo4j** | OSS (Community) / Commercial | Yes | Mature; production-proven; agent memory libraries (Feb 2026) | Free (Community); Enterprise licensed |
| **MemLayer** | Managed SaaS | No | Bitemporal; audit trails; auto-dedup; MCP/REST API | Pricing TBD |
| **LangMem** | OSS (LangChain) | Yes | Semantic + episodic + procedural memory; auto-consolidation | Free (library) |

### 4.4 Meeting Capture Layer

| Tool | Type | Self-hosted | Key strength | Cost |
|------|------|-------------|--------------|------|
| **Whisper (OpenAI)** | OSS | Yes | High accuracy; multi-language; local processing | Free (self-hosted) |
| **Otter.ai** | SaaS | No | Mature; integrations; collaboration | Free tier; Pro $17/mo |
| **Fireflies.ai** | SaaS | No | CRM integration; action item extraction | Free tier; Pro $10/mo |
| **Read AI** | SaaS | No | Knowledge graph from meetings; digital twin (Ada) | Free tier; Pro $20/mo |

### 4.5 Recommendation

For a privacy-conscious team using multiple AI agents:

- **Start with:** Obsidian (local Markdown) + Qdrant (Docker) + Whisper (local transcription) + custom MCP server.
- **Graph layer:** Neo4j Community or LangMem for relationship tracking.
- **Why not SaaS-first:** Data sovereignty, multi-agent compatibility, and the ability to serve context to Claude, ChatGPT, Cursor, and Gemini without vendor lock-in.
- **When SaaS makes sense:** If ops capacity is limited and data sensitivity allows it, Otter.ai or Fireflies.ai for meeting capture; Mem or Notion AI for lightweight team knowledge.

---

## 5. Security and Governance Considerations

### 5.1 Data Classification

Before any data enters the second brain, classify it:

| Tier | Description | Handling |
|------|-------------|----------|
| **Public** | Open-source code, published docs | No restrictions on storage or retrieval |
| **Internal** | Meeting notes, internal decisions, prompts | Store on controlled infra; access by team role |
| **Confidential** | Client data, credentials, PII, commercial terms | Redact before ingestion; or store in isolated collection with strict RBAC |
| **Restricted** | Secrets, API keys, passwords | Never ingest; detect and block at ingest pipeline |

### 5.2 Ingestion Controls

- **PII redaction at ingest** — Run NER-based PII detection (e.g. Presidio, spaCy, or Engram's built-in safety detection) before embedding. Redact or mask before data enters the vector store.
- **Secrets scanning** — Integrate gitleaks, truffleHog, or regex patterns to block API keys, passwords, and tokens from entering the knowledge base.
- **Client data isolation** — If meeting notes reference client work, tag with `client_id` and enforce access controls so only authorised users/agents can retrieve those chunks.
- **Content provenance** — Every chunk must carry: `source`, `author`, `timestamp`, `classification_tier`, and `ingestion_method`.

### 5.3 Retrieval Controls (RBAC)

- Apply role-based access at query time: filter vector search results by `user.roles` and `user.projects`.
- Post-retrieval permission check: verify retrieved doc IDs against the auth system before injecting into agent context.
- Zero-trust for agents: an MCP-connected agent should authenticate and carry a role; it should not have access to all data by default.

### 5.4 GDPR and Compliance

- **Lawful basis** for processing meeting recordings and transcriptions (consent or legitimate interest — document which and get sign-off).
- **Data subject rights** — Must be able to delete a person's data from the knowledge base (right to erasure). This means tracking which chunks contain which person's data.
- **Retention policy** — Define how long each data type persists. Meeting transcripts may have a 12-month retention; code decisions may persist indefinitely.
- **Cross-border transfers** — If using SaaS AI tools, ensure data processing agreements cover transfer mechanisms (Standard Contractual Clauses, adequacy decisions).
- **DPIA** — Conduct a Data Protection Impact Assessment before production deployment, especially if processing meeting recordings with PII.

### 5.5 Agent-Specific Risks

| Risk | Description | Mitigation |
|------|-------------|------------|
| **Context poisoning** | Malicious or incorrect data in the second brain leads agents to produce wrong outputs | Content provenance tracking; periodic quality audits; human review of high-stakes retrievals |
| **Over-retrieval** | Agent receives too much context, leading to hallucination or confusion | Limit top-k results; use reranking; monitor answer quality |
| **Data exfiltration via agent** | Agent outputs sensitive data from the second brain to an unauthorised channel | Output filtering; audit logs on what was retrieved and where it was sent |
| **Stale context** | Outdated information treated as current | Temporal validity in knowledge graph; decay scoring; periodic re-indexing |
| **Model training leakage** | Data sent to SaaS AI providers used for model training | Use providers with contractual no-training guarantees; prefer local/VPC models for sensitive data |

---

## 6. 90-Day Pilot Implementation Roadmap

### Assumptions

- Team of 5-15 people using Cursor, Claude, ChatGPT, and Gemini.
- Existing infrastructure can run Docker containers (no GPU required for POC — CPU-based embeddings).
- Budget ceiling of approximately $500/month for tooling (excluding existing AI subscriptions).
- One pilot project selected for scoping.

### Unknowns

- Volume of meeting recordings per week (affects storage and compute sizing).
- Which AI agents the team uses most frequently (affects MCP integration priority).
- Whether client data appears in meeting notes (affects redaction pipeline urgency).
- Team appetite for manual curation versus fully automated ingestion.

### Phase 0: Foundation (Days 1-30)

| Week | Milestone | Owner | Deliverables | Success criteria |
|------|-----------|-------|--------------|------------------|
| 1 | **Audit existing knowledge** | Lead | Inventory of where knowledge currently lives: Cursor transcripts, meeting recordings, Slack, Notion, Git repos, prompt files | Inventory document completed |
| 1-2 | **Select and deploy vector store** | DevOps / Lead | Qdrant in Docker; test with 500 sample chunks from existing Markdown docs and agent transcripts | Vector store running; search returns relevant results |
| 2 | **Embedding pipeline** | Engineer | Python ingest script: parse Markdown, chunk (semantic for docs, AST for code), embed with e5-base or nomic-embed-text (Ollama), upsert to Qdrant | 1,000+ chunks indexed; recall tested manually |
| 3 | **Meeting capture pipeline** | Engineer | Whisper (local) or Otter.ai (SaaS) for transcription; extraction script for decisions, action items, participants | 5 meetings transcribed and structured |
| 3-4 | **MCP server (read-only)** | Engineer | MCP server exposing Qdrant search as a tool; connect to Cursor | Cursor agent can query the knowledge base and get cited results |
| 4 | **Governance baseline** | Lead + Governance | Data classification policy; PII redaction pipeline (Presidio or regex); ingestion rules documented | Policy document; redaction tested on sample data |
| 4 | **30-day review** | All | Assess: Is retrieval useful? Any data sensitivity issues? Team feedback | Gate for Phase 1 passed |

### Phase 1: Expand and Connect (Days 31-60)

| Week | Milestone | Owner | Deliverables | Success criteria |
|------|-----------|-------|--------------|------------------|
| 5-6 | **Prompt library** | Lead + Team | Index existing .cursor/skills/, .cursor/rules/, and any team prompts into the knowledge base; establish naming convention and versioning | Prompts searchable via MCP; naming convention documented |
| 6-7 | **Knowledge graph (basic)** | Engineer | Neo4j Community or LangMem; extract entities and relationships from meeting notes and architecture decisions; link to vector chunks | Graph queryable: "What decisions relate to project X?" returns results |
| 7 | **Multi-agent delivery** | Engineer | Extend MCP server or build RAG API endpoint that Claude Desktop, ChatGPT (via custom GPT or API), and Gemini can consume | At least 2 agents beyond Cursor can query the second brain |
| 7-8 | **Automated ingestion** | Engineer | Scheduled ingest: new Markdown files, new agent transcripts, new meeting recordings (webhook or cron) | New content appears in search within 1 hour of creation |
| 8 | **60-day review** | All | Eval: 30 test questions; measure Recall@5, answer quality, team usage | Gate for Phase 2 passed; quantitative baseline recorded |

### Phase 2: Optimise and Decide (Days 61-90)

| Week | Milestone | Owner | Deliverables | Success criteria |
|------|-----------|-------|--------------|------------------|
| 9-10 | **Graph-RAG integration** | Engineer | Combine vector search and graph traversal for retrieval; test on multi-hop queries ("What meeting led to the decision that affects this code?") | Measurable improvement on multi-hop queries vs vector-only |
| 10-11 | **Quality and consolidation** | Engineer + Lead | Memory consolidation (Engram-style or LangMem): merge duplicate facts, flag contradictions, decay stale content | Reduced noise in retrieval results |
| 11 | **Usage analytics** | Lead | Dashboard: queries per day, hit rate, agent usage breakdown, most-retrieved content, gaps (queries with no good results) | Dashboard live; data for KPI review |
| 12 | **Go/no-go review** | All | KPI review against targets; cost vs ceiling; team satisfaction survey; decision on wider rollout, iteration, or revert | Decision documented; next steps clear |

---

## 7. KPIs to Measure Productivity Gain

### 7.1 Primary KPIs

| KPI | Baseline (pre-pilot) | Target (90 days) | How to measure |
|-----|----------------------|-------------------|----------------|
| **Context loading time per agent session** | Measure average time team spends providing context to AI agents (manual prompt engineering) | Reduce by 40-60% | Time tracking or self-report survey (weekly) |
| **Re-decided questions** | Count of decisions re-discussed in meetings because original rationale was lost | Reduce by 50% | Meeting note analysis; team tally |
| **Agent answer quality (grounded)** | Baseline: % of agent answers that are grounded in verifiable sources (vs hallucinated) | Increase by 30% | Sample 20 agent interactions/week; human review for grounding |
| **Onboarding time for new context** | Time for a new team member or agent to become productive on a project | Reduce by 30% | Measure time-to-first-useful-contribution |
| **Prompt reuse rate** | % of agent interactions using a library prompt vs ad-hoc prompting | Increase from ~0% to 50%+ | Prompt library usage logs |

### 7.2 Secondary KPIs

| KPI | Target | How to measure |
|-----|--------|----------------|
| **Retrieval Recall@5** | > 0.85 | Test question set; check if gold document appears in top 5 results |
| **Retrieval latency (P95)** | < 2 seconds | API response time monitoring |
| **Knowledge base coverage** | > 80% of active project decisions indexed | Audit against meeting notes and decision logs |
| **RBAC leak rate** | 0 | Run queries as unprivileged user; verify no restricted content returned |
| **Cost per month** | < $500 for infrastructure (excluding AI subscriptions) | Monthly cost review |
| **Team adoption** | > 70% of team members using second brain queries weekly | Usage analytics |

### 7.3 Anti-Metrics (Watch For)

- **Over-reliance:** Team stops thinking critically and accepts AI answers without verification. Monitor via spot-check audits.
- **Ingestion debt:** Large backlog of un-indexed content. Monitor via coverage metric.
- **Query fatigue:** Team stops querying because results are poor. Monitor via declining usage.

---

## 8. Risks and Failure Modes

### 8.1 Risk Register

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|------|-----------|--------|------------|-------|
| R1 | **Cold start / empty brain** — System deployed but insufficient content indexed; queries return nothing useful; team abandons | High | High | Seed with existing docs, agent transcripts, and meeting recordings in Phase 0; focus on one project to reach critical mass fast | Lead |
| R2 | **Garbage in, garbage out** — Low-quality or contradictory data indexed without curation; agent answers degrade | Medium | High | Content provenance; periodic quality audits; consolidation pipeline to merge/flag conflicts | Engineer |
| R3 | **Data leakage** — Sensitive client data, PII, or secrets enter the knowledge base and are surfaced to unauthorised users or agents | Medium | Critical | PII redaction at ingest; secrets scanning; RBAC on retrieval; DPIA before production | Governance |
| R4 | **Context poisoning** — Incorrect or outdated information in the brain causes agents to make wrong decisions (e.g. outdated deployment steps) | Medium | High | Temporal validity; decay scoring; flag stale content; human review for high-stakes queries | Engineer + Lead |
| R5 | **Vendor lock-in** — Choosing a SaaS knowledge tool that does not export data or support standard protocols | Low | Medium | Prefer open-source and standard formats (Markdown, JSONL); MCP for agent integration; avoid proprietary-only storage | Lead |
| R6 | **Scope creep** — Pilot expands to "index everything" before core retrieval quality is proven | High | Medium | Strict Phase 0 scope: one project, limited sources; gate reviews at 30/60/90 days | Lead |
| R7 | **Team resistance** — Team sees the second brain as overhead rather than value; adoption stalls | Medium | High | Demonstrate value in first 2 weeks with concrete examples; make querying frictionless (MCP in Cursor, not a separate UI) | Lead |
| R8 | **Ops burden** — Self-hosted stack (Qdrant, Neo4j, Whisper) requires more maintenance than team has capacity for | Medium | Medium | Start with minimal stack (Qdrant only, no graph); add complexity only after Phase 0 validates value; consider managed options if ops is a bottleneck | DevOps |
| R9 | **Multi-agent inconsistency** — Different agents (Claude, GPT, Gemini) interpret the same retrieved context differently, producing conflicting answers | Low | Medium | Standardise retrieval format and citation structure; compare agent outputs on test questions; document model-specific quirks | Engineer |
| R10 | **Cost overrun** — GPU compute, storage, or SaaS subscriptions exceed budget | Low | Medium | CPU-based embeddings for POC; monitor costs weekly; alert at 80% of ceiling | Cost owner |

### 8.2 Stop Conditions

Halt or revert the pilot if any of these occur:

- Data leakage incident (any client PII or secrets surfaced to an unauthorised party).
- Monthly infrastructure cost exceeds 2x the ceiling ($1,000) for two consecutive weeks.
- Retrieval quality (Recall@5) drops below 0.5 after tuning.
- Fewer than 3 team members using the system after 60 days despite training and support.
- Team vote to stop (majority).

---

## 9. Unknowns and Open Questions

- **Agent transcript format stability:** Cursor JSONL format may change between versions; need to monitor and adapt parsers.
- **MCP adoption across agents:** Claude Desktop and Cursor support MCP; ChatGPT and Gemini support is evolving (ChatGPT has custom actions; Gemini has extensions). The multi-agent delivery mechanism may need adapters.
- **Knowledge graph ROI:** Graph-RAG benchmarks show large gains on multi-hop queries, but the setup cost is higher than vector-only. The pilot should validate whether the team's actual queries benefit from graph traversal before investing heavily in Phase 1.
- **Meeting recording consent:** In some jurisdictions and company policies, recording meetings requires explicit consent from all participants. This must be resolved before deploying the meeting capture pipeline.
- **Model-specific context window limits:** Claude (200k), GPT-4 (128k), Gemini (1M+), Cursor (varies by model). The retrieval layer should respect per-model token budgets when injecting context.

---

## 10. Actionable Next Steps

1. **Audit knowledge sources (Week 1):** Map where team knowledge currently lives — Cursor transcripts, meeting notes, Slack, Notion, Git, prompt files. Quantify volume and sensitivity.

2. **Choose pilot project (Week 1):** Select one active project with enough history to seed the knowledge base. Prefer a project where "context loss" is a known pain point.

3. **Deploy minimal stack (Week 2):** Qdrant in Docker + embedding pipeline (Python + e5-base via Ollama). Index existing Markdown docs, agent transcripts, and README files from the pilot project.

4. **Build MCP server (Week 3):** Expose vector search as an MCP tool for Cursor. Test with real queries from the team.

5. **Define governance policy (Week 3-4):** Data classification, PII redaction rules, RBAC model, and retention policy. Get sign-off before expanding data sources.

6. **Establish baseline KPIs (Week 4):** Measure current context-loading time, re-decided questions, and agent answer quality. Record as baseline for 90-day comparison.

7. **Begin meeting capture (Week 4):** Start with Whisper (local) on one recurring meeting. Extract decisions and action items. Index in the knowledge base.

8. **30-day gate review (Week 4):** Is retrieval useful? Any data issues? Team feedback. Decide whether to proceed to Phase 1 (expand) or iterate on Phase 0.
