import { Link } from "react-router-dom";
import { ArrowRight, BatteryCharging, ClipboardCheck, Cpu, Home as HomeIcon, LineChart, PlugZap, ShieldCheck, Sun, Wrench } from "lucide-react";
import { Hero } from "../components/Hero";
import { StatsStrip } from "../components/StatsStrip";
import { SavingsCalculator } from "../components/SavingsCalculator";
import { PlanCards } from "../components/PlanCards";
import { ProjectCard } from "../components/ProjectCard";
import { Faq } from "../components/Faq";
import { Reveal } from "../components/Reveal";
import { useApi } from "../hooks/useApi";
import { DEMO_PROJECTS, type Project } from "../data/demo";

const FEATURES = [
  { icon: Sun, title: "Tier-1-Module", text: "Full-Black-Module mit 22,8 % Wirkungsgrad – elegant und mit mehr Ertrag auf weniger Dachfläche." },
  { icon: BatteryCharging, title: "Batteriespeicher", text: "Nutzen Sie Ihren Sonnenstrom auch abends – mit Notstromfunktion bleiben Licht, Kühlschrank und WLAN bei Stromausfall an." },
  { icon: Cpu, title: "Smartes Monitoring", text: "Erzeugung, Verbrauch und Ersparnis in Echtzeit in unserer App verfolgen." },
  { icon: PlugZap, title: "Wallbox fürs E-Auto", text: "Laden Sie Ihr Elektroauto mit Sonnenstrom – die Wallbox installieren wir direkt mit." },
  { icon: ShieldCheck, title: "25 Jahre Garantie", text: "Module, Wechselrichter, Montage und Dachdurchdringungen – alles abgesichert." },
  { icon: LineChart, title: "Höherer Immobilienwert", text: "Häuser mit eigener Solaranlage erzielen beim Verkauf im Schnitt rund 4 % mehr." },
];

const STEPS = [
  { icon: ClipboardCheck, title: "Kostenlose Planung", text: "Wir vermessen Ihr Dach per Satellit und planen die Anlage passend zu Ihrem Verbrauch." },
  { icon: HomeIcon, title: "Anmeldung & Formalitäten", text: "Netzanmeldung, Marktstammdatenregister und Förderanträge übernehmen wir für Sie." },
  { icon: Wrench, title: "Montage an einem Tag", text: "Unser zertifiziertes Team installiert alles an nur einem Tag." },
  { icon: Sun, title: "Einschalten & sparen", text: "Erzeugen Sie sauberen Strom und sehen Sie zu, wie Ihre Rechnung sinkt." },
];

function SectionTitle({ eyebrow, title, lead }: { eyebrow: string; title: React.ReactNode; lead?: string }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="heading mt-5">{title}</h2>
      {lead && <p className="lead mt-4">{lead}</p>}
    </Reveal>
  );
}

export default function Home() {
  const { data: projects } = useApi<Project[]>("/api/projects", DEMO_PROJECTS);
  return (
    <>
      <Hero />
      <StatsStrip />

      <section className="section">
        <div className="container-x">
          <SectionTitle eyebrow="Warum HelioGrid" title={<>Alles für Ihren Weg <span className="text-gradient">zum Sonnenstrom</span></>} lead="Planung, Montage, Finanzierung und Service aus einer Hand – über die gesamte Lebensdauer Ihrer Anlage." />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.05}>
                <div className="group h-full rounded-3xl border border-line bg-white/[0.03] p-7 transition hover:border-sun/40 hover:bg-white/[0.05]">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-sun/20 to-flare/10 text-sun transition group-hover:scale-110"><Icon className="size-6" aria-hidden /></span>
                  <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section relative overflow-hidden bg-panel/40">
        <div className="grid-glow absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <SectionTitle eyebrow="Ersparnisrechner" title="Ihre Ersparnis in Sekunden" lead="Stellen Sie den Regler auf Ihre monatlichen Stromkosten ein. Die Werte aktualisieren sich sofort." />
          <div className="mt-12"><SavingsCalculator compact /></div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionTitle eyebrow="So funktioniert’s" title="In 4 Schritten zum eigenen Sonnenstrom" />
          <ol className="mt-14 grid gap-6 md:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <li className="relative h-full rounded-3xl border border-line bg-white/[0.03] p-6">
                  <span className="font-display text-5xl font-bold text-white/10">0{i + 1}</span>
                  <Icon className="absolute top-6 right-6 size-6 text-sun" aria-hidden />
                  <h3 className="mt-2 text-lg font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-panel/40">
        <div className="container-x">
          <SectionTitle eyebrow="Finanzierung" title="Modelle, die sich selbst bezahlen" lead="Wählen Sie die Option, die zu Ihrem Budget passt. Planung, Montage und Monitoring sind immer inklusive." />
          <div className="mt-14"><PlanCards /></div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <Reveal>
              <span className="eyebrow">Referenzen</span>
              <h2 className="heading mt-5">Sonnenstrom für Häuser, Cafés & Höfe</h2>
            </Reveal>
            <Link to="/projects" className="btn-ghost">Alle Projekte <ArrowRight className="size-4" aria-hidden /></Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {projects.map((p, i) => <Reveal key={p.id} delay={i * 0.08}><ProjectCard project={p} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section bg-panel/40">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <span className="eyebrow">Häufige Fragen</span>
            <h2 className="heading mt-5">Fragen? Wir haben Antworten.</h2>
            <p className="lead mt-4">Noch etwas unklar? Unsere Solarberater erklären Ihnen gern alles in Ruhe – ganz unverbindlich.</p>
            <Link to="/quote" className="btn-primary mt-8">Beratung anfragen</Link>
          </Reveal>
          <Reveal delay={0.1}><Faq /></Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-sun/30 bg-gradient-to-br from-sun/20 via-flare/10 to-transparent p-8 text-center sm:p-16">
              <div className="animate-glow absolute -top-20 left-1/2 size-80 -translate-x-1/2 rounded-full bg-sun/30 blur-3xl" aria-hidden />
              <h2 className="heading relative">Bereit für Ihren eigenen Strom?</h2>
              <p className="lead relative mx-auto mt-4 max-w-xl">Erhalten Sie in 24 Stunden Ihre individuelle Planung mit Ersparnisbericht – kostenlos und unverbindlich.</p>
              <Link to="/quote" className="btn-primary relative mt-8 text-base">Kostenloses Angebot anfordern <ArrowRight className="size-4" aria-hidden /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
