"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Mail, Heart, ArrowRight, X } from "lucide-react";

interface WelcomeLetterProps {
  companyName?: string;
  companyLogo?: string;
}

export function playChristmasChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Glockenspiel / Jingle bell notes (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.9);
    });
  } catch (err) {
    console.warn("Web Audio not supported or blocked", err);
  }
}

export default function WelcomeLetter({
  companyName = "GLOBAL SAFE",
  companyLogo = "/assets/logo.png",
}: WelcomeLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnsealing, setIsUnsealing] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    // Check if user already opened the letter in this session
    const seen = sessionStorage.getItem("gs_welcome_letter_seen");
    if (!seen) {
      setIsOpen(true);
    }
    setHasCheckedStorage(true);

    // Listen for custom event to reopen letter
    const handleReopen = () => {
      setIsOpen(true);
    };
    window.addEventListener("reopen-welcome-letter", handleReopen);
    return () => window.removeEventListener("reopen-welcome-letter", handleReopen);
  }, []);

  const handleOpenLetter = () => {
    setIsUnsealing(true);
    playChristmasChime();

    // Festive Confetti burst
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#dc2626", "#16a34a", "#f59e0b", "#ffffff"],
    });

    setTimeout(() => {
      sessionStorage.setItem("gs_welcome_letter_seen", "true");
      setIsOpen(false);
      setIsUnsealing(false);
    }, 600);
  };

  if (!hasCheckedStorage || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md transition-all duration-500">
      {/* Royal Christmas Envelope & Letter Card */}
      <div
        className={`relative w-full max-w-lg bg-[#fffdfa] border-4 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.35)] transition-all duration-500 animate-pop-in ${
          isUnsealing ? "scale-105 opacity-0 -translate-y-4" : "scale-100 opacity-100"
        }`}
        style={{
          boxShadow: "0 25px 60px rgba(0,0,0,0.35), inset 0 0 40px rgba(245, 158, 11, 0.05)",
        }}
      >
        {/* Festive Corner Holly Accents */}
        <div className="absolute top-3 left-3 text-2xl select-none animate-float-slow">🎄</div>
        <div className="absolute top-3 right-3 text-2xl select-none animate-float-reverse">🔔</div>
        <div className="absolute bottom-3 left-3 text-2xl select-none animate-float-reverse">🎁</div>
        <div className="absolute bottom-3 right-3 text-2xl select-none animate-float-slow">❄️</div>

        {/* Close Button (if already seen or wants to skip) */}
        <button
          onClick={() => {
            sessionStorage.setItem("gs_welcome_letter_seen", "true");
            setIsOpen(false);
          }}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full transition"
          title="Đóng thư"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Tag */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs">
            <span>✨</span>
            <span>Chuyến Tàu Bắc Cực • Thư Mời Đặc Biệt</span>
            <span>✨</span>
          </span>
        </div>

        {/* Company Logo Header */}
        <div className="flex flex-col items-center justify-center text-center mb-5">
          <div className="relative mb-2">
            <span className="absolute -top-3.5 -left-2 text-xl select-none">🎅</span>
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            ) : (
              <h2 className="text-xl font-black text-red-700 tracking-wider uppercase">
                {companyName}
              </h2>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-holiday font-black text-red-800 drop-shadow-xs">
            MÙA LỄ HỘI SECRET SANTA 2026
          </h1>
        </div>

        {/* Gold Ribbon Divider */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-[1.5px] w-16 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
          <span className="text-amber-500 text-xs">✦ ❄ ✦</span>
          <div className="h-[1.5px] w-16 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
        </div>

        {/* Letter Body */}
        <div className="text-stone-700 text-sm sm:text-base leading-relaxed space-y-3 text-center sm:text-justify px-2 font-medium">
          <p>
            <strong className="text-red-700 font-bold">Thân gửi các thành viên {companyName},</strong>
          </p>
          <p>
            Một năm 2026 đầy nỗ lực và gắn kết sắp khép lại. Mùa Giáng sinh này, hãy cùng tạm gác lại những con số, dự án và deadline bận rộn để mở ra những khoảnh khắc vui tươi, ấm áp nhất!
          </p>
          <p>
            Mỗi chúng ta sẽ trở thành một <span className="text-emerald-700 font-bold">Secret Santa</span> bí mật, chuẩn bị một món quà nhỏ trao gửi tình cảm tới một người đồng nghiệp ngẫu nhiên. Danh tính của bạn sẽ được giữ kín tuyệt đối cho tới ngày hội tụ!
          </p>
          <p className="text-center font-bold text-red-800 pt-1">
            Bạn đã sẵn sàng khám phá nhiệm vụ bí mật của mình chưa? 🎁
          </p>
        </div>

        {/* Interactive Wax Seal Button */}
        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={handleOpenLetter}
            disabled={isUnsealing}
            className="btn-shimmer group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-red-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95 border-2 border-amber-300 hover:border-amber-200 cursor-pointer"
          >
            {/* Wax seal emblem icon */}
            <span className="w-7 h-7 rounded-full bg-amber-400 text-red-900 flex items-center justify-center text-sm font-black shadow-inner border border-amber-200 animate-pulse">
              💌
            </span>
            <span>BÓC TEM THƯ & KHÁM PHÁ</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <span className="text-[11px] text-stone-500 mt-2 font-medium">
            (Bấm để mở phong thư và bắt đầu tham gia)
          </span>
        </div>
      </div>
    </div>
  );
}
