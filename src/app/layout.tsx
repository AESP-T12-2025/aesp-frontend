import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast"; // Bonus: Add Toast for notifications

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    template: '%s | AESP',
    default: 'AESP - Nền tảng luyện nói tiếng Anh số 1 Việt Nam',
  },
  description: "Luyện nói tiếng Anh tự tin với AI & Mentor. Phản hồi tức thì, lộ trình cá nhân hóa.",
  keywords: ["tiếng anh", "luyện nói", "AI", "mentor", "english speaking", "ielts", "toeic"],
  openGraph: {
    title: 'AESP - AI English Speaking Platform',
    description: 'Nền tảng luyện nói tiếng Anh số 1 Việt Nam với công nghệ AI tiên tiến.',
    siteName: 'AESP',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
