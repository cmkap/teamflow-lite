import { describe, it, expect } from "vitest";
import { POST } from "./route";

interface Message {
  user: string;
  text: string;
}

interface AnalyseRequest {
  messages: Message[];
}

interface Analysis {
  counts: Record<string, number>;
  avgSentiment: number;
  nudges: string[];
}

function createRequest(body: AnalyseRequest | object) {
  return new Request("http://localhost/api/analyse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/analyse POST", () => {
  it("returns analysis for valid messages", async () => {
    const messages: Message[] = [
      { user: "Alice", text: "Great job everyone!" },
      { user: "Bob", text: "I'm worried about this." },
      { user: "Alice", text: "Let's keep pushing." },
    ];

    const req = createRequest({ messages });
    const res = await POST(req);
    const json: Analysis = await res.json();

    expect(res.status).toBe(200);
    expect(json.counts).toEqual({ Alice: 2, Bob: 1 });
    expect(typeof json.avgSentiment).toBe("number");
    expect(Array.isArray(json.nudges)).toBe(true);
  });

  it("returns 400 for invalid request shape", async () => {
    const invalidBody = { msg: "wrong field" };
    const req = createRequest(invalidBody);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });
});
