# Aweh Ekse!

Offline-first substance awareness & conditioning platform by Aweh Ekse!. A mobile-style PWA built with React 19, Vite 8, and Tailwind CSS 4, storing data locally via IndexedDB (Dexie).

## Features

- **Aweh Ekse** — awareness content hub, library (rehab directory, laws, dictionary), wellness, help wizard
- **Information Hub** — articles, categories, substance library, bookmarks, search
- **Activities & Games** — fact/fiction, memory, music match, quizzes, multiplayer word games
- **Mood Tracker** — daily check-ins, heatmap, journal, recovery diary
- **Risk Checker** — guided screening questionnaires with history
- **Contact Directory** — rehab facilities, professionals, hotlines, emergency routing
- **Lesson Plans** — educator dashboard, facilitation guide, reflections
- **Safety Plan** — personal safety plan builder, SOS config
- **Campaigns, Polls, Research** — event planning, surveys, attendance tracking
- **Profiles & Sync** — local profiles with password/PIN protection, offline-first sync
- **PWA** — installable, works offline with cached assets

## Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Build & Preview

```bash
npm run build
npm run preview
```

Or serve the production build:

```bash
start.bat   # runs `npx serve dist -l 8080 --no-clipboard`
```

Open `http://localhost:8080`.

## Lint

```bash
npm run lint
```

## Deployment

This repo auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`.

- Push to `main` (or use the Actions "workflow_dispatch" trigger).
- The workflow builds with `--base=/awehekse/` and copies `index.html` to `404.html` so deep links work after a hard refresh.
- Live site: `https://Kudigotdis.github.io/awehekse/`
- In repo **Settings → Pages**, the source must be set to **GitHub Actions**.

## Project Structure

```
src/
  components/   UI components, layout, error boundary
  context/      React contexts (Offline, Profile, Sync, Favorites, Region)
  core/         seeding, auth (password hashing), data layers
  data/         JSON content (awareness, dictionary, library entries)
  pages/        Route components (AwehEkse, Hub, Games, Mood, Research, ...)
  App.jsx       Routes (react-router-dom v7)
  main.jsx      Entry point (PWA registration, seeding)
public/         Static assets (icons, favicon)
```

## Tech Stack

React 19 · React Router 7 · Vite 8 · Tailwind CSS 4 · Dexie/IndexedDB · vite-plugin-pwa · Workbox · jsPDF · Oxlint
