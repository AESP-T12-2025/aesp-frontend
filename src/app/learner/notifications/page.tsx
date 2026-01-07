"use client";
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Bell, Check, Clock, AlertTriangle, Calendar, Star } from 'lucide-react';

export default function NotificationsPage() {
    const notifications = [
        { id: 1, title: 'Báo cáo học tập đã sẵn sàng', desc: 'Xem lại kết quả luyện tập của bạn trong tuần vừa qua.', time: '2 giờ trước', type: 'info', read: false },
        { id: 2, title: 'Nhắc nhở: Lịch học với Coach', desc: 'Bạn có buổi hẹn với Mentor David vào 20:00 tối nay.', time: '5 giờ trước', type: 'alert', read: false },
        { id: 3, title: 'Bạn đã mở khóa huy hiệu mới!', desc: 'Chúc mừng! Bạn đã đạt danh hiệu "Người chăm chỉ" tuần này.', time: '1 ngày trước', type: 'success', read: true },
        { id: 4, title: 'Cập nhật hệ thống', desc: 'Tính năng Phòng luyện nói cộng đồng đã được ra mắt.', time: '2 ngày trước', type: 'info', read: true },
    ];

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
                            <Check size={16} /> Đánh dấu đã đọc
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {notifications.map(notif => (
                            <div key={notif.id} className={`p-6 hover:bg-slate-50 transition-colors flex gap-4 ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.read ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
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
                                        <h3 className={`font-bold text-slate-900 ${!notif.read ? 'text-black' : 'text-slate-600'}`}>{notif.title}</h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.time}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{notif.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 text-center border-t border-slate-100">
                        <button className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Xem thông báo cũ hơn</button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
