"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, MoreVertical, MessageSquare } from 'lucide-react';
import axios from 'axios'; // <--- Dùng trực tiếp axios
import toast from 'react-hot-toast';

// Định nghĩa kiểu dữ liệu cho Partner
interface PartnerInfo {
    id: number;
    full_name: string;
    avatar_url: string | null;
}

export default function PeerRoomPage() {
    const router = useRouter();
    const params = useParams(); 
    const sessionId = params?.id;

    // --- CẤU HÌNH API Ở ĐÂY ---
    const API_URL = 'http://localhost:8000';
    
    // Hàm lấy header kèm Token
    const getAuthHeader = () => {
        const token = localStorage.getItem('token'); // Kiểm tra lại tên key token trong localStorage của bạn
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };

    // State
    const [partner, setPartner] = useState<PartnerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);

    // 1. LẤY THÔNG TIN PHÒNG KHI MỚI VÀO
    useEffect(() => {
        const fetchSessionInfo = async () => {
            if (!sessionId) return;

            try {
                // Gọi trực tiếp axios
                const res = await axios.get(
                    `${API_URL}/peer/sessions/${sessionId}/status`, 
                    getAuthHeader()
                );
                
                // Nếu phòng đã kết thúc
                if (res.data.status === 'COMPLETED') {
                    toast.error("Phiên học đã kết thúc.");
                    router.push('/learner/peer');
                    return;
                }

                // Lưu thông tin đối phương
                if (res.data.partner) {
                    setPartner(res.data.partner);
                }
                setLoading(false);

            } catch (error) {
                console.error("Lỗi lấy thông tin phòng:", error);
                toast.error("Không thể truy cập phòng này.");
                router.push('/learner/peer');
            }
        };

        fetchSessionInfo();
    }, [sessionId, router]);

    // 2. KẾT THÚC CUỘC GỌI
    const handleEndCall = async () => {
        if (!confirm("Bạn có chắc chắn muốn kết thúc buổi học?")) return;

        try {
            await axios.post(
                `${API_URL}/peer/sessions/${sessionId}/end`, 
                {}, // body rỗng
                getAuthHeader()
            );
            
            toast.success("Buổi học đã kết thúc.");
            router.push('/learner/peer'); // Quay về sảnh chờ
        } catch (error) {
            console.error("Lỗi khi kết thúc:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p>Đang kết nối vào phòng...</p>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
                
                {/* Header Info */}
                <div className="flex justify-between items-center mb-4 px-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                            <span className="text-xs font-bold text-gray-400 block">SESSION ID</span>
                            <span className="font-mono text-purple-400 text-lg">#{sessionId}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                            <MessageSquare size={20} />
                        </button>
                        <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Video Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto w-full mb-24">
                    
                    {/* Partner View (Màn hình người kia) */}
                    <div className="bg-gray-800 rounded-3xl relative overflow-hidden border border-gray-700 shadow-2xl flex flex-col items-center justify-center group">
                        {/* Avatar Placeholder */}
                        <div className="text-center transform transition-transform group-hover:scale-105 duration-300">
                            <div className="w-32 h-32 rounded-full border-4 border-purple-500 mx-auto mb-4 overflow-hidden bg-gray-700 flex items-center justify-center shadow-lg">
                                {partner?.avatar_url ? (
                                    <img src={partner.avatar_url} alt="Partner" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-gray-400" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold">{partner?.full_name || "Đang chờ..."}</h2>
                            <p className="text-purple-400 text-sm mt-1 font-medium">Speaking Partner</p>
                        </div>

                        {/* Status Label */}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-white/10">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            {partner?.full_name || "Connecting..."}
                        </div>
                    </div>

                    {/* My View (Màn hình của mình) */}
                    <div className="bg-gray-800 rounded-3xl relative overflow-hidden border border-gray-700 shadow-2xl flex flex-col items-center justify-center">
                        <div className="text-center opacity-80">
                            <div className="w-24 h-24 rounded-full border-2 border-blue-500 mx-auto mb-4 bg-gray-700 flex items-center justify-center">
                                <User size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold">Bạn (Local)</h3>
                        </div>
                        
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs border border-white/10">
                            You
                        </div>
                        
                        {/* Status Icon mic/cam */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            {!micOn && <div className="bg-red-500 text-white p-2 rounded-full shadow-lg"><MicOff size={16}/></div>}
                            {!cameraOn && <div className="bg-red-500 text-white p-2 rounded-full shadow-lg"><VideoOff size={16}/></div>}
                        </div>
                    </div>
                </div>

                {/* Control Bar (Thanh điều khiển) */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-50">
                    <div className="bg-gray-900/90 backdrop-blur-xl px-8 py-4 rounded-full shadow-2xl border border-gray-700 flex items-center gap-6">
                        {/* Toggle Mic */}
                        <button 
                            onClick={() => setMicOn(!micOn)}
                            className={`p-4 rounded-full transition-all duration-200 ${micOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
                        </button>

                        {/* End Call Button */}
                        <button 
                            onClick={handleEndCall}
                            className="p-5 bg-red-600 hover:bg-red-700 rounded-full text-white shadow-lg shadow-red-600/30 hover:scale-110 transition-transform duration-200"
                        >
                            <PhoneOff size={28} fill="currentColor" />
                        </button>

                        {/* Toggle Camera */}
                        <button 
                            onClick={() => setCameraOn(!cameraOn)}
                            className={`p-4 rounded-full transition-all duration-200 ${cameraOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                            {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
                        </button>
                    </div>
                </div>

            </div>
        </ProtectedRoute>
    );
}