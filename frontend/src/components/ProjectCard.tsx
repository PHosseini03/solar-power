import { MapPin, Quote, Zap } from "lucide-react";
import type { Project } from "../data/demo";
import { formatMoney } from "../lib/savings";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-line bg-white/[0.03]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={project.image} alt={`Solaranlage: ${project.title}`} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-sun backdrop-blur"><Zap className="size-3" aria-hidden />{project.kw.toLocaleString("de-DE")} kWp</span>
          <span className="rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-volt backdrop-blur">{formatMoney(project.savings)}/Jahr gespart</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-white">{project.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-mist"><MapPin className="size-3.5" aria-hidden />{project.location}</p>
        <blockquote className="mt-4 flex gap-3 border-t border-line pt-4 text-sm leading-relaxed text-slate-300">
          <Quote className="size-4 shrink-0 text-sun" aria-hidden />
          <div>
            <p>{project.quote}</p>
            <footer className="mt-2 text-xs text-slate-500">{project.customer}</footer>
          </div>
        </blockquote>
      </div>
    </article>
  );
}
