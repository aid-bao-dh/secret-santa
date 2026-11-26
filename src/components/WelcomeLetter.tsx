"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { ArrowRight, Sparkles, Volume2, VolumeX, X } from "lucide-react";

interface WelcomeLetterProps {
  companyName?: string;
  companyLogo?: string;
  revealDate?: string;
  eventDate?: string;
  isOpen?: boolean;
  recipientName?: string;
  recipientDepartment?: string;
  onProceedToEvent?: () => void;
  onClose?: () => void;
}

function formatDayMonth(dateStr?: string, fallback = "27/11"): string {
  if (!dateStr) return fallback;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}` : fallback;
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

export function playJingleBellsMelody() {
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

export function fireGrandConfetti() {
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
  { top: "10%", left: "10%", delay: "0s", size: "text-sm", icon: "✦" },
  { top: "15%", left: "84%", delay: "0.6s", size: "text-base", icon: "✨" },
  { top: "26%", left: "18%", delay: "1.2s", size: "text-xs", icon: "❄" },
  { top: "24%", left: "90%", delay: "0.3s", size: "text-sm", icon: "✦" },
  { top: "74%", left: "8%", delay: "0.9s", size: "text-base", icon: "✨" },
  { top: "78%", left: "86%", delay: "1.5s", size: "text-sm", icon: "❄" },
  { top: "88%", left: "22%", delay: "0.4s", size: "text-xs", icon: "✦" },
  { top: "86%", left: "72%", delay: "1.1s", size: "text-base", icon: "✨" },
];

const WELCOME_FLAKES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: ((i * 37 + 11) % 94) + 3,
  size: (i % 3) * 4 + 10,
  duration: (i % 5) * 1.4 + 7,
  delay: (i % 6) * 0.7,
  char: i % 3 === 0 ? "❄" : i % 3 === 1 ? "❅" : "•",
}));

type WelcomeStage = "sealed" | "unsealing" | "letter" | "exiting";

export default function WelcomeLetter({
  companyName = "GLOBAL SAFE",
  companyLogo = "/assets/logo.png",
  revealDate = "2026-11-27T00:00:00",
  eventDate = "2026-12-24T18:00:00",
  isOpen,
  recipientName,
  recipientDepartment,
  onProceedToEvent,
  onClose,
}: WelcomeLetterProps) {
  const revealDayLabel = formatDayMonth(revealDate, "27/11");
  const eventDayLabel = formatDayMonth(eventDate, "24/12");
  const [internalOpen, setInternalOpen] = useState(false);
  const activeOpen = isOpen !== undefined ? isOpen : internalOpen;
  const [stage, setStage] = useState<WelcomeStage>("sealed");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const handleReopen = () => {
      setStage("sealed");
      setInternalOpen(true);
    };
    window.addEventListener("reopen-welcome-letter", handleReopen);
    return () => window.removeEventListener("reopen-welcome-letter", handleReopen);
  }, []);

  const handleBreakSeal = () => {
    if (stage !== "sealed") return;
    setStage("unsealing");

    if (soundEnabled) {
      playJingleBellsMelody();
    }
    fireGrandConfetti();

    setTimeout(() => {
      setStage("letter");
    }, 520);
  };

  const handleEnterEvent = () => {
    if (stage === "exiting") return;
    setStage("exiting");

    if (soundEnabled) {
      playChristmasChime();
    }
    fireGrandConfetti();

    setTimeout(() => {
      setInternalOpen(false);
      setStage("sealed");
      if (onProceedToEvent) {
        onProceedToEvent();
      } else {
        onClose?.();
      }
    }, 450);
  };

  const handleSkip = () => {
    setInternalOpen(false);
    setStage("sealed");
    onClose?.();
  };

  if (!activeOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto overflow-x-hidden transition-opacity duration-400 ease-out ${
        stage === "exiting" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Clean GPU-friendly Festive Backdrop (no heavy nested blurs or spinning conic gradients) */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(225, 29, 72, 0.32), transparent 45%), radial-gradient(circle at 80% 75%, rgba(16, 185, 129, 0.28), transparent 45%), linear-gradient(135deg, #4c0519 0%, #2b0912 45%, #062c1b 100%)",
        }}
      />

      {/* Gentle Snowfall Inside Welcome Overlay */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        {WELCOME_FLAKES.map((f) => (
          <span
            key={f.id}
            className="snowflake text-white/75"
            style={{
              left: `${f.left}%`,
              fontSize: `${f.size}px`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              zIndex: 0,
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
            className={`absolute text-amber-200/80 animate-star-twinkle select-none ${s.size}`}
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          >
            {s.icon}
          </span>
        ))}
      </div>

      {/* Top Controls (Audio Toggle + Skip) */}
      <div className="fixed top-4 right-4 left-4 flex items-center justify-between max-w-4xl mx-auto z-30 pointer-events-none">
        <button
          onClick={() => setSoundEnabled((prev) => !prev)}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-amber-100 text-xs font-semibold transition hover:scale-105 active:scale-95 cursor-pointer"
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
          className="pointer-events-auto inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white/90 hover:text-white text-xs font-semibold transition hover:scale-105 active:scale-95 cursor-pointer"
          title="Bỏ qua màn chào mừng"
        >
          <span>Bỏ qua</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrollable Centering Container */}
      <div className="relative z-10 min-h-full flex items-center justify-center p-4 pt-16 pb-8">
        {/* STAGE 1: SMOOTH FLOATING SEALED ENVELOPE */}
        {(stage === "sealed" || stage === "unsealing") && (
          <div
            className={`relative w-full max-w-lg mx-auto animate-pop-in transition-all duration-500 ease-out ${
              stage === "unsealing" ? "opacity-0 scale-105 -translate-y-4" : "opacity-100 scale-100"
            }`}
          >
            {/* Header Banner above envelope */}
            <div className="text-center mb-6 px-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-300/20 border border-amber-200/45 text-amber-100 text-xs font-extrabold tracking-wider uppercase shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{companyName} • Secret Santa 2026</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-holiday font-black text-white mt-3 text-balance drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                Món Quà Bất Ngờ Đang Chờ Bạn ✨
              </h2>
            </div>

            {/* Clean Floating Envelope Card (Zero 3D compositing glitch) */}
            <div className={`max-w-md mx-auto ${stage === "sealed" ? "animate-envelope-float" : ""}`}>
              <div
                onClick={handleBreakSeal}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleBreakSeal()}
                className="group relative mx-auto w-full rounded-[28px] cursor-pointer select-none transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.99]"
              >
                {/* Envelope Pocket Body */}
                <div className="relative h-72 sm:h-80 rounded-[28px] bg-gradient-to-br from-red-600 via-rose-700 to-red-900 border-2 border-amber-200/80 shadow-[0_24px_60px_rgba(0,0,0,0.45)] flex flex-col justify-between p-5 sm:p-6 overflow-hidden">
                  {/* Subtle Diagonal Envelope Flap Seam Decoration (Static SVG/Gradient — Never Tearing) */}
                  <svg
                    viewBox="0 0 400 180"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 top-0 w-full h-40 pointer-events-none opacity-35"
                    aria-hidden="true"
                  >
                    <polygon points="0,0 400,0 200,165" fill="rgba(255,255,255,0.14)" />
                    <polyline
                      points="0,0 200,165 400,0"
                      fill="none"
                      stroke="rgba(253, 224, 71, 0.7)"
                      strokeWidth="2.5"
                    />
                  </svg>

                  {/* Top Row: Logo Pill + Holiday Stamp */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="bg-white/95 px-3 py-1.5 rounded-2xl shadow-md border border-amber-200 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-105">
                      <span className="text-sm">🎅</span>
                      {companyLogo ? (
                        <img src={companyLogo} alt={companyName} className="h-5 sm:h-6 w-auto object-contain" />
                      ) : (
                        <span className="text-xs font-black text-red-700">{companyName}</span>
                      )}
                    </div>

                    {/* Festive Postage Stamp */}
                    <div className="px-2.5 py-1.5 rounded-2xl bg-amber-50/95 border-2 border-dashed border-red-500/70 text-center rotate-3 shadow-md transition-transform duration-300 group-hover:rotate-6">
                      <div className="text-[9px] font-black text-red-700 uppercase tracking-wider">Giáng Sinh</div>
                      <div className="text-xs font-black text-emerald-700">2026 ❄️</div>
                    </div>
                  </div>

                  {/* Center Interactive Wax Seal */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                    <div className="relative flex items-center justify-center">
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
                  <div className="relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-black/35 border border-amber-200/40 backdrop-blur-xs">
                      <span className="text-xs text-amber-100 font-semibold">
                        {recipientName ? (
                          <>
                            Gửi riêng: <strong className="text-white font-bold">{recipientName}</strong> • Phòng {recipientDepartment || companyName}
                          </>
                        ) : (
                          <>
                            Gửi riêng: <strong className="text-white font-bold">Thành viên {companyName}</strong>
                          </>
                        )}
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
            className="relative w-full max-w-xl bg-[#fffcf7] border-3 border-amber-300/80 rounded-[32px] p-6 sm:p-9 shadow-[0_30px_80px_rgba(0,0,0,0.45)] animate-letter-unfold"
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
                <div className="text-xs font-black text-red-800 mt-0.5">{revealDayLabel}</div>
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
                <div className="text-xs font-black text-amber-800 mt-0.5">Đêm Tiệc {eventDayLabel}</div>
                <div className="text-[10px] sm:text-[11px] text-stone-600 font-semibold">Trao Quà &amp; Phạt</div>
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
                <span>VÀO MỞ HỘP QUÀ &amp; ĐẾM NGƯỢC 🎁</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <span className="text-[11px] text-stone-500 mt-2.5 font-medium">
                (Xem lại bất cứ lúc nào ở nút 💌 Thư Mời góc trên phải)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
