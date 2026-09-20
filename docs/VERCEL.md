# Vercel setup

The repository is prepared for independent Vercel projects from one monorepo.
GitHub is not required to develop locally, but it is the intended source of
truth for automatic previews and production deploys.

## Projects to create

Create one Vercel project for each deployable app and point its Root Directory at
the app folder:

| Vercel project | Root Directory |
| --- | --- |
| Design Studio | `apps/studio` |
| AI Campaign Production | `apps/ai-campaign-production` |
| Needs Remediation reference | `apps/needs-remediation-reference` |

Each app contains its own build configuration. Once connected to GitHub, pushes
to non-production branches create Preview Deployments and the production branch
creates Production Deployments.

## Public URL model

The intended public model is:

```text
studio.danielbrown.design/
studio.danielbrown.design/ai-campaign-production
studio.danielbrown.design/needs-remediation-reference
```

The apps remain independently deployed. After the individual production URLs are
known, add path rewrites at the Studio/domain routing layer. Do not hard-code
unknown deployment URLs into the repository.

Until those URLs exist, manifests expose stable `productionPath` values and the
Studio shows them as the intended destination rather than pretending the routing
is already configured.

## Normal workflow after GitHub is connected

```text
V0 or Codex -> feature branch -> Vercel Preview -> review -> merge -> Production
```

No custom GitHub Action is required for the standard flow.
