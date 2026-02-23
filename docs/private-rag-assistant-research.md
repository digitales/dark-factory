# Private RAG Assistant for WordPress + Laravel Dev Team

**Research document** — Deployment runbooks, Jira exports, infrastructure docs, plugin documentation, internal Markdown.

---

## 1. Embedding model selection

| Criterion | Recommendation | Notes |
|-----------|----------------|-------|
| **Best balance (POC)** | **e5-base-v2** or **BAAI/bge-base-en-v1.5** | ~100M params, 100% Top-5 accuracy in benchmarks, low latency (~16–50 ms). |
| **Highest retrieval quality** | **e5-large-instruct** or **BGE-large** | 85%+ retrieval accuracy; stronger for mixed code + prose. |
| **Lightweight / CPU-only** | **e5-small** (118M) | Fastest (16 ms), good Top-5 accuracy; suitable for small teams or dev machines. |
| **Self-hosted, popular** | **nomic-embed-text** (768 dims) | Well-supported, good for docs + code; fits Ollama/local stacks. |

**Avoid for production:** `all-MiniLM-L6-v2` (outdated, ~56% Top-5 accuracy).

**Self-hosting:** Use **Ollama** for local inference or **Sentence Transformers** in Python; keep embeddings on your infra to satisfy data residency.

**For WordPress/Laravel:** Prefer **multilingual-capable** models (e.g. BGE, e5) if runbooks or Jira use mixed languages; otherwise English-focused models (e5-*, BGE-en) are sufficient.

---

## 2. Vector database comparison

| Database | Self-hosted | Latency (P95) | Indexing (1M vectors) | Typical cost (self-hosted) | Best for |
|----------|-------------|---------------|------------------------|----------------------------|----------|
| **Qdrant** | ✅ | 22–38 ms | ~6 min | ~$120/mo (r6g.xlarge) | Performance, filtering, Rust/APACHE 2.0 |
| **Weaviate** | ✅ | 38–65 ms | ~9 min | ~$120/mo (r6g.xlarge) | Hybrid (vector + keyword), GraphQL, multi-tenant |
| **Chroma** | ✅ | 180–340 ms | ~28 min | ~$60/mo (t3.large) | Prototyping, local dev, tight budget |
| **Pinecone** | ❌ managed only | — | — | ~$3k/mo (performance tier) | Skip for “private” requirement |

**Recommendation for POC:** **Qdrant** (Docker, low ops) or **Chroma** (fastest to stand up). For production with hybrid search (Jira + code + Markdown), **Weaviate** is a strong option.

**Recall:** All in the 0.94–0.98 range for typical RAG; choice matters more for scale, filtering, and ops.

---

## 3. Chunking strategies: code vs docs

### Documentation (runbooks, infra docs, Markdown, Jira exports)

- **Preferred:** **Semantic chunking** — split at meaning boundaries (sections, paragraphs) rather than fixed token counts.
  - **Embedding-based:** Compute similarity between adjacent sentences; split when similarity drops (e.g. cosine &lt; threshold). ~85–91% retrieval accuracy vs ~75–80% for fixed-size.
  - **NLP-based:** Use spaCy (or similar) for section/topic boundaries.
- **Overlap:** 50–100 tokens overlap at chunk boundaries to avoid cutting context.
- **Sizes:** Variable; aim for ~200–800 tokens per chunk so full procedures stay together.

### Source code (plugins, Laravel app code)

- **Preferred:** **AST-based chunking** (e.g. **cAST**, **Tree-sitter**).
  - Preserve **function/class/module** boundaries; avoid splitting mid-function.
  - Tree-sitter supports 29+ languages (PHP, JavaScript, etc.) and fits WordPress/Laravel stacks.
  - **Results:** ~4.3 pt gain Recall@5 vs fixed-size; ~2.67 pt Pass@1 on code-generation tasks.
- **Fallback:** Recursive character/text splitting with **code-aware separators** (e.g. `\n\n`, `function `, `class `) and max chunk size (~512 tokens).

### Mixed content (plugin docs + code snippets)

- Use **two pipelines:** one semantic for prose, one AST for code; tag chunks with `type: doc | code` and **language** for filtering.
- Store **metadata:** `source` (e.g. repo, Confluence, Jira), `doc_type` (runbook, API, README), `project` (WordPress plugin X, Laravel app Y).

---

## 4. Security and access control

