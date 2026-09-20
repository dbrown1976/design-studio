# Daniel Brown Design Studio

A repository-driven catalogue and playground for executable product-design work.

The Studio deliberately separates **project context** from **prototype hosting**.
Projects have permanent Studio pages; prototype versions can live in this
repository or in independent GitHub/Vercel projects.

## Model

### Catalogue

Each project is one validated manifest in:

```text
projects/<slug>.json
```

and has a stable Studio route:

```text
/projects/<slug>
```

The project page makes the Current recommended prototype obvious while preserving
Candidate, Rejected and Archived versions, focused review questions, a concise
decision log and a copyable Markdown context block for AI coding tools.

### Playground

A version can point to:

- an internal Studio or playground route;
- an independently deployed Vercel/V0 prototype;
- another deployment URL.

A project may optionally link to a separate repository. The Studio does not
require prototype source to live here.

Internal coded explorations can still use routes such as:

```text
/playground/campaign-list
/playground/campaign-list/v2
```

## Current reference projects

- **AI Campaign Production** is the first project using the new catalogue model.
  Its project manifest links to the independent
  `dbrown1976/automating-campaign-production` repository while preserving the
  current accepted baseline.
- **Needs Remediation** demonstrates a baseline, rejected exploration, candidate
  and selected Current version.

## Run locally

```bash
npm install
npm run dev
```

The registry is regenerated and validated before the Studio starts.

## Add a project

The lightweight path is one manifest:

```bash
npm run studio:new-project -- workflow-builder
npm run registry
```

Edit `projects/workflow-builder.json`. You do not need to construct a page
manually.

If the project also needs a coded app inside this repository, the existing
prototype scaffolder remains available:

```bash
npm run studio:new -- workflow-builder
```

## Metadata and validation

`schemas/project.schema.json` defines the project contract. The registry build
fails clearly for malformed manifests, invalid slugs, duplicate version ids,
missing version references, multiple Current versions or invalid deployment
references.

Project statuses:

- `exploring`
- `testing`
- `resolved`
- `archived`

Version lifecycle:

- `Current`
- `Candidate`
- `Rejected`
- `Archived`

Creating an exploration must not overwrite Current. Promotion is an explicit
metadata change.

## Development workflow

```text
explore → create coded alternatives → deploy → share → collect feedback → select and refine
```

Safe iteration rule:

> Start new exploration work from the accepted baseline, preserve existing versions, restrict changes to the requested area and verify that previously accepted screens have not regressed.

See `docs/WORKFLOW.md` for the short operating model.

## AI coding context

Every project page exposes a copyable Markdown summary containing:

- problem and intended outcome;
- users and workflow;
- current design direction;
- non-negotiable constraints;
- accepted decisions;
- open questions;
- prototype and repository links.

It is intended to be pasted into Codex, Claude, Cursor, V0 or another coding
agent without changing the Studio's underlying model.

## Scope

This phase intentionally does **not** add commenting, DOM annotation, agent
orchestration, worktree management or automated model-to-model review. Focused
review questions plus clear links to live prototypes are enough for the initial
Studio.

## Repository structure

- `projects/` — canonical project manifests.
- `schemas/` — validation contract.
- `apps/studio/` — catalogue UI.
- `apps/*` — optional independently executable local prototype apps.
- `context/` — durable design principles and interaction guidance.
- `blueprints/` — trusted product references.
- `scripts/build-registry.mjs` — validates manifests and builds the catalogue.
- `scripts/new-project.mjs` — creates a lightweight project manifest.
- `AGENTS.md` — repository and safe-iteration instructions.
