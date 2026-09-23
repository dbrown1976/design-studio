# Daniel Brown Design Studio

This repository is a persistent product-design studio for executable prototypes.
Git is the source of truth. Codex, V0 and other coding agents are editors of the
same repository; Vercel is the deployment surface.

## Before changing a prototype

1. Read `context/design-principles.md`.
2. Read `context/interaction-rules.md`.
3. Read `context/prototyping-rules.md`.
4. Read the target app's `prototype.json` and any local `AGENTS.md`.
5. Change only the requested prototype unless a shared rule/package genuinely
   needs to change.

## Repository model

- `apps/studio/` is the Studio index and metadata UI, not the place where
  prototype product code lives.
- Every executable prototype lives in its own `apps/<slug>/` directory.
- Every prototype MUST have a `prototype.json` manifest. `slug` must match its
  directory name.
- Shared design context belongs in `context/`.
- Trusted production references belong in `blueprints/`.
- Shared code belongs in `packages/` only when two or more prototypes genuinely
  use it. Do not prematurely centralise prototype code.
- `apps/studio/src/generated/prototypes.json` is generated. Never hand edit it.

## Prototype rules

- Prefer real interactive states over screenshots or static mock cards.
- Preserve a prototype's exploratory freedom. Do not make it production-grade
  merely for architectural neatness.
- Use fidelity stages deliberately: `baseline`, `exploration`, `hifi`.
- Record consequential implementation intent in the manifest's `handoff` field
  or in a prototype-local handoff document.
- Do not hide important workflow information merely to make a screen shorter.
- Make system status, exceptions and required actions visible and actionable.

## Git and deployment

- Do not commit generated deployment credentials or `.vercel/` directories.
- A feature branch should produce a Vercel Preview Deployment once GitHub and
  Vercel are connected.
- Merging to the production branch should produce the production deployment.
- Each app is intended to be independently deployable from this monorepo.

## Project workspace model

Projects live under `projects/<project-id>/`.

- `project.json` identifies exactly one `currentRevision`.
- Sequential revisions live under `revisions/`.
- Divergent exploration sets live under `explorations/`.
- Creating a candidate must never overwrite the current revision.
- Promoting a candidate to current is explicit; the previous current becomes superseded.
- Exploration sets branch from a named accepted revision. Their directions are alternatives, not current versions.
- A selected exploration direction must become a candidate revision before it can become current.

Before changing a project, read its project record and current revision in addition to the prototype and shared context.
