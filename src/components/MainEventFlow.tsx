"use client";

import { useState, useSyncExternalStore } from "react";
import confetti from "canvas-confetti";
import { Gift, ArrowRight, ShieldCheck, X } from "lucide-react";
import SnowEffect from "./SnowEffect";
import FairyLights from "./FairyLights";
import Navbar from "./Navbar";
import Countdown from "./Countdown";
import RulesSection from "./RulesSection";
import ChristmasPostcard from "./ChristmasPostcard";
import { RevealData } from "./UnboxForm";
import { playChristmasChime } from "./WelcomeLetter";
import RevealModal from "./RevealModal";
import RevealOnScroll from "./RevealOnScroll";

interface Settings {
  companyName?: string;
  companyLogo?: string;
  revealDate?: string;
  eventDate?: string;
  rules?: string;
}

interface MainEventFlowProps {
  settings: Settings;
}

type FlowStep = "login" | "event";

const emptySubscribe = () => () => {};

function subscribeSession(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ss-session-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ss-session-change", callback);
  };
}

let cachedRawUser: string | null = null;
let cachedUserData: RevealData | null = null;

function getStoredUser(): RevealData | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("ss_user_data");
    if (raw === cachedRawUser) {
      return cachedUserData;
    }
    cachedRawUser = raw;
    cachedUserData = raw ? (JSON.parse(raw) as RevealData) : null;
    return cachedUserData;
  } catch {
    return null;
  }
}

function getStoredStep(): FlowStep {
  try {
    if (typeof window === "undefined") return "login";
    const saved = sessionStorage.getItem("ss_flow_step") as FlowStep | null;
    return saved === "event" ? "event" : "login";
  } catch {
    return "login";
  }
}

