# TL;DR Macro copy review

Edition reviewed: October 6, 2026  
Scope: copy only, plus the requested claim-ledger and copy-validation gates  
Status: local review only; not published

## Changed strings

| Location | Before | After | Type | Evidence | Reason |
|---|---|---|---|---|---|
| Snapshot subtitle | Opening-market observations. | Morning readings. | fact | `updated_at` is 90 minutes after the 9:30 AM ET open | Match timestamp rule |
| Snapshot baseline labels | vs. prior observation | vs. prior close | fact | Each visible card has `baseline: prior_close` | Name the actual comparison |
| S&P 500 description | Approached a record; lower oil and yields eased costs and valuations | Tracks large U.S. companies; rose 0.8% to about 7,836 | fact + mechanism | `value`, `change_percent`, S&P DJI link | Remove unsupported history and cause |
| 10-year yield description | Eased from a multi-decade high; loans may remain expensive | Guides longer borrowing costs; dipped 0.06 points to 5.25% | fact + mechanism | `value`, `prior_close`, FRED | Remove unsupported history flag and jargon |
| Brent description | Moved lower; sustained declines reduce several pressures | Global benchmark; fell 2.0% to $98.30 | fact + mechanism | `value`, `change_percent`, EIA | State the measured move only |
| Nasdaq description | Extended Monday's record; lower yields support valued companies | Includes many tech companies; rose 0.8% to about 27,697 | fact + mechanism | `value`, `change_percent`, Nasdaq | Remove unsupported record and cause |
| Dow description | Rise showed gains extended beyond technology | Tracks 30 large U.S. companies; rose 0.5% to about 51,533 | fact + mechanism | `value`, `change_percent`, S&P DJI | Delete unsupported breadth claim |
| VIX description | Remained subdued while several assets moved sharply | Tracks expected S&P 500 swings; rose 1.37% to 15.52 | fact + mechanism | `value`, `change_percent`, Cboe | Remove unanchored adjective and cross-asset claim |
| Oil headline | Cheaper oil relieved markets and household-cost pressure | Oil fell 2% to about $98 a barrel | fact | Oil card data; EIA/AP links | Event, not claimed effect |
| Oil commentary | Supply fears eased; decline works through several costs | Brent fell 2.0% to $98.30; oil can reach households through named channels; one morning is not a trend | fact + mechanism + interpretation | Oil card data; EIA/AP links | Separate move, mechanism, and limit |
| Oil visual caption | Lower crude can ease several cost channels. | Crude feeds fuel, freight, and petroleum-based materials. | mechanism | EIA | State the channel directly |
| Oil views | Longer household, business, and global prose | Two or three short mechanism sentences per view | mechanism | EIA | Plain language and shorter sentences |
| Oil data note | Intraday prices move quickly; retail response has delays and regional differences | Intraday prices can change quickly; retail prices vary by time and region | mechanism | EIA | Reduce jargon |
| Rates headline | Treasury yields eased, but borrowing remains expensive | Government borrowing rates dipped to 5.25% | fact | FRED | Plain words and measured event |
| Rates commentary | Fell from a multi-decade high; offered relief; affected valuations | Defines the yield; states 5.31% to 5.25%; lists borrowing and price channels | fact + mechanism | FRED | Remove unsupported history and personified effect |
| Rates branch label | Stock valuations | Prices vs. profits | mechanism | FRED/AP | Replace jargon |
| Rates caption | A lower day does not erase a high starting point. | Treasury returns provide a reference for other borrowing costs. | mechanism | FRED | Remove unanchored “high” |
| Rates views | Expansion hurdle, policy restraint, and favorable reversal language | Short descriptions of refinancing, policy comparison, issuance, and dealer spreads | mechanism | FRED/Treasury links | Remove interpretation and jargon |
| Google topic | Markets | Infrastructure | fact | SEC/EIA links | Match the subject |
| Google headline | Google backed more nuclear power for AI growth | Google signed a 20-year nuclear power deal | fact | SEC filing link | State the event |
| Google commentary | Deal shows AI investment reaches infrastructure | 20-year agreement; nuclear upgrades in PJM; data-center mechanism | fact + mechanism | SEC/EIA | Remove generalizing verb |
| Google visual title | AI demand reaches power grid | Planned project figures | fact | Company filings | Neutral label |
| Google caption | AI demand funds upgrades, capacity, investment, and jobs. | Planned project figures, per company filings. | fact | SEC filing link | Remove causal verb |
| Google views | Household and Dealer | Household, Business, and Policy | fact + mechanism | SEC/EIA | Use substantive mapped views; remove forced Dealer view |
| Google data note | Planned figures; delivery depends on several conditions | Capacity and job figures describe plans, not completed work. | fact | SEC filing link | Shorter limitation |
| Profit headline | Strong profit expectations kept stocks near records | Large U.S. companies begin reporting profits | fact | Nasdaq earnings calendar/AP | Remove causal link and unsupported adjective |
| Profit commentary | Rapid expected growth; high rates determine prices | Reporting starts; stocks claim future profits; rates can influence prices relative to profits | fact + mechanism | Nasdaq/SEC/FRED data already linked on related page items | Remove unsupported forecast figures and deterministic language |
| Profit visual | >25%; 3 straight quarters; Delta → banks → outlook | Delta Air Lines, then major banks | fact | AP link, pending human access check | Remove unverifiable figures and causal arrows |
| Profit caption | Results must support already elevated expectations. | Companies begin reporting over the coming days. | fact | Nasdaq earnings calendar/AP | Replace prediction with calendar fact |
| Profit views | Record prices, strong results, broadening rally | Retirement-account and market-making mechanisms | mechanism | SEC/Nasdaq | Remove unsupported qualifiers and forecast framing |
| What Else section | What Else | Also Today | label | Editorial instruction | Requested section name |
| Option Care item | A takeover moved Option Care; generic company | CD&R and McKesson agreed to buy Option Care; identifies infusion services | fact | AP link | Event headline and company descriptor |
| Option Care badge | ↗ 32.7% | Shares +32.7% | fact | AP link | Name what moved |
| Lamb Weston item | Frozen-fries demand beat expectations; broad pricing claim | Lamb Weston beat quarterly estimates; identifies frozen-potato supplier | fact | AP link | Event headline and descriptor |
| Lamb Weston badge | ↗ 10.8% | Shares +10.8% | fact | AP link | Name what moved |
| Asia item | Asian markets moved in different directions; portfolio generalization | Japan and Hong Kong rose; South Korea fell | fact | AP link | Name markets; remove generalization |
| Airlines/banks item | Results reveal credit quality and financing conditions | Reports include travel demand and borrower repayment data | fact | AP link | Replace jargon |
| Calendar section | Soon on TLDRM | Coming Up | label | Editorial instruction | Full brand rule and requested name |
| CPI text | Placeholder consensus; interest-rate pressure | Source-named prior only; higher/lower expectation language | fact + historical relationship | BLS link | Remove placeholder and jargon |
| PPI text | Verify placeholder; unlisted consensus | No unsupported prior/consensus; higher/lower expectation language | historical relationship | BLS link | Remove placeholder |
| FOMC text | Market-pricing placeholder; tighter/cooler labels | Fed raises/holds labels; direct short-rate mechanisms | mechanism | Federal Reserve link | Match policy mechanics |
| Time labels | a.m./p.m.; EDT/EST generated by locale | AM/PM ET | fact | Edition timestamp/calendar fields | One time format |
| Sticky/footer brand | TL;DRM | TL;DR Macro | label | Brand policy | Full brand everywhere |
| Footer rule | Verify as you go | Check primary sources | label | Editorial instruction | Avoid placeholder keyword in rendered copy |
| Terms | “price pressure” synonyms | “price changes” / “rising prices” | definition | Existing official-source context | Remove banned phrase |
| Terms | No PJM or MW entries | Added PJM and megawatt entries | definition | EIA/linked project sources | Explain unfamiliar terms |

