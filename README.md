# make-fun-gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/gransi981-crypto/make-fun-gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/gransi981-crypto/make-fun-gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Ledger** — the offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: the official list with names, descriptions and grades, a checklist saved in the browser with export and import, filters by kind, a spoiler-safe mode that hides hidden trophies until earned, a roadmap to the platinum, the one possibly missable trophy flagged, and a guide to each trophy in our own words with its sources named beside it. Built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty, $250 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. The guide is plain static files under `app/` — it works with the network off and loads nothing from outside itself.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library.

## What's inside

- `app/index.html`, `app/style.css`, `app/js/` — the guide: tracker, roadmap, missables and save pages.
- `app/data/trophies.json` — all 55 official trophies with their grades, kinds, hidden and missable flags, and a cited guide each.
- `screenshots/` — four real renders of the guide running in a browser.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.

---

<sub>Entered on [make.fun](https://make.fun/?ref=pab8n0ew&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
