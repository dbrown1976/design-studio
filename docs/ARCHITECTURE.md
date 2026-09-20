# Architecture

The Design Studio is a catalogue over independently executable design
explorations. It deliberately separates project context from prototype hosting.

## Two layers

### Catalogue

`apps/studio` renders stable project pages at:

```text
/projects/<slug>
```

Each page is generated from one manifest in `projects/<slug>.json`. The
catalogue explains the problem, current direction, accepted version, candidates,
decision history, review questions and reusable AI context.

### Playground

A version's `deploymentUrl` may be:

- an internal route such as `/playground/campaign-list`;
- a route inside a local executable app;
- a Vercel/V0 or other external deployment.

Prototype source may live in this monorepo or in a separate repository referenced
by `repositoryUrl`. The catalogue does not care which coding agent produced it.

## Repository shape

```text
design-studio/
├── AGENTS.md
├── projects/                    # canonical project manifests
├── schemas/
│   └── project.schema.json
├── apps/
│   ├── studio/                  # catalogue UI
│   ├── ai-campaign-production/  # existing local placeholder/example
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

`scripts/build-registry.mjs` validates every project against
`schemas/project.schema.json` and then checks relationships the JSON Schema
cannot conveniently express:

- manifest filename matches the permanent slug;
- project slugs are unique;
- version ids are unique within a project;
- `currentVersion` references a real version;
- exactly one version has status `Current`;
- that Current version is the one referenced by `currentVersion`;
- deployment URLs are internal routes or http(s) URLs.

Malformed projects fail clearly during development and build.

## Version safety

The Current version is the accepted baseline. Candidate work is additive.
Creating an exploration must not replace the Current version. Promoting a
Candidate requires an explicit metadata change: demote/archive the old Current,
mark the selected Candidate Current and update `currentVersion`.

The working rule is:

> Start new exploration work from the accepted baseline, preserve existing versions, restrict changes to the requested area and verify that previously accepted screens have not regressed.

## Scope boundary

The Studio intentionally does not provide commenting, DOM annotation, worktree
management, agent orchestration or automated model-to-model review. Those can be
added through the development workflow or future integrations if needed.
