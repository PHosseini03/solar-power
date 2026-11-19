import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { DEMO_PLANS, type Plan } from "../data/demo";
import { Reveal } from "./Reveal";

export function PlanCards() {
  const { data: plans, loading } = useApi<Plan[]>("/api/plans", DEMO_PLANS);
  return (
    <div className="grid gap-5 md:grid-cols-3" aria-busy={loading}>
      {plans.map((p, i) => (
        <Reveal key={p.id} delay={i * 0.08}>
          <article className={`relative flex h-full flex-col rounded-3xl border p-7 transition hover:-translate-y-1 ${p.featured ? "border-sun/50 bg-gradient-to-b from-sun/15 to-white/[0.02] shadow-2xl shadow-sun/10" : "border-line bg-white/[0.03]"}`}>
            {p.featured && (
              <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sun to-flare px-3 py-1 text-xs font-bold text-ink">
                <Sparkles className="size-3" aria-hidden /> Am beliebtesten
              </span>
            )}
            <h3 className="text-xl font-bold text-white">{p.name}</h3>
            <p className="mt-1 text-sm text-mist">{p.tagline}</p>
            <p className="mt-6 font-display text-3xl font-bold text-white">{p.price_label}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="mt-0.5 size-4 shrink-0 text-volt" aria-hidden /> {f}
                </li>
              ))}
            </ul>
            <Link to={`/quote?plan=${encodeURIComponent(p.name)}`} className={`${p.featured ? "btn-primary" : "btn-ghost"} mt-8 w-full`}>
              {p.name} wählen
            </Link>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
