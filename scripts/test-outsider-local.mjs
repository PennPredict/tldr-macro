import {spawn} from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const port = 4188;
const base = `http://127.0.0.1:${port}`;
const root = path.resolve("publish");
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? "/", base).pathname);
  const requested = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const file = path.resolve(root, `.${requested}`);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404).end("Not found"); return;
  }
  const types = {".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".txt": "text/plain"};
  response.writeHead(200, {"content-type": types[path.extname(file)] ?? "application/octet-stream"});
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve, reject) => server.listen(port, "127.0.0.1", resolve).on("error", reject));
try {
  const check = spawn(process.execPath, ["scripts/outsider-check.mjs", base], {stdio: "inherit"});
  const status = await new Promise((resolve) => check.on("exit", resolve));
  if (status !== 0) process.exitCode = status ?? 1;
} finally {
  server.close();
}
