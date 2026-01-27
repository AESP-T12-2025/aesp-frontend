"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, MessageSquare, Loader2, RefreshCw, Trash2, Edit } from "lucide-react";
import { scenarioService, Scenario } from "@/services/scenarioService";
import Link from 'next/link';
import toast from "react-hot-toast";

export default function ScenariosPage() {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(false);

    const fetchScenarios = async () => {
        setLoading(true);
        try {
            const data = await scenarioService.getAll();
            if (isMounted.current) setScenarios(data);
        } catch (err) {
            console.error(err);
            if (isMounted.current) toast.error("Không thể tải danh sách kịch bản");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchScenarios();
        return () => { isMounted.current = false; };
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa kịch bản này không?")) {
            try {
                await scenarioService.delete(id);
                toast.success("Xóa kịch bản thành công");
                fetchScenarios();
            } catch (error) {
                console.error(error);
                toast.error("Xóa thất bại");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-800">Quản Lý Kịch Bản (Scenarios)</h2>
                    <p className="text-gray-500 text-sm">Danh sách các bài học hội thoại</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={fetchScenarios} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50 flex items-center font-bold">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </button>
                    <Link href="/admin/scenarios/new" className="bg-[#007bff] text-white px-4 py-2 rounded-xl hover:bg-blue-600 flex items-center font-bold shadow-lg shadow-blue-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm Kịch bản
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#007bff]" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {scenarios.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 font-medium">Chưa có kịch bản nào. Hãy tạo mới!</div>
                        ) : (
                            scenarios.map((scenario) => (
                                <div key={scenario.scenario_id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center">
                                        <div className="bg-blue-50 p-3 rounded-lg mr-4 text-[#007bff]">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{scenario.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">ID: {scenario.scenario_id}</span>
                                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-600">Topic: {scenario.topic_id}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${scenario.difficulty_level === 'Basic' ? 'bg-green-100 text-green-600' :
                                                    scenario.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                                                        'bg-red-100 text-red-600'
                                                    }`}>
                                                    {scenario.difficulty_level}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/scenarios/${scenario.scenario_id}/edit`}
                                            className="p-2 text-gray-400 hover:text-[#007bff] hover:bg-blue-50 rounded-lg transition"
                                            title="Sửa"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(scenario.scenario_id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Xóa"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
