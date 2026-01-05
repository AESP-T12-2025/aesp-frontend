import api from '../services/api';

export const scenarioService = {

  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },

  
  getTopics: async () => {
    const res = await api.get('/topics');
    return res.data;
  },


  getScenarios: async (topicId?: string | null) => {
    const url = topicId ? `/scenarios?topic_id=${topicId}` : '/scenarios';
    const res = await api.get(url);
    return res.data;
  },

  
  getScenarioDetail: async (id: string | number) => {
    const res = await api.get(`/scenarios/${id}`);
    return res.data; 
  },

  getScenarioVocab: async (id: string | number) => {
    const res = await api.get(`/scenarios/${id}/vocab`);
    return res.data;
  },

  startSpeakingSession: async (scenarioId: string | number) => {
    // Lưu ý: api.post này sẽ tự đính kèm Token nếu bạn đã setup interceptor cho axios
    const res = await api.post('/speaking-sessions', { 
      scenario_id: scenarioId 
    });
    return res.data;
  }
};
