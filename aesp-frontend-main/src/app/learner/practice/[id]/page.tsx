"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mic, Volume2, Award, Zap, MoreVertical, Settings, Sparkles, StopCircle, RefreshCw, CheckCircle } from 'lucide-react';
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
  const [session, setSession] = useState<any>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);

  const analyzeTranscript = async (text: string, duration: number = 0) => {
    if (!text) {
      toast("Bạn chưa nói gì cả!");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { practiceService } = await import('@/services/practiceService');
      // Pass duration to backend
      const res = await practiceService.analyzeSpeech(text, session?.session_id, duration);
      setFeedback(res);
      toast.dismiss();
      toast.success(`Hoàn thành! +${Math.ceil(duration / 2)} XP`);
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Lỗi kết nối AI");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Start session on load
    if (scenarioId) {
      import('@/services/practiceService').then(({ practiceService }) => {
        practiceService.startSession(scenarioId).then(res => setSession(res)).catch(console.error);
      });
    }
  }, [scenarioId]);


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
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Trình duyệt không hỗ trợ Web Speech API");
      return;
    }

    // Clear old state before starting
    setFeedback(null);
    setTranscript("");
    transcriptRef.current = "";

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true; // CHANGED TO TRUE FOR LONGER SPEECH
    recognition.interimResults = true;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingStartTime(Date.now());
      toast("Đang lắng nghe...", { icon: '🎙️' });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let fullText = "";
      for (let i = 0; i < event.results.length; i++) {
        fullText += event.results[i][0].transcript;
      }
      transcriptRef.current = fullText;
      setTranscript(fullText);
    };

    recognition.onend = () => {
      // If "continuous" is true, it might not stop automatically unless we call stop()
      // So we don't auto-analyze here for continuous mode usually, 
      // BUT if user clicked button to stop, stopListening calls analyzeTranscript manually.
      // If it stopped by itself (silence), we can update status.
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== 'no-speech') {
        toast.error(`Lỗi Mic: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      // Manual stop triggers analysis immediately
      if (transcriptRef.current) {
        const duration = recordingStartTime ? (Date.now() - recordingStartTime) / 1000 : 0;
        analyzeTranscript(transcriptRef.current, duration);
      }
    }
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

            {transcript && (
              <div className="mb-4 bg-white/50 p-4 rounded-xl backdrop-blur-sm border border-white/60">
                <p className="text-lg text-gray-700 italic">"{transcript}"</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-blue-100 animate-pulse">
                <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
                <p className="text-blue-600 font-bold">Đang chấm điểm...</p>
              </div>
            )}

            {feedback && !isAnalyzing && (
              <div className="mb-6 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 text-left">
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Grammar</p>
                    <p className="text-2xl font-black text-blue-600">{feedback.grammar_score}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Pronunciation</p>
                    <p className="text-2xl font-black text-green-600">{feedback.pronunciation_score}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Fluency</p>
                    <p className="text-2xl font-black text-purple-600">{feedback.fluency_score || 0}</p>
                  </div>
                </div>
                {feedback.better_version && (
                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                    <strong>Suggestion:</strong> {feedback.better_version}
                  </div>
                )}

                {/* NEW: Phonetic Analysis */}
                {feedback.phonetic_analysis && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">
                      <Volume2 size={16} /> Phân tích phát âm
                    </h4>
                    {feedback.phonetic_analysis.transcription && (
                      <div className="mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase">IPA Transcription:</span>
                        <p className="font-mono text-lg text-gray-800 tracking-wide bg-white px-2 py-1 rounded border border-gray-200 inline-block ml-2">
                          {feedback.phonetic_analysis.transcription}
                        </p>
                      </div>
                    )}

                    {feedback.phonetic_analysis.mispronounced_words?.length > 0 ? (
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Cần cải thiện:</span>
                        <div className="space-y-2">
                          {feedback.phonetic_analysis.mispronounced_words.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-red-100">
                              <div>
                                <span className="font-bold text-red-600 mr-2">{item.word}</span>
                                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">{item.correct_ipa}</span>
                              </div>
                              <span className="text-xs font-medium text-gray-500">{item.issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle size={14} /> Phát âm rất tốt! Không có lỗi đáng kể.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center gap-4 flex-wrap">
              {!feedback ? (
                <>
                  <button
                    onClick={() => toast("Hãy thử nói: 'Hello, I would like to introduce myself...'", { icon: '💡' })}
                    className="px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
                  >
                    <Sparkles size={16} className="text-yellow-400" /> Gợi ý câu trả lời
                  </button>
                  <button
                    onClick={() => { setTranscript(""); setFeedback(null); }}
                    className="px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={16} /> Làm mới
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setTranscript(""); setFeedback(null); }}
                    className="px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={16} /> Luyện tập lại
                  </button>
                  <Link
                    href={`/learner/topics/${scenario.topic_id}`}
                    className="px-8 py-3 bg-[#007bff] text-white shadow-lg shadow-blue-200 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center gap-2"
                  >
                    <CheckCircle size={18} /> Hoàn thành bài học
                  </Link>
                </>
              )}
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