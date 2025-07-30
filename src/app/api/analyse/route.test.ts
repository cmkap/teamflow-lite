import { describe, it, expect } from "vitest";
import { POST } from "./route"; // adjust path if needed

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
    const messages: Message[] = Array(10).fill({ user: "Alice", text: "Hello!" });
    // 10 messages all from Alice

    const req = createRequest({ messages });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.counts).toEqual({ Alice: 10 });
    expect(json.nudges).toContain("Invite quieter members to contribute.");
  });

  it("triggers negative tone nudge when avg sentiment is below zero", async () => {
    const messages: Message[] = [
      { user: "Alice", text: "This is terrible." },
      { user: "Bob", text: "I hate this." },
    ];

    const req = createRequest({ messages });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.avgSentiment).toBeLessThan(0);
    expect(json.nudges).toContain("Tone seems negative – consider a break.");
  });

  it("handles mixed sentiments and nudges appropriately", async () => {
    const messages: Message[] = [
      { user: "Alice", text: "Great work!" },
      { user: "Bob", text: "I'm worried about this." },
      { user: "Alice", text: "Keep it up!" },
      { user: "Bob", text: "Not sure if this will work." },
      { user: "Charlie", text: "Let's see how it goes." },
    ];

    const req = createRequest({ messages });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.counts).toEqual({ Alice: 2, Bob: 2, Charlie: 1 });
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
    const invalidMessages = [
      { user: "Alice", text: "Valid message" },
      { user: "Bob" }, 
    ];

    const req = createRequest({ messages: invalidMessages });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("accepts messages with extra unexpected fields", async () => {
    const messages: unknown[] = [
      { user: "Alice", text: "Hi", extra: "ignored" },
      { user: "Bob", text: "Hello", extraField: 123 },
    ];

    const req = createRequest({ messages });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.counts).toEqual({ Alice: 1, Bob: 1 });
  });
});
