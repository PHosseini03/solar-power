import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const ITEMS = [
  { q: "Wie viel kann ich wirklich sparen?", a: "Die meisten Haushalte senken ihre Stromkosten um 60–80 %, mit Batteriespeicher oft noch mehr. Unser Rechner liefert sofort eine Schätzung, die Ihre Beraterin oder Ihr Berater mit einer kostenlosen Dachanalyse per Satellit bestätigt." },
  { q: "Was passiert bei Wolken oder nachts?", a: "Auch bei bewölktem Himmel erzeugen Ihre Module Strom. Nachts nutzen Sie Ihren Speicher oder das Netz – und für überschüssigen Strom, den Sie tagsüber einspeisen, erhalten Sie die gesetzliche Einspeisevergütung." },
  { q: "Wie lange dauert die Montage?", a: "Bei Einfamilienhäusern meist nur einen Tag. Netzanmeldung und Eintrag ins Marktstammdatenregister dauern in der Regel 2–4 Wochen – den gesamten Papierkram übernehmen wir für Sie." },
  { q: "Geht es wirklich ohne Anzahlung?", a: "Ja. Unsere Pacht- und Finanzierungsmodelle starten bei 0 € Anzahlung, auch in Kombination mit einem KfW-Förderkredit. So sparen Sie ab dem ersten Monat." },
  { q: "Welche Garantie erhalte ich?", a: "25 Jahre Garantie auf Module, Wechselrichter, Montage und Dachdurchdringungen – inklusive kostenlosem Ertrags-Monitoring." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line rounded-3xl border border-line bg-white/[0.02]">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={`faq-${i}`} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-white">
                {item.q}
                <Plus className={`size-5 shrink-0 text-sun transition-transform ${isOpen ? "rotate-45" : ""}`} aria-hidden />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-mist">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
