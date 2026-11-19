import { demoResponse } from "./demo";

export interface Envelope<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export class ApiError extends Error {
  readonly isNetwork: boolean;
  constructor(message: string, isNetwork = false) {
    super(message);
    this.name = "ApiError";
    this.isNetwork = isNetwork;
  }
}

const TIMEOUT_MS = 8000;

/** Static demo build (GitHub Pages): no backend, so reads use the bundled data and forms get a local confirmation. */
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
const DEMO_DELAY_MS = 600;

async function demoRequest<T>(path: string, init: RequestInit): Promise<T> {
  if ((init.method ?? "GET") === "GET") throw new ApiError("Demo-Modus: Es werden die Beispieldaten angezeigt.", true);
  await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY_MS));
  let payload: unknown;
  try {
    payload = typeof init.body === "string" ? JSON.parse(init.body) : {};
  } catch {
    throw new ApiError("Die Anfrage konnte nicht gelesen werden.");
  }
  return demoResponse(path, payload) as T;
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (IS_DEMO_MODE) return demoRequest<T>(path, init);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(path, { ...init, signal: controller.signal });
  } catch {
    throw new ApiError("Der Server ist nicht erreichbar. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.", true);
  } finally {
    clearTimeout(timer);
  }

  let body: Envelope<T>;
  try {
    body = (await response.json()) as Envelope<T>;
  } catch {
    throw new ApiError("Der Server hat unerwartet geantwortet.", !response.ok);
  }
  if (!response.ok || !body.success || body.data === null) {
    throw new ApiError(body.error ?? "Die Anfrage ist fehlgeschlagen. Bitte versuchen Sie es erneut.");
  }
  return body.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, payload: unknown) =>
    request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};
