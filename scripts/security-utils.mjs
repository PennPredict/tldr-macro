import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const credentialQueryNames = new Set([
  "api_key", "apikey", "key", "token", "access_token", "auth",
  "signature", "password", "sid",
]);

export const secretNamePattern = /(?:^|_)(?:api_?key|access_?token|auth|bearer|credential|password|private_?key|secret|signature|sid)(?:$|_)/i;
export const publicPrefixPattern = /^(?:NEXT_PUBLIC_|VITE_|PUBLIC_|REACT_APP_)/;

export function sanitizeUrl(value, replacement = "REDACTED") {
  try {
    const url = new URL(value);
    for (const name of [...url.searchParams.keys()]) {
      if (credentialQueryNames.has(name.toLowerCase())) url.searchParams.set(name, replacement);
    }
    if (url.username) url.username = replacement;
    if (url.password) url.password = replacement;
    return url.toString();
  } catch {
    return value.replace(
      /([?&](?:api_key|apikey|key|token|access_token|auth|signature|password|sid)=)[^&#\s]*/gi,
      `$1${replacement}`,
    );
  }
}

export function hasCredentialQuery(value) {
  try {
    const url = new URL(value);
    return [...url.searchParams.keys()].some((name) => credentialQueryNames.has(name.toLowerCase())) || Boolean(url.password || url.username.length >= 6);
  } catch {
    return /[?&](?:api_key|apikey|key|token|access_token|auth|signature|password|sid)=/i.test(value);
  }
}

export function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

export function secretEnvironment() {
  return Object.entries(process.env)
    .filter(([name, value]) => secretNamePattern.test(name) && typeof value === "string" && value.length >= 6)
    .map(([name, value]) => ({name, value}));
}

export function secretEncodings(value) {
  return [...new Set([
    value,
    Buffer.from(value).toString("base64"),
    encodeURIComponent(value),
  ].filter((candidate) => candidate.length >= 6))];
}

export function safeFinding(kind, file, name) {
  return {kind, file: file.split(path.sep).join("/"), name};
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function isTextFile(file) {
  return [".css", ".html", ".js", ".json", ".md", ".mjs", ".svg", ".ts", ".tsx", ".txt", ".yml", ".yaml"].includes(path.extname(file).toLowerCase());
}
