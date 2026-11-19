import { useCountUp } from "../hooks/useCountUp";
import { useApi } from "../hooks/useApi";
import { DEMO_STATS, type Stats } from "../data/demo";

function Stat({ value, label, suffix = "", decimals = 0 }: { value: number; label: string; suffix?: string; decimals?: number }) {
  const { ref, value: current } = useCountUp(value);
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-white sm:text-4xl">
        <span ref={ref}>{current.toLocaleString("de-DE", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}</span>
        <span className="text-sun">{suffix}</span>
      </p>
      <p className="mt-1 text-sm text-mist">{label}</p>
    </div>
  );
}

export function StatsStrip() {
  const { data } = useApi<Stats>("/api/stats", DEMO_STATS);
  return (
    <section aria-label="Unternehmenszahlen" className="border-y border-line bg-panel/50">
      <div className="container-x grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
        <Stat value={data.homes_powered} label="Versorgte Haushalte & Betriebe" suffix="+" />
        <Stat value={data.mw_installed} label="Installierte Leistung" suffix=" MWp" />
        <Stat value={data.tons_co2_saved} label="Tonnen CO₂ vermieden" />
        <Stat value={data.rating} label="Durchschnittliche Kundenbewertung" suffix="★" decimals={1} />
      </div>
    </section>
  );
}
