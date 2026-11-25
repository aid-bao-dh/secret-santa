"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { ArrowRight, Sparkles, Volume2, VolumeX, X } from "lucide-react";

interface WelcomeLetterProps {
  companyName?: string;
  companyLogo?: string;
}

export function playChristmasChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Bright glockenspiel chord (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.09 + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.09);
      osc.stop(ctx.currentTime + idx * 0.09 + 0.85);
    });
  } catch (err) {
    console.warn("Web Audio not supported or blocked", err);
  }
}

function playJingleBellsMelody() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const melody: Array<{ freq: number; time: number; dur: number }> = [
      { freq: 659.25, time: 0.0, dur: 0.22 },
      { freq: 659.25, time: 0.22, dur: 0.22 },
      { freq: 659.25, time: 0.44, dur: 0.42 },
      { freq: 659.25, time: 0.88, dur: 0.22 },
      { freq: 659.25, time: 1.1, dur: 0.22 },
      { freq: 659.25, time: 1.32, dur: 0.42 },
      { freq: 659.25, time: 1.76, dur: 0.22 },
      { freq: 783.99, time: 1.98, dur: 0.22 },
      { freq: 523.25, time: 2.2, dur: 0.3 },
      { freq: 587.33, time: 2.52, dur: 0.16 },
      { freq: 659.25, time: 2.7, dur: 0.7 },
    ];

    melody.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      const start = ctx.currentTime + time;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.3);
    });
  } catch (err) {
    console.warn("Web Audio melody skipped", err);
  }
}

function fireGrandConfetti() {
  const colors = ["#dc2626", "#16a34a", "#facc15", "#ffffff", "#fb7185"];
  confetti({
    particleCount: 65,
    angle: 60,
    spread: 70,
    origin: { x: 0.1, y: 0.72 },
    colors,
  });
  confetti({
    particleCount: 65,
    angle: 120,
    spread: 70,
    origin: { x: 0.9, y: 0.72 },
    colors,
  });
  confetti({
    particleCount: 85,
    spread: 110,
    origin: { x: 0.5, y: 0.52 },
    colors,
  });
}

const STARS = [
  { top: "8%", left: "10%", delay: "0s", size: "text-sm", icon: "✦" },
  { top: "14%", left: "82%", delay: "0.6s", size: "text-base", icon: "✨" },
  { top: "24%", left: "18%", delay: "1.2s", size: "text-xs", icon: "❄" },
  { top: "22%", left: "90%", delay: "0.3s", size: "text-sm", icon: "✦" },
  { top: "72%", left: "8%", delay: "0.9s", size: "text-base", icon: "✨" },
  { top: "78%", left: "86%", delay: "1.5s", size: "text-sm", icon: "❄" },
  { top: "88%", left: "22%", delay: "0.4s", size: "text-xs", icon: "✦" },
  { top: "86%", left: "70%", delay: "1.1s", size: "text-base", icon: "✨" },
];

const WELCOME_FLAKES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: ((i * 37 + 11) % 96) + 2,
  size: (i % 3) * 4 + 10,
  duration: (i % 5) * 1.4 + 7,
  delay: (i % 6) * 0.7,
  opacity: 0.35 + (i % 4) * 0.15,
  char: i % 3 === 0 ? "❄" : i % 3 === 1 ? "❅" : "•",
}));

type WelcomeStage = "sealed" | "unsealing" | "letter" | "exiting";

