# TL;DR Macro security report

Audit date: 2026-10-14

Scope: repository source, Git history, saved Codex automation prompts, production export, sanitized Pages artifact, GitHub Actions workflow, image metadata, and deployed-site outsider checks. Secret values were compared in memory and were never printed or written to this report.

## Result

No current secret value, provider-token pattern, credential-bearing public URL, source map, local filesystem path, published email address, or authoring metadata was detected in the sanitized Pages artifact. No `.env`, private-key, or credential file is currently tracked or was found by filename in Git history.

The live site was not published or changed during this audit.

## Configuration inventory

| Name | File or location | Runtime | Service | Classification |
| --- | --- | --- | --- | --- |
| `PAGES_BASE_PATH` | `next.config.ts`, deploy workflow | Build | GitHub Pages | Non-secret |
| `CODEX_SANDBOX` | `vite.config.ts` | Local preview | Codex | Non-secret |
| `WRANGLER_WRITE_LOGS` | `vite.config.ts` | Local preview | Cloudflare tooling | Non-secret |
| `WRANGLER_LOG_PATH` | `vite.config.ts` | Local preview | Cloudflare tooling | Non-secret |
| `MINIFLARE_REGISTRY_PATH` | `vite.config.ts` | Local preview | Cloudflare tooling | Non-secret |
| `VERIFY_BASE_URL` | `scripts/test-browser-integrity.mjs` | Test | Local/browser test | Non-secret |
| `OUTSIDER_BASE_URL` | `scripts/outsider-check.mjs` | Test/CI | Public site | Non-secret |
| `SECURITY_OUTPUT_DIR` | `scripts/security-check.mjs` | Build/test | Local/CI | Non-secret |
| `OPENAI_API_KEY` | Documented future automation; protected CI scan input | Build automation | OpenAI | Secret; no current application use found |
| `MARKET_DATA_API_KEY` | Protected CI scan input | Build automation | Future market-data provider | Secret; no current application use found |
| `FRED_API_KEY` | Protected CI scan input | Build automation | FRED | Secret; no current application use found |
| `BEA_API_KEY` | Protected CI scan input | Build automation | BEA | Secret; no current application use found |

No public-prefix secret name (`NEXT_PUBLIC_*`, `VITE_*`, `PUBLIC_*`, or `REACT_APP_*`) was found. No client component references an environment secret or a keyed third-party API.

## Findings and disposition

### Addressed in this hardening change

- Pages now deploys from a separate `publish/` staging directory created from `out/`, not from the repository root or the raw framework export.
- `config/publish-allowlist.json` permits only the static page, Next runtime assets, fonts, branded images, favicon, and `CNAME`. Hidden files, source maps, reports, Markdown, configuration, data, scripts, tests, lockfiles, package manifests, and key material cannot enter the artifact.
- PNG text/EXIF/time chunks and SVG authoring metadata/comments are stripped while copying images into `publish/`. The build fails if metadata remains.
- Browser source maps are disabled and both emitted `.map` files and source-map references fail verification.
- Credential-query URL sanitization covers `api_key`, `apikey`, `key`, `token`, `access_token`, `auth`, `signature`, `password`, and `sid`, with a FRED-style unit test.
- `npm run verify` now builds the allowlisted artifact and runs source/history/output secret checks, URL tests, local outsider checks, and Gitleaks when installed. CI additionally runs pinned Gitleaks against full Git history and the publish artifact.
- Exact raw, base64, and URL-encoded forms of configured secret environment values are checked without emitting the values. Findings print only the configuration name, path/blob identifier, and a review fingerprint.
- The deployment workflow uses read-only repository permission in build jobs. `pages: write` and `id-token: write` exist only in the deploy job.
- All third-party Actions are pinned to full commit SHAs. Checkout credentials are not persisted. There is no `pull_request_target` trigger, fork-PR secret path, shell tracing, environment dump, or credential URL logging.
- Build logs are captured, scanned before display, and withheld if a secret value, bearer credential, or credential-bearing URL is detected.
- The outsider checker verifies sensitive paths return 403/404, crawls public HTML/JS/JSON/CSS, checks network requests, and fails on credentials, source maps, private metadata, or configured secret values.
- `.gitignore` now covers environment files, private keys/cert bundles, common credential files, security logs, and the clean publish staging directory.

### Current observations requiring owner awareness

1. **Git author email — privacy:** the latest commit uses `fionakim111@gmail.com`, not a GitHub `noreply` address. This address is part of Git metadata and can be visible in a public repository. No Git configuration or history was changed. For future commits, select “Keep my email addresses private” in GitHub email settings and use the GitHub-provided `noreply` address. Removing an existing address from history would require a separately approved history rewrite.
2. **Hosting project identifier — low sensitivity:** `.openai/hosting.json` contains a project identifier. It is not a credential and is excluded from the Pages artifact, but it remains visible to repository readers. Remove or relocate it only if the Sites preview integration is no longer needed; that choice was not made automatically.
3. **Desktop credential helper — low sensitivity:** `scripts/git-credential-github-desktop.sh` is tracked and appeared in history. It contains no credential value; it only locates the signed-in GitHub Desktop helper at runtime. It is excluded from Pages. Keep it only if unattended local pushes still need it.
4. **Repository records — intentional but public if the repo is public:** reports, editorial history, overrides, revisions, and build documentation remain tracked for auditability. They are excluded from Pages. Review whether repository-level visibility is acceptable before making the repository public.
5. **Post-deploy rollback limitation:** pre-deploy gates fail closed, so the last good Pages deployment remains live whenever build, scanning, or local outsider checks fail. The post-deploy outsider check also fails the workflow, but GitHub Pages does not provide this workflow with a safe automatic rollback primitive. If it detects a hosting-only issue, manually redeploy the last known-good commit.

## Historical scan policy

The built-in scanner checks every text blob reachable from every Git ref for configured secret values, common provider patterns, and credential-bearing URLs. CI also runs pinned Gitleaks over full history (`fetch-depth: 0`). A future historical finding must be recorded by blob/hash and secret name only, then the affected credential must be revoked and rotated. History rewriting is optional, disruptive, and requires separate approval; rotation is mandatory because rewriting does not invalidate a copied credential.

## WHOIS privacy

At the domain registrar, confirm that registrant/contact redaction or WHOIS privacy is enabled for `tldrmacro.com`. Verify the public result through ICANN Lookup after DNS changes propagate. Do not place a personal street address, phone number, or personal email in public DNS records. No registrar setting was changed by this audit.

## Verification status

`npm run verify` passed on 2026-10-14. The local Gitleaks binary was not installed, so the local gate used the built-in full-history scanner; CI is configured to run pinned Gitleaks against both full Git history and the sanitized publish output. Publishing was intentionally not performed.
