import api from "@/lib/api";

export interface Scenario {
  scenario_id: number;
  title: string;
  description?: string;
  difficulty_level: string; // "Basic", "Intermediate", "Advanced"
  topic_id: number;
  image_url?: string;
  // Add other fields if needed based on backend model
}

export interface ScenarioCreate {
  title: string;
  description?: string;
  difficulty_level: string;
  topic_id: number;
  image_url?: string;
}

export const scenarioService = {
  getAll: async () => {
    const response = await api.get<Scenario[]>("/scenarios");
    return response.data;
  },

  getByTopicId: async (topicId: number | string) => {
    const response = await api.get<Scenario[]>(`/scenarios?topic_id=${topicId}`);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get<Scenario>(`/scenarios/${id}`);
    return response.data;
  },

  create: async (data: ScenarioCreate) => {
    const response = await api.post<Scenario>("/scenarios", data);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(`/scenarios/${id}`);
    return response.data;
  },

  update: async (id: number | string, data: ScenarioCreate) => {
    const response = await api.put<Scenario>(`/scenarios/${id}`, data);
    return response.data;
  },

  getVocab: async (id: number | string) => {
    const response = await api.get<{ vocabulary: string[] }>(`/scenarios/${id}/vocab`);
    return response.data;
  }
};