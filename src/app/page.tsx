import Link from "next/link";
import SnowEffect from "@/components/SnowEffect";
import FairyLights from "@/components/FairyLights";
import Navbar from "@/components/Navbar";
import Countdown from "@/components/Countdown";
import RulesSection from "@/components/RulesSection";
import UnboxForm from "@/components/UnboxForm";
import WelcomeLetter from "@/components/WelcomeLetter";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getSettings } from "@/lib/db";

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      {/* Interactive Welcome Letter Overlay */}
      <WelcomeLetter
        companyName={settings.companyName || "GLOBAL SAFE"}
        companyLogo={settings.companyLogo || "/assets/logo.png"}
      />

      {/* Clean Static Winter Backdrop (Bright, Elegant, Non-Distracting) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#fafaf9]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/[0.04] rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-3xl animate-pulse" style={{ animationDuration: "7s" }} />
      </div>

      {/* Gentle Snowfall Background */}
      <SnowEffect />

      <div>
        {/* Top Navigation Bar with Company Logo */}
        <Navbar
          companyName={settings.companyName || "GLOBAL SAFE"}
          companyLogo={settings.companyLogo || "/assets/logo.png"}
        />

        {/* Twinkling Christmas Lights Garland directly under Navbar */}
        <FairyLights />

        {/* Subtle Flying Santa Sleigh across upper sky */}
        <div className="w-full overflow-hidden pointer-events-none relative h-0 z-10" aria-hidden="true">
          <div className="animate-sleigh inline-flex items-center gap-1 text-xl sm:text-2xl opacity-75 select-none whitespace-nowrap pt-2">
            <span>✨</span>
            <span>🛷🎅</span>
            <span>🦌🦌</span>
          </div>
        </div>

        {/* Main Hero Header - Bright, Cheerful, Clean */}
        <header className="pt-8 sm:pt-12 pb-4 text-center px-4 relative z-20 max-w-4xl mx-auto">
          {/* Gentle Floating Holiday Accents in Outer Margins (Desktop) */}
          <span className="hidden lg:block absolute left-2 top-14 text-3xl opacity-70 animate-float-slow select-none pointer-events-none" aria-hidden="true">
            🎄
          </span>
          <span className="hidden lg:block absolute right-2 top-20 text-3xl opacity-70 animate-float-reverse select-none pointer-events-none" aria-hidden="true">
            🔔
          </span>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600 border-2 border-emerald-600 rounded-full text-xs sm:text-sm font-bold text-white shadow-md mb-6 animate-fade-up"
            style={{ animationDelay: "50ms" }}
          >
            <span className="text-base">🎄</span>
            <span>SECRET SANTA • GLOBAL SAFE 2026</span>
            <span className="text-base">🎅</span>
          </div>

          <h1
            className="text-3xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-emerald-700 animate-gradient-flow drop-shadow-xs leading-tight sm:leading-tight mb-4 animate-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            MÙA NOEL NÀY, BẠN LÀ SANTA CỦA AI?
          </h1>

          <p
            className="text-stone-700 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6 font-medium animate-fade-up"
            style={{ animationDelay: "220ms" }}
          >
            Mở phong thư bí mật từ Bắc Cực, trao gửi món quà yêu thương và cùng thử tài thám tử giải mã danh tính Santa của bạn! ✨🎁
          </p>

          {/* Countdown to 27/11 */}
          <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Countdown
              targetDate={settings.revealDate || "2026-11-27T00:00:00"}
              label="Đếm ngược đến giờ bóc Santa (27/11)"
            />
          </div>
        </header>

        {/* Unbox Form Section */}
        <section className="relative z-20">
          <RevealOnScroll delay={80}>
            <UnboxForm />
          </RevealOnScroll>
        </section>

        {/* Rules Section */}
        <section className="relative z-20">
          <RevealOnScroll delay={100}>
            <RulesSection customRules={settings.rules} />
          </RevealOnScroll>
        </section>

        {/* Penalty Mini-Game Banner (Nhi's feature) */}
        <section className="max-w-4xl mx-auto px-4 my-8 relative z-20">
          <RevealOnScroll delay={100}>
            <div className="bg-white/92 border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md hover:border-red-500/60 transition-colors">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-full font-bold inline-block">
                  🎪 Tiệc Noel Công Ty
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-red-800 drop-shadow-xs">
                  Vòng Quay Thăm Hình Phạt 🎡
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md">
                  Khu vực quay số trừng phạt cho ai quên chuẩn bị quà hoặc đoán sai Santa trong buổi tiệc (do Nhi phụ trách)!
                </p>
              </div>

              <Link
                href="/penalty"
                className="btn-shimmer py-4 px-7 bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-600/25 transition-all hover:-translate-y-0.5 whitespace-nowrap active:scale-95 border border-red-300"
              >
                Mở Vòng Quay 🎯
              </Link>
            </div>
          </RevealOnScroll>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-stone-200/60 bg-white/90 py-8 px-4 text-center text-xs text-stone-600 mt-12 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <img src="/assets/logo.png" alt="GLOBAL SAFE" className="h-6 w-auto object-contain" />
            <span>•</span>
            <span>Secret Santa © 2026</span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <Link href="/penalty" className="hover:text-red-600 transition">
              Vòng quay hình phạt
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
