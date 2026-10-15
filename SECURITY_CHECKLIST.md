# TL;DR Macro manual security checklist

Use this checklist when adding a data provider, changing deployment, or responding to a scan failure.

## Adding or changing a secret

- Store it in GitHub Actions Secrets, never in repository files, issue text, workflow arguments, source URLs, screenshots, or reports.
- Give it a descriptive non-public name such as `PROVIDER_API_KEY`; never use `NEXT_PUBLIC_*`, `VITE_*`, `PUBLIC_*`, or `REACT_APP_*` for credentials.
- Pass it only to the server-side/build step that needs it, preferably in an authorization header.
- Add the same secret name to the protected exact-value scan step in `.github/workflows/deploy-pages.yml` so raw, base64, and URL-encoded forms are checked.
- Ensure fetch errors and logs pass URLs through the sanitizer and never print request headers or response bodies that may echo credentials.
- Run `npm run verify` before committing or publishing.

## If a secret is detected

1. Stop the deployment; do not paste the value into chat, an issue, a report, or a commit message.
2. Identify only the provider, secret name, file/blob hash, and affected environment.
3. Revoke and rotate the credential at the provider immediately.
4. Replace the GitHub Actions secret with the rotated value.
5. Re-run `npm run verify` and the GitHub Actions workflow.
6. Decide separately whether history rewriting is necessary. Obtain approval first and coordinate with every clone/fork. Never treat rewriting as a substitute for rotation.

## Before making the repository public

- Review tracked reports, `data/history/`, `data/revisions.json`, `data/overrides.json`, `.openai/hosting.json`, and the desktop credential-helper script for repository-level visibility.
- Confirm the Git author email is the intended GitHub `noreply` address.
- Confirm branch protection and required status checks include the verify/deploy workflow.
- Confirm GitHub Pages is sourced from GitHub Actions, not from a branch folder.
- Confirm Actions logs are treated as public and contain no debugging or environment dumps.

## Domain privacy

- Confirm registrar WHOIS/contact privacy is enabled.
- Check the public result with ICANN Lookup.
- Keep personal addresses, phone numbers, and personal email addresses out of DNS and public site contact fields.

## Release gate

- `npm run verify` passes locally.
- The full-history and publish-output Gitleaks steps pass in CI.
- The uploaded artifact contains only paths allowed by `config/publish-allowlist.json`.
- The post-deploy outsider check passes for `https://tldrmacro.com`.
- If any gate fails, keep the last known-good deployment live and investigate without printing secret values.
