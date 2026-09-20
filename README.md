# Daniel Brown Design Studio

A repository-driven home for executable product-design prototypes.

The Studio is designed around one source of truth:

```text
Codex / V0
    ↓
   Git
    ↓
GitHub (when connected)
    ↓
Vercel previews + production
```

Each prototype is a real, independently buildable application with a stable
slug and a small `prototype.json` design contract. Shared design principles and
interaction rules live at repository level so agents do not start from zero on
every project.

## What is here now

- `apps/studio/` — the Studio index. It discovers prototype manifests and shows
  their status, fidelity, intended URL, design question and handoff intent.
- `apps/ai-campaign-production/` — the prepared home for the current V0 campaign
  prototype. It is deliberately a placeholder until the existing V0 code is
  imported, rather than a fake reconstruction.
- `apps/needs-remediation-reference/` — the original POC idea preserved as an
  executable reference: baseline → divergent explorations → HiFi.
- `context/` — durable design principles, interaction rules, visual guidance and
  prototyping rules for Codex/V0 to consume.
- `blueprints/` — trusted product references that prototypes can declare in
  their manifests.
- `AGENTS.md` — repository-level instructions for Codex and other coding agents.
- `scripts/new-prototype.mjs` — scaffolds a new independently executable app and
  manifest.
- `scripts/build-registry.mjs` — discovers all prototype manifests and generates
  the Studio registry.

## Run locally

From the repository root:

```bash
npm install
npm run dev
```

The Studio runs on Vite's default local port. To run the two prototype apps:

```bash
npm run dev:campaign
npm run dev:reference
```

## Create a prototype

```bash
npm run studio:new -- workflow-builder
npm install
npm run registry
```

The command creates:

```text
apps/workflow-builder/
├── AGENTS.md
├── index.html
├── package.json
├── prototype.json
├── src/
└── vite.config.js
```

`prototype.json` is the contract between the prototype, the Studio and coding
agents. The slug must match the app directory.

## Prototype manifest

A typical manifest looks like:

```json
{
  "slug": "ai-campaign-production",
  "title": "AI Campaign Production",
  "status": "exploring",
  "fidelity": "hifi",
  "updated": "2026-09-20",
  "productionPath": "/ai-campaign-production",
  "principles": [
    "context/design-principles.md",
    "context/interaction-rules.md"
  ],
  "blueprints": [],
  "handoff": {
    "dontMiss": [],
    "ignore": []
  }
}
```

## Codex / V0 model

Codex should work from the repository root and will pick up `AGENTS.md` plus
prototype-local instructions.

V0 should ultimately import the same GitHub repository and work against the
specific app directory for the prototype being edited. GitHub becomes the
bridge between the two editors instead of exporting/importing prototypes between
tools.

## Vercel

The apps are deliberately independent. Create one Vercel project per deployable
app from this monorepo and set its Root Directory to the matching `apps/...`
folder. See `docs/VERCEL.md` for the intended setup and public slug model.

The target public URLs are:

```text
studio.danielbrown.design/
studio.danielbrown.design/ai-campaign-production
studio.danielbrown.design/needs-remediation-reference
```

The repository does not hard-code deployment URLs that do not exist yet. Once
GitHub and the Vercel projects are connected, the Studio/domain routing layer can
map those stable paths to the independently deployed apps.

## What changed from the original POC

The original POC treated contributor-owned JSON frames as the primary unit of
work and relied on a local Express server to mutate files and create commits.
That demonstrated layout/content separation, blueprints, fidelity stages and
handoff intent, but the write flow could not operate on Vercel.

This version changes the primary unit to an **executable prototype app**. Git is
still the source of truth, but writes happen through the normal Codex/V0/GitHub
workflow rather than through a server endpoint trying to commit to a Vercel
filesystem.

The useful concepts were kept:

- trusted blueprints;
- baseline / exploration / HiFi stages;
- shared design principles;
- explicit `dontMiss` / `ignore` handoff intent;
- independent exploration rather than editing production code directly.
