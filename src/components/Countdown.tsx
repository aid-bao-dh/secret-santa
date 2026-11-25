"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface CountdownProps {
  revealDate?: string;
  eventDate?: string;
}

function formatDayMonth(dateStr?: string, fallback = "27/11"): string {
  if (!dateStr) return fallback;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[3]}/${match[2]}`;
  }
  return fallback;
}

export default function Countdown({
  revealDate = "2026-11-27T00:00:00",
  eventDate = "2026-12-24T18:00:00",
}: CountdownProps) {
  const [state, setState] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    phase: "before_reveal" | "before_event" | "done";
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    phase: "before_reveal",
  });

  useEffect(() => {
    function calculate() {
      const now = Date.now();
      const revealMs = new Date(revealDate).getTime();
      const eventMs = eventDate ? new Date(eventDate).getTime() : NaN;

      let targetMs = revealMs;
      let phase: "before_reveal" | "before_event" | "done" = "before_reveal";

      if (Number.isNaN(revealMs) || now >= revealMs) {
        if (!Number.isNaN(eventMs) && now < eventMs) {
          targetMs = eventMs;
          phase = "before_event";
        } else {
          setState({ days: 0, hours: 0, minutes: 0, seconds: 0, phase: "done" });
          return;
        }
      }

      const diff = Math.max(0, targetMs - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setState({ days, hours, minutes, seconds, phase });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [revealDate, eventDate]);

  const activeLabel =
    state.phase === "before_reveal"
      ? `Đếm ngược đến giờ bóc Santa (${formatDayMonth(revealDate, "27/11")})`
      : state.phase === "before_event"
      ? `Cổng Santa đã mở! Đếm ngược đến Đêm Tiệc (${formatDayMonth(eventDate, "24/12")})`
      : `Chào mừng Đêm Tiệc Giáng Sinh (${formatDayMonth(eventDate, "24/12")})`;

  return (
    <div className="bg-white/95 border-2 border-red-500/40 rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-[0_10px_25px_rgba(220,38,38,0.12)] text-center max-w-xl mx-auto my-5 relative">
      <div className="flex items-center justify-center gap-2 text-red-700 font-bold mb-3 text-sm sm:text-base tracking-wide">
        <Sparkles className="w-5 h-5 text-amber-500 animate-spin shrink-0" style={{ animationDuration: "6s" }} />
        <span>{activeLabel}</span>
        <Sparkles className="w-5 h-5 text-amber-500 animate-spin shrink-0" style={{ animationDuration: "6s" }} />
      </div>

      {state.phase === "done" ? (
        <div className="bg-emerald-50 border border-emerald-500/50 py-3 px-4 rounded-2xl text-emerald-800 font-bold flex items-center justify-center gap-2 shadow-sm">
          <span>🎉 Cổng Secret Santa &amp; Đêm Tiệc Noel đã chính thức diễn ra! Chúc mọi người vui hết mình!</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {/* Days - Red */}
          <div className="bg-gradient-to-b from-red-600 to-red-700 rounded-2xl p-2.5 sm:p-3 shadow-md shadow-red-600/20 text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span className="block text-2xl sm:text-4xl font-holiday font-bold drop-shadow">
              {String(state.days).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-red-100 uppercase font-bold tracking-wider">Ngày</span>
          </div>

          {/* Hours - Red */}
          <div className="bg-gradient-to-b from-red-600 to-red-700 rounded-2xl p-2.5 sm:p-3 shadow-md shadow-red-600/20 text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span className="block text-2xl sm:text-4xl font-holiday font-bold drop-shadow">
              {String(state.hours).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-red-100 uppercase font-bold tracking-wider">Giờ</span>
          </div>

          {/* Minutes - Green */}
          <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 rounded-2xl p-2.5 sm:p-3 shadow-md shadow-emerald-600/20 text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span className="block text-2xl sm:text-4xl font-holiday font-bold drop-shadow">
              {String(state.minutes).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-emerald-100 uppercase font-bold tracking-wider">Phút</span>
          </div>

          {/* Seconds - Green with live tick animation */}
          <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 rounded-2xl p-2.5 sm:p-3 shadow-md shadow-emerald-600/20 text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span
              key={state.seconds}
              className="block text-2xl sm:text-4xl font-holiday font-bold drop-shadow animate-tick"
            >
              {String(state.seconds).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-emerald-100 uppercase font-bold tracking-wider">Giây</span>
          </div>
        </div>
      )}
    </div>
  );
}