- **Authentication:** Central IdP (e.g. **SSO/SAML/OIDC**). No shared API keys for end-users.
- **Authorization:** Apply **RBAC** (or ABAC/ReBAC if needed) so retrieval only sees documents the user is allowed to see.
  - **Pattern:** Store **role/project/team** (or resource IDs) as metadata on chunks; at query time, filter by `user.roles` / `user.projects` before or after vector search.
  - **Post-query filtering:** Run permission checks on retrieved doc IDs against your auth system to avoid leaking snippets from unauthorized runbooks or repos.
- **Sensitive data:** Redact PII/credentials in runbooks and Jira exports **before** embedding (e.g. Comprehend-style or regex + allowlists). Prefer “redact at ingest” so sensitive text never enters the vector DB.
- **Network:** Run RAG stack (embeddings, vector DB, LLM) in a private VPC; expose only the RAG API (and optional web UI) through an auth gateway.
- **Audit:** Log queries and which documents were retrieved (doc IDs, not full content) for compliance and debugging.

---

## 5. Integration options

| Integration | Use case | Effort | Notes |
|-------------|----------|--------|-------|
| **Web UI** | Primary interface for runbooks, Jira, infra docs | Medium | Simple chat UI + source citations; auth via existing SSO. Best for POC. |
| **Slack** | “How do we…?” in channels or DMs | Medium | Bot with RAG backend; use Slack OAuth + scopes; optional RAGTime-style patterns (mention-based, threads). |
| **VSCode / Cursor** | Code-aware Q&A in editor | Higher | Extensions like **RAGnarōk** (local embeddings + LanceDB) or custom extension calling your RAG API; good for “how does plugin X work?” with code context. |
| **API-only** | Other tools (e.g. internal dashboards, CLI) | Low | REST/GraphQL endpoint: `query` + `user_id`/`roles`; return answer + doc refs. |

**POC priority:** Web UI first (proves value, easy to demo), then Slack; VSCode once retrieval quality is validated.

---

## 6. Estimated infrastructure costs

Rough **monthly** ranges for a **private** stack (single region, no managed Pinecone/OpenAI for core RAG).

| Component | Low (POC / small team) | Medium (10–20 devs) | High (50+ devs, 10M+ chunks) |
|----------|------------------------|----------------------|------------------------------|
| **Embeddings** | Self-hosted (e5-base) on 1× CPU or small GPU: ~$50–100 | 1× L4 or T4 GPU: ~$200–400 | Dedicated embedding tier: ~$500–1,500 |
| **Vector DB** | Chroma/Qdrant single node: ~$60–120 | Qdrant/Weaviate cluster: ~$300–600 | ~$600–1,000 |
| **LLM inference** | Ollama on existing server or 1× small GPU: ~$0–150 | 1× A10/L4: ~$300–600 | Multiple GPUs or managed: ~$1,000–3,000 |
| **Reranker (optional)** | Omit or CPU: ~$0 | 1× small GPU: ~$100–200 | ~$200–500 |
| **App + API** | 1× small VM: ~$20–50 | 2–3 VMs + LB: ~$100–200 | ~$200–400 |
| **Total** | **~$130–420/mo** | **~$1,000–2,000/mo** | **~$2,500–6,400/mo** |

- **Ingestion:** One-time or batched; cost is dominated by embedding compute. 1M docs with self-hosted e5: order of hours on a single GPU, not ongoing API spend.
- **Managed alternatives:** If you later use OpenAI for embeddings (~$0.02/1M tokens), 1M docs ≈ tens of dollars one-time; 100M docs can reach ~$2k. LLM APIs (GPT-4, etc.) can push total to **$50–100/day** at high query volume if unoptimized.

---

