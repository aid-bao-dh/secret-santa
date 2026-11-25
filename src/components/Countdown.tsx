"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface CountdownProps {
  targetDate?: string;
  label?: string;
}

export default function Countdown({
  targetDate = "2026-11-27T00:00:00",
  label = "Đếm ngược đến giờ bóc Santa (27/11)",
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    function calculate() {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bg-white/95 border-2 border-red-500/40 rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-[0_10px_25px_rgba(220,38,38,0.12)] text-center max-w-xl mx-auto my-5 relative">
      <div className="flex items-center justify-center gap-2 text-red-700 font-bold mb-3 text-sm sm:text-base tracking-wide">
        <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
        <span>{label}</span>
        <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
      </div>

      {timeLeft.isPast ? (
        <div className="bg-emerald-50 border border-emerald-500/50 py-3 px-4 rounded-2xl text-emerald-800 font-bold flex items-center justify-center gap-2 shadow-sm">
          <span>🎉 Cổng Secret Santa đã mở! Hãy nhập email để mở quà bí mật!</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {/* Days - Red */}
          <div className="bg-gradient-to-b from-red-600 to-red-700 rounded-2xl p-2.5 sm:p-3 shadow-md shadow-red-600/20 text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span className="block text-2xl sm:text-4xl font-holiday font-bold drop-shadow">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-red-100 uppercase font-bold tracking-wider">Ngày</span>
          </div>

          {/* Hours - Red */}
          <div className="bg-gradient-to-b from-red-600 to-red-700 rounded-2xl p-2.5 sm:p-3 shadow-md shadow-red-600/20 text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span className="block text-2xl sm:text-4xl font-holiday font-bold drop-shadow">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-red-100 uppercase font-bold tracking-wider">Giờ</span>
          </div>

          {/* Minutes - Green */}
          <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 rounded-2xl p-2.5 sm:p-3 shadow-md shadow-emerald-600/20 text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span className="block text-2xl sm:text-4xl font-holiday font-bold drop-shadow">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-emerald-100 uppercase font-bold tracking-wider">Phút</span>
          </div>

          {/* Seconds - Green with live tick animation */}
          <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 rounded-2xl p-2.5 sm:p-3 shadow-md shadow-emerald-600/20 text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span
              key={timeLeft.seconds}
              className="block text-2xl sm:text-4xl font-holiday font-bold drop-shadow animate-tick"
            >
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-emerald-100 uppercase font-bold tracking-wider">Giây</span>
          </div>
        </div>
      )}
    </div>
  );
}
