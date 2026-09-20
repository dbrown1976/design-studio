import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appsDir = path.join(root, "apps");
const output = path.join(appsDir, "studio", "src", "generated", "prototypes.json");
const required = ["slug", "title", "description", "status", "fidelity", "updated", "productionPath"];

const manifests = [];
for (const entry of fs.readdirSync(appsDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === "studio") continue;
  const manifestPath = path.join(appsDir, entry.name, "prototype.json");
  if (!fs.existsSync(manifestPath)) continue;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const key of required) if (!manifest[key]) throw new Error(`${path.relative(root, manifestPath)} is missing required field: ${key}`);
  if (manifest.slug !== entry.name) throw new Error(`Manifest slug ${manifest.slug} must match apps/${entry.name}`);
  if (manifest.productionPath !== `/${manifest.slug}`) throw new Error(`${manifest.slug}: productionPath must be /${manifest.slug}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.updated)) throw new Error(`${manifest.slug}: updated must use YYYY-MM-DD`);
  manifests.push(manifest);
}
const slugs = manifests.map((item) => item.slug);
if (new Set(slugs).size !== slugs.length) throw new Error("Prototype slugs must be unique.");
manifests.sort((a, b) => (b.updated || "").localeCompare(a.updated || "") || a.title.localeCompare(b.title));
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(manifests, null, 2) + "\n");
console.log(`Generated ${path.relative(root, output)} with ${manifests.length} prototypes.`);
