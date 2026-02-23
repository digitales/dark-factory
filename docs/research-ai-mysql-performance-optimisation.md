# Research: AI-Assisted MySQL/MariaDB Performance Optimisation for WordPress and Laravel

**Focus areas:** Slow query log analysis, index recommendations, query refactoring, cache layer tuning, partitioning strategies.

**Deliverables:** (1) Techniques for feeding DB schema into LLMs, (2) Risk analysis, (3) Tool comparison, (4) Safe experimentation framework, (5) Performance measurement approach.

---

## 1. Techniques for Feeding DB Schema into LLMs

### 1.1 What to Extract and How

| Source | What to extract | How (MySQL/MariaDB) |
|--------|-----------------|---------------------|
| **Schema** | Tables, columns, types, keys, FKs | `INFORMATION_SCHEMA.COLUMNS`, `TABLES`, `KEY_COLUMN_USAGE`, `STATISTICS` |
| **Execution context** | Plan, cost, row estimates | `EXPLAIN FORMAT=JSON` or `EXPLAIN ANALYZE` (MySQL 8.0+) |
| **Slow queries** | SQL, duration, rows examined | Slow query log, Query Monitor (WP), Telescope (Laravel), `performance_schema` |
| **Indexes** | Existing indexes, cardinality | `SHOW INDEX FROM table` or `INFORMATION_SCHEMA.STATISTICS` |

### 1.2 Recommended Context Formats

- **Schema → LLM:** DDL or a compact text summary: table name, column list, primary/unique keys, foreign keys, and (if needed) sample row counts. Avoid dumping full `CREATE TABLE` with engine/options unless tuning storage.
- **Execution plans → LLM:** Prefer **EXPLAIN FORMAT=JSON** (and **EXPLAIN ANALYZE** where available). JSON is machine-readable and gives cost, access type, key usage, and row estimates in a structure LLMs handle well.
- **Slow query payload:** For each slow query, provide: (1) SQL (normalised/redacted if needed), (2) duration and rows examined, (3) EXPLAIN JSON, (4) table names involved so the model can tie back to schema.

### 1.3 Implementation Options

- **Manual pipeline:** Script that queries `INFORMATION_SCHEMA` + slow log/export, runs `EXPLAIN` for each query, and builds a single markdown or JSON “pack” to paste into an LLM.
- **Vanna (vanna.ai):** Train on your MySQL schema (and optionally sample queries); use for Text-to-SQL and schema-aware Q&A. Supports MySQL and can feed schema + questions into an LLM.
- **LlamaIndex:** Use SQL/structured-data workflows to load schema and query results, then send structured context to an LLM for analysis or index suggestions.
- **Custom RAG:** Index schema metadata (and optionally EXPLAIN outputs) in a vector store; retrieve relevant tables/plans when asking “suggest indexes for this query.”

### 1.4 Scope Control

- **WordPress:** Restrict schema export to `wp_*` tables (and known plugin tables) to keep context small and relevant.
- **Laravel:** Export only tables used by the app (e.g. from migrations or a DB list). Include `schema_migrations` for context if useful.
- **Token budget:** Summarise large schemas (e.g. “table X: columns A,B,C; PK on A; index on B”) and send full DDL only for tables referenced in the slow queries you’re optimising.

---

## 2. Risk Analysis: Hallucinated Indexes, Unsafe Changes

### 2.1 Hallucination and Incorrectness

- **Plausible but wrong indexes:** LLMs can suggest indexes that don’t match the actual query (wrong column order, wrong table, or redundant with existing indexes).
- **Invalid or unsupported syntax:** Generated `CREATE INDEX` or `ALTER TABLE` might use dialect-specific or deprecated syntax (e.g. fulltext vs B-tree, index hints).
- **Over-indexing:** Suggesting many indexes that help a few queries but hurt write throughput and storage.
- **Wrong partitioning strategy:** Suggesting partitioning when the main gain would come from indexing or query rewrite, or choosing poor partition keys.

### 2.2 Safety Risks

- **Destructive or blocking changes:** `ALTER TABLE` that locks tables, drops indexes still in use, or changes column types and breaks application code.
- **No rollback plan:** Applying changes without a way to revert (backup, invisible index, or staged rollout).
- **Cache/config recommendations:** Suggesting changes to `innodb_buffer_pool_size` or other globals without considering total RAM and other processes.

