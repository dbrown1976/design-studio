export default function PrototypeDetail({ prototype, onBack }) {
  const path = `studio.danielbrown.design${prototype.productionPath}`;
  return (
    <div className="detail-shell">
      <button className="text-button" onClick={onBack}>← All prototypes</button>
      <div className="detail-grid">
        <main className="detail-main">
          <p className="eyebrow">{prototype.status} · {prototype.fidelity}</p>
          <h1>{prototype.title}</h1>
          <p className="lede">{prototype.description}</p>
          {prototype.question && (
            <section className="detail-section">
              <h2>Design question</h2>
              <p>{prototype.question}</p>
            </section>
          )}
          <section className="detail-section">
            <h2>{prototype.live ? "Live public route" : "Intended public route"}</h2>
            {prototype.live ? (
              <a className="route-chip route-link" href={prototype.productionPath} target="_blank" rel="noreferrer">{path}</a>
            ) : (
              <>
                <code className="route-chip">{path}</code>
                <p className="muted">This route becomes live when the prototype is connected to its Vercel project and the Studio domain rewrite is configured.</p>
              </>
            )}
          </section>
          {prototype.handoff?.dontMiss?.length > 0 && (
            <section className="detail-section">
              <h2>Don't miss</h2>
              <ul>{prototype.handoff.dontMiss.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}
          {prototype.handoff?.ignore?.length > 0 && (
            <section className="detail-section">
              <h2>Deliberately out of scope</h2>
              <ul>{prototype.handoff.ignore.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}
        </main>
        <aside className="detail-aside">
          <h2>Prototype contract</h2>
          <dl>
            <div><dt>App</dt><dd><code>apps/{prototype.slug}</code></dd></div>
            <div><dt>Manifest</dt><dd><code>prototype.json</code></dd></div>
            <div><dt>Updated</dt><dd>{prototype.updated}</dd></div>
            <div><dt>Blueprints</dt><dd>{prototype.blueprints?.length || 0}</dd></div>
          </dl>
          <p>Codex and V0 should read the root context plus this manifest before changing the app.</p>
        </aside>
      </div>
    </div>
  );
}
