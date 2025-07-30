import { describe, it, expect } from "vitest";
import { POST } from "./route";

describe("POST /api/analyse", () => {
  it("analyses messages and returns insights", async () => {
    const req = new Request("http://localhost/api/analyse", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          { user: "Alice", text: "Great job!" },
          { user: "Bob", text: "I am not sure about this" }
        ]
      }),
      headers: { "Content-Type": "application/json" }
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.counts.Alice).toBe(1);
    expect(data.counts.Bob).toBe(1);
    expect(typeof data.avgSentiment).toBe("number");
    expect(Array.isArray(data.nudges)).toBe(true);
  });
});