### 2.3 Mitigation Strategies

| Risk | Mitigation |
|------|------------|
| Hallucinated indexes | Never apply index suggestions without validating: run `EXPLAIN` before/after (or on a copy), compare row/cost estimates; prefer tools that use DB feedback (e.g. HeatWave Autopilot). |
| Invalid SQL | Validate every generated DDL (syntax check, dry-run where supported, apply on a clone first). |
| Over-indexing | Use “Index-Guided Major Voting” or similar: only adopt suggestions that appear in multiple analyses or that show clear EXPLAIN improvement. |
| Destructive changes | Use branching/workflow (e.g. PlanetScale-style), staging DB, or pt-online-schema-change with pre-checks; make indexes invisible before DROP. |
| Config tuning | Treat as advisory only; test on staging with realistic load; monitor buffer pool hit ratio and other metrics. |

### 2.4 Principle

**Treat every AI suggestion as a hypothesis.** Validate with real execution plans, staging, and measurable performance criteria before production.

---

## 3. Tool Comparison

### 3.1 AI-Oriented / LLM-Based

| Tool / Approach | Scope | Strengths | Limitations |
|-----------------|--------|-----------|-------------|
| **Google Cloud SQL (Gemini Cloud Assist)** | Slow query troubleshooting | Built-in anomaly detection, recommendations, 24h baseline | Cloud SQL only; enterprise config limits; preview state |
| **MariaDB AI (Copilot / MCP)** | Tuning, debugging, NL queries | Native integration, DBA/Dev Copilot, MCP for AI tooling | MariaDB ecosystem |
| **Vanna.AI** | Text-to-SQL, schema Q&A | Trains on your schema, MySQL support, vector-backed context | General SQL generation; index advice requires explicit prompting and validation |
| **LlamaIndex (+ MySQL)** | Custom RAG / workflows | Flexible schema + query context, multiple LLM backends | You build the pipeline and safeguards |
| **Aiven AI Database Optimiser** | Always-on tuning | Continuous monitoring, index/slow-query recommendations, free tier for Postgres/MySQL | SaaS; dependency on Aiven |
| **D-Bot / RCRank (research)** | Root-cause ranking, diagnosis | Multimodal (query + plan + logs), prioritises causes | Academic; not off-the-shelf products |

### 3.2 Traditional / Non-LLM (Validation and Baseline)

| Tool | Use case | Notes |
|------|----------|--------|
| **MySQL HeatWave Autopilot Indexing** | Index recommendations with impact analysis | Review UI, estimated speedup/storage; apply with confirmation; invisible index for safe DROP. |
| **pt-query-digest / Percona Toolkit** | Slow query log analysis | Aggregate and rank slow queries; feed output + EXPLAIN to LLM. |
| **MySQL PERFORMANCE_SCHEMA / Sys schema** | Live metrics, wait events | Data for tuning and for validating AI-suggested changes. |
| **Query Monitor (WordPress)** | Per-request queries, callers | Export/copy slow queries and stack traces for LLM context. |
| **Laravel Telescope + Enlightn** | Slow and N+1 query detection | Identify queries and code paths; export for analysis. |

### 3.3 Fit by Stack

- **WordPress:** Query Monitor + slow query log (or VIP slow logs) → extract schema (e.g. `wp_*`) + EXPLAIN → LLM or Vanna. Use traditional DB tools to validate.
- **Laravel:** Telescope/Enlightn + slow query log → schema from migrations or DB → same pipeline. Consider Aiven or MariaDB AI if already on those platforms.

---

## 4. Safe Experimentation Framework

### 4.1 Principles

- **No direct production changes from AI output.** All schema/index changes go through a pipeline that includes validation and staging.
- **Backward compatibility:** Prefer additive changes (new indexes, new columns with defaults). For drops, use invisible index first, then drop after validation.
- **Isolated testing:** Use a clone or staging DB with realistic data volume and load (e.g. anonymised copy, or production-like dataset).

### 4.2 Pipeline (High Level)

