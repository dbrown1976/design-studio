# Daniel Brown Design Studio

This repository is a persistent product-design studio for executable prototypes.
Git is the source of truth. Codex, V0, Cursor and other coding agents are editors
of prototype code; the Studio catalogue records project context, versions and
decisions without depending on any one tool.

## Two-layer model

The Studio has two layers:

1. **Catalogue** — project pages under `/projects/<slug>` explain the problem,
   current direction, versions, decisions and review questions.
2. **Playground** — executable prototypes may live in this repository, in a
   separate repository, or at an external deployment URL.

Do not force external prototype code into this repository merely so the Studio
can catalogue it.

## Before changing a connected prototype

1. Read the relevant project manifest in `projects/<slug>.json`.
2. Read any local prototype instructions in that prototype's repository.
3. Read the shared Design Studio context when it applies.
4. Identify the accepted Current version before starting an exploration.
5. Scope the change to the requested design question.

## Safe iteration rule

> Start new exploration work from the accepted baseline, preserve existing versions, restrict changes to the requested area and verify that previously accepted screens have not regressed.

Creating a Candidate must never overwrite the Current version. Promotion to
Current is an explicit project-metadata decision.

## Project catalogue model

- Every project has one permanent slug and one stable Studio route:
  `/projects/<slug>`.
- Canonical project metadata lives in one file:
  `projects/<slug>.json`.
- Project status is one of `exploring`, `testing`, `resolved`, `archived`.
- Prototype version status is one of `Current`, `Candidate`, `Rejected`,
  `Archived`.
- Exactly one version is Current and `currentVersion` must reference it.
- Versions can point to internal Studio/playground routes or external deployments.
- A project may optionally link to a separate GitHub repository.
- `apps/studio/src/generated/projects.json` is generated. Never hand edit it.
- `schemas/project.schema.json` is the metadata contract and the registry build
  performs additional cross-reference validation.

## Prototype code in this repository

- `apps/studio/` is the catalogue UI.
- Existing executable prototypes under `apps/<slug>/` remain independently
  buildable examples, but a project no longer needs a local app to exist.
- `prototype.json` files inside local apps are implementation-local metadata;
  they are not the canonical Studio project catalogue.
- Shared design context belongs in `context/`.
- Trusted production references belong in `blueprints/`.
- Shared code belongs in `packages/` only when genuinely reused.

## Prototype rules

- Prefer real interactive states over screenshots when behaviour matters.
- Preserve accepted baselines while exploring alternatives.
- Record what changed, the question being tested and the selection/rejection
  rationale for each meaningful version.
- Keep consequential design decisions and rejected directions in the project
  decision log.
- Make system state, exceptions and required actions visible and actionable.
- Do not hide workflow information merely to make a screen shorter.

## Development workflow

`explore → create coded alternatives → deploy → share → collect feedback → select and refine`

The Studio supports this workflow by preserving project context and links. It is
not an agent orchestrator or project-management system.

## Explicitly out of scope for this phase

Do not add agent orchestration, worktree management, commenting, DOM annotation
or automated model-to-model review to the Studio itself. These belong to the
development workflow or future integrations.

## Git and deployment

- Do not commit generated deployment credentials or `.vercel/` directories.
- Feature branches can produce Vercel Preview Deployments when a prototype repo
  is connected to Vercel.
- Prototype repositories may deploy independently of the Studio.
- The Studio must remain tool-agnostic: V0, Codex, Cursor or another coding agent
  can work on a prototype without changing the project model.
