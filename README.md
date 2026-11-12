# KiwiQuest
A remake of the original KiwiGusser Project. Designed using modern tools.

## About
KiwiQuest is a New Zealand geography guessing game. You're given the name of a famous Kiwi landmark and have to pin it on the map as accurately as you can.

Built with Next.js 16 (Turbopack), React, [react-map-gl](https://visgl.github.io/react-map-gl/) with MapLibre GL, and OpenStreetMap tiles.

## How to play
1. Click **Start game**.
2. Each round names a New Zealand location. Click the map to drop a pin where you think it is (click again to move it). Zoom and pan to be more precise.
3. Click **Submit guess**. The map zooms out to show your guess and the real location joined by a dotted line, along with your distance and score.
4. Click **Next round** (or **See final score** after the last round).

The game has 3 rounds. Each round is worth up to 5,000 points, based on how close you get: `5000 × exp(-distance / 450 km)`. The maximum total is 15,000. Your high score is saved in your browser's local storage, so it is per browser.

## Features
- Three rounds per game, with random locations that never repeat within a game
- Dotted line between your guess and the actual location after each guess
- Map panning limited to the area around New Zealand
- Running total, per-round breakdown and a persistent high score

## Running locally
Requires [Node.js](https://nodejs.org/) and npm. The app lives in the `kiwiquest/` folder.

```bash
cd kiwiquest
npm install
npm run dev
```

Then open http://localhost:3000. Edits hot-reload in the browser.

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # run ESLint
```

## Project structure
- `kiwiquest/app/` – Next.js pages (`page.tsx` home, `game/page.tsx` game)
- `kiwiquest/components/guess-map.tsx` – game logic, map, markers and scoring
- `kiwiquest/data/locations.ts` – the list of landmarks
- `kiwiquest/lib/high-score.ts` – high score storage (localStorage)

## Adding locations
Append an entry to `kiwiquest/data/locations.ts`:

```ts
{ name: "Sky Tower", region: "Auckland", latitude: -36.8485, longitude: 174.7622 },
```
