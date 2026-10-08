# Data Report

Generated: 2026-10-08T19:44:15.772Z

| Instrument | Provider | Series | Frequency | Latest timestamp | Baseline | Chart points | Status |
|---|---|---|---|---|---|---:|---|
| S&P 500 | S&P Dow Jones Indices via The Associated Press | SP500 | intraday | 2026-10-07T09:35:00-04:00 | prior close | 10 | Passed |
| 10-year Treasury yield | U.S. Treasury | DGS10 | intraday | 2026-10-07T09:35:00-04:00 | prior close | 10 | Passed |
| Brent crude oil | CME Group via The Associated Press | BZ | intraday | 2026-10-07T09:35:00-04:00 | prior close | 10 | Boundary — needs human check |
| Nasdaq Composite | Nasdaq | NASDAQCOM | intraday | 2026-10-07T09:35:00-04:00 | prior close | 10 | Passed |
| Dow Jones Industrial Average | S&P Dow Jones Indices | DJIA | intraday | 2026-10-07T09:35:00-04:00 | prior close | 10 | Passed |
| Expected volatility | Cboe | VX/X1 | intraday | 2026-10-07T09:45:00-04:00 | prior close | 10 | Passed |
| DAX | Deutsche Börse/Xetra | DAX | daily close | 2026-10-06T16:00:00+02:00 | Oct 5 close | 3 | Withheld: fewer than 20 daily observations |
| Nikkei 225 | Nikkei Inc. | N225 | daily close | 2026-10-06T15:00:00+09:00 | Oct 5 close | 10 | Withheld: fewer than 20 daily observations |
| KOSPI | Korea Exchange | KOSPI | daily close | 2026-10-06T15:30:00+09:00 | Oct 5 close | 12 | Withheld: fewer than 20 daily observations |
| 2-year Treasury yield | Federal Reserve via FRED | DGS2 | daily close | 2026-10-02T16:00:00-04:00 | Oct 1 close | 19 | Withheld: stale and fewer than 20 daily observations |
| 10-year minus 2-year yield spread | Federal Reserve Bank of St. Louis | T10Y2Y | daily close | 2026-10-05T16:00:00-04:00 | Oct 2 close | 20 | Passed |
| 30-year fixed mortgage rate | Freddie Mac | MORTGAGE30US | weekly | 2026-10-08T12:00:00-04:00 | Oct 1 reading | 5 | Passed |
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
| S&P 500 | 2026-10-08T09:34:00-04:00 | Wednesday close 7,801.77 · Thursday open 7,772.87 | ≈7,773 (−0.37%) | S&P Dow Jones Indices and Reuters |
| 10-year Treasury yield | 2026-10-08T09:35:00-04:00 | Wednesday late reading 5.28% · Thursday early reading 5.35% | 5.35% (+0.07 percentage points) | U.S. Treasury and The Associated Press |
| Brent crude oil | 2026-10-08T09:35:00-04:00 | Wednesday late reading $100.27 · Thursday early reading $104.08 | $104.08 (+3.8%) | CME Group and The Associated Press |
| Nasdaq Composite | 2026-10-08T09:34:00-04:00 | Wednesday close 27,538.69 · Thursday open 27,403.64 | ≈27,404 (−0.49%) | Nasdaq and Reuters |
| Dow Jones Industrial Average | 2026-10-08T09:34:00-04:00 | Wednesday close 51,179.87 · Thursday open 51,001.38 | ≈51,001 (−0.35%) | S&P Dow Jones Indices and Reuters |
| Expected volatility | 2026-10-08T09:40:00-04:00 | Wednesday close 15.08 · Thursday morning 15.85 | 15.85 (+5.1%) | Cboe delayed quotes |

- Nasdaq Composite: 2026-10-02T16:00:00-04:00; 27,190.86; +1.19%; Nasdaq via FRED
- Dow Jones Industrial Average: 2026-10-05T10:10:00-04:00; 51,267.90; +0.18%; S&P Dow Jones Indices via FRED
- 10-year minus 2-year yield spread: 2026-10-05T16:00:00-04:00; 0.47 percentage points; +0.02 percentage points; Federal Reserve Bank of St. Louis
- 30-year fixed mortgage rate: 2026-10-08T12:00:00-04:00; 7.40%; +0.12 percentage points; Freddie Mac
