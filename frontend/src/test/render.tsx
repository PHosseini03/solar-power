import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement } from "react";
import { ToastProvider } from "../components/Toast";

export function renderAt(ui: ReactElement, path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>{ui}</ToastProvider>
    </MemoryRouter>,
  );
}

export function mockApi(routes: Record<string, unknown>) {
  return vi.fn(async (url: string) => {
    const key = Object.keys(routes).find((k) => url.startsWith(k));
    if (!key) return new Response(JSON.stringify({ success: false, data: null, error: "not found" }), { status: 404 });
    return new Response(JSON.stringify({ success: true, data: routes[key], error: null }), { status: 200 });
  });
}
