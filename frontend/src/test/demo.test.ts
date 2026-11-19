import { demoResponse } from "../api/demo";

describe("demoResponse (static demo build)", () => {
  it("confirms /api/quotes like the backend does", () => {
    const result = demoResponse("/api/quotes", {"name":"Avery Klein"}) as Record<string, unknown>;
    expect(typeof result.id).toBe("number");
    expect(result.message).toContain("Danke, Avery!");
    expect(result).toMatchObject({});
  });

  it("falls back to a generic confirmation for unknown endpoints and bad payloads", () => {
    const result = demoResponse("/api/unknown", null) as Record<string, unknown>;
    expect(typeof result.id).toBe("number");
    expect(result.message).toBe("Vielen Dank! Ihre Anfrage ist eingegangen.");
  });
});
