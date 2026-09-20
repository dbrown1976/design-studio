import { useMemo, useState } from "react";

function list(items = []) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- None recorded";
}

function sourceText(source, repositoryUrl) {
  const parts = [
    repositoryUrl ? `Repository: ${repositoryUrl}` : null,
    source?.branch ? `Branch: ${source.branch}` : null,
    source?.commit ? `Commit: ${source.commit}` : null,
    source?.pullRequest ? `Pull request: ${source.pullRequest}` : null
  ].filter(Boolean);
  return parts;
}

function buildAiContext(project) {
  const current = project.revisions.find((revision) => revision.id === project.currentRevision);
  const candidate = project.revisions.find((revision) => revision.status === "candidate");

  const common = [
    `# ${project.title} — design context`,
    "",
    "## Problem",
    project.context.problem,
    "",
    "## Intended outcome",
    project.context.intendedOutcome,
    "",
    "## Users",
    list(project.context.users),
    "",
    "## Relevant workflow",
    project.context.workflow,
    "",
    "## Current design direction",
    project.context.currentDirection,
    ""
  ];

  let mode;
  if (project.workingMode.type === "exploration") {
    const set = project.explorationSets.find((item) => item.id === project.workingMode.explorationSetId);
    const baseline = project.revisions.find((revision) => revision.id === set?.baselineRevisionId);
    mode = [
      "## Current working mode",
      "Divergent exploration",
      "",
      "## Shared accepted baseline",
      baseline ? `${baseline.name} (${baseline.id})\nPrototype: ${baseline.deploymentUrl}` : "Baseline not found",
      "",
      "## Question being investigated",
      set?.question || "None recorded",
      "",
      "## Why alternatives are needed",
      set?.context || "None recorded",
      "",
      "## Intended axes of difference",
      list(set?.axesOfDifference || []),
      "",
      "## Constraints applying to every alternative",
      list(set?.constraints || []),
      "",
      "## How alternatives will be evaluated",
      list(set?.evaluationCriteria || []),
      "",
      "## Alternatives",
      set ? set.alternatives.map((alt) => `- ${alt.name}: ${alt.intendedDifference} — ${alt.deploymentUrl}`).join("\n") : "- None recorded"
    ];
  } else {
    mode = [
      "## Current working mode",
      "Sequential iteration",
      "",
      "## Exact accepted baseline",
      current ? `${current.name} (${current.id})\nPrototype: ${current.deploymentUrl}` : "Current revision not found",
      "",
      "## Requested amendment",
      project.workingMode.requestedAmendment,
      "",
      "## What may change",
      list(project.workingMode.mayChange),
      "",
      "## What must remain unchanged",
      list(project.workingMode.mustRemainUnchanged),
      "",
      "## Relevant acceptance checks",
      list(project.workingMode.acceptanceChecks),
      ...(candidate ? [
        "",
        "## Current candidate revision",
        `${candidate.name} (${candidate.id})\nPrototype: ${candidate.deploymentUrl}`
      ] : [])
    ];
  }

  const links = [
    `Studio project: ${project.projectPath}`,
    current ? `Current accepted prototype: ${current.deploymentUrl}` : null,
    candidate ? `Candidate prototype: ${candidate.deploymentUrl}` : null,
    project.repositoryUrl ? `Project repository: ${project.repositoryUrl}` : null
  ].filter(Boolean);

  return [
    ...common,
    ...mode,
    "",
    "## Non-negotiable project constraints",
    list(project.context.constraints),
    "",
    "## Accepted decisions",
    list(project.context.acceptedDecisions),
    "",
    "## Open questions",
    list(project.context.openQuestions),
    "",
    "## Relevant links",
    list(links),
    "",
    "## Safe iteration rule",
    "Start new exploration work from the accepted baseline, preserve existing versions, restrict changes to the requested area and verify that previously accepted screens have not regressed."
  ].join("\n");
}

function PrototypeLink({ url, children = "Open prototype" }) {
  return (
    <a className="version-link" href={url} target="_blank" rel="noreferrer">
      {children} ↗
    </a>
  );
}

function SourceReference({ source, repositoryUrl }) {
  const parts = sourceText(source, repositoryUrl);
  if (!parts.length) return null;
  return <p className="source-reference">{parts.join(" · ")}</p>;
}

