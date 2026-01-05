"use client"; 

import { useEffect, useState, useRef } from 'react'; 
import { useParams } from 'next/navigation'; 
import { practiceService, Vocab } from '@/services/practiceService';

const PracticePage = () => {
  const params = useParams(); 
  const id = params.id as string; 

  const [vocabs, setVocabs] = useState<Vocab[]>([]); 
  const [scriptDetail, setScriptDetail] = useState<any>(null); 
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [, setCurrentSessionId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          const [vocabData, detailData] = await Promise.all([
            practiceService.getVocab(id),
            practiceService.getScenarioDetail(id) 
          ]);
          setVocabs(vocabData);
          setScriptDetail(detailData);
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();

    
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [id]);

  const handleStartRecording = async () => {
    try {
      const session = await practiceService.startSession(id!);
      setCurrentSessionId(session.id);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
       
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); 
        
        if (session.id) {
          try {
            await practiceService.submitAudio(session.id, audioBlob);
            alert("Đã gửi bài nói thành công! AI đang chấm điểm...");
          } catch (error) {
            alert("Lỗi khi gửi file âm thanh.");
          }
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Lỗi: " + err + ". (Kiểm tra Micro hoặc Đăng nhập)");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
     
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Đang tải dữ liệu luyện tập...</div>;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: '20px', padding: '20px' }}>
     
      <div style={{ flex: '0 0 400px', backgroundColor: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
        <h1 style={{ color: '#007bff', fontSize: '24px' }}>Luyện tập Speaking</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>Dùng các từ vựng này để được điểm cao nhé.</p>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>Từ vựng quan trọng</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {vocabs.map((v, i) => (
              <li key={i} style={{ margin: '10px 0' }}>
                <b style={{ color: '#d9534f' }}>{v.word}</b>: {v.meaning}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#333' }}>{scriptDetail?.title}</h2>
            <div style={{ fontSize: '22px', fontStyle: 'italic', color: '#444', backgroundColor: '#fff9c4', padding: '20px', borderRadius: '10px' }}>
                "{scriptDetail?.script_content || "Đang tải nội dung kịch bản..."}"
            </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>
            {isRecording ? "🔴" : "🎙️"}
          </div>
          <h3>{isRecording ? "Hệ thống đang nghe..." : "Nhấn vào micro để bắt đầu nói"}</h3>
          
          <button 
            onClick={isRecording ? handleStopRecording : handleStartRecording} 
            style={{ 
                padding: '15px 40px', borderRadius: '50px', border: 'none', 
                backgroundColor: isRecording ? '#d9534f' : '#007bff', color: 'white', 
                fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', fontSize: '18px'
            }}
          >
            {isRecording ? "Dừng và Gửi bài" : "Bắt đầu luyện tập"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;