# Daniel Brown Design Studio

This repository is a persistent product-design studio for executable prototypes.
Git is the source of truth. Codex, V0, Cursor and other coding agents edit
prototype code; the Studio records project context, accepted revisions,
exploration sets and decisions without depending on any one tool.

## Two-layer model

The Studio has two layers:

1. **Catalogue** — project pages under `/projects/<slug>` explain the problem,
   accepted experience, sequential revision history, exploration sets, decisions
   and review questions.
2. **Playground** — executable prototypes may live in this repository, in a
   separate repository, or at an external deployment URL.

Do not force external prototype code into this repository merely so the Studio
can catalogue it.

## Two modes of design work

### Sequential iteration — default

A revision progressively amends the accepted experience:

```text
Accepted v1 → Candidate v2 → Accepted v2 → Candidate v3
```

Every project has exactly one accepted `current` revision. At most one
`candidate` revision is supported initially. A candidate must identify the
accepted revision it continues from and must never overwrite it.

When a candidate is accepted:

1. preserve the outgoing accepted revision as history;
2. mark it `superseded`;
3. mark the candidate `current`;
4. update `currentRevision`;
5. record `dateAccepted`;
6. update the decision log where the decision is consequential.

That new current revision becomes the baseline for the next amendment.

### Divergent exploration

Use an exploration set only when deliberately comparing alternatives from a
named accepted revision:

```text
Accepted v2
├── Option A
├── Option B
└── Option C
```

Alternatives are siblings inside an exploration set. They are not revisions and
are never equally current with the accepted experience.

Selecting an alternative does not replace the baseline. The selected direction
must first be promoted into a new candidate revision, reviewed, and then
explicitly accepted.

## Before changing a connected prototype

1. Read the relevant project manifest in `projects/<slug>.json`.
2. Identify `currentRevision` and its accepted deployment.
3. Check `workingMode`:
   - `sequential`: implement only the requested amendment from the current
     accepted revision;
   - `exploration`: branch all alternatives from the exploration set's named
     baseline revision.
4. Read any local prototype instructions in that prototype's repository.
5. Scope changes to the requested design question.

## Safe iteration rule

> Start new exploration work from the accepted baseline, preserve existing versions, restrict changes to the requested area and verify that previously accepted screens have not regressed.

In this repository, “versions” in that rule means preserved accepted revisions
and named exploration alternatives.

## Project catalogue model

- Every project has one permanent slug and stable route: `/projects/<slug>`.
- Canonical metadata lives in `projects/<slug>.json`.
- Project status is one of `exploring`, `testing`, `resolved`, `archived`.
- Revision status is one of `candidate`, `current`, `superseded`, `archived`.
- Exactly one revision is `current`; `currentRevision` must reference it.
- Sequential revisions and divergent exploration alternatives are separate
  structures and must not be flattened into one list.
- Exploration sets must reference an accepted `current` or `superseded`
  baseline revision.
- Revisions and alternatives can point to internal routes or external
  deployments.
- Project and revision metadata may reference separate repositories, branches,
  commits or pull requests.
- `apps/studio/src/generated/projects.json` is generated. Never hand edit it.
- `schemas/project.schema.json` is the metadata contract; the registry build
  performs additional relationship validation.

## Prototype code in this repository

- `apps/studio/` is the catalogue UI.
- Existing executable prototypes under `apps/<slug>/` remain independently
  buildable examples, but a project does not need a local app to exist.
- `prototype.json` files inside local apps are implementation-local metadata;
  they are not the canonical Studio project catalogue.
- Shared design context belongs in `context/`.
- Trusted production references belong in `blueprints/`.
- Shared code belongs in `packages/` only when genuinely reused.

## Development workflow

`explore → create coded alternatives or a candidate revision → deploy → share → collect feedback → select and refine`

Sequential iteration is the default. Divergent exploration is deliberate and
temporary; selection feeds back into the revision chain.

## Implementation boundary

The Studio records and presents revision and exploration metadata. It does not
create Git branches, worktrees, commits or pull requests. Repository and
deployment references are metadata only.

Git and AI coding tools remain responsible for making and validating the
underlying code changes.

## Explicitly out of scope

Do not add agent orchestration, worktree management, commenting, DOM annotation,
automated model-to-model review or a complex version-control/content-management
interface to the Studio itself.
