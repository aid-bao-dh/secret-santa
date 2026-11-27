"use client";

import { useSyncExternalStore } from "react";

interface Flake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  char: string;
  color: string;
}

const CHARS = ["❄", "❅", "❆", "•"];
const COLORS = ["#93c5fd", "#cbd5e1", "#86efac", "#fca5a5", "#bfdbfe"];

// Deterministic precomputed snowflakes to avoid effect setState & hydration mismatches
const FLAKES: Flake[] = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left: ((i * 29 + 13) % 96) + 2,
  size: ((i * 7) % 14) + 10,
  duration: ((i * 3) % 6) + 6,
  delay: ((i * 5) % 5),
  opacity: 0.35 + ((i % 5) * 0.11),
  char: CHARS[i % CHARS.length],
  color: COLORS[i % COLORS.length],
}));

const emptySubscribe = () => () => {};

export default function SnowEffect() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {FLAKES.map((f) => (
        <span
          key={f.id}
          className={`snowflake ${f.id >= 18 ? "hidden sm:inline-block" : ""}`}
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            opacity: f.opacity,
            color: f.color,
          }}
        >
          {f.char}
        </span>
      ))}
    </div>
  );
}
