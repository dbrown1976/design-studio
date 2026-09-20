# Design Studio workflow

The overall loop remains:

```text
explore → code → deploy → share → collect feedback → select and refine
```

How the work is represented depends on whether the design task is sequential or
divergent.

## Mode 1: sequential iteration

This is the default.

```text
Accepted v1 → Candidate v2 → Accepted v2 → Candidate v3
```

1. Start from the exact `currentRevision`.
2. Record the requested amendment and what must not regress.
3. Create one candidate revision that references the accepted revision as
   `previousRevisionId`.
4. Deploy it separately and record repository/source metadata if useful.
5. Review against its acceptance checks.
6. If accepted, explicitly promote it:
   - outgoing current → `superseded`;
   - candidate → `current`;
   - update `currentRevision`;
   - record `dateAccepted`.
7. The newly accepted revision becomes the next baseline.

A candidate never overwrites the accepted baseline while it is under review.

## Mode 2: divergent exploration

Use this only when a question genuinely benefits from alternatives.

```text
Accepted v2
├── Option A
├── Option B
└── Option C
```

1. Create an exploration set attached to the named accepted baseline revision.
2. State the design/research question and why divergence is needed.
3. Define the intended axes of difference.
4. Record constraints that apply to every option.
5. Code and deploy the named alternatives independently.
6. Compare/test them against shared evaluation criteria.
7. Record findings, selected direction and selection rationale.
8. Promote the selected direction into a **new candidate revision**.
9. Review and explicitly accept that candidate through the sequential flow.

An exploration alternative never becomes the project's current experience by
itself.

## Sharing and comparison

Share the stable project page at `/projects/<slug>`.

The project page prioritises:

1. current accepted experience;
2. current candidate, if present;
3. chronological revision history;
4. exploration sets attached to their originating revision;
5. decision log.

Comparison UI is primarily for alternatives within an exploration set.
Sequential revisions are represented as change history, not as equally prominent
competing prototypes.

## AI coding handoff

Use the copyable Markdown context. It identifies the current working mode and
exports the correct baseline, scope and guardrails for that mode.

## Safe iteration rule

> Start new exploration work from the accepted baseline, preserve existing versions, restrict changes to the requested area and verify that previously accepted screens have not regressed.

## Implementation boundary

The Studio stores metadata and links only. Git, V0, Cursor, Codex, Claude or
other development tools create branches, commits, pull requests, deployments and
code changes.
