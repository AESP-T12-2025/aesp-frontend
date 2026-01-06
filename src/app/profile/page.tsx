"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; 
import { User, LogOut, Loader2, BookOpen, LayoutDashboard, Trophy } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-[#007bff]" size={48} /></div>;

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <div className="w-64 bg-white border-r p-6 hidden md:flex flex-col">
        <div className="text-2xl font-black text-[#007bff] mb-10">AESP.</div>
        <nav className="space-y-2 flex-1">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 text-[#007bff] rounded-xl font-bold cursor-pointer"><LayoutDashboard size={20} /> <span>Tổng quan</span></div>
          <div onClick={() => router.push('/topics')} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl font-bold cursor-pointer"><BookOpen size={20} /> <span>Chủ đề học</span></div>
        </nav>
        <button onClick={handleLogout} className="flex items-center space-x-3 p-3 text-red-400 font-bold mt-auto"><LogOut size={20} /> <span>Đăng xuất</span></button>
      </div>

      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[40px] shadow-sm border overflow-hidden">
            <div className="h-32 bg-[#007bff]"></div>
            <div className="px-10 pb-10 relative">
              <div className="relative -top-12 flex items-end space-x-6">
                <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center border-4 border-white"><User size={40} className="text-[#007bff]" /></div>
                <div className="pb-2">
                  <h2 className="text-3xl font-black">{user?.full_name}</h2>
                  <p className="text-gray-400 font-bold">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-6 bg-gray-50 rounded-3xl border">
                  <p className="text-xs font-black text-gray-400 uppercase mb-1">Chức vụ</p>
                  <p className="font-bold text-gray-900">{user?.role || "Học viên"}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border">
                  <p className="text-xs font-black text-gray-400 uppercase mb-1">Điểm tích lũy</p>
                  <p className="font-bold text-orange-500">1,250 XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}