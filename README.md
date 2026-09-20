# Daniel Brown Design Studio

A repository-driven catalogue and playground for executable product-design work.

The Studio has one rule at its centre: **every project has one clearly accepted
current revision**. New work either progresses that revision sequentially or
branches into a deliberate exploration set for comparing alternatives.

## Two modes of design work

### Sequential iteration — default

```text
Accepted v1 → Candidate v2 → Accepted v2 → Candidate v3
```

A candidate builds from the current accepted revision and never overwrites it.
Promotion to current is explicit. Once accepted, that revision becomes the
baseline for the next amendment.

### Divergent exploration

```text
Accepted v2
├── Option A
├── Option B
└── Option C
```

An exploration set branches from a named accepted revision to answer a specific
design or research question. Alternatives remain siblings inside that set. A
selected alternative must be promoted into a new candidate revision, reviewed,
and then explicitly accepted.

The Studio never presents unrelated prototypes as equally current.

## Catalogue and playground

### Catalogue

Each project is one validated manifest:

```text
projects/<slug>.json
```

with a stable page:

```text
/projects/<slug>
```

The page presents the accepted experience, candidate revision if present,
chronological revision history, exploration sets attached to their originating
revision, decisions and AI coding context.

### Playground

Revisions and exploration alternatives can link to:

- internal Studio/playground routes;
- independently deployed Vercel or V0 prototypes;
- other deployment URLs.

Prototype code can live in this repository or a separate GitHub repository.

## Current reference projects

- **AI Campaign Production** is modelled primarily as sequential iteration. Its
  accepted V0 handoff is the protected baseline for controlled Cursor hardening.
- **Needs Remediation** demonstrates the divergent model: an exploration set
  branches from accepted v1, the task-first direction is selected, and that
  direction is represented as accepted revision v2.

## Run locally

```bash
npm install
npm run dev
```

The registry is validated before the Studio starts.

## Add a project

```bash
npm run studio:new-project -- workflow-builder
npm run registry
```

This creates a single manifest with an accepted v1 baseline. No page needs to be
constructed manually.

If you also need a coded local app:

```bash
npm run studio:new -- workflow-builder
```

## Metadata lifecycle

Project status:

- `exploring`
- `testing`
- `resolved`
- `archived`

Revision status:

- `candidate`
- `current`
- `superseded`
- `archived`

Exploration alternatives do not use revision status because they are not part of
the accepted revision chain.

## Validation

`schemas/project.schema.json` plus `scripts/build-registry.mjs` fail clearly
for malformed manifests, invalid slugs, broken revision links, multiple current
revisions, invalid candidates, bad exploration baselines, invalid selected
alternatives or invalid deployment references.

## AI coding context

Each project page exports Markdown tailored to the current working mode.

Sequential mode includes the exact accepted baseline, requested amendment, what
may change, what must remain unchanged and acceptance checks.

Divergent mode includes the shared baseline, question, intended axes of
difference, constraints and evaluation criteria.

The context is designed to paste into Codex, Claude, Cursor, V0 or another coding
agent.

## Safe iteration rule

> Start new exploration work from the accepted baseline, preserve existing versions, restrict changes to the requested area and verify that previously accepted screens have not regressed.

## Scope boundary

The Studio records and presents the model. It does not create Git branches,
worktrees, commits or pull requests and does not implement commenting, DOM
annotation, agent orchestration, automated model-to-model review or a complex
version-control/content-management UI.

See `docs/ARCHITECTURE.md` and `docs/WORKFLOW.md`.
