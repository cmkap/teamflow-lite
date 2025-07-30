"use client";

import { useState } from "react";
import { scenarios } from "@/lib/scenarios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { demoMessages } from "@/data/demoMessages";

interface Analysis {
  counts: Record<string, number>;
  avgSentiment: number;
  nudges: string[];
  notableMessages?: string[];
}

export default function Page() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [highlightedUser, setHighlightedUser] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  async function analyse() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/api/analyse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: demoMessages,
          ...(selectedScenario && { scenarioName: selectedScenario }),
        }),
      });

      if (!res.ok) throw new Error("Failed to analyse");

      const data = await res.json();
      setAnalysis(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }

  const sentimentColor = (score: number) =>
    score > 0 ? "text-green-600" : score < 0 ? "text-red-600" : "text-gray-700";

  function handleNotableClick(message: string) {
    // naive: look for "Alice:" at start
    const match = message.match(/^(\w+):/);
    if (match) {
      setHighlightedUser(match[1]);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">TeamFlow Lite</h1>
        <p className="text-gray-600">
          Analyse team conversations and see how dynamics change under different
          scenarios.
        </p>
      </header>

      {/* Scenario Selector */}
      <div className="space-y-2">
        <label htmlFor="scenario" className="font-semibold">
          Select Scenario
        </label>
        <select
          id="scenario"
          value={selectedScenario}
          onChange={(e) => setSelectedScenario(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Use demo messages</option>
          {scenarios.map((scenario) => (
            <option key={scenario.name} value={scenario.name}>
              {scenario.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={analyse}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700"
      >
        {loading ? "Analysing..." : "Analyse"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {analysis && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">
            Results {selectedScenario && `– ${selectedScenario}`}
          </h2>

          {/* Sentiment */}
          <div className="p-4 bg-gray-50 rounded space-y-2">
            <p className="font-medium flex items-center gap-2">
              Average sentiment:{" "}
              <span className={sentimentColor(analysis.avgSentiment)}>
                {analysis.avgSentiment.toFixed(2)}
              </span>
              <span>
                {analysis.avgSentiment > 1
                  ? "😊"
                  : analysis.avgSentiment < -1
                  ? "😟"
                  : "😐"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Scores above <strong>0</strong> mean the conversation tone is
              positive,
              <strong> 0</strong> is neutral, and scores below{" "}
              <strong>0</strong> mean the tone is negative. The further from
              zero, the stronger the tone.
            </p>
          </div>

          {/* Nudges */}
          <div>
            <h3 className="font-semibold mb-2">Nudges</h3>
            {analysis.nudges.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {analysis.nudges.map((nudge, i) => (
                  <li
                    key={i}
                    className="bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-sm"
                  >
                    {nudge}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No nudges detected.</p>
            )}
          </div>

          {/* Notable Messages */}
          {analysis.notableMessages && analysis.notableMessages.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 mt-6">Notable Messages</h3>
              <ul className="space-y-2">
                {analysis.notableMessages.map((msg, i) => (
                  <li
                    key={i}
                    onClick={() => handleNotableClick(msg)}
                    className="cursor-pointer bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-gray-800 hover:bg-blue-100"
                  >
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bar Chart */}
          <div className="h-64 bg-gray-50 p-4 rounded">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(analysis.counts).map(([user, count]) => ({
                  user,
                  count,
                }))}
              >
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count">
                  {Object.entries(analysis.counts).map(([user], index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        highlightedUser === user
                          ? "#f59e0b" // amber highlight
                          : "#3b82f6" // blue
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </main>
  );
}
