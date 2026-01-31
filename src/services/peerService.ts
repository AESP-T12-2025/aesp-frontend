import api from '@/lib/api';

export const peerService = {
    joinQueue: async (topicId?: number) => {
        const res = await api.post('/peer/join-queue', {}, { params: { topic_id: topicId } });
        return res.data;
    },
    checkStatus: async (sessionId: number) => {
        const res = await api.get(`/peer/status/${sessionId}`);
        return res.data;
    },
    endSession: async (sessionId: number) => {
        const res = await api.post(`/peer/sessions/${sessionId}/end`);
        return res.data;
    }
};
