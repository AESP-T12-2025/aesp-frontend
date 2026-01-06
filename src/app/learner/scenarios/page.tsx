'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
// Import service thật
import { scenarioService, Scenario } from '@/services/scenarioService';

export default function ScenarioListPage() {
  const searchParams = useSearchParams();
  const topicId = searchParams?.get('topic_id');

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // GỌI API THẬT
        let data;
        if (topicId) {
          data = await scenarioService.getByTopicId(topicId);
        } else {
          data = await scenarioService.getAll();
        }
        setScenarios(data);
      } catch (err: any) {
        console.error("Lỗi kết nối API:", err);
        setError("Không thể kết nối với máy chủ. Vui lòng kiểm tra Backend.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [topicId]);

  if (loading) return <div className="p-20 text-center">Đang tải dữ liệu thật từ máy chủ...</div>;

  if (error) return (
    <div className="p-20 text-center text-red-500">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 underline">Thử lại</button>
    </div>
  );

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Danh sách Kịch bản (Dữ liệu thật)</h2>

      {scenarios.length === 0 ? (
        <p className="text-center text-gray-500">Backend chưa có dữ liệu kịch bản nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <div key={scenario.scenario_id} className="border p-6 rounded-xl shadow-sm bg-white">
              <h3 className="font-bold text-lg mb-2">{scenario.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
              <Link
                href={`/learner/practice/${scenario.scenario_id}`}
                className="block text-center bg-blue-600 text-white py-2 rounded-lg header-btn hover:bg-blue-700 transition"
              >
                Luyện tập
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
