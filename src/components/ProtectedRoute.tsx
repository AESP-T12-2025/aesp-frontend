"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('ADMIN' | 'LEARNER')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }

        if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
            // Redirect to authorized dashboard based on role
            if (user.role === 'ADMIN') router.push('/admin');
            else router.push('/learner');
        }
    }, [user, isLoading, router, allowedRoles]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#007bff]" />
                    <p className="text-gray-500 font-medium">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (!user) return null; // Will redirect via useEffect

    if (allowedRoles && !allowedRoles.includes(user.role)) return null; // Will redirect

    return <>{children}</>;
}
