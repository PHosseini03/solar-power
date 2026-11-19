import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, ShieldCheck, Star, Zap } from "lucide-react";

const BARS = [38, 52, 64, 78, 88, 96, 92, 84, 70, 55, 40, 28];

function LiveCard() {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="glass w-full max-w-sm p-5 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-mist">Live-Erzeugung · Familie Becker</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">7,2 <span className="text-base text-mist">kW</span></p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-volt/15 px-3 py-1 text-xs font-semibold text-volt">
          <span className="size-1.5 animate-pulse rounded-full bg-volt" /> Live
        </span>
      </div>
      <div className="mt-5 flex h-24 items-end gap-1.5" aria-hidden>
        {BARS.map((h, i) => (
          <motion.span key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-flare to-sun" initial={{ height: 4 }} animate={{ height: `${h}%` }} transition={{ delay: reduce ? 0 : 0.7 + i * 0.05, duration: 0.6 }} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
        <div><p className="text-xs text-mist">Heute</p><p className="font-semibold text-white">41 kWh</p></div>
        <div><p className="text-xs text-mist">Speicher</p><p className="font-semibold text-volt">96 %</p></div>
        <div><p className="text-xs text-mist">Gespart</p><p className="font-semibold text-sun">14,35 €</p></div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16">
      <img src="/images/hero.jpg" alt="" className="absolute inset-0 -z-30 size-full object-cover" fetchPriority="high" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-ink via-transparent to-ink/30" />
      <div className="animate-glow absolute top-1/4 -left-32 -z-10 size-[28rem] rounded-full bg-sun/25 blur-[120px]" aria-hidden />
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
            <Zap className="size-3.5" aria-hidden /> 0 % MwSt. auf Solaranlagen & Speicher
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="mt-6 text-5xl leading-[1.02] font-bold text-white sm:text-6xl lg:text-7xl">
            Ihr Zuhause, <span className="text-gradient">angetrieben von der Sonne.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="lead mt-6 max-w-xl">
            Premium-Solarmodule und Batteriespeicher – maßgeschneidert für Ihr Dach und an einem Tag montiert. Senken Sie Ihre Stromkosten um bis zu 80 % – auf Wunsch ohne Anzahlung.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/calculator" className="btn-primary text-base">Ersparnis berechnen <ArrowRight className="size-4" aria-hidden /></Link>
            <Link to="/projects" className="btn-ghost text-base">Referenzprojekte ansehen</Link>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2"><Star className="size-4 fill-sun text-sun" aria-hidden /> 4,9 aus über 2.300 Bewertungen</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-volt" aria-hidden /> 25 Jahre Garantie</li>
            <li className="flex items-center gap-2"><BadgeCheck className="size-4 text-volt" aria-hidden /> TÜV-zertifizierter Fachbetrieb</li>
          </motion.ul>
        </div>
        <div className="flex justify-center lg:justify-end">
          <LiveCard />
        </div>
      </div>
    </section>
  );
}
