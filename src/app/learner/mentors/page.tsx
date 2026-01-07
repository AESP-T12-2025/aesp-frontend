"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mentorService, MentorProfile, AvailabilitySlot } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Loader2, Search, Calendar, Clock, CheckCircle } from 'lucide-react';

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
            // Filter only verified mentors (Backend ideally should do this or we do it here)
            setMentors(data.filter(m => m.verification_status === 'VERIFIED'));
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
            setSelectedMentor(null); // Close modal
        } catch (error) {
            toast.error("Lỗi đặt lịch (Có thể slot đã được đặt)");
        }
    };

    // Filter Logic
    const filteredMentors = mentors.filter(m =>
        m.skills?.toLowerCase().includes(filterSkill.toLowerCase()) ||
        m.full_name.toLowerCase().includes(filterSkill.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-black text-[#007bff] mb-6">Tìm Kiếm Mentor</h1>

                    {/* Filter */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
                        <Search className="text-gray-400" />
                        <input
                            value={filterSkill}
                            onChange={(e) => setFilterSkill(e.target.value)}
                            className="flex-1 outline-none text-lg font-medium"
                            placeholder="Tìm theo tên hoặc kỹ năng (Ví dụ: UX, IELTS...)"
                        />
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMentors.map(mentor => (
                                <div key={mentor.mentor_id} className="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                            {mentor.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{mentor.full_name}</h3>
                                            <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full w-fit">VERIFIED</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{mentor.bio || "Chưa có giới thiệu"}</p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {mentor.skills?.split(',').map((skill, i) => (
                                            <span key={i} className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleSelectMentor(mentor)}
                                        className="w-full bg-[#007bff] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors"
                                    >
                                        Đặt Lịch Ngay
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Booking Modal */}
                {selectedMentor && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-8 rounded-[40px] max-w-lg w-full animation-fade-in">
                            <h2 className="text-2xl font-black mb-2">Lịch rảnh của {selectedMentor.full_name}</h2>
                            <p className="text-gray-500 mb-6">Chọn khung giờ bạn muốn học:</p>

                            <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
                                {isLoadingSlots ? <Loader2 className="animate-spin mx-auto" /> : (
                                    slots.length > 0 ? slots.map(slot => (
                                        <button
                                            key={slot.slot_id}
                                            onClick={() => handleBooking(slot.slot_id!)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Clock className="text-gray-400 group-hover:text-blue-500" />
                                                <span className="font-bold text-gray-700">
                                                    {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {' - '}
                                                    {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-green-600">TRỐNG</span>
                                        </button>
                                    )) : <p className="text-center text-gray-400 font-medium">Hiện chưa có lịch rảnh nào.</p>
                                )}
                            </div>

                            <button onClick={() => setSelectedMentor(null)} className="w-full py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
