# Daily editorial intelligence system

## Audit: what already works

The repository already has strong downstream publication controls: approved-source allowlists, observation-date and freshness checks, arithmetic recomputation, claim ledgers, direct-link requirements, headline and summary duplication checks, an archive, a corrections log, security scans, responsive browser tests, and a fail-closed GitHub Pages deployment. Those controls remain authoritative.

The missing layer was upstream selection. Before this change, no reusable configuration scored a 15–25 item candidate pool, removed overlapping reports, limited category or AI concentration, separated today's evidence from the longer trend, or produced distinct morning and afternoon plans.

## Refresh workflow

1. Collect 15–25 candidate developments outside the public build. Each candidate must follow `config/editorial-system.json` and include source metadata, a verification status, six ranking scores, today's new information, the longer trend, and the required explanatory fields.
2. Prefer direct primary or market-data evidence. Reporting may add context but cannot replace evidence for a material number.
3. Run `npm run editorial:plan -- --input /absolute/path/candidates.json --edition morning`. For the closing revision, use `--edition afternoon`. The command writes `reports/editorial-plan.json` by default.
4. The command rejects uncertain, future-dated, incomplete, or duplicate candidates. It selects 6–9 stories, designates 3–4 as major, limits category and AI concentration, and surfaces candidate mechanisms for the daily connection diagram.
5. An editor maps the accepted plan into the existing content files. The present content validator and claim ledger remain the final authority; the ranking stage does not publish or bypass evidence gates.
6. Run `npm run verify`. Only a passing build may be committed and deployed. On failure, keep the last verified edition live and record the failure rather than publishing a partial briefing.

## Candidate source metadata

Every source needs `name`, `url`, and `type`. Reporting, wire, and company sources require `published_at`. Primary and market-data sources require either `published_at` or the actual `observation_date`. This avoids inventing publication dates for continuously updated official datasets.

## Scheduling

The commands support an 8:00 AM ET morning plan and a 4:30 PM ET afternoon revision using `America/New_York`, so daylight-saving changes are handled by the scheduler rather than fixed UTC offsets. No unattended schedule is enabled in this repository. A future GitHub Actions schedule must collect licensed data and verified source material before invoking the planner; without those inputs, it must exit without changing the site.

## Remaining external requirements

- A licensed market-data feed for reliable intraday and closing observations.
- Source collectors for official releases and permitted reporting.
- GitHub secrets for those providers.
- Human review for disputed causal claims, conflicts, corrections, and low-confidence geopolitical developments.
- A separately approved design request if the visible major-story cards are ever expanded with additional labeled fields; guarded UI files were not changed here.
