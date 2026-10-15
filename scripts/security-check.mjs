import {execFileSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  hasCredentialQuery,
  isTextFile,
  publicPrefixPattern,
  safeFinding,
  secretEncodings,
  secretEnvironment,
  secretNamePattern,
  sha256,
  walkFiles,
} from "./security-utils.mjs";

const root = process.cwd();
const outputRoot = path.resolve(root, process.env.SECURITY_OUTPUT_DIR ?? "publish");
const allowlist = JSON.parse(fs.readFileSync(path.join(root, "config/publish-allowlist.json"), "utf8"));
const reviewed = JSON.parse(fs.readFileSync(path.join(root, "config/security-allowlist.json"), "utf8")).reviewedFindings ?? [];
const findings = [];
const inventory = new Map();
const sourceSkip = new Set([".git", ".next", ".security", "dist", "node_modules", "out", "outputs", "publish", "reports", "work"]);
const providerPatterns = [
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ["GitHub token", /\b(?:gh[opusr]_[A-Za-z0-9_]{30,}|github_pat_[A-Za-z0-9_]{20,})\b/g],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/g],
  ["OpenAI API key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g],
  ["private key", /-----BEGIN (?:EC |OPENSSH |RSA )?PRIVATE KEY-----/g],
];

function relative(file) {
  const normalized = path.resolve(file);
  const codexHome = process.env.CODEX_HOME ? path.resolve(process.env.CODEX_HOME) : path.join(os.homedir(), ".codex");
  if (normalized.startsWith(codexHome + path.sep)) return `$CODEX_HOME/${path.relative(codexHome, normalized).split(path.sep).join("/")}`;
  if (normalized.startsWith(root + path.sep)) return path.relative(root, normalized).split(path.sep).join("/");
  return "external-file";
}

