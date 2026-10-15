import fs from "node:fs";
import {hasCredentialQuery, secretEncodings, secretEnvironment} from "./security-utils.mjs";

const file = process.argv[2];
if (!file || !fs.existsSync(file)) throw new Error("CI log file is missing.");
const text = fs.readFileSync(file, "utf8");
const findings = [];
for (const {name, value} of secretEnvironment()) {
  if (secretEncodings(value).some((encoding) => text.includes(encoding))) findings.push(name);
}
const urls = text.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
if (urls.some(hasCredentialQuery)) findings.push("credential-bearing URL");
if (/\bBearer\s+[A-Za-z0-9._~+/=-]+/i.test(text)) findings.push("bearer credential");
if (findings.length) {
  console.error(`CI log scan failed for: ${[...new Set(findings)].join(", ")}. Values were not printed.`);
  process.exit(1);
}
console.log("CI log scan passed.");