1. **Capture:** Slow query log + schema (and optionally EXPLAIN for top N queries).
2. **Generate:** LLM or AI tool suggests indexes, query rewrites, or config changes.
3. **Validate:**  
   - Syntax-check DDL; run on a **staging/clone** only.  
   - Run EXPLAIN (and EXPLAIN ANALYZE if available) before/after for affected queries.  
   - Run a small benchmark (e.g. mysqlslap, SysBench, or app-level tests) and compare metrics.
4. **Stage:** Apply to staging; run integration and performance tests; monitor for regressions.
5. **Release:** Apply to production via safe migration (e.g. pt-osc, gh-ost, or managed DB deploy requests) with rollback plan.
6. **Observe:** Monitor slow query log, latency, and throughput; revert (e.g. make index visible again or drop new index) if metrics regress.

### 4.3 Environment Progression

- **Local / dev** → **Staging / UAT** → **Production.**  
- Use schema fingerprinting or migration checks to keep staging and production in sync before applying changes.
- For high-risk changes, use a **canary** (e.g. one app instance or read replica) before full rollout.

### 4.4 Rollback

- **New indexes:** Drop index if write load or storage is worse and no query benefit is seen.
- **Dropped indexes:** Use “invisible index” so drop is reversible; after a period, make visible again if needed, else complete the drop.
- **Config:** Revert to previous values; document and version config changes.

---

## 5. Performance Measurement Approach

### 5.1 What to Measure

- **Query-level:** Duration, rows examined, rows returned, lock time (from slow log or `performance_schema`).
- **System-level:** CPU, IO, QPS, buffer pool hit ratio (InnoDB), connection count.
- **Application-level:** End-to-end response time, time-to-first-byte, error rate (e.g. Server-Timing in WordPress, APM in Laravel).

### 5.2 Baseline and Comparison

- **Baseline:** Capture metrics (e.g. P95/P99 query time, QPS, buffer hit ratio) before any change. Use the same workload (recorded or synthetic).
- **Consistency:** Same hardware/OS, same dataset size, same config except the change under test. Run multiple iterations (e.g. 20–100 requests per scenario) to account for variance.
- **Locally:** Prefer local or staging benchmarks to avoid production noise; use production-like data and config where possible.

### 5.3 Tools and Practices

- **MySQL:** Slow query log with threshold (e.g. 1s); `EXPLAIN ANALYZE`; `performance_schema` and `sys` schema; mysqlslap, SysBench, or DBT2 for load.
- **WordPress:** Query Monitor for per-request analysis; Server-Timing and performance handbook practices; WP-CLI or custom scripts for repeated runs.
- **Laravel:** Telescope for slow queries; Enlightn analyzers; replay or scripted requests for benchmarks.
- **Extended tests:** For tuning (e.g. buffer pool, cache), run sustained load (e.g. Locust) for hours or days to capture cache and IO behaviour.

### 5.4 Success Criteria for an AI-Suggested Change

- **Index / query change:** Measurable improvement in latency or rows examined for the targeted query(s), without material regression in other queries or write throughput.
- **Cache/config:** Improved buffer hit ratio or throughput under load, with no OOM or instability.
- **Partitioning:** Improved query latency and/or maintenance time (e.g. backup, purge), validated on a copy with representative data size.

---

## Summary

- **Feeding schema into LLMs:** Use `INFORMATION_SCHEMA` (and optionally DDL), EXPLAIN in JSON, and slow query excerpts; keep scope small (relevant tables only) and use Vanna/LlamaIndex or a custom script for context.
- **Risks:** Hallucinated or suboptimal indexes, invalid DDL, over-indexing, destructive changes. Mitigate by validating with EXPLAIN, staging, invisible index for drops, and never applying AI output blindly.
- **Tools:** Mix of cloud/AI (Google Cloud Assist, MariaDB AI, Vanna, Aiven) and traditional (pt-query-digest, HeatWave Autopilot, Query Monitor, Telescope); choose by stack and where your data lives.
- **Safe experimentation:** Clone/staging → validate DDL and EXPLAIN → benchmark → staged rollout with rollback (invisible index, config revert).
- **Measurement:** Define baselines, use consistent workload and multiple runs, and tie success to query and system metrics (latency, rows examined, buffer hit ratio, QPS) before and after each change.

Using this structure, you can integrate AI-assisted analysis into your MySQL/MariaDB workflow for WordPress and Laravel while keeping changes safe, measurable, and reversible.
