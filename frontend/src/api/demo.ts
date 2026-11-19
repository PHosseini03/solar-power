// Demo-mode responses for the static (GitHub Pages) build, where no backend runs.
// Mirrors the success payloads of backend/app/routers so forms show their real confirmation.
// Nothing is sent or stored anywhere.

type Payload = Readonly<Record<string, unknown>>;
type Handler = (p: Payload) => unknown;

const ID_RANGE = 100_000;

const demoId = (): number => Date.now() % ID_RANGE;
const isPayload = (value: unknown): value is Payload =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const text = (p: Payload, key: string): string => String(p[key] ?? "").trim();
const firstName = (p: Payload, key = "name"): string => text(p, key).split(/\s+/)[0] ?? "";

const HANDLERS: Readonly<Record<string, Handler>> = {
  "/api/quotes": (p) => ({ id: demoId(), message: `Danke, ${firstName(p)}! Eine Solarberaterin oder ein Solarberater ruft Sie innerhalb von 24 Stunden an.` }),
};

const FALLBACK_MESSAGE = "Vielen Dank! Ihre Anfrage ist eingegangen.";

export function demoResponse(path: string, payload: unknown): unknown {
  const handler = HANDLERS[path];
  const body = isPayload(payload) ? payload : {};
  return handler ? handler(body) : { id: demoId(), message: FALLBACK_MESSAGE };
}
