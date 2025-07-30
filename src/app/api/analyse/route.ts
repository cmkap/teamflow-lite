import { NextResponse } from 'next/server';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export async function POST(req: Request) {
  const { messages } = await req.json() as { user: string; text: string }[];

  const counts: Record<string, number> = {};
  let totalSentiment = 0;

  for (const { user, text } of messages) {
    counts[user] = (counts[user] || 0) + 1;
    totalSentiment += sentiment.analyze(text).score;
  }

  const topSpeaker = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const avgSentiment = totalSentiment / messages.length;

  const nudges = [];
  if (topSpeaker && topSpeaker[1] / messages.length > 0.7) {
    nudges.push('Invite quieter members to contribute.');
  }
  if (avgSentiment < 0) {
    nudges.push('Tone seems negative – consider a break.');
  }

  return NextResponse.json({ counts, avgSentiment, nudges });
}
