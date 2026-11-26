import type { Metadata } from "next";
import { Nunito, Plus_Jakarta_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Secret Santa 2026 🎅 GLOBAL SAFE",
  description: "Sự kiện trao đổi quà bí mật Secret Santa và vòng quay hình phạt Giáng sinh - GLOBAL SAFE",
  icons: {
    icon: "/assets/logo-square.webp",
    apple: "/assets/logo-square.webp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${nunito.variable} ${jakarta.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
