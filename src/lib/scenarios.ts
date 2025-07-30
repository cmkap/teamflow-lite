// src/lib/scenarios.ts

export const scenarios = [
  {
    name: "Positive Team",
    messages: [
      { user: "Alice", text: "Great job everyone!" },
      { user: "Bob", text: "I’m feeling optimistic about this." },
      { user: "Alice", text: "Let’s keep up the good work." },
      { user: "Charlie", text: "This is really exciting!" },
    ],
  },
  {
    name: "Stressful Deadline",
    messages: [
      { user: "Alice", text: "We are running late on this." },
      { user: "Bob", text: "This is stressful, need help." },
      { user: "Charlie", text: "Let’s prioritize the blockers." },
      { user: "Alice", text: "We can still make it if we focus." },
    ],
  },
  {
    name: "Uneven Participation",
    messages: [
      { user: "Alice", text: "I think we should discuss the roadmap." },
      { user: "Alice", text: "Any thoughts?" },
      { user: "Alice", text: "I’m happy to take the lead." },
      { user: "Bob", text: "Looks good to me." },
    ],
  },
];
