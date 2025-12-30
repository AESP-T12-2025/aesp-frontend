import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AESP - AI English Speaking Platform",
  description: "Hệ thống luyện phát âm tiếng Anh với AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* Thanh Điều Hướng (Navbar) */}
        <nav className="flex items-center justify-between px-10 py-4 bg-blue-600 text-white shadow-md">
          <div className="flex gap-8">
            <Link href="/login" className="hover:text-yellow-300 font-bold transition-colors">
              Đăng Nhập
            </Link>
            <Link href="/register" className="hover:text-yellow-300 font-bold transition-colors">
              Đăng Ký
            </Link>
          </div>
          
          <div className="text-right">
            <span className="text-sm italic text-blue-100 uppercase tracking-widest">
              Hệ Thống AESP
            </span>
          </div>
        </nav>

        {/* Nội dung chính của các trang */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        
        {/* Bạn có thể thêm Footer ở đây nếu cần */}
        <footer className="py-6 text-center text-gray-400 text-sm bg-white border-t">
          © 2025 AESP Project - AI English Speaking Platform
        </footer>

      </body>
    </html>
  );
}