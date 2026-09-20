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

function validDeploymentUrl(url) {
  return typeof url === "string" && (url.startsWith("/") || /^https?:\/\//.test(url));
}

function assertNoRevisionCycles(project, file, revisionsById) {
  for (const revision of project.revisions) {
    const seen = new Set();
    let cursor = revision;
    while (cursor?.previousRevisionId) {
      if (seen.has(cursor.id)) fail(file, `revision chain contains a cycle at "${cursor.id}"`);
      seen.add(cursor.id);
      const previous = revisionsById.get(cursor.previousRevisionId);
      if (!previous) {
        fail(file, `revision "${cursor.id}" references missing previousRevisionId "${cursor.previousRevisionId}"`);
      }
      cursor = previous;
    }
  }
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

  const revisionIds = project.revisions.map((revision) => revision.id);
  if (new Set(revisionIds).size !== revisionIds.length) {
    fail(file, "revision ids must be unique");
  }

  const revisionsById = new Map(project.revisions.map((revision) => [revision.id, revision]));
  const currentRevisions = project.revisions.filter((revision) => revision.status === "current");
  if (currentRevisions.length !== 1) {
    fail(file, `exactly one revision must have status current; found ${currentRevisions.length}`);
  }

  if (!revisionsById.has(project.currentRevision)) {
    fail(file, `currentRevision "${project.currentRevision}" does not reference a revision id`);
  }

  if (currentRevisions[0].id !== project.currentRevision) {
    fail(file, "currentRevision must reference the revision whose status is current");
  }

  const candidates = project.revisions.filter((revision) => revision.status === "candidate");
  if (candidates.length > 1) {
    fail(file, `at most one candidate revision is supported initially; found ${candidates.length}`);
  }
  if (candidates.length === 1 && candidates[0].previousRevisionId !== project.currentRevision) {
    fail(file, `candidate revision "${candidates[0].id}" must build from currentRevision "${project.currentRevision}"`);
  }

  for (const revision of project.revisions) {
    if (!validDeploymentUrl(revision.deploymentUrl)) {
      fail(file, `revision "${revision.id}" deploymentUrl must be an internal route or http(s) URL`);
    }
    if (revision.previousRevisionId === revision.id) {
      fail(file, `revision "${revision.id}" cannot reference itself as previousRevisionId`);
    }
    if (["current", "superseded"].includes(revision.status) && !revision.dateAccepted) {
      fail(file, `accepted revision "${revision.id}" must record dateAccepted`);
    }
  }

  assertNoRevisionCycles(project, file, revisionsById);

  const explorationIds = project.explorationSets.map((set) => set.id);
  if (new Set(explorationIds).size !== explorationIds.length) {
    fail(file, "exploration set ids must be unique");
  }

  const explorationById = new Map(project.explorationSets.map((set) => [set.id, set]));
  for (const set of project.explorationSets) {
    const baseline = revisionsById.get(set.baselineRevisionId);
    if (!baseline) {
      fail(file, `exploration set "${set.id}" references missing baselineRevisionId "${set.baselineRevisionId}"`);
    }
    if (!["current", "superseded"].includes(baseline.status)) {
      fail(file, `exploration set "${set.id}" must branch from an accepted current or superseded revision`);
    }

    const alternativeIds = set.alternatives.map((alternative) => alternative.id);
    if (new Set(alternativeIds).size !== alternativeIds.length) {
      fail(file, `exploration set "${set.id}" alternative ids must be unique`);
    }

    for (const alternative of set.alternatives) {
      if (!validDeploymentUrl(alternative.deploymentUrl)) {
        fail(file, `exploration "${set.id}" alternative "${alternative.id}" has an invalid deploymentUrl`);
      }
    }

    if (set.selectedAlternativeId) {
      if (!alternativeIds.includes(set.selectedAlternativeId)) {
        fail(file, `exploration set "${set.id}" selectedAlternativeId does not reference an alternative`);
      }
      if (!set.selectionRationale) {
        fail(file, `exploration set "${set.id}" must record selectionRationale when an alternative is selected`);
      }
    }
  }

  if (project.workingMode.type === "exploration" && !explorationById.has(project.workingMode.explorationSetId)) {
    fail(file, `workingMode references missing exploration set "${project.workingMode.explorationSetId}"`);
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
