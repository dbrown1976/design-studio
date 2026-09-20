import { useEffect, useMemo, useState } from "react";
import projects from "./generated/projects.json";
import PrototypeCard from "./components/PrototypeCard.jsx";
import PrototypeDetail from "./components/PrototypeDetail.jsx";

function slugFromPath() {
  const match = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function App() {
  const [selectedSlug, setSelectedSlug] = useState(() => slugFromPath());
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const handlePopState = () => setSelectedSlug(slugFromPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const selected = projects.find((item) => item.slug === selectedSlug);
  const visible = useMemo(
    () => filter === "all" ? projects : projects.filter((item) => item.status === filter),
    [filter]
  );

  function openProject(slug) {
    const project = projects.find((item) => item.slug === slug);
    if (!project) return;
    window.history.pushState({}, "", project.projectPath);
    setSelectedSlug(slug);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function goHome() {
    window.history.pushState({}, "", "/");
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  if (selectedSlug && !selected) {
    return (
      <div className="detail-shell">
        <button className="text-button" onClick={goHome}>← All projects</button>
        <main className="not-found">
          <p className="eyebrow">Project not found</p>
          <h1>No project exists for this slug.</h1>
          <p className="lede">Check the project manifest or return to the catalogue.</p>
        </main>
      </div>
    );
  }

  if (selected) {
    return <PrototypeDetail prototype={selected} onBack={goHome} />;
  }

  const statuses = ["all", ...new Set(projects.map((item) => item.status))];

  return (
    <div className="studio-shell">
      <header className="studio-header">
        <div className="studio-header__brand">Daniel Brown <span>/ Design Studio</span></div>
        <div className="studio-header__meta">Catalogue · playground · accepted baselines</div>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">Product design studio</p>
          <h1>Projects, coded explorations and the decisions between them.</h1>
          <p className="lede">The catalogue preserves project context and accepted directions. The playground layer links to live prototypes wherever they are deployed, without coupling the Studio to V0, Cursor, Codex or any other coding tool.</p>
        </section>

        <section className="registry-section">
          <div className="registry-heading">
            <div>
              <p className="eyebrow">Catalogue</p>
              <h2>{projects.length} project{projects.length === 1 ? "" : "s"}</h2>
            </div>
            <div className="filters" aria-label="Filter projects">
              {statuses.map((status) => (
                <button key={status} className={filter === status ? "is-active" : ""} onClick={() => setFilter(status)}>{status}</button>
              ))}
            </div>
          </div>
          <div className="prototype-grid">
            {visible.map((project) => <PrototypeCard key={project.slug} prototype={project} onOpen={openProject} />)}
          </div>
        </section>
      </main>

      <footer>
        <span>Catalogue + playground, repository-driven and tool-agnostic</span>
        <code>npm run studio:new-project -- &lt;slug&gt;</code>
      </footer>
    </div>
  );
}
