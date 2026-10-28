# V2 data-gates report

Edition checked: 2026-10-27. The v2 presentation does not repair, interpolate, or invent market observations.

| Gate | Before | V2 result |
|---|---|---|
| Series/date integrity | Several histories contain duplicate dates and repeated latest values. | The affected sparkline is withheld; the verified point-in-time value remains visible. |
| Prior close | Histories do not consistently contain the declared prior close. | Sparkline withheld when the baseline cannot be found in history. |
| Freshness | Main readings are timestamped; extra markets include stale or unavailable rows. | Intraday data older than 90 minutes is withheld; daily data is delayed after one business day and withheld after three; weekly data is withheld after eight days. |
| Contaminated series | WTI and several international series are already marked unavailable or under review. | They remain withheld. No replacement value was inferred. |
| Change math | Displayed changes coexist with raw value and prior close. | Direction is computed from raw values; yield moves are labeled in points. |
| Sentence parsing | Abbreviations can create false sentence boundaries. | V2 uses an abbreviation-aware first-sentence helper and fixed word caps. |
| Event dates | Calendar dates and countdowns can cross time zones. | Countdown labels are derived in America/New_York. |
| Topic mapping | Existing topic tags vary by desk. | V2 maps only known tags and uses the neutral “Economy” fallback. |
| Verification label | A label could imply checks ran when they did not. | No verification claim is displayed by default. Existing verification remains authoritative. |

## Withheld in v2

- All primary sparklines currently fail at least one history gate because of duplicate observation dates and/or a missing prior-close observation.
- Extra-market rows already marked unavailable stay withheld.
- The Economic Thread has no chain whose mechanism IDs all appear in `config/mechanisms.json`; v2 shows “No verified shared driver today” instead of an unsupported causal chain.

## Word-count limits

| Surface | Limit |
|---|---:|
| Hero headline | 6 words |
| Hero summary | 50 words |
| Story headline | 6 words |
| Story commentary | 40 words |
| Why it matters | 25 words |
| Global headline | 8 words |
| Global paragraph | 35 words |
| Event description | 14 words |
| Bottom-line heading | 22 words |
| Bottom-line paragraph | 40 words |

The interface truncates presentation copies at these limits without modifying source content.
