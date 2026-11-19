import { useState, type FormEvent } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Loader2, ShieldCheck, Sun } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { SelectField, TextArea, TextField } from "../components/Field";
import { useToast } from "../components/toast-context";
import { useSubmit } from "../hooks/useSubmit";
import { rules, validate, type Errors } from "../lib/validation";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  monthly_bill: string;
  property_type: string;
  message: string;
};

interface QuoteResult {
  id: number;
  message: string;
}

const SCHEMA = {
  name: [rules.name],
  email: [rules.email],
  phone: [rules.phone],
  address: [rules.minLength("Adresse", 5), rules.safeText],
  monthly_bill: [rules.number("Monatliche Stromkosten", 20, 5000)],
  message: [rules.safeText],
};

const PERKS = [
  { icon: Clock, text: "Individuelle Planung innerhalb von 24 Stunden" },
  { icon: ShieldCheck, text: "Unverbindlich und ohne Verkaufsdruck" },
  { icon: Sun, text: "Kostenlose Dachanalyse per Satellit" },
];

export default function Quote() {
  const [params] = useSearchParams();
  const plan = params.get("plan");
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    address: "",
    monthly_bill: params.get("bill") ?? "",
    property_type: "home",
    message: plan ? `Ich interessiere mich für das Modell „${plan}“.` : "",
  });
  const [errors, setErrors] = useState<Errors<FormValues>>({});
  const { status, result, submit, reset } = useSubmit<object, QuoteResult>("/api/quotes");
  const toast = useToast();

  const set = (key: keyof FormValues) => (e: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values, SCHEMA);
    setErrors(found);
    if (Object.keys(found).length) {
      toast("error", "Bitte korrigieren Sie die markierten Felder.");
      return;
    }
    const data = await submit({ ...values, monthly_bill: Number(values.monthly_bill) });
    if (data) toast("success", data.message);
    else toast("error", "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.");
  }

  return (
    <>
      <PageHeader eyebrow="Kostenloses Angebot" title={<>Ihr <span className="text-gradient">individuelles Solarkonzept</span></>} lead="Dauert nur 60 Sekunden. Ein Solarberater aus Ihrer Region schickt Ihnen innerhalb von 24 Stunden Planung und Ersparnisbericht." image="/images/install.jpg" />
      <section className="pb-24">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          <aside className="space-y-4">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4 rounded-2xl border border-line bg-white/[0.03] p-5">
                <span className="grid size-11 place-items-center rounded-xl bg-sun/15 text-sun"><Icon className="size-5" aria-hidden /></span>
                <p className="font-medium text-slate-200">{text}</p>
              </div>
            ))}
            <div className="overflow-hidden rounded-3xl">
              <img src="/images/project-1.jpg" alt="Monteur installiert ein Solarmodul auf einem Dach" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </div>
          </aside>

          <div className="glass p-6 sm:p-10">
            {status === "success" && result ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center" role="status">
                <CheckCircle2 className="mx-auto size-16 text-volt" aria-hidden />
                <h2 className="mt-6 text-3xl font-bold text-white">Anfrage erhalten!</h2>
                <p className="lead mx-auto mt-3 max-w-md">{result.message}</p>
                <p className="mt-2 text-sm text-slate-500">Vorgangsnummer #{String(result.id).padStart(5, "0")}</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link to="/" className="btn-ghost">Zur Startseite</Link>
                  <button type="button" className="btn-primary" onClick={reset}>Weitere Anfrage senden</button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="text-2xl font-bold text-white">Erzählen Sie uns von Ihrer Immobilie</h2>
                  <p className="mt-1 text-sm text-mist">Alle Felder außer „Anmerkungen“ sind Pflichtfelder.</p>
                </div>
                <TextField label="Vor- und Nachname" name="name" autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} maxLength={80} placeholder="Jonas Weber" />
                <TextField label="E-Mail" name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} maxLength={120} placeholder="ihre@email.example" />
                <TextField label="Telefon" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} error={errors.phone} maxLength={20} placeholder="Ihre Telefonnummer" />
                <TextField label="Monatliche Stromkosten (€)" name="monthly_bill" type="number" inputMode="numeric" min={20} max={5000} value={values.monthly_bill} onChange={set("monthly_bill")} error={errors.monthly_bill} placeholder="100" />
                <div className="sm:col-span-2">
                  <TextField label="Adresse der Immobilie" name="address" autoComplete="street-address" value={values.address} onChange={set("address")} error={errors.address} maxLength={160} placeholder="Straße, Hausnummer, PLZ Ort" />
                </div>
                <div className="sm:col-span-2">
                  <SelectField label="Objektart" name="property_type" value={values.property_type} onChange={set("property_type")}>
                    <option value="home">Eigenheim</option>
                    <option value="business">Gewerbe</option>
                    <option value="farm">Landwirtschaft / Freifläche</option>
                  </SelectField>
                </div>
                <div className="sm:col-span-2">
                  <TextArea label="Anmerkungen (optional)" name="message" value={values.message} onChange={set("message")} error={errors.message} maxLength={1000} placeholder="Batteriespeicher, Wallbox, Alter des Dachs …" />
                </div>
                <button type="submit" className="btn-primary text-base sm:col-span-2" disabled={status === "submitting"}>
                  {status === "submitting" ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Wird gesendet …</> : "Kostenloses Angebot anfordern"}
                </button>
                <p className="text-center text-xs text-slate-500 sm:col-span-2">Demo-Formular: Die Daten werden nur in der lokalen Demo-Datenbank gespeichert.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
