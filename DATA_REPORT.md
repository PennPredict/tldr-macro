# Data Report

Generated: 2026-10-27T20:23:48.625Z

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
| S&P 500 | 2026-10-27T10:30:00-04:00 | Monday close 7,676.77 · Tuesday 10:30 AM +0.2% | 7,692.12 (+0.2%) | S&P Dow Jones Indices and The Associated Press |
| 10-year Treasury yield | 2026-10-27T10:30:00-04:00 | Monday close 5.00% · Tuesday 10:30 AM −0.01 points | 4.99% (−0.01 points) | U.S. Treasury and The Associated Press |
| Brent crude oil | 2026-10-27T10:30:00-04:00 | Monday close $110.70 · Tuesday 10:30 AM −0.3% | $110.37 (−0.3%) | CME Group · Brent crude futures and The Associated Press |
| Nasdaq Composite | 2026-10-27T10:30:00-04:00 | Monday close 26,169.38 · Tuesday 10:30 AM +0.6% | 26,326.40 (+0.6%) | Nasdaq Composite and The Associated Press |
| Dow Jones Industrial Average | 2026-10-27T10:30:00-04:00 | Monday close 52,361.58 · Tuesday 10:30 AM −0.2% | 52,273.58 (−0.2%) | S&P Dow Jones Indices and The Associated Press |
| Expected volatility | 2026-10-27T10:30:00-04:00 | Monday close 18.39 · Tuesday 10:30 AM +0.2% | 18.42 (+0.2%) | Cboe VIX |

- Nasdaq Composite: 2026-10-02T16:00:00-04:00; 27,190.86; +1.19%; Nasdaq via FRED
- Dow Jones Industrial Average: 2026-10-05T10:10:00-04:00; 51,267.90; +0.18%; S&P Dow Jones Indices via FRED
