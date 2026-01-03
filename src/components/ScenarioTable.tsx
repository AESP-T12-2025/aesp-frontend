import React from 'react';
import type { Scenario } from '../types/scenario';

interface Props {
  data: Scenario[];
  onDelete: (id: number) => void;
}

const ScenarioTable: React.FC<Props> = ({ data, onDelete }) => {
  return (
    <div className="table-wrapper" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <table className="scenario-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Tiêu đề</th>
            <th style={{ padding: '12px' }}>Độ khó</th>
            <th style={{ padding: '12px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{item.id}</td>
              <td style={{ padding: '12px' }}>
                <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{item.description}</div>
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  backgroundColor: item.difficulty === 'Dễ' ? '#e6f4ea' : '#feefe3',
                  color: item.difficulty === 'Dễ' ? '#1e8e3e' : '#d93025'
                }}>
                  {item.difficulty}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <button 
                  onClick={() => onDelete(item.id)}
                  style={{ color: '#d93025', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScenarioTable;