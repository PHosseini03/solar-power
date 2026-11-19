import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import Quote from "../pages/Quote";
import Projects from "../pages/Projects";
import { DEMO_PLANS, DEMO_PROJECTS, DEMO_STATS } from "../data/demo";
import { mockApi, renderAt } from "./render";

const ROUTES = { "/api/plans": DEMO_PLANS, "/api/projects": DEMO_PROJECTS, "/api/stats": DEMO_STATS };

describe("App routing", () => {
  it("renders the home hero and plans", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />);
    expect(screen.getByRole("heading", { level: 1, name: /angetrieben von der sonne/i })).toBeInTheDocument();
    expect(await screen.findByText("Solar-Finanzierung")).toBeInTheDocument();
  });

  it("shows a 404 page for unknown routes", () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />, "/nowhere");
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  it("toggles the mobile menu", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />);
    const toggle = screen.getByRole("button", { name: /menü öffnen/i });
    await userEvent.click(toggle);
    expect(screen.getByRole("button", { name: /menü schließen/i })).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();
  });

  it("renders every main page", () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    for (const [path, title] of [["/solutions", /jedes dach/i], ["/calculator", /wie viel/i], ["/quote", /individuelles solarkonzept/i]] as const) {
      const { unmount } = renderAt(<App />, path);
      expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
      unmount();
    }
  });
});

describe("Projects page", () => {
  it("falls back to demo data when the API is down and filters", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    renderAt(<Projects />);
    expect(await screen.findByRole("heading", { name: "Hof Talblick" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Landwirtschaft" }));
    expect(screen.queryByRole("heading", { name: "Einfamilienhaus am Hang" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hof Talblick" })).toBeInTheDocument();
  });
});

describe("Quote form", () => {
  it("shows validation errors and does not submit", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<Quote />);
    await userEvent.click(screen.getByRole("button", { name: /kostenloses angebot anfordern/i }));
    expect(await screen.findByText("Bitte geben Sie Ihren vollständigen Namen ein")).toBeInTheDocument();
    expect(screen.getByText("Bitte geben Sie eine gültige E-Mail-Adresse ein")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits valid data and shows confirmation", async () => {
    const fetchMock = mockApi({ "/api/quotes": { id: 7, message: "Danke, Jonas! Eine Solarberaterin oder ein Solarberater ruft Sie innerhalb von 24 Stunden an." } });
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<Quote />, "/quote?bill=180&plan=Solar-Finanzierung");
    await userEvent.type(screen.getByLabelText("Vor- und Nachname"), "Jonas Weber");
    await userEvent.type(screen.getByLabelText("E-Mail"), "jonas@example.com");
    await userEvent.type(screen.getByLabelText("Telefon"), "089 1234 5678");
    await userEvent.type(screen.getByLabelText("Adresse der Immobilie"), "Sonnenstraße 12, München");
    await userEvent.click(screen.getByRole("button", { name: /kostenloses angebot anfordern/i }));
    const status = await screen.findByText("Anfrage erhalten!");
    expect(status).toBeInTheDocument();
    expect(screen.getByText(/Vorgangsnummer #00007/)).toBeInTheDocument();
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body).toMatchObject({ monthly_bill: 180, message: "Ich interessiere mich für das Modell „Solar-Finanzierung“." });
    await userEvent.click(screen.getByRole("button", { name: /weitere anfrage senden/i }));
    expect(screen.getByLabelText("Vor- und Nachname")).toBeInTheDocument();
  });

  it("shows an error toast when the server rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: "Zu viele Anfragen." }), { status: 429 })));
    renderAt(<Quote />, "/quote?bill=200");
    await userEvent.type(screen.getByLabelText("Vor- und Nachname"), "Jonas Weber");
    await userEvent.type(screen.getByLabelText("E-Mail"), "jonas@example.com");
    await userEvent.type(screen.getByLabelText("Telefon"), "089 1234 5678");
    await userEvent.type(screen.getByLabelText("Adresse der Immobilie"), "Sonnenstraße 12, München");
    await userEvent.click(screen.getByRole("button", { name: /kostenloses angebot anfordern/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(within(screen.getByRole("alert")).getByText(/konnte nicht gesendet werden/i)).toBeInTheDocument();
  });
});

describe("Savings calculator", () => {
  it("updates the estimate when the bill changes", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    renderAt(<App />, "/calculator");
    const slider = screen.getByLabelText(/durchschnittliche monatliche stromkosten/i);
    const before = screen.getByText(/Module ·/).textContent;
    fireEvent.change(slider, { target: { value: "400" } });
    await waitFor(() => expect(screen.getByText(/Module ·/).textContent).not.toBe(before));
    await userEvent.click(screen.getByRole("button", { name: "Ziegel" }));
    expect(screen.getByRole("button", { name: "Ziegel" })).toHaveAttribute("aria-pressed", "true");
  });
});
