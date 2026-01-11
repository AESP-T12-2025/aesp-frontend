import api from "@/lib/api";

export interface Topic {
    topic_id: number;
    name: string;
    description?: string;
    image_url?: string;
    industry?: string; // NEW
    // category_id?: number; 
}

export const topicService = {
    getAll: async (industry?: string) => {
        const url = industry && industry !== 'ALL' ? `/topics?industry=${industry}` : '/topics';
        const response = await api.get<Topic[]>(url);
        return response.data;
    },

    getById: async (id: number | string) => {
        const response = await api.get<Topic>(`/topics/${id}`);
        return response.data;
    },

    create: async (data: { name: string; description?: string; image_url?: string; category_id: number }) => {
        const response = await api.post<Topic>("/topics", data);
        return response.data;
    },

    update: async (id: number | string, data: { name?: string; description?: string; image_url?: string; category_id?: number }) => {
        const response = await api.put<Topic>(`/topics/${id}`, data);
        return response.data;
    },

    delete: async (id: number | string) => {
        const response = await api.delete(`/topics/${id}`);
        return response.data;
    },
};
