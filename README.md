
# TeamFlow Lite

## Overview

TeamFlow Lite is a lightweight full-stack demo app built with Next.js and TypeScript that simulates analyzing team communication patterns to generate real-time insights and nudges. It demonstrates core skills including backend API design, data processing pipelines, and frontend data visualization with professional UX/UI polish.

This project was created as part of a technical test for a Full Stack Engineer role, showcasing foundational decisions in product architecture, API design, and CI/CD best practices.

## Features

- **Next.js (React + TypeScript)** front end with a clean, responsive UI.
- **Backend API** at `/api/analyse` accepting POST requests with message data.
- Processes messages using sentiment analysis to calculate counts, average sentiment, and generate team nudges.
- Supports multiple **predefined scenarios** to show varied communication dynamics.
- Interactive **bar chart visualization** with Recharts.
- Real-time feedback simulation triggered on demand.
- Input validation with **Zod** schema validation.
- Comprehensive **unit tests** with Vitest.
- **Environment variable support** for API base URL configuration.
- GitHub Actions workflow for **CI** linting and testing.
- Clean commit history using feature branches and pull requests.

## Getting Started

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Usage

- Select a scenario from the dropdown or use the default demo messages.
- Click **analyse** to process the messages.
- View average sentiment, message counts per user, and nudges suggesting team communication improvements.
- The bar chart dynamically visualizes message activity.

## Code Structure

- `/src/app/api/analyse/route.ts` — Backend API route handling message analysis.
- `/src/lib/validation.ts` — Zod schema for input validation.
- `/src/lib/scenarios.ts` — Predefined message scenarios for varied testing.
- `/src/data/demoMessages.ts` — Default demo message data.
- `/src/app/page.tsx` — Frontend React component managing UI and interactions.
- `/src/app/api/analyse/route.test.ts` — Vitest unit tests for the API.

## Design Decisions and Talking Points

- **API Design:** Clear RESTful endpoint with robust input validation and meaningful JSON responses for frontend consumption.
- **Data Pipeline:** Simulates ingestion, sentiment analysis, and transformation of raw communication data into actionable nudges.
- **Real-time Insights:** User-triggered synchronous processing mimics always-on AI teammate responsiveness.
- **CI/CD:** GitHub Actions automates linting and testing on pull requests, ensuring code quality and fast iteration.
- **UX/UI:** Modern, accessible design using Tailwind CSS and Recharts provides clear, intuitive feedback.
- **Environment Configuration:** Using `NEXT_PUBLIC_BASE_URL` environment variable avoids hardcoded URLs, improving portability.
- **Testing:** Unit tests cover valid, invalid, and edge cases, demonstrating commitment to quality.
- **Version Control:** Feature branches and pull requests encourage collaboration and maintainable code history.

## Future Improvements

- Swagger/OpenAPI spec generation directly from code for API docs.
- More extensive NLP and machine learning to generate nuanced nudges.
- Real-time streaming and WebSocket support for live updates.
- User authentication and multi-team support.
- End-to-end and integration testing to complement unit tests.

---

Thank you for reviewing TeamFlow Lite!

