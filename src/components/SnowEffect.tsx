"use client";

import { useEffect, useState } from "react";

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

export default function SnowEffect() {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    const chars = ["❄", "❅", "❆", "•"];
    const colors = ["#93c5fd", "#cbd5e1", "#86efac", "#fca5a5", "#bfdbfe"];
    const count = 35;
    const generated: Flake[] = [];

    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 14 + 10,
        duration: Math.random() * 6 + 6,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.6 + 0.3,
        char: chars[Math.floor(Math.random() * chars.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setFlakes(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
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
