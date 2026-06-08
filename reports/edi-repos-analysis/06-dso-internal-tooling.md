---
title: DSO internal tooling
description: Docker builds, security scanning, interview vault, and Terraform enablement scaffolds.
---

# DSO internal tooling

---

#### `dso-docker-build-python`

| Field | Detail |
|-------|--------|
| **Purpose** | Cross-platform Docker-based Python build pipeline — dependency detection, bandit, pip-audit, pytest, artifact zip |
| **Tech stack** | Docker (Python 3.13 slim), bash + PowerShell wrappers, pipx |
| **Organization** | `python_build.sh` / `.ps1`; `Dockerfile`; `codebase_examples/` |
| **Coding style** | Shell with `set -e`; security scans report-only (non-blocking) |
| **CI/testing** | Self-contained; example projects demonstrate pass/fail scenarios |
| **Advantages** | Multi-package-manager support; cross-platform; good example matrix |
| **Disadvantages** | Security findings don't fail builds; no SBOM |
| **WP/PHP transfer** | Same pattern as Composer-based build scripts for plugin ZIP packaging. Bandit/pip-audit ≈ PHPCS security sniffs + Composer audit. |

---

#### `dso-docker-security-scanning`

| Field | Detail |
|-------|--------|
| **Purpose** | Local security scanning wrapper — Trivy (images, Dockerfiles) + Kubescape (K8s manifests/Helm) |
| **Tech stack** | Python 3.6+, Docker, Trivy/Kubescape container images, Makefile |
| **Organization** | Single `docker_scans.py`; `examples/`; `scan_results/` |
| **CI/testing** | Makefile targets for local use only |
| **Advantages** | Covers images, tarballs, Dockerfiles, K8s manifests |
| **Disadvantages** | Mac untested; no CI integration |
| **WP/PHP transfer** | Container scan step ≈ WPScan or plugin vulnerability checks in release pipeline. |

---

#### `dso-interview-questions`

| Field | Detail |
|-------|--------|
| **Purpose** | Static "Interview Vault" — hierarchical DevSecOps/SRE topic browser |
| **Tech stack** | React 18, Vite 5, nginx (Docker), JSON content store |
| **Organization** | `public/vault.json`; `src/components/`; `create_vault.sh` |
| **CI/testing** | None; build via `vite build` |
| **Advantages** | Simple deploy; content-driven JSON; zero backend |
| **Disadvantages** | No search/filter UX; no auth; no tests |
| **WP/PHP transfer** | JSON content tree ≈ WP custom post type hierarchy or ACF repeater fields. |

---

#### `dso-ai-enablement-tf-aws`

| Field | Detail |
|-------|--------|
| **Purpose** | Scaffold for AWS Terraform AI agent — rules, hooks, skills under `.cursor/` |
| **Tech stack** | Cursor Agent config only; no `.tf` files in local clone |
| **Advantages** | Clear intended structure |
| **Disadvantages** | Empty implementation; shallow clone |
| **WP/PHP transfer** | `.cursor/rules/` with globs ≈ PHPCS/PHPStan rule sets scoped by directory |

---

#### `dso-ai-enablement-tf-azure`

| Field | Detail |
|-------|--------|
| **Purpose** | Intended Azure Terraform counterpart to `dso-ai-enablement-tf-aws` |
| **Status** | Empty — `.git` only in local clone |

---

#### `dso-common-code`

| Field | Detail |
|-------|--------|
| **Purpose** | Intended shared DSO utilities |
| **Status** | Empty — `.git` only in local clone |
| **WP/PHP transfer** | Would map to shared Composer package or mu-plugins |

---
