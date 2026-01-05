"use client";

import { useState, useEffect } from "react";
import { Plus, MessageSquare, Loader2, RefreshCw } from "lucide-react";
import api, { Scenario } from "@/lib/api";

export default function ScenariosPage() {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchScenarios = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/scenarios");
            setScenarios(response.data);
        } catch (err) {
            setError("Failed to fetch scenarios");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScenarios();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Scenarios Management</h2>
                <div className="flex space-x-2">
                    <button onClick={fetchScenarios} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        New Scenario
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {scenarios.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No scenarios found. Create one!</div>
                        ) : (
                            scenarios.map((scenario) => (
                                <div key={scenario.scenario_id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                                            <MessageSquare className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-md font-bold text-gray-900">{scenario.title}</h3>
                                            <p className="text-sm text-gray-500">Topic ID: {scenario.topic_id} • Difficulty: {scenario.difficulty_level}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium border border-indigo-200 px-3 py-1 rounded">Edit</button>
                                        <button className="text-sm text-red-600 hover:text-red-800 font-medium border border-red-200 px-3 py-1 rounded">Delete</button>
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
