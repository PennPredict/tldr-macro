import {spawnSync} from "node:child_process";

const history = spawnSync("gitleaks", ["detect", "--source", ".", "--no-banner", "--redact"], {stdio: "inherit"});
if (history.error?.code === "ENOENT") {
  console.log("Gitleaks is not installed locally; the built-in full-history scanner remains active, and CI runs pinned Gitleaks scans.");
  process.exit(0);
}
if (history.status !== 0) process.exit(history.status ?? 1);
const output = spawnSync("gitleaks", ["dir", "publish", "--no-banner", "--redact"], {stdio: "inherit"});
if (output.status !== 0) process.exit(output.status ?? 1);
console.log("Gitleaks passed for full Git history and publish output.");
