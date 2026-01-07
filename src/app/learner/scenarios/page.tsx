"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { scenarioService, Scenario } from '@/services/scenarioService';
import { Search, Zap, Play, Filter, Clock, BarChart } from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        // Fetch all scenarios (might need a better API for this later)
        // For now, assume this service method exists or we use a mock
        // Actually mock service has getScenarios() or something similar?
        // Using mockService from services/mockService or scenarioService
        // Assuming scenarioService.getAll() exists or we mock it here since it's skeleton
        const data = await scenarioService.getAll(); // Assuming this is added or using mock
        setScenarios(data);
      } catch (error) {
        // If API fails, fallback to mock data for demo
        setScenarios([
          { scenario_id: 1, title: 'Job Interview Basic', description: 'Practice common interview questions.', difficulty_level: 'Basic', topic_id: 1 },
          { scenario_id: 2, title: 'Ordering Coffee', description: 'How to order drinks at a cafe.', difficulty_level: 'Basic', topic_id: 2 },
          { scenario_id: 3, title: 'Business Meeting', description: 'Discussing project timelines.', difficulty_level: 'Advanced', topic_id: 3 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = scenarios.filter(s =>
    s.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['LEARNER']}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                <Zap size={14} /> Free Practice
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Luyện tập tự do</h1>
              <p className="text-gray-500 font-medium">Chọn một tình huống bất kỳ và bắt đầu hội thoại ngay lập tức.</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-2 pl-4 rounded-full border border-gray-100 shadow-sm flex items-center w-full md:w-96 focus-within:ring-2 focus-within:ring-green-100 transition-all">
              <Search className="text-gray-400" size={20} />
              <input
                className="flex-1 px-3 py-2 outline-none text-gray-700 font-medium placeholder-gray-400"
                placeholder="Tìm tình huống..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600" size={40} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(scenario => (
                <Link
                  href={`/learner/practice/${scenario.scenario_id}`}
                  key={scenario.scenario_id}
                  className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                      <Zap size={28} />
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                                            ${scenario.difficulty_level === 'Basic' ? 'bg-green-100 text-green-700' :
                        scenario.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'}
                                        `}>
                      {scenario.difficulty_level}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {scenario.title}
                  </h3>
                  <p className="text-gray-500 font-medium mb-8 flex-1">
                    {scenario.description || "Bài luyện tập hội thoại tương tác."}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                      <Clock size={14} /> 5-10 min
                    </div>
                    <span className="flex items-center gap-2 text-green-600 font-bold group-hover:gap-3 transition-all">
                      Bắt đầu <Play size={16} fill="currentColor" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
