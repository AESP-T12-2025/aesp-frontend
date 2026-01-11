import api from '@/lib/api';

export const peerService = {
    joinQueue: async (topicId?) => {
        const res = await api.post('/peer/join-queue', null, { params: { topic_id: topicId } });
        return res.data;
    },
    checkStatus: async (sessionId) => {
        const res = await api.get(`/peer/status/${sessionId}`);
        return res.data;
    }
};
