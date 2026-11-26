"use client";

import { Gift, ShieldCheck, HeartHandshake, AlertTriangle } from "lucide-react";

interface RulesSectionProps {
  customRules?: string;
  className?: string;
}

export default function RulesSection({ customRules, className = "" }: RulesSectionProps) {
  return (
    <section className={`w-full ${className}`}>
      <div className="bg-white/95 border-2 border-emerald-600/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.06)] relative overflow-hidden h-full flex flex-col justify-between">
        
        {/* Decorative corner greenery */}
        <div className="absolute top-0 right-0 text-4xl opacity-40 pointer-events-none p-3">🎄</div>
        <div className="absolute bottom-0 left-0 text-4xl opacity-40 pointer-events-none p-3">🎁</div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 border border-red-300 rounded-2xl text-red-600 shadow-sm">
            <Gift className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-holiday font-bold text-red-800 drop-shadow-sm">
              Thể Lệ Cuộc Chơi Secret Santa 🎅
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-0.5 font-sans">
              Những điều cần ghi nhớ để mùa trao quà ngập tràn tiếng cười và bất ngờ!
            </p>
          </div>
        </div>

        {customRules ? (
          <div className="prose max-w-none text-stone-800 leading-relaxed whitespace-pre-line bg-stone-50 p-6 rounded-2xl border border-stone-200 shadow-inner">
            {customRules}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rule 1 - Red */}
            <div className="group bg-red-50/60 border border-red-200 p-5 rounded-2xl hover:border-red-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  1
                </span>
                <div>
                  <h3 className="font-bold text-red-800 mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Bí Mật Tuyệt Đối
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    Giữ kín danh tính người bạn tặng quà và không hé lộ thân phận Santa của bạn cho đến ngày tiệc Noel công ty!
                  </p>
                </div>
              </div>
            </div>

            {/* Rule 2 - Green */}
            <div className="group bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl hover:border-emerald-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  2
                </span>
                <div>
                  <h3 className="font-bold text-emerald-800 mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                    <Gift className="w-4 h-4 text-red-600" /> Ngân Sách Quà Tặng
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    Giá trị món quà trong khoảng <strong>dưới 200.000đ</strong>. Mọi người tự do sáng tạo, chọn món quà bất ngờ và ý nghĩa dành tặng người nhận nhé!
                  </p>
                </div>
              </div>
            </div>

            {/* Rule 3 - Green */}
            <div className="group bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl hover:border-emerald-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  3
                </span>
                <div>
                  <h3 className="font-bold text-emerald-800 mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                    <HeartHandshake className="w-4 h-4 text-emerald-600" /> Khác Phòng Ban
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    Thuật toán đã tự động sắp xếp để bạn tặng quà cho đồng nghiệp <strong>khác bộ phận</strong> nhằm thắt chặt tình đoàn kết công ty!
                  </p>
                </div>
              </div>
            </div>

            {/* Rule 4 - Red */}
            <div className="group bg-red-50/60 border border-red-200 p-5 rounded-2xl hover:border-red-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  4
                </span>
                <div>
                  <h3 className="font-bold text-red-800 mb-1 flex items-center gap-1.5 text-sm sm:text-base">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Thăm Hình Phạt
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    Ai quên chuẩn bị quà hoặc đoán sai danh tính Santa của mình tại buổi tiệc sẽ phải quay <strong>Vòng Quay Hình Phạt</strong>! 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-stone-500 text-center italic">
          * Nội dung chi tiết có thể được Ban Tổ Chức (Linh, Bảo, Nhi) cập nhật thêm trong phần Cài đặt.
        </div>
      </div>
    </section>
  );
}
