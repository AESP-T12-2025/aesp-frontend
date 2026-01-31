"use client";
import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('LEARNER'); // Default to Learner
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Mật khẩu không khớp!");

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        email: email.trim(),
        full_name: fullName.trim(),
        password: password,
        role: role, // Send selected role
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        router.push('/login');
      }
    } catch (error) {
      // Type guard for axios error
      let status: number | undefined;
      let detail: string | object | undefined;

      if (error && typeof error === 'object') {
        if ('response' in error) {
          const axiosError = error as { response?: { status?: number; data?: { detail?: string | Array<{ msg: string }> } }; message?: string };
          status = axiosError.response?.status;
          detail = axiosError.response?.data?.detail;
        }
        if ('message' in error) {
          const errorWithMessage = error as { message: string };
          if (!detail) detail = errorWithMessage.message;
        }
      }

      let message = "Đăng ký thất bại";
      if (detail) {
        message = Array.isArray(detail) ? detail[0]?.msg : String(detail);
      } else if (status === 500) {
        message = "Lỗi Server (500). Vui lòng thử lại sau.";
      } else if (status === 409) {
        message = "Email đã tồn tại";
      }

      toast.error(`Lỗi (${status || '?'}) : ${message}`);
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

          {/* Role Selection - Security: Admin accounts can only be created via backend script */}
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007bff]" size={20} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none text-gray-900 font-bold appearance-none cursor-pointer"
            >
              <option value="LEARNER">Học viên (Learner)</option>
              <option value="MENTOR">Giảng viên (Mentor)</option>
              {/* ADMIN role removed for security - Admin accounts must be created via backend script */}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007bff]" size={20} />
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none text-gray-900 font-bold" placeholder="Mật khẩu" />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
