import ScenarioCard from '../components/ScenarioCard';
import { mockScenarios } from '../data/mockScenarios';

const ScenarioListPage: React.FC = () => {
  return (
    <div className="container" style={{ padding: '2rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#333' }}>Danh sách Kịch bản Luyện tập</h2>
        <p style={{ color: '#666' }}>Chọn một tình huống thực tế để bắt đầu rèn luyện kỹ năng giao tiếp AI.</p>
      </header>

      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '2rem' 
      }}>
        {mockScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </div>
  );
};

export default ScenarioListPage;