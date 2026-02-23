# Research: Moving from AI Assistants to Semi-Autonomous Agents in DevOps (PHP-Based Systems)

This document summarizes research on agent architecture, risk controls, and a phased roadmap for introducing semi-autonomous agents into PHP-based DevOps workflows.

---

## 1. Agent Architecture Design

### High-Level Pattern: Context → Plan → Act (C-P-A)

Semi-autonomous agents in DevOps typically follow a **Context–Plan–Act** loop:

1. **Context**: Observe infrastructure via logs, metrics, runbooks, and pipeline state.
2. **Plan**: Reason over observations (e.g. ReAct-style Thought → Action → Observation cycles).
3. **Act**: Invoke tools (GitHub API, WP-CLI, Redis, queue drivers) with scoped permissions.

### ReAct-Based Orchestration

**ReAct (Reason + Act)** is the dominant pattern for multi-step diagnosis and remediation:

| Phase       | Description |
|------------|-------------|
| **Thought** | LLM reasons about next step (e.g. “Check failed job logs”). |
| **Action**  | Agent selects and invokes a tool (e.g. `wp queue list --status=failed`). |
| **Observation** | Tool output is fed back into context. |
| **Loop**    | Repeat until task complete or hard stop (max steps, budget, timeout). |

**Production constraints**:

- **Hard stop conditions**: Cap tool calls (e.g. max 10–15 per run) and total cost per incident.
- **Loop detection**: Avoid repeated calls to flaky endpoints (backoff or skip after N failures).
- **Observability**: Log full Thought/Action/Observation traces for audit and debugging.

### Pipeline-Native Placement

Agents work best as **first-class pipeline steps** (e.g. GitHub Actions jobs, GitLab CI jobs) so they:

- Inherit **secrets and permissions** from the pipeline (no ad-hoc credentials).
- Have **run context** (commit, branch, workflow run ID, artifact URLs).
- Produce **auditable outcomes** (job logs, artifacts, status badges).

### Components Relevant to PHP Systems

| Component        | Role |
|------------------|------|
| **Log preprocessor** | Filter CI/CD logs (keyword, tail, diff vs success run) before sending to LLM; keep token usage bounded. |
| **RAG knowledge base** | Index runbooks, past RCA reports, internal docs; retrieve for “similar past failure” and fix suggestions. |
| **Tool layer**        | Wrappers for: `wp` (WP-CLI), `composer`, `phpunit`, Redis/queue CLI, deployment scripts. Tools must be allowlisted and argument-validated. |
| **Orchestrator**      | Single agent (or coordinator) that chooses which specialist (CI, deploy, cache, queue) to invoke. |

---

## 2. Use-Case Designs

### 2.1 CI Failure Diagnosis Agents

**Goal**: On pipeline failure, automatically identify root cause and optionally suggest or apply fixes.

**Architecture (inspired by LogSage and GitLab Duo)**:

1. **Trigger**: Webhook or polling on failed GitHub Actions / GitLab CI run.
2. **Log preprocessing**:
   - Key-log filtering: keyword match (ERROR, FAIL, Exception), log-tail prioritization, **diff vs last successful run** (lines that appear only in failed run).
   - Expansion: include surrounding lines for context.
   - Token pruning: rank blocks by relevance, trim to model limit.
3. **RCA stage**: Structured prompt (role, chain-of-thought, few-shot, output schema) → LLM returns:
   - Key error lines.
   - Root cause summary.
   - Confidence or multi-hypothesis with evidence.
4. **Solution stage**:
   - RAG over historical fixes and runbooks.
   - LLM suggests concrete steps or patches; **tool-calling** for: re-run job, apply patch, run `composer install`, etc.
5. **Guardrails**: Remediation actions (especially code changes or re-runs that push state) behind **approval gates** (see Section 4).

**PHP-specific**: Feed `composer`, `phpunit`, PHPStan, and framework stack traces into preprocessing; RAG over PHP/WordPress/Laravel runbooks and past incidents.

### 2.2 Deployment Health Monitors

**Goal**: After deploy, verify that the app is healthy and that key flows work.

**Architecture**:

1. **Trigger**: Post-deploy webhook or pipeline step after “deploy” job.
2. **Agent (or deterministic script)**:
   - **Golden signals**: Latency (p50/p95/p99), error rate (4xx/5xx), throughput, saturation (CPU, memory, queue depth).
   - **Synthetic checks**: Hit critical endpoints (e.g. `/wp-json/`, health endpoint, login, one critical path).
   - **PHP app signals**: OPcache status, DB connectivity, Redis connectivity, queue worker liveness (e.g. Horizon).
3. **Output**: Pass/fail + short report (e.g. “Health check OK” or “/api/orders 5xx spike”). On fail, optionally trigger **rollback** or **alert** (both behind guardrails).

