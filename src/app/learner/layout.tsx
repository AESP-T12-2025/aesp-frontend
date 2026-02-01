'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Use Auth context
  const [unreadCount, setUnreadCount] = React.useState(0);

  interface Notification {
    id: number;
    message: string;
    is_read: boolean;
  }

  React.useEffect(() => {
    let isMounted = true;

    // Poll for notifications or fetch once
    const fetchNotis = async () => {
      try {
        const { notificationService } = await import('@/services/notificationService');
        const notis = await notificationService.getAll() as Notification[];
        if (isMounted) {
          setUnreadCount(notis.filter((n) => !n.is_read).length);
        }
      } catch (error) {
        // Type guard for axios error
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status: number } };
          if (axiosError.response?.status === 401) {
            // Silently ignore 401s here
            return;
          }
        }
        console.error("Error fetching notifications:", error);
      }
    };
    if (user) fetchNotis();

    return () => {
      isMounted = false;
    };
  }, [user, pathname]); // Re-fetch on nav change is a simple way to keep fresh

  const menuItems = [
    { name: 'Dashboard', href: '/learner', icon: '📊' },
    { name: 'Thư viện', href: '/learner/topics', icon: '📚' },
    { name: 'Luyện tập', href: '/learner/scenarios', icon: '🎤' },
    { name: 'Peer Practice', href: '/learner/peer', icon: '👥' },
    { name: 'Tìm Mentor', href: '/learner/mentors', icon: '👨‍🏫' },
    { name: 'Lịch học', href: '/learner/mentors/my-bookings', icon: '📅' },
    { name: 'Từ Mentor', href: '/learner/shared-topics', icon: '🎁' },
    { name: 'Thử thách', href: '/learner/challenges', icon: '🎯' },
    { name: 'Thành tựu', href: '/learner/achievements', icon: '🏆' },
    { name: 'Báo cáo', href: '/learner/reports', icon: '📈' },
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
          <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      if (target.value.trim()) {
                        window.location.href = `/learner/scenarios?q=${encodeURIComponent(target.value)}`;
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/learner/notifications" className="relative text-gray-400 hover:text-indigo-600 transition-colors">
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
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
                <Link href="/policies/terms" className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors tracking-wide uppercase">
                  Điều khoản
                </Link>
                <Link href="/policies/privacy" className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors tracking-wide uppercase">
                  Bảo mật
                </Link>
                <Link href="/policies/refund" className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors tracking-wide uppercase">
                  Hoàn tiền
                </Link>
                <Link href="/learner/support" className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors tracking-wide uppercase">
                  Hỗ trợ
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
