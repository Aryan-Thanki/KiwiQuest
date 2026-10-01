# KiwiQuest

**Explore. Pin. Score.** A New Zealand location-guessing game: a modern remake of the original KiwiGuesser project.

Each game is three rounds. Every round names a famous New Zealand spot, the player pins it on the map, and they score points based on how close they get. The three round scores add up to a total, and the best total is kept as a high score.

## Features (current state)

- **Landing page** (`/`) with a hero section, a CSS-drawn NZ landscape, and a "How to play" guide.
- **Three-round game** (`/game`) with an interactive map of New Zealand:
  - A start screen shows your current high score.
  - Each round picks a random location from a pool of 28 popular NZ spots (no repeats within a game).
  - Zoom from the whole country down to street level (scroll, pinch, double-click or the `+`/`−` buttons) for a more precise guess.
  - Click the map to drop your guess pin (click again to move it), then submit to reveal the real location, your distance from it, and your round score. The map zooms out to show both pins.
  - A status bar shows the round number, your running total and your high score.
  - After round 3, a summary lists each round and your total out of 15,000.
  - **High score:** your best total is saved in the browser and replaced only when a finished game beats it.
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
│   └── guess-map.tsx     # Client component: game flow, map, scoring
├── data/
│   └── locations.ts      # The pool of NZ locations rounds are drawn from
├── lib/
│   └── high-score.ts     # High score persistence (localStorage)
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

### A game

All game state is local React state inside `GuessMap`:

- `rounds`: the three locations for this game, or `null` before the game starts.
- `roundIndex`: which round is being played (0–2).
- `guess`: the latitude/longitude the player clicked, or `null`.
- `results`: one `{ location, distance, score }` entry per submitted round. A round counts as submitted once it has an entry here.
- `finalScore` / `showSummary`: the game total and the previous high score, and whether the summary screen is showing.

1. **Start game** shuffles the location pool (Fisher–Yates) and takes the first three, so each game gets three different places.
2. Each round shows the place name. The map opens centred on New Zealand (zoom 4.7) and resets to that view every round. Players can zoom between level 4 (the whole country) and 16 (street level).
3. Clicking the map sets `guess` and shows a red pin. The **Submit guess** button is disabled until a pin is placed. Submitting shows the green answer pin, fits the map to show both pins, and shows a results bar with the answer, the distance and the round score.
4. **Next round** moves on. After round 3, **See final score** shows the summary, and **Play again** starts a fresh game with three new random locations.

### Locations

`data/locations.ts` exports the pool as an array of `{ name, region, latitude, longitude }`, from Cape Reinga in the far north to Stewart Island / Rakiura in the south. To add a location, append an entry. The game always draws 3 from whatever is in the list.

### High score

`lib/high-score.ts` stores the best total in `localStorage` under the key `kiwiquest:high-score`, so it is per browser and survives reloads. The component reads it with React's `useSyncExternalStore`. That returns 0 during server rendering, which avoids a hydration mismatch, and updates the display when the score changes, including from another tab.

The high score is checked the moment the third guess is submitted, so it is saved even if the player leaves before opening the summary. It is only replaced when the new total is strictly higher. If storage is unavailable (for example, blocked site data), the game still works but the high score won't persist.

### Distance and scoring

- **Distance** is the great-circle distance between the guess and the answer, calculated with the [haversine formula](https://en.wikipedia.org/wiki/Haversine_formula) (Earth radius 6,371 km) and rounded to the nearest kilometre.
- **Score** for each round decays exponentially with distance:

  ```
  score = round(5000 × e^(−distance_km / 450))
  ```

  A perfect guess scores **5,000**. A guess 450 km away scores about **1,839**, and the score approaches 0 for guesses on the far side of the country. A game's total is the sum of its three round scores (maximum **15,000**).

### Map

The map style is defined inline in `guess-map.tsx` as a minimal MapLibre style with a single OpenStreetMap raster tile layer, so no API key or map provider account is needed. The MapLibre CSS is imported directly in the component.

Zooming uses react-map-gl's built-in scroll, pinch and double-click handlers, plus a `NavigationControl` (`+`/`−` buttons, compass hidden) in the top-right corner. Zoom is limited to levels 4–16. Panning is limited by `maxBounds` to the area around New Zealand (153.8°E to 191.2°E, so it crosses the 180° line), which keeps Australia out of view. On wide screens this zooms the opening view in slightly.

`maplibre-gl` is pinned to v5, because react-map-gl 8 reads `map.transform`, which maplibre-gl 6 no longer exposes, so camera events like the zoom buttons throw. On submit, a `MapRef` calls `fitBounds` around the guess and the answer (capped at zoom 10), so the answer is visible even if the player was zoomed in elsewhere.

The map fills the width of the page with a 24px gap on each side (16px under 800px). Its height is `clamp(360px, 68vh, 820px)`, so it uses most of the screen while the submit button stays visible.

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

- **Scene imagery**: rounds currently name the place to find. The landing page's "explore the scene" copy describes the planned version with photos or street-level imagery instead of names.
- **Shared leaderboard**: the high score is per browser. A leaderboard across players would need a backend.
- **Data layer**: `@tanstack/react-query` and `zod` are installed but not used yet (presumably for fetching and validating location data later).
- **Tests**: there's no test setup yet (distance, scoring and round picking would be good first candidates).
- **Cleanup**: the SVGs in `public/` are create-next-app defaults and aren't used.

## For AI coding assistants

See [`AGENTS.md`](./AGENTS.md). This project uses Next.js 16, which has breaking changes from earlier versions, so check the bundled docs in `node_modules/next/dist/docs/` before changing framework code.
