# AI Campaign Production

This app is the imported executable Campaign Production prototype. It inherits
the repository-level `AGENTS.md` and shared `context/` rules.

The current implementation was imported from
`dbrown1976/automating-campaign-production` at commit
`efd741cfd65dbeb2e4dd82ddd9dc67ac3997f673`, the stable V0/Cursor baseline.

Keep `next.config.mjs` and its `/ai-campaign-production` base path unless the
Studio routing architecture is deliberately changed. This allows the independently
deployed Next.js app and its `/_next` assets to work behind the Studio slug.

# Agent instructions

Before making product, interaction, or visual changes, read:

1. `docs/PRODUCT-CONTRACT.md`
2. `docs/DESIGN-SYSTEM.md`
3. `docs/FIGMA-AUDIT.md`

Use `data/campaigns.ts` as the canonical demo state.

## Product rule

Campaign Production is a lightweight control layer and wayfinder over CMS, DAM, and Jira. Do not turn it into a replacement editor or an AI chatbot.

## Component precedence

Use:

1. Amplience pattern
2. Mantine themed with Amplience tokens
3. bespoke React only when necessary

Do not introduce generic shadcn styling when an Amplience or Mantine equivalent exists.

## Visual rule

Use `styles/tokens.css` as the visual foundation.

The interface should be dense, calm, and operational. Avoid dashboard cards, gradients, oversized KPI tiles, glow effects, robot/sparkle motifs, and gratuitous animation.

## Interaction rule

The core interaction to preserve is:

`full Campaigns table -> select row -> in-situ split view -> inspect Overview / Content / Assets -> switch campaign in rail -> close -> restore full table`

Do not replace this with route-based campaign detail pages unless explicitly instructed.

## POC rule

Keep all state local. Demo controls must be able to reset the prototype to the canonical seed.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
