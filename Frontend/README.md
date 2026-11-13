# Intelligent IDP Recommendation System — MVP

A frontend MVP for creating personalized Individual Development Plans (IDPs). It uses a transparent, local recommendation engine: it compares a self-assessment against the competency profile for a target role, prioritizes the largest gaps, and creates a small, actionable learning roadmap.

## What works

- Select a career goal from five role paths.
- Rate seven technical and professional skills on a 0–5 scale.
- Generate a role-specific readiness score and skill-gap radar chart.
- Receive prioritized learning actions and mark each one complete.
- Keep assessment and progress data in browser local storage across refreshes.

## Run locally

From the repository root:

```powershell
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). Use `npm run build` to create a production build.

## MVP boundaries

This version deliberately has no login or database; every browser keeps an independent local profile. To take it beyond MVP, add authentication and an API/database for user profiles, a managed learning-resource catalogue, and feedback signals that can improve recommendation ranking.
