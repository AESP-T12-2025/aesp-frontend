import React from 'react';
import { Link } from 'react-router-dom';
import type { Scenario } from '../types/scenario';

interface Props {
  scenario: Scenario;
}

const ScenarioCard: React.FC<Props> = ({ scenario }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', background: '#fff', marginBottom: '20px' }}>
      <img src={scenario.imageUrl} alt={scenario.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
      <div style={{ padding: '1.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#007bff', fontWeight: 'bold' }}>{scenario.difficulty}</span>
        <h3 style={{ margin: '0.5rem 0' }}>{scenario.title}</h3>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>{scenario.description}</p>
        <Link to={`/practice/${scenario.id}`} style={{ 
          display: 'inline-block', marginTop: '1rem', padding: '0.6rem 1.2rem', 
          background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '8px' 
        }}>
          Luyện nói ngay
        </Link>
      </div>
    </div>
  );
};

export default ScenarioCard;