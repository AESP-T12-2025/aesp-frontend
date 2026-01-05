'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { scenarioService } from '../../../scenarioApi/scenarioService';

export default function PracticeRoom() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id; 
  
  const [scenario, setScenario] = useState<any>(null);
  const [vocab, setVocab] = useState<any[]>([]); // Thêm state lưu từ vựng
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchAllData = async () => {
        try {
          setLoading(true);
          // Gọi song song: Chi tiết kịch bản VÀ Từ vựng gợi ý
          const [detailData, vocabData] = await Promise.all([
            scenarioService.getScenarioDetail(id as string),
            scenarioService.getScenarioVocab(id as string)
          ]);
          
          setScenario(detailData);
          setVocab(vocabData);
        } catch (error) {
          console.error("Lỗi lấy dữ liệu:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    }
  }, [id]);

  // Hàm xử lý khi nhấn "Nhấn để bắt đầu nói"
  const handleStartPractice = async () => {
    try {
      // Gọi API POST /speaking-sessions
      await scenarioService.startSpeakingSession(id as string);
      alert("Đã bắt đầu phiên luyện tập! Mời bạn nói.");
    } catch (error) {
      alert("Lỗi: Bạn cần đăng nhập để thực hiện tính năng này!");
    }
  };

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Đang chuẩn bị phòng tập...</div>;
  if (!scenario) return <div style={{ padding: '5rem', textAlign: 'center' }}>Không tìm thấy kịch bản!</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '1rem', cursor: 'pointer', border: 'none', background: 'none', color: '#007bff' }}>
        ← Quay lại danh sách
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <main>
          <h1 style={{ fontSize: '1.8rem', color: '#333' }}>{scenario.title}</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{scenario.description}</p>

          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '15px', border: '1px solid #eee' }}>
            <h3 style={{ marginBottom: '1rem' }}>Hội thoại mẫu</h3>
            {scenario.dialogue_steps?.map((step: any, index: number) => (
              <div key={index} style={{ 
                marginBottom: '1rem', padding: '10px', borderRadius: '8px',
                background: step.role === 'AI' ? '#e7f3ff' : '#fff',
                border: '1px solid #eef'
              }}>
                <strong style={{ color: step.role === 'AI' ? '#007bff' : '#28a745' }}>{step.role}: </strong>
                <span>{step.content}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              onClick={handleStartPractice} // Gắn hàm xử lý POST
              style={{
                padding: '1rem 3rem', fontSize: '1.2rem', backgroundColor: '#28a745',
                color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
              }}
            >
              🎙️ Nhấn để bắt đầu nói
            </button>
          </div>
        </main>

        <aside style={{ background: '#fff', padding: '1.5rem', borderRadius: '15px', border: '1px solid #ddd' }}>
          <h3>Từ vựng cần nhớ</h3>
          <ul style={{ paddingLeft: '0', marginTop: '1rem', color: '#444', listStyle: 'none' }}>
            {/* Render danh sách từ vựng thật từ API */}
            {vocab.length > 0 ? vocab.map((item, index) => (
              <li key={index} style={{ marginBottom: '10px', padding: '8px', borderBottom: '1px solid #eee' }}>
                <b style={{ color: '#007bff' }}>{item.word}</b>: {item.meaning}
              </li>
            )) : <li>Chưa có từ vựng gợi ý.</li>}
          </ul>
        </aside>
      </div>
    </div>
  );
}