import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo, NAV_LINKS } from "./Navbar";
import { CONTACT } from "../data/demo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel/60">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-mist">
            Premium-Photovoltaik, Batteriespeicher und Wallboxen für Eigenheime, Unternehmen und Landwirtschaft. Geplant, angemeldet und montiert von unseren eigenen zertifizierten Teams.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">Entdecken</h2>
          <ul className="space-y-2 text-sm text-mist">
            {NAV_LINKS.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-sun">{l.label}</Link></li>
            ))}
            <li><Link to="/quote" className="hover:text-sun">Kostenloses Angebot</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">Kontakt</h2>
          <ul className="space-y-3 text-sm text-mist">
            <li className="flex items-center gap-2"><Phone className="size-4 text-sun" aria-hidden /><a href={`tel:${CONTACT.phone}`} className="hover:text-white">{CONTACT.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-sun" aria-hidden /><a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a></li>
            <li className="flex items-center gap-2"><MapPin className="size-4 text-sun" aria-hidden />{CONTACT.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container-x py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} HelioGrid Solar. Demo-Website – alle Namen, Personen und Zahlen sind fiktiv.
        </p>
      </div>
    </footer>
  );
}
