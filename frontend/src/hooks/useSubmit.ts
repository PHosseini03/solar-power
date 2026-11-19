import { useState } from "react";
import { api, ApiError } from "../api/client";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function useSubmit<TPayload, TResult>(path: string) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TResult | null>(null);

  async function submit(payload: TPayload): Promise<TResult | null> {
    setStatus("submitting");
    setError(null);
    try {
      const data = await api.post<TResult>(path, payload);
      setResult(data);
      setStatus("success");
      return data;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.";
      setError(message);
      setStatus("error");
      return null;
    }
  }

  function reset() {
    setStatus("idle");
    setError(null);
    setResult(null);
  }

  return { status, error, result, submit, reset };
}