**PHP tooling**: Healthchecks.io (ping URLs from PHP cron), custom `/health` or `wp-cli` checks, APM agents (e.g. DX APM PHP agent) for runtime metrics.

### 2.3 Cache Invalidation Assistants

**Goal**: Recommend or execute safe cache invalidation (object cache, page cache, CDN) when content or config changes.

**Architecture**:

1. **Context**: Event (e.g. post publish, option update, deploy) + scope (site, path, tag).
2. **Agent**:
   - **Read-only first**: “Which keys/URLs are affected?” (e.g. list keys by pattern, or list URLs from sitemap).
   - **Recommend**: “Purge these patterns or URLs”; optionally estimate impact (e.g. “~50 keys”).
   - **Execute** (if allowed): Call tool `purge_cache` with **allowlisted** backends (Redis, CDN API, WP object cache flush for specific group).
3. **Guardrails**: Full flush (e.g. `FLUSHALL`) should be **gated** or blocked by policy; prefer selective purge by key/URL/tag.

**PHP/WordPress**: Hooks (`publish_post`, `updated_option`) → trigger agent or script; tools: `wp cache flush`, Redis `SCAN`+`DEL`, Cloudflare/API purge; plugins (e.g. The Cache Purger) as reference for events and backends.

### 2.4 Queue Retry Logic Advisors

**Goal**: Advise on retry strategy for failed jobs (Laravel queues, WordPress background jobs, etc.) and optionally apply safe retries.

**Architecture**:

1. **Context**: Failed job payload, exception message, attempt count, queue name, and (if available) similar historical failures from RAG.
2. **Agent**:
   - Classify failure (transient vs permanent, e.g. timeout vs validation error).
   - Suggest: “Retry with backoff”, “Move to DLQ”, “Fix payload and re-dispatch”, or “Do not retry”.
   - **Tool-calling**: `retry_job`, `release_job` (with delay), `move_to_dlq`; no direct access to job code or DB writes beyond queue driver.
3. **Guardrails**: Retry/release only for **idempotent-safe** queues by policy; cap max retries and rate; never auto-approve “reprocess all” without gate.

**PHP**: Laravel `$tries`, `$backoff`, `failed()`; Horizon config; WP Cron/Action Scheduler as queue analog—tools wrap existing CLI or API (e.g. `php artisan queue:retry` with job ID allowlisting).

### 2.5 Guardrails to Prevent Destructive Actions

See **Section 4** for a unified guardrail design that applies across all agents.

---

## 3. Risk Mitigation Controls

### 3.1 Trust and Gating Matrix

| Action type | Automation level | Example |
|-------------|------------------|--------|
| **Safe to automate** | Full | Read-only checks, log analysis, draft RCA, suggest patches, run linters/tests in CI. |
| **Human approval required** | Gate | Prod deploy, cache full flush, schema migrations, secret/ACL changes, “retry all” queue actions. |
| **Never automate** | Block | Direct prod secret access, prod deploy without approval, auth logic changes, unreviewed DB migrations. |

Decision factors: **impact surface** (blast radius), **observability** (can we detect and revert?), **agent reliability** (historical accuracy for this action type).

### 3.2 Action-Level Approvals

- **Execution-layer enforcement**: Approvals implemented where **tools run** (e.g. in pipeline or agent runtime), not only in prompt. Prevents “jailbreak” or rephrasing from bypassing.
- **Tool-centric rules**: Classify tools as safe / gated / blocked. Gated tools pause and emit an approval request (Slack, Teams, or API) with: action name, arguments (sanitized), run ID, commit.
- **Audit**: Record who approved, when, and payload hash to prevent replay and support compliance (SOC 2, etc.).

### 3.3 Multi-Layer Guardrails

| Layer | What to do |
|-------|-------------|
| **Pre-model** | Input sanitization, prompt injection detection, budget (max tokens, max tool calls). |
| **Mid-run** | Validate tool name and arguments against allowlist and schema; check permissions and scope (e.g. env = prod). |
| **Post-model** | Output schema validation, safety classifier (e.g. “contains destructive command?”). |
| **Post-action** | Audit log, alert on sensitive actions, optional rollback hooks. |

### 3.4 Deterministic Governance

- **Fail closed**: If a guardrail check fails, do not execute the action; preserve full context for on-call review.
- **Explicit block reasons**: Log why an action was blocked (e.g. “Tool `flush_all` is not allowed in production”).
- **Trace IDs**: Every agent run and tool call has a stable ID for correlation and debugging.

### 3.5 PHP-Specific Risks

