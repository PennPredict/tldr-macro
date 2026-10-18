# Data Report

Generated: 2026-10-18T01:22:46.776Z

| Instrument | Provider | Series | Frequency | Latest timestamp | Baseline | Chart points | Status |
|---|---|---|---|---|---|---:|---|
| S&P 500 | S&P Dow Jones Indices via The Associated Press | SP500 | intraday | 2026-10-16T16:10:00-04:00 | prior close | 10 | Passed |
| 10-year Treasury yield | U.S. Treasury | DGS10 | intraday | 2026-10-16T16:10:00-04:00 | prior close | 11 | Passed |
| Brent crude oil | CME Group via The Associated Press | BZ | intraday | 2026-10-16T16:10:00-04:00 | prior close | 10 | Boundary — needs human check |
| Nasdaq Composite | Nasdaq | NASDAQCOM | intraday | 2026-10-16T16:10:00-04:00 | prior close | 11 | Passed |
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
| S&P 500 | 2026-10-16T16:10:00-04:00 | Thursday close 7,744.06 · Friday close 7,659.44 | 7,659.44 (−1.1%) | S&P Dow Jones Indices |
| 10-year Treasury yield | 2026-10-16T16:10:00-04:00 | Thursday close 5.10% · Friday close 5.09% | 5.09% (−0.01 points) | U.S. Treasury and The Associated Press |
| Brent crude oil | 2026-10-16T16:10:00-04:00 | Thursday close $105.92 · Friday settlement $109.86 | $109.86 (+3.7%) | CME Group |
| Nasdaq Composite | 2026-10-16T16:10:00-04:00 | Thursday close 26,713.03 · Friday close 26,140.03 | 26,140.03 (−2.1%) | Nasdaq and The Associated Press |
| Dow Jones Industrial Average | 2026-10-16T16:10:00-04:00 | Thursday close 52,177.69 · Friday close 52,002.41 | 52,002.41 (−0.3%) | S&P Dow Jones Indices |
| Expected volatility | 2026-10-16T16:10:00-04:00 | Thursday close 16.46 · Friday close 19.99 | 19.99 (+21.5%) | Cboe closing data |

- DAX: 2026-10-16T16:10:00-04:00; 25,382.62; +0.3%; Deutsche Börse/Xetra via Börse Stuttgart
- Nikkei 225: 2026-10-16T16:10:00-04:00; 65,314.83; +1.4%; Nikkei Inc.
- KOSPI: 2026-10-16T16:10:00-04:00; 5,668.05; +2.1%; Korea Exchange via KB Financial Group
- Nasdaq Composite: 2026-10-02T16:00:00-04:00; 27,190.86; +1.19%; Nasdaq via FRED
- Dow Jones Industrial Average: 2026-10-05T10:10:00-04:00; 51,267.90; +0.18%; S&P Dow Jones Indices via FRED
- 30-year fixed mortgage rate: 2026-10-15T12:00:00-04:00; 7.40%; +0.12 percentage points; Freddie Mac
- Euro to dollar: 2026-10-16T16:10:00-04:00; $1.1239 per euro; +0.4%; Federal Reserve via FRED
- Dollar to yen: 2026-10-16T16:10:00-04:00; ¥158.02 per dollar; little changed; Federal Reserve via FRED
- Pound to dollar: 2026-10-16T16:10:00-04:00; $1.3327 per pound; +0.4%; Federal Reserve via FRED
- WTI crude oil: 2026-10-16T16:10:00-04:00; $101.41 per barrel; +3.7%; U.S. Energy Information Administration via FRED
- Natural gas: 2026-10-16T16:10:00-04:00; $3.22 per MMBtu; −0.6%; U.S. Energy Information Administration via FRED
- Copper: 2026-10-16T16:10:00-04:00; $6.63 per pound; +1.1%; Market quote with IMF benchmark context
- Gold: 2026-10-16T16:10:00-04:00; $4,188.10 per ounce; +0.4%; CME Group
- Silver futures: 2026-10-16T16:10:00-04:00; $57.12 per ounce; −1.2%; CME Group
