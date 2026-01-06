"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Loader2, BookOpen, LayoutDashboard, Trophy } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in (Double check, though ProtectedRoute should handle this if wrapped)
  // Since ProfilePage is public-ish, we handle it here or rely on AuthContext
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-[#007bff]" size={48} /></div>;

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <div className="w-64 bg-white border-r p-6 hidden md:flex flex-col">
        <div className="text-2xl font-black text-[#007bff] mb-10">AESP.</div>
        <nav className="space-y-2 flex-1">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 text-[#007bff] rounded-xl font-bold cursor-pointer"><LayoutDashboard size={20} /> <span>Tổng quan</span></div>
          <div onClick={() => router.push('/topics')} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl font-bold cursor-pointer"><BookOpen size={20} /> <span>Chủ đề học</span></div>
        </nav>
        <button onClick={logout} className="flex items-center space-x-3 p-3 text-red-400 font-bold mt-auto"><LogOut size={20} /> <span>Đăng xuất</span></button>
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

          {/* Transaction History Section */}
          <TransactionHistory />
        </div>
      </main>
    </div>
  );
}

// Sub-component for Transaction History
function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error("Failed to fetch transactions", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline text-[#007bff]" /></div>;

  return (
    <div className="bg-white rounded-[40px] shadow-sm border p-8 mt-8">
      <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" />
        Lịch sử giao dịch (Mock)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b">
              <th className="py-3 font-black">Mã GD</th>
              <th className="py-3 font-black">Gói cước</th>
              <th className="py-3 font-black">Số tiền</th>
              <th className="py-3 font-black">Trạng thái</th>
              <th className="py-3 font-black">Ngày</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-gray-600">
            {transactions.map((tx) => (
              <tr key={tx.transaction_id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-4">{tx.transaction_id}</td>
                <td className="py-4 text-[#007bff]">{tx.package}</td>
                <td className="py-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.amount)}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${tx.status === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-4 text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <p className="text-center py-4 text-gray-400">Chưa có giao dịch nào.</p>}
      </div>
    </div>
  );
}