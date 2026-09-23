# Project, revision and exploration model

Design Studio has one unambiguous accepted baseline per project.

## Project

A project lives at `projects/<project-id>/project.json` and identifies its
`currentRevision`. The current revision is the baseline for all subsequent work.

## Sequential revisions

Revisions live under `projects/<project-id>/revisions/`.

```text
Accepted v1 → Candidate v2 → Accepted v2 → Candidate v3
```

A candidate never overwrites the current revision. Promotion is explicit. When a
candidate becomes current, the prior current revision becomes `superseded`.

Each revision records:

- identifier and name;
- previous revision;
- status: candidate, current, superseded or archived;
- summary of what changed;
- scope of the requested amendment;
- behaviour/design that must be preserved;
- deployment URLs;
- repository, branch, commit and optional pull-request provenance;
- validation/review status;
- date accepted.

## Exploration sets

Explorations live under `projects/<project-id>/explorations/`.

An exploration set always declares the accepted revision it branches from:

```text
Current v2
   └── Exploration: campaign status model
       ├── Direction A
       ├── Direction B
       ├── Direction C
       └── Direction D
```

Directions are alternatives, not competing current versions. Selecting a
direction does not silently replace the accepted revision. A selected direction
must be turned into a candidate revision before it can be promoted to current.

## Invariants

1. Every project has exactly one revision with `status: "current"`.
2. `project.currentRevision` points to that revision.
3. A revision's `previousRevision` must exist in the same project when non-null.
4. An exploration set's `basedOnRevision` must exist in the same project.
5. Exploration directions never become current directly.
6. Git is the source of truth; the Studio UI is a workspace over these contracts.
