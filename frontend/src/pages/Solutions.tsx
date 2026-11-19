import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";

const SOLUTIONS = [
  { title: "Solar für Eigenheime", image: "/images/project-1.jpg", text: "Elegante Full-Black-Module, maßgeschneidert für Ihr Dach – mit smartem Wechselrichter und App-Monitoring.", points: ["Individuelle 3D-Dachplanung", "Typisch 6–12 kWp", "Finanzierung ohne Anzahlung"] },
  { title: "Solar für Gewerbe", image: "/images/project-2.jpg", text: "Senken Sie Ihre Betriebskosten und zeigen Sie Ihrer Kundschaft Ihr Engagement für saubere Energie.", points: ["Dach- & Carport-Anlagen", "Steuerliche Abschreibung", "Lastspitzen-Reduzierung"] },
  { title: "Batteriespeicher", image: "/images/install.jpg", text: "Speichern Sie den Sonnenstrom des Tages für den Abend – und bleiben Sie bei Stromausfall versorgt.", points: ["13,5 kWh pro Speicher", "Nahtlose Notstrom-Umschaltung", "Optimiert für dynamische Stromtarife"] },
  { title: "Landwirtschaft & Freiflächen", image: "/images/project-3.jpg", text: "Große Freiflächenanlagen für Bewässerung, Kühlhäuser und Stallungen.", points: ["Einachsige Nachführsysteme", "Unterstützung bei Agri-PV-Förderung", "Anlagen bis 2 MWp"] },
];

export default function Solutions() {
  return (
    <>
      <PageHeader eyebrow="Lösungen" title={<>Solar für jedes <span className="text-gradient">Dach & Feld</span></>} lead="Vom Einfamilienhaus bis zum 2-MWp-Hof: Wir planen und installieren Anlagen, die sich selbst bezahlen." image="/images/aerial.jpg" />
      <section className="pb-24">
        <div className="container-x space-y-8">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.title}>
              <article className={`grid items-center gap-8 overflow-hidden rounded-[2rem] border border-line bg-white/[0.03] p-4 sm:p-6 lg:grid-cols-2 lg:gap-14 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                <div className="aspect-[16/10] overflow-hidden rounded-3xl">
                  <img src={s.image} alt={s.title} loading="lazy" className="size-full object-cover" />
                </div>
                <div className="px-2 pb-4 lg:px-0 lg:pb-0">
                  <span className="font-display text-sm font-semibold text-sun">0{i + 1}</span>
                  <h2 className="mt-2 text-3xl font-bold text-white">{s.title}</h2>
                  <p className="lead mt-4">{s.text}</p>
                  <ul className="mt-6 space-y-3">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-slate-200"><Check className="size-5 text-volt" aria-hidden />{p}</li>
                    ))}
                  </ul>
                  <Link to="/quote" className="btn-ghost mt-8">Angebot anfordern <ArrowRight className="size-4" aria-hidden /></Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
