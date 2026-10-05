# TL;DR Macro approved-source policy

The machine-readable whitelist lives in `config/approved-sources.json`. The production build fails when a published link uses a domain outside that list.

## Source order

1. Use the institution that produced the data, decision, filing, or policy.
2. Add Reuters, Bloomberg, The Wall Street Journal, Financial Times, or Associated Press when independent reporting improves context.
3. Use the exchange, benchmark administrator, or official market-data provider for prices.
4. Use company investor relations only for what the company announced. Use SEC filings first when available.

## Publication requirements

- Every major factual claim must link to its most direct source.
- Every market price must state its as-of date and time and whether it is live, delayed, a prior close, or a futures quote.
- Do not combine prices captured at materially different times without disclosure.
- Do not present sequence as causation. Use qualified language when the mechanism is an inference.
- When approved sources conflict, report the disagreement or stop publication.
- Search results, social posts, newsletters, aggregators, message boards, and AI summaries may identify a lead but cannot establish a published claim.
- Preserve revisions, methodology notes, and correction history.

## Changes to the whitelist

Adding a domain requires an explicit editorial decision. A passing build is not evidence that a source is trustworthy; the allowlist must be reviewed before it is changed.
