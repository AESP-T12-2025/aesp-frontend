import api from '@/lib/api';

export const vocabService = {
    save: async (word) => {
        const res = await api.post('/vocab/save', word); // word object {word, meaning, example}
        return res.data;
    },
    list: async () => {
        const res = await api.get('/vocab/list');
        return res.data;
    }
};
