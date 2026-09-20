import { useMemo, useState } from "react";

function list(items = []) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- None recorded";
}

function buildAiContext(project) {
  const current = project.versions.find((version) => version.id === project.currentVersion);
  const links = [
    `Studio project: ${project.projectPath}`,
    current ? `Current prototype: ${current.deploymentUrl}` : null,
    project.repositoryUrl ? `Repository: ${project.repositoryUrl}` : null
  ].filter(Boolean);

  return [
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
    "",
    "## Non-negotiable constraints",
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

function VersionLink({ version, children = "Open prototype" }) {
  const external = /^https?:\/\//.test(version.deploymentUrl);
  return (
    <a
      className="version-link"
      href={version.deploymentUrl}
      target="_blank"
      rel={external ? "noreferrer" : undefined}
    >
      {children} ↗
    </a>
  );
}

function SourceReference({ source }) {
  if (!source) return null;
  const parts = [
    source.branch && `branch: ${source.branch}`,
    source.commit && `commit: ${source.commit}`,
    source.pullRequest && `PR: ${source.pullRequest}`
  ].filter(Boolean);
  if (!parts.length) return null;
  return <p className="source-reference">{parts.join(" · ")}</p>;
}

export default function PrototypeDetail({ prototype: project, onBack }) {
  const [copyState, setCopyState] = useState("Copy Markdown context");
  const current = project.versions.find((version) => version.id === project.currentVersion);
  const compareVersions = project.versions.filter((version) => ["Current", "Candidate"].includes(version.status));
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
          <p className="eyebrow">{project.status} · updated {project.updated}</p>
          <h1>{project.title}</h1>
          <p className="lede">{project.description}</p>

          {current && (
            <section className="current-version">
              <div className="section-heading-row">
                <div>
                  <p className="eyebrow">Recommended</p>
                  <h2>Current version</h2>
                </div>
                <span className="version-status version-status--current">Current</span>
              </div>
              <h3>{current.name}</h3>
              <p>{current.whatChanged}</p>
              <div className="version-question">
                <strong>Question</strong>
                <p>{current.question}</p>
              </div>
              <p className="decision-rationale"><strong>Why this is current:</strong> {current.decisionRationale}</p>
              <SourceReference source={current.source} />
              <VersionLink version={current}>Open current prototype</VersionLink>
            </section>
          )}

          {project.reviewQuestions?.length > 0 && (
            <section className="detail-section">
              <h2>Review questions</h2>
              <ul>{project.reviewQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}

          <section className="detail-section">
            <div className="section-heading-row">
              <div>
                <h2>Versions</h2>
                <p className="muted">Earlier and alternative versions remain inspectable. Creating a Candidate does not replace the Current version.</p>
              </div>
            </div>
            <div className="version-list">
              {project.versions.map((version) => (
                <article className={`version-card ${version.status === "Current" ? "version-card--current" : ""}`} key={version.id}>
                  <div className="version-card__topline">
                    <h3>{version.name}</h3>
                    <span className={`version-status version-status--${version.status.toLowerCase()}`}>{version.status}</span>
                  </div>
                  <dl className="version-details">
                    <div><dt>What changed</dt><dd>{version.whatChanged}</dd></div>
                    <div><dt>Question</dt><dd>{version.question}</dd></div>
                    <div><dt>Decision</dt><dd>{version.decisionRationale}</dd></div>
                  </dl>
                  <SourceReference source={version.source} />
                  <VersionLink version={version} />
                </article>
              ))}
            </div>
          </section>

          {compareVersions.length > 1 && (
            <section className="detail-section">
              <h2>Compare current and candidates</h2>
              <p className="muted">Open two or three versions separately. The difference each one is intended to test is stated here; no embedded comparison tool is required.</p>
              <div className="comparison-grid">
                {compareVersions.slice(0, 3).map((version) => (
                  <article className="comparison-card" key={version.id}>
                    <span className={`version-status version-status--${version.status.toLowerCase()}`}>{version.status}</span>
                    <h3>{version.name}</h3>
                    <p>{version.whatChanged}</p>
                    <p className="comparison-question"><strong>Testing:</strong> {version.question}</p>
                    <VersionLink version={version}>Open version</VersionLink>
                  </article>
                ))}
              </div>
            </section>
          )}

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
                <p className="muted">Portable project context for Codex, Claude, Cursor, V0 or another coding tool.</p>
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
            <div><dt>Current version</dt><dd>{current?.name || project.currentVersion}</dd></div>
            <div><dt>Versions</dt><dd>{project.versions.length}</dd></div>
            <div><dt>Updated</dt><dd>{project.updated}</dd></div>
          </dl>

          {project.repositoryUrl && (
            <a className="aside-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">Open repository ↗</a>
          )}

          <p>The Studio catalogues the work. Prototype code can live here or in a separate repository and deploy independently.</p>
        </aside>
      </div>
    </div>
  );
}
