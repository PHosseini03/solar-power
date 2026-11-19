export type Errors<T> = Partial<Record<keyof T, string>>;
type Rule = (value: string) => string | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ()\-.]{7,20}$/;
const UNSAFE_RE = /[<>]/;

export const rules = {
  required: (label: string): Rule => (v) => (v.trim() ? null : `${label} ist ein Pflichtfeld`),
  name: ((v) =>
    v.trim().length < 2 ? "Bitte geben Sie Ihren vollständigen Namen ein" : UNSAFE_RE.test(v) ? "Der Name enthält ungültige Zeichen" : null) as Rule,
  email: ((v) => (EMAIL_RE.test(v.trim()) ? null : "Bitte geben Sie eine gültige E-Mail-Adresse ein")) as Rule,
  phone: ((v) => (PHONE_RE.test(v.trim()) ? null : "Bitte geben Sie eine gültige Telefonnummer ein")) as Rule,
  minLength: (label: string, n: number): Rule => (v) =>
    v.trim().length >= n ? null : `${label} muss mindestens ${n} Zeichen lang sein`,
  safeText: ((v) => (UNSAFE_RE.test(v) ? "Bitte entfernen Sie die Zeichen < und >" : null)) as Rule,
  number: (label: string, min: number, max: number): Rule => (v) => {
    const n = Number(v);
    return v.trim() !== "" && Number.isFinite(n) && n >= min && n <= max ? null : `${label} muss zwischen ${min} und ${max} liegen`;
  },
};

export function validate<T extends Record<string, string>>(values: T, schema: Partial<Record<keyof T, Rule[]>>): Errors<T> {
  const errors: Errors<T> = {};
  for (const key of Object.keys(schema) as (keyof T)[]) {
    for (const rule of schema[key] ?? []) {
      const message = rule(values[key] ?? "");
      if (message) {
        errors[key] = message;
        break;
      }
    }
  }
  return errors;
}
