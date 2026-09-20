# Vercel setup

The Studio catalogue and prototype deployments are intentionally decoupled.

## Design Studio

Deploy `apps/studio` as the catalogue application. Its stable project URLs are:

```text
studio.danielbrown.design/projects/ai-campaign-production
studio.danielbrown.design/projects/needs-remediation-reference
```

The existing catch-all rewrite keeps direct visits to `/projects/<slug>`
working as client-side Studio routes.

## Prototype deployments

Prototype versions do not need to be hosted by the Studio project. A project
manifest can point its version `deploymentUrl` at:

- a Studio/internal playground route;
- another Vercel project;
- a V0 deployment;
- another http(s) deployment.

This allows a prototype to live in its own GitHub repository and deploy
independently while the Studio remains the stable catalogue and review entry
point.

For local prototype apps already inside this monorepo, one Vercel project per app
is still supported.

| Vercel project | Root Directory |
| --- | --- |
| Design Studio | `apps/studio` |
| AI Campaign Production placeholder | `apps/ai-campaign-production` |
| Needs Remediation reference | `apps/needs-remediation-reference` |

The AI Campaign Production project now also records its independent source
repository. Replace its internal placeholder deployment URL with the real Vercel
deployment when that repository is deployed.

## Preview workflow

A typical connected prototype workflow is:

```text
accepted baseline
  → new branch / coded exploration
  → preview deployment
  → add Candidate version to project manifest
  → share stable Studio project page
  → collect focused feedback
  → explicitly promote or reject
```

Do not overwrite the accepted Current deployment merely to create a Candidate.
