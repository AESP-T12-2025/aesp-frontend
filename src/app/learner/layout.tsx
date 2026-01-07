'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Use Auth context

  const menuItems = [
    { name: 'Dashboard', href: '/learner', icon: '📊' },
    { name: 'Lộ trình', href: '/learner/path', icon: '🗺️' },
    { name: 'Thư viện', href: '/learner/topics', icon: '📚' },
    { name: 'Cộng đồng', href: '/learner/community', icon: '🌍' },
    { name: 'Tìm Mentor', href: '/learner/mentors', icon: '👨‍🏫' },
    { name: 'Thành tựu', href: '/learner/achievements', icon: '🏆' },
    { name: 'Báo cáo', href: '/learner/reports', icon: '📈' },
    { name: 'Nâng cấp', href: '/learner/packages', icon: '💎' },
    { name: 'Hồ sơ', href: '/profile', icon: '👤' },
  ];

  return (
    <ProtectedRoute allowedRoles={['LEARNER']}>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* 1. SIDEBAR - Cố định bên trái */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col z-20 shadow-sm">
          <div className="p-8">
            <h2 className="text-2xl font-black text-indigo-600 tracking-tight">AESP</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Learner Portal</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Nút đăng xuất ở dưới cùng Sidebar */}
          <div className="p-4 border-t border-gray-50">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 font-medium transition-colors"
            >
              <span>🚪</span> Đăng xuất
            </button>
          </div>
        </aside>

        {/* PHẦN BÊN PHẢI (Chứa Header, Content và Footer) */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">

          {/* 2. HEADER - Tích hợp Search và Profile xịn */}
          <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-8 flex-1">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                <span className="text-gray-400">Page /</span>
                <span className="font-bold text-gray-800 capitalize">
                  {pathname.split('/').pop() || 'Dashboard'}
                </span>
              </div>

              {/* THANH TÌM KIẾM */}
              <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-full w-full max-w-md border border-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <span className="text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm kịch bản luyện tập..."
                  className="bg-transparent border-none outline-none ml-2 text-sm w-full text-gray-600 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/learner/notifications" className="relative text-gray-400 hover:text-indigo-600 transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </Link>

              <Link href="/profile" className="flex items-center gap-3 pl-6 border-l border-gray-200 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-none">{user?.full_name}</p>
                  <p className="text-[10px] text-green-500 font-bold mt-1 uppercase">Online</p>
                </div>
                <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100 overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avt" className="w-full h-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0).toUpperCase() || "L"
                  )}
                </div>
              </Link>
            </div>
          </header>

          {/* 3. NỘI DUNG CHÍNH */}
          <main className="flex-1 p-8">
            <div className="max-w-screen-2xl mx-auto">
              {children}
            </div>
          </main>

          {/* 4. FOOTER */}
          <footer className="bg-white py-10 border-t border-gray-100 mt-auto">
            <div className="max-w-screen-xl mx-auto px-4 text-center">
              <p className="text-gray-500 text-sm mb-4 font-medium">
                © 2025 AI English Speaking Platform
              </p>
              <div className="flex justify-center gap-8">
                {['Giới thiệu', 'Điều khoản', 'Chính sách', 'Hỗ trợ'].map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors tracking-wide uppercase"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
