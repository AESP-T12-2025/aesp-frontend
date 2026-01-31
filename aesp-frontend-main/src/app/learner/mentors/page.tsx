"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mentorService, MentorProfile, AvailabilitySlot } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Loader2, Search, Clock, CheckCircle, ExternalLink, Calendar as CalendarIcon, Star } from 'lucide-react';

export default function LearnerMentorsPage() {
    const [mentors, setMentors] = useState<MentorProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterSkill, setFilterSkill] = useState('');

    // Booking State
    const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    useEffect(() => {
        loadMentors();
    }, []);

    const loadMentors = async () => {
        try {
            const data = await mentorService.getAllMentors();
            setMentors(data.filter((m: MentorProfile) => m.verification_status === 'VERIFIED'));
        } catch (error) {
            toast.error("Lỗi tải danh sách Mentor");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectMentor = async (mentor: MentorProfile) => {
        setSelectedMentor(mentor);
        setIsLoadingSlots(true);
        try {
            const data = await mentorService.getSlotsByMentor(mentor.mentor_id!);
            setSlots(data);
        } catch (error) {
            toast.error("Lỗi tải lịch rảnh");
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const handleBooking = async (slotId: number) => {
        try {
            await mentorService.createBooking(slotId);
            toast.success("Đặt lịch thành công!");
            setSelectedMentor(null);
        } catch (error) {
            toast.error("Lỗi đặt lịch (Có thể slot đã được đặt)");
        }
    };

    const filteredMentors = mentors.filter(m =>
        m.skills?.toLowerCase().includes(filterSkill.toLowerCase()) ||
        m.full_name.toLowerCase().includes(filterSkill.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                                <Star size={14} /> Expert Network
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2">Tìm Mentor phù hợp</h1>
                            <p className="text-gray-500 font-medium">Kết nối với các chuyên gia hàng đầu để cải thiện kỹ năng nói.</p>
                        </div>

                        {/* Search Bar */}
                        <div className="bg-white p-2 pl-4 rounded-full border border-gray-100 shadow-sm flex items-center w-full md:w-96 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                            <Search className="text-gray-400" size={20} />
                            <input
                                className="flex-1 px-3 py-2 outline-none text-gray-700 font-medium placeholder-gray-400"
                                placeholder="Tìm theo tên, kỹ năng (IELTS...)"
                                value={filterSkill}
                                onChange={(e) => setFilterSkill(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#007bff]" size={40} /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMentors.map(mentor => (
                                <div key={mentor.mentor_id} className="bg-white p-6 rounded-[32px] border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-[#007bff] font-black text-2xl shadow-inner">
                                            {mentor.full_name.charAt(0)}
                                        </div>
                                        <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold flex items-center gap-1 border border-green-100">
                                            <CheckCircle size={12} /> VERIFIED
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-xl text-gray-900 mb-1">{mentor.full_name}</h3>
                                    <p className="text-sm text-gray-400 font-medium mb-4">Senior Mentor</p>

                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-50 h-24">
                                        {mentor.bio || "Chuyên gia chưa cập nhật giới thiệu, nhưng đã được xác thực kỹ năng."}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                                        {mentor.skills?.split(',').slice(0, 3).map((skill, i) => (
                                            <span key={i} className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                        {(mentor.skills?.split(',').length || 0) > 3 && (
                                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1.5 rounded-lg">+{(mentor.skills?.split(',').length || 0) - 3}</span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleSelectMentor(mentor)}
                                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-[#007bff] transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                                    >
                                        <CalendarIcon size={18} /> Đặt lịch hẹn
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Booking Modal */}
                {selectedMentor && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-8 rounded-[40px] max-w-lg w-full shadow-2xl animate-fade-in-up">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Lịch của Mentor</h2>
                                    <p className="text-gray-500 font-medium text-sm">Chọn khung giờ phù hợp với bạn</p>
                                </div>
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                                    {selectedMentor.full_name.charAt(0)}
                                </div>
                            </div>

                            <div className="space-y-3 max-h-80 overflow-y-auto mb-8 pr-2 custom-scrollbar">
                                {isLoadingSlots ? (
                                    <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-gray-300" /></div>
                                ) : (
                                    slots.length > 0 ? slots.map(slot => (
                                        <button
                                            key={slot.slot_id}
                                            onClick={() => handleBooking(slot.slot_id!)}
                                            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#007bff] hover:shadow-lg hover:shadow-blue-50 transition-all group group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-50 text-[#007bff] rounded-xl flex items-center justify-center group-hover:bg-[#007bff] group-hover:text-white transition-colors">
                                                    <Clock size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <span className="font-bold text-gray-900 block text-lg">
                                                        {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-400 uppercase">
                                                        {new Date(slot.start_time).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-black uppercase tracking-wider">Available</span>
                                        </button>
                                    )) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                            <Clock className="mx-auto text-gray-300 mb-2" size={32} />
                                            <p className="text-gray-400 font-bold">Hiện chưa có lịch rảnh nào.</p>
                                        </div>
                                    )
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedMentor(null)}
                                className="w-full py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
