"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Loader2, RefreshCw } from "lucide-react";
import api, { Topic } from "@/lib/api";

export default function TopicsPage() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTopics = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/topics");
            setTopics(response.data);
        } catch (err) {
            setError("Failed to fetch topics");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Topics Management</h2>
                <div className="flex space-x-2">
                    <button onClick={fetchTopics} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        New Topic
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.length === 0 ? (
                        <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded shadow">No topics found. Create one!</div>
                    ) : (
                        topics.map((topic) => (
                            <div key={topic.topic_id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                                <div className="h-40 bg-gray-200 flex items-center justify-center">
                                    {topic.image_url ? (
                                        <img src={topic.image_url} alt={topic.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-900">{topic.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{topic.description || "No description provided."}</p>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                                        <button className="text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
