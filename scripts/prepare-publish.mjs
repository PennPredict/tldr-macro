import fs from "node:fs";
import path from "node:path";
import {walkFiles} from "./security-utils.mjs";

const root = process.cwd();
const sourceRoot = path.resolve(root, process.argv[2] ?? "out");
const publishRoot = path.resolve(root, process.argv[3] ?? "publish");
const allowlist = JSON.parse(fs.readFileSync(path.join(root, "config/publish-allowlist.json"), "utf8"));
const internalThreadPath=/(^|\/)(thread-approvals\.json|thread-evidence(?:\/|$)|THREAD_REPORT\.md|THREAD_RECHECK\.md)$/i;

function relative(file) {
  return path.relative(sourceRoot, file).split(path.sep).join("/");
}

function allowed(file) {
  if (internalThreadPath.test(file)) return false;
  if (!file || file.split("/").some((segment) => segment.startsWith("."))) return false;
  if (allowlist.allowedExactPaths.includes(file)) return true;
  if (allowlist.allowedRootPatterns.some((pattern) => new RegExp(pattern).test(file))) return true;
  return Object.entries(allowlist.allowedPrefixes).some(([prefix, extensions]) =>
    file.startsWith(prefix) && extensions.includes(path.extname(file).toLowerCase()),
  );
}

function stripPngMetadata(buffer) {
  const signature = buffer.subarray(0, 8);
  if (signature.toString("hex") !== "89504e470d0a1a0a") throw new Error("Invalid PNG image in publish input");
  const keep = [signature];
  let offset = 8;
  const metadata = new Set(["eXIf", "iTXt", "tEXt", "tIME", "zTXt"]);
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > buffer.length) throw new Error("Truncated PNG image in publish input");
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    if (!metadata.has(type)) keep.push(buffer.subarray(offset, end));
    offset = end;
  }
  return Buffer.concat(keep);
}

function stripSvgMetadata(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata\b[\s\S]*?<\/metadata>/gi, "")
    .replace(/\s(?:sodipodi|inkscape|rdf|dc|cc):[^=\s]+=(?:"[^"]*"|'[^']*')/gi, "");
}

if (!fs.existsSync(sourceRoot)) throw new Error(`Build output is missing: ${path.relative(root, sourceRoot)}`);
if (fs.existsSync(publishRoot)) {
  const archiveRoot = path.join(root, ".security", "staging-backups");
  fs.mkdirSync(archiveRoot, {recursive: true});
  const archive = path.join(archiveRoot, `publish-${Date.now()}-${process.pid}`);
  fs.renameSync(publishRoot, archive);
}
fs.mkdirSync(publishRoot, {recursive: true});

const copied = new Set();
for (const source of walkFiles(sourceRoot)) {
  const file = relative(source);
  if (!allowed(file)) continue;
  const destination = path.join(publishRoot, file);
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  const extension = path.extname(file).toLowerCase();
  if (extension === ".png") fs.writeFileSync(destination, stripPngMetadata(fs.readFileSync(source)));
  else if (extension === ".svg") fs.writeFileSync(destination, stripSvgMetadata(fs.readFileSync(source, "utf8")));
  else fs.copyFileSync(source, destination);
  copied.add(file);
}

const stale = walkFiles(publishRoot).map((file) => path.relative(publishRoot, file).split(path.sep).join("/")).filter((file) => !copied.has(file));
if (stale.length) {
  console.error(`Publish staging contains ${stale.length} stale or non-allowlisted file(s); use a clean staging directory.`);
  process.exit(1);
}
if (!copied.has("index.html")) throw new Error("Publish staging is missing index.html");
const leakedThreadFiles=walkFiles(publishRoot).map((file)=>path.relative(publishRoot,file).split(path.sep).join("/")).filter((file)=>internalThreadPath.test(file));
if(leakedThreadFiles.length)throw new Error(`Internal thread files reached publish staging: ${leakedThreadFiles.join(", ")}`);
console.log(`Prepared ${copied.size} allowlisted files for publishing.`);
