"use client";
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') router.push('/admin');
      else if (user.role === 'MENTOR') router.push('/mentor');
      else router.push('/learner');
    }
  }, [user, router]);

  // Handle OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      toast.success("Đăng nhập Google thành công!");
      login(token);
    }

    const error = searchParams.get('error');
    if (error) {
      toast.error("Đăng nhập Google thất bại: " + error);
    }
  }, [searchParams, login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password
      });

      if (response.status === 200) {
        toast.success("Đăng nhập thành công!");
        const token = response.data.access_token;
        await login(token);
      }
    } catch (error) {
      let detail = "Sai tài khoản hoặc mật khẩu";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string | object } } };
        const errorDetail = axiosError.response?.data?.detail;
        if (typeof errorDetail === 'string') {
          detail = errorDetail;
        }
      }
      toast.error(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const response = await api.get('/auth/google/login');
      const authUrl = response.data.auth_url;

      if (authUrl) {
        window.location.href = authUrl;
      } else {
        toast.error("Không thể kết nối với Google");
      }
    } catch (error) {
      toast.error("Lỗi đăng nhập Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[#007bff]">Đăng Nhập</h2>
          <p className="text-gray-400 mt-2 font-bold">Hệ thống học tiếng Anh AESP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007bff]" size={20} />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#007bff] text-gray-900 font-bold"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007bff]" size={20} />
              <input
                type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#007bff] text-gray-900 font-bold"
                placeholder="••••••••"
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#007bff] text-white font-black py-4 rounded-2xl hover:bg-blue-600 flex justify-center items-center active:scale-95 disabled:bg-blue-300">
            {isLoading ? <Loader2 className="animate-spin" /> : "ĐĂNG NHẬP"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-gray-400 text-sm font-bold">HOẶC</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Đăng nhập với Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}

