"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mic, Volume2, Award, Zap, MoreVertical, Settings, Sparkles, StopCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { scenarioService, Scenario } from '@/services/scenarioService';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function PracticeRoomPage() {
  const params = useParams();
  const scenarioId = params.id as string;
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [vocab, setVocab] = useState<{ phrase: string, translation: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showVocab, setShowVocab] = useState(true);

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
          // Ignore
        }
      } catch (error) {
        toast.error("Không thể tải bài tập");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [scenarioId]);

  const toggleRecording = () => {
    if (!isRecording) {
      toast("Đang lắng nghe...", { icon: '🎙️' });
    } else {
      toast.success("Đã ghi âm!");
    }
    setIsRecording(!isRecording);
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-[#007bff]" size={40} /></div>;
  if (!scenario) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-bold">Bài học không tồn tại</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden font-sans">

      {/* LEFT: MAIN INTERACTION AREA */}
      <div className="flex-1 flex flex-col relative">

        {/* Header inside the workspace */}
        <header className="h-20 px-8 flex items-center justify-between bg-white border-b border-gray-100 z-10">
          <div className="flex items-center gap-4">
            <Link
              href={`/learner/topics/${scenario.topic_id}`}
              className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all font-bold"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-black text-xl text-gray-900">{scenario.title}</h1>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span className={`w-2 h-2 rounded-full ${scenario.difficulty_level === 'Basic' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                {scenario.difficulty_level}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowVocab(!showVocab)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${showVocab ? 'bg-blue-50 text-[#007bff] border-blue-100' : 'bg-white text-gray-500 border-gray-200'}`}>
              <Zap size={16} className="inline mr-1" /> Từ vựng
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Background Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

          {/* AI Avatar */}
          <div className="relative mb-12 z-10">
            <div
              onClick={toggleRecording}
              className={`
                        w-48 h-48 rounded-[48px] flex items-center justify-center shadow-2xl transition-all duration-500 cursor-pointer
                        ${isRecording
                  ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-red-200 scale-105'
                  : 'bg-white border-4 border-white shadow-blue-100 hover:scale-105'
                }
                    `}
            >
              {isRecording ? (
                <div className="flex items-center gap-1.5 h-16">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-2 bg-white rounded-full animate-wave delay-${i * 100}`} style={{ height: '40%' }}></div>
                  ))}
                </div>
              ) : (
                <Mic size={64} className="text-[#007bff]" />
              )}
            </div>

            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-white text-gray-400 border border-gray-100'
                }`}>
                {isRecording ? 'Listening...' : 'Tap Mic to Speak'}
              </span>
            </div>
          </div>

          {/* Prompt Box */}
          <div className="max-w-2xl w-full text-center z-10">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-6">
              {scenario.description || "Hãy bắt đầu bằng cách giới thiệu bản thân."}
            </h2>

            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400" /> Gợi ý câu trả lời
              </button>
              <button className="px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                <RefreshCw size={16} /> Thử câu khác
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: SIDEBAR */}
      <div className={`w-96 bg-white border-l border-gray-100 flex flex-col transition-all duration-300 shadow-xl z-20 ${showVocab ? 'mr-0' : '-mr-96'}`}>
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-black text-gray-900 flex items-center gap-2">
            <Zap size={20} className="text-[#007bff]" fill="currentColor" /> Từ vựng gợi ý
          </h3>
          <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wide">Key Vocabulary</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {vocab.length > 0 ? vocab.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-lg text-gray-900 group-hover:text-[#007bff] transition-colors">{item.phrase}</span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#007bff] group-hover:text-white transition-all">
                  <Volume2 size={16} />
                </div>
              </div>
              {item.translation && (
                <p className="text-sm text-gray-500 font-medium">{item.translation}</p>
              )}
            </div>
          )) : (
            <div className="text-center py-12">
              <p className="text-gray-400 font-medium text-sm">Chưa có từ vựng cho bài này.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Độ chính xác</span>
              <span className="text-sm font-black text-green-500">85%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[85%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}