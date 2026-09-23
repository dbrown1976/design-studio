const fidelityLabel = {
  baseline: "Baseline",
  exploration: "Exploration",
  hifi: "High fidelity"
};

export default function PrototypeCard({ prototype, onOpen }) {
  return (
    <article className="prototype-card">
      <div className="prototype-card__topline">
        <span className={`status status--${prototype.status}`}>{prototype.status}</span>
        <span className="prototype-card__updated">Updated {prototype.updated}</span>
      </div>
      <h2>{prototype.title}</h2>
      <p>{prototype.description}</p>
      <dl className="prototype-card__meta">
        <div><dt>Fidelity</dt><dd>{fidelityLabel[prototype.fidelity] || prototype.fidelity}</dd></div>
        <div><dt>Slug</dt><dd><code>{prototype.productionPath}</code></dd></div>
      </dl>
      <div className="prototype-card__tags">
        {(prototype.tags || []).map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="prototype-card__actions">
        {prototype.live && (
          <a href={prototype.productionPath} target="_blank" rel="noreferrer">Open prototype</a>
        )}
        <button onClick={() => onOpen(prototype.slug)}>Inspect</button>
      </div>
    </article>
  );
}
