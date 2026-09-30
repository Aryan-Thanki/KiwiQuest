# KiwiQuest

**Explore. Pin. Score.** A New Zealand location-guessing game: a modern remake of the original KiwiGuesser project.

Players are dropped into a mystery spot somewhere in Aotearoa, place a pin on the map where they think it is, and score points based on how close they get.

## Features (current state)

- **Landing page** (`/`) with a hero section, a CSS-drawn NZ landscape, and a "How to play" guide.
- **Practice round** (`/game`) with an interactive map of New Zealand:
  - Click anywhere on the map to drop your guess pin (click again to move it).
  - Submit to reveal the real location, your distance from it, and your score.
  - "Try again" resets the round.
- Responsive layout that works on desktop and mobile.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) **20.9 or newer** (required by Next.js 16)
- npm (the project ships with a `package-lock.json`)
- An internet connection, because the map tiles are loaded from OpenStreetMap

### Run locally

```bash
cd kiwiquest
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Play now** (or go straight to [http://localhost:3000/game](http://localhost:3000/game)). The dev server hot-reloads as you edit files.

### Other scripts

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start the development server (Turbopack)      |
| `npm run build` | Create an optimised production build          |
| `npm start`     | Serve the production build (run `build` first) |
| `npm run lint`  | Lint the project with ESLint                  |

No environment variables are required.

## Tech stack

| Area      | Choice                                                                 |
| --------- | ---------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack)               |
| UI        | React 19, TypeScript (strict mode)                                     |
| Map       | [MapLibre GL](https://maplibre.org) via [`react-map-gl`](https://visgl.github.io/react-map-gl/), OpenStreetMap raster tiles |
| Styling   | Tailwind CSS v4 (via PostCSS) plus hand-written CSS in `app/globals.css` |
| Linting   | ESLint 9 with `eslint-config-next` (core web vitals + TypeScript)      |

## Project structure

```
kiwiquest/
├── app/
│   ├── layout.tsx        # Root layout: page metadata and global CSS import
│   ├── page.tsx          # Landing page (/)
│   ├── globals.css       # Theme variables and all app styles
│   ├── favicon.ico
│   └── game/
│       └── page.tsx      # Game page (/game): header + <GuessMap />
├── components/
│   └── guess-map.tsx     # Client component: map, guessing, scoring
├── public/               # Static assets (currently create-next-app defaults)
├── next.config.ts        # Pins Turbopack's root to this folder
├── eslint.config.mjs
├── postcss.config.mjs    # Tailwind CSS v4 PostCSS plugin
├── tsconfig.json         # Strict TS, `@/*` path alias to the project root
├── AGENTS.md / CLAUDE.md # Instructions for AI coding assistants
└── package.json
```

## How it works

### Pages and rendering

The app uses the Next.js **App Router**. `app/page.tsx` and `app/game/page.tsx` are server components that render static markup. The interactive part of the game lives in a single **client component**, `components/guess-map.tsx` (marked `"use client"`), because the map needs the browser.

### A round

All round state is local React state inside `GuessMap`:

- `guess`: the latitude/longitude the player clicked, or `null`.
- `submitted`: whether the guess has been locked in.

1. The map opens centred on New Zealand (zoom 4.7, limited to zoom 4–8, with no repeated world copies).
2. Clicking the map sets `guess` and shows a red pin. Clicks are ignored once the guess is submitted.
3. The **Submit guess** button is disabled until a pin is placed. Submitting shows the green answer pin and a results bar with the answer's name, the distance and the score.
4. **Try again** clears both pieces of state.

The answer is currently hardcoded as **Lindis Pass, Otago** (−44.696, 169.136).

### Distance and scoring

- **Distance** is the great-circle distance between the guess and the answer, calculated with the [haversine formula](https://en.wikipedia.org/wiki/Haversine_formula) (Earth radius 6,371 km) and rounded to the nearest kilometre.
- **Score** decays exponentially with distance:

  ```
  score = round(5000 × e^(−distance_km / 450))
  ```

  A perfect guess scores **5,000**. A guess 450 km away scores about **1,839**, and the score approaches 0 for guesses on the far side of the country.

### Map

The map style is defined inline in `guess-map.tsx` as a minimal MapLibre style with a single OpenStreetMap raster tile layer, so no API key or map provider account is needed. The MapLibre CSS is imported directly in the component.

### Styling

`app/globals.css` imports Tailwind, but the app is currently styled mostly with plain, hand-written CSS classes (`.hero`, `.guess-panel`, `.result`, and so on). The colour theme comes from CSS variables on `:root`:

| Variable  | Use                         |
| --------- | --------------------------- |
| `--ink`   | Main text, dark buttons     |
| `--green` | Brand accent, primary buttons, answer pin |
| `--lime`  | Secondary button            |
| `--cream` | Page background             |
| `--muted` | Secondary text              |
| `--line`  | Borders and dividers        |

A single breakpoint at **800px** switches the layout to one column for mobile.

### Configuration notes

`next.config.ts` sets `turbopack.root` to the current working directory. This stops Turbopack from treating a parent folder as the project root when a parent directory contains its own lockfile.

## Roadmap / known gaps

This is an early build. Things not built yet:

- **Scene imagery**: the landing page promises a scene to explore, but the game page currently shows only the map.
- **Multiple locations and rounds**: there's one hardcoded practice location, and no randomisation or multi-round games.
- **Data layer**: `@tanstack/react-query` and `zod` are installed but not used yet (presumably for fetching and validating location data later).
- **Tests**: there's no test setup yet.
- **Cleanup**: the SVGs in `public/` are create-next-app defaults and aren't used.

## For AI coding assistants

See [`AGENTS.md`](./AGENTS.md). This project uses Next.js 16, which has breaking changes from earlier versions, so check the bundled docs in `node_modules/next/dist/docs/` before changing framework code.
