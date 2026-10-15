import {chromium} from "playwright";
import {hasCredentialQuery, isTextFile, sanitizeUrl, secretEncodings, secretEnvironment} from "./security-utils.mjs";

const base = new URL(process.argv[2] ?? process.env.OUTSIDER_BASE_URL ?? "http://127.0.0.1:4173");
if (hasCredentialQuery(base.toString()) || base.username || base.password) throw new Error("Outsider-check URL must not contain credentials.");

const failures = [];
const requests = new Map();
const sensitivePaths = [
  "/.env", "/.git/config", "/.github/workflows/deploy-pages.yml", "/package.json",
  "/package-lock.json", "/config/publish-allowlist.json", "/data/revisions.json",
  "/reports/build-report.json", "/scripts/security-check.mjs", "/SECURITY_REPORT.md",
  "/AUTOMATION.md", "/README.md", "/next.config.ts",
];
const credentialPattern = /(?:[?&](?:api_key|apikey|key|token|access_token|auth|signature|password|sid)=|\bBearer\s+[A-Za-z0-9._~+/=-]+)/i;
const privatePathPattern = /\/(?:Users|home)\/|[A-Z]:\\Users\\|\b127\.0\.0\.1\b|sourceMappingURL|\.map(?:[?#"'\s]|$)/i;
const debugMarkerPattern = /\blocalhost\b|\bTODO\b|\bFIXME\b/i;

for (const pathname of sensitivePaths) {
  const response = await fetch(new URL(pathname, base), {redirect: "manual"});
  if (![403, 404].includes(response.status)) failures.push({kind: "sensitive-path", path: pathname, status: response.status});
}

const browser = await chromium.launch({headless: true});
try {
  const page = await browser.newPage();
  page.on("request", (request) => {
    const url = request.url();
    let origin = "invalid";
    try { origin = new URL(url).origin; } catch {}
    requests.set(sanitizeUrl(url), {origin, thirdParty: origin !== base.origin, credentialed: hasCredentialQuery(url) || credentialPattern.test(url)});
  });
  await page.goto(base.toString(), {waitUntil: "networkidle"});
  const assets = await page.evaluate(() => [...new Set([
    location.href,
    ...[...document.querySelectorAll("script[src],link[href]")].map((node) => node.src || node.href),
  ])]);
  for (const asset of assets) {
    let url;
    try { url = new URL(asset, base); } catch { continue; }
    if (url.origin !== base.origin) continue;
    const response = await fetch(url);
    if (!response.ok) { failures.push({kind: "asset-response", path: url.pathname, status: response.status}); continue; }
    const type = response.headers.get("content-type") ?? "";
    if (!/(?:html|javascript|json|css|text|svg)/i.test(type) && !isTextFile(url.pathname)) continue;
    const text = await response.text();
    if (credentialPattern.test(text)) failures.push({kind: "credential-pattern", path: url.pathname});
    if (privatePathPattern.test(text) || (!url.pathname.endsWith(".js") && debugMarkerPattern.test(text))) failures.push({kind: "private-or-debug-metadata", path: url.pathname});
    for (const {name, value} of secretEnvironment()) {
      if (secretEncodings(value).some((encoding) => text.includes(encoding))) failures.push({kind: "exact-secret-value", path: url.pathname, name});
    }
  }
} finally {
  await browser.close();
}

for (const [url, details] of requests) {
  const label = details.thirdParty ? "third-party" : "same-origin";
  console.log(`- ${label}: ${url}`);
  if (details.credentialed) failures.push({kind: "credentialed-request", url});
}
if (failures.length) {
  console.error(`Outsider check failed with ${failures.length} finding(s).`);
  for (const failure of failures) console.error(`- ${failure.kind}: ${failure.path ?? failure.url ?? "request"}${failure.name ? ` (${failure.name})` : ""}`);
  process.exit(1);
}
console.log(`Outsider check passed for ${base.origin}; sensitive paths are blocked and public assets contain no detected secrets or private metadata.`);
