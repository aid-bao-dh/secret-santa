"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Gift, Lock, Mail, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import RevealModal from "./RevealModal";
import { playChristmasChime } from "./WelcomeLetter";

export interface RevealData {
  currentUser: {
    id?: string;
    name: string;
    email: string;
    department: string;
  };
  giftRecipient?: {
    name: string;
    department: string;
    avatar: string;
    bio?: string;
  };
  santaHints?: string[];
  wasViewedBefore?: boolean;
  notMatchedYet?: boolean;
  message?: string;
}

interface UnboxFormProps {
  companyName?: string;
  companyLogo?: string;
  className?: string;
  onSuccess?: (data: RevealData) => void;
}

export default function UnboxForm({
  companyName = "GLOBAL SAFE",
  companyLogo = "/assets/logo.png",
  className = "",
  onSuccess,
}: UnboxFormProps) {
  const [email, setEmail] = useState("");
  const [phoneLast4, setPhoneLast4] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notMatchedMsg, setNotMatchedMsg] = useState<string | null>(null);
  const [revealData, setRevealData] = useState<RevealData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setNotMatchedMsg(null);

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
    setIsShaking(true);

    try {
      const res = await fetch("/api/auth/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, phoneLast4: cleanPhone }),
      });

      const data = await res.json();

      // Suspense delay for excitement
      await new Promise((r) => setTimeout(r, 900));

      if (!res.ok || !data.success) {
        if (data.notMatchedYet) {
          setNotMatchedMsg(data.message);
        } else {
          setErrorMsg(data.message || "Không thể xác thực thông tin. Vui lòng kiểm tra lại!");
        }
        setIsLoading(false);
        setIsShaking(false);
        return;
      }

      if (onSuccess) {
        onSuccess(data);
      } else {
        setRevealData(data);
      }
    } catch {
      setErrorMsg("Có lỗi kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
      setIsShaking(false);
    }
  };

  return (
    <div className={`w-full max-w-lg mx-auto ${className}`}>
      {/* 3D Festive Gift Box Hero */}
      <div className="text-center mb-6">
        <div
          className={`inline-block relative cursor-pointer select-none transition-transform duration-300 ${
            isShaking ? "animate-gift-excited" : "animate-gift-hop hover:scale-110 active:scale-95"
          }`}
          onClick={() => {
            if (!isLoading) {
              playChristmasChime();
              confetti({
                particleCount: 28,
                spread: 55,
                origin: { y: 0.45 },
                colors: ["#dc2626", "#16a34a", "#f59e0b", "#ffffff"],
              });
              const el = document.getElementById("santa-email-input");
              el?.focus();
            }
          }}
          title="Chạm nhẹ vào hộp quà!"
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-red-400/30 rounded-full blur-2xl -z-10" />

          {/* Royal Christmas Gift Box */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-red-500 via-red-600 to-rose-700 shadow-[0_15px_30px_rgba(220,38,38,0.35)] border-3 border-amber-300 flex items-center justify-center relative">
            {/* Silk Ribbon Vertical */}
            <div className="absolute inset-y-0 w-7 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-sm" />
            {/* Silk Ribbon Horizontal */}
            <div className="absolute inset-x-0 h-7 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 shadow-sm" />
            {/* Ribbon Big Bow */}
            <div className="absolute -top-4 text-4xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">🎀</div>
            {/* Gift icon with gold sparkles */}
            <Gift className="w-12 h-12 text-white z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />

            {/* Floating Gift Tag */}
            <div className="absolute -bottom-3 -right-2 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md border border-emerald-300 rotate-[-8deg] flex items-center gap-1">
              <span>🏷️ Mở Quà</span>
            </div>
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-holiday font-bold text-red-800 mt-5 drop-shadow-sm">
          Khám Phá Nhiệm Vụ Của Bạn
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-sm mx-auto font-sans">
          Điền email công ty & 4 số cuối điện thoại để mở phong thư bí mật từ Bắc Cực!
        </p>
      </div>

      {/* Main Form Box (Bright White Theme with Red & Green Accents) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 border-2 border-red-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.08)] space-y-5"
      >
        {/* Email Input */}
        <div>
          <label
            htmlFor="santa-email-input"
            className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2"
          >
            Email Công Ty
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-500">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="santa-email-input"
              type="email"
              required
              placeholder="ví dụ: linh.nguyen@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-2xl text-stone-900 placeholder-stone-400 text-sm outline-none transition shadow-sm font-medium"
            />
          </div>
        </div>

        {/* Phone Last 4 Digits */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="santa-phone-input"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
            >
              4 Số Cuối Điện Thoại (Khóa Bảo Mật)
            </label>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Riêng tư 100%
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="santa-phone-input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              required
              placeholder="4 chữ số (VD: 1234)"
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, ""))}
              className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 rounded-2xl text-stone-900 placeholder-stone-400 text-sm tracking-widest outline-none transition shadow-sm font-medium"
            />
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-300 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 shadow-sm font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Not matched yet notice */}
        {notMatchedMsg && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800 shadow-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{notMatchedMsg}</span>
          </div>
        )}

        {/* Quick Rule Tag */}
        <div className="px-3.5 py-2.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-center justify-between text-xs text-amber-950 font-semibold shadow-xs">
          <span className="flex items-center gap-1.5">
            <span className="text-base">🎁</span>
            <span>Ngân sách: <strong className="text-red-700 font-bold">Dưới 200.000đ</strong> (tự do chọn quà)</span>
          </span>
          <span className="text-emerald-700 flex items-center gap-1 shrink-0">
            <span>🤫</span>
            <span>Giữ bí mật</span>
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-shimmer w-full py-4 px-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-base rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(220,38,38,0.35)] hover:shadow-[0_10px_28px_rgba(220,38,38,0.45)] hover:-translate-y-0.5 active:scale-98 disabled:opacity-50 border border-red-400 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Gift className="w-5 h-5 animate-spin text-yellow-200" />
              <span>Đang mở hộp quà bí mật...</span>
            </>
          ) : (
            <>
              <Gift className="w-5 h-5 text-yellow-200" />
              <span>MỞ HỘP QUÀ BÍ MẬT 🎁</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Modal Result */}
      {revealData && (
        <RevealModal
          data={revealData}
          companyName={companyName}
          companyLogo={companyLogo}
          onClose={() => setRevealData(null)}
        />
      )}
    </div>
  );
}
