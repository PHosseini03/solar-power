import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BatteryCharging, CalendarClock, Leaf, PanelsTopLeft, PiggyBank, Wallet } from "lucide-react";
import { api } from "../api/client";
import { estimateSavings, formatMoney, formatNumber, type RoofType, type SavingsResult } from "../lib/savings";

const REGIONS = [
  { label: "Norddeutschland (z. B. Hamburg)", hours: 2.6 },
  { label: "Mitte (z. B. Frankfurt, Leipzig)", hours: 2.8 },
  { label: "Süddeutschland (z. B. Stuttgart)", hours: 3.0 },
  { label: "Sehr sonnig (z. B. Freiburg, Oberbayern)", hours: 3.2 },
];
const ROOFS: { value: RoofType; label: string }[] = [
  { value: "asphalt", label: "Bitumen" },
  { value: "metal", label: "Blech" },
  { value: "tile", label: "Ziegel" },
  { value: "flat", label: "Flach" },
];
const MIN_BILL = 30;
const MAX_BILL = 500;
const DEBOUNCE_MS = 250;

export function SavingsCalculator({ compact = false }: { compact?: boolean }) {
  const [bill, setBill] = useState(100);
  const [region, setRegion] = useState(2);
  const [roof, setRoof] = useState<RoofType>("asphalt");
  const input = useMemo(() => ({ monthly_bill: bill, sun_hours: REGIONS[region].hours, roof_type: roof }), [bill, region, roof]);
  const key = JSON.stringify(input);
  const [remote, setRemote] = useState<{ key: string; result: SavingsResult } | null>(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      api
        .post<SavingsResult>("/api/savings/estimate", input)
        .then((result) => active && setRemote({ key, result }))
        .catch(() => undefined); // offline: the local estimate below is already shown
    }, DEBOUNCE_MS);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [input, key]);

  const result = remote?.key === key ? remote.result : estimateSavings(input);
  const fill = ((bill - MIN_BILL) / (MAX_BILL - MIN_BILL)) * 100;

  const metrics = [
    { icon: PiggyBank, label: "Ersparnis über 25 Jahre", value: formatMoney(result.lifetime_savings), big: true },
    { icon: Wallet, label: "Jährliche Ersparnis", value: formatMoney(result.annual_savings) },
    { icon: CalendarClock, label: "Amortisationszeit", value: `${formatNumber(result.payback_years)} Jahre` },
    { icon: PanelsTopLeft, label: "Empfohlene Anlage", value: `${result.panels} Module · ${formatNumber(result.system_kw)} kWp` },
    { icon: BatteryCharging, label: "Anlagenpreis inkl. 0 % MwSt.", value: formatMoney(result.net_cost) },
    { icon: Leaf, label: "Vermiedenes CO₂ pro Jahr", value: `${formatNumber(result.co2_tons_per_year)} Tonnen`, wide: true },
  ];

  return (
    <div className="glass relative overflow-hidden p-5 sm:p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-sun/20 blur-3xl" aria-hidden />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
        <div className="space-y-7">
          <div>
            <div className="flex items-end justify-between gap-4">
              <label htmlFor="bill" className="text-sm font-medium text-slate-200">Durchschnittliche monatliche Stromkosten</label>
              <output htmlFor="bill" className="font-display text-3xl font-bold text-white">{formatMoney(bill)}</output>
            </div>
            <input id="bill" type="range" min={MIN_BILL} max={MAX_BILL} step={5} value={bill} onChange={(e) => setBill(Number(e.target.value))} className="solar-range mt-4" style={{ "--fill": `${fill}%` } as React.CSSProperties} />
            <div className="mt-2 flex justify-between text-xs text-slate-500"><span>{formatMoney(MIN_BILL)}</span><span>{formatMoney(MAX_BILL)}+</span></div>
          </div>
          <div>
            <label htmlFor="region" className="text-sm font-medium text-slate-200">Ihre Region</label>
            <select id="region" value={region} onChange={(e) => setRegion(Number(e.target.value))} className="field-input mt-2">
              {REGIONS.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
            </select>
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-slate-200">Dachart</legend>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {ROOFS.map((r) => (
                <button key={r.value} type="button" onClick={() => setRoof(r.value)} aria-pressed={roof === r.value} className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition ${roof === r.value ? "border-sun bg-sun/15 text-sun" : "border-white/10 text-slate-300 hover:border-white/25"}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </fieldset>
          {!compact && <p className="text-xs leading-relaxed text-slate-500">Die Schätzung basiert auf einem Strompreis von 0,35 €/kWh, 0 % MwSt. auf die Anlage und einer Deckung von 75 % Ihrer Stromkosten durch Eigenverbrauch und Einspeisevergütung. Die genauen Werte bestätigen wir Ihnen mit einer kostenlosen Dachanalyse.</p>}
        </div>
        <div className="grid grid-cols-2 gap-3" aria-live="polite">
          {metrics.map(({ icon: Icon, label, value, big, wide }) => (
            <motion.div key={label} layout className={`rounded-2xl border border-line bg-ink/50 p-4 ${big ? "col-span-2 bg-gradient-to-br from-sun/15 to-flare/5 sm:p-6" : ""} ${wide ? "col-span-2" : ""}`}>
              <Icon className={`size-5 ${big ? "text-sun" : "text-volt"}`} aria-hidden />
              <p className="mt-3 text-xs text-mist">{label}</p>
              <p className={`mt-1 font-display font-bold text-white ${big ? "text-4xl sm:text-5xl text-gradient" : "text-lg sm:text-xl"}`}>{value}</p>
            </motion.div>
          ))}
          <Link to={`/quote?bill=${bill}`} className="btn-primary col-span-2 mt-1">
            Diese Ersparnis sichern <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
