# Design Studio workflow

The intended loop is:

```text
explore → create coded alternatives → deploy → share → collect feedback → select and refine
```

## 1. Explore

Start with a project manifest that states the problem, users, workflow, current
direction, constraints, accepted decisions and open questions.

## 2. Create coded alternatives

Start from the accepted Current version. Create a new version entry with status
`Candidate`; do not overwrite the Current version.

A prototype can use internal playground routes such as:

```text
/playground/campaign-list
/playground/campaign-list/v2
```

or it can live in another repository and deploy independently.

## 3. Deploy

Record the version's deployment URL. Optionally record the source branch, commit
or pull-request reference. The Studio is agnostic to whether V0, Cursor, Codex,
Claude or another coding agent produced the implementation.

## 4. Share

Share the stable Studio project page at `/projects/<slug>`. Reviewers can see
the recommended Current version, open Candidates separately and understand what
each one was intended to test.

## 5. Collect feedback

For now, capture focused review questions outside a heavy feedback system. The
Studio deliberately does not implement comments, annotations or Inflight-style
review tooling in this phase.

## 6. Select and refine

Record why a version was selected or rejected. Promotion is explicit:

1. preserve the outgoing Current version;
2. update its lifecycle status;
3. mark the selected Candidate as `Current`;
4. update `currentVersion`;
5. add the consequential decision to the project decision log.

## Safe iteration rule

> Start new exploration work from the accepted baseline, preserve existing versions, restrict changes to the requested area and verify that previously accepted screens have not regressed.
