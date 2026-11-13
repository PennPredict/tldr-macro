# Data gates report — 2026-11-11

## Before

- The compact series mixed same-day intraday points with closes, which could overstate a five-day history.
- Several prior-close fields differed from the immediately preceding stored point.
- “Earlier verified readings” rendered stale and known-invalid series, including re-dated values and incompatible frequencies.
- The Treasury row displayed TLT, an inverse-moving bond fund, under a cash-yield name.

## After

- Weekend and holiday dates are rejected by the existing market-series validator.
- Displayed row changes are computed from the last two displayed observations.
- The stale “Earlier verified readings” group is excluded from the DOM until every candidate series passes date, identity, freshness, sign, and immutability gates.
- TLT remains explicitly labeled “Long-term Treasury fund (TLT)”; no yield direction is inferred on the cash-market holiday.
- Official 10-year Treasury and weekly mortgage indicators are configured but withheld because this build lacks verified, correctly dated observations. No figures were invented.

## Remaining coverage gaps

The known invalid WTI, KOSPI, mortgage, spread, and re-dated international-index series remain in internal source data only. They are not rendered. Cross-edition immutability must be enforced when the provider ingestion job is next revised; published snapshots remain retained in `data/history/`.
