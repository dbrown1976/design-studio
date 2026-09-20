# Vercel setup

The Studio catalogue and prototype deployments are intentionally decoupled.

## Design Studio

Deploy `apps/studio` as the catalogue application. Stable project URLs are:

```text
studio.danielbrown.design/projects/ai-campaign-production
studio.danielbrown.design/projects/needs-remediation-reference
```

The existing catch-all rewrite keeps direct visits to `/projects/<slug>`
working as client-side Studio routes.

## Revision deployments

A sequential candidate revision should normally receive its own preview or
deployment URL while the accepted current revision remains intact.

The Studio records that URL as metadata. It does not create the branch,
deployment, commit or pull request.

Typical flow:

```text
accepted current revision
  → candidate branch / coded amendment
  → preview deployment
  → record candidate revision
  → review
  → explicit acceptance
```

After acceptance, the outgoing current revision is retained as
`superseded`; the candidate becomes `current`.

## Exploration deployments

When a question requires deliberate divergence, every alternative in the
exploration set can have its own deployment URL:

```text
accepted baseline
  ├── Option A preview
  ├── Option B preview
  └── Option C preview
```

The alternatives are compared within the exploration set. Selecting one does
not change the accepted revision. The selected direction must be turned into a
new candidate revision before acceptance.

## Where prototypes can live

A revision or exploration alternative may point to:

- a Studio/internal playground route;
- another Vercel project;
- a V0 deployment;
- another http(s) deployment.

Source can live in this monorepo or a separate repository. AI Campaign
Production is expected to use its independent
`dbrown1976/automating-campaign-production` repository.

## Local prototype apps

Existing local apps in this monorepo can still be deployed independently.

| Vercel project | Root Directory |
| --- | --- |
| Design Studio | `apps/studio` |
| AI Campaign Production placeholder | `apps/ai-campaign-production` |
| Needs Remediation reference | `apps/needs-remediation-reference` |

The Design Studio remains the stable catalogue and review entry point, while
deployment references remain metadata.
