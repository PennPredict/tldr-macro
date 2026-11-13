# Themes report — 2026-11-11

## Verified indicators

| Theme | Indicator | Source | Frequency | License | Latest stored observation |
|---|---|---|---|---|---|
| Inflation & Fed | CPI monthly change | BLS | Monthly | Public official data | October 2026, released Nov. 10 |
| Inflation & Fed | Core CPI monthly change | BLS | Monthly | Public official data | October 2026, released Nov. 10 |
| Inflation & Fed | Brent oil fund (context only) | Nasdaq/USCF | Daily | Linked market display | Nov. 11 intraday |
| Equities & AI | S&P 500 fund (SPY) | Nasdaq/State Street | Daily | Linked market display | Nov. 11 intraday |
| Equities & AI | Nasdaq Composite | Nasdaq | Daily | Linked market display | Nov. 11 intraday |

All configured sources, frequencies, roles, thresholds, and licensing decisions are in `config/themes.json`. Only observations already supported by the claim ledger or an official release are stored in `data/themes/state.json`.

## Hidden indicators and coverage gaps

- Federal funds target: configured, but no verified observation series was imported in this build.
- Unemployment, payrolls, retail sales, GDP, and jobless claims: configured; current observations were not added without release-table values.
- 10-year Treasury, mortgage rate, and 10Y–2Y spread: configured; withheld pending correctly dated official observations.
- VIX and dollar/euro: configured as context; withheld pending a licensed, date-valid series.
- Breadth proxy and consumer confidence: omitted because a licensed, reproducible series was not established.
- Growth & Consumers and Global & Geopolitics currently rely on dated developments, not indicator readouts.
- Bonds & Credit shows the Veterans Day closure and next catalyst; no proxy is presented as a cash yield.

## Calendar completeness

- CPI: Dec. 10, 2026, 8:30 AM ET — BLS.
- Retail sales: Nov. 17, 2026, 8:30 AM ET — Census.
- Federal Reserve minutes: Nov. 18, 2026, 2:00 PM ET — Federal Reserve.
- Jobs report: Dec. 4, 2026, 8:30 AM ET — BLS.
- Producer prices: Nov. 13, 2026, 8:30 AM ET — BLS.

## State behavior

Developments are retained for 90 days and the UI renders at most four rows from the latest 30 days. Slow series retain their release dates. Missing blocks are omitted instead of replaced with filler.

## Word-count target by band

| Band | Collapsed target |
|---|---:|
| Hero | 30 words |
| Where Things Stand | 190 words |
| Today | 150 words |
| Connections | 35 words |
| Markets | 90 words |
| Next | 90 words |
| Bottom Line | 40 words |

The verified production build contains 463 visible prose words. `reports/prose-budget.json` lists the 12 indicator fields omitted because no current verified observation was stored.

## Screenshots

`reports/themes-before-{1440,1280,768,375}.png` captures the current live section. Matching `themes-{heavy,quiet,holiday}-after-{width}.png` files capture all three state fixtures after the redesign.
