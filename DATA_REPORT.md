# Data Report

Generated: 2026-10-11T02:29:25.588Z

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
| S&P 500 | 2026-10-09T16:00:00-04:00 | Thursday close 7,765.36 · Friday close 7,811.54 | 7,811.54 (+0.6%) | S&P Dow Jones Indices and The Associated Press |
| 10-year Treasury yield | 2026-10-09T16:00:00-04:00 | Thursday late reading 5.22% · Friday close 5.24% | 5.24% (+0.02 percentage points) | U.S. Treasury and The Associated Press |
| Brent crude oil | 2026-10-09T16:00:00-04:00 | Thursday close $104.30 · Friday close $104.72 | $104.72 (+0.4%) | CME Group and The Associated Press |
| Nasdaq Composite | 2026-10-09T16:00:00-04:00 | Thursday close 27,193.34 · Friday close 27,366.17 | 27,366.17 (+0.6%) | Nasdaq and The Associated Press |
| Dow Jones Industrial Average | 2026-10-09T16:00:00-04:00 | Thursday close 51,231.64 · Friday close 51,654.95 | 51,654.95 (+0.8%) | S&P Dow Jones Indices and The Associated Press |
| Expected volatility | 2026-10-09T16:00:00-04:00 | Thursday close 15.41 · Friday close 14.84 | 14.84 (−3.7%) | Cboe closing data |

- DAX: 2026-10-08T10:58:00-04:00; 24,913.10; −0.76%; Deutsche Börse/Xetra via Börse Stuttgart
- Nikkei 225: 2026-10-08T02:00:00-04:00; 69,042.10; −1.42%; Nikkei Inc.
- KOSPI: 2026-10-08T02:00:00-04:00; 6,625.93; −2.62%; Korea Exchange via KB Financial Group
- Nasdaq Composite: 2026-10-02T16:00:00-04:00; 27,190.86; +1.19%; Nasdaq via FRED
- Dow Jones Industrial Average: 2026-10-05T10:10:00-04:00; 51,267.90; +0.18%; S&P Dow Jones Indices via FRED
- Russell 2000: 2026-10-05T16:00:00-04:00; 2,847.14; +0.50%; FTSE Russell level reported by The Associated Press
- 2-year Treasury yield: 2026-10-08T09:35:00-04:00; 4.78%; +0.02 percentage points; Federal Reserve via FRED
- 10-year minus 2-year yield spread: 2026-10-05T16:00:00-04:00; 0.47 percentage points; +0.02 percentage points; Federal Reserve Bank of St. Louis
- 30-year fixed mortgage rate: 2026-10-08T12:00:00-04:00; 7.40%; +0.12 percentage points; Freddie Mac
- Euro to dollar: 2026-10-08T10:58:00-04:00; $1.1208 per euro; +0.12%; Federal Reserve via FRED
- Dollar to yen: 2026-10-08T10:58:00-04:00; ¥158.17 per dollar; +0.07%; Federal Reserve via FRED
- Pound to dollar: 2026-10-08T10:58:00-04:00; $1.3239 per pound; +0.32%; Federal Reserve via FRED
- WTI crude oil: 2026-10-08T10:34:00-04:00; $91.46 per barrel; +4.00%; U.S. Energy Information Administration via FRED
- Natural gas: 2026-10-08T11:04:00-04:00; $3.17 per MMBtu; −1.03%; U.S. Energy Information Administration via FRED
- Copper: 2026-10-08T10:34:00-04:00; $6.68 per pound; near flat; Market quote with IMF benchmark context
