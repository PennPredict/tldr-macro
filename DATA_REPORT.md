# Data Report

Generated: 2026-10-13T22:16:05.010Z

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
| S&P 500 | 2026-10-13T10:30:00-04:00 | Monday close 7,807.24 · Tuesday 10:30 AM 7,801.58 | 7,801.58 (−0.1%) | S&P Dow Jones Indices and The Associated Press |
| 10-year Treasury yield | 2026-10-13T10:30:00-04:00 | Friday close 5.24% · Tuesday 10:30 AM 5.22% | 5.22% (−0.02 points) | U.S. Treasury and The Associated Press |
| Brent crude oil | 2026-10-13T10:30:00-04:00 | Monday close $106.65 · Tuesday 10:30 AM $105.91 | $105.91 (−0.7%) | CME Group and The Associated Press |
| Nasdaq Composite | 2026-10-13T10:30:00-04:00 | Monday close 27,245.90 · Tuesday 10:30 AM 27,211.98 | 27,211.98 (−0.1%) | Nasdaq and The Associated Press |
| Dow Jones Industrial Average | 2026-10-13T10:30:00-04:00 | Monday close 51,850.55 · Tuesday 10:30 AM 51,879.24 | 51,879.24 (+0.1%) | S&P Dow Jones Indices and The Associated Press |
| Expected volatility | 2026-10-13T10:30:00-04:00 | Monday close 15.21 · Tuesday 10:30 AM 15.37 | 15.37 (+1.1%) | Cboe closing data |

- Nasdaq Composite: 2026-10-02T16:00:00-04:00; 27,190.86; +1.19%; Nasdaq via FRED
- Dow Jones Industrial Average: 2026-10-05T10:10:00-04:00; 51,267.90; +0.18%; S&P Dow Jones Indices via FRED
- Russell 2000: 2026-10-13T10:30:00-04:00; 2,780.46; −0.5%; FTSE Russell level reported by The Associated Press
- 30-year fixed mortgage rate: 2026-10-08T12:00:00-04:00; 7.40%; +0.12 percentage points; Freddie Mac