function sourceFiles(directory = root) {
  const files = [];
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.isDirectory() && sourceSkip.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...sourceFiles(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

function record(kind, file, name) {
  findings.push(safeFinding(kind, relative(file), name));
}

function inventoryName(name, file, runtime, service = "unspecified") {
  if (!inventory.has(name)) inventory.set(name, {name, files: new Set(), runtime: new Set(), service: new Set()});
  const item = inventory.get(name);
  item.files.add(relative(file)); item.runtime.add(runtime); item.service.add(service);
}

function scanText(file, text, scope) {
  for (const {name, value} of secretEnvironment()) {
    if (secretEncodings(value).some((encoding) => text.includes(encoding))) record("exact-secret-value", file, name);
  }
  for (const [name, pattern] of providerPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) record("provider-secret-pattern", file, name);
  }
  const urlPattern = /https?:\/\/[^\s"'<>]+/g;
  for (const match of text.matchAll(urlPattern)) if (hasCredentialQuery(match[0])) record("credential-bearing-url", file, "credential query parameter");
  const envPattern = /(?:process\.env\.|import\.meta\.env\.)([A-Z][A-Z0-9_]*)|(?:secrets\.)([A-Z][A-Z0-9_]*)/g;
  for (const match of text.matchAll(envPattern)) {
    const name = match[1] ?? match[2];
    inventoryName(name, file, scope === "client" ? "browser-build" : scope, "environment");
    if (scope === "client") record("client-environment-reference", file, name);
    if (publicPrefixPattern.test(name) && secretNamePattern.test(name)) record("public-prefixed-secret-name", file, name);
  }
  for (const match of text.matchAll(/\b((?:NEXT_PUBLIC_|VITE_|PUBLIC_|REACT_APP_)[A-Z0-9_]+)\b/g)) {
    if (secretNamePattern.test(match[1])) record("public-prefixed-secret-name", file, match[1]);
  }
  const candidatePattern = /["']([A-Za-z0-9_+\/=.-]{40,})["']/g;
  for (const match of text.matchAll(candidatePattern)) {
    const value = match[1];
    const context = text.slice(Math.max(0, (match.index ?? 0) - 100), match.index ?? 0);
    if (!/(?:api.?key|token|secret|password|auth|credential|signature|sid)\W{0,24}(?:=|:)\s*$/i.test(context)) continue;
    if (/^[a-f0-9]{40,}$/i.test(value) || /^[-\w.]+\.(?:js|css|woff2)$/.test(value)) continue;
    const counts = new Map(); for (const char of value) counts.set(char, (counts.get(char) ?? 0) + 1);
    const entropy = [...counts.values()].reduce((sum, count) => {const p = count / value.length; return sum - p * Math.log2(p);}, 0);
    if (entropy >= 4.5) record("high-entropy-string", file, "generic high-entropy candidate");
  }
}

function pathAllowed(file) {
  if (!file || file.split("/").some((segment) => segment.startsWith("."))) return false;
  if (allowlist.allowedExactPaths.includes(file)) return true;
  if (allowlist.allowedRootPatterns.some((pattern) => new RegExp(pattern).test(file))) return true;
  return Object.entries(allowlist.allowedPrefixes).some(([prefix, extensions]) => file.startsWith(prefix) && extensions.includes(path.extname(file).toLowerCase()));
}

for (const file of sourceFiles()) {
  if (!isTextFile(file)) continue;
  const rel = relative(file);
  const scope = rel.startsWith("app/") ? "client" : rel.startsWith(".github/") ? "ci" : "build";
  scanText(file, fs.readFileSync(file, "utf8"), scope);
}

for (const file of sourceFiles(path.join(root, ".github", "workflows"))) {
  if (!/\.ya?ml$/i.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  if (/\bpull_request_target\s*:/i.test(text)) record("unsafe-workflow-trigger", file, "pull_request_target");
  for (const match of text.matchAll(/\buses:\s*([\w.-]+\/[\w.-]+)@([^\s#]+)/g)) {
    if (!/^[a-f0-9]{40}$/i.test(match[2])) record("unpinned-action", file, match[1]);
  }
  if (/\bset\s+-x\b/.test(text)) record("unsafe-workflow-logging", file, "shell tracing");
}

const automationRoot = path.join(process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex"), "automations");
for (const file of walkFiles(automationRoot).filter((candidate) => path.basename(candidate) === "automation.toml")) {
  scanText(file, fs.readFileSync(file, "utf8"), "automation");
}

for (const file of walkFiles(outputRoot)) {
  const rel = path.relative(outputRoot, file).split(path.sep).join("/");
  const extension = path.extname(rel).toLowerCase();
  const segments = rel.split("/");
  if (!pathAllowed(rel)) record("publish-allowlist", file, "path not permitted");
  if (segments.some((segment) => allowlist.forbiddenSegments.includes(segment))) record("forbidden-publish-segment", file, "forbidden directory");
  if (allowlist.forbiddenBasenames.includes(path.basename(rel)) || allowlist.forbiddenExtensions.includes(extension)) record("forbidden-publish-file", file, "forbidden file type");
  if (isTextFile(file)) {
    const text = fs.readFileSync(file, "utf8");
    scanText(file, text, "published-output");
    if (/sourceMappingURL|\.map(?:[?#"'\s]|$)/i.test(text)) record("source-map-reference", file, "source map reference");
    if (/\/(?:Users|home)\/|[A-Z]:\\Users\\|\b127\.0\.0\.1\b/i.test(text)) record("private-or-debug-metadata", file, "local path or loopback address");
    if (extension !== ".js" && /\blocalhost\b|\bTODO\b|\bFIXME\b/i.test(text)) record("private-or-debug-metadata", file, "local host or debug marker");
    const emails = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) ?? [];
    if (emails.length) record("published-email", file, "email address");
  }
  if (extension === ".png") {
    const text = fs.readFileSync(file).toString("latin1");
    if (/(?:eXIf|iTXt|tEXt|tIME|zTXt)/.test(text)) record("image-metadata", file, "PNG metadata chunk");
  }
  if (extension === ".svg") {
    const text = fs.readFileSync(file, "utf8");
    if (/<metadata\b|<!--|(?:inkscape|sodipodi|rdf|dc|cc):/i.test(text)) record("image-metadata", file, "SVG authoring metadata");
  }
}

function scanHistory() {
  let objects = [];
  try {
    const listing = execFileSync("git", ["rev-list", "--objects", "--all"], {cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024});
    const byObject = new Map();
    for (const line of listing.trim().split("\n")) {
      const separator = line.indexOf(" ");
      if (separator < 0) continue;
      const object = line.slice(0, separator), file = line.slice(separator + 1);
      if (isTextFile(file)) byObject.set(object, file);
    }
    objects = [...byObject.entries()];
  } catch {
    record("history-scan", root, "unable to enumerate Git history"); return;
  }
  for (const [object] of objects) {
    let buffer;
    try { buffer = execFileSync("git", ["cat-file", "blob", object], {cwd: root, maxBuffer: 8 * 1024 * 1024}); } catch { continue; }
    if (buffer.includes(0) || buffer.length > 8 * 1024 * 1024) continue;
    const text = buffer.toString("utf8");
    for (const {name, value} of secretEnvironment()) {
      if (secretEncodings(value).some((encoding) => text.includes(encoding))) findings.push({kind: "history-exact-secret-value", file: `git-blob:${object.slice(0, 12)}`, name});
    }
    for (const [name, pattern] of providerPatterns) { pattern.lastIndex = 0; if (pattern.test(text)) findings.push({kind: "history-provider-secret-pattern", file: `git-blob:${object.slice(0, 12)}`, name}); }
    const urls = text.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
    if (urls.some(hasCredentialQuery)) findings.push({kind: "history-credential-bearing-url", file: `git-blob:${object.slice(0, 12)}`, name: "credential query parameter"});
  }
}
scanHistory();

const today = new Date().toISOString().slice(0, 10);
const activeReview = new Set(reviewed.filter((item) => item.owner && item.reason && item.expires >= today).map((item) => item.fingerprint));
const unique = [...new Map(findings.map((finding) => {
  const fingerprint = sha256(`${finding.kind}|${finding.file}|${finding.name}`);
  return [fingerprint, {...finding, fingerprint}];
})).values()].filter((finding) => !activeReview.has(finding.fingerprint));

const inventoryOutput = [...inventory.values()].map((item) => ({
  name: item.name,
  files: [...item.files].sort(),
  runtime: [...item.runtime].sort(),
  service: [...item.service].sort(),
})).sort((a, b) => a.name.localeCompare(b.name));
console.log(`Security inventory: ${inventoryOutput.length} configuration name(s); ${secretEnvironment().length} secret-valued environment name(s) checked without printing values.`);
for (const item of inventoryOutput) console.log(`- ${item.name}: ${item.files.join(", ")} [${item.runtime.join(", ")}]`);
if (unique.length) {
  console.error(`Security checks failed with ${unique.length} finding(s):`);
  for (const finding of unique) console.error(`- ${finding.kind}: ${finding.file} (${finding.name}; fingerprint ${finding.fingerprint.slice(0, 12)})`);
  process.exit(1);
}
console.log("Security checks passed for source, automations, Git history, and publish output.");
