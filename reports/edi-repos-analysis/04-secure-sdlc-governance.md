---
title: Secure SDLC and agent governance
description: SSDLC agent pack, Cloud Buddy, data-engineering AI plan, and multi-agent curriculum.
---

# Secure SDLC and agent governance

---

#### `elixirr-secure-sdlc-agent-pack`

| Field | Detail |
|-------|--------|
| **Purpose** | Codifies Elixirr Secure SDLC into Cursor rules, skills, and shared markdown guidance for agent-assisted delivery |
| **Tech stack** | Markdown (`.md`, `.mdc`), Cursor agent configuration — no application runtime |
| **Organization** | `shared/` (16 SSDLC principle docs); `.cursor/rules/` (22 scoped rules); `.cursor/skills/` (20 review workflows) |
| **Coding style** | Policy-as-markdown; rules use globs for file-type scoping; traceability to SSDLC source enforced |
| **CI/testing** | N/A — content repo |
| **Advantages** | Comprehensive coverage (mobile, AI, data pipelines, IaC); explicit "do not add policy without SSDLC backing" |
| **Disadvantages** | No standalone commands yet; effectiveness depends on team adoption |
| **WP/PHP transfer** | `03-secure-coding.mdc` explicitly includes `**/*.php` in globs — secure coding guidance applies directly. Import into WP plugin/theme repos. |

---

#### `danske-bank-wp2-cloud-buddy-ai-agent`

| Field | Detail |
|-------|--------|
| **Purpose** | Danske Bank "Cloud Buddy" — enterprise AI agent platform for incident management, public cloud services, App2Cloud onboarding. Teams bot, RAG ingestion, Bedrock AgentCore |
| **Tech stack** | Python 3.11–3.12, LangGraph/Strands, AWS Bedrock AgentCore, MCP, boto3, Terraform, Microsoft Teams SDK, GitHub Actions, Docker/ECR |
| **Organization** | `ai-agents/` (runtimes, workflows, MCP tools, ingestion, Terraform); `teams-integration/`; domain split by workstream |
| **Coding style** | Pydantic settings, structured logging, pytest with live AWS integration tests |
| **CI/testing** | Per-workflow GitHub Actions (Ruff, pytest, Docker build/push, deploy) |
| **Advantages** | Production-grade agent architecture; MCP tools vs workflows separation; extensive operational runbooks |
| **Disadvantages** | High complexity; fragmented CI; outdated Terraform; client-specific credentials. Note: "wp2" is project name, not WordPress |
| **WP/PHP transfer** | MCP tools ≈ REST endpoints with permission callbacks. SSM parameter registry ≈ WP options/transients. Agent orchestration ≈ plugin hook lifecycle. |

---

#### `data-engineering-ai-plan`

| Field | Detail |
|-------|--------|
| **Purpose** | AI–human pipeline: meeting transcript → BRD → data model + tech spec → architecture. Deterministic Python ingest; LLM via Cursor Agent Skills |
| **Tech stack** | Python, Click CLI, Pydantic v2, PyYAML, python-docx, pytest (19 modules, fully offline) |
| **Organization** | `src/` (CLI, normalizers); `.cursor/skills/` (5 generation skills); `outputs/` (versioned artefacts); `tests/` |
| **Coding style** | Excellent docstrings; explicit maturity/version contracts; collision-safe batch naming; auditable artefact graph |
| **CI/testing** | No CI; pytest runs fully offline; refresh scripts for audit trails |
| **Advantages** | Best-in-set documentation; human-in-the-loop by design; deterministic ingest separated from non-deterministic generation |
| **Disadvantages** | Cursor-dependent for full value; Windows-centric setup docs |
| **WP/PHP transfer** | Tiered artefact graph ≈ content hierarchy. Version/maturity gates ≈ post status workflow. Normalizer CLI ≈ WP-CLI import commands. |

---

#### `data-enigneering-ai-enablement`

| Field | Detail |
|-------|--------|
| **Purpose** | Planned shared AI enablement library for data engineering — rules, skills, templates, platform overlays |
| **Tech stack** | Markdown/YAML documentation scaffold only |
| **Organization** | README describes intended `core/`, `platforms/`, `tools/`, `governance/` — none present locally |
| **Advantages** | Sound core-first, platform-overlay architecture |
| **Disadvantages** | Local clone is README-only; name typo reduces discoverability |
| **WP/PHP transfer** | Same pattern as shared mu-plugin or Composer package of coding standards with per-client overlays. |

---

#### `multi-agent-systems`

| Field | Detail |
|-------|--------|
| **Purpose** | Internal Elixirr Digital course on production multi-agent LLM systems (Modules 0–10) |
| **Tech stack** | Markdown/Obsidian vault; LangGraph, Google ADK, Microsoft Agent Framework (documented) |
| **Organization** | `Module N - Title/` folders; Obsidian wiki-links + Mermaid; Acme Corp worked example |
| **Coding style** | Documentation-first; no runnable sample apps |
| **CI/testing** | None; Module 8 covers agent testing patterns conceptually |
| **Advantages** | Comprehensive curriculum (observability, security, eval, deployment) |
| **Disadvantages** | No executable labs; LLM version references will age |
| **WP/PHP transfer** | Evaluation beyond pass/fail, guardrails, observability — applicable for WP AI plugins or content agents. |

---
