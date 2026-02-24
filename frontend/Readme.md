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

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app`: App Router pages and layouts.
- `/src/components`: Reusable UI components.
- `/src/store`: Global state management stores.
- `/src/services`: API service and type definitions.
- `/src/data`: Mock data for development.
