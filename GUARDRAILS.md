# TL;DR Macro guardrails

These rules are release gates, not suggestions. `npm run verify` must pass before an edition can deploy.

- Intraday quotes: at most 10 minutes old at publication. Daily and weekly series must show their true observation dates and may not be relabeled as current.
- Every displayed move is recomputed from the stored value and baseline. Large moves and related-instrument gaps require an explicit override in `data/overrides.json` with an owner, reason, evidence URL, and expiry.
- No invented interpolation, timestamps, observations, or source support. Withhold a card when evidence is missing or conflicting.
- Headlines stay factual and non-causal unless the accompanying copy attributes the causal claim to named evidence.
- Sources must resolve to the cited document or series, not a generic landing page. Time-sensitive claims require direct support.
- Glossary matches whole words only. Acronyms are case-sensitive. Longer phrases win, matches cannot overlap, and one term is annotated once per content block.
- Daily sections remain in this order: Market Snapshot, Top Stories, TL;DR Global, Next on TL;DRM. More Markets retains the configured group order.
- Stylesheets, design tokens, fonts, logos, layout structure, and card-group structure are frozen. A visual change requires a dated entry in `DESIGN_REQUESTS.md` and explicit design approval.
- Corrections are appended to `data/revisions.json`; published snapshots are retained in `data/history/`.

Failures stop publication. Warnings requiring judgment are recorded in `HUMAN_CHECKS.md`.
