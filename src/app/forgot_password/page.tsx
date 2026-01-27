"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react'; // Nhập icon để giao diện sinh động hơn

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset API call
    // await authService.requestPasswordReset(email);
    setIsSent(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-gray-900">

        {/* Nút quay lại */}
        <Link href="/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Quay lại đăng nhập
        </Link>

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Quên mật khẩu?</h2>

        {!isSent ? (
          <>
            <p className="text-gray-600 text-center mb-8 font-medium">
              Đừng lo lắng! Hãy nhập email của bạn, chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email của bạn</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-bold bg-white placeholder:text-gray-400"
                    placeholder="example@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1 active:scale-95"
              >
                Gửi yêu cầu khôi phục
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 font-semibold">
              Yêu cầu đã được gửi! Vui lòng kiểm tra hộp thư đến của bạn.
            </div>
            <p className="text-gray-600 mb-8 font-medium">
              Nếu không thấy email, hãy kiểm tra trong thư mục rác (Spam).
            </p>
            <Link href="/login" className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors">
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}