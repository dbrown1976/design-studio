import { useMemo, useState } from "react";
import prototypes from "./generated/prototypes.json";
import projects from "./generated/projects.json";
import PrototypeCard from "./components/PrototypeCard.jsx";
import PrototypeDetail from "./components/PrototypeDetail.jsx";
import ProjectWorkspace from "./components/ProjectWorkspace.jsx";

export default function App() {
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [filter, setFilter] = useState("all");

  const selected = prototypes.find((item) => item.slug === selectedSlug);
  const project = projects.find((item) => item.prototypeSlug === selectedSlug);
  const visible = useMemo(
    () => filter === "all" ? prototypes : prototypes.filter((item) => item.status === filter),
    [filter]
  );

  if (selected && project) {
    return <ProjectWorkspace project={project} prototype={selected} onBack={() => setSelectedSlug(null)} />;
  }
  if (selected) {
    return <PrototypeDetail prototype={selected} onBack={() => setSelectedSlug(null)} />;
  }

  const statuses = ["all", ...new Set(prototypes.map((item) => item.status))];
  return (
    <div className="studio-shell">
      <header className="studio-header">
        <div className="studio-header__brand">Daniel Brown <span>/ Design Studio</span></div>
        <div className="studio-header__meta">Executable prototypes · shared context · accepted revisions</div>
      </header>
      <main>
        <section className="hero">
          <p className="eyebrow">Product design playground</p>
          <h1>Working software for exploring complex product systems.</h1>
          <p className="lede">Each project has one accepted revision. Sequential amendments become candidates; divergent alternatives live in exploration sets. Git remains the source of truth for Codex, V0 and Vercel.</p>
        </section>
        <section className="registry-section">
          <div className="registry-heading">
            <div><p className="eyebrow">Registry</p><h2>{prototypes.length} prototype{prototypes.length === 1 ? "" : "s"}</h2></div>
            <div className="filters" aria-label="Filter prototypes">
              {statuses.map((status) => (
                <button key={status} className={filter === status ? "is-active" : ""} onClick={() => setFilter(status)}>{status}</button>
              ))}
            </div>
          </div>
          <div className="prototype-grid">
            {visible.map((prototype) => (
              <PrototypeCard
                key={prototype.slug}
                prototype={prototype}
                hasWorkspace={projects.some((item) => item.prototypeSlug === prototype.slug)}
                onOpen={setSelectedSlug}
              />
            ))}
          </div>
        </section>
      </main>
      <footer>
        <span>Repository-driven Design Studio</span>
        <code>accepted → candidate / exploration → review → promote</code>
      </footer>
    </div>
  );
}
