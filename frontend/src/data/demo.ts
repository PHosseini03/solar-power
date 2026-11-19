// Fictional demo data. Mirrors the backend seed so the site works offline.
export interface Plan {
  id: number;
  name: string;
  tagline: string;
  price_label: string;
  features: string[];
  featured: boolean;
}

export interface Project {
  id: number;
  title: string;
  location: string;
  kw: number;
  savings: number;
  image: string;
  quote: string;
  customer: string;
}

export interface Stats {
  homes_powered: number;
  mw_installed: number;
  tons_co2_saved: number;
  rating: number;
}

export const DEMO_PLANS: Plan[] = [
  { id: 1, name: "Solar-Pacht", tagline: "Ohne Anzahlung sofort sparen", price_label: "0 € Anzahlung", features: ["Keine Anschaffungskosten", "Wartung inklusive", "25 Jahre Leistungsgarantie", "Feste Monatsrate"], featured: false },
  { id: 2, name: "Solar-Finanzierung", tagline: "Eigene Anlage, volle Einspeisevergütung", price_label: "Ab 3,99 % eff. Jahreszins", features: ["KfW-Förderkredit möglich", "Steigert den Immobilienwert", "Laufzeit 10–20 Jahre", "Monitoring-App"], featured: true },
  { id: 3, name: "Direktkauf", tagline: "Maximale Ersparnis über die Laufzeit", price_label: "Beste Rendite", features: ["Schnellste Amortisation (8–10 Jahre)", "0 % MwSt. auf Anlage & Speicher", "25 Jahre Garantie", "Speicher-ready"], featured: false },
];

export const DEMO_PROJECTS: Project[] = [
  { id: 1, title: "Einfamilienhaus am Hang", location: "Freiburg im Breisgau", kw: 9.6, savings: 1640, image: "/images/project-1.jpg", quote: "Unsere Stromrechnung ist von 190 € auf 25 € im Monat gesunken. Die Montage dauerte nur einen Tag.", customer: "Familie Becker" },
  { id: 2, title: "Grünblatt Kaffeerösterei", location: "Hamburg", kw: 42, savings: 9600, image: "/images/project-2.jpg", quote: "Jede Röstung läuft jetzt mit Sonnenstrom. Unsere Kundschaft liebt diese Geschichte.", customer: "Inhaberin, Grünblatt" },
  { id: 3, title: "Hof Talblick", location: "Landshut, Bayern", kw: 120, savings: 28400, image: "/images/project-3.jpg", quote: "Die Bewässerungspumpen laufen mit Sonnenenergie. Nach weniger als sieben Jahren amortisiert.", customer: "Hof Talblick" },
];

export const DEMO_STATS: Stats = { homes_powered: 12480, mw_installed: 186, tons_co2_saved: 94200, rating: 4.9 };

export const CONTACT = {
  phone: "+49 89 4520 1420",
  email: "hallo@heliogrid.example",
  address: "Sonnenallee 40, 80331 München",
};
