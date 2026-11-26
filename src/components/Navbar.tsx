"use client";

import Link from "next/link";

import { LogOut } from "lucide-react";

interface NavbarProps {
  companyName?: string;
  companyLogo?: string;
  currentUser?: {
    name: string;
    department: string;
  } | null;
  onLogout?: () => void;
  onReopenLetter?: () => void;
}

export default function Navbar({
  companyName = "GLOBAL SAFE",
  companyLogo = "/assets/logo.png",
  currentUser,
  onLogout,
  onReopenLetter,
}: NavbarProps) {
  const handleLetterClick = () => {
    if (onReopenLetter) {
      onReopenLetter();
    } else {
      window.dispatchEvent(new Event("reopen-welcome-letter"));
    }
  };
  return (
    <nav className="w-full bg-white/95 border-b border-red-100 backdrop-blur-md sticky top-0 z-40 transition-all shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Company Logo with Festive Santa Hat */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center">
            {/* Small Santa Hat over logo */}
            <span className="absolute -top-3.5 -left-2 text-xl select-none filter drop-shadow-sm group-hover:rotate-12 transition-transform z-10">
              🎅
            </span>

            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="h-10 sm:h-11 max-w-[170px] object-contain py-0.5"
              />
            ) : (
              /* Stylish Company Logo Badge */
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl group-hover:border-red-400 transition">
                <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  {companyName.charAt(0) || "G"}
                </div>
                <span className="font-extrabold text-xs sm:text-sm text-stone-800 tracking-wide uppercase">
                  {companyName}
                </span>
              </div>
            )}
          </div>

          <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Sự Kiện Nội Bộ 🎄
          </span>
        </Link>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {currentUser && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-800 shadow-xs">
              <span className="text-sm">🎅</span>
              <span>{currentUser.name}</span>
            </div>
          )}

          <button
            onClick={handleLetterClick}
            className="flex items-center gap-1.5 py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
            title="Mở lại Thư Mời"
          >
            <span>💌</span>
            <span className="hidden sm:inline">Thư Mời</span>
          </button>

          <Link
            href="/penalty"
            className="flex items-center gap-1.5 py-2 px-3 sm:px-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition shadow-xs active:scale-95"
          >
            <span>🎪</span>
            <span className="hidden sm:inline">Vòng Quay</span>
            <span className="sm:hidden">Quay</span>
          </Link>

          {currentUser && onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 py-2 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 font-medium text-xs rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
              title="Đổi tài khoản / Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden md:inline">Đổi tài khoản</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