- **WP-CLI / Artisan**: Restrict to read-only or allowlisted commands in prod (e.g. `wp option get` yes, `wp db query` no unless gated).
- **Composer**: In CI only; never let agent run `composer update` or change `composer.lock` in prod.
- **Cache/Queue**: Prefer selective purge and single-job retry over “flush all” or “retry all”.

---

## 4. Guardrails to Prevent Destructive Actions (Summary)

1. **Allowlist tools**: Only registered tools with typed arguments; block unknown tools.
2. **Environment and scope**: Prod vs staging; restrict destructive tools in prod or behind approval.
3. **Action-level approval**: For gated tools, require human approval with full context and audit.
4. **Budget and limits**: Max tool calls per run, max cost per incident, timeout.
5. **Policy-as-code**: Define safe/gated/blocked in versioned config (e.g. YAML) so policy travels with the app and can be reviewed in PRs.
6. **Observability**: Log reasoning and tool calls; alert on blocked actions and approval requests.

---

## 5. Phased Implementation Roadmap

### Phase 1: Read-Only and Shadow (Weeks 1–4)

- **CI diagnosis (shadow)**: On failure, run log preprocessing + RCA in a separate job; **do not** apply fixes. Publish RCA report as artifact or comment. Tune prompts and log filtering.
- **Deploy health (read-only)**: Post-deploy job that only **checks** health (HTTP, DB, Redis, queue) and fails the job if unhealthy; no rollback yet.
- **Cache/queue (advisory only)**: Agent suggests “purge these keys” or “retry this job”; human performs action manually.
- **Outcome**: No production writes from agents; validate accuracy and usefulness of suggestions.

### Phase 2: Low-Risk Automation (Weeks 5–8)

- **CI**: Automate **non-destructive** fixes in CI only: e.g. re-run failed job, `composer install`, run specific test. All in pipeline context; no direct prod access.
- **Deploy health**: Auto-rollback **only** if implemented as a separate, gated step (e.g. “rollback” requires approval or only in staging).
- **Cache**: Allow **selective** purge by key/URL/tag via allowlisted tool; full flush still gated.
- **Queue**: Allow **single-job retry** with backoff for allowlisted queues; “retry all” or DLQ moves require approval.
- **Guardrails**: Introduce tool allowlist and environment checks; start logging all tool calls.

### Phase 3: Gated High-Impact Actions (Weeks 9–12)

- **Approval gates**: For prod deploy, full cache flush, schema migrations, and bulk queue actions, require approval (Slack/Teams/API). Implement at execution layer.
- **Policy-as-code**: Move safe/gated/blocked definitions into repo (e.g. `.github/agent-policy.yaml`); review in PRs.
- **Audit**: Central audit log for approvals and blocked actions; trace IDs on every run.

### Phase 4: Optimize and Expand (Ongoing)

- **RAG**: Add more runbooks and historical RCAs; tune retrieval for PHP/WordPress/Laravel.
- **Specialist agents**: Split CI vs deploy vs cache vs queue if single orchestrator becomes a bottleneck.
- **Metrics**: Track time-to-resolution, approval rate, and false positive/negative for RCAs; refine prompts and tools.

---

## 6. References and Further Reading

- **LogSage**: End-to-end LLM-based CI/CD failure detection and remediation; log preprocessing, RCA, RAG, tool-calling (arXiv:2506.03691).
- **GitLab Duo**: AI-powered root cause analysis for CI/CD failures (GitLab blog).
- **Harness / Agentic AI in DevOps**: C-P-A framework, pipeline-native agents, knowledge graphs (Harness.io).
- **Autonomous Agents in the Developer Toolchain**: When to trust vs gate (dev-tools.cloud).
- **Action-Level Approvals for AI Guardrails**: Execution-layer approval, tool-centric boundaries, audit (e.g. Hoop, Claw EA).
- **ReAct and production considerations**: Loop limits, budget, observability (agent-patterns.readthedocs.io, Playbook Atlas).
- **PHP/WordPress**: Cache purging (The Cache Purger, Redis plugins), Healthchecks.io, Laravel queues and Horizon.
- **Phased rollout**: Shadow mode, progressive autonomy, human-in-the-loop (arXiv:2512.08769, Arun Baby deployment patterns).

---

## 7. Quick Reference: Agent vs Assistant

| Aspect | Assistant | Semi-autonomous agent |
|--------|-----------|------------------------|
| **Trigger** | Human asks | Event (failure, deploy, cron) |
| **Actions** | Suggests only | Suggests + can execute (within guardrails) |
| **Scope** | Single query | Multi-step (ReAct, tools) |
| **Guardrails** | Human decides | Allowlist, gates, policy-as-code |
| **Audit** | Optional | Required for tool calls and approvals |

This research gives you an architecture, risk controls, and a phased path to move from assistants to semi-autonomous agents while keeping destructive actions behind guardrails and human approval.
