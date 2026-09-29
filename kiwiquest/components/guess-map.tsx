"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo, useState } from "react";
import Map, { Marker, type MapLayerMouseEvent } from "react-map-gl/maplibre";

const answer = { latitude: -44.696, longitude: 169.136, name: "Lindis Pass, Otago" };
type Guess = { latitude: number; longitude: number };

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

export function GuessMap() {
  const [guess, setGuess] = useState<Guess | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const distance = useMemo(() => guess ? Math.round(distanceInKm(guess, answer)) : null, [guess]);
  const score = distance === null ? null : Math.max(0, Math.round(5000 * Math.exp(-distance / 450)));

  function placeGuess(event: MapLayerMouseEvent) {
    if (!submitted) setGuess({ latitude: event.lngLat.lat, longitude: event.lngLat.lng });
  }

  return (
    <div className="round-layout">
      <section className="guess-panel">
        <div className="guess-heading"><p className="eyebrow">Practice round 01</p><h1>Where in New Zealand are you?</h1><p>Click the map to drop your pin. The closer you get, the more points you score.</p></div>
        <div className="map-shell">
          <Map initialViewState={{ latitude: -41.2, longitude: 172.6, zoom: 4.7 }} minZoom={4} maxZoom={8} renderWorldCopies={false} mapStyle={mapStyle} onClick={placeGuess} cursor={submitted ? "default" : "crosshair"}>
            {guess && <Marker longitude={guess.longitude} latitude={guess.latitude} anchor="bottom"><span className="guess-pin" /></Marker>}
            {submitted && <Marker longitude={answer.longitude} latitude={answer.latitude} anchor="bottom"><span className="answer-pin" /></Marker>}
          </Map>
        </div>
        {submitted && distance !== null && score !== null ? (
          <div className="result"><div><p>Answer</p><strong>{answer.name}</strong></div><div><p>Distance</p><strong>{distance.toLocaleString()} km</strong></div><div><p>Score</p><strong>{score.toLocaleString()}</strong></div><button className="button button-secondary" onClick={() => { setGuess(null); setSubmitted(false); }}>Try again</button></div>
        ) : (
          <button className="button button-primary submit-button" disabled={!guess} onClick={() => setSubmitted(true)}>{guess ? "Submit guess" : "Place a pin to submit"}</button>
        )}
      </section>
    </div>
  );
}
