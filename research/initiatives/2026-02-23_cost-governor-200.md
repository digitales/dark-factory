---

# Cost Governor: £200/month Hard Ceiling

*Assumptions: 5–8 engineers, 1 pilot repo, Cursor may be pre-existing. £200 = total recurring AI spend for this initiative (pipeline tools).*

---

## 1. Budget Constraint

- **Monthly ceiling:** **£200** (hard; no approval for overage).
- **One-off acceptable setup cost:** Up to 3–5 engineering days (CI + Bionic config + policy). No new infra spend; Bionic OSS or free tier only.

---

## 2. Primary Cost Drivers

- **Cursor (or Copilot) subscription** — per seat; if inside £200, limits how many seats or whether Copilot can be added.
- **Cursor/Copilot overage** — usage beyond subscription quota; drives variable API cost.
- **PR review bot (SaaS)** — e.g. CodeRabbit: per repo or per seat; at £200 ceiling, **not allowed** (use Bionic only).
- **Token/request volume** — Cursor/Copilot: more prompts, larger context, or premium models increase spend.
- **Indexing** — continuous or large-codebase indexing in Cursor can increase usage; at £200, **no** paid indexing services; local/index only.

---

## 3. Cost Estimate (Rough) — £200 Ceiling

| Scenario | Monthly range | Assumptions |
|----------|----------------|-------------|
| **Low** | **£0–£80** | Cursor pre-existing (outside £200); Bionic OSS self-hosted or free tier; no Copilot; no overage. £200 is headroom. |
| **Expected** | **£80–£180** | Cursor inside £200 (e.g. 5 seats ≈ £80–120); Bionic only (free/OSS); no CodeRabbit; no Copilot; Cursor usage within subscription (no overage). |
| **Worst-case** | **£200** (cap) | Cursor + Bionic hosted (if any small fee) + light overage or 1–2 Copilot seats; **controls below** keep at or under £200. |

**Worst-case above £200 if uncontrolled:** Cursor + CodeRabbit + Copilot + overage → £300–500+. **Therefore:** CodeRabbit and Copilot are **excluded** at £200; Bionic only; Cursor usage capped.

---

## 4. Cost Controls (Concrete)

### Rate limits

| Control | Default | Notes |
|---------|---------|--------|
| **PR bot (Bionic)** | **15 PRs per repo per week** | If Bionic has usage limits or paid tier, cap PRs reviewed per week so cost is predictable (or £0 if free/self-hosted). |
| **Cursor: "heavy" requests** | **25 per user per week** | "Heavy" = refactor, test gen, doc draft (multi-turn or large context). Completion and short explain don't count. Policy, not tool-enforced unless Cursor supports it. |
| **Cursor: doc/test generation** | **20 per team per month** | Ad-hoc doc or test drafts; prevents runaway usage. |
| **No Copilot** | **0 seats** | At £200, do not add Copilot; Cursor only. |

### Context caps

| Control | Default | Notes |
|---------|---------|--------|
| **PR bot context** | **30k tokens per PR** | Diff + minimal context only; no full repo. Configure Bionic (or equivalent) to limit context window. |
| **Cursor: single request** | **No file > 500 lines**; **no paste > 8k characters** | .cursorrules + training: avoid "review entire repo" or huge paste; selection/snippet only for large files. |
| **Cursor: no background index** | **No paid / cloud index** | Local index only; no continuous full-repo sync to external AI. |

### Model tier selection

| Tool | Tier | Notes |
|------|------|--------|
| **Cursor** | **Default / included model only** | Do not switch to premium or higher-cost model in settings. Use plan's default to avoid overage. |
| **PR bot (Bionic)** | **Most economical** | If Bionic offers model choice, use lowest-cost option that still gives useful review. |
| **No GPT-4 / Claude premium in pipeline** | N/A | Any "heavy" use stays on default Cursor model; no separate API calls to premium models for PR/test/doc. |

### Caching strategy

