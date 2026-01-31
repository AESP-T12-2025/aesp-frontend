"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Bell, Check, Clock, AlertTriangle, Calendar, Star } from 'lucide-react';
import { notificationService, Notification } from '@/services/notificationService';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        loadNotifications(isMounted);
        return () => { isMounted = false; };
    }, []);

    const loadNotifications = async (isMounted = true) => {
        try {
            const data = await notificationService.getAll();
            if (isMounted) setNotifications(data);
        } catch (error) {
            // Gracefully handle 401 - user will be logged out by AuthContext anyway
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status: number } };
                if (axiosError.response?.status !== 401) {
                    console.error("Failed to load notifications:", error);
                }
            } else {
                console.error("Failed to load notifications:", error);
            }
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    const handleMarkRead = async (id: number) => {
        try {
            await notificationService.markRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            toast.error("Lỗi cập nhật");
        }
    };

    // Helper to format time relative (Simple version)
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
                <div className="max-w-2xl mx-auto bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-red-50 text-red-500 rounded-xl"><Bell size={24} /></div>
                            Thông báo
                        </h1>
                        <button className="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                            <Check size={16} /> Làm mới
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {loading ? <div className="p-8 text-center text-gray-400">Đang tải...</div> :
                            notifications.length === 0 ? <div className="p-8 text-center text-gray-400">Không có thông báo nào.</div> :
                                notifications.map(notif => (
                                    <div key={notif.id}
                                        onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                                        className={`p-6 hover:bg-slate-50 transition-colors flex gap-4 cursor-pointer ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.is_read ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 
                                    ${notif.type === 'alert' ? 'bg-orange-100 text-orange-600' :
                                                notif.type === 'success' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'}`}>
                                            {notif.type === 'alert' ? <Calendar size={20} /> :
                                                notif.type === 'success' ? <Star size={20} /> :
                                                    <Clock size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-bold text-slate-900 ${!notif.is_read ? 'text-black' : 'text-slate-600'}`}>{notif.title}</h3>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatTime(notif.created_at)}</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed">{notif.message}</p>
                                        </div>
                                    </div>
                                ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
