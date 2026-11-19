import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sun, X, Phone } from "lucide-react";
import { CONTACT } from "../data/demo";

export const NAV_LINKS = [
  { to: "/", label: "Start" },
  { to: "/solutions", label: "Lösungen" },
  { to: "/calculator", label: "Ersparnisrechner" },
  { to: "/projects", label: "Projekte" },
];

const SCROLL_THRESHOLD = 24;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-white" aria-label="HelioGrid Solar Startseite">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-sun to-flare text-ink shadow-lg shadow-sun/30">
        <Sun className="size-5" strokeWidth={2.5} aria-hidden />
      </span>
      HelioGrid
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "bg-transparent"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-sun focus:px-4 focus:py-2 focus:text-ink">
        Zum Inhalt springen
      </a>
      <nav className="container-x flex h-18 items-center justify-between" aria-label="Hauptnavigation">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"}`}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <Phone className="size-4" aria-hidden /> {CONTACT.phone}
          </a>
          <Link to="/quote" className="btn-primary !px-5 !py-2.5">Kostenloses Angebot</Link>
        </div>
        <button type="button" className="grid size-11 place-items-center rounded-full border border-white/10 text-white lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Menü schließen" : "Menü öffnen"}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-line lg:hidden">
            <ul className="container-x flex flex-col gap-1 py-4">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-medium ${isActive ? "bg-white/10 text-white" : "text-slate-300"}`}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/quote" className="btn-primary w-full">Kostenloses Angebot</Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
