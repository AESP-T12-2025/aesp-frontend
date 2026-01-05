'use client';
import React from 'react';

import Link from 'next/link'; 

interface Props {
  scenario: any; 
}

const ScenarioCard: React.FC<Props> = ({ scenario }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', background: '#fff', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      
      <img 
        src={scenario.imageUrl || 'https://via.placeholder.com/300x180?text=Scenario'} 
        alt={scenario.title} 
        style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
      />
      
      <div style={{ padding: '1.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#007bff', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {scenario.difficulty || 'Mọi cấp độ'}
        </span>
        
        <h3 style={{ margin: '0.5rem 0', color: '#333' }}>{scenario.title}</h3>
        
        <p style={{ color: '#666', fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>
          {scenario.description}
        </p>
        
        
        <Link href={`/practice/${scenario.id}`} style={{ 
          display: 'inline-block', 
          marginTop: '1rem', 
          padding: '0.6rem 1.2rem', 
          background: '#007bff', 
          color: '#fff', 
          textDecoration: 'none', 
          borderRadius: '8px',
          fontWeight: '500'
        }}>
          Luyện nói ngay
        </Link>
      </div>
    </div>
  );
};

export default ScenarioCard;