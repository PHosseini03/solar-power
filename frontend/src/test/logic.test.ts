import { describe, expect, it, vi } from "vitest";
import { estimateSavings, formatMoney, formatNumber } from "../lib/savings";
import { rules, validate } from "../lib/validation";
import { api, ApiError, request } from "../api/client";

describe("estimateSavings", () => {
  it("returns more panels and savings for a larger bill", () => {
    const small = estimateSavings({ monthly_bill: 80, sun_hours: 5, roof_type: "asphalt" });
    const large = estimateSavings({ monthly_bill: 400, sun_hours: 5, roof_type: "asphalt" });
    expect(large.panels).toBeGreaterThan(small.panels);
    expect(large.annual_savings).toBeGreaterThan(small.annual_savings);
  });

  it("matches the backend formula for a known German input", () => {
    const r = estimateSavings({ monthly_bill: 100, sun_hours: 3, roof_type: "asphalt" });
    expect(r).toEqual({
      panels: 10, system_kw: 4, net_cost: 6400, annual_savings: 900,
      payback_years: 7.1, lifetime_savings: 18800, co2_tons_per_year: 1.3,
    });
  });

  it("never recommends fewer than 4 panels", () => {
    expect(estimateSavings({ monthly_bill: 20, sun_hours: 8, roof_type: "metal" }).panels).toBe(4);
  });

  it("formats money as euros without decimals", () => {
    expect(formatMoney(38702)).toMatch(/^38\.702\s€$/);
  });

  it("formats numbers with a German decimal comma", () => {
    expect(formatNumber(7.1)).toBe("7,1");
    expect(formatNumber(12480)).toBe("12.480");
  });
});

describe("validate", () => {
  const schema = { name: [rules.name], email: [rules.email], phone: [rules.phone], bill: [rules.number("Stromkosten", 20, 5000)], note: [rules.safeText] };

  it("passes valid values", () => {
    expect(validate({ name: "Jonas Weber", email: "j@example.com", phone: "+49 89 1234 5678", bill: "180", note: "hi" }, schema)).toEqual({});
  });

  it("reports each invalid field once", () => {
    const errors = validate({ name: "<b>", email: "nope", phone: "abc", bill: "", note: "<script>" }, schema);
    expect(Object.keys(errors).sort()).toEqual(["bill", "email", "name", "note", "phone"]);
  });

  it("required and minLength rules", () => {
    expect(rules.required("Ort")(" ")).toBe("Ort ist ein Pflichtfeld");
    expect(rules.minLength("Adresse", 5)("abc")).toBe("Adresse muss mindestens 5 Zeichen lang sein");
    expect(rules.minLength("Adresse", 5)("abcdef")).toBeNull();
  });
});

describe("api client", () => {
  it("unwraps a successful envelope", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: [1, 2], error: null }), { status: 200 })));
    await expect(api.get<number[]>("/api/x")).resolves.toEqual([1, 2]);
  });

  it("throws the server error message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: "email: invalid" }), { status: 422 })));
    await expect(api.post("/api/x", {})).rejects.toThrow("email: invalid");
  });

  it("flags network failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    const err = await request("/api/x").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).isNetwork).toBe(true);
  });

  it("handles non-JSON responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>", { status: 502 })));
    await expect(request("/api/x")).rejects.toThrow("unerwartet geantwortet");
  });
});
