# Calabash LMS

Calabash is a modern Learning Management System (LMS) designed to enhance the educational experience for students and lecturers.

## Features

- **Dashboard**: Role-based dashboards for Students and Lecturers.
- **Course Management**: Detailed course views with stats, materials, and updates.
- **Digital Library**: Centralized repository for course materials with preview functionality (PDF, Video, Images).
- **Settings**: Profile management and application preferences.
- **Authentication**: Secure login and signup flows (Mock implementation).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & Hugeicons
- **State Management**: Zustand
- **Components**: Radix UI primitives (via custom core components)

## Getting Started

Run commands from the `frontend` directory:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Dev Server Reliability

The `dev` script now runs a preflight check before `next dev`:

- Detects `.next/dev/lock`
- Probes `http://127.0.0.1:<port>/dashboard`
- If another dev server is active, exits with a clear message
- If lock is stale, removes it and continues

If you need to clear local dev lock/log state manually:

```bash
npm run dev:reset
```

### Lock Conflict Workflow

1. If `npm run dev` says another instance is running, stop the existing process or run on a different `PORT`.
2. If you suspect stale state, run `npm run dev:reset`.
3. Start again with `npm run dev`.

## Project Structure

- `/src/app`: App Router pages and layouts.
- `/src/components`: Reusable UI components.
- `/src/store`: Global state management stores.
- `/src/services`: API service and type definitions.
- `/src/data`: Mock data for development.