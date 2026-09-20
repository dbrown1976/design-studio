import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectsDir = path.join(root, "projects");
const schemaPath = path.join(root, "schemas", "project.schema.json");
const output = path.join(root, "apps", "studio", "src", "generated", "projects.json");

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

function fail(file, message) {
  throw new Error(`${path.relative(root, file)}: ${message}`);
}

function validateProject(project, file) {
  if (!validate(project)) {
    const detail = validate.errors
      .map((error) => `${error.instancePath || "/"} ${error.message}`)
      .join("; ");
    fail(file, `schema validation failed: ${detail}`);
  }

  const filenameSlug = path.basename(file, ".json");
  if (project.slug !== filenameSlug) {
    fail(file, `slug "${project.slug}" must match filename "${filenameSlug}.json"`);
  }

  const versionIds = project.versions.map((version) => version.id);
  if (new Set(versionIds).size !== versionIds.length) {
    fail(file, "version ids must be unique");
  }

  if (!versionIds.includes(project.currentVersion)) {
    fail(file, `currentVersion "${project.currentVersion}" does not reference a version id`);
  }

  const currentVersions = project.versions.filter((version) => version.status === "Current");
  if (currentVersions.length !== 1) {
    fail(file, `exactly one version must have status Current; found ${currentVersions.length}`);
  }

  if (currentVersions[0].id !== project.currentVersion) {
    fail(file, `currentVersion must reference the version whose status is Current`);
  }

  for (const version of project.versions) {
    const url = version.deploymentUrl;
    if (!(url.startsWith("/") || /^https?:\/\//.test(url))) {
      fail(file, `version "${version.id}" deploymentUrl must be an internal route or http(s) URL`);
    }
  }
}

const projects = fs.readdirSync(projectsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map((entry) => {
    const file = path.join(projectsDir, entry.name);
    const project = JSON.parse(fs.readFileSync(file, "utf8"));
    validateProject(project, file);
    return {
      ...project,
      projectPath: `/projects/${project.slug}`
    };
  });

const slugs = projects.map((project) => project.slug);
if (new Set(slugs).size !== slugs.length) {
  throw new Error("Project slugs must be unique.");
}

projects.sort((a, b) =>
  (b.updated || "").localeCompare(a.updated || "") ||
  a.title.localeCompare(b.title)
);

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(projects, null, 2) + "\n");
console.log(`Generated ${path.relative(root, output)} with ${projects.length} projects.`);
