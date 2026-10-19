# Data Report

Generated: 2026-10-19T19:08:18.191Z

| Instrument | Provider | Series | Frequency | Latest timestamp | Baseline | Chart points | Status |
|---|---|---|---|---|---|---:|---|
| S&P 500 | S&P Dow Jones Indices via The Associated Press | SP500 | intraday | 2026-10-16T16:10:00-04:00 | prior close | 10 | Passed |
| 10-year Treasury yield | U.S. Treasury | DGS10 | intraday | 2026-10-19T10:00:00-04:00 | prior close | 12 | Passed |
| Brent crude oil | CME Group via The Associated Press | BZ | intraday | 2026-10-16T16:10:00-04:00 | prior close | 10 | Boundary — needs human check |
| Nasdaq Composite | Nasdaq | NASDAQCOM | intraday | 2026-10-19T10:00:00-04:00 | prior close | 12 | Passed |
| Dow Jones Industrial Average | S&P Dow Jones Indices | DJIA | intraday | 2026-10-15T10:15:00-04:00 | prior close | 10 | Passed |
| Expected volatility | Cboe | VX/X1 | intraday | 2026-10-15T10:15:00-04:00 | prior close | 10 | Passed |
| DAX | Deutsche Börse/Xetra | DAX | daily close | 2026-10-06T16:00:00+02:00 | Oct 5 close | 3 | Withheld: fewer than 20 daily observations |
| Nikkei 225 | Nikkei Inc. | N225 | daily close | 2026-10-06T15:00:00+09:00 | Oct 5 close | 10 | Withheld: fewer than 20 daily observations |
| KOSPI | Korea Exchange | KOSPI | daily close | 2026-10-06T15:30:00+09:00 | Oct 5 close | 12 | Withheld: fewer than 20 daily observations |
| 2-year Treasury yield | Federal Reserve via FRED | DGS2 | daily close | 2026-10-02T16:00:00-04:00 | Oct 1 close | 19 | Withheld: stale and fewer than 20 daily observations |
| 10-year minus 2-year yield spread | Federal Reserve Bank of St. Louis | T10Y2Y | daily close | 2026-10-05T16:00:00-04:00 | Oct 2 close | 20 | Passed |
| 30-year fixed mortgage rate | Freddie Mac | MORTGAGE30US | weekly | 2026-10-15T12:00:00-04:00 | Oct 1 reading | 5 | Passed |
| Euro to dollar | Federal Reserve via FRED | DEXUSEU | daily close | 2026-10-02T16:00:00-04:00 | Oct 1 close | 19 | Withheld: stale and fewer than 20 daily observations |
| Dollar to yen | Federal Reserve via FRED | DEXJPUS | daily close | 2026-10-02T16:00:00-04:00 | Oct 1 close | 19 | Withheld: stale and fewer than 20 daily observations |
| Pound to dollar | Federal Reserve via FRED | DEXUSUK | daily close | 2026-10-02T16:00:00-04:00 | Oct 1 close | 5 | Withheld: stale and fewer than 20 daily observations |
| Natural gas | U.S. Energy Information Administration via FRED | DHHNGSP | daily close | 2026-09-29T16:00:00-04:00 | Sep 28 close | 16 | Withheld: stale and fewer than 20 daily observations |

## Consistency checks

- Instrument uniqueness: Passed
- Prose versus registry: Passed
- Frequency labels and timestamps: Passed
- Chart integrity: Passed; insufficient series withheld
- Snapshot claim lint: Passed

## Withheld or human review

- Brent crude oil: boundary — needs human check
- DAX: withheld — fewer than 20 daily observations
- Nikkei 225: withheld — fewer than 20 daily observations
- KOSPI: withheld — fewer than 20 daily observations
- 2-year Treasury yield: withheld — stale and fewer than 20 daily observations
- Euro to dollar: withheld — stale and fewer than 20 daily observations
- Dollar to yen: withheld — stale and fewer than 20 daily observations
- Pound to dollar: withheld — stale and fewer than 20 daily observations
- Natural gas: withheld — stale and fewer than 20 daily observations

## Visual gate

- Yield replacement withheld: comparable 12-month mortgage history not present locally.
- Oil replacement withheld: latest EIA gasoline cost-component breakdown not verified locally.
- Both are first-use concepts and remain marked needs human check.

## Rendered edition observations

| Instrument | Fetched timestamp | Baseline | Display | Provider |
|---|---|---|---|---|
| S&P 500 | 2026-10-19T10:00:00-04:00 | Friday close 7,659.44 · Monday 10:00 AM +0.4% | 7,690.08 (+0.4%) | S&P Dow Jones Indices |
| 10-year Treasury yield | 2026-10-19T10:00:00-04:00 | Friday close 5.09% · Monday 10:00 AM 5.10% | 5.10% (+0.01 points) | U.S. Treasury and The Associated Press |
| Brent crude oil | 2026-10-19T10:00:00-04:00 | Friday settlement $109.86 · Monday 10:00 AM $108.13 | $108.13 (−1.6%) | CME Group |
| Nasdaq Composite | 2026-10-19T10:00:00-04:00 | Friday close 26,140.03 · Monday 10:00 AM +0.9% | 26,375.29 (+0.9%) | Nasdaq and The Associated Press |
| Dow Jones Industrial Average | 2026-10-19T10:00:00-04:00 | Friday close 52,002.41 · Monday 10:00 AM down 44 points | 51,958.41 (−0.1%) | S&P Dow Jones Indices |
| Expected volatility | 2026-10-19T10:00:00-04:00 | Friday close 19.99 · Monday morning near 18 | 18.00 (−10.0%) | Cboe closing data |

- DAX: 2026-10-19T10:00:00-04:00; 25,337.00; −1.1%; Deutsche Börse/Xetra via Börse Stuttgart
- Nikkei 225: 2026-10-19T10:00:00-04:00; 64,904.20; −0.6%; Nikkei Inc.
- KOSPI: 2026-10-19T10:00:00-04:00; 5,770.08; +1.8%; Korea Exchange via KB Financial Group
- Nasdaq Composite: 2026-10-02T16:00:00-04:00; 27,190.86; +1.19%; Nasdaq via FRED
- Dow Jones Industrial Average: 2026-10-05T10:10:00-04:00; 51,267.90; +0.18%; S&P Dow Jones Indices via FRED
- 30-year fixed mortgage rate: 2026-10-15T12:00:00-04:00; 7.40%; +0.12 percentage points; Freddie Mac
- Euro to dollar: 2026-10-19T10:00:00-04:00; $1.1231 per euro; −0.1%; Federal Reserve via FRED
- Dollar to yen: 2026-10-19T10:00:00-04:00; ¥158.09 per dollar; +0.0%; Federal Reserve via FRED
- Pound to dollar: 2026-10-19T10:00:00-04:00; $1.3330 per pound; +0.0%; Federal Reserve via FRED
- WTI crude oil: 2026-10-19T10:00:00-04:00; $100.36 per barrel; −1.0%; U.S. Energy Information Administration via FRED
- Natural gas: 2026-10-19T10:00:00-04:00; $3.08 per MMBtu; −1.1%; U.S. Energy Information Administration via FRED
- Copper: 2026-10-19T10:00:00-04:00; $6.51 per pound; −0.4%; Market quote with IMF benchmark context
- Gold: 2026-10-19T10:00:00-04:00; $4,148.80 per ounce; −0.4%; CME Group
- Silver futures: 2026-10-19T10:00:00-04:00; $57.27 per ounce; +0.5%; CME Group
