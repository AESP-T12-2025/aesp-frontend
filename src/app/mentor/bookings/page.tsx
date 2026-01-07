"use client";
import React, { useEffect, useState } from 'react';
import { mentorService } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Loader2, Clock, User, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';

interface Booking {
    booking_id: number;
    slot_id: number;
    learner_id: number;
    created_at: string;
    slot?: {
        start_time: string;
        end_time: string;
        status: string;
    };
}

export default function MentorBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await mentorService.getMyBookings();
            setBookings(data);
        } catch (error) {
            toast.error("Lỗi tải danh sách booking");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff]">Lịch Đã Được Đặt</h1>
                <p className="text-gray-600 mt-2 font-medium">Quản lý các buổi học đã được học viên đăng ký</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#007bff]" />
                </div>
            ) : bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.booking_id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <CalendarIcon className="w-6 h-6 text-[#007bff]" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg">Booking #{booking.booking_id}</h3>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 font-medium">
                                            <User className="w-4 h-4" />
                                            <span>Learner ID: {booking.learner_id}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-medium">
                                            <Clock className="w-4 h-4" />
                                            <span>Đặt lúc: {new Date(booking.created_at).toLocaleString('vi-VN')}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    ĐÃ ĐẶT
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-gray-900 mb-2">Chưa có lịch nào được đặt</h3>
                    <p className="text-gray-500 font-medium">Khi học viên đặt lịch, thông tin sẽ hiển thị tại đây</p>
                </div>
            )}
        </div>
    );
}
