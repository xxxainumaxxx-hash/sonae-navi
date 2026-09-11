import contactHandler from './api/contact.js';
// ローカル確認用の静的サーバー（依存なし）
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("public/", import.meta.url));
const TYPES = { ".html": "text/html; charset=utf-8", ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };

createServer(async (req, res) => {
  if (req.url.split("?")[0].replace(/\/$/, "") === "/api/contact") return contactHandler(req, res);
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  try {
    const body = await readFile(join(ROOT, p));
    res.writeHead(200, { "Content-Type": TYPES[extname(p)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("404 " + p);
  }
}).listen(4321, () => console.log("http://localhost:4321"));
