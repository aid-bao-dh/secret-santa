"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowLeft, RefreshCw, AlertTriangle, Plus, Trash2 } from "lucide-react";
import SnowEffect from "@/components/SnowEffect";
import FairyLights from "@/components/FairyLights";

const DEFAULT_PENALTIES = [
  "Hát một bài hát Giáng sinh bất kỳ trước công ty 🎤",
  "Uống 1 hơi hết ly nước ngọt/trà sữa 🥤",
  "Tạo dáng Ông già Noel chụp 3 kiểu ảnh đáng yêu 🎅",
  "Kể một bí mật hài hước hoặc tật xấu của bản thân 🤫",
  "Nhảy vũ điệu Tuần lộc 30 giây cùng một đồng nghiệp 🦌",
  "Làm theo 1 yêu cầu bất kỳ từ người nhận quà của bạn ✨",
  "Mời người nhận quà 1 ly cà phê/trà sữa ngày mai ☕",
  "Chúc Giáng sinh bằng 3 thứ tiếng khác nhau 🌍"
];

const COLORS = [
  "#dc2626", "#16a34a", "#e11d48", "#059669",
  "#b91c1c", "#15803d", "#f59e0b", "#0d9488"
];

export default function PenaltyPage() {
  const [penalties, setPenalties] = useState<string[]>(DEFAULT_PENALTIES);
  const [newPenalty, setNewPenalty] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentAngleRef = useRef(0);

  // Load penalties from backend settings if available
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.penalties?.length > 0) {
          setPenalties(data.settings.penalties);
        }
      })
      .catch(() => {});
  }, []);

  // Draw the wheel on canvas
  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 12;
    const cx = width / 2;
    const cy = height / 2;
    const n = penalties.length;
    const arc = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, width, height);

    // Outer ring with Red & Green accents
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, 2 * Math.PI);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 6;
    ctx.stroke();

    for (let i = 0; i < n; i++) {
      const sliceAngle = angle + i * arc;
      ctx.beginPath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, sliceAngle, sliceAngle + arc);
      ctx.lineTo(cx, cy);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Text inside slice
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sliceAngle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px system-ui";
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 3;

      const text = penalties[i];
      const truncated = text.length > 24 ? text.slice(0, 22) + "..." : text;
      ctx.fillText(truncated, radius - 20, 5);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#16a34a";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center icon text
    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 18px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("🎁", cx, cy + 6);
  }, [penalties]);

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [drawWheel]);

  const spin = () => {
    if (isSpinning || penalties.length === 0) return;
    setIsSpinning(true);
    setSelectedPenalty(null);

    const fullSpins = 5 + Math.floor(Math.random() * 5); // 5-10 turns
    const extraDegrees = Math.random() * 360;
    const totalRotation = fullSpins * 360 + extraDegrees;
    const totalRad = (totalRotation * Math.PI) / 180;

    const startAngle = currentAngleRef.current;
    const targetAngle = startAngle + totalRad;
    const duration = 4500; // ms
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startAngle + (targetAngle - startAngle) * easeOut;
      currentAngleRef.current = current;
      drawWheel(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const normalized = ((current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const arc = (2 * Math.PI) / penalties.length;
        // Pointer is fixed at angle 0 (right side); find which slice spans angle 0
        const pointerAngle = (2 * Math.PI - normalized) % (2 * Math.PI);
        const winningIndex = Math.floor(pointerAngle / arc) % penalties.length;
        const winner = penalties[winningIndex];
        setSelectedPenalty(winner);

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#dc2626", "#16a34a", "#ffffff", "#f59e0b"],
        });
      }
    }

    requestAnimationFrame(animate);
  };

  const addPenalty = () => {
    if (!newPenalty.trim()) return;
    setPenalties([...penalties, newPenalty.trim()]);
    setNewPenalty("");
  };

  const removePenalty = (index: number) => {
    if (penalties.length <= 2) {
      alert("Cần tối thiểu 2 hình phạt để quay vòng!");
      return;
    }
    setPenalties(penalties.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen text-stone-900 py-6 px-4 relative overflow-hidden bg-[#fafaf9]">
      {/* Clean Static Winter Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-3xl" />
      </div>

      <SnowEffect />
      <FairyLights />

      <div className="max-w-4xl mx-auto relative z-20">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-red-600 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Trang chủ
            </Link>
            <span className="text-stone-300">|</span>
            <img src="/assets/logo.png" alt="GLOBAL SAFE" className="h-6 w-auto object-contain" />
          </div>
          <span className="text-xs px-3.5 py-1 bg-red-100 border border-red-300 text-red-700 rounded-full font-bold shadow-sm">
            🎪 Góc Thăm Hình Phạt - Nhi
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-holiday font-black text-red-700 drop-shadow-sm">
            VÒNG QUAY HÌNH PHẠT 🎡
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-lg mx-auto font-sans">
            Dành cho đồng nghiệp quên chuẩn bị quà hoặc đoán sai danh tính Santa trong buổi tiệc Giáng sinh!
          </p>
        </div>

        {/* Wheel & Controls Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Wheel Column */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative p-2 bg-white rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.1)] border-4 border-emerald-600">
              {/* Pointer indicator */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-30 filter drop-shadow-md">
                <div className="w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[26px] border-r-red-600" />
              </div>

              <canvas
                ref={canvasRef}
                width={380}
                height={380}
                className="max-w-full h-auto rounded-full"
              />
            </div>

            <button
              onClick={spin}
              disabled={isSpinning || penalties.length < 2}
              className="mt-6 py-4 px-10 bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-600/30 active:scale-95 transition disabled:opacity-50 border border-white"
            >
              {isSpinning ? "Đang quay số..." : "QUAY THĂM NGAY 🎯"}
            </button>
          </div>

          {/* Penalty List & Add Column */}
          <div className="lg:col-span-5 bg-white border-2 border-emerald-600/30 rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" /> Danh Sách Thăm Phạt ({penalties.length})
              </h3>
              <button
                onClick={() => setPenalties(DEFAULT_PENALTIES)}
                className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 font-medium"
                title="Đặt lại mặc định"
              >
                <RefreshCw className="w-3 h-3" /> Mặc định
              </button>
            </div>

            {/* Input to add new penalty */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Thêm hình phạt mới..."
                value={newPenalty}
                onChange={(e) => setNewPenalty(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPenalty()}
                className="flex-1 py-2.5 px-3.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-red-500 font-medium"
              />
              <button
                onClick={addPenalty}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {penalties.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <span className="text-stone-800 font-medium flex-1 truncate">{item}</span>
                  <button
                    onClick={() => removePenalty(idx)}
                    className="text-stone-400 hover:text-red-600 p-1 transition"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Announcement Winner */}
        {selectedPenalty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border-3 border-red-500 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl animate-float">
              <div className="text-5xl mb-3">🎯</div>
              <h2 className="text-2xl font-holiday font-black text-red-700 mb-2">
                KẾT QUẢ THĂM PHẠT!
              </h2>
              <p className="text-xs text-stone-500 uppercase tracking-widest mb-4 font-bold">
                Hình phạt được chọn ngẫu nhiên
              </p>

              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-base sm:text-lg font-bold text-red-900 mb-6 leading-relaxed">
                {selectedPenalty}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedPenalty(null);
                    spin();
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-md"
                >
                  Quay Lại Lượt Khác 🎡
                </button>
                <button
                  onClick={() => setSelectedPenalty(null)}
                  className="py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
