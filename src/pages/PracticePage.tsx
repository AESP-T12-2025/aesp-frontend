import { useParams } from 'react-router-dom';
import { mockScenarios } from '../data/mockScenarios';


const PracticePage = () => {
  const { id } = useParams(); // Lấy số ID từ URL (ví dụ: 1)
  const scenario = mockScenarios.find(s => s.id === Number(id));

  if (!scenario) {
    return <div style={{ padding: '20px' }}>⚠️ Không tìm thấy kịch bản luyện tập!</div>;
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: '20px', padding: '20px' }}>
      
      {/* CỘT TRÁI: THÔNG TIN GỢI Ý */}
      <div style={{ flex: '0 0 400px', backgroundColor: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
        <h1 style={{ color: '#007bff', fontSize: '24px' }}>{scenario.title}</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>{scenario.description}</p>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>Từ vựng quan trọng</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {scenario.vocabulary.map((v, i) => (
              <li key={i} style={{ margin: '10px 0' }}>
                <b style={{ color: '#d9534f' }}>{v.word}</b>: {v.meaning}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: '#eef6ff', padding: '15px', borderRadius: '10px' }}>
          <h3 style={{ fontSize: '18px', color: '#0056b3' }}>Mẫu câu gợi ý</h3>
          {scenario.suggestions.map((s, i) => (
            <p key={i} style={{ fontStyle: 'italic', marginBottom: '8px' }}>"{s}"</p>
          ))}
        </div>
      </div>

      {/* CỘT PHẢI: KHÔNG GIAN LUYỆN TẬP VỚI AI */}
      <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎙️</div>
          <h3>Nhấn vào micro để bắt đầu nói</h3>
          <p style={{ color: '#999' }}>AI đang lắng nghe bạn...</p>
          <button style={{ padding: '15px 30px', borderRadius: '50px', border: 'none', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            Bắt đầu luyện tập
          </button>
        </div>
      </div>

    </div>
  );
};

export default PracticePage;