function RevisionSummary({ revision, prominent = false }) {
  return (
    <article className={prominent ? "revision-summary revision-summary--prominent" : "revision-summary"}>
      <div className="revision-summary__topline">
        <div>
          <p className="eyebrow">{prominent ? "Accepted baseline" : "Candidate revision"}</p>
          <h3>{revision.name}</h3>
        </div>
        <span className={`revision-status revision-status--${revision.status}`}>{revision.status}</span>
      </div>
      <p>{revision.summary}</p>
      <dl className="revision-details">
        <div><dt>Scope</dt><dd>{revision.scope}</dd></div>
        <div><dt>Validation</dt><dd>{revision.validationStatus}</dd></div>
        {revision.dateAccepted && <div><dt>Accepted</dt><dd>{revision.dateAccepted}</dd></div>}
      </dl>
      {revision.preserve?.length > 0 && (
        <div className="preserve-block">
          <strong>Must be preserved</strong>
          <ul>{revision.preserve.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      )}
      <SourceReference source={revision.source} repositoryUrl={revision.repositoryUrl} />
      <PrototypeLink url={revision.deploymentUrl}>{prominent ? "Open accepted experience" : "Open candidate"}</PrototypeLink>
    </article>
  );
}

function ExplorationSet({ set, revisions }) {
  const baseline = revisions.find((revision) => revision.id === set.baselineRevisionId);
  const selected = set.alternatives.find((alternative) => alternative.id === set.selectedAlternativeId);

  return (
    <section className="exploration-set">
      <div className="exploration-set__header">
        <div>
          <p className="eyebrow">Exploration set from {baseline?.name || set.baselineRevisionId}</p>
          <h4>{set.name}</h4>
        </div>
        {selected && <span className="selection-badge">Direction selected</span>}
      </div>
      <p className="exploration-question">{set.question}</p>
      <p>{set.context}</p>

      <div className="exploration-meta-grid">
        <div><strong>Axes of difference</strong><ul>{set.axesOfDifference.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><strong>Evaluation</strong><ul>{set.evaluationCriteria.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </div>

      <div className="alternative-grid">
        {set.alternatives.map((alternative) => (
          <article className={`alternative-card ${alternative.id === set.selectedAlternativeId ? "alternative-card--selected" : ""}`} key={alternative.id}>
            <div className="alternative-card__topline">
              <h5>{alternative.name}</h5>
              {alternative.id === set.selectedAlternativeId && <span className="selection-badge">Selected</span>}
            </div>
            <p>{alternative.intendedDifference}</p>
            <SourceReference source={alternative.source} repositoryUrl={alternative.repositoryUrl} />
            <PrototypeLink url={alternative.deploymentUrl}>Open alternative</PrototypeLink>
          </article>
        ))}
      </div>

      {set.testingNotes.length > 0 && (
        <div className="findings-block">
          <strong>Testing notes / findings</strong>
          <ul>{set.testingNotes.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      )}

      {selected && (
        <div className="selection-rationale">
          <strong>Selected direction: {selected.name}</strong>
          <p>{set.selectionRationale}</p>
          <p className="muted">Selection does not replace the accepted baseline automatically. It must be promoted into a candidate revision, reviewed and explicitly accepted.</p>
        </div>
      )}
    </section>
  );
}

export default function PrototypeDetail({ prototype: project, onBack }) {
  const [copyState, setCopyState] = useState("Copy Markdown context");
  const current = project.revisions.find((revision) => revision.id === project.currentRevision);
  const candidate = project.revisions.find((revision) => revision.status === "candidate");
  const markdown = useMemo(() => buildAiContext(project), [project]);

  async function copyContext() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyState("Copied");
      window.setTimeout(() => setCopyState("Copy Markdown context"), 1600);
    } catch {
      setCopyState("Copy failed");
    }
  }

  return (
    <div className="detail-shell">
      <button className="text-button" onClick={onBack}>← All projects</button>

      <div className="detail-grid">
        <main className="detail-main">
          <p className="eyebrow">{project.status} · {project.workingMode.type === "exploration" ? "divergent exploration" : "sequential iteration"} · updated {project.updated}</p>
          <h1>{project.title}</h1>
          <p className="lede">{project.description}</p>

          {current && (
            <section className="primary-section">
              <div className="section-heading-row">
                <div>
                  <p className="eyebrow">Current accepted experience</p>
                  <h2>Baseline for the next change</h2>
                </div>
                <span className="revision-status revision-status--current">current</span>
              </div>
              <RevisionSummary revision={current} prominent />
            </section>
          )}

          {candidate && (
            <section className="detail-section candidate-section">
              <div className="section-heading-row">
                <div>
                  <p className="eyebrow">In review</p>
                  <h2>Current candidate revision</h2>
                </div>
                <span className="revision-status revision-status--candidate">candidate</span>
              </div>
              <RevisionSummary revision={candidate} />
              <p className="muted">This candidate does not replace the accepted revision until it is explicitly promoted.</p>
            </section>
          )}

          {project.reviewQuestions?.length > 0 && (
            <section className="detail-section">
              <h2>Review questions</h2>
              <ul>{project.reviewQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}

          <section className="detail-section">
            <h2>Revision history</h2>
            <p className="muted">Sequential revisions build on accepted revisions. Exploration sets are attached to the accepted revision from which they branched.</p>
            <div className="revision-timeline">
              {project.revisions.map((revision, index) => {
                const attachedSets = project.explorationSets.filter((set) => set.baselineRevisionId === revision.id);
                return (
                  <article className="revision-history-item" key={revision.id}>
                    <div className="revision-history-marker">{index + 1}</div>
                    <div className="revision-history-content">
                      <div className="revision-history-topline">
                        <div>
                          <h3>{revision.name}</h3>
                          <p className="muted">{revision.previousRevisionId ? `Continues from ${revision.previousRevisionId}` : "Initial accepted baseline"}</p>
                        </div>
                        <span className={`revision-status revision-status--${revision.status}`}>{revision.status}</span>
                      </div>
                      <p>{revision.summary}</p>
                      <dl className="revision-details">
                        <div><dt>Requested scope</dt><dd>{revision.scope}</dd></div>
                        <div><dt>Validation</dt><dd>{revision.validationStatus}</dd></div>
                        {revision.dateAccepted && <div><dt>Date accepted</dt><dd>{revision.dateAccepted}</dd></div>}
                      </dl>
                      {revision.preserve.length > 0 && (
                        <details className="history-details">
                          <summary>Important behaviour to preserve</summary>
                          <ul>{revision.preserve.map((item) => <li key={item}>{item}</li>)}</ul>
                        </details>
                      )}
                      <SourceReference source={revision.source} repositoryUrl={revision.repositoryUrl} />
                      <PrototypeLink url={revision.deploymentUrl}>Open revision</PrototypeLink>

                      {attachedSets.map((set) => (
                        <ExplorationSet key={set.id} set={set} revisions={project.revisions} />
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="detail-section">
            <h2>Decision log</h2>
            <div className="decision-log">
              {project.decisionLog.length === 0 && <p className="muted">No decisions recorded yet.</p>}
              {project.decisionLog.map((entry, index) => (
                <article className="decision-entry" key={`${entry.date}-${index}`}>
                  <div className="decision-entry__meta">
                    <span className={`decision-type decision-type--${entry.type}`}>{entry.type}</span>
                    <time>{entry.date}</time>
                  </div>
                  <h3>{entry.decision}</h3>
                  <p>{entry.rationale}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <div className="section-heading-row">
              <div>
                <h2>AI coding context</h2>
                <p className="muted">The export changes with the project's current working mode so coding tools receive the correct baseline and guardrails.</p>
              </div>
              <button className="secondary-button" onClick={copyContext}>{copyState}</button>
            </div>
            <pre className="context-preview">{markdown}</pre>
          </section>
        </main>

        <aside className="detail-aside">
          <h2>Project contract</h2>
          <dl>
            <div><dt>Stable route</dt><dd><code>{project.projectPath}</code></dd></div>
            <div><dt>Accepted revision</dt><dd>{current?.name || project.currentRevision}</dd></div>
            <div><dt>Candidate</dt><dd>{candidate?.name || "None"}</dd></div>
            <div><dt>Working mode</dt><dd>{project.workingMode.type === "exploration" ? "Divergent exploration" : "Sequential iteration"}</dd></div>
            <div><dt>Exploration sets</dt><dd>{project.explorationSets.length}</dd></div>
            <div><dt>Updated</dt><dd>{project.updated}</dd></div>
          </dl>

          {project.repositoryUrl && (
            <a className="aside-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">Open repository ↗</a>
          )}

          <p>The Studio records the design structure and references. Git and coding tools remain responsible for branches, commits, pull requests and code changes.</p>
        </aside>
      </div>
    </div>
  );
}
