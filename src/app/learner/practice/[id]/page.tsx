"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mic, Volume2, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import { scenarioService, Scenario } from '@/services/scenarioService';
import toast from 'react-hot-toast';

export default function PracticeRoomPage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [vocab, setVocab] = useState<{ phrase: string, translation: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!scenarioId) return;
      try {
        const scenarioData = await scenarioService.getById(scenarioId);
        setScenario(scenarioData);

        try {
          const vocabData = await scenarioService.getVocab(scenarioId);
          const vocabObj = vocabData.vocabulary || {};

          let vocabList: { phrase: string, translation: string }[] = [];

          if (Array.isArray(vocabObj)) {
            vocabList = vocabObj.map((v: string) => ({ phrase: v, translation: '' }));
          } else {
            vocabList = Object.entries(vocabObj).map(([start, end]) => ({
              phrase: start,
              translation: String(end)
            }));
          }

          setVocab(vocabList);
        } catch (e) {
          console.warn("No vocab found");
        }
      } catch (error) {
        console.error("Failed to load scenario", error);
        toast.error("Không thể tải bài tập");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [scenarioId]);

  const toggleRecording = () => {
    if (!isRecording) {
      toast("Đang lắng nghe... (Demo Tuần 1)", { icon: '🎙️' });
    } else {
      toast.success("Đã ghi âm! (AI sẽ xử lý ở Tuần 2)");
    }
    setIsRecording(!isRecording);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-[#007bff] text-4xl">●</div></div>;

  if (!scenario) return <div className="p-8 text-center text-red-500">Bài học không tồn tại</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <Link href={`/learner/topics/${scenario.topic_id}`} className="text-gray-400 hover:text-white flex items-center transition">
          <ArrowLeft size={20} className="mr-2" /> Thoát
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-bold">{scenario.title}</h1>
          <span className="text-xs text-[#007bff] font-bold uppercase tracking-widest">{scenario.difficulty_level}</span>
        </div>
        <div className="w-20"></div> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left: Learning Materials */}
        <div className="w-full md:w-1/3 bg-gray-800 p-6 border-r border-gray-700 overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-gray-400 font-bold uppercase text-xs mb-4 tracking-wider">Hướng dẫn</h3>
            <p className="text-gray-300 leading-relaxed">
              {scenario.description || "Hãy luyện tập các mẫu câu bên dưới. Bấm nút Micro để bắt đầu nói."}
            </p>
          </div>

          <div>
            <h3 className="text-gray-400 font-bold uppercase text-xs mb-4 tracking-wider flex items-center">
              <Zap size={14} className="mr-2 text-yellow-400" /> Từ vựng gợi ý
            </h3>
            <div className="space-y-3">
              {vocab.length > 0 ? vocab.map((item, idx) => (
                <div key={idx} className="bg-gray-700/50 p-4 rounded-xl border border-gray-700 flex items-center justify-between group cursor-pointer hover:bg-gray-700 transition">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-white">{item.phrase}</span>
                    {item.translation && <span className="text-sm text-gray-400">{item.translation}</span>}
                  </div>
                  <button className="text-gray-500 hover:text-[#007bff] transition">
                    <Volume2 size={20} />
                  </button>
                </div>
              )) : (
                <p className="text-gray-500 italic">Chưa có từ vựng cho bài này.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right/Center: Interactive Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#007bff]/20 rounded-full blur-[100px] pointer-events-none"></div>

          {/* AI Avatar / Visualization */}
          <div className="mb-12 relative">
            <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center shadow-[0_0_50px_rgba(0,123,255,0.5)] transition-all duration-500 ${isRecording ? 'border-red-500 shadow-red-500/50 scale-110' : 'border-[#007bff] bg-gray-800'}`}>
              {isRecording ? (
                <div className="space-y-1 flex gap-1 h-8 items-end">
                  <div className="w-2 bg-red-500 animate-[bounce_1s_infinite] h-4"></div>
                  <div className="w-2 bg-red-500 animate-[bounce_1.2s_infinite] h-8"></div>
                  <div className="w-2 bg-red-500 animate-[bounce_0.8s_infinite] h-6"></div>
                </div>
              ) : (
                <Mic size={64} className="text-[#007bff]" />
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {isRecording ? "Đang lắng nghe bạn..." : "Bấm Micro để bắt đầu nói"}
          </h2>

          {/* Microphone Button */}
          <button
            onClick={toggleRecording}
            className={`p-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl ${isRecording
              ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
              : 'bg-[#007bff] hover:bg-blue-600 shadow-blue-500/30'
              }`}
          >
            <Mic size={40} className="text-white" />
          </button>

          <p className="mt-8 text-gray-400 text-sm">
            AI sẽ chấm điểm phát âm và ngữ pháp của bạn.
          </p>
        </div>
      </main>
    </div>
  );
}