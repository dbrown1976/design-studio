import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appsDir = path.join(root, "apps");
const projectsDir = path.join(root, "projects");
const generatedDir = path.join(appsDir, "studio", "src", "generated");
const prototypeOutput = path.join(generatedDir, "prototypes.json");
const projectOutput = path.join(generatedDir, "projects.json");
const prototypeRequired = ["slug", "title", "description", "status", "fidelity", "updated", "productionPath"];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function jsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(dir, entry.name));
}

const manifests = [];
for (const entry of fs.readdirSync(appsDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === "studio") continue;
  const manifestPath = path.join(appsDir, entry.name, "prototype.json");
  if (!fs.existsSync(manifestPath)) continue;
  const manifest = readJson(manifestPath);
  for (const key of prototypeRequired) {
    if (!manifest[key]) throw new Error(`${path.relative(root, manifestPath)} is missing required field: ${key}`);
  }
  if (manifest.slug !== entry.name) throw new Error(`Manifest slug ${manifest.slug} must match apps/${entry.name}`);
  if (manifest.productionPath !== `/${manifest.slug}`) throw new Error(`${manifest.slug}: productionPath must be /${manifest.slug}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.updated)) throw new Error(`${manifest.slug}: updated must use YYYY-MM-DD`);
  manifests.push(manifest);
}
const slugs = manifests.map((item) => item.slug);
if (new Set(slugs).size !== slugs.length) throw new Error("Prototype slugs must be unique.");
manifests.sort((a, b) => (b.updated || "").localeCompare(a.updated || "") || a.title.localeCompare(b.title));

const projects = [];
if (fs.existsSync(projectsDir)) {
  for (const entry of fs.readdirSync(projectsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const projectDir = path.join(projectsDir, entry.name);
    const projectPath = path.join(projectDir, "project.json");
    if (!fs.existsSync(projectPath)) continue;
    const project = readJson(projectPath);
    if (project.id !== entry.name) throw new Error(`Project id ${project.id} must match projects/${entry.name}`);
    if (!manifests.some((item) => item.slug === project.prototypeSlug)) {
      throw new Error(`${project.id}: prototypeSlug ${project.prototypeSlug} does not match a prototype manifest`);
    }

    const revisions = jsonFiles(path.join(projectDir, "revisions")).map(readJson);
    const revisionIds = new Set(revisions.map((item) => item.id));
    const current = revisions.filter((item) => item.status === "current");
    if (current.length !== 1) throw new Error(`${project.id}: expected exactly one current revision, found ${current.length}`);
    if (current[0].id !== project.currentRevision) {
      throw new Error(`${project.id}: currentRevision must point to the revision whose status is current`);
    }
    for (const revision of revisions) {
      if (revision.previousRevision && !revisionIds.has(revision.previousRevision)) {
        throw new Error(`${project.id}/${revision.id}: previousRevision ${revision.previousRevision} does not exist`);
      }
    }

    const explorationSets = jsonFiles(path.join(projectDir, "explorations")).map(readJson);
    for (const set of explorationSets) {
      if (!revisionIds.has(set.basedOnRevision)) {
        throw new Error(`${project.id}/${set.id}: basedOnRevision ${set.basedOnRevision} does not exist`);
      }
      if (set.selectedDirectionId && !set.directions.some((direction) => direction.id === set.selectedDirectionId)) {
        throw new Error(`${project.id}/${set.id}: selectedDirectionId does not match a direction`);
      }
    }

    revisions.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
    explorationSets.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    projects.push({ ...project, revisions, explorationSets });
  }
}
projects.sort((a, b) => (b.updated || "").localeCompare(a.updated || "") || a.title.localeCompare(b.title));

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(prototypeOutput, JSON.stringify(manifests, null, 2) + "\n");
fs.writeFileSync(projectOutput, JSON.stringify(projects, null, 2) + "\n");
console.log(`Generated ${path.relative(root, prototypeOutput)} with ${manifests.length} prototypes.`);
console.log(`Generated ${path.relative(root, projectOutput)} with ${projects.length} projects.`);
