# TL;DR Macro copy review

Edition: October 7, 2026, 10:58 AM ET
Status: local review only; not published

## Changed strings

| Location | Final copy |
|---|---|
| Snapshot subtitle | Morning readings. |
| Snapshot label | Significance |
| One-liner | Stocks fell early, government borrowing rates rose, and oil jumped. |
| Top Story 1 | Stocks fall from a record |
| Top Story 2 | Borrowing rates rise |
| Top Story 3 | Oil jumps |
| Top Story 4 | Fed minutes arrive |
| Secondary section | TL;DR Global |
| Calendar section | Next on TL;DRM |
| Mission popover | Mission: Low-cortisol explanations. Limits: Not investment advice; concision reduces nuance. |
| Footer logo label | Back to top |

Headline specifics now begin each price story: the asset, move versus the prior close, level, and timing. Headline metadata records the data field, bucket, and rule.

## Channel lines for approval

| Instrument | Channel line | Source |
|---|---|---|
| S&P 500 | Retirement funds use broad stock indexes to track large U.S. companies, so the move can affect account balances. | https://www.spglobal.com/spdji/en/indices/equity/sp-500/ |
| Nasdaq | Investors use the Nasdaq to track many technology companies, so the move can affect growth-heavy portfolios. | https://www.nasdaq.com/market-activity/index/comp |
| Dow | Investors use the Dow to track 30 large U.S. companies, so the move can show how established firms are trading. | https://www.spglobal.com/spdji/en/indices/equity/dow-jones-industrial-average/ |
| Russell 2000 | Investors use the Russell 2000 to track smaller U.S. companies, so it can reflect domestic credit and demand conditions. | https://www.lseg.com/en/ftse-russell/indices/russell-us |
| 10-year yield | Lenders use the 10-year yield as a reference for mortgages and business loans, so it can influence borrowing costs. | https://fred.stlouisfed.org/series/DGS10 |
| 2-year yield | Markets use the 2-year yield to gauge near-term Fed policy, so it can influence short-term financing costs. | https://fred.stlouisfed.org/series/DGS2 |
| Yield spread | Banks compare long and short rates when pricing credit, so the yield spread can affect lending incentives. | https://fred.stlouisfed.org/series/T10Y2Y |
| 30-year mortgage rate | Home buyers use mortgage rates to estimate monthly payments, so changes can affect housing affordability. | https://fred.stlouisfed.org/series/MORTGAGE30US |
| Brent | Oil costs feed into gasoline, shipping, and airfares, so changes can reach household budgets. | https://www.eia.gov/energyexplained/oil-and-petroleum-products/prices-and-outlook.php |
| WTI | U.S. fuel markets use WTI as a crude benchmark, so changes can reach gasoline and freight costs. | https://www.eia.gov/dnav/pet/pet_pri_spt_s1_d.htm |
| Natural gas | Utilities and factories buy natural gas for heat and power, so price changes can reach energy bills and production costs. | https://www.eia.gov/energyexplained/natural-gas/prices.php |
| Copper | Builders and manufacturers use copper in grids, vehicles, and electronics, so its price can affect project costs. | https://fred.stlouisfed.org/series/PCOPPUSDM |
| Dollar index | Businesses use the dollar to settle global trade, so its value can affect import costs and overseas earnings. | https://fred.stlouisfed.org/series/DTWEXBGS |
| Euro/dollar | Travelers and companies convert euros and dollars, so the rate can affect trips, imports, and translated earnings. | https://fred.stlouisfed.org/series/DEXUSEU |
| Dollar/yen | Companies trade cars, electronics, and capital between the U.S. and Japan, so the rate can affect prices and overseas earnings. | https://fred.stlouisfed.org/series/DEXJPUS |
| Gold | Investors use gold as a store of value, so its price can affect commodity holdings and jewelry costs. | https://fred.stlouisfed.org/series/GOLDAMGBD228NLBM |
| VIX | Options markets use the VIX to summarize expected stock swings, so it can affect hedging costs. | https://www.cboe.com/tradable-products/vix/ |
| DAX | Investors use the DAX to track major German companies, so it can reflect European manufacturing and export demand. | https://live.deutsche-boerse.com/indices/dax |
| Nikkei 225 | Investors use the Nikkei to track major Japanese companies, so it can reflect Asian technology and export demand. | https://indexes.nikkei.co.jp/en/nkave/index/profile |
| KOSPI | Investors use the KOSPI to track South Korean companies, so it can reflect chip demand and global manufacturing. | https://global.krx.co.kr/ |
| Pound/dollar | Travelers and companies convert pounds and dollars, so the rate can affect trips, imports, and translated earnings. | https://fred.stlouisfed.org/series/DEXUSUK |

