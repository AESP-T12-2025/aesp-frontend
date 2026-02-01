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

  // FIXED: Use Text Analysis (Web Speech API result) instead of Audio Upload
  analyzeSpeech: async (text: string, sessionId?: number, duration: number = 0) => {
    const res = await api.post('/ai/analyze', {
      text,
      session_id: sessionId,
      duration_seconds: duration
    });
    return res.data;
  },

  getSuggestedResponse: async (context: string) => {
    const res = await api.post('/ai/suggest-reply', { context });
    return res.data; // { suggestion: "..." }
  },

  getAllScenarios: async () => {
    const res = await api.get('/scenarios');
    return res.data;
  },
};