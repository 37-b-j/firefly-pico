# Firefly-Pico Workflow Tracking

> **Maintainer (upstream):** https://github.com/cioraneanu/firefly-pico  
> **Origin (our fork):** https://github.com/37-b-j/firefly-pico  
> **Docker Opt Commit:** `2b2ff9e47f98cc39ec1c4afe88fe62079736637e`

---

## 1. Upstream Dev Commits (since upstream/main) — Opt-In

Commits on `upstream/dev` not yet in `upstream/main`. Each must be reviewed: ✓ opt-in (apply to integration), ✗ opt-out (skip).

| Hash | Description | Status | Reason |
|------|-------------|--------|--------|
| `c4529da` | make desktop left sidebar support collapsing | ✗ opt-out | not needed for personal |
| `f2d2ff9` | bump agents.md | ✗ opt-out | meta, no code change |
| `00c72cb` | bump agents.md | ✗ opt-out | meta, no code change |
| `27da9a8` | add dashboard animation on month change | ✗ opt-out | not needed for personal |
| `61154ee` | add a basic AGENTS.md file | ✗ opt-out | meta file |
| `1db804a` | improve transaction-template creation | ✗ opt-out | not needed for personal |
| `b823fa7` | fix app-select swipe down to dismiss | ✗ opt-out | not needed for personal |
| `b9dd3bf` | fix app-select swipe down to dimiss (duplicate) | ✗ opt-out | not needed for personal |
| `e277854` | animate dashboard controls enter-exit | ✗ opt-out | not needed for personal |
| `0c57406` | fix desktop load more on scroll transactions-list | ✗ opt-out | not needed for personal |
| `363c0c4` | Net amount for tag category cards (#298) | ✓ opt-in | explicitly requested |
| `c80ae59` | dashboard-todo-card default transaction filters + fix setup sync date | ✗ opt-out | not needed for personal |
| `67aa3ab` | Desktop improvements v3 (#291) | ✗ opt-out | not needed for personal |
| `bad2499` | add setting for new transactions time 00:00 | ✗ opt-out | not needed for personal |

---

## 2. Integration — Active Features (Opt-Out)

Features currently in `integration` branch. Remove from this list when merged/superseded.

| Feature | PR Commit | Status | Notes |
|---------|-----------|--------|-------|
| Hide profile button toggle | `b407e55` | ✅ active (PR submitted) | pr/hide-profile-button-v3 |
| Historical equity trend | `2f65b01` | ✅ active (PR submitted) | pr/historical-equity-final |

---

## 3. Personal Build

Built from `integration` + Docker optimization commit.

| Component | Commit |
|-----------|--------|
| Base | `integration` (HEAD) |
| Docker optimization | `2b2ff9e47f98cc39ec1c4afe88fe62079736637e` |

---

## 4. Cleanup Log

| Date | Action | Reason |
|------|--------|--------|
| 2026-07-08 | Created TRACKING.md | Initial workflow documentation |
| 2026-07-08 | Rebuilt integration from upstream/main | Only 363c0c4 opt-in + 2 PR features |
| 2026-07-08 | Deleted `integration-old` | Superseded |
| 2026-07-08 | Deleted `pr/hide-profile-button-v2` | Replaced by v3 |