## Snapshot significance composition

| Card | Channel | Context | Evidence |
|---|---|---|---|
| S&P 500 | sp500 | Signal: broad gauge of large U.S. stocks | S&P DJI |
| 10-year yield | yield10 | Signal: growth and inflation expectations | FRED DGS10 |
| Brent | brent | AP attributed same-day supply context | AP, Oct. 7 |
| Nasdaq | nasdaq | Signal: technology and growth shares | Nasdaq |
| Dow | dow | Signal: large established companies | S&P DJI |
| VIX futures | vix | Signal: expected market volatility | Cboe |

Every visible More Markets card resolves to a reviewed channel line and signal line in `config/channel-lines.json`. The validator fails on missing channel IDs, more than 40 words, banned connectors, or attributed context without a source URL.

## One-liner uniqueness

- Winner: “Stocks fell early, government borrowing rates rose, and oil jumped.”
- Template: `three-market-plain`
- Lead: stocks
- Retries: 0
- Recent edit-distance and token-set scores: recorded in `reports/build-report.json`; no previous-day entry existed after same-date replacement.
- History: `data/oneliner_history.json`, capped by policy at 60 days.

## Visual quality gate

| Story | Result | Notes |
|---|---|---|
| Stocks | Omitted | Single-stat tile; no added relationship or reference value |
| Borrowing rates | Passed; human check | Three sourced nodes; reference values; low copy similarity; one-way arrows labeled “can influence” |
| Oil | Passed | Four-node supply chain; sourced one-way transmission arrows |
| Fed minutes | Omitted | Single-stat tile; fewer than three nodes |

Reference series:

| Series | Source | Frequency | Latest | Prior |
|---|---|---|---|---|
| 10-year Treasury yield | U.S. Treasury | Intraday reading | Oct. 7: 5.35% | 5.27% |
| 30-year fixed mortgage rate | Freddie Mac via FRED | Weekly | Oct. 1: 7.28% | Sept. 24: 7.03% |
| ICE BofA AAA U.S. Corporate Index Effective Yield | ICE Data Indices via FRED | Daily close | Oct. 1: 5.81% | Sept. 30: 5.83% |

## TL;DR Global

| Item | Sources | Review |
|---|---|---|
| Iran conflict disrupts oil supply | AP; EIA | Developing; human check |
| IMF urges faster debt action | AP; IMF | Policy; human check |
| Global stocks fall | Deutsche Börse; Korea Exchange | Official market data |
| Worthington Steel reports results | SEC; AP | One permitted company item |

## Headline gates

The report includes ten generated samples: flat, big up, big down, near record, streak, mixed, rates up, cooling jobs, a company deal, and an ongoing conflict. It also records rejections for “Stocks stay strong,” “Oil jumps on war fears,” “S&P 500 falls 0.5%,” and a streak headline without a streak flag.

## Acceptance evidence

- `reports/acceptance-snapshot-more-{375,1280}.png`
- `reports/acceptance-yield-tree-{375,1280}.png`
- `reports/acceptance-no-visual-{375,1280}.png`
- `reports/acceptance-view-open-{375,1280}.png`
- `reports/acceptance-global-{375,1280}.png`
- `reports/acceptance-next-{375,1280}.png`
- `reports/acceptance-mission-{375,1280}.png`
- `reports/acceptance-footer-before-{375,1280}.png`
- `reports/acceptance-footer-after-{375,1280}.png`

Validation commands: `npm run validate:content`, `npm run lint`, `npm run build`, and `node scripts/test-acceptance.mjs`.
