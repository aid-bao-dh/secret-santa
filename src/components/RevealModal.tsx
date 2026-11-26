"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  Gift,
  Download,
  HelpCircle,
  Sparkles,
  Building,
  X,
  ShieldCheck,
  Check,
} from "lucide-react";
import { generateSecretSantaCard } from "@/lib/generateCardImage";
import { fireGrandConfetti, playUnsealSound } from "./WelcomeLetter";

interface RevealModalProps {
  data: {
    currentUser: {
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
  };
  companyName?: string;
  companyLogo?: string;
  initialStage?: "envelope" | "card";
  onClose: () => void;
}

const emptySubscribe = () => () => {};

const STARS = [
  { top: "12%", left: "10%", delay: "0s", size: "text-sm", icon: "✦" },
  { top: "16%", left: "84%", delay: "0.6s", size: "text-base", icon: "✨" },
  { top: "28%", left: "18%", delay: "1.2s", size: "text-xs", icon: "❄" },
  { top: "24%", left: "90%", delay: "0.3s", size: "text-sm", icon: "✦" },
  { top: "72%", left: "8%", delay: "0.9s", size: "text-base", icon: "✨" },
  { top: "78%", left: "86%", delay: "1.5s", size: "text-sm", icon: "❄" },
];

export default function RevealModal({
  data,
  companyName = "GLOBAL SAFE",
  companyLogo = "/assets/logo.png",
  initialStage = "card",
  onClose,
}: RevealModalProps) {
  const [stage, setStage] = useState<"envelope" | "unsealing" | "card">(initialStage);
  const [activeTab, setActiveTab] = useState<"recipient" | "hints">("recipient");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBreakSeal = () => {
    if (stage !== "envelope") return;
    setStage("unsealing");

    playUnsealSound();
    fireGrandConfetti();

    setTimeout(() => {
      setStage("card");
    }, 600);
  };

  const handleDownload = async () => {
    if (!data.giftRecipient) {
      alert("Chưa có thông tin người nhận để tạo thẻ!");
      return;
    }
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      const dataUrl = await generateSecretSantaCard({
        currentUser: data.currentUser,
        giftRecipient: data.giftRecipient,
        santaHints: data.santaHints || [],
      });

      const link = document.createElement("a");
      const safeName = data.currentUser.name.replace(/\s+/g, "_");
      link.download = `The-Nhiem-Vu-Secret-Santa-${safeName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Download card error:", err);
      alert("Không thể tạo ảnh tự động. Bạn vui lòng chụp màn hình nhé!");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* STAGE 1: PERSONALIZED SEALED ENVELOPE (AFTER LOGIN) */}
      {(stage === "envelope" || stage === "unsealing") && (
        <div className="relative min-h-full flex items-center justify-center p-4 py-12">
          {/* Close button in corner */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white/90 hover:text-white transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

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

            {/* Clean Floating Envelope Card */}
            <div className={`max-w-md mx-auto ${stage === "envelope" ? "animate-envelope-float" : ""}`}>
              <div
                onClick={handleBreakSeal}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleBreakSeal()}
                className="group relative mx-auto w-full rounded-[28px] cursor-pointer select-none transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.99]"
              >
                {/* Envelope Pocket Body */}
                <div className="relative h-72 sm:h-80 rounded-[28px] bg-gradient-to-br from-red-600 via-rose-700 to-red-900 border-2 border-amber-200/80 shadow-[0_24px_60px_rgba(0,0,0,0.45)] flex flex-col justify-between p-5 sm:p-6 overflow-hidden">
                  {/* Subtle Diagonal Envelope Flap Seam Decoration */}
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
                          <span className="text-2xl leading-none">💌</span>
                          <span className="text-[10px] font-black tracking-widest uppercase text-amber-100 mt-1">
                            BÓC THƯ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personalized Envelope Bottom Addressee */}
                  <div className="relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-black/35 border border-amber-200/40 backdrop-blur-xs">
                      <span className="text-xs text-amber-100 font-semibold">
                        Gửi riêng: <strong className="text-white font-bold">{data.currentUser.name}</strong> • Phòng {data.currentUser.department}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm text-amber-100/90 mt-6 font-semibold animate-pulse">
              👆 Chạm nhẹ vào con dấu sáp để bóc thư bí mật của bạn nhé ✨
            </p>
          </div>
        </div>
      )}

      {/* STAGE 2: MISSION CARD (REVEALED ASSIGNMENT) */}
      {stage === "card" && (
        <div
          className="min-h-full flex items-center justify-center p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="animate-letter-unfold relative w-full max-w-lg my-4 bg-white border-2 border-red-500 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden text-stone-900">
            {/* Festive Red Header */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 text-center relative shadow-md text-white">
              <button
                onClick={onClose}
                className="absolute top-3.5 right-3.5 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition active:scale-95 cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/20 border border-white/40 rounded-full text-xs font-bold text-white mb-2 shadow-sm">
                <span>✨</span>
                <span>BẢO MẬT • BẮC CỰC GỬI ĐẾN</span>
                <span>✨</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-holiday font-bold text-white tracking-wide drop-shadow">
                THẺ NHIỆM VỤ GIÁNG SINH 🎅
              </h2>

              <p className="text-xs sm:text-sm text-red-100 mt-1">
                Giao phó cho: <strong className="text-white font-black underline decoration-yellow-300">{data.currentUser.name}</strong> ({data.currentUser.department})
              </p>
            </div>

            {/* Holiday Red & Green Tabs */}
            <div className="grid grid-cols-2 bg-stone-100 p-2 gap-2 border-b border-stone-200">
              <button
                onClick={() => setActiveTab("recipient")}
                className={`py-3 px-3 text-xs sm:text-sm font-bold rounded-2xl transition flex items-center justify-center gap-2 border cursor-pointer ${
                  activeTab === "recipient"
                    ? "bg-red-600 text-white border-red-700 shadow-md shadow-red-600/30"
                    : "bg-white text-stone-600 border-stone-200 hover:text-red-700 hover:bg-stone-50"
                }`}
              >
                <Gift className="w-4 h-4 shrink-0" />
                <span>Người Bạn Tặng Quà</span>
              </button>

              <button
                onClick={() => setActiveTab("hints")}
                className={`py-3 px-3 text-xs sm:text-sm font-bold rounded-2xl transition flex items-center justify-center gap-2 border cursor-pointer ${
                  activeTab === "hints"
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/30"
                    : "bg-white text-stone-600 border-stone-200 hover:text-emerald-700 hover:bg-stone-50"
                }`}
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Gợi Ý Về Santa 🕵️</span>
              </button>
            </div>

            {/* Tab Content Box */}
            <div className="p-5 sm:p-6 bg-stone-50/50">
              {activeTab === "recipient" ? (
                /* TAB 1: RECIPIENT PROFILE */
                <div key="recipient" className="space-y-4 animate-fade-up">
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-red-200 shadow-sm relative flex flex-col items-center text-center">
                    {!data.giftRecipient ? (
                      <div className="py-8">
                        <span className="text-4xl block mb-3 animate-bounce">⏳</span>
                        <h3 className="text-xl font-bold text-red-800 mb-2 font-holiday">Đang Chuẩn Bị Ghép Cặp</h3>
                        <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                          {data.message || "Ban tổ chức đang chuẩn bị danh sách ghép cặp. Bạn vui lòng theo dõi đồng hồ đếm ngược và quay lại vào ngày công bố nhé! 🎄"}
                        </p>
                      </div>
                    ) : (
                      <>
                        <span className="inline-block px-3.5 py-1 bg-red-600 text-white font-bold rounded-full text-xs shadow-sm mb-4">
                          🎁 BẠN CHÍNH LÀ SANTA BÍ MẬT CỦA:
                        </span>

                        {/* Circular Avatar with Green & Red Ring */}
                        <div className="relative inline-block mb-3">
                          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-red-500 shadow-md mx-auto bg-stone-100">
                            {data.giftRecipient.avatar ? (
                              <img
                                src={data.giftRecipient.avatar}
                                alt={data.giftRecipient.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-5xl bg-red-600 text-white font-bold font-holiday">
                                {data.giftRecipient.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="absolute -bottom-1 -right-1 text-2xl filter drop-shadow">🎄</span>
                        </div>

                        {/* Name */}
                        <h3 className="text-2xl sm:text-3xl font-holiday font-black text-red-800 tracking-tight">
                          {data.giftRecipient.name}
                        </h3>

                        {/* Department Badge */}
                        <div className="flex items-center justify-center gap-1 mt-1.5">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-sm">
                            <Building className="w-3.5 h-3.5" />
                            Phòng {data.giftRecipient.department}
                          </span>
                        </div>

                        {/* Bio (if any) */}
                        {data.giftRecipient.bio && (
                          <div className="w-full mt-4 p-3.5 bg-stone-50 rounded-2xl text-left border border-stone-200">
                            <span className="text-[11px] font-bold text-stone-500 uppercase block mb-0.5">
                              Đôi nét về đồng nghiệp:
                            </span>
                            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                              {data.giftRecipient.bio}
                            </p>
                          </div>
                        )}

                        {/* Free Gift Budget Guide (< 200k) */}
                        <div className="w-full mt-4 p-4 bg-red-50/70 border border-red-200 rounded-2xl shadow-inner text-left">
                          <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider mb-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>Gợi Ý Chuẩn Bị Quà (Dưới 200.000đ):</span>
                          </div>
                          <p className="text-stone-800 text-xs sm:text-sm leading-relaxed font-medium">
                            Mọi người tự do chọn một món quà bất ngờ, thú vị hoặc thiết thực trong khoảng giá trị <strong className="text-red-700 font-bold">dưới 200.000đ</strong> để dành tặng đồng nghiệp nhé! 🎁
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 text-center flex items-center justify-center gap-2 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Nhớ giữ bí mật danh tính để mang lại sự bất ngờ tại buổi tiệc nhé!</span>
                  </div>
                </div>
              ) : (
                /* TAB 2: HINTS ABOUT SANTA */
                <div key="hints" className="space-y-4 animate-fade-up">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-600 border-4 border-emerald-400 flex items-center justify-center mx-auto shadow-md text-4xl animate-float-slow">
                      🎅
                    </div>
                    <h3 className="text-xl sm:text-2xl font-holiday font-black text-emerald-800 mt-2">
                      Santa Bí Mật Của Bạn
                    </h3>
                    <p className="text-stone-600 text-xs max-w-sm mx-auto mt-0.5 font-sans">
                      Dưới đây là <strong>3 manh mối độc quyền</strong> được bốc ngẫu nhiên để bạn trổ tài thám tử!
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {(data.santaHints || []).map((hint, index) => {
                      const parts = hint.split(":");
                      const title = parts[0]?.trim();
                      const answer = parts.slice(1).join(":")?.trim();

                      return (
                        <div
                          key={index}
                          className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm flex items-start gap-3 hover:border-emerald-400 transition"
                        >
                          <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                              {title}
                            </div>
                            <div className="text-sm font-semibold text-stone-800 mt-0.5 leading-snug">
                              {answer || hint}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 text-center font-medium">
                    🔍 Hãy giữ kín suy đoán của bạn và chờ đến ngày khui quà để xem bạn đoán trúng không nhé!
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="btn-shimmer flex-1 py-3.5 px-5 bg-gradient-to-r from-red-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 hover:-translate-y-0.5 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-5 h-5 text-yellow-300" />
                    <span>Đã Tải Thành Công! 🎉</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>{isDownloading ? "Đang xuất bưu thiếp..." : "Tải Bưu Thiếp Nhiệm Vụ (Chuẩn Đẹp)"}</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="py-3.5 px-6 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-2xl transition active:scale-95 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
