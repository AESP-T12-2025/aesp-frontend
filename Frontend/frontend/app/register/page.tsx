"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        {/* Tiêu đề ép màu xanh #007bff */}
        <h2 className="text-3xl font-extrabold text-center text-[#007bff] mb-10">
          Đăng Ký Tài Khoản
        </h2>
        
        <form className="space-y-6">
          <input 
            type="text" 
            placeholder="Tên người dùng"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#007bff] outline-none text-gray-900 font-bold"
          />
          <input 
            type="text" 
            placeholder="Email \ SĐT"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#007bff] outline-none text-gray-900 font-bold"
          />
          
          {/* Nút đăng ký ép màu nền #007bff */}
          <button 
            type="submit" 
            className="w-full bg-[#007bff] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 transition-all mt-4"
          >
            Đăng ký ngay
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 font-semibold">
          Đã có tài khoản? <Link href="/login" className="text-[#007bff] font-bold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}