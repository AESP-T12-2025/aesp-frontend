"use client";
import React, { useState } from 'react';
import { mentorService } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Plus, Calendar, Clock, Info } from 'lucide-react';

export default function MentorAvailabilityPage() {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await mentorService.createSlot({
                start_time: new Date(startTime).toISOString(),
                end_time: new Date(endTime).toISOString()
            });
            toast.success("Tạo lịch rảnh thành công!");
            setStartTime('');
            setEndTime('');
        } catch (error) {
            toast.error("Lỗi tạo lịch rảnh");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff]">Quản Lý Lịch Rảnh</h1>
                <p className="text-gray-600 mt-2 font-medium">Đăng ký khung giờ rảnh để học viên có thể đặt lịch</p>
            </div>

            {/* Create Slot Form */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-50 rounded-2xl">
                        <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Tạo Lịch Rảnh Mới</h2>
                        <p className="text-sm text-gray-500 font-medium">Chọn thời gian bạn có thể giảng dạy</p>
                    </div>
                </div>

                <form onSubmit={handleCreateSlot} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Thời gian bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Thời gian kết thúc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={e => setEndTime(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                                required
                            />
                        </div>
                    </div>

                    <button
                        disabled={isCreating}
                        type="submit"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        {isCreating ? 'Đang tạo...' : 'Tạo Lịch Rảnh'}
                    </button>
                </form>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-3xl p-6">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                        <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-black text-blue-900 mb-2">💡 Lưu ý</h3>
                        <ul className="text-sm text-blue-800 space-y-1 font-medium">
                            <li>• Chọn thời gian phù hợp với lịch trình của bạn</li>
                            <li>• Học viên sẽ thấy và đặt lịch dựa trên khung giờ bạn tạo</li>
                            <li>• Sau khi học viên đặt, slot sẽ chuyển sang trạng thái "Đã đặt"</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