export default function MainEventFlow({ settings }: MainEventFlowProps) {
  const companyName = settings.companyName || "GLOBAL SAFE";
  const companyLogo = settings.companyLogo || "/assets/logo.png";
  const revealDate = settings.revealDate || "2026-11-27T00:00:00";
  const eventDate = settings.eventDate || "2026-12-24T18:00:00";

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const storedUser = useSyncExternalStore(
    subscribeSession,
    getStoredUser,
    () => null
  );

  const storedStep = useSyncExternalStore<FlowStep>(
    subscribeSession,
    getStoredStep,
    (): FlowStep => "login"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReopeningPostcard, setIsReopeningPostcard] = useState(false);

  const userData = storedUser;
  const step: FlowStep = userData ? storedStep : "login";

  const handleLoginSuccess = (data: RevealData) => {
    try {
      const raw = JSON.stringify(data);
      cachedRawUser = raw;
      cachedUserData = data;
      sessionStorage.setItem("ss_user_data", raw);
      sessionStorage.setItem("ss_flow_step", "event");
      window.dispatchEvent(new Event("ss-session-change"));
    } catch {
      // ignore storage errors
    }
    setIsModalOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    try {
      cachedRawUser = null;
      cachedUserData = null;
      sessionStorage.removeItem("ss_user_data");
      sessionStorage.removeItem("ss_flow_step");
      window.dispatchEvent(new Event("ss-session-change"));
    } catch {
      // ignore storage errors
    }
    setIsModalOpen(false);
    setIsReopeningPostcard(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-2">🎄</div>
          <div className="text-xs font-bold text-stone-500 uppercase tracking-widest">
            Secret Santa 2026 • Đang tải...
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden w-full flex flex-col justify-between">
      {/* REOPENED POSTCARD MODAL (WHEN VIEWING FROM EVENT HUB) */}
      {isReopeningPostcard && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-pop-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsReopeningPostcard(false);
          }}
        >
          <div className="relative w-full sm:w-[90vw] max-w-6xl my-auto">
            <button
              onClick={() => setIsReopeningPostcard(false)}
              className="absolute -top-3 -right-2 z-50 p-2.5 rounded-full bg-white text-stone-800 shadow-xl hover:bg-stone-100 transition cursor-pointer border border-stone-200"
              title="Đóng bưu thiếp"
            >
              <X className="w-5 h-5" />
            </button>
            <ChristmasPostcard
              companyName={companyName}
              companyLogo={companyLogo}
              customRules={settings.rules}
              currentUser={userData?.currentUser}
              onClose={() => setIsReopeningPostcard(false)}
              onSuccess={() => setIsReopeningPostcard(false)}
            />
          </div>
        </div>
      )}

      {/* Clean Static Winter Backdrop */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#fafaf9]" />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/[0.04] rounded-full blur-3xl pointer-events-none"
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none"
        />
      </div>

      {/* Gentle Snowfall Background */}
      <SnowEffect />

      <div>
        {/* Top Navigation Bar */}
        <Navbar
          companyName={companyName}
          companyLogo={companyLogo}
          currentUser={step === "event" ? userData?.currentUser : null}
          onLogout={handleLogout}
          onReopenLetter={() => setIsReopeningPostcard(true)}
        />

        {/* Twinkling Christmas Lights Garland */}
        <FairyLights />

        {/* Flying Santa Sleigh across upper sky */}
        <div className="w-full overflow-hidden pointer-events-none relative h-0 z-10" aria-hidden="true">
          <div className="animate-sleigh inline-flex items-center gap-1 text-xl sm:text-2xl opacity-75 select-none whitespace-nowrap pt-2">
            <span>✨</span>
            <span>🛷🎅</span>
            <span>🦌🦌</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 1: BƯU THIẾP GIÁNG SINH (POSTCARD) — MỞ MODAL RA KHI VÀO TRANG, KHÔNG CÓ NÚT TẮT */}
        {/* ========================================================================= */}
        {step === "login" && (
          <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-pop-in">
            <div className="relative w-full sm:w-[90vw] max-w-6xl my-auto">
              <ChristmasPostcard
                companyName={companyName}
                companyLogo={companyLogo}
                customRules={settings.rules}
                onSuccess={handleLoginSuccess}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: PHẦN MỞ HỘP CÓ THÔNG TIN ĐẾM NGƯỢC (EVENT HUB)                  */}
        {/* ========================================================================= */}
        {step === "event" && userData && (
          <div className="animate-fade-up w-full overflow-x-hidden">
            {/* Main Hero Header */}
            <header className="pt-8 sm:pt-12 pb-4 text-center px-3 sm:px-4 relative z-20 max-w-4xl mx-auto w-full">
              <span
                className="hidden lg:block absolute left-2 top-14 text-3xl opacity-70 animate-float-slow select-none pointer-events-none"
                aria-hidden="true"
              >
                🎄
              </span>
              <span
                className="hidden lg:block absolute right-2 top-20 text-3xl opacity-70 animate-float-reverse select-none pointer-events-none"
                aria-hidden="true"
              >
                🔔
              </span>

              {/* Greeting Badge */}
              <div className="inline-flex max-w-full flex-wrap justify-center items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 bg-red-600 border-2 border-emerald-600 rounded-2xl sm:rounded-full text-xs sm:text-sm font-bold text-white shadow-md mb-6 text-center leading-snug">
                <span className="text-base shrink-0">🎅</span>
                <span className="break-words">
                  CHÀO BẠN: {userData.currentUser.name.toUpperCase()} • PHÒNG {userData.currentUser.department}
                </span>
                <span className="text-base shrink-0">✨</span>
              </div>

              <h1 className="text-2xl min-[380px]:text-3xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-emerald-700 animate-gradient-flow drop-shadow-xs leading-tight sm:leading-tight mb-4 break-words">
                MÙA NOEL NÀY, BẠN LÀ SANTA CỦA AI?
              </h1>

              <p className="text-stone-700 text-xs sm:text-base max-w-xl mx-auto leading-relaxed mb-6 font-medium px-2">
                Mở hộp quà bí mật từ Bắc Cực, trao gửi món quà yêu thương (ngân sách dưới 200.000đ) và cùng thử tài thám tử giải mã danh tính Santa của bạn! ✨🎁
              </p>

              {/* COUNTDOWN TO REVEAL DATE / EVENT DATE */}
              <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
                <Countdown revealDate={revealDate} eventDate={eventDate} />
              </div>
            </header>

            {/* INTERACTIVE GIFT BOX SECTION (PHẦN MỞ HỘP QUÀ) */}
            <section className="max-w-xl mx-auto px-3 sm:px-4 my-8 relative z-20 text-center w-full">
              <RevealOnScroll delay={80}>
                <div className="bg-white/95 border-2 border-red-500/35 rounded-3xl p-4 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md relative overflow-hidden">
                  {/* Decorative Sparkles */}
                  <div className="absolute top-3 left-4 text-2xl select-none animate-float-slow">✨</div>
                  <div className="absolute top-3 right-4 text-2xl select-none animate-float-reverse">❄️</div>

                  {/* 3D Hopping Festive Gift Box Hero */}
                  <div
                    onClick={() => {
                      playChristmasChime();
                      confetti({
                        particleCount: 40,
                        spread: 60,
                        origin: { y: 0.5 },
                        colors: ["#dc2626", "#16a34a", "#f59e0b", "#ffffff"],
                      });
                      setIsModalOpen(true);
                    }}
                    className="inline-block relative cursor-pointer select-none transition-transform duration-300 animate-gift-hop hover:scale-110 active:scale-95 my-3"
                    title="Chạm nhẹ để mở thẻ nhiệm vụ!"
                  >
                    <div className="absolute inset-0 bg-red-400/30 rounded-full blur-2xl -z-10" />
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-red-500 via-rose-600 to-red-800 shadow-[0_18px_36px_rgba(220,38,38,0.4)] border-3 border-amber-300 flex items-center justify-center relative">
                      <div className="absolute inset-y-0 w-7 sm:w-8 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-sm" />
                      <div className="absolute inset-x-0 h-7 sm:h-8 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 shadow-sm" />
                      <div className="absolute -top-5 text-4xl sm:text-5xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">🎀</div>
                      <Gift className="w-12 h-12 sm:w-14 sm:h-14 text-white z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
                      <div className="absolute -bottom-3 -right-2 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md border border-emerald-300 rotate-[-6deg] flex items-center gap-1">
                        <span>🏷️ Mở Quà</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-3xl font-holiday font-bold text-red-800 mt-4 drop-shadow-sm break-words">
                    Hộp Quà Của {userData.currentUser.name} 🎁
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
                    Nhiệm vụ trao quà bí mật và 3 manh mối truy tìm Santa đã được phong ấn trong hộp quà này!
                  </p>

                  {/* Main Action Button */}
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => {
                        playChristmasChime();
                        setIsModalOpen(true);
                      }}
                      className="btn-shimmer w-full py-3.5 sm:py-4 px-3 sm:px-6 bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-black text-xs min-[360px]:text-sm sm:text-lg rounded-2xl shadow-xl shadow-red-600/30 transition-all hover:-translate-y-0.5 active:scale-98 border-2 border-amber-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-200 shrink-0" />
                      <span className="truncate">BẤM ĐỂ MỞ HỘP QUÀ / XEM THẺ NHIỆM VỤ</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    </button>

                    {/* Quick Guide Tag */}
                    <div className="px-3 sm:px-4 py-2.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs text-amber-950 font-semibold shadow-xs text-center sm:text-left">
                      <span className="flex items-center gap-1.5">
                        <span className="text-base shrink-0">🎁</span>
                        <span>Ngân sách: <strong className="text-red-700 font-bold">Dưới 200.000đ</strong> (tự do chọn quà)</span>
                      </span>
                      <span className="text-emerald-700 flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Giữ bí mật</span>
                      </span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </section>

            {/* POPUP REVEAL MODAL */}
            {isModalOpen && (
              <RevealModal
                data={userData}
                companyName={companyName}
                companyLogo={companyLogo}
                initialStage="card"
                onClose={() => setIsModalOpen(false)}
              />
            )}

            {/* EVENT RULES REFERENCE AT BOTTOM OF EVENT PAGE */}
            <section className="max-w-4xl mx-auto px-4 my-8 relative z-20">
              <RevealOnScroll delay={100}>
                <RulesSection customRules={settings.rules} />
              </RevealOnScroll>
            </section>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-stone-200/60 bg-white/90 py-8 px-4 text-center text-xs text-stone-600 mt-12 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <img src={companyLogo} alt={companyName} className="h-6 w-auto object-contain" />
            <span>•</span>
            <span>Secret Santa © 2026</span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            {step === "event" && (
              <button
                onClick={() => setIsReopeningPostcard(true)}
                className="hover:text-red-600 transition cursor-pointer"
              >
                💌 Xem lại bưu thiếp
              </button>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}
