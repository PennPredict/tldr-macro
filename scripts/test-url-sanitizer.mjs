import assert from "node:assert/strict";
import {hasCredentialQuery, sanitizeUrl} from "./security-utils.mjs";

const credentialNames = ["api" + "_key", "access" + "_token", "sign" + "ature"];
const cases = credentialNames.map((name, index) => {
  const url = new URL(index === 0 ? "https://api.stlouisfed.org/fred/series/observations" : "https://example.com/data");
  if (index === 0) url.searchParams.set("series_id", "GDP");
  url.searchParams.set(name, "secret-example");
  return url.toString();
});
const userInfo = new URL("https://example.com/data");
userInfo.username = "user";
userInfo.password = "secret-example";
cases.push(userInfo.toString());

for (const input of cases) {
  assert.equal(hasCredentialQuery(input), true);
  const sanitized = sanitizeUrl(input);
  assert.equal(sanitized.includes("secret-example"), false);
  assert.equal(sanitized.includes("REDACTED"), true);
}

assert.equal(hasCredentialQuery("https://fred.stlouisfed.org/series/GDP"), false);
assert.equal(sanitizeUrl("https://fred.stlouisfed.org/series/GDP"), "https://fred.stlouisfed.org/series/GDP");
console.log("Credential-bearing URL sanitization tests passed.");
