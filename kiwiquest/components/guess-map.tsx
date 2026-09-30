"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useSyncExternalStore } from "react";
import Map, { Marker, type MapLayerMouseEvent } from "react-map-gl/maplibre";
import { locations, type Location } from "../data/locations";
import { getHighScore, getServerHighScore, saveHighScore, subscribeToHighScore } from "../lib/high-score";

const roundCount = 3;
const maxRoundScore = 5000;
type Guess = { latitude: number; longitude: number };
type RoundResult = { location: Location; distance: number; score: number };
type FinalScore = { total: number; previousHighScore: number };

const mapStyle = {
  version: 8 as const,
  sources: {
    openstreetmap: {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "(c) OpenStreetMap contributors",
    },
  },
  layers: [{ id: "openstreetmap", type: "raster" as const, source: "openstreetmap" }],
};

function distanceInKm(a: Guess, b: Guess) {
  const radius = 6371;
  const radians = (value: number) => (value * Math.PI) / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLng = radians(b.longitude - a.longitude);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function scoreForDistance(distance: number) {
  return Math.max(0, Math.round(maxRoundScore * Math.exp(-distance / 450)));
}

// Fisher-Yates shuffle, then take the first few, so no location repeats within a game.
function pickRounds() {
  const pool = [...locations];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, roundCount);
}

export function GuessMap() {
  const highScore = useSyncExternalStore(subscribeToHighScore, getHighScore, getServerHighScore);
  const [rounds, setRounds] = useState<Location[] | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [finalScore, setFinalScore] = useState<FinalScore | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const submitted = results.length > roundIndex;
  const isLastRound = roundIndex === roundCount - 1;
  const runningTotal = results.reduce((sum, result) => sum + result.score, 0);

  function startGame() {
    setRounds(pickRounds());
    setRoundIndex(0);
    setGuess(null);
    setResults([]);
    setFinalScore(null);
    setShowSummary(false);
  }

  function placeGuess(event: MapLayerMouseEvent) {
    if (!submitted) setGuess({ latitude: event.lngLat.lat, longitude: event.lngLat.lng });
  }

  function submitGuess() {
    if (!rounds || !guess || submitted) return;
    const location = rounds[roundIndex];
    const distance = Math.round(distanceInKm(guess, location));
    const nextResults = [...results, { location, distance, score: scoreForDistance(distance) }];
    setResults(nextResults);

    // Record the high score as soon as the final round is submitted, so it is kept
    // even if the player leaves before opening the summary.
    if (nextResults.length === roundCount) {
      const total = nextResults.reduce((sum, result) => sum + result.score, 0);
      setFinalScore({ total, previousHighScore: highScore });
      if (total > highScore) saveHighScore(total);
    }
  }

  function nextRound() {
    if (isLastRound) {
      setShowSummary(true);
    } else {
      setRoundIndex(roundIndex + 1);
      setGuess(null);
    }
  }

  if (!rounds) {
    return (
      <div className="round-layout">
        <section className="guess-panel game-card">
          <div className="guess-heading"><p className="eyebrow">{roundCount} rounds · {(roundCount * maxRoundScore).toLocaleString()} points up for grabs</p><h1>How well do you know Aotearoa?</h1><p>Each round names a famous New Zealand spot. Pin it on the map as accurately as you can: the closer you get, the more points you score.</p></div>
          <HighScore value={highScore} />
          <button className="button button-primary submit-button" onClick={startGame}>Start game</button>
        </section>
      </div>
    );
  }

  if (showSummary && finalScore) {
    const isNewHighScore = finalScore.total > finalScore.previousHighScore;
    return (
      <div className="round-layout">
        <section className="guess-panel game-card">
          <div className="guess-heading"><p className="eyebrow">Game over</p><h1>{finalScore.total.toLocaleString()} points</h1><p>{isNewHighScore ? "New high score! Nice work." : `Your best is still ${finalScore.previousHighScore.toLocaleString()}. Have another go!`}</p></div>
          <ol className="round-breakdown">
            {results.map((result, index) => (
              <li key={result.location.name}><span>Round {index + 1}</span><strong>{result.location.name}</strong><span>{result.distance.toLocaleString()} km</span><strong>{result.score.toLocaleString()}</strong></li>
            ))}
          </ol>
          <HighScore value={highScore} highlight={isNewHighScore} />
          <button className="button button-primary submit-button" onClick={startGame}>Play again</button>
        </section>
      </div>
    );
  }

  const location = rounds[roundIndex];
  const roundResult = submitted ? results[roundIndex] : null;

  return (
    <div className="round-layout">
      <section className="guess-panel">
        <div className="round-status"><span>Round {roundIndex + 1} of {roundCount}</span><span>Total {runningTotal.toLocaleString()}</span><span>Best {highScore.toLocaleString()}</span></div>
        <div className="guess-heading"><p className="eyebrow">Find this place</p><h1>{location.name}</h1><p>Click the map where you think it is, then submit your guess.</p></div>
        <div className="map-shell">
          {/* Keyed by round so the map resets to the full-country view each round. */}
          <Map key={roundIndex} initialViewState={{ latitude: -41.2, longitude: 172.6, zoom: 4.7 }} minZoom={4} maxZoom={8} renderWorldCopies={false} mapStyle={mapStyle} onClick={placeGuess} cursor={submitted ? "default" : "crosshair"}>
            {guess && <Marker longitude={guess.longitude} latitude={guess.latitude} anchor="bottom"><span className="guess-pin" /></Marker>}
            {submitted && <Marker longitude={location.longitude} latitude={location.latitude} anchor="bottom"><span className="answer-pin" /></Marker>}
          </Map>
        </div>
        {roundResult ? (
          <div className="result"><div><p>Answer</p><strong>{roundResult.location.name}, {roundResult.location.region}</strong></div><div><p>Distance</p><strong>{roundResult.distance.toLocaleString()} km</strong></div><div><p>Score</p><strong>{roundResult.score.toLocaleString()}</strong></div><button className="button button-secondary" onClick={nextRound}>{isLastRound ? "See final score" : "Next round"}</button></div>
        ) : (
          <button className="button button-primary submit-button" disabled={!guess} onClick={submitGuess}>{guess ? "Submit guess" : "Place a pin to submit"}</button>
        )}
      </section>
    </div>
  );
}

function HighScore({ value, highlight = false }: { value: number; highlight?: boolean }) {
  return (
    <div className={highlight ? "high-score high-score-new" : "high-score"}>
      <p>High score</p>
      <strong>{value > 0 ? value.toLocaleString() : "None yet"}</strong>
    </div>
  );
}
