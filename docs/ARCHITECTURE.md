# Architecture

The Studio is a monorepo of independently executable prototype applications.

```text
daniel-design-studio/
├── AGENTS.md
├── apps/
│   ├── studio/
│   ├── ai-campaign-production/
│   └── needs-remediation-reference/
├── blueprints/
├── context/
├── packages/
└── scripts/
```

`apps/studio` is an index over manifests; it is not a container into which all
prototype code must be merged. `scripts/build-registry.mjs` scans manifests and
generates the Studio registry before development/build.

This keeps three concerns separate:

- **design context**: durable rules and principles in `context/`;
- **prototype code**: independently buildable apps under `apps/`;
- **presentation/discovery**: the Studio index and stable public slugs.

GitHub should become the shared collaboration layer for Codex and V0. Vercel
should deploy each app independently from the same repository.
