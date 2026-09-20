const statusLabel = {
  exploring: "Exploring",
  testing: "Testing",
  resolved: "Resolved",
  archived: "Archived"
};

export default function PrototypeCard({ prototype: project, onOpen }) {
  const current = project.revisions.find((revision) => revision.id === project.currentRevision);
  const candidate = project.revisions.find((revision) => revision.status === "candidate");

  return (
    <article className="prototype-card">
      <div className="prototype-card__topline">
        <span className={`status status--${project.status}`}>{statusLabel[project.status] || project.status}</span>
        <span className="prototype-card__updated">Updated {project.updated}</span>
      </div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <dl className="prototype-card__meta">
        <div>
          <dt>Accepted revision</dt>
          <dd>{current?.name || project.currentRevision}</dd>
        </div>
        <div>
          <dt>Working mode</dt>
          <dd>{project.workingMode.type === "exploration" ? "Divergent exploration" : "Sequential iteration"}</dd>
        </div>
        <div>
          <dt>Candidate</dt>
          <dd>{candidate?.name || "None"}</dd>
        </div>
        <div>
          <dt>Project route</dt>
          <dd><code>{project.projectPath}</code></dd>
        </div>
      </dl>
      <div className="prototype-card__tags">
        {(project.tags || []).map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <a
        className="primary-link"
        href={project.projectPath}
        onClick={(event) => {
          event.preventDefault();
          onOpen(project.slug);
        }}
      >
        Open project
      </a>
    </article>
  );
}
