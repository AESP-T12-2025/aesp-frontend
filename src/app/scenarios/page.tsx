'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ScenarioCard from '../../components/ScenarioCard'; 
import { scenarioService } from '../../scenarioApi/scenarioService';

export default function ScenarioListPage() {
  const searchParams = useSearchParams();
  
  const topicId = searchParams?.get('topic_id'); 
  
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await scenarioService.getScenarios(topicId);
        setScenarios(data);
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [topicId]);

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Đang tải kịch bản...</div>;

  return (
    <div style={{ padding: '2rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Danh sách Kịch bản</h2>
      
      {scenarios.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Chưa có kịch bản nào</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {scenarios.map((scenario: any) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      )}
    </div>
  );
}