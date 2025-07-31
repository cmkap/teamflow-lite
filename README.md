![CI](https://github.com/cmkap/teamflow-lite/actions/workflows/ci.yml/badge.svg)

# TeamFlow Lite

## Overview

TeamFlow Lite is a lightweight full-stack demo app built with Next.js and TypeScript that simulates analyzing team communication patterns to generate real-time insights and nudges. It demonstrates core skills including backend API design, data processing pipelines, and frontend data visualization with professional UX/UI polish.

This project was created as part of a technical test for a Full Stack Engineer role, showcasing foundational decisions in product architecture, API design, and CI/CD best practices. The app is deployed on Vercel for seamless continuous deployment and hosting, demonstrating real-world deployment workflows.

## Features

- **Next.js (React + TypeScript)** front end with a clean, responsive UI.
- **Backend API** at `/api/analyse` accepting POST requests with message data.
- Processes messages using sentiment analysis to calculate counts, average sentiment, and generate team nudges.
- Supports multiple **predefined scenarios** to show varied communication dynamics.
- Interactive **bar chart visualization** with Recharts.
- Real-time feedback simulation triggered on demand.
- Displays notable messages with emojis to highlight sentiment and team mood.
- Input validation with **Zod** schema validation.
- Comprehensive **unit tests** with Vitest.
- Uses relative API routes, eliminating hardcoded URLs for better portability.
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

### Deployment

This project is deployed on [Vercel](https://teamflow-lite.vercel.app/). 

To deploy your own version:

- Connect your GitHub repository to Vercel.
- Configure environment variables in the Vercel dashboard (e.g., `NEXT_PUBLIC_BASE_URL`).
- Vercel will automatically build and deploy the app on every push to the main branch.


### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Usage

- Select a scenario from the dropdown to see varied communication patterns and nudges reflecting different team dynamics.
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
- **Error Handling** Improved error handling on frontend to provide clearer feedback for failed analyses
- **Real-time Insights:** User-triggered synchronous processing mimics always-on AI teammate responsiveness.
- **CI/CD:** GitHub Actions automates linting and testing on pull requests, ensuring code quality and fast iteration.
- **UX/UI:** Modern, accessible design using Tailwind CSS and Recharts provides clear, intuitive feedback.
- **Testing:** Unit tests cover valid, invalid, and edge cases, demonstrating commitment to quality.
- **Version Control:** Feature branches and pull requests encourage collaboration and maintainable code history.
- **Deployment:** Hosted on Vercel to showcase modern cloud deployment, continuous delivery, and zero-downtime updates.

## Future Improvements

- Replace static, hardcoded message datasets with dynamic data ingestion from a persistent backend datastore (e.g., database or external API). This would enable real-time user-generated content, scalable data management, and more comprehensive testing with live data scenarios.
- Swagger/OpenAPI spec generation directly from code for API docs.
- More extensive NLP and machine learning to generate nuanced nudges.
- Real-time streaming and WebSocket support for live updates.
- User authentication and multi-team support.
- End-to-end and integration testing to complement unit tests.
- Deeper integration with Vercel features like Preview Deployments and Environment Management.

---

Thank you for reviewing TeamFlow Lite!

