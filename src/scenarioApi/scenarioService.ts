
import api from '../services/api';

export const scenarioService = {
  
  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },

 
  getTopics: async (categoryId?: number) => {
    const url = categoryId ? `/topics?category_id=${categoryId}` : '/topics';
    const res = await api.get(url);
    return res.data;
  },

  
  getScenarioDetail: async (id: string) => {
    const res = await api.get(`/scenarios/${id}`);
    return res.data;
  }
};