import api from '@/lib/api'; //

export const scenarioService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },


  getTopics: async (categoryId?: string) => {
    const response = await api.get('/topics', {
      params: { category_id: categoryId }
    });
    return response.data;
  },

  getScenarios: async (topicId?: string) => {
    const response = await api.get('/scenarios', {
      params: { topic_id: topicId }
    });
    return response.data;
  },

  getScenarioDetail: async (id: string) => {
    const response = await api.get(`/scenarios/${id}`);
    return response.data;
  }
};