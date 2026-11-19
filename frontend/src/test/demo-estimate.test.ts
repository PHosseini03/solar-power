import { demoResponse } from "../api/demo";
import { estimateSavings } from "../lib/savings";

describe("demo savings estimate", () => {
  it("returns the full calculator result so the page can render it", () => {
    const input = { monthly_bill: 100, sun_hours: 3, roof_type: "asphalt" as const };
    const result = demoResponse("/api/savings/estimate", input);
    expect(result).toEqual(estimateSavings(input));
    expect(typeof (result as { payback_years: unknown }).payback_years).toBe("number");
  });
});
