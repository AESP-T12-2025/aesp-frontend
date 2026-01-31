"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon, Shield, BookOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    // Hide global header on Dashboard pages (they have their own layouts)
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/learner') || pathname?.startsWith('/mentor')) {
        return null;
    }

    return (
        <header className="flex justify-between items-center px-[5%] py-[0.8rem] bg-white border-b border-[#eee] sticky top-0 z-[100] shadow-sm">
            <Link href="/" className="flex flex-col leading-[1.2]">
                <span className="text-[1.8rem] template-text-gradient font-bold text-[#007bff] tracking-[1px]">
                    AESP
                </span>
                <span className="text-[0.7rem] font-[600] text-[#6c757d] uppercase">
                    AI English Speaking Platform
                </span>
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        {/* Role-based Dashboard Link */}
                        {user.role === 'ADMIN' ? (
                            <Link href="/admin/mentors" className="flex items-center text-gray-600 hover:text-[#007bff] px-3 py-2 rounded-lg hover:bg-gray-50 transition-all font-medium">
                                <Shield size={18} className="mr-2" />
                                Admin Dashboard
                            </Link>
                        ) : user.role === 'MENTOR' ? (
                            <Link href="/mentor/profile" className="flex items-center text-gray-600 hover:text-[#007bff] px-3 py-2 rounded-lg hover:bg-gray-50 transition-all font-medium">
                                <UserIcon size={18} className="mr-2" />
                                Mentor Dashboard
                            </Link>
                        ) : (
                            <Link href="/learner/mentors" className="flex items-center text-gray-600 hover:text-[#007bff] px-3 py-2 rounded-lg hover:bg-gray-50 transition-all font-medium">
                                <BookOpen size={18} className="mr-2" />
                                Tìm Mentor
                            </Link>
                        )}

                        {/* Profile & Logout */}
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <Link href="/profile" className="flex items-center gap-2 group cursor-pointer">
                                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-[#007bff] font-bold group-hover:bg-[#007bff] group-hover:text-white transition-all overflow-hidden">
                                    {user.avatar_url ? (
                                        <Image
                                            src={user.avatar_url}
                                            alt={user.full_name || "Avatar"}
                                            width={36}
                                            height={36}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon size={18} />
                                    )}
                                </div>
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-bold text-gray-800">{user.full_name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </Link>

                            <button
                                onClick={logout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-3">
                        <Link href="/login">
                            <button className="px-[1.2rem] py-[0.6rem] rounded-[8px] border border-[#007bff] text-[#007bff] font-bold hover:bg-blue-50 transition-all">
                                Đăng nhập
                            </button>
                        </Link>
                        <Link href="/register">
                            <button className="px-[1.2rem] py-[0.6rem] rounded-[8px] bg-[#007bff] text-white font-bold hover:bg-blue-600 transition-all shadow-md active:scale-95">
                                Đăng ký
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