## 7. Architecture overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA SOURCES                                       │
│  Runbooks │ Jira (CSV/JSON/export) │ Infra docs │ Plugin docs │ Internal MD  │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  INGEST PIPELINE                                                             │
│  • Parsers (Markdown, HTML, Jira schema, code repos)                         │
│  • Chunking: semantic (docs) + AST (code, Tree-sitter)                       │
│  • Metadata: source, type, project, access_roles                             │
│  • Redaction (PII/creds) → Embedding model (e5/BGE) → Vector DB (Qdrant/…)   │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  VECTOR DB                    │  AUTH / RBAC                                │
│  Collections by type/project  │  User ↔ roles, projects                      │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  RAG SERVICE (API)                                                            │
│  Query → embed → vector search + metadata filter (RBAC) → rerank → LLM       │
│  Response + cited doc IDs/snippets                                            │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Web UI      │         │  Slack bot       │         │  VSCode / API   │
│   (primary)   │         │  (optional)     │         │  (optional)     │
└───────────────┘         └─────────────────┘         └─────────────────┘
```

- **Private:** Embedding model, vector DB, and LLM run in your VPC (or on-prem). No third-party RAG SaaS in the critical path.
- **Access:** Every query is bound to an authenticated user; vector search or post-retrieval filter enforces RBAC so only allowed runbooks/docs/code are used in the answer.

---

## 8. 60-day POC plan

| Phase | Week | Activities | Deliverables |
|-------|------|------------|--------------|
| **Setup** | 1–2 | Pick stack: Ollama or Python + e5/BGE; Qdrant or Chroma in Docker. Ingest 2–3 runbooks + one plugin’s README/code. | Running pipeline; vector DB with ~500–2k chunks. |
| **Chunking** | 2–3 | Implement semantic chunking for Markdown/runbooks; AST (Tree-sitter) for one repo (e.g. PHP plugin). Tag `type`, `source`, `project`. | Two ingest paths; metadata in vector DB. |
| **RAG API** | 3–4 | Query API: embed query → search → filter by test user/role → call local LLM (Ollama) → return answer + citations. | REST or GraphQL endpoint; curl-able. |
| **Auth** | 4–5 | Wire SSO (or mock roles); apply role/project filter in retrieval; audit log (query + doc IDs). | Only allowed docs appear in answers. |
| **Web UI** | 5–6 | Simple chat UI (e.g. Streamlit, React, or Vite + your API); show sources per message. | Demo-able “internal assistant”. |
| **Content** | 6–7 | Ingest Jira export (e.g. epic/issue summaries + links); infra doc set; 2–3 internal Markdown hubs. | Broader coverage; ~10k–50k chunks. |
| **Eval** | 7–8 | Define 30–50 test questions; measure retrieval (Recall@5, MRR) and answer quality (faithfulness, relevance). Tune chunk size/overlap and model if needed. | Eval report; decision to scale or iterate. |

**Success criteria for POC:** (1) Answers grounded in your runbooks/docs with citations. (2) No retrieval from docs the test user is not allowed to see. (3) Latency &lt; 5 s for typical query on single-node setup.

---

## 9. Evaluation metrics

| Category | Metrics | How to measure |
|----------|---------|----------------|
| **Retrieval** | **Recall@5**, **MRR** | For each test question, check if the gold doc(s) appear in top 5; compute recall and mean reciprocal rank. |
| **Faithfulness** | % of claims supported by retrieved chunks | LLM-as-judge or NLI model: “Does this passage support this claim?” — avoid hallucinations. |
| **Relevance** | Semantic match query ↔ answer | LLM-as-judge or embedding similarity (query vs answer). |
| **Citation** | Correctness of cited doc IDs | Whether cited chunks actually support the sentence they’re attached to. |
| **Safety / RBAC** | Leak rate | For each role, run queries that *should* not see certain docs; confirm those docs never appear in top-k or in citations. |

**Tools:** **Ragas** (reference-free), **DeepEval** (RAG metrics out of the box), or custom scripts with your test Q set. Track these weekly during POC and set targets (e.g. Recall@5 &gt; 0.85, zero RBAC leaks).

---

## 10. Summary and next steps

- **Embeddings:** e5-base or BGE-base for POC; self-host via Ollama or Sentence Transformers.
- **Vector DB:** Qdrant (Docker) for performance and simplicity; Chroma for quickest POC.
- **Chunking:** Semantic for runbooks/docs/Jira/Markdown; AST (Tree-sitter) for WordPress/Laravel code.
- **Security:** SSO + RBAC on retrieval; redact sensitive data at ingest; private VPC and audit logging.
- **Integrations:** Web UI first, then Slack; VSCode/API once stable.
- **Cost:** POC ~$130–420/mo; production small team ~$1k–2k/mo depending on LLM and scale.

**Next steps:** (1) Choose one runbook and one codebase as Day-1 sources. (2) Stand up vector DB + embedding model in Docker. (3) Implement ingest with semantic + AST chunking and RBAC metadata. (4) Build minimal RAG API and web UI and run a 30-question eval by end of Week 8.
