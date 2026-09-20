# Architecture

The Design Studio is a catalogue over independently executable design work. It
separates project context from prototype hosting and distinguishes sequential
revision history from divergent exploration.

## Two layers

### Catalogue

`apps/studio` renders stable project pages at:

```text
/projects/<slug>
```

Each page is generated from one manifest in `projects/<slug>.json`.

### Playground

A revision or exploration alternative can point to:

- an internal route such as `/playground/campaign-list`;
- a route inside a local executable app;
- a Vercel/V0 or other external deployment.

Prototype source may live in this monorepo or in a separate repository. The
Studio is tool-agnostic.

## Design-work model

### Revisions

Revisions form the accepted product history.

```text
v1 current
  ↓
v2 candidate
  ↓ explicit acceptance
v1 superseded → v2 current
```

A revision records:

- identifier and name;
- previous revision identifier;
- lifecycle status;
- change summary;
- requested scope;
- behaviour/design to preserve;
- deployment URL;
- optional repository/source references;
- validation status and acceptance checks;
- date accepted.

Exactly one revision is current. At most one candidate is supported initially.

### Exploration sets

Exploration sets are deliberately divergent and attach to a named accepted
revision.

```text
accepted revision
├── alternative A
├── alternative B
└── alternative C
```

They record a shared question, why alternatives are needed, axes of difference,
constraints, evaluation criteria, prototype alternatives, testing findings and
an optional selected direction.

An alternative never becomes current directly. Selection creates design intent;
that direction must be promoted into a new candidate revision and accepted
through the sequential revision model.

## Repository shape

```text
design-studio/
├── AGENTS.md
├── projects/                    # canonical project manifests
├── schemas/
│   └── project.schema.json
├── apps/
│   ├── studio/                  # catalogue UI
│   ├── ai-campaign-production/
│   └── needs-remediation-reference/
├── blueprints/
├── context/
├── packages/
├── scripts/
│   ├── build-registry.mjs
│   ├── new-project.mjs
│   └── new-prototype.mjs
└── docs/
```

## Validation

`scripts/build-registry.mjs` validates every project against the JSON Schema
and checks cross-references:

- manifest filename matches the permanent slug;
- project slugs are unique;
- revision ids are unique;
- exactly one revision is current and matches `currentRevision`;
- at most one candidate exists and it continues from `currentRevision`;
- revision chains reference existing revisions and contain no cycles;
- accepted current/superseded revisions record `dateAccepted`;
- exploration-set ids and alternative ids are unique;
- exploration sets branch from accepted current/superseded revisions;
- selected alternatives reference a real alternative and have rationale;
- an exploration working mode references a real exploration set;
- deployment URLs are internal routes or http(s) URLs.

Malformed projects fail during development/build.

## AI context

The project page exports context according to `workingMode`.

Sequential mode exports:

- exact accepted baseline;
- requested amendment;
- what may change;
- what must remain unchanged;
- acceptance checks;
- current candidate when one exists.

Exploration mode exports:

- shared accepted baseline;
- investigation question;
- intended axes of difference;
- constraints shared by alternatives;
- evaluation criteria;
- named alternatives and deployment links.

## Scope boundary

The Studio records this structure. It does not manage Git branches, worktrees,
commits, pull requests, comments, DOM annotations, agent orchestration or
automated model-to-model review.
