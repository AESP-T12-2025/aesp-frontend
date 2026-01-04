import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { scenarioService } from '../scenarioApi/scenarioService';

// Định nghĩa kiểu dữ liệu để code không bị lỗi đỏ
interface Topic {
  id: number;
  name: string;
  image: string; // Icon emoji
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  topics: Topic[]; // Chúng ta sẽ tự gộp topics vào đây
}

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // 1. Lấy đồng thời cả danh mục và chủ đề từ API
        const [catData, topicData] = await Promise.all([
          scenarioService.getCategories(),
          scenarioService.getTopics()
        ]);

        // 2. Gộp topics vào đúng category của nó để giữ nguyên cấu trúc map cũ
        const mergedData = catData.map((cat: any) => ({
          ...cat,
          title: cat.name, // Đồng bộ tên biến nếu API trả về 'name' thay vì 'title'
          topics: topicData.filter((t: Topic) => t.category_id === cat.id)
        }));

        setCategories(mergedData);
      } catch (err) {
        console.error("Lỗi khi kết nối API Homepage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) return <div style={{ padding: '5rem' }}>Đang tải chủ đề luyện tập...</div>;

  return (
    <div style={{ 
      padding: '4rem 5%', 
      maxWidth: '1200px', 
      margin: '0 auto',   
      textAlign: 'center' 
    }}>
      <h2 style={{ marginBottom: '3rem', fontSize: '2.2rem', color: '#1a1a1a' }}>
        Chọn chủ đề bạn muốn luyện tập
      </h2>
      
      {/* categories bây giờ là dữ liệu lấy từ API */}
      {categories.map(cat => (
        <div key={cat.id} style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '4px', height: '24px', backgroundColor: '#007bff', marginRight: '10px', borderRadius: '4px' }}></div>
            <h3 style={{ fontSize: '1.6rem', color: '#333', margin: 0 }}>
              {cat.name}
            </h3>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '30px',
            justifyContent: 'center' 
          }}>
            {cat.topics.map(topic => (
              <div key={topic.id} className="topic-card">
                <div style={{ fontSize: '4.5rem', marginBottom: '15px', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))' }}>
                  {topic.image || '📚'} {/* Hiển thị icon mặc định nếu API chưa có ảnh */}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#2c3e50', marginBottom: '15px' }}>
                  {topic.name}
                </div>

                <Link 
                  to={`/practice/${topic.id}`} 
                  className="study-button"
                  style={{
                    display: 'inline-block',
                    textDecoration: 'none',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }}
                >
                  Luyện nói ngay
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;