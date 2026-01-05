import api from '@/lib/api';

export interface Vocab {
  word: string;
  meaning: string;
}

export const practiceService = {
  getVocab: async (scenarioId: string): Promise<Vocab[]> => {
    const res = await api.get(`/scenarios/${scenarioId}/vocab`);
    return res.data;
  },

  getScenarioDetail: async (scenarioId: string | number) => {
    const res = await api.get(`/scenarios/${scenarioId}`);
    return res.data;
  },

  startSession: async (scenarioId: string) => {
    const res = await api.post('/speaking-sessions', { 
      scenario_id: Number(scenarioId) 
    });
    return res.data;
  },

  
  submitAudio: async (sessionId: number, audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    const res = await api.post(`/speaking-sessions/${sessionId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  getAllScenarios: async () => {
    const res = await api.get('/scenarios');
    return res.data;
  },
};