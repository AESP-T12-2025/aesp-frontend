"use client";
import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Users, Mic, Wifi, Loader2, PhoneOff, User } from 'lucide-react';
import { peerService } from '@/services/peerService';
import toast from 'react-hot-toast';

function PeerRoomContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    
    const [status, setStatus] = useState<'loading' | 'active' | 'ended'>('loading');
    const [sessionData, setSessionData] = useState<any>(null);
    const [callTime, setCallTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isPartnerMuted, setIsPartnerMuted] = useState(false);

    // WebRTC Refs
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

    // Audio context for visualization (optional enhancement)
    const [localVolume, setLocalVolume] = useState(0);
    const [remoteVolume, setRemoteVolume] = useState(0);

    // 1. Initial Session Check
    useEffect(() => {
        if (!sessionId) {
            router.push('/learner/community');
            return;
        }

        const fetchSession = async () => {
            try {
                const data = await peerService.checkStatus(parseInt(sessionId));
                setSessionData(data);
                if (data.status === 'MATCHED') {
                    if (status === 'loading') startCallFlow();
                } else if (data.status === 'COMPLETED') {
                    cleanup();
                    setStatus('ended');
                    router.push('/learner/community');
                }
            } catch (error) {
                console.error("Failed to fetch session", error);
                router.push('/learner/community');
            }
        };

        fetchSession();
        const interval = setInterval(fetchSession, 5000);
        return () => clearInterval(interval);
    }, [sessionId, router, status]);

    // 2. Start WebRTC Flow
    const startCallFlow = async () => {
        if (localStreamRef.current) return; // Already started
        
        console.log("Starting WebRTC Call Flow...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            console.log("Microphone access granted");
            
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = window.location.hostname;
            const wsUrl = `${protocol}//${host}:8000/peer/ws/${sessionId}`;
            console.log("Connecting to Signaling:", wsUrl);
            
            const socket = new WebSocket(wsUrl);
            socketRef.current = socket;

            socket.onopen = () => {
                console.log("WebSocket Connected!");
                initializePeerConnection();
            };

            socket.onmessage = async (event) => {
                const message = JSON.parse(event.data);
                console.log("Signaling Message Received:", message.type);
                handleSignalingMessage(message);
            };

            socket.onclose = () => console.log("WebSocket Disconnected");
            socket.onerror = (err) => console.error("WebSocket Error:", err);

            setStatus('active');
            toast.success("Đã kết nối âm thanh!");

        } catch (error) {
            console.error("WebRTC Setup Error:", error);
            toast.error("Không thể truy cập Micro. Vui lòng cấp quyền.");
        }
    };

    const iceQueue = useRef<any[]>([]);

    const initializePeerConnection = () => {
        console.log("Initializing RTCPeerConnection...");
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        peerConnectionRef.current = pc;

        localStreamRef.current?.getTracks().forEach((track: MediaStreamTrack) => {
            console.log("Adding local track:", track.kind);
            pc.addTrack(track, localStreamRef.current!);
        });

        pc.ontrack = (event) => {
            console.log("Remote track received:", event.streams[0]);
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0];
                remoteAudioRef.current.play().catch(e => console.error("Audio Play Error:", e));
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Local ICE Candidate generated");
                socketRef.current?.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
            }
        };

        pc.onconnectionstatechange = () => {
             console.log("Connection State Changed:", pc.connectionState);
             if (pc.connectionState === 'connected') toast.success("Đã thông luồng âm thanh!");
        };

        pc.oniceconnectionstatechange = () => console.log("ICE Connection State:", pc.iceConnectionState);

        // Initiator Logic: User1 always starts the offer
        if (sessionData && sessionData.user1_id === sessionData.user_id) {
             console.log("I am User1 (Initiator). Creating offer...");
             setTimeout(createOffer, 1000); // Small delay to ensure partner socket is ready
        } else {
             console.log("I am User2 (Receiver). Waiting for offer...");
        }
    };

    const createOffer = async () => {
        const pc = peerConnectionRef.current;
        if (!pc) return;
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            console.log("Local Offer Created and Set");
            socketRef.current?.send(JSON.stringify({ type: 'offer', offer }));
        } catch (e) {
            console.error("Failed to create offer:", e);
        }
    };

    const handleSignalingMessage = async (message: any) => {
        const pc = peerConnectionRef.current;
        if (!pc) return;

        try {
            if (message.type === 'offer') {
                console.log("Handling Offer...");
                await pc.setRemoteDescription(new RTCSessionDescription(message.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                console.log("Local Answer Created and Set");
                socketRef.current?.send(JSON.stringify({ type: 'answer', answer }));
                
                // Process queued ICE candidates
                while (iceQueue.current.length > 0) {
                    const cand = iceQueue.current.shift();
                    await pc.addIceCandidate(new RTCIceCandidate(cand));
                }
            } else if (message.type === 'answer') {
                console.log("Handling Answer...");
                await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
                
                // Process queued ICE candidates
                while (iceQueue.current.length > 0) {
                    const cand = iceQueue.current.shift();
                    await pc.addIceCandidate(new RTCIceCandidate(cand));
                }
            } else if (message.type === 'candidate') {
                if (pc.remoteDescription && pc.remoteDescription.type) {
                    await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
                } else {
                    console.log("ICE Candidate received before RemoteDescription. Queueing...");
                    iceQueue.current.push(message.candidate);
                }
            } else if (message.type === 'mute') {
                setIsPartnerMuted(message.muted);
            }
        } catch (e) {
            console.error("Signaling Processing Error:", e);
        }
    };

    // 3. Controls
    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
            console.log("Mute toggled:", !audioTrack.enabled);
            socketRef.current?.send(JSON.stringify({ type: 'mute', muted: !audioTrack.enabled }));
        }
    };

    const handleEndCall = async () => {
        if (!sessionId) return;
        cleanup();
        console.log("Ending call and session...");
        try {
            await peerService.endSession(parseInt(sessionId));
            toast.success("Bạn đã rời khỏi phòng");
            router.push('/learner/community');
        } catch (error) {
            router.push('/learner/community');
        }
    };

    const cleanup = () => {
        console.log("Cleaning up WebRTC resources...");
        localStreamRef.current?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        peerConnectionRef.current?.close();
        socketRef.current?.close();
        localStreamRef.current = null;
        peerConnectionRef.current = null;
        socketRef.current = null;
    };

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'active') {
            interval = setInterval(() => {
                setCallTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Loader2 className="animate-spin text-indigo-600" size={64} />
                <h3 className="text-xl font-black text-slate-800">Đang chuẩn bị phòng học...</h3>
            </div>
        );
    }

    const partner = sessionData?.partner;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <audio ref={remoteAudioRef} autoPlay />
            
            {/* Header / Info */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[24px] shadow-lg border border-slate-100 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <Mic size={24} />
                    </div>
                    <div>
                        <h2 className="font-black text-slate-900 text-lg">Phòng luyện thoại WebRTC</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                             <Wifi size={14} className="text-green-500" /> Kết nối trực tiếp
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 text-white px-6 py-2 rounded-2xl font-black text-xl tracking-wider">
                    {formatTime(callTime)}
                </div>
            </div>

            {/* Video/Voice Cards Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Me Card */}
                <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100 flex flex-col items-center justify-between min-h-[400px] relative overflow-hidden group">
                    <div className="absolute top-6 left-6 bg-slate-100 px-4 py-1.5 rounded-full text-xs font-black text-slate-500 uppercase">Bạn</div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                        <div className={`w-36 h-36 rounded-full flex items-center justify-center border-[6px] transition-all ${isMuted ? 'bg-red-50 border-red-100 text-red-300' : 'bg-slate-50 border-slate-50 text-slate-200 shadow-inner'}`}>
                            <User size={80} />
                        </div>
                        <div className="text-center">
                            <span className={`${isMuted ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'} px-3 py-1 rounded-lg text-xs font-black uppercase mb-2 inline-block transition-colors`}>
                                {isMuted ? 'Đã tắt Micro' : 'Đang phát âm thanh'}
                            </span>
                            {!isMuted && (
                                <div className="flex gap-1.5 h-8 items-center justify-center">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ height: `${20 + Math.random() * 40}%`, animationDelay: `${i * 0.1}s` }}></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Partner Card */}
                <div className={`rounded-[40px] p-10 shadow-2xl flex flex-col items-center justify-between min-h-[400px] relative overflow-hidden transition-all ${isPartnerMuted ? 'bg-slate-600' : 'bg-indigo-600'}`}>
                    <div className="absolute top-6 left-6 bg-black/20 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase">Bạn học</div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                        <div className={`w-36 h-36 rounded-full flex items-center justify-center border-[6px] overflow-hidden shadow-2xl transition-all ${isPartnerMuted ? 'bg-slate-500 border-slate-400' : 'bg-indigo-500 border-indigo-400'}`}>
                            {partner?.avatar_url ? (
                                <img src={partner.avatar_url} alt={partner.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={80} />
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="font-black text-3xl text-white mb-2">{partner?.full_name || "Đang chờ..."}</h3>
                            <span className="bg-black/20 text-indigo-100 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">{isPartnerMuted ? 'Bạn học đã tắt mic' : (partner?.role || "Learner")}</span>
                        </div>
                        {!isPartnerMuted && status === 'active' && (
                            <div className="flex gap-1.5 h-8 items-center justify-center">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="w-1.5 bg-white rounded-full animate-pulse" style={{ height: `${30 + Math.random() * 50}%`, animationDelay: `${i * 0.15}s` }}></div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 flex items-center justify-center gap-8 max-w-md mx-auto">
                <button 
                    onClick={toggleMute}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all border group ${isMuted ? 'bg-red-500 text-white border-red-600 shadow-red-200 shadow-lg' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'}`}
                >
                    <Mic size={28} className={isMuted ? '' : 'group-active:scale-95'} />
                </button>
                <button 
                    onClick={handleEndCall}
                    className="w-20 h-20 bg-red-500 text-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-red-200 hover:bg-red-600 hover:scale-110 active:scale-95 transition-all"
                >
                    <PhoneOff size={32} />
                </button>
                <button className="w-16 h-16 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100 group">
                    <Users size={28} className="group-active:scale-95" />
                </button>
            </div>

            <div className="text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Công nghệ WebRTC P2P Direct Connection</p>
            </div>
        </div>
    );
}

export default function PeerPracticePage() {
    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                        <Loader2 className="animate-spin text-indigo-600" size={48} />
                        <p className="text-slate-500 font-bold">Đang tải phòng học...</p>
                    </div>
                }>
                    <PeerRoomContent />
                </Suspense>
            </div>
        </ProtectedRoute>
    );
}
