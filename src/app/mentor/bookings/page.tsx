"use client";
import React, { useEffect, useState } from 'react';
import { mentorService, Booking } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Loader2, Clock, User, Calendar as CalendarIcon, CheckCircle, XCircle, Check, X } from 'lucide-react';

export default function MentorBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await mentorService.getMentorBookings();
            setBookings(data);
        } catch (error) {
            toast.error("Lỗi tải danh sách booking");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async (bookingId: number) => {
        setProcessingId(bookingId);
        try {
            await mentorService.acceptBooking(bookingId);
            toast.success("Đã chấp nhận booking!");
            loadBookings();
        } catch (error) {
            toast.error("Lỗi chấp nhận booking");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (bookingId: number) => {
        const reason = prompt("Lý do từ chối (tùy chọn):");
        setProcessingId(bookingId);
        try {
            await mentorService.rejectBooking(bookingId, reason || undefined);
            toast.success("Đã từ chối booking");
            loadBookings();
        } catch (error) {
            toast.error("Lỗi từ chối booking");
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <span className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-full flex items-center gap-1">
                    <Clock className="w-4 h-4" /> CHỜ DUYỆT
                </span>;
            case 'CONFIRMED':
                return <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-full flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> ĐÃ XÁC NHẬN
                </span>;
            case 'CANCELLED':
                return <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-full flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> ĐÃ HỦY
                </span>;
            case 'COMPLETED':
                return <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-bold rounded-full flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> HOÀN THÀNH
                </span>;
            default:
                return <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-full">{status}</span>;
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
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <CalendarIcon className="w-6 h-6 text-[#007bff]" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg">Booking #{booking.booking_id}</h3>
                                        {booking.learner_name && (
                                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 font-medium">
                                                <User className="w-4 h-4" />
                                                <span>{booking.learner_name}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-medium">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>Ngày: {booking.date} - {booking.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {getStatusBadge(booking.status)}

                                    {booking.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAccept(booking.booking_id)}
                                                disabled={processingId === booking.booking_id}
                                                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                                            >
                                                {processingId === booking.booking_id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4" />
                                                )}
                                                Chấp nhận
                                            </button>
                                            <button
                                                onClick={() => handleReject(booking.booking_id)}
                                                disabled={processingId === booking.booking_id}
                                                className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition disabled:opacity-50"
                                            >
                                                <X className="w-4 h-4" />
                                                Từ chối
                                            </button>
                                        </div>
                                    )}
                                </div>
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