export default function WelcomeLetter({
  companyName = "GLOBAL SAFE",
  companyLogo = "/assets/logo.png",
}: WelcomeLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<WelcomeStage>("sealed");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const seen = sessionStorage.getItem("gs_welcome_letter_seen");
    if (!seen) {
      setStage("sealed");
      setIsOpen(true);
    }
    setHasCheckedStorage(true);

    const handleReopen = () => {
      setTilt({ rx: 0, ry: 0 });
      setStage("sealed");
      setIsOpen(true);
    };
    window.addEventListener("reopen-welcome-letter", handleReopen);
    return () => window.removeEventListener("reopen-welcome-letter", handleReopen);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stage !== "sealed") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-y * 10).toFixed(2)),
      ry: Number((x * 12).toFixed(2)),
    });
  };

  const handleBreakSeal = () => {
    if (stage !== "sealed") return;
    setTilt({ rx: 0, ry: 0 });
    setStage("unsealing");

    if (soundEnabled) {
      playJingleBellsMelody();
    }
    fireGrandConfetti();

    setTimeout(() => {
      setStage("letter");
    }, 820);
  };

  const handleEnterEvent = () => {
    if (stage === "exiting") return;
    setStage("exiting");

    if (soundEnabled) {
      playChristmasChime();
    }
    fireGrandConfetti();

    setTimeout(() => {
      sessionStorage.setItem("gs_welcome_letter_seen", "true");
      setIsOpen(false);
      setStage("sealed");
    }, 600);
  };

  const handleSkip = () => {
    sessionStorage.setItem("gs_welcome_letter_seen", "true");
    setIsOpen(false);
    setStage("sealed");
  };

  if (!hasCheckedStorage || !isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto transition-all duration-600 ease-out ${
        stage === "exiting"
          ? "opacity-0 -translate-y-8 scale-105 blur-xs"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* Warm Cozy Festive Aurora Backdrop */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-950/92 via-red-950/90 to-emerald-950/94 backdrop-blur-xl -z-10" />

      {/* Drifting Warm Bokeh Orbs for Organic Softness */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-20 -left-16 w-80 h-80 rounded-full bg-red-500/20 blur-3xl animate-bokeh-drift"
        />
        <div
          className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl animate-bokeh-drift"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl animate-bokeh-drift"
          style={{ animationDelay: "4.5s" }}
        />
      </div>

      {/* Subtle Golden Halo Rays Behind Centerpiece */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
        <div
          className="w-[740px] h-[740px] rounded-full opacity-20 animate-spin-slow"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, rgba(251, 191, 36, 0.35) 0deg 12deg, transparent 12deg 30deg)",
            maskImage: "radial-gradient(circle, black 20%, transparent 68%)",
            WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 68%)",
          }}
        />
      </div>

      {/* Gentle Snowfall Inside Welcome Overlay */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        {WELCOME_FLAKES.map((f) => (
          <span
            key={f.id}
            className="snowflake text-white/80"
            style={{
              left: `${f.left}%`,
              fontSize: `${f.size}px`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              opacity: f.opacity,
            }}
          >
            {f.char}
          </span>
        ))}
      </div>

      {/* Twinkling Golden Stars */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className={`absolute text-amber-200/85 animate-star-twinkle select-none ${s.size}`}
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          >
            {s.icon}
          </span>
        ))}
      </div>

      {/* Top Controls (Audio Toggle + Skip) */}
      <div className="fixed top-4 right-4 left-4 flex items-center justify-between max-w-4xl mx-auto z-20 pointer-events-none">
        <button
          onClick={() => setSoundEnabled((prev) => !prev)}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-amber-100 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title={soundEnabled ? "Tắt âm thanh chào mừng" : "Bật âm thanh chào mừng"}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-stone-300" />
          )}
          <span>{soundEnabled ? "Nhạc chuông: Bật" : "Nhạc chuông: Tắt"}</span>
        </button>

        <button
          onClick={handleSkip}
          className="pointer-events-auto inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white/90 hover:text-white text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Bỏ qua màn chào mừng"
        >
          <span>Bỏ qua</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* STAGE 1: INTERACTIVE FLOATING 3D ENVELOPE */}
      {(stage === "sealed" || stage === "unsealing") && (
        <div className="relative w-full max-w-md my-10 animate-pop-in">
          {/* Header Banner above envelope */}
          <div className="text-center mb-6 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-300/20 border border-amber-200/45 text-amber-100 text-xs font-extrabold tracking-widest uppercase shadow-lg backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>North Pole Express • Global Safe 2026</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-holiday font-black text-white mt-3 drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)]">
              Bạn Có Một Thư Mời Giáng Sinh! ✉️
            </h2>
          </div>

          {/* Gentle Floating Wrapper + 3D Mouse Tilt */}
          <div className={stage === "sealed" ? "animate-envelope-float" : ""}>
            <div
              onClick={handleBreakSeal}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleBreakSeal()}
              className="group relative mx-auto w-full rounded-[28px] cursor-pointer select-none transition-transform duration-300 ease-out"
              style={{
                perspective: "1200px",
                transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${
                  stage === "unsealing" ? "scale(1.04) translateY(-6px)" : ""
                }`,
              }}
            >
              {/* Soft Festive Outer Aura */}
              <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-amber-300 via-rose-400 to-emerald-400 opacity-50 blur-xl group-hover:opacity-80 transition duration-500" />

              {/* Envelope Pocket Container */}
              <div className="relative h-76 sm:h-84 rounded-[28px] bg-gradient-to-br from-red-600 via-rose-700 to-red-900 border-2 border-amber-200/75 shadow-2xl flex flex-col justify-between p-5 sm:p-6 overflow-visible">
                {/* Subtle Moving Sheen across Envelope */}
                <div className="absolute inset-0 rounded-[26px] overflow-hidden pointer-events-none">
                  <div className="btn-shimmer w-full h-full opacity-50" />
                </div>

                {/* Parchment Letter Rising Out During Unseal */}
                <div
                  className={`absolute inset-x-5 top-4 bottom-6 rounded-2xl bg-[#fffcf5] border-2 border-amber-400 shadow-2xl flex flex-col items-center justify-center gap-2 transition-all duration-700 ease-[cubic-bezier(0.34,1.35,0.64,1)] z-20 ${
                    stage === "unsealing"
                      ? "-translate-y-24 scale-105 opacity-100"
                      : "translate-y-6 scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  <span className="text-3xl animate-bounce">🎅</span>
                  <span className="font-holiday font-black text-red-700 text-base sm:text-lg px-4 text-center">
                    Chào mừng đến với Secret Santa! ✨
                  </span>
                </div>

                {/* Hinged 3D Top Flap */}
                <div
                  className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-red-500 via-red-600 to-rose-700 rounded-t-[26px] border-b-2 border-amber-200/70 shadow-lg pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.34,1.3,0.64,1)]"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 94%)",
                    transformOrigin: "top center",
                    transform:
                      stage === "unsealing"
                        ? "rotateX(175deg)"
                        : "rotateX(0deg)",
                    zIndex: stage === "unsealing" ? 10 : 25,
                  }}
                />

                {/* Top Row: Logo Pill + North Pole Postage Stamp */}
                <div className="relative z-30 flex items-start justify-between">
                  <div className="bg-white/95 px-3 py-1.5 rounded-2xl shadow-md border border-amber-200 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-105">
                    <span className="text-sm">🎅</span>
                    {companyLogo ? (
                      <img src={companyLogo} alt={companyName} className="h-5 sm:h-6 w-auto object-contain" />
                    ) : (
                      <span className="text-xs font-black text-red-700">{companyName}</span>
                    )}
                  </div>

                  {/* Postage Stamp */}
                  <div className="px-2.5 py-1.5 rounded-2xl bg-amber-50/95 border-2 border-dashed border-red-500/70 text-center rotate-3 shadow-md transition-transform duration-300 group-hover:rotate-6">
                    <div className="text-[9px] font-black text-red-700 uppercase tracking-wider">North Pole</div>
                    <div className="text-xs font-black text-emerald-700">2026 ❄️</div>
                  </div>
                </div>

                {/* Center Interactive 3D Wax Seal */}
                <div className="relative z-30 flex flex-col items-center justify-center my-auto">
                  <div
                    className={`relative flex items-center justify-center transition-all duration-500 ${
                      stage === "unsealing" ? "scale-125 opacity-0" : "scale-100 opacity-100"
                    }`}
                  >
                    <span
                      className="absolute w-28 h-28 rounded-full border-2 border-amber-200/50 animate-ping"
                      style={{ animationDuration: "2.4s" }}
                    />
                    <span className="absolute w-24 h-24 rounded-full border border-dashed border-amber-200/80 animate-spin-slow" />

                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 p-1 shadow-[0_12px_30px_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-800 border-2 border-amber-100/85 flex flex-col items-center justify-center text-white shadow-inner">
                        <span className="text-2xl leading-none">🎁</span>
                        <span className="text-[10px] font-black tracking-widest uppercase text-amber-100 mt-1">
                          MỞ THƯ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Envelope Bottom Addressee */}
                <div className="relative z-30 text-center">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-black/20 border border-amber-200/35 backdrop-blur-sm">
                    <span className="text-xs text-amber-100 font-semibold">
                      Gửi riêng: <strong className="text-white">Thành viên {companyName}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs sm:text-sm text-amber-100/90 mt-6 font-semibold animate-pulse">
            👆 Chạm nhẹ vào phong thư để mở quà chào mừng nhé
          </p>
        </div>
      )}

      {/* STAGE 2: SOFT, PLAYFUL UNFOLDED INVITATION LETTER */}
      {(stage === "letter" || stage === "exiting") && (
        <div
          className="relative w-full max-w-xl my-6 bg-[#fffcf7] border-3 border-amber-300/80 rounded-[32px] p-6 sm:p-9 shadow-[0_30px_80px_rgba(0,0,0,0.45)] animate-letter-unfold"
          style={{
            boxShadow: "0 30px 80px rgba(0,0,0,0.45), inset 0 0 45px rgba(245, 158, 11, 0.08)",
          }}
        >
          {/* Floating Corner Holiday Accents */}
          <div className="absolute top-3.5 left-4 text-2xl select-none animate-float-slow">🎄</div>
          <div className="absolute top-3.5 right-12 text-2xl select-none animate-float-reverse">🔔</div>
          <div className="absolute bottom-3.5 left-4 text-2xl select-none animate-float-reverse">🎁</div>
          <div className="absolute bottom-3.5 right-4 text-2xl select-none animate-float-slow">❄️</div>

          {/* Close */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 hover:rotate-90 p-1 rounded-full transition-all duration-300 cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Pill */}
          <div className="text-center mb-4 animate-fade-up" style={{ animationDelay: "60ms" }}>
            <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-full text-[11px] font-black uppercase tracking-wider shadow-md">
              <span>✨</span>
              <span>Chào Mừng Đến Với Secret Santa 2026</span>
              <span>✨</span>
            </span>
          </div>

          {/* Logo + Cheerful Title */}
          <div
            className="flex flex-col items-center text-center mb-4 animate-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            <div className="relative mb-2 group">
              <span className="absolute -top-3.5 -left-2 text-xl select-none animate-sway">🎅</span>
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <h2 className="text-xl font-black text-red-700 tracking-wider uppercase">{companyName}</h2>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-holiday font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-emerald-600 animate-gradient-flow drop-shadow-xs">
              MÙA TRAO QUÀ BÍ MẬT 🎁
            </h1>
          </div>

          {/* Soft Divider */}
          <div
            className="flex items-center justify-center gap-2 mb-4 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
            <span className="text-amber-500 text-xs animate-pulse">✦ ❄ ✦</span>
            <div className="h-[1.5px] w-20 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
          </div>

          {/* Friendly Letter Content */}
          <div
            className="text-stone-700 text-sm sm:text-base leading-relaxed space-y-2.5 text-center sm:text-justify px-1 font-medium animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
            <p>
              <strong className="text-red-700 font-bold">Chào bạn, thành viên đáng mến của {companyName}! 🌟</strong>
            </p>
            <p>
              Một năm 2026 rực rỡ sắp khép lại. Hãy tạm gác lại deadline bận rộn để cùng bước vào hành trình trao gửi niềm vui bất ngờ nhé!
            </p>
            <p>
              Bạn sẽ hóa thân thành một <span className="text-emerald-700 font-bold">Secret Santa</span> bí mật — chuẩn bị một món quà xinh cho đồng nghiệp khác bộ phận và trổ tài thám tử đoán xem ai đang âm thầm tặng quà cho mình!
            </p>
          </div>

          {/* Interactive Event Highlights Strip */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 my-5">
            <div
              className="bg-red-50/90 border border-red-200 rounded-2xl p-3 text-center shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[-1.5deg] hover:shadow-md animate-fade-up"
              style={{ animationDelay: "320ms" }}
            >
              <div className="text-xl">🗓️</div>
              <div className="text-xs font-black text-red-800 mt-0.5">27/11</div>
              <div className="text-[10px] sm:text-[11px] text-stone-600 font-semibold">Mở Cổng Bóc</div>
            </div>

            <div
              className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 text-center shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md animate-fade-up"
              style={{ animationDelay: "400ms" }}
            >
              <div className="text-xl">🕵️</div>
              <div className="text-xs font-black text-emerald-800 mt-0.5">3 Manh Mối</div>
              <div className="text-[10px] sm:text-[11px] text-stone-600 font-semibold">Truy Tìm Santa</div>
            </div>

            <div
              className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 text-center shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[1.5deg] hover:shadow-md animate-fade-up"
              style={{ animationDelay: "480ms" }}
            >
              <div className="text-xl">🎡</div>
              <div className="text-xs font-black text-amber-800 mt-0.5">Đêm Tiệc</div>
              <div className="text-[10px] sm:text-[11px] text-stone-600 font-semibold">Vòng Quay Phạt</div>
            </div>
          </div>

          {/* Enter Event CTA */}
          <div
            className="flex flex-col items-center animate-fade-up"
            style={{ animationDelay: "540ms" }}
          >
            <button
              onClick={handleEnterEvent}
              className="btn-shimmer group w-full sm:w-auto flex items-center justify-center gap-3 px-9 py-4 bg-gradient-to-r from-red-600 via-rose-500 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-95 border-2 border-amber-200 cursor-pointer"
            >
              <span>KHÁM PHÁ NGAY THÔI</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <span className="text-[11px] text-stone-500 mt-2.5 font-medium">
              (Xem lại bất cứ lúc nào ở nút 💌 Thư Mời góc trên phải)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
