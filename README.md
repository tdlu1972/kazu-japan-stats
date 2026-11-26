# kazu-japan-stats

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/tdlu1972/kazu-japan-stats/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/tdlu1972/kazu-japan-stats/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Kazu is a national statistics site for Japan that runs offline from its own static files: headline figures, five topic pages, an indicator page for every series (range switch, chart or table, CSV download), a tile map, ranking and sortable table of the 47 prefectures with a profile and comparison for each, a data catalogue and a methods page. Plain ES modules and hand-drawn SVG charts, no framework, no network request.

## Run it

```sh
node serve.ts    # then open http://127.0.0.1:8080/
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts    # hand-in: app/, screenshots/ and dossier.json
```

The site lives in `app/`. `shots.mjs` retakes the screenshots listed in `shots.json` with Playwright (`PLAYWRIGHT=<path to playwright> node shots.mjs` while `serve.ts` runs). Figures are compiled from the Statistics Bureau of Japan, the Ministry of Health, Labour and Welfare, the Cabinet Office, the Ministry of Finance and the Japan National Tourism Organization, rounded for display.

---

<sub>Entered on [make.fun](https://make.fun/?ref=psm22q7h&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
