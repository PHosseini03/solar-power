import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { ProjectCard } from "../components/ProjectCard";
import { Reveal } from "../components/Reveal";
import { useApi } from "../hooks/useApi";
import { DEMO_PROJECTS, type Project } from "../data/demo";

const FILTERS = [
  { id: "all", label: "Alle", test: () => true },
  { id: "home", label: "Eigenheime", test: (p: Project) => p.kw < 20 },
  { id: "business", label: "Gewerbe", test: (p: Project) => p.kw >= 20 && p.kw < 100 },
  { id: "farm", label: "Landwirtschaft", test: (p: Project) => p.kw >= 100 },
] as const;

export default function Projects() {
  const { data, loading } = useApi<Project[]>("/api/projects", DEMO_PROJECTS);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
  const visible = data.filter(active.test);

  return (
    <>
      <PageHeader eyebrow="Unsere Projekte" title={<>Echte Anlagen, <span className="text-gradient">echte Ersparnis</span></>} lead="Jede Anlage wird von unseren eigenen zertifizierten Teams geplant, angemeldet und montiert." image="/images/project-2.jpg" />
      <section className="pb-24">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Projekte filtern">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" onClick={() => setFilter(f.id)} aria-pressed={filter === f.id} className={`rounded-full px-5 py-2 text-sm font-medium transition ${filter === f.id ? "bg-sun text-ink" : "border border-white/10 text-slate-300 hover:border-white/30"}`}>
                {f.label}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3" aria-label="Projekte werden geladen">
              {[0, 1, 2].map((i) => <div key={i} className="h-96 animate-pulse rounded-3xl bg-white/5" />)}
            </div>
          ) : visible.length === 0 ? (
            <p className="text-center text-mist">In dieser Kategorie gibt es noch keine Projekte.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {visible.map((p, i) => <Reveal key={p.id} delay={i * 0.06}><ProjectCard project={p} /></Reveal>)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
