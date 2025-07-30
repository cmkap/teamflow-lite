// src/app/api/analyse/route.ts
import { AnalyseRequestSchema } from "@/lib/validation";
import { scenarios } from "@/lib/scenarios";
import { NextResponse } from "next/server";
import Sentiment from "sentiment";

const sentiment = new Sentiment();

export async function POST(req: Request) {
  const json = await req.json();

  const result = AnalyseRequestSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.message },
      { status: 400 }
    );
  }

  const body = json as {
    messages: { user: string; text: string }[];
    scenarioName?: string;
};

let messages = body.messages;
const scenarioName = body.scenarioName;

  if (scenarioName) {
    const found = scenarios.find((s) => s.name === scenarioName);
    if (found) {
      messages = found.messages;
    }
  }

  const counts: Record<string, number> = {};
  let totalSentiment = 0;

  // Track extremes
  let mostNegative: { user: string; text: string; score: number } | null = null;
  let mostPositive: { user: string; text: string; score: number } | null = null;

  for (const { user, text } of messages) {
    const score = sentiment.analyze(text).score;
    counts[user] = (counts[user] || 0) + 1;
    totalSentiment += score;

    if (!mostNegative || score < mostNegative.score) {
      mostNegative = { user, text, score };
    }
    if (!mostPositive || score > mostPositive.score) {
      mostPositive = { user, text, score };
    }
  }

  const topSpeaker = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const avgSentiment = messages.length > 0 ? totalSentiment / messages.length : 0;


  const nudges: string[] = [];
  if (topSpeaker && topSpeaker[1] / messages.length > 0.7) {
    nudges.push("👥 Invite quieter members to contribute.");
  }
  if (avgSentiment < 0) {
    nudges.push("😟 Tone seems negative – consider a break.");
  }
  if (avgSentiment > 1) {
    nudges.push("😊 Positive energy detected – keep it up!");
  }

  const notableMessages = [
    mostPositive ? `👍 Positive: "${mostPositive.text}" – ${mostPositive.user}` : null,
    mostNegative ? `⚠️ Negative: "${mostNegative.text}" – ${mostNegative.user}` : null,
  ].filter(Boolean);

  return NextResponse.json({
    counts,
    avgSentiment,
    nudges,
    notableMessages,
  });
}
