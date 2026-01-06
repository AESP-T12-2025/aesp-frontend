"use client";
import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; 

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Mật khẩu không khớp!");
    
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        email: email.trim(),
        full_name: fullName.trim(),
        password: password,
      });

      if (response.status === 201 || response.status === 200) {
        alert("Đăng ký thành công!");
        router.push('/login');
      }
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      alert("Lỗi đăng ký: " + (Array.isArray(detail) ? detail[0]?.msg : detail || "Email đã tồn tại"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
        <h2 className="text-4xl font-black text-[#007bff] text-center mb-10">Tạo Tài Khoản</h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007bff]" size={20} />
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none text-gray-900 font-bold" placeholder="Họ và tên" />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007bff]" size={20} />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none text-gray-900 font-bold" placeholder="Email" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007bff]" size={20} />
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none text-gray-900 font-bold" placeholder="Mật khẩu" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007bff]" size={20} />
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none text-gray-900 font-bold" placeholder="Xác nhận mật khẩu" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-[#007bff] text-white font-black py-4 rounded-2xl hover:bg-blue-600 flex justify-center items-center active:scale-95">
            {isLoading ? <Loader2 className="animate-spin" /> : "ĐĂNG KÝ NGAY"}
          </button>
        </form>
      </div>
    </div>
  );
}