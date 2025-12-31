"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, User, Lock } from 'lucide-react'; 

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        {/* Tiêu đề dùng màu xanh #007bff */}
        <h2 className="text-3xl font-extrabold text-center text-[#007bff] mb-10 tracking-tight">
          Đăng Nhập Hệ Thống
        </h2>
        
        <form className="space-y-8">
          
          {/* Cụm Email */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 ml-1">
              <User size={18} className="text-[#007bff]" />
              <label className="text-sm font-bold text-gray-700">Email \ SĐT của bạn</label>
            </div>
            <input 
              type="text" 
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#007bff] outline-none transition-all text-gray-900 font-bold bg-white placeholder:text-gray-400 placeholder:font-medium"
              placeholder="Nhập email hoặc số điện thoại"
            />
          </div>

          {/* Cụm Mật khẩu */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 ml-1">
              <Lock size={18} className="text-[#007bff]" />
              <label className="text-sm font-bold text-gray-700">Mật khẩu</label>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#007bff] outline-none transition-all text-gray-900 font-bold bg-white placeholder:text-gray-400 placeholder:font-medium"
                placeholder="••••••••"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#007bff] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {/* Hàng Ghi nhớ & Quên mật khẩu */}
          <div className="flex items-center justify-between text-sm font-bold px-1 pt-2">
            <label className="flex items-center text-gray-600 cursor-pointer group">
              <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-[#007bff] focus:ring-[#007bff]" />
              <span className="group-hover:text-[#007bff] transition-colors">Ghi nhớ tôi</span>
            </label>
            <Link href="/forgot_password"  className="text-[#007bff] hover:opacity-80 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Nút đăng nhập dùng màu nền #007bff */}
          <button 
            type="submit" 
            className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-bold py-4 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1 active:scale-95 mt-4"
          >
            Đăng Nhập 
          </button>
        </form>

        <p className="mt-10 text-center text-gray-600 font-semibold">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-[#007bff] font-bold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}