## Removed for lack of evidence

| Removed claim | Location | Reason |
|---|---|---|
| “Monday's multi-decade high” | Yield snapshot and rates story | No history flag or validated comparison field |
| “Extended Monday's record” | Nasdaq snapshot | No record flag in the data |
| “Approached a record” | S&P 500 snapshot | No record flag in the data |
| Dow gain extended beyond technology | Dow snapshot | No component-count or breadth field |
| Stocks, oil, and bonds moved sharply | VIX snapshot | No shared threshold test for all three assets |
| Lower oil/yields and profit expectations explained index gains | Snapshot cards | Multiple unattributed causes across the same asset move |
| Above 25% profit growth for three straight quarters | Profit visual | Linked AP page could not be accessed; no source line available |
| Delta → banks → profit outlook causal chain | Profit visual | Arrows implied an unsupported causal relationship |
| Separate consensus placeholders | Calendar | No named source supplied values |

## Needs human check

- The Associated Press article at `https://apnews.com/article/stocks-markets-oil-bonds-us-e8285ec7afbe81e9df277e8ee2127982` was not accessible during this review. AP-dependent acquisition, company-result, regional-market, and reporting-order copy remains limited to facts already present in the project.
- Exact source line for the removed “above 25%” and “three straight quarters” figures: unavailable. The figures remain removed.
- Planned Google/Constellation project figures remain as existing data values. Confirm the exact filing passage before the next data refresh.

## Validation gates

Run:

```bash
npm run validate:content
npm run lint
npm run build
```

The build report records claim-ledger counts, readability failures, consistency checks, and page-level counts for “pressure” and “eased.”
