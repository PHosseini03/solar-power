import { Link } from "react-router-dom";
import { SunDim } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center px-4 pt-24 text-center">
      <div>
        <SunDim className="mx-auto size-16 text-sun" aria-hidden />
        <h1 className="mt-6 text-5xl font-bold text-white">404</h1>
        <p className="lead mt-3">Diese Seite liegt im Schatten. Wir bringen Sie zurück in die Sonne.</p>
        <Link to="/" className="btn-primary mt-8">Zur Startseite</Link>
      </div>
    </section>
  );
}
