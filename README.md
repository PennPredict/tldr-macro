# TL;DR Macro

**Market intelligence, for everyone.**

TL;DR Macro explains what moved, why it matters, and what comes next without assuming a finance background. It is educational context, not investment advice.

## Editorial standard

- Every factual claim links to a visible source.
- Primary sources come first: BEA, BLS, Federal Reserve, Treasury, SEC, EIA, FRED, exchanges, and company investor relations.
- Sentences are short, factual, and neutral.
- Define specialized terms on first use; never assume the reader knows finance vocabulary.
- Write the full term followed immediately by its acronym in parentheses, then explain what it measures.
- Explain abstract signals with a familiar household or business example whenever it improves understanding.
- Connect each headline to an everyday consequence such as prices, jobs, borrowing, savings, or portfolio exposure.
- Uncertainty appears as a question or conditional mechanism, never as unsupported certainty.
- Market reaction is separated from interpretation.
- State that concision omits nuance and link readers to the complete release and methodology.
- Published corrections remain visible.
- Only domains in `config/approved-sources.json` may appear in a published edition.
- The build checks source domains, banned prose, and editorial constraints before deployment.

See [SOURCES.md](SOURCES.md) for the source hierarchy and change policy.

## GitHub Pages launch

1. Create a GitHub repository and push this project to its `main` branch.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. The included workflow builds and deploys the site after every push to `main`.
4. It also republishes the latest validated edition at 9:30 a.m. America/New_York on weekdays.
5. The production custom domain is `tldrmacro.com`; its DNS must point to GitHub Pages and the Pages custom-domain setting must match.

The checked-in edition contains sourced editorial content and validated market data. The scheduled workflow republishes that committed edition; it does not yet collect new data or generate a new briefing automatically. See [AUTOMATION.md](AUTOMATION.md) before enabling unattended daily updates.

## Local review

```bash
npm ci
npm run dev
```

Before sharing a change, run:

```bash
npm run validate:content
npm run validate:review
npm run lint
npm run build:pages
```

The project requires Node.js 22.13 or newer.
