"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Gift,
  Download,
  HelpCircle,
  Heart,
  Building,
  X,
  ShieldCheck,
  Check,
} from "lucide-react";
import { generateSecretSantaCard } from "@/lib/generateCardImage";

interface RevealModalProps {
  data: {
    currentUser: {
      name: string;
      email: string;
      department: string;
    };
    giftRecipient: {
      name: string;
      department: string;
      avatar: string;
      bio?: string;
      wishlist?: string;
    };
    santaHints: string[];
    wasViewedBefore?: boolean;
  };
  onClose: () => void;
}

export default function RevealModal({ data, onClose }: RevealModalProps) {
  const [activeTab, setActiveTab] = useState<"recipient" | "hints">("recipient");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Trigger festive confetti explosion
  useState(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#dc2626", "#16a34a", "#ffffff", "#f59e0b", "#f43f5e"],
      });
    } catch (e) {
      // ignore SSR
    }
  });

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      const dataUrl = await generateSecretSantaCard({
        currentUser: data.currentUser,
        giftRecipient: data.giftRecipient,
        santaHints: data.santaHints,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="animate-pop-in relative w-full max-w-lg my-6 bg-white border-2 border-red-500 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden text-stone-900">
        
        {/* Festive Red Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 text-center relative shadow-md text-white">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition active:scale-95"
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
            className={`py-3 px-3 text-xs sm:text-sm font-bold rounded-2xl transition flex items-center justify-center gap-2 border ${
              activeTab === "recipient"
                ? "bg-red-600 text-white border-red-700 shadow-md shadow-red-600/30"
                : "bg-white text-stone-600 border-stone-200 hover:text-red-700 hover:bg-stone-50"
            }`}
          >
            <Gift className="w-4 h-4 text-white" />
            <span>Người Bạn Tặng Quà</span>
          </button>

          <button
            onClick={() => setActiveTab("hints")}
            className={`py-3 px-3 text-xs sm:text-sm font-bold rounded-2xl transition flex items-center justify-center gap-2 border ${
              activeTab === "hints"
                ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/30"
                : "bg-white text-stone-600 border-stone-200 hover:text-emerald-700 hover:bg-stone-50"
            }`}
          >
            <HelpCircle className="w-4 h-4 text-white" />
            <span>Gợi Ý Về Santa 🕵️</span>
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="p-5 sm:p-6 bg-stone-50/50">
          {activeTab === "recipient" ? (
            /* TAB 1: RECIPIENT PROFILE */
            <div key="recipient" className="space-y-4 animate-fade-up">
              <div className="bg-white rounded-3xl p-6 border-2 border-red-200 shadow-sm relative text-center">
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

                {/* Wishlist Box */}
                <div className="mt-5 p-4 bg-red-50/70 border border-red-200 rounded-2xl shadow-inner text-left">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider mb-1.5">
                    <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                    <span>Món Quà Mong Muốn (Wishlist):</span>
                  </div>
                  <p className="text-stone-800 text-sm italic leading-relaxed font-serif">
                    &ldquo;{data.giftRecipient.wishlist || "Chưa cập nhật sở thích cụ thể, hãy chọn một món quà ấm áp và bất ngờ nhé!"}&rdquo;
                  </p>
                </div>

                {/* Bio (if any) */}
                {data.giftRecipient.bio && (
                  <div className="mt-3 p-3 bg-stone-50 rounded-xl text-left border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 uppercase block mb-0.5">
                      Đôi nét về đồng nghiệp:
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {data.giftRecipient.bio}
                    </p>
                  </div>
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
                {data.santaHints.map((hint, index) => {
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
            className="py-3.5 px-6 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-2xl transition active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
