"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const demoMessages = [
  { user: "Alice", text: "Great job everyone!" },
  { user: "Bob", text: "I'm not sure this will work" },
  { user: "Alice", text: "Let's try and see" },
  { user: "Charlie", text: "Sounds good" },
];

export default function Page() {
  const [analysis, setAnalysis] = useState<any>(null);

  async function analyse() {
    const res = await fetch("/api/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: demoMessages }),
    });
    setAnalysis(await res.json());
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TeamFlow Lite</h1>
      <button
        onClick={analyse}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Analyse Demo Messages
      </button>

      {analysis && (
        <div className="space-y-4">
          <BarChart
            width={300}
            height={200}
            data={Object.entries(analysis.counts).map(([user, count]) => ({
              user,
              count,
            }))}
          >
            <XAxis dataKey="user" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>

          <p>Average sentiment: {analysis.avgSentiment.toFixed(2)}</p>

          {analysis.nudges.length > 0 && (
            <div className="p-4 bg-yellow-100 rounded">
              <h2 className="font-semibold">Nudges</h2>
              <ul>
                {analysis.nudges.map((nudge: string, i: number) => (
                  <li key={i}>{nudge}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
