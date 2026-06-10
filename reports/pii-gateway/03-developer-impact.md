---
title: PII Gateway — Developer Impact
description: Day-to-day effect on dev work and AI outputs when the gateway is deployed.
---

# PII Gateway — Developer Impact

**Audience:** Engineering leads and developers. **Status:** Spec / working memory (dark-factory); not yet deployed.

---

## Unchanged

- Git commit, push, PR, human review, merge
- CI (PHPStan, Rector, PHPUnit) — no AI in CI
- Local run/debug without AI
- You still own and verify all AI-assisted output (AI Policy §7.5)

---

## What changes (when deployed)

### Cursor (Phase 0 — first visible impact)

- One-time setup: local proxy + Cursor base URL config
- Prompts/file context pass through gateway before provider
- **Blocked:** clear policy message (e.g. client URL, credentials)
- **Masked:** model sees placeholders, not raw emails/names

### PR review bot (when adopted — Phase 1+)

- Diffs scanned **before** the bot API call
- Clean refactors: **no difference**
- Diff contains secrets, `.env`, client URLs: check **fails** or bot **skipped** with explanation
- Bot comments never rehydrate redacted values on the VCS

---

## When you notice it

| Situation | What happens |
|-----------|----------------|
| Routine bugfix, no PII in diff | No change |
| Paste prod stack trace with client URL | Blocked — rephrase or use staging |
| `@` include `.env` | Hard block |
| Client plugin path on blocklist | Blocked in Cursor context; bot may skip if adopted later |
| False positive on class name | Report for allowlist tuning |

---

## Habits

1. Do not paste prod data into AI — use redacted logs or fixtures
2. Keep PR titles/descriptions/commits free of client identifiers
3. Run proxy when using Cursor (Phase 0)
4. Treat block messages as policy signal, not “AI broken”

**Onboarding (when live):** ~30 minutes.

---

## Output quality

| Artifact | Impact |
|----------|--------|
| Code you commit | None from gateway |
| AI-suggested code | Same on clean context; fewer leaked client strings |
| PR bot comments | Sanitised; less specific if diff was redacted |
| Generated tests | May use placeholders — use factories/fixtures |

**Trade-off:** slightly less context when the only fix would require feeding Personal Data to the model — which policy already forbids.

---

## Net effect

Most days: **neutral**. The gateway appears when you would have **violated policy anyway** — with a clear block instead of silent leakage.

---

**Related:** [Project index](/reports/pii-gateway/) · [Architecture spec](/reports/pii-gateway/01-architecture-spec) · [Management brief](/reports/pii-gateway/04-management-brief)
