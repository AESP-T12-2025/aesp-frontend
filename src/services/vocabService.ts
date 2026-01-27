import api from '@/lib/api';

export interface SavedVocab {
    word: string;
    meaning: string;
    example?: string;
}

export const vocabService = {
    save: async (word: SavedVocab) => {
        const res = await api.post('/vocab/save', word);
        return res.data;
    },
    list: async (): Promise<SavedVocab[]> => {
        const res = await api.get('/vocab/list');
        return res.data;
    }
};
