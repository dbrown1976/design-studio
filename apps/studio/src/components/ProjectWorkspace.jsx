import { useState } from "react";

function RevisionStatus({ status }) {
  return <span className={`revision-status revision-status--${status}`}>{status}</span>;
}

function StartWorkPanel({ mode, project, revision, onClose }) {
  const isRevision = mode === "revision";
  const instruction = isRevision
    ? `Create the next candidate revision for ${project.title} from accepted ${revision.id}. Preserve the current accepted revision. Read projects/${project.id}/project.json, projects/${project.id}/revisions/${revision.id}.json, the prototype manifest, and shared context before making changes. Create the next sequential revision record with status candidate and make only the requested amendment.`
    : `Create a new exploration set for ${project.title} based on accepted ${revision.id}. Do not modify the current accepted revision. Read the project/revision contracts and shared context, define the design question, and create meaningfully divergent directions that preserve the current revision's stated constraints.`;

  async function copyInstruction() {
    await navigator.clipboard?.writeText(instruction);
  }

  return (
    <div className="start-work-panel">
      <div>
        <p className="eyebrow">{isRevision ? "Sequential iteration" : "Divergent exploration"}</p>
        <h3>{isRevision ? "Start a candidate revision" : "Start an exploration set"}</h3>
        <p>{isRevision
          ? `Continue from ${revision.id}. The accepted baseline stays untouched until a candidate is explicitly promoted.`
          : `Branch alternatives from ${revision.id}. Directions remain parallel until one is selected and converted into a candidate revision.`}</p>
      </div>
      <pre>{instruction}</pre>
      <div className="workspace-actions">
        <button className="secondary-button" onClick={copyInstruction}>Copy Codex/V0 instruction</button>
        <button className="text-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function ProjectWorkspace({ project, prototype, onBack }) {
  const [startMode, setStartMode] = useState(null);
  const current = project.revisions.find((item) => item.id === project.currentRevision);
  const revisions = [...project.revisions].sort((a, b) => Number(b.id.slice(1)) - Number(a.id.slice(1)));

  if (!current) return null;

  return (
    <div className="workspace-shell">
      <header className="workspace-topbar">
        <button className="text-button" onClick={onBack}>← All prototypes</button>
        <div>Daniel Brown <span>/ Design Studio</span></div>
      </header>

      <main className="workspace-main">
        <section className="workspace-hero">
          <div>
            <p className="eyebrow">Project workspace</p>
            <h1>{project.title}</h1>
            <p className="lede">{project.description}</p>
          </div>
          <div className="workspace-hero__actions">
            {prototype?.live && (
              <a className="primary-link" href={project.productionPath} target="_blank" rel="noreferrer">Open prototype</a>
            )}
          </div>
        </section>

        <section className="current-revision">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Current accepted revision</p>
              <h2>{current.id} · {current.name}</h2>
            </div>
            <RevisionStatus status={current.status} />
          </div>
          <p className="current-summary">{current.summary}</p>
          <dl className="current-meta">
            <div><dt>Fidelity</dt><dd>{current.fidelity}</dd></div>
            <div><dt>Validation</dt><dd>{current.validation.status}</dd></div>
            <div><dt>Accepted</dt><dd>{current.acceptedAt}</dd></div>
            <div><dt>Repository</dt><dd><code>{current.repository.path}</code></dd></div>
          </dl>
          <div className="preserve-block">
            <h3>Preserve in the next change</h3>
            <ul>{current.preserve.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="workspace-actions">
            <button className="primary-button" onClick={() => setStartMode("revision")}>New revision</button>
            <button className="secondary-button" onClick={() => setStartMode("exploration")}>New exploration</button>
          </div>
        </section>

        {startMode && (
          <StartWorkPanel mode={startMode} project={project} revision={current} onClose={() => setStartMode(null)} />
        )}

        <section className="workspace-section">
          <div className="section-title-row">
            <div><p className="eyebrow">History</p><h2>Revisions</h2></div>
            <span className="section-count">{revisions.length}</span>
          </div>
          <div className="revision-list">
            {revisions.map((item) => (
              <article className="revision-row" key={item.id}>
                <div className="revision-id">{item.id}</div>
                <div className="revision-copy">
                  <div className="revision-heading">
                    <strong>{item.name}</strong>
                    <RevisionStatus status={item.status} />
                  </div>
                  <p>{item.summary}</p>
                  <div className="revision-provenance">
                    <span>Previous: {item.previousRevision ?? "Initial baseline"}</span>
                    <span>Validation: {item.validation.status}</span>
                    {item.repository.commit && <span>Commit: <code>{item.repository.commit.slice(0, 7)}</code></span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-section">
          <div className="section-title-row">
            <div><p className="eyebrow">Divergence</p><h2>Exploration sets</h2></div>
            <span className="section-count">{project.explorationSets.length}</span>
          </div>

          {project.explorationSets.length === 0 ? (
            <div className="empty-state">
              <strong>No exploration sets yet.</strong>
              <p>The first one will branch from accepted {current.id} without changing it. Directions remain parallel until one is selected and converted into a candidate revision.</p>
              <button className="secondary-button" onClick={() => setStartMode("exploration")}>Start first exploration</button>
            </div>
          ) : (
            <div className="exploration-list">
              {project.explorationSets.map((set) => (
                <article className="exploration-row" key={set.id}>
                  <div><strong>{set.name}</strong><p>{set.question}</p></div>
                  <div><span>{set.directions.length} directions</span><span>Based on {set.basedOnRevision}</span></div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
