import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AESP - AI English Speaking Platform",
  description: "Improve your English speaking skills with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} antialiased`}>
        {/* Header */}
        <header className="flex justify-between items-center px-[5%] py-[0.8rem] bg-white border-b border-[#eee] sticky top-0 z-[100]">
          <Link href="/" className="flex flex-col leading-[1.2]">
            <span className="text-[1.8rem] font-bold text-[#007bff] tracking-[1px]">
              AESP
            </span>
            <span className="text-[0.7rem] font-[600] text-[#6c757d] uppercase">
              AI English Speaking Platform
            </span>
          </Link>

          <div className="flex gap-3">
            <Link href="/login">
              <button className="px-[1.2rem] py-[0.6rem] rounded-[8px] border border-[#007bff] text-[#007bff] font-bold hover:bg-blue-50 transition-all">
                Đăng nhập
              </button>
            </Link>
            <Link href="/register">
              <button className="px-[1.2rem] py-[0.6rem] rounded-[8px] bg-[#007bff] text-white font-bold hover:bg-blue-600 transition-all">
                Đăng ký
              </button>
            </Link>
          </div>
        </header>

        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
