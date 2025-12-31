import { MOCK_CATEGORIES } from '../data/mockData';


const Home = () => {
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
      
      {MOCK_CATEGORIES.map(cat => (
        <div key={cat.id} style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '4px', height: '24px', backgroundColor: '#007bff', marginRight: '10px', borderRadius: '4px' }}></div>
            <h3 style={{ fontSize: '1.6rem', color: '#333', margin: 0 }}>
              {cat.title}
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
                  {topic.image}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#2c3e50' }}>
                  {topic.name}
                </div>
                <button className="study-button">Luyện nói ngay</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;