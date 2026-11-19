// Client-side mirror of the backend estimate, used only when the API is offline.
export type RoofType = "asphalt" | "metal" | "tile" | "flat";

export interface SavingsInput {
  monthly_bill: number;
  sun_hours: number;
  roof_type: RoofType;
}

export interface SavingsResult {
  panels: number;
  system_kw: number;
  net_cost: number;
  annual_savings: number;
  payback_years: number;
  lifetime_savings: number;
  co2_tons_per_year: number;
}

const PANEL_WATTS = 400;
const COST_PER_WATT = 1.6; // EUR per watt, turnkey incl. 0 % MwSt.
const SUBSIDY = 0; // no direct subsidy; KfW financing instead
const PRICE_PER_KWH = 0.35; // EUR, average German household tariff
const CO2_KG_PER_KWH = 0.38; // German grid mix
const SYSTEM_EFFICIENCY = 0.8;
const BILL_OFFSET = 0.75; // self-consumption plus feed-in tariff
const LIFETIME_YEARS = 25;
const RATE_ESCALATION = 1.12;
const MIN_PANELS = 4;
const ROOF_FACTOR: Record<RoofType, number> = { asphalt: 1, metal: 1.02, tile: 0.97, flat: 0.95 };

const round1 = (n: number) => Math.round(n * 10) / 10;

export function estimateSavings({ monthly_bill, sun_hours, roof_type }: SavingsInput): SavingsResult {
  const monthlyKwh = monthly_bill / PRICE_PER_KWH;
  const rawKw = monthlyKwh / 30 / (sun_hours * SYSTEM_EFFICIENCY * ROOF_FACTOR[roof_type]);
  const panels = Math.max(MIN_PANELS, Math.ceil((rawKw * 1000) / PANEL_WATTS));
  const systemKw = (panels * PANEL_WATTS) / 1000;
  const netCost = systemKw * 1000 * COST_PER_WATT * (1 - SUBSIDY);
  const annual = monthly_bill * 12 * BILL_OFFSET;
  return {
    panels,
    system_kw: round1(systemKw),
    net_cost: Math.round(netCost),
    annual_savings: Math.round(annual),
    payback_years: round1(netCost / annual),
    lifetime_savings: Math.round(annual * LIFETIME_YEARS * RATE_ESCALATION - netCost),
    co2_tons_per_year: round1((monthlyKwh * 12 * CO2_KG_PER_KWH) / 1000),
  };
}

export const formatMoney = (n: number): string =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const formatNumber = (n: number): string => n.toLocaleString("de-DE", { maximumFractionDigits: 1 });
