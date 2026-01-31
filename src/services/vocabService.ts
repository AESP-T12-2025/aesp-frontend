import api from '@/lib/api';

export interface SavedVocab {
    word: string;
    meaning: string;
    example?: string;
}

export interface MentorVocabSuggestion {
    learner_id: number;
    word: string;
    meaning: string;
    example?: string;
    tips?: string;
}

export const vocabService = {
    /**
     * Save a new vocabulary word
     */
    save: async (word: SavedVocab) => {
        const res = await api.post('/vocab/save', word);
        return res.data;
    },

    /**
     * List all saved vocabulary
     */
    list: async (): Promise<SavedVocab[]> => {
        const res = await api.get('/vocab/list');
        return res.data;
    },

    /**
     * Delete a saved vocabulary word (Issue #36)
     */
    delete: async (vocabId: number) => {
        const res = await api.delete(`/vocab/${vocabId}`);
        return res.data;
    },

    /**
     * Get random vocabulary words for flashcard review (Issue #36)
     */
    getReviewWords: async (count: number = 10) => {
        const res = await api.get('/vocab/review', {
            params: { count }
        });
        return res.data;
    },

    /**
     * Mentor suggests vocabulary to learner (Issue #36)
     */
    mentorSuggest: async (suggestion: MentorVocabSuggestion) => {
        const res = await api.post('/vocab/mentor-suggest', suggestion);
        return res.data;
    }
};