| Where | Rule |
|-------|------|
| **PR bot** | Cache by **diff hash** (if supported). Same diff = no new API call. Re-review only on new commits. |
| **Cursor** | Rely on **local/conversation cache**; do not re-send same file repeatedly in one session. |
| **CI** | **No AI in CI**; nothing to cache for AI. PHPStan/Rector are deterministic, no per-request cost. |

### CI enforcement limits

| Rule | Enforcement |
|------|-------------|
| **No AI calls in GitHub Actions** | **Code review**: no step in `.github/workflows/*` may call OpenAI, Anthropic, or other AI APIs. Grep in PR for `openai`, `anthropic`, `api.openai`, etc. |
| **No new paid triggers** | No workflow step that would incur per-run AI cost (e.g. "summarise PR" job calling an API). CI runs only PHPStan, Rector, PHPUnit. |
| **Branch protection** | No status check that depends on an external AI service; merge depends only on CI (PHPStan, Rector, tests) + human review. |

*At £200 there is no AI in CI to limit; the enforcement is "keep it that way."*

---

## 5. Cheaper Alternatives (Within Initiative)

| If over £200 | Change |
|--------------|--------|
| **PR bot is paid** | Use **Bionic OSS self-hosted** (or free tier only). Uninstall any paid PR bot. |
| **Cursor overage** | Reduce "heavy" request limit (e.g. 15/user/week); enforce "no full-file paste"; add .cursorrules to prefer small selection. |
| **Multiple repos** | **1 repo only** for PR bot and pilot; no AI PR review on other repos until budget allows. |
| **Copilot in use** | **Remove Copilot**; Cursor only. |
| **Cursor seats > 5** | Cap at **5 seats** for pilot (or whatever fits in £200 with no overage). |

---

## 6. Monitoring & Alerts

| Metric | How | Alert threshold |
|--------|-----|-----------------|
| **Monthly spend per tool** | Billing (Cursor); Bionic dashboard if applicable. | **Projected > £180** for the month → alert owner. |
| **Cursor usage vs plan** | Cursor dashboard (if available) or self-track "heavy" requests. | **Approaching plan limit** (e.g. 80% of quota) → remind team of rate limits. |
| **PR bot calls** | Count PRs with bot comment per week. | Optional; no cost alert unless Bionic is paid. |
| **Weekly review** | **Owner:** named person. **Cadence:** every Monday. **Action:** Log spend to date; if trend > £200, apply cheaper alternatives (section 5). |

---

## 7. Minimal Redesign to Fit £200

If the original design (Option B, CodeRabbit, Copilot) would exceed £200:

1. **PR review:** **Bionic only** (OSS or free tier). No CodeRabbit or other SaaS PR bot.
2. **IDE:** **Cursor only**; no Copilot. Cursor seats capped to fit within £200 (e.g. 5 seats).
3. **Scope:** **1 pilot repo** for PR bot; no AI PR review on other repos.
4. **Workflows:** **No dedicated** doc-generation or test-generation runs that use extra API; ad-hoc Cursor only, within rate limits.
5. **CI:** **No AI in CI** (already the case); no change.
6. **Model:** Cursor default model only; no premium; no separate API calls for PR/test/doc.

This is **Option A + strict caps**: CI (PHPStan, Rector, tests) + Bionic (free/OSS) + Cursor (capped seats and usage). No CodeRabbit, no Copilot, no overage.

---

## 8. Recommendation

- **Fits with controls:** **Yes**, if:
  - Bionic only (no CodeRabbit).
  - Cursor only (no Copilot); Cursor within subscription (no overage) or Cursor cost + Bionic ≤ £200.
  - Rate limits (PR bot 15/repo/week; Cursor 25 heavy/user/week, 20 doc+test team/month).
  - Context caps (PR bot 30k tokens; Cursor no huge paste, no paid index).
  - CI unchanged (no AI); enforcement by review.
- **Does not fit:** If Cursor + CodeRabbit + Copilot or uncapped usage are required; then **minimal redesign** (section 7) applies so recurring stays ≤ £200.

**Recommendation:** **Fits budget at £200** with Bionic-only PR review, Cursor-only IDE use, and the concrete controls above. Assign a single owner for weekly spend check and enforce rate/context caps from day one.
