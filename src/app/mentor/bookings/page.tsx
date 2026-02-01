"use client";
import React, { useEffect, useState } from 'react';
import { mentorService } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Loader2, Clock, User, Calendar as CalendarIcon, CheckCircle, XCircle, Video, Link as LinkIcon, Send, PlayCircle } from 'lucide-react';

interface BookingData {
    booking_id: number;
    slot_id: number;
    learner_id: number;
    status: string;
    meeting_link?: string | null;
    created_at: string;
    slot?: { start_time: string; end_time: string };
    learner?: { full_name: string; email: string };
    assessment?: { score: number; feedback: string } | null;
}

export default function MentorBookingsPage() {
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [meetingLinks, setMeetingLinks] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await mentorService.getMyBookings();
            setBookings(data as unknown as BookingData[]);
        } catch (error) {
            toast.error("Lỗi tải danh sách booking");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async (bookingId: number) => {
        const link = meetingLinks[bookingId];
        if (!link || link.length < 10) {
            toast.error("Vui lòng nhập link meeting hợp lệ (Google Meet/Zoom)");
            return;
        }

        setProcessingId(bookingId);
        try {
            await mentorService.confirmBooking(bookingId, link);
            toast.success("Đã xác nhận booking và gửi link cho học viên!");
            loadBookings();
        } catch (error) {
            toast.error("Lỗi xác nhận booking");
        } finally {
            setProcessingId(null);
        }
    };

    const handleComplete = async (bookingId: number) => {
        setProcessingId(bookingId);
        try {
            await mentorService.completeBooking(bookingId);
            toast.success("Đã hoàn thành buổi học!");
            loadBookings();
        } catch (error) {
            toast.error("Lỗi đánh dấu hoàn thành");
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> CHỜ XÁC NHẬN
                </span>;
            case 'CONFIRMED':
                return <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> ĐÃ XÁC NHẬN
                </span>;
            case 'CANCELLED':
                return <span className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> ĐÃ HỦY
                </span>;
            case 'COMPLETED':
                return <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> HOÀN THÀNH
                </span>;
            default:
                return <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{status}</span>;
        }
    };

    const formatDateTime = (isoString: string | undefined) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <div className="max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff]">Quản Lý Booking</h1>
                <p className="text-gray-600 mt-2 font-medium">Xác nhận booking và gửi link meeting cho học viên</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#007bff]" />
                </div>
            ) : bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.booking_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Header */}
                            <div className="p-5 border-b border-gray-50">
                                <div className="flex items-start justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                                            {booking.learner?.full_name?.charAt(0) || 'L'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {booking.learner?.full_name || `Học viên #${booking.learner_id}`}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    {formatDateTime(booking.slot?.start_time)}
                                                </span>
                                                {booking.learner?.email && (
                                                    <span className="text-gray-400">• {booking.learner.email}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>
                            </div>

                            {/* Body - Actions based on status */}
                            <div className="p-5 bg-gray-50/50">
                                {/* PENDING: Show meeting link input + confirm button */}
                                {booking.status === 'PENDING' && (
                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-gray-700">
                                            <Video className="inline w-4 h-4 mr-1" />
                                            Nhập Link Meeting (Google Meet / Zoom)
                                        </label>
                                        <div className="flex gap-3">
                                            <div className="flex-1 relative">
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="url"
                                                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                                    value={meetingLinks[booking.booking_id] || ''}
                                                    onChange={(e) => setMeetingLinks({
                                                        ...meetingLinks,
                                                        [booking.booking_id]: e.target.value
                                                    })}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleConfirm(booking.booking_id)}
                                                disabled={processingId === booking.booking_id}
                                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                                            >
                                                {processingId === booking.booking_id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                                Xác Nhận & Gửi
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            * Sau khi xác nhận, link meeting sẽ được gửi cho học viên qua hệ thống.
                                        </p>
                                    </div>
                                )}

                                {/* CONFIRMED: Show meeting link + Complete button */}
                                {booking.status === 'CONFIRMED' && (
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">Link Meeting:</p>
                                            <a
                                                href={booking.meeting_link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                                            >
                                                <Video className="w-4 h-4" />
                                                {booking.meeting_link || 'Chưa có link'}
                                            </a>
                                        </div>
                                        <button
                                            onClick={() => handleComplete(booking.booking_id)}
                                            disabled={processingId === booking.booking_id}
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
                                        >
                                            {processingId === booking.booking_id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <PlayCircle className="w-4 h-4" />
                                            )}
                                            Buổi Học Đã Kết Thúc
                                        </button>
                                    </div>
                                )}

                                {/* COMPLETED: Show assessment status */}
                                {booking.status === 'COMPLETED' && (
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        {booking.assessment ? (
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <span className="text-green-700 font-medium">
                                                    Đã đánh giá - Điểm: {booking.assessment.score}/10
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-yellow-500" />
                                                <span className="text-yellow-700 font-medium">Chưa đánh giá</span>
                                            </div>
                                        )}
                                        <a
                                            href="/mentor/assessments"
                                            className="px-5 py-2.5 bg-[#007bff] text-white rounded-xl font-bold hover:bg-blue-600 transition"
                                        >
                                            {booking.assessment ? 'Xem Đánh Giá' : 'Tạo Đánh Giá'}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-gray-900 mb-2">Chưa có booking nào</h3>
                    <p className="text-gray-500 font-medium">Khi học viên đặt lịch, thông tin sẽ hiển thị tại đây</p>
                </div>
            )}
        </div>
    );
}
