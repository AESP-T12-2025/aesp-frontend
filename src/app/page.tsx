'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { scenarioService } from '../scenarioApi/scenarioService';


interface Topic {
  id: number;
  name: string;
  image: string; 
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  topics: Topic[]; 
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        
        const [catData, topicData] = await Promise.all([
          scenarioService.getCategories(),
          scenarioService.getTopics()
        ]);

       
        const mergedData = catData.map((cat: any) => ({
          ...cat,
          topics: topicData.filter((t: Topic) => t.category_id === cat.id)
        }));

        setCategories(mergedData);
      } catch (err) {
        console.error("Lỗi khi kết nối API:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Đang tải chủ đề...</div>;

  return (
    <div style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>
        Chọn chủ đề bạn muốn luyện tập
      </h2>
      
      {categories.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Hiện chưa có dữ liệu trên hệ thống.</p>
      ) : (
        categories.map(cat => (
          <div key={cat.id} style={{ marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #007bff', paddingLeft: '15px' }}>
              {cat.name}
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '25px' 
            }}>
              {cat.topics.map(topic => (
                <div key={topic.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '10px' }}>{topic.image || '📚'}</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>{topic.name}</div>
                  <Link 
                    href={`/practice/${topic.id}`} 
                    style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}
                  >
                    Luyện nói ngay
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

