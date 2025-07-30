import { describe, it, expect } from "vitest";
import { POST } from "./route";

interface Message {
  user: string;
  text: string;
}

function createRequest(body: unknown) {
  return new Request("http://localhost/api/analyse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Helper to check nudges more flexibly
function nudgesContain(nudges: string[], keyword: string) {
  return nudges.some((n) =>
    n.toLowerCase().includes(keyword.toLowerCase())
  );
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
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.counts).toEqual({ Alice: 2, Bob: 1 });
    expect(typeof json.avgSentiment).toBe("number");
    expect(Array.isArray(json.nudges)).toBe(true);
  });

  it("returns empty analysis for empty messages array", async () => {
    const req = createRequest({ messages: [] });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.counts).toEqual({});
    expect(json.avgSentiment).toBe(0);
    expect(json.nudges).toEqual([]);
  });

  it("triggers quieter members nudge when one user dominates", async () => {
    const messages = Array(10).fill({ user: "Alice", text: "Hi" });

    const req = createRequest({ messages });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.counts).toEqual({ Alice: 10 });
    expect(nudgesContain(json.nudges, "Invite quieter members")).toBe(true);
  });

  it("triggers negative tone nudge when avg sentiment is below zero", async () => {
    const messages = [
      { user: "Bob", text: "This is terrible" },
      { user: "Bob", text: "I hate this" },
    ];

    const req = createRequest({ messages });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.avgSentiment).toBeLessThan(0);
    expect(nudgesContain(json.nudges, "Tone seems negative")).toBe(true);
  });

  it("handles mixed sentiments and nudges appropriately", async () => {
    const messages = [
      { user: "Alice", text: "Good job" },
      { user: "Alice", text: "Bad outcome" },
      { user: "Bob", text: "Not sure" },
    ];

    const req = createRequest({ messages });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
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

  it("returns 400 if a message is missing required fields", async () => {
    const invalidMessages = [{ user: "Alice" }];
    const req = createRequest({ messages: invalidMessages });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("accepts messages with extra unexpected fields", async () => {
    const messages = [
      { user: "Alice", text: "Hello", extra: "ignore me" },
      { user: "Bob", text: "Hi there", irrelevant: true },
    ];

    const req = createRequest({ messages });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.counts).toEqual({ Alice: 1, Bob: 1 });
  });
});
