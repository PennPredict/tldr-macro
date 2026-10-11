# Automated weekday publishing

TL;DR Macro can update without a daily manual prompt. The production workflow should run through GitHub Actions shortly after the U.S. market opens.

## Proposed schedule

- Weekdays at 9:30 a.m. America/New_York.
- Skip weekends and U.S. market holidays.
- Allow a manual run for corrections or major events.

## Pipeline

1. Collect market levels from a licensed market-data API.
2. Collect releases and calendars from primary sources: Federal Reserve, Treasury, BEA, BLS, SEC, EIA, FRED, exchanges, and company investor-relations pages.
3. Use the OpenAI Responses API with web search restricted to an approved domain list for current context and citations.
4. Generate a briefing that conforms to a strict JSON schema.
5. Reject publication when a number lacks a source, cited sources disagree, timestamps are stale, or confidence is low.
6. Write the approved briefing to the repository, preserve the prior edition in the archive, and deploy through GitHub Pages.

## Required secrets

- `OPENAI_API_KEY`
- A key for the selected licensed market-data provider
- Any required keys for primary-source APIs such as FRED or BEA

Store secrets in GitHub Actions secrets. Never expose them to browser code or commit them to the repository.

## Editorial safeguards

- State observed market moves as facts.
- Use “may,” “could,” or “coincided with” when causality is not established.
- Define specialized terms on first use.
- Link every claim to the most direct available source.
- Do not reproduce paywalled reporting. Link and attribute it when it adds context.
- Keep the prior edition live if validation fails.
- Log corrections and preserve the original publication time.

## Human involvement

Routine editions can publish automatically once the data-collection and generation steps are connected. Until then, the scheduled GitHub Pages workflow republishes the latest validated edition already committed to `main`. A human should review low-confidence causal claims, conflicting sources, major geopolitical events, and corrections. The system should fail closed rather than publish an unsupported explanation.
