"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Gift, ArrowRight, ShieldCheck, HeartHandshake, AlertTriangle, Mail, Lock, ShieldAlert } from "lucide-react";
import { playJingleBellsMelody, fireGrandConfetti, playSuspenseWarningSound, playUnsealSound } from "./WelcomeLetter";
import { RevealData } from "./UnboxForm";

const emptySubscribe = () => () => {};

interface ChristmasPostcardProps {
  companyName?: string;
  companyLogo?: string;
  customRules?: string;
  currentUser?: {
    name: string;
    department: string;
    email: string;
  } | null;
  onSuccess?: (data: RevealData) => void;
  onClose?: () => void;
}

export default function ChristmasPostcard({ companyName = "GLOBAL SAFE", customRules, currentUser, onSuccess, onClose }: ChristmasPostcardProps) {
  const [email, setEmail] = useState("");
  const [phoneLast4, setPhoneLast4] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<RevealData | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [hasConfirmedAlone, setHasConfirmedAlone] = useState(false);
  const [isTearing, setIsTearing] = useState(false);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    const cleanPhone = phoneLast4.trim();

    if (!cleanEmail || !cleanPhone) {
      setErrorMsg("Vui lòng nhập đầy đủ Email công ty và 4 số cuối điện thoại.");
      return;
    }

    if (cleanPhone.length !== 4 || !/^\d{4}$/.test(cleanPhone)) {
      setErrorMsg("Mã bảo mật phải là đúng 4 chữ số cuối số điện thoại.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, phoneLast4: cleanPhone }),
      });

      const data = await res.json();

      // Suspense delay
      await new Promise((r) => setTimeout(r, 800));

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Không thể xác thực thông tin. Vui lòng kiểm tra lại!");
        setIsLoading(false);
        return;
      }

      // Success: Play dramatic suspense radar alert & open Top Secret Warning Modal
      playSuspenseWarningSound();
      setPendingData(data);
      setShowWarningModal(true);
    } catch {
      setErrorMsg("Có lỗi kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAndProceed = () => {
    if (!pendingData) return;
    setShowWarningModal(false);
    setIsTearing(true);
    playUnsealSound();
    fireGrandConfetti();
    setTimeout(() => {
      playJingleBellsMelody();
      onSuccess?.(pendingData);
    }, 1800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-0 sm:px-2 py-1 sm:py-4">
      {/* Outer Airmail Diagonal Striped Border (Matches user's postcard inspiration) */}
      <div
        className="relative w-full rounded-[24px] sm:rounded-[32px] p-2.5 sm:p-4 shadow-[0_25px_70px_rgba(0,0,0,0.35)] transition-all duration-300"
        style={{
          background: `repeating-linear-gradient(
            -45deg,
            #dc2626 0px,
            #dc2626 14px,
            #fbf7ed 14px,
            #fbf7ed 22px,
            #1d4ed8 22px,
            #1d4ed8 36px,
            #fbf7ed 36px,
            #fbf7ed 44px
          )`,
        }}
      >
        {/* Inner Parchment Card Body - Cozy, Warm & Festive Holiday Gradient */}
        <div className="relative w-full bg-gradient-to-br from-[#fffdf5] via-[#fef6e9] to-[#faeee3] rounded-[18px] sm:rounded-[24px] p-4 sm:p-7 md:p-8 shadow-inner border border-amber-900/15 text-stone-800 overflow-hidden">
          {/* Festive atmospheric gradient glows inside the parchment */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Soft warm golden amber glow in top-left behind Merry Christmas */}
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
            {/* Festive soft holiday berry glow in bottom-right behind login */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-red-500/12 blur-3xl pointer-events-none" />
            {/* Pine green accent glow in bottom-left */}
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            {/* Subtle postal vintage stationery texture */}
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#92400e_1px,transparent_1px)] [background-size:18px_18px]" />
          </div>

          {/* Grid Layout: Left (Merry Christmas & Rules) + Right (Stamp, To, From, Login Inputs) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 md:gap-8 items-stretch relative z-10">
            {/* ========================================================================= */}
            {/* LEFT HALF: "Merry Christmas" + Illustrations + Thể Lệ Cuộc Chơi          */}
            {/* ========================================================================= */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-5">
              <div>
                {/* Header Title */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="font-script font-bold text-4xl sm:text-6xl text-[#1e3a8a] drop-shadow-xs leading-none tracking-wide inline-flex items-center gap-2">
                      <span>Merry Christmas</span>
                      <span className="text-3xl sm:text-4xl filter drop-shadow-xs animate-spin-slow select-none not-italic font-sans">❄️</span>
                    </h1>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-red-100/90 border border-red-300 text-red-800 text-xs font-black uppercase tracking-wider">
                      <span>🎄</span>
                      <span>Secret Santa • {companyName} 2026</span>
                    </div>
                  </div>
                </div>

                {/* Cute Festive Holiday Illustration Cluster (Gnome, Tree, Santa Mailbox) */}
                <div className="flex items-center gap-4 my-4 p-3 bg-gradient-to-r from-amber-100/75 via-white/80 to-red-50/65 rounded-2xl border border-amber-300/80 shadow-xs">
                  <div className="flex items-center gap-2 text-3xl sm:text-4xl select-none">
                    <span className="animate-sway inline-block">🎅</span>
                    <span className="animate-float-slow inline-block">🎄</span>
                    <span className="inline-block">📮</span>
                    <span className="animate-gift-hop inline-block">🎁</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-stone-700 font-medium leading-snug">Bức thư mời tham gia hành trình trao gửi niềm vui bất ngờ dành riêng cho bạn!</p>
                </div>

                {/* Thể Lệ Cuộc Chơi (Rules) */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📜</span>
                    <h3 className="font-bold text-sm sm:text-base text-red-800 uppercase tracking-wide">Thể Lệ Cuộc Chơi Secret Santa:</h3>
                  </div>

                  {customRules ? (
                    <div className="p-3.5 bg-gradient-to-br from-amber-50/90 via-white/95 to-red-50/60 rounded-2xl border-2 border-amber-200/80 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-1.5 font-normal max-h-64 overflow-y-auto shadow-xs">
                      {customRules.split("\n").map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return <div key={idx} className="h-0.5" />;
                        if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
                          return (
                            <h4 key={idx} className="font-bold text-red-800 text-xs sm:text-sm pt-1">
                              {trimmed.replace(/^#+\s*/, "")}
                            </h4>
                          );
                        }
                        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
                        return (
                          <p key={idx} className="leading-snug">
                            {parts.map((part, pIdx) => {
                              if (part.startsWith("**") && part.endsWith("**")) {
                                return (
                                  <strong key={pIdx} className="font-bold text-stone-900">
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return part;
                            })}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {/* Rule 1: Ngân sách */}
                      <div className="p-3 bg-red-50/90 rounded-2xl border border-red-200 shadow-xs">
                        <div className="flex items-center gap-1.5 font-bold text-red-800 mb-0.5">
                          <Gift className="w-4 h-4 text-red-600 shrink-0" />
                          <span>Ngân Sách Quà Tặng</span>
                        </div>
                        <p className="text-stone-700 leading-snug">
                          Dưới <strong className="text-red-700 font-bold">200.000đ</strong>. Tự do sáng tạo món quà bất ngờ &amp; ý nghĩa!
                        </p>
                      </div>

                      {/* Rule 2: Bí mật */}
                      <div className="p-3 bg-emerald-50/90 rounded-2xl border border-emerald-200 shadow-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-0.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Bí Mật Tuyệt Đối</span>
                        </div>
                        <p className="text-stone-700 leading-snug">Giữ kín danh tính người nhận và thân phận Santa cho đến đêm tiệc Noel.</p>
                      </div>

                      {/* Rule 3: Khác phòng ban */}
                      <div className="p-3 bg-emerald-50/90 rounded-2xl border border-emerald-200 shadow-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-0.5">
                          <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Khác Phòng Ban</span>
                        </div>
                        <p className="text-stone-700 leading-snug">Thuật toán tự động ghép đôi khác bộ phận để kết nối tình đồng nghiệp.</p>
                      </div>

                      {/* Rule 4: Hình phạt */}
                      <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-200 shadow-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-0.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Vòng Quay Phạt</span>
                        </div>
                        <p className="text-stone-700 leading-snug">Quên chuẩn bị quà hoặc đoán sai Santa sẽ phải chịu phạt tại tiệc! 🎪</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Decorative Touch */}
              <div className="hidden md:flex items-center gap-2 pt-2 text-[11px] text-stone-500 italic">
                <span>✦ Mùa lễ hội 2026 • Gắn kết &amp; Yêu thương • {companyName} ✦</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT HALF: Postage Stamp + To / From Fields + Login Form                 */}
            {/* ========================================================================= */}
            <div className="md:col-span-5 md:border-l md:border-dashed md:border-stone-300 md:pl-8 flex flex-col justify-between">
              <div>
                {/* Top: Festive Airmail Postage Stamp */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-stone-400">AIR MAIL • POSTCARD</div>

                  {/* Stamp Card with dashed/perforated border */}
                  <div className="px-3 py-2 bg-amber-50/95 border-2 border-dashed border-red-500/80 rounded-xl text-center shadow-md rotate-2 transition-transform hover:rotate-0">
                    <div className="text-2xl select-none mb-0.5">🦌🎅</div>
                    <div className="text-[9px] font-black uppercase text-red-700 tracking-wider">GIÁNG SINH</div>
                    <div className="text-[10px] font-bold text-emerald-700">2026 ❄️</div>
                  </div>
                </div>

                {/* From line (Clean, fitted on one line without breaking) */}
                <div className="mb-4 sm:mb-5 pb-2.5 sm:pb-3 border-b-2 border-stone-300 flex items-baseline gap-2.5">
                  <span className="font-bold text-xl sm:text-2xl text-stone-800 shrink-0 italic">from:</span>
                  <span className="font-black text-xl sm:text-2xl text-red-700 uppercase tracking-wider drop-shadow-xs whitespace-nowrap">{companyName}</span>
                </div>

                {/* If already logged in: Display recipient name BIG and personal */}
                {currentUser ? (
                  <div className="space-y-4 my-2 animate-fade-up">
                    <div className="pt-1">
                      <div className="flex items-baseline gap-2.5 mb-1.5">
                        <span className="font-bold text-xl sm:text-2xl text-stone-800 italic">to:</span>
                        <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest bg-red-100/90 px-2.5 py-0.5 rounded-full border border-red-200">Người nhận thư 💌</span>
                      </div>

                      <div className="pl-3.5 sm:pl-5 border-l-4 sm:border-l-6 border-red-600 bg-gradient-to-r from-red-50/95 via-amber-50/70 to-white/90 py-3.5 px-3.5 sm:px-4 rounded-r-2xl shadow-sm border border-l-0 border-amber-200/60">
                        <h3 className="font-black text-2xl sm:text-3xl md:text-4xl text-red-700 leading-tight tracking-tight drop-shadow-xs break-words">{currentUser.name}</h3>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs sm:text-sm font-bold border border-emerald-300 shadow-xs max-w-full">
                            <span>🏢</span>
                            <span className="truncate">Phòng {currentUser.department}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-mono border border-stone-200 max-w-full">
                            <span>✉️</span>
                            <span className="truncate">{currentUser.email}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex max-w-full items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-emerald-100/90 border border-emerald-300 rounded-xl text-emerald-800 text-xs sm:text-sm font-bold shadow-xs">
                      <span className="shrink-0">✅</span>
                      <span className="truncate">ĐÃ XÁC THỰC THÀNH VIÊN {companyName}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/90">
                      🎅 Bức thư mời Secret Santa đã được trao riêng cho bạn! Hãy cùng vào chuẩn bị món quà ý nghĩa dưới 200k và sẵn sàng cho đêm tiệc Giáng Sinh nhé!
                    </p>

                    {onClose && (
                      <div className="pt-2">
                        <button
                          onClick={onClose}
                          className="btn-shimmer group w-full py-3.5 sm:py-4 px-3 sm:px-6 bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-black text-xs min-[360px]:text-sm sm:text-base rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-98 border-2 border-amber-300 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <span>QUAY LẠI MỞ HỘP QUÀ &amp; ĐẾM NGƯỢC 🎁</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1.5 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Postcard Form for logging in */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* To Line (Email công ty) */}
                    <div>
                      <div className="flex items-baseline gap-2.5 mb-1">
                        <label htmlFor="postcard-email" className="font-bold text-xl sm:text-2xl text-stone-800 shrink-0 italic">
                          to:
                        </label>
                        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">(Email công ty của bạn)</span>
                      </div>

                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-1 top-2.5" />
                        <input
                          id="postcard-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ten.nguyen@globalsafe.vn"
                          className="w-full pl-7 pr-2 py-1.5 bg-transparent border-b-2 border-stone-400 focus:border-red-600 outline-none text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 placeholder:font-normal transition"
                        />
                      </div>
                    </div>

                    {/* Pass Line (4 số cuối điện thoại) */}
                    <div className="pt-1">
                      <div className="flex items-baseline gap-2.5 mb-1">
                        <label htmlFor="postcard-pass" className="font-bold text-xl sm:text-2xl text-stone-800 shrink-0 italic">
                          pass:
                        </label>
                        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">(4 số cuối điện thoại)</span>
                      </div>

                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-1 top-2.5" />
                        <input
                          id="postcard-pass"
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          required
                          value={phoneLast4}
                          onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, ""))}
                          placeholder="•••• (4 chữ số)"
                          className="w-full pl-7 pr-2 py-1.5 bg-transparent border-b-2 border-stone-400 focus:border-red-600 outline-none text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 placeholder:font-normal tracking-widest transition"
                        />
                      </div>
                    </div>

                    {/* Error Notification */}
                    {errorMsg && <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 font-medium">⚠️ {errorMsg}</div>}

                    {/* Submit Button (Envelope Tear Strip / Wax Seal Action) */}
                    <div className="pt-3 relative">
                      {/* Decorative perforated tear-strip indicator */}
                      <div className="flex items-center gap-2 mb-2 px-1 opacity-70">
                        <span className="text-xs select-none">✂️</span>
                        <div className="flex-1 border-t-2 border-dashed border-stone-400" />
                        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-stone-500">
                          XÉ THƯ NIÊM PHONG
                        </span>
                        <div className="flex-1 border-t-2 border-dashed border-stone-400" />
                        <span className="text-xs select-none">💌</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || isTearing}
                        className="btn-shimmer group w-full py-3.5 sm:py-4 px-3 sm:px-6 bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-black text-xs min-[360px]:text-sm sm:text-base rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-98 border-2 border-amber-300 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {isLoading ? (
                          <>
                            <Gift className="w-5 h-5 animate-spin text-yellow-200" />
                            <span>Đang kiểm tra mật mã thư...</span>
                          </>
                        ) : (
                          <>
                            <span>MỞ THƯ &amp; VÀO SỰ KIỆN</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1.5 transition-transform" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] text-stone-500 mt-2 font-medium">👆 Nhập thông tin để mở hộp quà và theo dõi đồng hồ đếm ngược!</p>
                    </div>
                  </form>
                )}
              </div>

              {/* Postcard Postal Watermark */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                <span>PAR AVION • ĐIỆN TỬ</span>
                <span>GLOBAL SAFE 2026</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PHYSICAL ENVELOPE TEARING & UNSEALING ANIMATION (XÉ THƯ TRỰC TIẾP TẠI ĐÂY) */}
          {/* ========================================================================= */}
          {isTearing && (
            <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none">
              {/* Dimmed backdrop with paper texture */}
              <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] transition-opacity duration-300" />

              {/* Top Perforated Flap lifting open in 3D */}
              <div className="absolute top-0 left-0 right-0 h-1/2 origin-top animate-flap-peel bg-gradient-to-b from-[#fffaf0] via-[#fef6e9] to-[#faeee3] border-b-2 border-dashed border-amber-300 shadow-[0_15px_30px_rgba(0,0,0,0.25)] z-20 flex items-end justify-between px-6 pb-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-stone-400">
                <span>✦ AIR MAIL • CONFIDENTIAL ✦</span>
                <span>OPENING... 💌</span>
              </div>

              {/* The Perforated Tear Zipper Line Ripping Across */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-10 flex items-center pointer-events-none z-30">
                {/* Glowing Spark Trail */}
                <div className="absolute inset-0 animate-tear-glow bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

                {/* Perforated dashed rip line */}
                <div className="w-full h-1 bg-[repeating-linear-gradient(90deg,#d97706_0px,#d97706_8px,transparent_8px,transparent_16px)] animate-tear-strip" />

                {/* Animated Scissors / Pull-tab cutting through */}
                <div className="absolute top-1/2 -translate-y-1/2 text-3xl sm:text-4xl animate-tear-scissor filter drop-shadow-[0_0_12px_rgba(245,158,11,1)]">
                  ✂️
                </div>
              </div>

              {/* Secret Santa Invitation Letter Rising out of the Envelope */}
              <div className="relative z-40 max-w-lg w-full bg-gradient-to-b from-[#fffef7] via-[#fff8ed] to-[#fdedd9] p-6 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-[0_25px_60px_rgba(0,0,0,0.4)] text-center animate-letter-rise">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white mb-3 shadow-lg shadow-red-500/30 border border-amber-200 animate-bounce">
                  <Gift className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 bg-amber-100/90 px-3 py-0.5 rounded-full border border-amber-300 inline-block">
                    💌 BỨC THƯ ĐÃ ĐƯỢC XÉ MỞ
                  </span>
                  <h3 className="font-script font-bold text-3xl sm:text-4xl text-red-700 leading-tight drop-shadow-xs">
                    Merry Christmas!
                  </h3>
                </div>

                <p className="mt-2 text-sm sm:text-base font-bold text-stone-800">
                  Chào mừng <span className="text-red-600">{pendingData?.currentUser?.name || email}</span>!
                </p>

                <p className="mt-1 text-xs sm:text-sm text-stone-600 font-medium leading-snug">
                  Nhiệm vụ trao quà và danh tính người nhận đang được giải mã...
                </p>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/90 py-2 px-4 rounded-xl border border-emerald-300 w-fit mx-auto shadow-xs">
                  <span className="animate-spin text-sm">❄️</span>
                  <span>ĐANG MỞ CÁNH CỔNG ĐÊM TIỆC...</span>
                  <span className="animate-spin text-sm">❄️</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DRAMATIC TOP SECRET WARNING POPUP (CẢNH BÁO BẢO MẬT & XEM MỘT MÌNH)       */}
      {/* ========================================================================= */}
      {showWarningModal && pendingData && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] animate-alarm-strobe backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Ambient Emergency Red Siren Sweeps & Strobe in Background */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Center Pulsating Red Beacon Light */}
            <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] sm:w-[950px] sm:h-[950px] rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.55)_0%,rgba(185,28,28,0.25)_40%,transparent_70%)] animate-siren-flash" />

            {/* Rotating Tactical Siren Light Beams */}
            <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] sm:w-[1100px] sm:h-[1100px] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(239,68,68,0.35)_45deg,transparent_90deg,transparent_180deg,rgba(239,68,68,0.35)_225deg,transparent_270deg)] animate-siren-rotate" />

            {/* Pulsating Edge Hazard Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(220,38,38,0.4)_100%)] animate-pulse" />
          </div>

          {/* Dark Stealth Tactical Warning Container */}
          <div className="relative w-full max-w-lg bg-[#0c0a09] border-2 rounded-3xl animate-warning-box overflow-hidden text-stone-100 z-10 my-auto shadow-[0_0_80px_rgba(220,38,38,0.7)]">
            {/* Top Red-Black Caution Tape Bar */}
            <div
              className="h-3 w-full shrink-0"
              style={{
                background: "repeating-linear-gradient(-45deg, #dc2626 0px, #dc2626 12px, #000 12px, #000 24px)",
              }}
            />

            <div className="p-4 sm:p-7 md:p-8 space-y-3.5 sm:space-y-5">
              {/* Top Secret Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/90 border border-red-500 text-red-400 text-xs font-black uppercase tracking-widest animate-pulse">
                  <span className="text-base">🚨</span>
                  <span>MẬT LỆNH BẢO MẬT CẤP ĐỘ CAO NHẤT</span>
                </div>
                <span className="text-xs font-mono text-stone-500 uppercase tracking-widest hidden sm:inline">TOP SECRET</span>
              </div>

              {/* Dangerous Headline */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-red-500 uppercase tracking-tight leading-tight flex items-center gap-2">
                  <span>⚠️</span>
                  <span>BẠN CÓ ĐANG Ở MỘT MÌNH KHÔNG?</span>
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 font-medium">(ARE YOU CURRENTLY VIEWING THIS ALONE?)</p>
              </div>

              {/* Warning Checklist (Dramatic & Fun) */}
              <div className="space-y-2.5 sm:space-y-3 bg-red-950/40 border border-red-900/70 p-3.5 sm:p-5 rounded-2xl text-xs sm:text-sm text-stone-200">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-lg sm:text-xl shrink-0">👀</span>
                  <p className="leading-snug">
                    <strong className="text-white font-bold">Quan sát xung quanh ngay bây giờ:</strong> Hãy chắc chắn không có đồng nghiệp nào đang đứng sau lưng hoặc liếc nhìn màn hình của bạn!
                  </p>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-lg sm:text-xl shrink-0">🤫</span>
                  <p className="leading-snug">
                    <strong className="text-white font-bold">Nhiệm vụ tối mật:</strong> Sau cánh cửa này là danh tính người bạn sẽ tặng quà và 3 manh mối truy tìm Santa đang âm thầm tặng quà cho bạn.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-lg sm:text-xl shrink-0">🎪</span>
                  <p className="leading-snug">
                    <strong className="text-amber-400 font-bold">Hình phạt sinh tử:</strong> Bất kỳ ai vô tình để lộ bí mật trước đêm tiệc Noel 24/12 sẽ bị bêu tên và chịu hình phạt tại <strong className="text-red-400 font-bold">Vòng Quay Phạt</strong> trước toàn thể {companyName}!
                  </p>
                </div>
              </div>

              {/* Interactive Confirm Checkbox */}
              <label className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-stone-900/90 rounded-2xl border border-stone-800 cursor-pointer select-none hover:border-red-500/60 transition group">
                <input type="checkbox" checked={hasConfirmedAlone} onChange={(e) => setHasConfirmedAlone(e.target.checked)} className="w-4 h-4 sm:w-5 sm:h-5 rounded accent-red-600 cursor-pointer shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-stone-200 group-hover:text-white transition leading-snug">Tôi xác nhận đang ở một mình &amp; thề giữ bí mật tuyệt đối! ✋</span>
              </label>

              {/* Actions */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  disabled={!hasConfirmedAlone}
                  onClick={handleConfirmAndProceed}
                  className={`btn-shimmer group w-full py-3.5 sm:py-4 px-3 sm:px-6 font-black rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
                    hasConfirmedAlone
                      ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_35px_rgba(220,38,38,0.7)] hover:scale-[1.01] active:scale-98 border-red-400 cursor-pointer"
                      : "bg-stone-800/90 text-stone-500 border-stone-700/80 cursor-not-allowed opacity-60 shadow-none"
                  }`}
                >
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span className="text-sm sm:text-base font-black tracking-wider uppercase whitespace-nowrap">
                    MỞ THƯ NGAY 🔥
                  </span>
                  <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowWarningModal(false);
                    setPendingData(null);
                  }}
                  className="w-full py-2 text-center text-xs text-stone-400 hover:text-stone-200 transition font-medium cursor-pointer"
                >
                  Chờ chút, để tôi tìm góc kín đáo hơn... 🏃‍♂️
                </button>
              </div>
            </div>

            {/* Bottom Red-Black Caution Tape Bar */}
            <div
              className="h-3 w-full shrink-0"
              style={{
                background: "repeating-linear-gradient(-45deg, #dc2626 0px, #dc2626 12px, #000 12px, #000 24px)",
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
