import { PageHeader } from "../components/PageHeader";
import { SavingsCalculator } from "../components/SavingsCalculator";
import { Reveal } from "../components/Reveal";

const NOTES = [
  { title: "Strompreise steigen weiter", text: "Strom ist in Deutschland langfristig um rund 3 % pro Jahr teurer geworden. Mit Solarstrom sichern Sie sich Ihre Energiekosten für mehr als 25 Jahre." },
  { title: "Förderung senkt die Kosten", text: "0 % Mehrwertsteuer auf Anlage und Speicher, günstige KfW-Kredite und regionale Förderprogramme machen den Einstieg leichter." },
  { title: "Einspeisevergütung", text: "Überschüssiger Solarstrom fließt ins Netz – dafür erhalten Sie 20 Jahre lang eine gesetzlich garantierte Vergütung." },
];

export default function Calculator() {
  return (
    <>
      <PageHeader eyebrow="Ersparnisrechner" title={<>Wie viel können <span className="text-gradient">Sie sparen?</span></>} lead="Erzählen Sie uns von Ihrem Zuhause. Die Schätzung wird live von unserem Preisrechner berechnet." image="/images/field.jpg" />
      <section className="pb-24">
        <div className="container-x">
          <Reveal><SavingsCalculator /></Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {NOTES.map((n, i) => (
              <Reveal key={n.title} delay={i * 0.06}>
                <div className="h-full rounded-3xl border border-line bg-white/[0.03] p-6">
                  <h2 className="text-lg font-bold text-white">{n.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{n.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
